"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Globe2, Compass, Gem, Mountain, ArrowDown, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

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

const backgrounds = [
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=3506&auto=format&fit=crop",
    alt: "Beautiful mountains and lake",
  },
  {
    src: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=3540&auto=format&fit=crop",
    alt: "Eiffel tower in Paris during sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=3542&auto=format&fit=crop",
    alt: "Beautiful beach and house",
  },
  {
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=3552&auto=format&fit=crop",
    alt: "Snowy mountain peaks",
  },
];

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { user } = useUser();

  const onSend = () => {
    if (!user) {
      router.push("/sign-in?redirect_url=/create-new-trip");
      return;
    }
    router.push("/create-new-trip");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + backgrounds.length) % backgrounds.length);
  };

  return (
    <section className="relative w-full min-h-screen flex justify-center items-center overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={backgrounds[currentIndex].src}
              alt={backgrounds[currentIndex].alt}
              fill
              className="object-cover contrast-110 saturate-[1.15]"
              priority
            />
            {/* Lightened Gradient Overlay for better clarity while maintaining text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl text-center space-y-10 px-4 mt-20">
        
        {/* Heading */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 pt-10"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-xl font-sans text-balance leading-tight">
            Hey, I'm your personal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Trip Planner</span>
          </h1>

          <p className="text-gray-200 text-base md:text-xl lg:text-2xl max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Tell me what you want and I'll handle the rest — Flights, Hotels,
            and Trip Planning in seconds.
          </p>
        </motion.div>

        {/* AI Prompt Box */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative group max-w-3xl mx-auto mt-8"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative border border-white/20 rounded-3xl p-3 bg-black/40 backdrop-blur-xl shadow-2xl flex flex-col transition-all">
            <Textarea
              placeholder="Create a trip for Paris from New York..."
              className="w-full min-h-[120px] resize-none border-none shadow-none focus-visible:ring-0 text-white text-lg md:text-xl bg-transparent p-4 placeholder:text-gray-400"
            />

            {/* Send Button */}
            <div className="flex justify-between items-center px-4 pb-2">
              <div className="text-xs md:text-sm text-gray-400 font-medium">✨ Powered by AI</div>
              <Button
                size="lg"
                onClick={onSend}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-indigo-500/25 transition-all px-8 py-6 gap-3 text-lg font-semibold"
              >
                <span>Plan Trip</span>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Suggestions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center flex-wrap gap-3 mt-6"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => {
                if (suggestion.title === "Create New Trip") {
                  onSend();
                }
              }}
              className="flex items-center gap-2 border border-white/10 px-5 py-2.5 rounded-full text-sm font-medium bg-black/30 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all shadow-lg"
            >
              {suggestion.icon}
              <span>{suggestion.title}</span>
            </div>
          ))}
        </motion.div>

        {/* See how it works */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex justify-center mt-12 mb-8"
        >
          <div className="flex flex-col items-center gap-3 cursor-pointer group">
            <p className="text-gray-300 text-sm md:text-base font-medium tracking-wide flex items-center gap-2">
              Not sure where to start?
              <span className="font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                See how it works
              </span>
            </p>
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
              <ArrowDown className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 animate-bounce" />
            </div>
          </div>
        </motion.div>
        
      </div>

      {/* Carousel Navigation Controls - Left/Right Arrows */}
      <div className="absolute z-20 top-1/2 left-4 md:left-8 -translate-y-1/2">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 backdrop-blur-sm text-white transition-all group"
        >
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="absolute z-20 top-1/2 right-4 md:right-8 -translate-y-1/2">
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 backdrop-blur-sm text-white transition-all group"
        >
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {backgrounds.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex ? "w-8 h-2 bg-indigo-500" : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;
