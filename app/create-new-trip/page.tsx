"use client";

import React, { useState, Suspense } from "react";
import Chatbox from "./_components/Chatbox";
import GlobeView from "./_components/GlobeView";
import { Sparkles, Globe, MessageSquare, Compass, RotateCcw } from "lucide-react";
import Link from "next/link";

function CreateNewTripInner() {
  const [tripData, setTripData] = useState<any>({
    from: "",
    to: "",
    travelers: "",
    budget: "",
    days: null,
  });

  const [mobileTab, setMobileTab] = useState<"chat" | "globe">("chat");

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Status Bar */}
      <div className="max-w-7xl mx-auto mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Home</span>
            <span className="text-gray-600">/</span>
          </Link>
          <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Trip Studio
          </span>
          {tripData.to && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Target: {tripData.to}
            </span>
          )}
        </div>

        {/* Mobile View Toggle (Hidden on desktop) */}
        <div className="flex md:hidden items-center p-1 bg-white/5 rounded-2xl border border-white/10 self-start">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mobileTab === "chat"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
          <button
            onClick={() => setMobileTab("globe")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mobileTab === "globe"
                ? "bg-indigo-600 text-white shadow"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Earth</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns on Desktop */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Left Column - AI Chatbox & Planner Wizard */}
        <div
          className={`bg-neutral-900/90 backdrop-blur-2xl rounded-[32px] sm:rounded-[40px] h-[780px] sm:h-[820px] flex flex-col shadow-2xl border border-white/10 overflow-hidden relative ${
            mobileTab === "chat" ? "block" : "hidden md:flex"
          }`}
        >
          <Chatbox tripData={tripData} setTripData={setTripData} />
        </div>

        {/* Right Column - Interactive 3D Planet Earth */}
        <div
          className={`bg-black rounded-[32px] sm:rounded-[40px] h-[780px] sm:h-[820px] flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden relative ring-1 ring-white/5 ${
            mobileTab === "globe" ? "block" : "hidden md:flex"
          }`}
        >
          <GlobeView destination={tripData.to} origin={tripData.from} />
        </div>
      </div>
    </div>
  );
}

export default function CreateNewTrip() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-400 tracking-wider">
            Loading AI Trip Studio...
          </p>
        </div>
      }
    >
      <CreateNewTripInner />
    </Suspense>
  );
}