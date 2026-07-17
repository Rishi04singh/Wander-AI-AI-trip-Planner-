"use client"
import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Send, Bot, User, Sparkles, Globe, Plane, Building, Map, X, Calendar, Compass, Info } from 'lucide-react'
import axios from 'axios'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUserDetail } from '../../provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'


type Message = {
  role: string,
  content: string | any,
  ui?: string
}

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
    whatYouKnow: "Home to over 1,500 species of fish and 411 types of hard coral. It's so big it's visible from space!"
  },
  { 
    name: "Machu Picchu, Peru", 
    description: "Discover the ancient Incan citadel set high in the Andes Mountains, a historical masterpiece with stunning views.", 
    image: "/images/img1.jpg",
    bestTimeToVisit: "May to September (Dry season, clear skies)",
    experience: "Walking through the clouds in an ancient city. A profound sense of history and human ingenuity.",
    whatYouKnow: "It was built in the 15th century and abandoned. It's known as the 'Lost City of the Incas'."
  },
  { 
    name: "Santorini, Greece", 
    description: "Relax in the stunning island of Santorini, famous for its blue-domed churches and breathtaking sunset views.", 
    image: "/images/img2.jpg",
    bestTimeToVisit: "September to October or April to May",
    experience: "Whitewashed walls and deep blue seas. The sunsets here are legendary and romantic.",
    whatYouKnow: "The island was created by one of the largest volcanic eruptions in history about 3,600 years ago."
  },
  { 
    name: "Kyoto, Japan", 
    description: "Immerse yourself in traditional culture, featuring serene temples, beautiful zen gardens, and cherry blossoms.", 
    image: "/images/img3.jpg",
    bestTimeToVisit: "March to May (Cherry blossom) or Oct to Nov (Autumn)",
    experience: "A perfect blend of tranquility and tradition. Walking through bamboo groves feels ethereal.",
    whatYouKnow: "Kyoto was Japan's capital for over 1,000 years and has 17 UNESCO World Heritage sites."
  },
  { 
    name: "Grand Canyon, USA", 
    description: "Marvel at the immense scale and colorful geological layers of this iconic natural wonder carved by history.", 
    image: "/images/Grand Canyon, USA.jpg",
    bestTimeToVisit: "March to May or September to November",
    experience: "Humbling and majestic. The vastness makes you feel small but incredibly connected to nature.",
    whatYouKnow: "The oldest rocks at the bottom are 2 billion years old—nearly half the age of Earth itself."
  },
  { 
    name: "Eiffel Tower, France", 
    description: "Experience the charm of Paris from the top of its most famous landmark, offering panoramic views of romance.", 
    image: "/images/Eiffel Tower, France.jpg",
    bestTimeToVisit: "June to August (Busy but beautiful) or Oct to Nov",
    experience: "The heartbeat of Paris. Standing under its iron lattice feels like being in a classic movie.",
    whatYouKnow: "Built for the 1889 World's Fair, it was originally meant to be torn down after 20 years!"
  },
];

const HIDDEN_GEMS_PLACES = [
  { 
    name: "Chefchaouen, Morocco", 
    description: "Known as the 'Blue Pearl,' this city features stunning blue-washed buildings and vibrant local markets.", 
    image: "/images/Chefchaouen, Morocco.jpg",
    bestTimeToVisit: "September to November or March to May",
    experience: "Wandering through a dream. Every corner is a masterpiece of blue shades and artistic charm.",
    whatYouKnow: "The blue color was introduced by Jewish refugees in the 1930s as a symbol of sky and heaven."
  },
  { 
    name: "Hallstatt, Austria", 
    description: "A breathtaking Alpine village on Lake Hallstatt, famous for its 16th-century houses and scenery.", 
    image: "/images/Hallstatt, Austria.jpg",
    bestTimeToVisit: "June to August or December (for snowy magic)",
    experience: "Like stepping into a music box. The reflection of the Alps in the lake is sheer perfection.",
    whatYouKnow: "Hallstatt is home to the world's oldest salt mine, dating back over 7,000 years."
  },
  { 
    name: "Sintra, Portugal", 
    description: "A fairytale town filled with whimsical palaces, lush gardens, and historic castles in the mountains.", 
    image: "/images/Sintra, Portugal.jpg",
    bestTimeToVisit: "April to June or September to October",
    experience: "Pure fantasy. The vibrant colors of Pena Palace feel like they belong in a storybook.",
    whatYouKnow: "Sintra was the first center of European Romantic architecture, blending Gothic and Moorish styles."
  },
  { 
    name: "Jiuzhaigou Valley, China", 
    description: "A valley of crystal-clear, multi-colored lakes and waterfalls surrounded by colorful autumn foliage.", 
    image: "/images/Jiuzhaigou Valley, China.jpg",
    bestTimeToVisit: "October (for peak autumn colors)",
    experience: "Hypnotic beauty. The lakes are so clear you can see fallen trees at the bottom like fossils.",
    whatYouKnow: "The Tibetan name 'Jiuzhaigou' translates to 'Nine Village Valley' for the nine villages along its length."
  },
  { 
    name: "Meteora, Greece", 
    description: "Ancient monasteries of Meteora perched atop massive natural sandstone rock pillars reaching the sky.", 
    image: "/images/Meteora, Greece.jpg",
    bestTimeToVisit: "May to June or September to October",
    experience: "Spiritual and sky-high. Looking down from the cliffs feels like standing on the edge of the world.",
    whatYouKnow: "Monks first arrived here in the 11th century; they used ropes and nets to climb the vertical cliffs."
  },
  { 
    name: "Gokayama, Japan", 
    description: "Historic village with traditional gassho-zukuri farmhouses nestled in a peaceful, lush green valley.", 
    image: "/images/Gokayama, Japan.jpg",
    bestTimeToVisit: "January to February (Winter lights) or May",
    experience: "Absolute silence and heritage. The triangular straw roofs are a testament to ancient craftsmanship.",
    whatYouKnow: "The roofs are built without nails and can withstand some of the heaviest snowfall in the world."
  },
];

const ADVENTURE_PLACES_CONST = [
  // ... existing adventure places
  { 
    name: "Interlaken, Switzerland", 
    description: "The adventure capital of Europe, offering world-class paragliding and skydiving in the Swiss Alps.", 
    image: "/images/Interlaken, Switzerland.jpg",
    bestTimeToVisit: "June to August (Adventure) or Dec to Feb (Skiing)",
    experience: "Flying like a bird. Paragliding over the twin lakes with the Eiger peak in view is unparalleled.",
    whatYouKnow: "Interlaken sits between two lakes, Brienz and Thun, and is the gateway to the Jungfrau region."
  },
  { 
    name: "Queenstown, New Zealand", 
    description: "The birthplace of bungy jumping, Queenstown offers everything from jet boating to skiing.", 
    image: "/images/Queenstown, New Zealand.jpg",
    bestTimeToVisit: "December to February (Summer) or June to August (Ski)",
    experience: "Pure adrenaline. Every activity is designed to push your limits in a beautiful alpine setting.",
    whatYouKnow: "Queenstown was named because it was 'fit for Queen Victoria' due to its extreme beauty."
  },
  { 
    name: "Patagonia, Chile", 
    description: "A wild landscape perfect for trekking, featuring the iconic granite towers of Torres del Paine.", 
    image: "/images/Patagonia, Chile.jpg",
    bestTimeToVisit: "November to March (Austral Summer)",
    experience: "Raw and untamed. The wind, the glaciers, and the jagged peaks make you feel like a true explorer.",
    whatYouKnow: "The name Patagonia comes from 'Patagón,' a word used by Magellan to describe the giant locals."
  },
  { 
    name: "Moab, Utah, USA", 
    description: "Explore dramatic red rock arches and canyons via mountain biking or off-road vehicle expeditions.", 
    image: "/images/Moab, Utah, USA.jpg",
    bestTimeToVisit: "March to May or September to October",
    experience: "Rugged desert beauty. Navigating the 'slickrock' on a bike feels like riding on the surface of Mars.",
    whatYouKnow: "Arches National Park, next to Moab, has over 2,000 documented natural stone arches."
  },
  { 
    name: "Banff, Canada", 
    description: "Stunning winter landscape of Lake Louise with turquoise water and snow-covered mountain peaks.", 
    image: "/images/Banff, Canada.jpg",
    bestTimeToVisit: "June to August (Hiking) or Dec to March (Skiing)",
    experience: "Majestic wildlife and icy peaks. Seeing a grizzly bear or a crystal-clear lake is life-changing.",
    whatYouKnow: "Established in 1885, Banff was the first national park in Canada and the third in the world."
  },
  { 
    name: "Skellig Michael, Ireland", 
    description: "Rugged island with ancient stone stairs climbing steep cliffs above the wild Atlantic Ocean.", 
    image: "/images/Skellig Michael, Ireland.jpg",
    bestTimeToVisit: "May to September (Boat tours are weather-dependent)",
    experience: "Isolation and ancient mystery. Climbing the 600 stone steps of the 6th-century monastery is surreal.",
    whatYouKnow: "The island was used as a filming location for 'Luke Skywalker’s island' in recent Star Wars films."
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
    desc: 'A solo traveler in exploration',
    icon: '👤',
    people: '1 Person',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '🥂',
    people: '2 People',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun adventurers',
    icon: '🏠',
    people: '3 to 5 People',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '⛵',
    people: '5 to 10 People',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop'
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '💰',
    image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on the average side',
    icon: '💸',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Luxury',
    desc: 'Don\'t worry about cost',
    icon: '💎',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop'
  },
];

function Chatbox({ tripData, setTripData }: { tripData: any, setTripData: any }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  
  const [step, setStep] = useState(0);
  const [tempDays, setTempDays] = useState(3);
  const [isFinalStep, setIsFinalStep] = useState(false);
  const [generatedTripId, setGeneratedTripId] = useState<string | null>(null);

  const { userDetail } = useUserDetail();
  const saveTrip = useMutation((api as any).trips.saveTrip);
  const router = useRouter();

  const triggerTripGeneration = async (currentTripData: any) => {
    setStep(6);
    const finalTripPrompt = `Mode: 5, Trip Plan Details: Origin: ${currentTripData.from}, Destination: ${currentTripData.to}, Duration: ${currentTripData.days} Days, Traveler: ${currentTripData.travelers}, Budget: ${currentTripData.budget}. ${FINAL_PROMPT}`;
    
    setTimeout(async () => {
      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: `Got it! A ${currentTripData.budget} budget trip to ${currentTripData.to} for ${currentTripData.days} days. Planning your dream trip now...`,
        ui: 'planning_card'
      }]);

      try {
        const result = await axios.post('/api/aimodel', {
          messages: [{ role: 'user', content: finalTripPrompt }]
        });
        
        if (result.data?.ui === 'limit') {
           setMessages((prev: Message[]) => [...prev, {
            role: 'assistant',
            content: result.data.resp,
            ui: 'limit'
          }]);
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

        setGeneratedTripId(tripId);
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: "Your trip is ready! Click the button below to view the full itinerary. ✨",
        }]);
      } catch (error) {
        console.error(error);
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: "Sorry, I couldn't generate the full trip plan. Please try again."
        }]);
      } finally {
        setStep(0);
        setIsLoading(false);
      }
    }, 1500);
  }

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "days_scale") {
      setIsFinalStep(true);
    }
  }, [messages]);

  const onSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;
    setIsLoading(true);
    if (!overrideText) setInput("");
    const newMsg:Message={
      role:'user',
      content:textToSend
    }
    setMessages((prev)=>[...prev,newMsg]);
    try {
      const getDelay = () => Math.floor(Math.random() * 700) + 800;

      // Step-by-Step Trip Creation Flow
      if (textToSend === "Create New Trip") {
        try {
          // Fast limit check before starting the step-by-step flow
          const check = await axios.post('/api/aimodel', {
            messages: [{ role: 'user', content: 'Mode: 1' }]
          });

          if (check.data?.ui === 'limit') {
            setMessages((prev: Message[]) => [...prev, {
              role: 'assistant',
              content: check.data.resp,
              ui: 'limit'
            }]);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error("Initial limit check failed:", e);
        }

        setStep(1);
        setTripData({
          from: '',
          to: '',
          travelers: '',
          budget: '',
          days: null
        });
        setIsFinalStep(false);
        setGeneratedTripId(null);
        setTimeout(() => {
          setMessages((prev: Message[]) => [...prev, {
            role: 'assistant',
            content: "Where are you traveling from? (e.g., London, New York, Mumbai)",
          }]);
          setIsLoading(false);
        }, getDelay());
        return;
      }

      if (step === 1) {
        const fromToRegex = /(?:from\s+)?(.+?)\s+to\s+(.+)/i;
        const match = textToSend.match(fromToRegex);
        
        if (match) {
          const clean = (s: string) => s.replace(/^(i want to (go|travel|travel from)|want to go|trip|travel|from|take me from|going from)\b\s*/i, "").trim();
          let from = clean(match[1]);
          let toPart = match[2];
          
          // Extract days if present
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
            setMessages((prev: Message[]) => [...prev, {
              role: 'assistant',
              content: `Great! You're traveling from ${from} to ${to}${days ? ` for ${days} days` : ""}. Now, how many people will be traveling?`,
              ui: 'travelers'
            }]);
            setIsLoading(false);
          }, getDelay() + 300);
        } else {
          const from = textToSend.replace(/^(i want to travel from|from|want to go from|going from)\b\s*/i, "").trim();
          setTripData((prev: any) => ({ ...prev, from }));
          setStep(2);
          setTimeout(() => {
            setMessages((prev: Message[]) => [...prev, {
              role: 'assistant',
              content: `Great! You're traveling from ${from}. Now, what is your destination?`,
            }]);
            setIsLoading(false);
          }, getDelay());
        }
        return;
      }

      if (step === 2) {
        setTripData((prev: any) => ({ ...prev, to: textToSend }));
        setStep(3);
        setTimeout(() => {
          setMessages((prev: Message[]) => [...prev, {
            role: 'assistant',
            content: "How many people will be traveling? Are you going solo, as a couple, with family, or friends?",
            ui: 'travelers'
          }]);
          setIsLoading(false);
        }, getDelay());
        return;
      }

      const isTravelerMsg = SelectTravelesList.some(item => textToSend.includes(item.title));
      if (step === 3 && isTravelerMsg) {
        const travelersInfo = textToSend.split(':')[0]; // Get the title only
        setTripData((prev: any) => ({ ...prev, travelers: travelersInfo }));
        setStep(4);
        setTimeout(() => {
          setMessages((prev: Message[]) => [...prev, {
            role: 'assistant',
            content: "Thanks! What is your budget for this trip: low, medium, or high?",
            ui: 'budget'
          }]);
          setIsLoading(false);
        }, getDelay());
        return;
      }

      const isBudgetMsg = SelectBudgetOptions.some(item => textToSend === item.title);
      if (step === 4 && isBudgetMsg) {
        setTripData((prev: any) => ({ ...prev, budget: textToSend }));
        
        if (tripData.days) {
          triggerTripGeneration({ ...tripData, budget: textToSend });
          return;
        }

        setStep(5);
        setTimeout(() => {
          setMessages((prev: Message[]) => [...prev, {
            role: 'assistant',
            content: "Almost there! How many days will you be traveling?",
            ui: 'days_scale'
          }]);
          setIsLoading(false);
        }, getDelay());
        return;
      }

      if (step === 5) {
        const finalDays = textToSend.includes("Days") ? textToSend.split(' ')[0] : textToSend;
        const currentTripData = { ...tripData, days: finalDays };
        setTripData(currentTripData);
        triggerTripGeneration(currentTripData);
        return;
      }


      if (textToSend === "Inspire me where to go") {
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: INSPIRE_ME_PLACES
        }]);
        setIsLoading(false);
        return;
      }

      if (textToSend === "Discover Hidden gems") {
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: HIDDEN_GEMS_PLACES
        }]);
        setIsLoading(false);
        return;
      }

      if (textToSend === "Adventure Destination") {
        setMessages((prev: Message[]) => [...prev, {
          role: 'assistant',
          content: ADVENTURE_PLACES_CONST
        }]);
        setIsLoading(false);
        return;
      }

      const result = await axios.post('/api/aimodel', {
        messages: [...messages, newMsg]
      });
      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: result?.data?.resp || "Sorry, I couldn't generate a response.",
        ui: result?.data?.ui
      }]);
      console.log(result.data);
    } catch (error) {
      console.error("Error connecting to AI Trip Planner API:", error);
      setMessages((prev: Message[]) => [...prev, {
        role: 'assistant',
        content: "Oops! We hit an error trying to connect to the AI model."
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-neutral-950 w-full">
      {/* Header - Only render if messages exist as a top bar, else it's part of the hero */}
      {messages.length > 0 && (
        <div className="flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-sm z-10 shrink-0">
          <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">AI Trip Planner</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Online | Ready to plan your dream trip</p>
          </div>
        </div>
      )}

      {/* Messages Area */}

      <section className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center p-4 sm:p-8 mt-4 sm:mt-10 space-y-6 sm:space-y-8 animate-in fade-in duration-500 w-full max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 dark:text-neutral-100 text-center leading-tight tracking-tight">
              Start Planning new <span className="text-red-500">Trip</span> using AI
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center leading-relaxed px-4">
              Discover personalized travel itineraries, find the best destinations, and plan your dream vacation effortlessly with the power of AI. Let our smart assistant do the hard work while you enjoy the journey.
            </p>

            <div className="flex flex-col w-full gap-3 mt-4">
              {[
                { label: "Create New Trip", icon: <Globe className="w-5 h-5 text-blue-500" /> },
                { label: "Inspire me where to go", icon: <Plane className="w-5 h-5 text-red-500" /> },
                { label: "Discover Hidden gems", icon: <Building className="w-5 h-5 text-orange-500" /> },
                { label: "Adventure Destination", icon: <Map className="w-5 h-5 text-yellow-600" /> },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSend(item.label)}
                  className="flex items-center gap-4 p-4 rounded-xl border transition-all text-left shadow-sm cursor-pointer border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:border-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:shadow-md"
                >
                  {item.icon}
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2 group`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[85%] px-5 py-3 rounded-[24px] shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 rounded-bl-none'
            }`}>
              {typeof msg.content === 'string' ? (
                <div>
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.content}
                  </p>
                  
                  {/* Travelers Selection Grid */}
                  {msg.ui === 'travelers' && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {SelectTravelesList.map((item) => (
                        <button 
                          key={item.id} 
                          onClick={() => onSend(item.title)}
                          className="group flex flex-col bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl hover:border-blue-500/50 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 transition-all text-left shadow-sm hover:shadow-xl relative overflow-hidden h-full"
                        >
                          <div className="h-28 w-full overflow-hidden relative">
                             <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                             <span className="absolute top-3 left-3 text-2xl drop-shadow-lg">{item.icon}</span>
                          </div>
                          <div className="p-4 bg-white dark:bg-neutral-900 flex-1">
                             <div className="font-black text-[15px] text-neutral-800 dark:text-neutral-100">{item.title}</div>
                             <div className="text-[11px] font-medium text-neutral-500 mt-1 leading-tight">{item.desc}</div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mt-3">{item.people}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Budget Selection Grid */}
                  {msg.ui === 'budget' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {SelectBudgetOptions.map((item) => (
                        <button 
                          key={item.id} 
                          onClick={() => onSend(item.title)}
                          className="group flex flex-col bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl hover:border-blue-500/50 hover:bg-blue-50/10 dark:hover:bg-blue-900/10 transition-all text-left shadow-sm hover:shadow-xl relative overflow-hidden h-full"
                        >
                          <div className="h-28 w-full overflow-hidden relative">
                             <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                             <span className="absolute top-3 left-3 text-2xl drop-shadow-lg">{item.icon}</span>
                          </div>
                          <div className="p-4 bg-white dark:bg-neutral-900 flex-1">
                             <div className="font-black text-[15px] text-neutral-800 dark:text-neutral-100">{item.title}</div>
                             <div className="text-[11px] font-medium text-neutral-500 mt-1 leading-tight">{item.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Days Scale Slider */}
                  {msg.ui === 'days_scale' && (
                    <div className="flex flex-col gap-4 mt-4 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[14px] font-bold text-gray-600 dark:text-gray-400">Select Duration</span>
                        <span className="text-xl font-black text-blue-600">{tempDays} Days</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="21" 
                        value={tempDays} 
                        onChange={(e) => setTempDays(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1">
                        <span>1 Day</span>
                        <span>10 Days</span>
                        <span>21 Days</span>
                      </div>
                      <button 
                        onClick={() => onSend(`${tempDays} Days`)}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                      >
                        Confirm {tempDays} Days
                      </button>
                    </div>
                  )}

                  {/* Planning Card */}
                  {msg.ui === 'planning_card' && (
                    <div className="flex flex-col items-center justify-center p-10 mt-6 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl rounded-[40px] border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-8 text-center animate-in zoom-in-95 fade-in duration-700 max-w-md mx-auto relative overflow-hidden group">
                      {/* Decorative background elements */}
                      <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-1000"></div>
                      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-1000"></div>
                      
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center border border-red-100 dark:border-red-900/30 shadow-inner scale-110 animate-bounce" style={{ animationDuration: '3s' }}>
                           <Globe className="h-10 w-10 text-red-500 animate-pulse" />
                        </div>
                      </div>

                      <div className="space-y-4 relative z-10">
                        <h3 className="text-3xl font-black tracking-tight text-neutral-800 dark:text-neutral-100">
                          ✈️ <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">Planning</span> your dream trip...
                        </h3>
                        <p className="text-[15px] text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-[280px] mx-auto">
                          Gathering the world's best destinations, hidden activities, and exclusive travel details just for you.
                        </p>
                      </div>

                      <Button 
                        onClick={() => generatedTripId && router.push(`/view-trip/${generatedTripId}`)}
                        disabled={!generatedTripId}
                        className={`w-full bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 text-red-500 rounded-full h-14 font-black shadow-xl shadow-red-500/10 border border-red-100 dark:border-red-900/30 transition-all duration-300 ${!generatedTripId ? 'opacity-90 grayscale-[0.5] cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95 cursor-pointer'}`}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5 animate-spin" />
                            <span>Crafting Itinerary...</span>
                          </div>
                        ) : "View Trip"}
                      </Button>
                    </div>
                  )}

                  {/* Limit Card */}
                  {msg.ui === 'limit' && (
                    <div className="flex flex-col items-center justify-center p-8 mt-4 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-xl rounded-[35px] border border-red-100 dark:border-red-900/30 space-y-4 text-center animate-in zoom-in-95 fade-in duration-500">
                      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                        <Info className="h-8 w-8 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-neutral-800 dark:text-neutral-100">Daily Limit Reached</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed max-w-[200px] mx-auto uppercase tracking-widest">
                          You've used all your credits for today. Please come back tomorrow!
                        </p>
                      </div>
                      <Button 
                        onClick={() => window.location.reload()}
                        className="w-full bg-red-500 text-white rounded-2xl h-12 font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                      >
                        Got it
                      </Button>
                    </div>
                  )}
                </div>
              ) : Array.isArray(msg.content) ? (
                // Destination Cards logic...
                <div className="flex flex-col gap-4 my-2 min-w-[300px]">
                  {msg.content.map((place: any, i: number) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedPlace(place)}
                        className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900 shadow-sm relative group cursor-pointer hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
                      >
                        <img 
                          src={
                            place.image || (messages[idx - 1]?.content === "Inspire me where to go"
                              ? localImages[i % localImages.length]
                              : `https://loremflickr.com/800/400/${encodeURIComponent(place.name)},travel/all`)
                          } 
                          alt={place.name} 
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" 
                          onError={(e) => { e.currentTarget.src = 'https://picsum.photos/800/400?grayscale'; }}
                        />
                        <div className="p-4 z-10 bg-slate-50 dark:bg-neutral-900">
                          <h3 className="font-bold text-lg text-neutral-800 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{place.name || "Destination"}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed line-clamp-2">{place.description}</p>
                          <div className="mt-3 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            Learn more <Sparkles className="ml-1 w-3 h-3" />
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              ) : (
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{JSON.stringify(msg.content, null, 2)}</pre>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-neutral-700 flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                <div className="h-full w-full bg-slate-400 dark:bg-neutral-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* AI Message - Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start items-end gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shrink-0 shadow-lg border border-white/10">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/50 text-neutral-800 dark:text-neutral-200 px-5 py-3 rounded-[24px] rounded-bl-none shadow-sm flex flex-col gap-2 min-w-[120px]">
              <div className="flex items-center gap-1.5 h-4">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 animate-pulse">
                Assistant is thinking...
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Input Area */}
      <section className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
        <div className="relative flex items-center bg-white dark:bg-neutral-900 rounded-2xl p-1 shadow-sm border border-neutral-200 dark:border-neutral-700 focus-within:border-red-500/50 focus-within:ring-2 focus-within:ring-red-500/10 transition-all max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Start typing here..."
            className="w-full min-h-[52px] max-h-[120px] resize-none border-none shadow-none focus-visible:ring-0 text-sm bg-transparent px-4 py-3 placeholder:text-neutral-400 rounded-xl"
            rows={1}
          />
          <div className="pr-2 pb-2 self-end shrink-0">
            <Button
              size="icon"
              onClick={() => onSend()}
              disabled={!input.trim()}
              className="h-10 w-10 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center cursor-pointer"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300 border border-neutral-200 dark:border-neutral-800">
            <button 
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-700 shadow-md z-10 transition-all"
            >
              <X className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
            </button>
            
            <div className="relative h-64 sm:h-80 w-full">
              <img 
                src={selectedPlace.image} 
                alt={selectedPlace.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1 uppercase tracking-tighter">{selectedPlace.name}</h2>
                  <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                    <Calendar className="w-4 h-4" /> 
                    <span>Best Time: {selectedPlace.bestTimeToVisit}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400">
                  <Info className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">About Destination</h3>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg">
                  {selectedPlace.description}
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-slate-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 mb-3 text-red-500">
                    <Compass className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">The Experience</h3>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                    "{selectedPlace.experience}"
                  </p>
                </section>

                <section className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/20">
                  <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Fun Fact</h3>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {selectedPlace.whatYouKnow}
                  </p>
                </section>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => {
                    setSelectedPlace(null);
                    onSend(`Plan a trip to ${selectedPlace.name}`);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-6 h-auto font-bold text-lg shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Plan Trip Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Chatbox
