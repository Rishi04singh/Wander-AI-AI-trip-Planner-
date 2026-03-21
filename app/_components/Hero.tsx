import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Globe2,
  Compass,
  Gem,
  Mountain,
  ArrowDown,
} from "lucide-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

const suggestions = [
  {
    title: "Create New Trip",
    icon: <Globe2 className="text-blue-500 h-4 w-4" />,
  },
  {
    title: "Inspire me where to go",
    icon: <Compass className="text-green-500 h-4 w-4" />,
  },
  {
    title: "Discover Hidden gems",
    icon: <Gem className="text-purple-500 h-4 w-4" />,
  },
  {
    title: "Adventure Destination",
    icon: <Mountain className="text-yellow-500 h-4 w-4" />,
  },
];

function Hero() {
  return (
    <section className="w-full flex justify-center items-center mt-24 px-4">
      <div className="w-full max-w-3xl text-center space-y-10">

        {/* Heading */}
        <div className="space-y-6 pt-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 drop-shadow-sm">
            Hey, I'm your personal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">Trip Planner</span>
          </h1>

          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-xl lg:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
            Tell me what you want and I'll handle the rest — Flights, Hotels,
            and Trip Planning in seconds.
          </p>
        </div>

        {/* AI Prompt Box */}
        <div className="relative group max-w-2xl mx-auto mt-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative border border-neutral-200 dark:border-neutral-800 rounded-2xl p-2 bg-white dark:bg-neutral-900 shadow-xl flex flex-col transition-all">
            <Textarea
              placeholder="Create a trip for Paris from New York..."
              className="w-full min-h-[120px] resize-none border-none shadow-none focus-visible:ring-0 text-lg bg-transparent p-4 placeholder:text-neutral-400"
            />

            {/* Send Button */}
            <div className="flex justify-end p-2">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all px-6 gap-2"
              >
                <span>Plan Trip</span>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex justify-center gap-3 overflow-x-auto whitespace-nowrap no-scrollbar">

          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm bg-white hover:bg-gray-100 cursor-pointer transition shadow-sm"
            >
              {suggestion.icon}
              <span className="font-medium">{suggestion.title}</span>
            </div>
          ))}

        </div>

        {/* See how it works */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 cursor-pointer group">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base whitespace-nowrap">
              Not sure where to start?
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 ml-1">
                See how it works
              </span>
            </p>

            <ArrowDown className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-bounce transition-transform group-hover:translate-y-1" />
          </div>
        </div>

        {/* Video Section */}
        <div className="flex justify-center pt-4">
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc="https://www.example.com/dummy-video"
            thumbnailSrc="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070"
            thumbnailAlt="Travel inspiration video"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;