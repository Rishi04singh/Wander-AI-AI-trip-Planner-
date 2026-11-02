import { NextRequest, NextResponse } from "next/server";
import { 
    sanitizePlaceQuery, 
    getLandmarkImage, 
    resolveTravelImage, 
    getHotelImage 
} from "@/lib/travelImages";

interface PlacesRequestBody {
    textQuery: string;
    isHotel?: boolean;
    category?: string;
    destination?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    radius?: number;
    type?: string;
    rankBy?: string;
    pageToken?: string;
}

const STOP_WORDS = new Set([
    'the', 'and', 'for', 'near', 'with', 'from', 'hotel', 'resort', 'stay', 'palace',
    'morning', 'evening', 'stroll', 'walk', 'visit', 'explore', 'tour', 'trip', 'in', 'at', 'of', 'to'
]);

function isWikiResultRelevant(query: string, title: string): boolean {
    if (!query || !title) return false;
    const qWords = query.toLowerCase().match(/[a-z]{3,}/g) || [];
    const cleanQWords = qWords.filter(w => !STOP_WORDS.has(w));
    if (cleanQWords.length === 0) return true;
    const tLower = title.toLowerCase();

    // Check if any significant query term is present in Wikipedia title
    return cleanQWords.some(qw => tLower.includes(qw));
}

async function fetchVerifiedWikipediaImage(query: string): Promise<string | null> {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&prop=pageimages&pithumbsize=1000&format=json&gsrlimit=5`;
        const res = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'WanderAITravelApp/1.0 (support@wandertrip.com)'
            },
            next: { revalidate: 86400 }
        });
        if (!res.ok) return null;
        const json = await res.json();
        const pages = json.query?.pages;
        if (!pages) return null;

        // Iterate through top 5 results to pick the first relevant thumbnail
        for (const pageId of Object.keys(pages)) {
            const page = pages[pageId];
            const title = page?.title || "";
            const thumbnail = page?.thumbnail?.source;
            if (thumbnail && isWikiResultRelevant(query, title)) {
                return thumbnail;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}

/**
 * Resolves the most accurate photo for a place query
 */
async function resolveAccuratePhoto(
    rawQuery: string, 
    options?: { isHotel?: boolean; category?: string; destination?: string }
): Promise<string> {
    const { cleanName, locationHint, isHotel: detectedHotel } = sanitizePlaceQuery(rawQuery);
    const isHotel = Boolean(options?.isHotel || detectedHotel);

    // 1. If it's a hotel, return authentic destination-tailored hotel photography
    if (isHotel) {
        return getHotelImage(`${rawQuery} ${options?.destination || ''}`);
    }

    // 2. Direct Iconic Landmark match (Pangong, Hadimba, Baga Beach, Hawa Mahal, etc.)
    const landmarkImg = getLandmarkImage(cleanName, `${locationHint} ${options?.destination || ''}`);
    if (landmarkImg) {
        return landmarkImg;
    }

    // 3. Search Wikipedia with clean query & verify relevancy
    const searchTarget = `${cleanName} ${locationHint || options?.destination || ''}`.trim();
    if (searchTarget.length > 2) {
        const wikiImg = await fetchVerifiedWikipediaImage(searchTarget);
        if (wikiImg) {
            return wikiImg;
        }
    }

    // 4. Fallback to destination & category-aware travel photography
    return resolveTravelImage(rawQuery, options);
}

export async function POST(req: NextRequest) {
    const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
    const API_KEY = process.env.GOOGLE_PLACE_API_KEY;
    
    let textQuery = "";
    let isHotel = false;
    let category = "";
    let destination = "";

    try {
        const body: PlacesRequestBody = await req.json();
        textQuery = body.textQuery || "";
        isHotel = Boolean(body.isHotel);
        category = body.category || "";
        destination = body.destination || "";
    } catch (e) {
        return NextResponse.json({ error: "Invalid request body", places: [] }, { status: 200 });
    }

    // Helper to build verified response
    const buildFallbackResponse = async () => {
        const photoUrl = await resolveAccuratePhoto(textQuery, { isHotel, category, destination });
        return NextResponse.json({
            places: [
                {
                    displayName: { text: textQuery },
                    photoUrl
                }
            ]
        });
    };

    if (!API_KEY) {
        return await buildFallbackResponse();
    }
    
    try {
        const requestBody = { textQuery };

        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY,
                'X-Goog-FieldMask': 'places(id,name,formattedAddress,photos,rating,displayName)'
            },
            body: JSON.stringify(requestBody)
        });

        let data: any;
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse Google API response as JSON:", text);
            return await buildFallbackResponse();
        }

        if (!response.ok || !data.places || data.places.length === 0) {
            return await buildFallbackResponse();
        }

        const place = data.places[0];
        if (place.photos && place.photos.length > 0) {
            const photoName = place.photos[0].name;
            const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxHeightPx=1000&maxWidthPx=1000`;
            place.photoUrl = photoUrl;
            return NextResponse.json(data);
        } else {
            place.photoUrl = await resolveAccuratePhoto(textQuery, { isHotel, category, destination });
            return NextResponse.json(data);
        }
    } catch (error: any) {
        console.error("Internal Server Error in google-place-details route:", error);
        return await buildFallbackResponse();
    }
}
