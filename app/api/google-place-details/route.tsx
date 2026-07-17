import { NextRequest, NextResponse } from "next/server";

interface PlacesRequestBody {
    textQuery: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    radius?: number;
    type?: string;
    rankBy?: string;
    pageToken?: string;
}

async function fetchWikipediaImage(query: string): Promise<string | null> {
    try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&prop=pageimages&pithumbsize=1000&format=json&gsrlimit=1`;
        const res = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'WanderAITravelApp/1.0 (support@wandertrip.com)'
            }
        });
        if (!res.ok) return null;
        const json = await res.json();
        const pages = json.query?.pages;
        if (!pages) return null;
        const pageId = Object.keys(pages)[0];
        const thumbnail = pages[pageId]?.thumbnail?.source;
        return thumbnail || null;
    } catch (e) {
        console.error("Wikipedia search failed:", e);
        return null;
    }
}

async function getFallbackImage(query: string): Promise<string | null> {
    // Try full query first
    let img = await fetchWikipediaImage(query);
    if (img) return img;

    // Try first part before comma
    if (query.includes(',')) {
        const shortQuery = query.split(',')[0].trim();
        img = await fetchWikipediaImage(shortQuery);
        if (img) return img;
    }

    // Try query with only alphanumeric and spaces (removing special chars)
    const cleanQuery = query.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    if (cleanQuery && cleanQuery !== query) {
        img = await fetchWikipediaImage(cleanQuery);
        if (img) return img;
    }

    return null;
}

export async function POST(req: NextRequest) {
    const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
    const API_KEY = process.env.GOOGLE_PLACE_API_KEY;
    
    let textQuery = "";
    try {
        const body: PlacesRequestBody = await req.json();
        textQuery = body.textQuery || "";
    } catch (e) {
        return NextResponse.json({ error: "Invalid request body", places: [] }, { status: 200 });
    }

    // Define fallback response construction
    const buildFallbackResponse = async () => {
        const fallbackUrl = await getFallbackImage(textQuery);
        return NextResponse.json({
            places: [
                {
                    displayName: { text: textQuery },
                    photoUrl: fallbackUrl || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop`
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
            console.error("Failed to parse Google API response as JSON. Content:", text);
            return await buildFallbackResponse();
        }

        if (!response.ok || !data.places || data.places.length === 0) {
            console.error("Google Places API error or empty response. Details:", data);
            return await buildFallbackResponse();
        }

        const place = data.places[0];
        if (place.photos && place.photos.length > 0) {
            const photoName = place.photos[0].name;
            const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxHeightPx=1000&maxWidthPx=1000`;
            place.photoUrl = photoUrl;
            return NextResponse.json(data);
        } else {
            // No photos found on Google, use Wikipedia fallback
            const fallbackUrl = await getFallbackImage(textQuery);
            place.photoUrl = fallbackUrl || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop`;
            return NextResponse.json(data);
        }
    } catch (error: any) {
        console.error("Internal Server Error in google-place-details route:", error);
        return await buildFallbackResponse();
    }
}
