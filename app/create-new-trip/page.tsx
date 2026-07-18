"use client"
import React, { useState } from "react";
import Chatbox from "./_components/Chatbox";
import GlobeView from "./_components/GlobeView";

function CreateNewTrip() {
  const [tripData, setTripData] = useState<any>({
    from: '',
    to: '',
    travelers: '',
    budget: '',
    days: null
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-12 mt-20 md:mt-24 min-h-screen bg-slate-50 dark:bg-neutral-950 transition-colors">
      {/* Left Column - Chatbox */}
      <div className="bg-white dark:bg-neutral-900 rounded-[32px] md:rounded-[40px] h-[550px] md:h-[800px] flex flex-col shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden relative">
        <Chatbox tripData={tripData} setTripData={setTripData} /> 
      </div>
      
      {/* Right Column - Interactive Globe */}
      <div className="bg-black dark:bg-neutral-900 rounded-[32px] md:rounded-[40px] h-[350px] md:h-[800px] flex items-center justify-center shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden relative ring-1 ring-white/10">
        <GlobeView destination={tripData.to} origin={tripData.from} />
      </div>
    </div>
  );
}

export default CreateNewTrip;