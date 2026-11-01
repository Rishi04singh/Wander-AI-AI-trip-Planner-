"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Globe2, 
  Compass, 
  Gem, 
  Mountain, 
  ArrowDown, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Plane, 
  Zap,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const suggestions = [
  {
    id: "create",
    title: "Create New Trip",
    subtitle: "AI Step-by-Step Wizard",
    action: "create",
    icon: <Globe2 className="text-blue-400 h-4 w-4" />,
    gradient: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-300 hover:border-blue-400 hover:bg-blue-500/20",
    badge: "Most Popular",
  },
  {
    id: "inspire",
    title: "Inspire me where to go",
    subtitle: "Iconic World Wonders",
    action: "inspire",
    icon: <Compass className="text-emerald-400 h-4 w-4" />,
    gradient: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/20",
    badge: "Trending",
  },
  {
    id: "hidden_gems",
    title: "Discover Hidden gems",
    subtitle: "Secret & Offbeat Spots",
    action: "hidden_gems",
    icon: <Gem className="text-purple-400 h-4 w-4" />,
    gradient: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300 hover:border-purple-400 hover:bg-purple-500/20",
    badge: "Unique",
  },
  {
    id: "adventure",
    title: "Adventure Destination",
    subtitle: "Hiking, Thrills & Nature",
    action: "adventure",
    icon: <Mountain className="text-amber-400 h-4 w-4" />,
    gradient: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20",
    badge: "Adrenaline",
  },
];

const quickPromptChips = [
  { label: "🗼 5 Days in Paris", query: "Plan a 5-day romantic trip to Paris with food and cultural highlights" },
  { label: "🍣 7 Days in Tokyo", query: "Plan a 7-day trip to Tokyo exploring Shibuya, Akihabara, and Mount Fuji" },
  { label: "🏔️ Swiss Alps Skiing", query: "Plan a 6-day winter adventure in Interlaken and Swiss Alps" },
  { label: "🌴 Bali Luxury Escape", query: "Plan a relaxing 5-day luxury villa vacation in Bali with beaches" },
  { label: "🏰 Rajasthan Royal Tour", query: "Plan a 4-day heritage trip to Jaipur and Udaipur" },
];

const backgrounds = [
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=3506&auto=format&fit=crop",
    alt: "Beautiful mountains and lake",
    location: "Banff National Park, Canada",
  },
  {
    src: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=3540&auto=format&fit=crop",
    alt: "Eiffel tower in Paris during sunset",
    location: "Paris, France",
  },
  {
    src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=3542&auto=format&fit=crop",
    alt: "Beautiful beach and house",
    location: "Maldives Luxury Atolls",
  },
  {
    src: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=3552&auto=format&fit=crop",
    alt: "Snowy mountain peaks",
    location: "Zermatt, Swiss Alps",
  },
];

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [promptText, setPromptText] = useState("");
  const [activeTab, setActiveTab] = useState<"ai_prompt" | "quick_book">("ai_prompt");
  const [quickOrigin, setQuickOrigin] = useState("");
  const [quickDest, setQuickDest] = useState("");
  const [quickDays, setQuickDays] = useState("5");
  const [isNavigating, setIsNavigating] = useState(false);

  const router = useRouter();
  const { user } = useUser();

  // Direct 1-Click Navigation Helper
  const navigateToTrip = (params: { action?: string; prompt?: string; from?: string; to?: string; days?: string }) => {
    setIsNavigating(true);
    const query = new URLSearchParams();
    if (params.action) query.set("action", params.action);
    if (params.prompt) query.set("prompt", params.prompt);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    if (params.days) query.set("days", params.days);

    const targetUrl = `/create-new-trip${query.toString() ? `?${query.toString()}` : ""}`;

    if (!user) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(targetUrl)}`);
    } else {
      router.push(targetUrl);
    }
  };

  const handlePromptSubmit = () => {
    if (!promptText.trim()) {
      navigateToTrip({ action: "create" });
      return;
    }
    navigateToTrip({ prompt: promptText.trim() });
  };

  const handleQuickTripSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToTrip({
      action: "create",
      from: quickOrigin.trim() || undefined,
      to: quickDest.trim() || undefined,
      days: quickDays || "5",
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + backgrounds.length) % backgrounds.length);
  };

  return (
    <section className="relative w-full min-h-screen flex justify-center items-center overflow-hidden pt-20 pb-16">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={backgrounds[currentIndex].src}
              alt={backgrounds[currentIndex].alt}
              fill
              className="object-cover contrast-[1.08] saturate-[1.2] brightness-90"
              priority
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-transparent to-neutral-950/70" />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/15 blur-[140px] pointer-events-none rounded-full" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl text-center space-y-8 px-4 sm:px-6">
        
        {/* Floating AI Engine Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs sm:text-sm font-semibold text-white shadow-2xl"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-indigo-300 font-bold">Wanderer 3.0</span>
          <span className="text-white/40">|</span>
          <span className="text-gray-200">Curated Travel Planner & Route Guide</span>
        </motion.div>

        {/* Hero Heading */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-2xl leading-[1.15] font-sans">
            Plan Smarter. Travel Better.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-200 drop-shadow-md">
              Built for Explorers.
            </span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed drop-shadow">
            Instant day-wise itineraries, real-time hotel & flight suggestions, 3D interactive route visualization, and budget estimation in seconds.
          </p>
        </motion.div>

        {/* DIRECT 1-CLICK ACTION CARDS */}
        {/* Clicking any card navigates IMMEDIATELY without redundant prompt filling */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto"
        >
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateToTrip({ action: item.action })}
              disabled={isNavigating}
              className={`group relative flex flex-col items-start p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 text-left cursor-pointer shadow-xl hover:scale-[1.03] active:scale-[0.98] ${item.gradient}`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="p-2 rounded-xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-300/80 font-medium line-clamp-1 mt-0.5">
                {item.subtitle}
              </p>
              <div className="mt-2.5 flex items-center text-[11px] font-bold text-white/90 group-hover:translate-x-1 transition-transform">
                Launch <ChevronRight className="w-3 h-3 ml-0.5 text-indigo-300" />
              </div>
            </button>
          ))}
        </motion.div>

        {/* Sathi Travel Intelligence & Trip Calendar Highlights (Prominent on Mobile & Desktop) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto w-full text-left"
        >
          <Link
            href="/sathi"
            className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-neutral-900/90 backdrop-blur-xl hover:border-emerald-400 hover:bg-emerald-950/60 transition-all shadow-xl active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                    Sathi AI Suite 🧳
                  </h4>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    4 ML Models
                  </span>
                </div>
                <p className="text-xs text-gray-300/80 mt-0.5 line-clamp-1">
                  Weather forecast, traffic delays & dynamic rescheduling
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
          </Link>

          <Link
            href="/calendar"
            className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-neutral-900/90 backdrop-blur-xl hover:border-amber-400 hover:bg-amber-950/60 transition-all shadow-xl active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                    Calendar & Targets 📅
                  </h4>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Tracker
                  </span>
                </div>
                <p className="text-xs text-gray-300/80 mt-0.5 line-clamp-1">
                  Monthly agenda, daily budget caps & trip milestones
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
          </Link>
        </motion.div>

        {/* DUAL PLANNER CONTAINER (AI Prompt & Quick Builder) */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Ambient Glow behind box */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-blue-500/40 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500" />

          <div className="relative border border-white/20 rounded-3xl p-4 sm:p-5 bg-neutral-950/80 backdrop-blur-2xl shadow-2xl transition-all">
            
            {/* Tabs for Mode Selection */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("ai_prompt")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "ai_prompt"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>AI Natural Language</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("quick_book")}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "quick_book"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Fast Route Planner</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-gray-400">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white text-[10px]">Enter</kbd>
                <span>to plan</span>
              </div>
            </div>

            {/* TAB 1: AI Prompt Input */}
            {activeTab === "ai_prompt" && (
              <div className="space-y-3">
                <Textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handlePromptSubmit();
                    }
                  }}
                  placeholder="e.g. Plan a 7-day cultural trip to Tokyo and Kyoto for 2 people with a moderate budget..."
                  className="w-full min-h-[90px] sm:min-h-[100px] resize-none border-none shadow-none focus-visible:ring-0 text-white text-base sm:text-lg bg-transparent p-2 sm:p-3 placeholder:text-gray-400 font-sans"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
                  <div className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
                    <span>Auto-generates hotels, day-by-day activities & routes</span>
                  </div>

                  <Button
                    size="lg"
                    onClick={handlePromptSubmit}
                    disabled={isNavigating}
                    className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-2xl shadow-xl hover:shadow-indigo-500/30 transition-all px-7 py-5 gap-2.5 text-base font-bold border border-indigo-400/30 active:scale-95 cursor-pointer"
                  >
                    <span>{isNavigating ? "Launching..." : "Plan Trip"}</span>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: Quick Fast Route Planner */}
            {activeTab === "quick_book" && (
              <form onSubmit={handleQuickTripSubmit} className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                      <Plane className="w-3 h-3 text-indigo-400" /> Flying From
                    </label>
                    <input
                      type="text"
                      value={quickOrigin}
                      onChange={(e) => setQuickOrigin(e.target.value)}
                      placeholder="e.g. London, NYC, Mumbai"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" /> Destination
                    </label>
                    <input
                      type="text"
                      value={quickDest}
                      onChange={(e) => setQuickDest(e.target.value)}
                      placeholder="e.g. Paris, Tokyo, Bali"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-400 focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" /> Duration (Days)
                    </label>
                    <select
                      value={quickDays}
                      onChange={(e) => setQuickDays(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-400 transition-all cursor-pointer"
                    >
                      <option value="3">3 Days (Weekend Escape)</option>
                      <option value="5">5 Days (Popular Choice)</option>
                      <option value="7">7 Days (Full Week Adventure)</option>
                      <option value="10">10 Days (Deep Exploration)</option>
                      <option value="14">14 Days (Grand Vacation)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs text-gray-400">
                    Takes you straight into the interactive 3D trip copilot
                  </span>

                  <Button
                    type="submit"
                    disabled={isNavigating}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl shadow-xl px-8 py-5 text-base font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Instant Launch</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </form>
            )}

            {/* Quick Prompt Pill Badges */}
            <div className="pt-3 mt-2 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-gray-400 shrink-0">Try:</span>
              {quickPromptChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPromptText(chip.query);
                    navigateToTrip({ prompt: chip.query });
                  }}
                  className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>{chip.label}</span>
                  <ChevronRight className="w-2.5 h-2.5 text-indigo-400" />
                </button>
              ))}
            </div>

          </div>
        </motion.div>

        {/* Location Caption & Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-col items-center justify-center pt-4"
        >
          <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mb-3 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Featured: {backgrounds[currentIndex].location}</span>
          </div>

          <div 
            onClick={() => {
              window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" });
            }}
            className="flex items-center gap-2 cursor-pointer group text-gray-300 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            <span>Explore Destinations Below</span>
            <ArrowDown className="h-4 w-4 text-indigo-400 group-hover:translate-y-1 transition-transform animate-bounce" />
          </div>
        </motion.div>
        
      </div>

      {/* Carousel Navigation Controls - Left/Right Arrows */}
      <div className="absolute z-20 top-1/2 left-3 sm:left-6 -translate-y-1/2">
        <button 
          onClick={prevSlide}
          aria-label="Previous slide"
          className="p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 border border-white/15 backdrop-blur-md text-white transition-all group cursor-pointer shadow-xl"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
      <div className="absolute z-20 top-1/2 right-3 sm:right-6 -translate-y-1/2">
        <button 
          onClick={nextSlide}
          aria-label="Next slide"
          className="p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 border border-white/15 backdrop-blur-md text-white transition-all group cursor-pointer shadow-xl"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {backgrounds.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex ? "w-8 h-2 bg-indigo-500 shadow-[0_0_10px_#6366f1]" : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;

