"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, CloudSun, Car, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'

interface MLAdaptiveTripPanelProps {
  destination: string;
  itinerary: any[];
  onItineraryAdapted?: (adaptedPlan: any) => void;
}

export default function MLAdaptiveTripPanel({ destination, itinerary, onItineraryAdapted }: MLAdaptiveTripPanelProps) {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [customerMessage, setCustomerMessage] = useState<string>('');
  const [adaptedData, setAdaptedData] = useState<any | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleRunAdaptiveML = async (overrideMessage?: string) => {
    setLoading(true);
    const activeMsg = overrideMessage !== undefined ? overrideMessage : customerMessage;
    try {
      const res = await axios.post('/api/ml', {
        action: 'adapt-trip',
        destination,
        travelMonth: selectedMonth,
        customerRequest: activeMsg,
        itinerary
      });
      if (res.data && res.data.data) {
        setAdaptedData(res.data.data);
        if (onItineraryAdapted) {
          onItineraryAdapted(res.data.data);
        }
      }
    } catch (err) {
      console.error("Failed to run adaptive trip ML:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickChip = (msg: string) => {
    setCustomerMessage(msg);
    handleRunAdaptiveML(msg);
  };

  return (
    <div className="bg-gradient-to-br from-neutral-900 via-indigo-950 to-neutral-900 rounded-[32px] p-6 md:p-8 text-white shadow-2xl border border-white/10 space-y-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-[10px] font-black uppercase tracking-wider border border-cyan-400/30">
            <Cpu className="h-3.5 w-3.5" /> Sathi Travel Assistant 🧳
          </div>
          <h3 className="text-2xl font-black tracking-tight">
            Adaptive Itinerary & <span className="text-cyan-400">Plan Customizer</span>
          </h3>
          <p className="text-xs text-neutral-400">
            Customize or reschedule this trip dynamically according to your needs, weather disruptions, or flight delays.
          </p>
        </div>

        {/* Travel Month Selector */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-bold text-gray-400 uppercase">Travel Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs font-extrabold text-white focus:outline-none cursor-pointer"
          >
            {monthNames.map((m, idx) => (
              <option key={idx} value={idx + 1} className="bg-neutral-900 text-white">{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CUSTOMER MESSAGE INPUT BOX */}
      <div className="p-4 md:p-5 bg-black/40 rounded-2xl border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Customer Plan Change Request
          </span>
          <span className="text-[10px] text-gray-400 font-semibold">
            Real-time itinerary re-scheduling
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type customer need (e.g. 'It is raining on Day 2, swap outdoor treks for museums' or 'Flight delayed 3 hours, compress schedule')..."
            value={customerMessage}
            onChange={(e) => setCustomerMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRunAdaptiveML();
              }
            }}
            className="flex-1 px-4 py-3 bg-neutral-900/80 border border-white/15 rounded-xl text-xs md:text-sm font-medium text-white focus:outline-none focus:border-cyan-400 placeholder:text-gray-500"
          />
          <Button
            onClick={() => handleRunAdaptiveML()}
            disabled={loading}
            className="rounded-xl px-5 h-auto bg-cyan-500 hover:bg-cyan-600 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1.5" />
            )}
            Adapt Plan
          </Button>
        </div>

        {/* Quick Disruption & Customer Need Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Suggestions:</span>
          {[
            { label: '🌧️ Rain on Day 2 → Indoor', msg: 'It is raining heavily on Day 2, swap outdoor places for indoor museums and galleries' },
            { label: '🚦 Severe Traffic → Bypass Route', msg: 'Heavy traffic expected, shift departure time and bypass bottle-neck corridors' },
            { label: '✈️ Flight Delay 3h → Compress Day 1', msg: 'Flight delayed by 3 hours, compress Day 1 schedule to express evening spots' },
            { label: '☕ Relaxed Pace → Cafes & Sunset', msg: 'We want a relaxed pace with scenic cafes and sunset promenade' },
            { label: '💰 Budget Optimization', msg: 'Tight budget today, optimize plan for free entry monuments and local bazaars' }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickChip(chip.msg)}
              className="px-2.5 py-1 bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-200 border border-white/10 hover:border-cyan-400/40 rounded-full text-[10px] font-semibold transition-all cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Adapted Result Banner */}
      {adaptedData && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1">
                <CloudSun className="h-3.5 w-3.5 text-amber-400" /> Weather ML Prediction
              </span>
              <p className="text-xs font-bold text-white truncate">{adaptedData.weatherSummary}</p>
            </div>

            <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1">
                <Car className="h-3.5 w-3.5 text-red-400" /> Traffic ML Risk
              </span>
              <p className="text-xs font-bold text-white truncate">{adaptedData.trafficSummary}</p>
            </div>

            <div className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Overall Suitability
              </span>
              <p className="text-xs font-black text-emerald-400">{adaptedData.overallSuitabilityScore} / 100 Score</p>
            </div>

            <div className="p-3.5 bg-cyan-950/40 backdrop-blur-md rounded-2xl border border-cyan-500/30 space-y-1">
              <span className="text-[10px] font-black uppercase text-cyan-300 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Time Saved
              </span>
              <p className="text-xs font-black text-cyan-300">{adaptedData.timeSavedMin || 45} Min Recuperated</p>
            </div>
          </div>

          {adaptedData.customerRequest && (
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs flex items-center justify-between">
              <span className="text-cyan-200">
                ✅ Applied modification: <strong className="text-white">"{adaptedData.customerRequest}"</strong>
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold uppercase">
                Itinerary Updated Live Below
              </span>
            </div>
          )}

          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-black uppercase text-neutral-300 tracking-wider">ML Optimized Days</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {adaptedData.adaptedItinerary?.map((item: any, i: number) => (
                <div key={i} className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                  item.optimizationAction !== 'Optimal' 
                    ? 'bg-cyan-950/40 border-cyan-500/40 shadow-lg shadow-cyan-950/20' 
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-cyan-300">Day {item.day}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-md ${
                      item.optimizationAction !== 'Optimal'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.optimizationAction}
                    </span>
                  </div>
                  <p className="font-semibold text-neutral-200">{item.adaptedPlan}</p>
                  {item.customerNote && (
                    <p className="text-[11px] text-cyan-300 font-medium bg-cyan-950/40 p-1.5 rounded-lg border border-cyan-500/20">
                      💡 {item.customerNote}
                    </p>
                  )}
                  {item.weatherWarning && <p className="text-[10px] text-amber-400 font-medium">{item.weatherWarning}</p>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
