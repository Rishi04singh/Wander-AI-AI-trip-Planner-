"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Globe, 
  Plane, 
  Building, 
  Map, 
  X, 
  Calendar, 
  Compass, 
  Info, 
  RotateCcw, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Heart,
  Sliders,
  DollarSign,
  Gem,
  Mountain,
  Zap,
  Share2,
  Printer,
  Check
} from 'lucide-react';
import axios from 'axios';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserDetail } from '../../provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { resolveTravelImage } from '@/lib/travelImages';
import { useUser, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useLanguage } from "@/context/LanguageContext";

type Message = {
  role: string;
  content: string | any;
  ui?: string;
};

const localImages = [
  "/images/Great Barrier Reef, Australia.jpg",
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/Grand Canyon, USA.jpg",
  "/images/Eiffel Tower, France.jpg",
  "/images/Chefchaouen, Morocco.jpg",
  "/images/Hallstatt, Austria.jpg",
  "/images/Sintra, Portugal.jpg",
  "/images/Interlaken, Switzerland.jpg",
  "/images/Queenstown, New Zealand.jpg",
  "/images/Patagonia, Chile.jpg",
  "/images/Jiuzhaigou Valley, China.jpg",
  "/images/Meteora, Greece.jpg",
  "/images/Gokayama, Japan.jpg",
  "/images/Moab, Utah, USA.jpg",
  "/images/Banff, Canada.jpg",
  "/images/Skellig Michael, Ireland.jpg",
];

const INSPIRE_ME_PLACES = [
  { 
    name: "Great Barrier Reef, Australia", 
    description: "Explore the world's largest coral reef system, a breathtaking underwater paradise teeming with vibrant marine life.", 
    image: "/images/Great Barrier Reef, Australia.jpg",
    bestTimeToVisit: "June to October (Dry season, best visibility)",
    experience: "A magical underwater world that feels like another planet. Pure serenity beneath the waves.",
    whatYouKnow: "Home to over 1,500 species of fish and 411 types of hard coral. It's so big it's visible from space!",
    category: "World Wonder",
    bestFor: "Couple & Family"
  },
  { 
    name: "Machu Picchu, Peru", 
    description: "Discover the ancient Incan citadel set high in the Andes Mountains, a historical masterpiece with stunning views.", 
    image: "/images/img1.jpg",
    bestTimeToVisit: "May to September (Dry season, clear skies)",
    experience: "Walking through the clouds in an ancient city. A profound sense of history and human ingenuity.",
    whatYouKnow: "It was built in the 15th century and abandoned. It's known as the 'Lost City of the Incas'.",
    category: "Heritage",
    bestFor: "Solo & Friends"
  },
  { 
    name: "Santorini, Greece", 
    description: "Relax in the stunning island of Santorini, famous for its blue-domed churches and breathtaking sunset views.", 
    image: "/images/img2.jpg",
    bestTimeToVisit: "September to October or April to May",
    experience: "Whitewashed walls and deep blue seas. The sunsets here are legendary and romantic.",
    whatYouKnow: "The island was created by one of the largest volcanic eruptions in history about 3,600 years ago.",
    category: "Romance",
    bestFor: "Couples & Honeymoon"
  },
  { 
    name: "Kyoto, Japan", 
    description: "Immerse yourself in traditional culture, featuring serene temples, beautiful zen gardens, and cherry blossoms.", 
    image: "/images/img3.jpg",
    bestTimeToVisit: "March to May (Cherry blossom) or Oct to Nov (Autumn)",
    experience: "A perfect blend of tranquility and tradition. Walking through bamboo groves feels ethereal.",
    whatYouKnow: "Kyoto was Japan's capital for over 1,000 years and has 17 UNESCO World Heritage sites.",
    category: "Culture",
    bestFor: "All Travelers"
  },
  { 
    name: "Grand Canyon, USA", 
    description: "Marvel at the immense scale and colorful geological layers of this iconic natural wonder carved by history.", 
    image: "/images/Grand Canyon, USA.jpg",
    bestTimeToVisit: "March to May or September to November",
    experience: "Humbling and majestic. The vastness makes you feel small but incredibly connected to nature.",
    whatYouKnow: "The oldest rocks at the bottom are 2 billion years old—nearly half the age of Earth itself.",
    category: "Nature",
    bestFor: "Adventure & Family"
  },
  { 
    name: "Eiffel Tower, France", 
    description: "Experience the charm of Paris from the top of its most famous landmark, offering panoramic views of romance.", 
    image: "/images/Eiffel Tower, France.jpg",
    bestTimeToVisit: "June to August (Busy but beautiful) or Oct to Nov",
    experience: "The heartbeat of Paris. Standing under its iron lattice feels like being in a classic movie.",
    whatYouKnow: "Built for the 1889 World's Fair, it was originally meant to be torn down after 20 years!",
    category: "City Icon",
    bestFor: "Couples & Friends"
  },
];

const HIDDEN_GEMS_PLACES = [
  { 
    name: "Chefchaouen, Morocco", 
    description: "Known as the 'Blue Pearl,' this city features stunning blue-washed buildings and vibrant local markets.", 
    image: "/images/Chefchaouen, Morocco.jpg",
    bestTimeToVisit: "September to November or March to May",
    experience: "Wandering through a dream. Every corner is a masterpiece of blue shades and artistic charm.",
    whatYouKnow: "The blue color was introduced by Jewish refugees in the 1930s as a symbol of sky and heaven.",
    category: "Secret City",
    bestFor: "Photographers & Solo"
  },
  { 
    name: "Hallstatt, Austria", 
    description: "A breathtaking Alpine village on Lake Hallstatt, famous for its 16th-century houses and scenery.", 
    image: "/images/Hallstatt, Austria.jpg",
    bestTimeToVisit: "June to August or December (for snowy magic)",
    experience: "Like stepping into a music box. The reflection of the Alps in the lake is sheer perfection.",
    whatYouKnow: "Hallstatt is home to the world's oldest salt mine, dating back over 7,000 years.",
    category: "Fairytale Village",
    bestFor: "Couples & Peace Seekers"
  },
  { 
    name: "Sintra, Portugal", 
    description: "A fairytale town filled with whimsical palaces, lush gardens, and historic castles in the mountains.", 
    image: "/images/Sintra, Portugal.jpg",
    bestTimeToVisit: "April to June or September to October",
    experience: "Pure fantasy. The vibrant colors of Pena Palace feel like they belong in a storybook.",
    whatYouKnow: "Sintra was the first center of European Romantic architecture, blending Gothic and Moorish styles.",
    category: "Romantic Escape",
    bestFor: "Architecture Lovers"
  },
  { 
    name: "Jiuzhaigou Valley, China", 
    description: "A valley of crystal-clear, multi-colored lakes and waterfalls surrounded by colorful autumn foliage.", 
    image: "/images/Jiuzhaigou Valley, China.jpg",
    bestTimeToVisit: "October (for peak autumn colors)",
    experience: "Hypnotic beauty. The lakes are so clear you can see fallen trees at the bottom like fossils.",
    whatYouKnow: "The Tibetan name 'Jiuzhaigou' translates to 'Nine Village Valley' for the nine villages along its length.",
    category: "Nature Wonder",
    bestFor: "Nature Enthusiasts"
  },
  { 
    name: "Meteora, Greece", 
    description: "Ancient monasteries of Meteora perched atop massive natural sandstone rock pillars reaching the sky.", 
    image: "/images/Meteora, Greece.jpg",
    bestTimeToVisit: "May to June or September to October",
    experience: "Spiritual and sky-high. Looking down from the cliffs feels like standing on the edge of the world.",
    whatYouKnow: "Monks first arrived here in the 11th century; they used ropes and nets to climb the vertical cliffs.",
    category: "Spiritual Marvel",
    bestFor: "Hikers & Historians"
  },
  { 
    name: "Gokayama, Japan", 
    description: "Historic village with traditional gassho-zukuri farmhouses nestled in a peaceful, lush green valley.", 
    image: "/images/Gokayama, Japan.jpg",
    bestTimeToVisit: "January to February (Winter lights) or May",
    experience: "Absolute silence and heritage. The triangular straw roofs are a testament to ancient craftsmanship.",
    whatYouKnow: "The roofs are built without nails and can withstand some of the heaviest snowfall in the world.",
    category: "Cultural Gem",
    bestFor: "Slow Travel"
  },
];

const ADVENTURE_PLACES_CONST = [
  { 
    name: "Interlaken, Switzerland", 
    description: "The adventure capital of Europe, offering world-class paragliding and skydiving in the Swiss Alps.", 
    image: "/images/Interlaken, Switzerland.jpg",
    bestTimeToVisit: "June to August (Adventure) or Dec to Feb (Skiing)",
    experience: "Flying like a bird. Paragliding over the twin lakes with the Eiger peak in view is unparalleled.",
    whatYouKnow: "Interlaken sits between two lakes, Brienz and Thun, and is the gateway to the Jungfrau region.",
    category: "Extreme Sports",
    bestFor: "Adrenaline Junkies"
  },
  { 
    name: "Queenstown, New Zealand", 
    description: "The birthplace of bungy jumping, Queenstown offers everything from jet boating to skiing.", 
    image: "/images/Queenstown, New Zealand.jpg",
    bestTimeToVisit: "December to February (Summer) or June to August (Ski)",
    experience: "Pure adrenaline. Every activity is designed to push your limits in a beautiful alpine setting.",
    whatYouKnow: "Queenstown was named because it was 'fit for Queen Victoria' due to its extreme beauty.",
    category: "Bungy & Skydiving",
    bestFor: "Thrill Seekers"
  },
  { 
    name: "Patagonia, Chile", 
    description: "A wild landscape perfect for trekking, featuring the iconic granite towers of Torres del Paine.", 
    image: "/images/Patagonia, Chile.jpg",
    bestTimeToVisit: "November to March (Austral Summer)",
    experience: "Raw and untamed. The wind, the glaciers, and the jagged peaks make you feel like a true explorer.",
    whatYouKnow: "The name Patagonia comes from 'Patagón,' a word used by Magellan to describe the giant locals.",
    category: "Glacier Trekking",
    bestFor: "Experienced Trekkers"
  },
  { 
    name: "Moab, Utah, USA", 
    description: "Explore dramatic red rock arches and canyons via mountain biking or off-road vehicle expeditions.", 
    image: "/images/Moab, Utah, USA.jpg",
    bestTimeToVisit: "March to May or September to October",
    experience: "Rugged desert beauty. Navigating the 'slickrock' on a bike feels like riding on the surface of Mars.",
    whatYouKnow: "Arches National Park, next to Moab, has over 2,000 documented natural stone arches.",
    category: "Desert Biking & Offroad",
    bestFor: "Off-road Enthusiasts"
  },
  { 
    name: "Banff, Canada", 
    description: "Stunning winter landscape of Lake Louise with turquoise water and snow-covered mountain peaks.", 
    image: "/images/Banff, Canada.jpg",
    bestTimeToVisit: "June to August (Hiking) or Dec to March (Skiing)",
    experience: "Majestic wildlife and icy peaks. Seeing a grizzly bear or a crystal-clear lake is life-changing.",
    whatYouKnow: "Established in 1885, Banff was the first national park in Canada and the third in the world.",
    category: "Alpine Wilderness",
    bestFor: "Hikers & Campers"
  },
  { 
    name: "Skellig Michael, Ireland", 
    description: "Rugged island with ancient stone stairs climbing steep cliffs above the wild Atlantic Ocean.", 
    image: "/images/Skellig Michael, Ireland.jpg",
    bestTimeToVisit: "May to September (Boat tours are weather-dependent)",
    experience: "Isolation and ancient mystery. Climbing the 600 stone steps of the 6th-century monastery is surreal.",
    whatYouKnow: "The island was used as a filming location for 'Luke Skywalker’s island' in recent Star Wars films.",
    category: "Coastal Climb",
    bestFor: "History & Ocean Trekkers"
  },
];

const FINAL_PROMPT = `Generate a detailed Travel Plan with the given details. You MUST generate the itinerary for EVERY SINGLE DAY of the requested duration. For example, if the duration is 3 Days, you must output exactly 3 day objects in the "itinerary" array (Day 1, Day 2, Day 3). Do NOT skip, summarize, or truncate any day.
Provide a list of Hotels options with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, and descriptions.
For the itinerary, provide placeName, Place Details, Place Image Url, Geo Coordinates, Place address, ticket Pricing, and Time travel to each location.
You MUST schedule the activities chronologically throughout each day (e.g. 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM, 9:00 PM), assigning a specific scheduled time to the "best_time_to_visit" field of each activity to form a complete, detailed time-wise plan.
Especially include:
1. Evening spot for sunset with time.
2. Night spot for dinner or bars with time.
Output Schema should follow the below JSON format. All prices must be in Indian Rupees (₹) and should reflect estimated real-world market rates for the specified budget. For the night spot (dinner/bar), also include an estimated_cost_per_person field.
Output Schema:
{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": "number",
          "longitude": "number"
        },
        "rating": "number",
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": "number",
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": "number",
              "longitude": "number"
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "estimated_cost_per_person": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string",
            "is_evening_spot": "boolean",
            "is_night_spot": "boolean"
          }
        ]
      }
    ]
  }
}`;

export const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'Solo traveler discovering the world',
    icon: '👤',
    people: '1 Person',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Romantic tandem getaway',
    icon: '🥂',
    people: '2 People',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'Group of fun adventurers',
    icon: '🏠',
    people: '3 to 5 People',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'Bunch of thrill-seekers',
    icon: '⛵',
    people: '5 to 10 People',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop'
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs & save',
    icon: '💰',
    range: '₹1,500 - ₹3,000 / day',
    image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Comfortable balance of cost & quality',
    icon: '💸',
    range: '₹3,500 - ₹7,000 / day',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Luxury',
    desc: 'Premium stays & uncompromised experience',
    icon: '💎',
    range: '₹8,000+ / day',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop'
  },
];

const popularOrigins = [
  "London", "New York", "Mumbai", "Delhi", "Bengaluru", "Dubai", "Singapore", "San Francisco"
];

const trendingDestinations = [
  "Paris", "Tokyo", "Bali", "Swiss Alps", "Rome", "Goa", "Kyoto", "Dubai"
];

function Chatbox({ tripData, setTripData }: { tripData: any, setTripData: any }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  
  const [step, setStep] = useState(0); // 0: Idle, 1: Origin, 2: Destination, 3: Travelers, 4: Budget, 5: Days, 6: Generating
  const [tempDays, setTempDays] = useState(5);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShareGeneratedTrip = async () => {
    if (!generatedTripId) return;
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/view-trip/${generatedTripId}` : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Trip Plan - Wanderer Travel',
          text: 'Check out the AI trip itinerary I just created!',
          url: shareUrl
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    } catch (e) {
      const el = document.createElement('input');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };
  const [generatedTripId, setGeneratedTripId] = useState<string | null>(null);
  const [activeModeTab, setActiveModeTab] = useState<string>("plan");

  const { language, t } = useLanguage();
  const { user } = useUser();
  const { has } = useAuth();
  const { userDetail } = useUserDetail();
  const saveTrip = useMutation((api as any).trips.saveTrip);
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialParamsHandled = useRef(false);

  // User trips & Free plan 3-credit tracking (Works for both Logged-In accounts & Guest/Anonymous browsers)
  const [guestCount, setGuestCount] = useState(0);

  useEffect(() => {
    try {
      const stored = parseInt(localStorage.getItem('wanderer_guest_trips') || '0', 10);
      if (!isNaN(stored)) {
        setGuestCount(stored);
      }
    } catch (e) {}
  }, []);

  const activeEmail = userDetail?.email || user?.primaryEmailAddress?.emailAddress;
  const userTrips = useQuery((api as any).trips.getUserTrips, activeEmail ? { userEmail: activeEmail } : "skip");

  const isSubscribed = Boolean(
    (has && (has({ plan: 'monthly' }) || has({ plan: 'premium' }))) || 
    userDetail?.subscribed
  );
  const dbTripCount = Array.isArray(userTrips) ? userTrips.length : 0;
  const tripCount = Math.max(dbTripCount, guestCount);
  const FREE_LIMIT = 3;
  const remainingCredits = Math.max(0, FREE_LIMIT - tripCount);
  const isLimitReached = !isSubscribed && tripCount >= FREE_LIMIT;

  // Proactively inform user when limit is reached on initial load
  useEffect(() => {
    if (isLimitReached && !isSubscribed && messages.length <= 1 && step <= 1) {
      setStep(0);
      setMessages([
        {
          role: 'assistant',
          content: `Credit points finished! You have used all ${FREE_LIMIT} free journeys included with the Free Starter Plan. Please upgrade to our Monthly Pro or Premium plan to unlock unlimited journeys and full AI access.`,
          ui: 'limit'
        }
      ]);
    }
  }, [isLimitReached, isSubscribed]);

  // Auto scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Read URL parameters on mount and trigger actions seamlessly
  useEffect(() => {
    if (initialParamsHandled.current) return;
    initialParamsHandled.current = true;

    const action = searchParams.get('action');
    const prompt = searchParams.get('prompt');
    const to = searchParams.get('to') || searchParams.get('destination');
    const from = searchParams.get('from') || searchParams.get('origin');
    const days = searchParams.get('days');

    // Scenario 1: Destination prefilled from card or query
    if (to && !action) {
      setTripData((prev: any) => ({
        ...prev,
        to,
        from: from || prev.from || '',
        days: days ? parseInt(days) : prev.days
      }));
      setStep(1);
      setActiveModeTab("plan");
      setMessages([
        {
          role: 'assistant',
          content: `🌟 Fantastic choice! Planning your adventure to ${to}. Where will you be flying or traveling from?`,
          ui: 'origin_selection'
        }
      ]);
      return;
    }

    // Scenario 2: Action parameter passed from 1-click Hero cards
    if (action === 'create') {
      startStepWizard(from || '', to || '', days ? parseInt(days) : null);
      return;
    }

    if (action === 'inspire') {
      showInspirationPlaces();
      return;
    }

    if (action === 'hidden_gems') {
      showHiddenGems();
      return;
    }

    if (action === 'adventure') {
      showAdventurePlaces();
      return;
    }

    // Scenario 3: Prompt parameter passed from Hero textarea
    if (prompt) {
      onSend(prompt);
      return;
    }

    // Default Scenario: If no parameters at all, start directly with friendly greeting & quick start
    startStepWizard();
  }, [searchParams]);

  // Mode Handlers
  const startStepWizard = (initialFrom = '', initialTo = '', initialDays: number | null = null) => {
    setActiveModeTab("plan");
    setTripData({
      from: initialFrom,
      to: initialTo,
      travelers: '',
      budget: '',
      days: initialDays
    });
    setGeneratedTripId(null);

    if (isLimitReached) {
      setStep(0);
      setMessages([
        {
          role: 'assistant',
          content: `Credit points finished! You have used all ${FREE_LIMIT} free journeys included with the Free Starter Plan. Please upgrade to our Monthly Pro or Premium plan to unlock unlimited journeys and full AI access.`,
          ui: 'limit'
        }
      ]);
      return;
    }

    if (initialFrom && initialTo) {
      setStep(3);
      setMessages([
        {
          role: 'assistant',
          content: `Planning a trip from ${initialFrom} to ${initialTo}${initialDays ? ` for ${initialDays} days` : ''}. How many travelers will be going?`,
          ui: 'travelers'
        }
      ]);
      return;
    }

    if (initialTo) {
      setStep(1);
      setMessages([
        {
          role: 'assistant',
          content: `Awesome! We're planning your trip to ${initialTo}. Where will you be traveling from?`,
          ui: 'origin_selection'
        }
      ]);
      return;
    }

    setStep(1);
    setMessages([
      {
        role: 'assistant',
        content: "👋 Welcome to Wanderer! Let's craft your personalized journey. Where will you be traveling from?",
        ui: 'origin_selection'
      }
    ]);
  };

  const showInspirationPlaces = () => {
    setActiveModeTab("inspire");
    setStep(0);
    setMessages([
      {
        role: 'assistant',
        content: INSPIRE_ME_PLACES
      }
    ]);
  };

  const showHiddenGems = () => {
    setActiveModeTab("hidden_gems");
    setStep(0);
    setMessages([
      {
        role: 'assistant',
        content: HIDDEN_GEMS_PLACES
      }
    ]);
  };

  const showAdventurePlaces = () => {
    setActiveModeTab("adventure");
    setStep(0);
    setMessages([
      {
        role: 'assistant',
        content: ADVENTURE_PLACES_CONST
      }
    ]);
  };

  // Direct 1-Click Plan Trip from Place Cards
  const handleSelectPlaceToPlan = (place: any) => {
    setSelectedPlace(null);
    if (isLimitReached) {
      setActiveModeTab("plan");
      setStep(0);
      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: `Plan a trip to ${place.name}`
        },
        {
          role: 'assistant',
          content: `Credit points finished! You have used all ${FREE_LIMIT} free journeys on the Starter Plan. Please upgrade to continue generating custom itineraries.`,
          ui: 'limit'
        }
      ]);
      return;
    }
    const placeName = place.name.split(',')[0].trim();
    setTripData((prev: any) => ({ ...prev, to: place.name }));
    setStep(1);
    setActiveModeTab("plan");
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: `Plan a trip to ${place.name}`
      },
      {
        role: 'assistant',
        content: `✨ ${place.name} is a world-class destination! Let's build your itinerary. Where are you traveling from?`,
        ui: 'origin_selection'
      }
    ]);
  };

  const triggerTripGeneration = async (currentTripData: any) => {
    if (isLimitReached) {
      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: `Credit points finished! You have used all ${FREE_LIMIT} free journeys on the Starter Plan. Upgrade for unlimited AI travel planning.`,
        ui: 'limit'
      }]);
      setStep(0);
      setIsLoading(false);
      return;
    }

    setStep(6);
    const finalTripPrompt = `Mode: 5, Trip Plan Details: Origin: ${currentTripData.from}, Destination: ${currentTripData.to}, Duration: ${currentTripData.days} Days, Traveler: ${currentTripData.travelers}, Budget: ${currentTripData.budget}. ${FINAL_PROMPT}`;
    
    setMessages((prev: Message[]) => [...prev, {
      role: 'assistant',
      content: `Planning a ${currentTripData.budget} budget trip to ${currentTripData.to} from ${currentTripData.from} for ${currentTripData.days} days with ${currentTripData.travelers}...`,
      ui: 'planning_card'
    }]);

    try {
      const result = await axios.post('/api/aimodel', {
        messages: [{ role: 'user', content: finalTripPrompt }],
        language: language
      });
      
      if (result.data?.ui === 'limit') {
         setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: result.data.resp,
          ui: 'limit'
        }]);
        setStep(0);
        return;
      }

      const tripDataJSON = result.data.trip_plan || result.data.resp || result.data;
      const tripId = Date.now().toString();

      await saveTrip({
        tripId: tripId,
        userEmail: userDetail?.email || "anonymous",
        tripData: tripDataJSON,
        userSelection: currentTripData
      });

      try {
        const nextGuestCount = tripCount + 1;
        localStorage.setItem('wanderer_guest_trips', String(nextGuestCount));
        setGuestCount(nextGuestCount);
      } catch (e) {}

      setGeneratedTripId(tripId);
      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: "🎉 Your full trip plan and day-by-day itinerary is ready! Click the button above to view it in full detail.",
      }]);
    } catch (error) {
      console.error("Trip generation error:", error);
      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: "Sorry, I encountered an issue generating the full trip plan. Please try again or adjust your inputs."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;
    setIsLoading(true);
    if (!overrideText) setInput("");

    if (isLimitReached && (textToSend === "Create New Trip" || step >= 1)) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: textToSend },
        {
          role: 'assistant',
          content: `Credit points finished! You have used all ${FREE_LIMIT} free journeys on the Starter Plan. Please upgrade to our Monthly Pro or Premium plan to generate more trips.`,
          ui: 'limit'
        }
      ]);
      setIsLoading(false);
      return;
    }

    const newMsg: Message = {
      role: 'user',
      content: textToSend
    };
    setMessages((prev) => [...prev, newMsg]);

    try {
      // Step 1: Origin Submission
      if (step === 1) {
        const fromToRegex = /(?:from\s+)?(.+?)\s+to\s+(.+)/i;
        const match = textToSend.match(fromToRegex);
        
        if (match) {
          const clean = (s: string) => s.replace(/^(i want to (go|travel|travel from)|want to go|trip|travel|from|take me from|going from)\b\s*/i, "").trim();
          const from = clean(match[1]);
          const toPart = match[2];
          
          const daysMatch = toPart.match(/(\d+)\s*(?:day|days)/i);
          const days = daysMatch ? parseInt(daysMatch[1]) : null;
          const to = clean(toPart.replace(/[,]?\s*\d+\s*(?:day|days)/i, ""));

          setTripData((prev: any) => ({ 
            ...prev, 
            from, 
            to,
            ...(days ? { days } : {})
          }));
          if (days) setTempDays(days);
          
          setStep(3);
          setTimeout(() => {
            setMessages((prev) => [...prev, {
              role: 'assistant',
              content: `Great! Traveling from ${from} to ${to}${days ? ` for ${days} days` : ""}. How many people will be traveling?`,
              ui: 'travelers'
            }]);
            setIsLoading(false);
          }, 400);
          return;
        }

        const from = textToSend.replace(/^(i want to travel from|from|want to go from|going from|📍)\b\s*/i, "").trim();
        setTripData((prev: any) => ({ ...prev, from }));
        
        // If destination already known
        if (tripData.to) {
          setStep(3);
          setTimeout(() => {
            setMessages((prev) => [...prev, {
              role: 'assistant',
              content: `Got it! Flying from ${from} to ${tripData.to}. Who is traveling with you?`,
              ui: 'travelers'
            }]);
            setIsLoading(false);
          }, 400);
          return;
        }

        setStep(2);
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            role: 'assistant',
            content: `Great! Starting from ${from}. What is your dream destination?`,
            ui: 'destination_selection'
          }]);
          setIsLoading(false);
        }, 400);
        return;
      }

      // Step 2: Destination Submission
      if (step === 2) {
        const to = textToSend.replace(/^(i want to visit|to|fly to|going to|🗼|🍣|🏖️|🏔️|🏛️|🌴)\b\s*/i, "").trim();
        setTripData((prev: any) => ({ ...prev, to }));
        setStep(3);
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            role: 'assistant',
            content: `Excellent! Going to ${to}. How many people will be traveling?`,
            ui: 'travelers'
          }]);
          setIsLoading(false);
        }, 400);
        return;
      }

      // Step 3: Travelers Selection
      const isTravelerMsg = SelectTravelesList.some(item => textToSend.includes(item.title));
      if (step === 3 && isTravelerMsg) {
        const travelersInfo = textToSend.split(':')[0];
        setTripData((prev: any) => ({ ...prev, travelers: travelersInfo }));
        setStep(4);
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            role: 'assistant',
            content: "What is your budget tier for this journey?",
            ui: 'budget'
          }]);
          setIsLoading(false);
        }, 400);
        return;
      }

      // Step 4: Budget Selection
      const isBudgetMsg = SelectBudgetOptions.some(item => textToSend === item.title);
      if (step === 4 && isBudgetMsg) {
        setTripData((prev: any) => ({ ...prev, budget: textToSend }));
        
        if (tripData.days) {
          triggerTripGeneration({ ...tripData, budget: textToSend });
          return;
        }

        setStep(5);
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            role: 'assistant',
            content: "Almost ready! How many days will you be traveling?",
            ui: 'days_scale'
          }]);
          setIsLoading(false);
        }, 400);
        return;
      }

      // Step 5: Days Selection
      if (step === 5) {
        const finalDays = textToSend.includes("Days") ? textToSend.split(' ')[0] : textToSend;
        const currentTripData = { ...tripData, days: finalDays };
        setTripData(currentTripData);
        triggerTripGeneration(currentTripData);
        return;
      }

      // Direct Keyword Ingestion
      if (textToSend === "Create New Trip") {
        startStepWizard();
        setIsLoading(false);
        return;
      }

      if (textToSend === "Inspire me where to go") {
        showInspirationPlaces();
        setIsLoading(false);
        return;
      }

      if (textToSend === "Discover Hidden gems") {
        showHiddenGems();
        setIsLoading(false);
        return;
      }

      if (textToSend === "Adventure Destination") {
        showAdventurePlaces();
        setIsLoading(false);
        return;
      }

      // General fallback to AI Model API
      const result = await axios.post('/api/aimodel', {
        messages: [...messages, newMsg],
        language: language
      });

      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: result?.data?.resp || "I'm ready to assist you. Let me know where you'd like to travel!",
        ui: result?.data?.ui
      }]);
    } catch (error) {
      console.error("AI Model error:", error);
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "Oops! We encountered a momentary network error. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-white w-full select-text">
      
      {/* Top Interactive Mode Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-neutral-900/60 backdrop-blur-xl shrink-0 z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => startStepWizard()}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeModeTab === "plan" 
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('tab_planner')}</span>
          </button>

          <button
            onClick={showInspirationPlaces}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeModeTab === "inspire" 
                ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t('tab_inspire')}</span>
          </button>

          <button
            onClick={showHiddenGems}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeModeTab === "hidden_gems" 
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Gem className="w-3.5 h-3.5" />
            <span>{t('tab_gems')}</span>
          </button>

          <button
            onClick={showAdventurePlaces}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeModeTab === "adventure" 
                ? "bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
                : "text-gray-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>{t('tab_adventure')}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-3 h-3 fill-emerald-400" />
              {t('chat_pro_unlimited')}
            </span>
          ) : (
            <Link
              href="/pricing"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                isLimitReached
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                  : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25'
              }`}
              title="Click to view pricing & upgrade plans"
            >
              <Zap className={`w-3 h-3 ${isLimitReached ? 'text-rose-400 fill-rose-400' : 'text-indigo-400 fill-indigo-400'}`} />
              <span>{remainingCredits}/{FREE_LIMIT} {t('chat_credits')}</span>
              {isLimitReached && <span className="font-bold underline text-[10px] ml-0.5">{t('chat_upgrade')}</span>}
            </Link>
          )}

          <button
            onClick={() => startStepWizard()}
            title="Restart planner"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <section ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scroll-smooth">
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2.5 group animate-in fade-in duration-300`}>
            
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shrink-0 shadow-lg border border-white/20">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[90%] sm:max-w-[85%] px-4 sm:px-5 py-3.5 rounded-[24px] shadow-lg transition-all ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-br-none' 
                : 'bg-neutral-900 border border-white/10 text-neutral-200 rounded-bl-none'
            }`}>
              {typeof msg.content === 'string' ? (
                <div>
                  <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.content}
                  </p>

                  {/* UI WIDGET 1: Origin Quick Chips */}
                  {msg.ui === 'origin_selection' && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                      <span className="text-xs font-semibold text-gray-400 block">Quick select city:</span>
                      <div className="flex flex-wrap gap-2">
                        {popularOrigins.map((city, cIdx) => (
                          <button
                            key={cIdx}
                            onClick={() => onSend(city)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-indigo-600 text-gray-200 hover:text-white border border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
                          >
                            📍 {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* UI WIDGET 2: Destination Quick Chips */}
                  {msg.ui === 'destination_selection' && (
                    <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                      <span className="text-xs font-semibold text-gray-400 block">Trending destinations:</span>
                      <div className="flex flex-wrap gap-2">
                        {trendingDestinations.map((dest, dIdx) => (
                          <button
                            key={dIdx}
                            onClick={() => onSend(dest)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-indigo-600 text-gray-200 hover:text-white border border-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95"
                          >
                            ✨ {dest}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* UI WIDGET 3: Travelers Selection Grid */}
                  {msg.ui === 'travelers' && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {SelectTravelesList.map((item) => (
                        <button 
                          key={item.id} 
                          onClick={() => onSend(item.title)}
                          className="group flex flex-col bg-neutral-800/80 hover:bg-indigo-950/40 border border-white/10 hover:border-indigo-500/50 rounded-2xl transition-all text-left shadow-lg relative overflow-hidden h-full cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <div className="h-24 w-full overflow-hidden relative">
                             <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-black/30 to-transparent" />
                             <span className="absolute top-2 left-2 text-xl drop-shadow">{item.icon}</span>
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between">
                             <div>
                               <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">{item.title}</div>
                               <div className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{item.desc}</div>
                             </div>
                             <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mt-2">{item.people}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* UI WIDGET 4: Budget Selection Grid */}
                  {msg.ui === 'budget' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      {SelectBudgetOptions.map((item) => (
                        <button 
                          key={item.id} 
                          onClick={() => onSend(item.title)}
                          className="group flex flex-col bg-neutral-800/80 hover:bg-indigo-950/40 border border-white/10 hover:border-indigo-500/50 rounded-2xl transition-all text-left shadow-lg relative overflow-hidden h-full cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <div className="h-24 w-full overflow-hidden relative">
                             <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-black/30 to-transparent" />
                             <span className="absolute top-2 left-2 text-xl drop-shadow">{item.icon}</span>
                          </div>
                          <div className="p-3">
                             <div className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">{item.title}</div>
                             <div className="text-[11px] text-gray-400 mt-0.5">{item.desc}</div>
                             <div className="text-[10px] font-bold text-emerald-400 mt-2">{item.range}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* UI WIDGET 5: Days Slider */}
                  {msg.ui === 'days_scale' && (
                    <div className="flex flex-col gap-4 mt-4 bg-neutral-900 p-5 rounded-2xl border border-white/15 shadow-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Trip Duration</span>
                        <span className="text-2xl font-black text-indigo-400">{tempDays} Days</span>
                      </div>

                      {/* Preset Days Chips */}
                      <div className="flex gap-2">
                        {[3, 5, 7, 10, 14].map((d) => (
                          <button
                            key={d}
                            onClick={() => setTempDays(d)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              tempDays === d
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                                : "bg-white/5 hover:bg-white/10 text-gray-300"
                            }`}
                          >
                            {d}d
                          </button>
                        ))}
                      </div>

                      <input 
                        type="range" 
                        min="1" 
                        max="21" 
                        value={tempDays} 
                        onChange={(e) => setTempDays(parseInt(e.target.value))}
                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />

                      <div className="flex justify-between text-[11px] text-gray-500 font-semibold px-1">
                        <span>1 Day</span>
                        <span>10 Days</span>
                        <span>21 Days</span>
                      </div>

                      <button 
                        onClick={() => onSend(`${tempDays} Days`)}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Confirm {tempDays} Days & Plan Itinerary</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* UI WIDGET 6: Planning Live Card */}
                  {msg.ui === 'planning_card' && (
                    <div className="flex flex-col items-center justify-center p-6 sm:p-8 mt-4 bg-gradient-to-b from-indigo-950/40 to-neutral-900 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-6 text-center animate-in zoom-in-95 duration-500">
                      <div className="relative">
                        <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/40 shadow-inner">
                           <Globe className="h-8 w-8 text-indigo-400 animate-pulse" />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white">
                          Synthesizing Your Complete Itinerary...
                        </h3>
                        <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                          Matching flights, hand-picked hotels, daily schedules, geo-routes, and dinner spots.
                        </p>
                      </div>

                      <Button 
                        onClick={() => generatedTripId && router.push(`/view-trip/${generatedTripId}`)}
                        disabled={!generatedTripId}
                        className={`w-full rounded-2xl h-12 font-bold transition-all ${
                          !generatedTripId 
                            ? 'bg-white/10 text-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white shadow-xl shadow-indigo-500/20 cursor-pointer active:scale-95'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 animate-spin" />
                            <span>Building Day-by-Day Schedule...</span>
                          </div>
                        ) : (
                          <span className="flex items-center gap-2">
                            <span>Open Full Itinerary</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </Button>

                      {generatedTripId && !isLoading && (
                        <div className="flex items-center gap-2.5 w-full pt-1">
                          <Button
                            type="button"
                            onClick={() => window.open(`/view-trip/${generatedTripId}?print=true`, '_blank')}
                            variant="outline"
                            className="flex-1 rounded-2xl h-11 border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            <Printer className="w-4 h-4 text-blue-400" />
                            <span>Download PDF</span>
                          </Button>
                          <Button
                            type="button"
                            onClick={handleShareGeneratedTrip}
                            variant="outline"
                            className="flex-1 rounded-2xl h-11 border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            {copiedShare ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-300">Link Copied!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-4 h-4 text-indigo-400" />
                                <span>Share Trip</span>
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* UI WIDGET 7: Limit Card */}
                  {msg.ui === 'limit' && (
                    <div className="flex flex-col items-center justify-center p-6 mt-4 bg-gradient-to-b from-rose-950/40 to-neutral-900 rounded-3xl border border-rose-500/40 space-y-3.5 text-center shadow-2xl">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <Zap className="h-6 w-6 fill-rose-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">
                          {t('limit_title')}
                        </h3>
                        <p className="text-xs text-neutral-300 max-w-sm mt-1 leading-relaxed">
                          {t('limit_desc')}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full pt-1">
                        <Link 
                          href="/pricing"
                          className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span>{t('limit_btn')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : Array.isArray(msg.content) ? (
                
                // RICH DESTINATION CARDS (Inspire Me / Hidden Gems / Adventure)
                <div className="flex flex-col gap-3 my-2 w-full">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Select a destination to plan instantly:
                    </span>
                    <span className="text-[11px] text-gray-400">{msg.content.length} Places Found</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {msg.content.map((place: any, i: number) => (
                      <div 
                        key={i} 
                        className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-white/10 bg-neutral-800/80 hover:bg-neutral-800 shadow-md group transition-all"
                      >
                        <div className="relative w-full sm:w-44 h-36 shrink-0 overflow-hidden">
                          <img 
                            src={
                              place.image || (messages[idx - 1]?.content === "Inspire me where to go"
                                ? localImages[i % localImages.length]
                                : resolveTravelImage(place.name + " " + (place.category || "")))
                            } 
                            alt={place.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            onError={(e) => { e.currentTarget.src = resolveTravelImage(place.name); }}
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
                            {place.category || "Featured"}
                          </span>
                        </div>

                        <div className="p-3.5 flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors">
                                {place.name}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                              {place.description}
                            </p>
                            {place.bestTimeToVisit && (
                              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                <Calendar className="w-3 h-3" />
                                <span className="line-clamp-1">{place.bestTimeToVisit}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                            <button
                              onClick={() => setSelectedPlace({ ...place, image: place.image || resolveTravelImage(place.name) })}
                              className="text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                              View details
                            </button>

                            {/* 1-Click Plan CTA Button */}
                            <Button
                              size="sm"
                              onClick={() => handleSelectPlaceToPlan(place)}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold px-3.5 py-1.5 gap-1.5 shadow-md active:scale-95 cursor-pointer"
                            >
                              <span>Plan This Trip</span>
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(msg.content, null, 2)}</pre>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex justify-start items-end gap-2.5 animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shrink-0 shadow-lg border border-white/20">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-neutral-900 border border-white/10 text-neutral-300 px-4 py-3 rounded-[24px] rounded-bl-none shadow-md flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs font-semibold text-gray-400">Agent processing...</span>
            </div>
          </div>
        )}
      </section>

      {/* Input Area */}
      <section className="p-3 sm:p-4 bg-neutral-900/90 border-t border-white/10 shrink-0">
        <div className="relative flex items-center bg-black/60 rounded-2xl p-1 border border-white/15 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder={
              step === 1 ? "Enter departure city (e.g., London, New York)..." :
              step === 2 ? "Enter destination (e.g., Tokyo, Paris)..." :
              "Type your message or answer here..."
            }
            className="w-full min-h-[46px] max-h-[110px] resize-none border-none shadow-none focus-visible:ring-0 text-sm text-white bg-transparent px-3.5 py-2.5 placeholder:text-gray-500 rounded-xl"
            rows={1}
          />
          <div className="pr-1.5 pb-1 self-end shrink-0">
            <Button
              size="icon"
              onClick={() => onSend()}
              disabled={!input.trim() || isLoading}
              className="h-9 w-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Place Detail Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-neutral-900 text-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative border border-white/15 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white shadow z-10 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="relative h-60 w-full">
              <img 
                src={selectedPlace.image || resolveTravelImage(selectedPlace.name)} 
                onError={(e) => { e.currentTarget.src = resolveTravelImage(selectedPlace.name); }}
                alt={selectedPlace.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent flex items-end p-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-600 text-white mb-2 inline-block">
                    {selectedPlace.category || "Recommended"}
                  </span>
                  <h2 className="text-2xl font-black text-white">{selectedPlace.name}</h2>
                  {selectedPlace.bestTimeToVisit && (
                    <div className="flex items-center gap-1.5 text-gray-300 text-xs mt-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" /> 
                      <span>Best Season: {selectedPlace.bestTimeToVisit}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-400 mb-1">
                  About Destination
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedPlace.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {selectedPlace.experience && (
                  <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> Experience
                    </h4>
                    <p className="text-xs text-gray-300 italic">
                      "{selectedPlace.experience}"
                    </p>
                  </div>
                )}

                {selectedPlace.whatYouKnow && (
                  <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-sky-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Trivia
                    </h4>
                    <p className="text-xs text-gray-300">
                      {selectedPlace.whatYouKnow}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-white/10">
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>

                <Button 
                  onClick={() => handleSelectPlaceToPlan(selectedPlace)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2.5 font-bold text-sm shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Plan Trip to {selectedPlace.name.split(',')[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Chatbox;
