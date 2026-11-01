"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";

export function Popularcitylist() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-24 bg-black/95 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-black/95 pointer-events-none" />
      <div className="max-w-7xl mx-auto pl-4 md:pl-8 mb-12 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white font-sans tracking-tight drop-shadow-lg">
          Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Destinations</span>
        </h2>
        <p className="text-gray-400 mt-5 text-lg md:text-xl max-w-2xl font-medium tracking-wide">
          Discover the most sought-after places for your next adventure. Click any destination to view details and launch your customized AI travel plan in one click.
        </p>
      </div>
      <div className="relative z-10">
        <Carousel items={cards} />
      </div>
    </div>
  );
}

const DestinationContent = ({ 
  cityName,
  description, 
  facts, 
  img 
}: { 
  cityName: string;
  description: string;
  facts: string[];
  img: string;
}) => {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="bg-neutral-800/50 backdrop-blur-md p-8 md:p-14 rounded-3xl border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm tracking-wider uppercase">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Curated Destination Guide</span>
          </div>

          <Button
            onClick={() => router.push(`/create-new-trip?to=${encodeURIComponent(cityName)}&action=create`)}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-2xl px-6 py-5 text-sm font-bold shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plan Trip to {cityName.split(',')[0]}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-gray-200 text-lg md:text-2xl font-sans max-w-4xl mx-auto leading-relaxed mt-6">
          {description}
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {facts.map((fact, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
              <p className="text-gray-300 text-sm md:text-base font-medium">{fact}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <Image 
          src={img} 
          alt="Destination Detail" 
          fill 
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
    </div>
  );
};

const data = [
  {
    category: "Paris, France",
    title: "The Iconic City of Lights",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2600&auto=format&fit=crop",
    content: (
      <DestinationContent 
        cityName="Paris, France"
        description="Experience the romance and history of Paris. From the majestic Eiffel Tower to the world-renowned Louvre Museum, every corner of this city tells a story of art, culture, and culinary excellence."
        facts={[
          "Home to the Eiffel Tower, the icon of France",
          "The Louvre is the world's largest art museum",
          "Famous for its world-class pastry and café culture",
          "Known as the 'Fashion Capital' of the world"
        ]}
        img="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=3540&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "New York, USA",
    title: "The City That Never Sleeps",
    src: "https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?q=80&w=1170&auto=format&fit=crop",
    content: (
      <DestinationContent 
        cityName="New York, USA"
        description="Step into the electric energy of New York City. Marvel at the skyscrapers of Manhattan, catch a legendary Broadway show, and find tranquility in the sprawling greenery of Central Park."
        facts={[
          "Times Square: The Crossroads of the World",
          "Empire State Building: A historic Art Deco icon",
          "Central Park: Over 800 acres of urban bliss",
          "The Statue of Liberty: A symbol of freedom"
        ]}
        img="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=3540&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Tokyo, Japan",
    title: "Where Tradition Meets Future",
    src: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=735&auto=format&fit=crop",
    content: (
      <DestinationContent 
        cityName="Tokyo, Japan"
        description="Tokyo is a breathtaking blend of ancient temples and futuristic technology. Explore the neon-lit streets of Shinjuku and find peace in the historic Meiji Jingu Shrine."
        facts={[
          "Shibuya Crossing: The world's busiest intersection",
          "Mount Fuji: Reachable within a short day trip",
          "World-class sushi and Michelin-starred dining",
          "Home to the largest fish market in the world"
        ]}
        img="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=3540&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Rome, Italy",
    title: "An Eternal Open-Air Museum",
    src: "https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1170&auto=format&fit=crop",
    content: (
      <DestinationContent 
        cityName="Rome, Italy"
        description="Rome is a journey through time. Walk the paths of gladiators at the Colosseum and witness the spiritual and artistic grandeur of the Vatican City."
        facts={[
          "The Colosseum: The largest amphitheatre ever built",
          "The Trevi Fountain: A masterpiece of Baroque art",
          "Vatican Museums: Home to the Sistine Chapel",
          "Italian Cuisine: Pizza, Pasta, and authentic Gelato"
        ]}
        img="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=3540&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Dubai, UAE",
    title: "Innovation in the Desert",
    src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
    content: (
      <DestinationContent 
        cityName="Dubai, UAE"
        description="Dubai is a testament to human ambition. From the world's tallest building to artificial palm-shaped islands, it's a hub of luxury and modern engineering."
        facts={[
          "Burj Khalifa: The tallest structure in the world",
          "Dubai Mall: One of the world's largest shopping hubs",
          "Desert Safari: Thrilling dune bashing experiences",
          "Palm Jumeirah: An iconic man-made archipelago"
        ]}
        img="https://images.unsplash.com/photo-1518684079-3c830dffe094?q=80&w=3540&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "India",
    title: "A Land of Rich Heritage",
    src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1171&auto=format&fit=crop",
    content: (
      <DestinationContent 
        cityName="India"
        description="India offers a vibrant tapestry of landscapes and cultures. From the majestic Taj Mahal to the spiritual ghats of Varanasi, it's a sensory journey like no other."
        facts={[
          "Taj Mahal: A world-famous symbol of love",
          "Unity through massive cultural diversity",
          "Famous for various styles of classical dance",
          "Birthplace of Yoga and spiritual meditation"
        ]}
        img="https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=3540&auto=format&fit=crop"
      />
    ),
  },
];
