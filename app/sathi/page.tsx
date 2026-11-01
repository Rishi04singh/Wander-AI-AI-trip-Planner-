"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Compass, 
  CloudSun, 
  Car, 
  Cpu, 
  Heart, 
  Users, 
  MapPin, 
  Sliders, 
  IndianRupee, 
  ShieldCheck, 
  Sun, 
  CheckCircle2, 
  ChevronRight,
  Clock,
  AlertTriangle,
  Umbrella,
  Thermometer,
  Eye,
  Check,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Zap,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SathiPage() {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<'recommend' | 'weather' | 'traffic' | 'adapt'>('recommend');

  // Input States
  const [budgetINR, setBudgetINR] = useState<number>(3500);
  const [categoryPreference, setCategoryPreference] = useState<string>('All');
  const [travelMonth, setTravelMonth] = useState<number>(new Date().getMonth() + 1);
  const [travelCompanion, setTravelCompanion] = useState<'Solo' | 'Couple' | 'Family' | 'Friends'>('Friends');
  const [selectedDestination, setSelectedDestination] = useState<string>('Manali & Solang Valley');

  // Results & Loading
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [modelName, setModelName] = useState<string>('');
  const [weatherResult, setWeatherResult] = useState<any>(null);
  const [trafficResult, setTrafficResult] = useState<any>(null);
  const [adaptResult, setAdaptResult] = useState<any>(null);
  const [checkedPackingItems, setCheckedPackingItems] = useState<Record<string, boolean>>({});
  const [routeType, setRouteType] = useState<string>('City-to-Attraction');
  const [customerRequest, setCustomerRequest] = useState<string>('');
  const [destinationSearch, setDestinationSearch] = useState<string>('');

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const popularDestinations = [
    'Goa Beaches & Forts',
    'Manali & Solang Valley',
    'Jaipur (Pink City)',
    'Munnar Tea Gardens',
    'Varanasi (Kashi)',
    'Leh & Ladakh',
    'Udaipur (City of Lakes)',
    'Agra (Taj Mahal)',
    'Rishikesh & Haridwar',
    'Ooty & Nilgiri Hills'
  ];

  const indianPlacesList = [
    'Manali & Solang Valley',
    'Goa Beaches & Forts',
    'Leh & Ladakh',
    'Jaipur (Pink City)',
    'Kerala Backwaters (Alleppey)',
    'Varanasi (Kashi)',
    'Udaipur (City of Lakes)',
    'Rishikesh & Haridwar',
    'Munnar Tea Gardens',
    'Darjeeling & Kanchenjunga',
    'Agra (Taj Mahal)',
    'Shimla (Queen of Hills)',
    'Ooty & Nilgiri Hills',
    'Hampi Heritage Ruins'
  ];

  const fetchPredictions = async (overrideRequest?: string) => {
    setLoading(true);
    try {
      const activeReq = overrideRequest !== undefined ? overrideRequest : customerRequest;
      if (activeMode === 'recommend') {
        const categoryParam = categoryPreference === 'All' ? undefined : categoryPreference;
        const res = await axios.post('/api/ml', {
          action: 'recommend',
          budgetINR,
          categoryPreference: categoryParam,
          travelMonth,
          travelCompanion
        });
        setRecommendations(res.data.data || []);
        setModelName(res.data.model || 'Kaggle ML Recommender');
      } else if (activeMode === 'weather') {
        const res = await axios.post('/api/ml', {
          action: 'weather',
          destination: selectedDestination,
          travelMonth
        });
        setWeatherResult(res.data.data || null);
        setModelName(res.data.model || 'Kaggle Indian Climate HistGradientBoosting Model');
      } else if (activeMode === 'traffic') {
        const res = await axios.post('/api/ml', {
          action: 'traffic',
          destination: selectedDestination,
          travelMonth,
          travelCompanion,
          routeType
        });
        setTrafficResult(res.data.data || null);
        setModelName(res.data.model || 'Kaggle Indian Traffic Gradient Boosting Model');
      } else if (activeMode === 'adapt') {
        const sampleItinerary = [
          { day: 1, day_plan: 'Outdoor Sightseeing & Hillside Trek', best_time_to_visit_day: '9:00 AM' },
          { day: 2, day_plan: 'Local Markets & Historical Forts Tour', best_time_to_visit_day: '1:00 PM' },
          { day: 3, day_plan: 'River Activities & Sunset Point Visit', best_time_to_visit_day: '5:00 PM' }
        ];
        const res = await axios.post('/api/ml', {
          action: 'adapt-trip',
          destination: selectedDestination,
          travelMonth,
          customerRequest: activeReq,
          itinerary: sampleItinerary
        });
        setAdaptResult(res.data.data || null);
        setModelName(res.data.model || 'Multi-Factor ML Adaptive Optimizer');
      }
    } catch (err) {
      console.error("Sathi prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [activeMode, travelMonth, budgetINR, categoryPreference, travelCompanion, selectedDestination, routeType]);

  const handleApplyQuickRequest = (reqText: string) => {
    setCustomerRequest(reqText);
    fetchPredictions(reqText);
  };

  const togglePackingItem = (item: string) => {
    setCheckedPackingItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-neutral-900 to-black rounded-[36px] p-8 md:p-12 text-white shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/15 via-indigo-500/15 to-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-amber-300 text-xs font-bold tracking-wide">
            <Sparkles className="h-4 w-4 text-amber-400" /> Sathi – Intelligent India Travel Companion
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Explore India with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-300 to-cyan-300">Sathi</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Comprehensive travel intelligence across Indian destinations. Plan with confidence through personalized place recommendations, regional weather insights, transit delay estimates, and adaptive daily scheduling.
          </p>
        </div>
      </div>

      {/* Feature Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: 'recommend', label: 'Place Recommender', icon: Compass, badge: 'Curated Picks', desc: 'Personalized Indian Rankings' },
          { id: 'weather', label: 'Weather Forecast', icon: CloudSun, badge: 'Climate Guide', desc: 'Climate & Monsoon Risk' },
          { id: 'traffic', label: 'Traffic & Delay Risk', icon: Car, badge: 'Transit Guide', desc: 'Bottleneck & Route Advisor' },
          { id: 'adapt', label: 'Adaptive Trip Plan', icon: Cpu, badge: 'Smart Rescheduler', desc: 'Dynamic Route Optimizer' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMode(tab.id as any)}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all text-left cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30 ring-4 ring-indigo-500/20'
                  : 'bg-neutral-900 text-neutral-200 border-white/10 hover:border-white/20 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`h-6 w-6 ${isActive ? 'text-amber-300' : 'text-indigo-400'}`} />
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400'}`}>
                  {tab.badge}
                </span>
              </div>
              <div className="mt-4">
                <span className="font-extrabold text-sm md:text-base block">{tab.label}</span>
                <span className={`text-[11px] block mt-0.5 ${isActive ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {tab.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Streamlined Filter Controls Bar */}
      <div className="bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">
              {activeMode === 'recommend' && 'Place Recommendation Parameters'}
              {activeMode === 'weather' && 'Weather & Microclimate Query'}
              {activeMode === 'traffic' && 'Transit & Delay Corridor Filters'}
              {activeMode === 'adapt' && 'Adaptive Rescheduler & Customer Instructions'}
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
            🇮🇳 Real Indian Kaggle ML Models (325 Destinations)
          </span>
        </div>

        {/* MODE 1: PLACE RECOMMENDER FILTERS */}
        {activeMode === 'recommend' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" /> Travel Companion
              </label>
              <select
                value={travelCompanion}
                onChange={(e) => setTravelCompanion(e.target.value as any)}
                className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="Solo" className="bg-neutral-900 text-white">Solo Travel 🎒</option>
                <option value="Couple" className="bg-neutral-900 text-white">Couple / Romantic 💑</option>
                <option value="Family" className="bg-neutral-900 text-white">Family Trip 👨‍👩‍👧‍👦</option>
                <option value="Friends" className="bg-neutral-900 text-white">Friends Group 🥳</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Daily Budget
              </label>
              <select
                value={budgetINR}
                onChange={(e) => setBudgetINR(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value={2500} className="bg-neutral-900 text-white">Budget (₹2,500 / day)</option>
                <option value={3500} className="bg-neutral-900 text-white">Balanced (₹3,500 / day)</option>
                <option value={5000} className="bg-neutral-900 text-white">Comfort (₹5,000 / day)</option>
                <option value={7500} className="bg-neutral-900 text-white">Luxury (₹7,500+ / day)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" /> Category Vibe
              </label>
              <select
                value={categoryPreference}
                onChange={(e) => setCategoryPreference(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="All" className="bg-neutral-900 text-white">All Vibe Types</option>
                <option value="Adventure" className="bg-neutral-900 text-white">Adventure & Snow 🏔️</option>
                <option value="Beach" className="bg-neutral-900 text-white">Beaches & Coastal 🏖️</option>
                <option value="Cultural" className="bg-neutral-900 text-white">Royal Forts & Culture 🏰</option>
                <option value="Relaxation" className="bg-neutral-900 text-white">Backwaters & Nature 🚣</option>
                <option value="Spiritual" className="bg-neutral-900 text-white">Spiritual & Ghats 🕉️</option>
                <option value="Luxury" className="bg-neutral-900 text-white">Luxury Palaces 👑</option>
                <option value="Nature" className="bg-neutral-900 text-white">Lakes & Green Hills 🌿</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Travel Month
              </label>
              <select
                value={travelMonth}
                onChange={(e) => setTravelMonth(Number(e.target.value))}
                className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                {monthNames.map((m, idx) => (
                  <option key={idx} value={idx + 1} className="bg-neutral-900 text-white">
                    {m} ({idx + 1})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* MODE 2: WEATHER FORECAST FILTERS */}
        {activeMode === 'weather' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" /> Target Indian Destination
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {indianPlacesList.map((dest, i) => (
                    <option key={i} value={dest} className="bg-neutral-900 text-white">
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Travel Month
                </label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {monthNames.map((m, idx) => (
                    <option key={idx} value={idx + 1} className="bg-neutral-900 text-white">
                      {m} ({idx + 1})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Destination Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Popular Hubs:</span>
              {popularDestinations.slice(0, 6).map((dest, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedDestination === dest
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {dest.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODE 3: TRAFFIC & DELAY FILTERS */}
        {activeMode === 'traffic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" /> Target Indian Destination
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {indianPlacesList.map((dest, i) => (
                    <option key={i} value={dest} className="bg-neutral-900 text-white">
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-amber-400" /> Route Corridor Type
                </label>
                <select
                  value={routeType}
                  onChange={(e) => setRouteType(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="City-to-Attraction" className="bg-neutral-900 text-white">City to Attraction (Heritage Corridors)</option>
                  <option value="Airport-Transfer" className="bg-neutral-900 text-white">Airport Transfer Corridor</option>
                  <option value="Highway-Corridor" className="bg-neutral-900 text-white">National Highway / Expressway</option>
                  <option value="Hill-Station-Pass" className="bg-neutral-900 text-white">Hill Station Mountain Pass (Ghats)</option>
                  <option value="Coastal-Drive" className="bg-neutral-900 text-white">Scenic Coastal Road Drive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Travel Month
                </label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {monthNames.map((m, idx) => (
                    <option key={idx} value={idx + 1} className="bg-neutral-900 text-white">
                      {m} ({idx + 1})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Destination Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">Corridor Presets:</span>
              {popularDestinations.slice(0, 6).map((dest, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedDestination === dest
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {dest.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODE 4: ADAPTIVE RESCHEDULER WITH INTERACTIVE CUSTOMER MESSAGE PROMPT */}
        {activeMode === 'adapt' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Target Indian Destination
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {indianPlacesList.map((dest, i) => (
                    <option key={i} value={dest} className="bg-neutral-900 text-white">
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Travel Month
                </label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl font-semibold text-sm text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {monthNames.map((m, idx) => (
                    <option key={idx} value={idx + 1} className="bg-neutral-900 text-white">
                      {m} ({idx + 1})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CUSTOMER MESSAGE / DISRUPTION PROMPT BOX */}
            <div className="p-4 md:p-5 bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-indigo-950/40 rounded-2xl border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Customer Plan Customization & Disruption Instructions
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Dynamic Rescheduler Active
                </span>
              </div>

              <p className="text-xs text-gray-300">
                Need to customize your plan? Type your travel preferences or click a quick suggestion below to optimize your itinerary.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 'It is raining on Day 2, swap outdoor treks for museums' or 'Flight delayed 3h, compress Day 1'..."
                  value={customerRequest}
                  onChange={(e) => setCustomerRequest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      fetchPredictions(customerRequest);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-black/80 border border-white/15 rounded-xl font-medium text-sm text-white focus:outline-none focus:border-cyan-400 transition-all placeholder:text-gray-500"
                />
                <Button
                  onClick={() => fetchPredictions(customerRequest)}
                  disabled={loading}
                  className="px-6 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer h-auto"
                >
                  {loading ? 'Updating...' : 'Adapt Plan'}
                </Button>
              </div>

              {/* Quick Customer Need Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Presets:</span>
                {[
                  { label: '🌧️ Rain on Day 2 → Indoor', text: 'It is raining heavily on Day 2, swap outdoor places for indoor museums and galleries' },
                  { label: '🚦 Severe Traffic → Bypass Route', text: 'Heavy traffic expected, shift departure time and bypass bottle-neck corridors' },
                  { label: '✈️ Flight Delay 3h → Compress Day 1', text: 'Flight delayed by 3 hours, compress Day 1 schedule to express evening spots' },
                  { label: '☕ Relaxed Pace → Cafes & Sunset', text: 'We want a relaxed pace with scenic cafes and sunset promenade' },
                  { label: '💰 Budget Optimization', text: 'Tight budget today, optimize plan for free entry monuments and local bazaars' }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleApplyQuickRequest(chip.text)}
                    className="px-3 py-1 bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-200 border border-white/10 hover:border-cyan-400/40 rounded-full text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Results Display */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-24 text-center space-y-4 bg-neutral-900 rounded-[32px] border border-white/10">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
              Calculating optimal travel recommendations...
            </p>
          </div>
        ) : (
          <>
            {/* Active Model Engine Badge */}
            {modelName && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-xs font-semibold text-indigo-300">
                <span className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-indigo-400" /> Curated Engine: <span className="font-bold text-white">{modelName}</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto border border-emerald-500/30">
                  Active Travel Engine
                </span>
              </div>
            )}

            {/* TAB 1: Place Recommendations */}
            {activeMode === 'recommend' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-neutral-900 rounded-[32px] p-6 border border-white/10 shadow-xl space-y-5 flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-white/10 text-indigo-300 rounded-full text-[11px] font-bold">
                          {item.destination.category || item.destination.vibe} • {item.destination.state}
                        </span>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-black">
                          {item.matchScorePct}% Match
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
                        {item.destination.name}
                      </h3>

                      <p className="text-xs text-gray-300 font-medium leading-relaxed">
                        {item.destination.description || `Famous ${item.destination.type} located in ${item.destination.city}, ${item.destination.state}.`}
                      </p>

                      <div className="p-3.5 bg-black/40 rounded-2xl text-xs font-medium text-gray-300 border border-white/5">
                        {item.recommendationReason}
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Highlights</span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.destination.highlights?.map((h: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-semibold text-gray-300">
                              ✨ {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">Est. Cost</span>
                        <span className="text-base font-black text-emerald-400">
                          ₹{item.destination.avgDailyCostINR || item.destination.est_daily_budget} / day
                        </span>
                      </div>

                      <Button
                        onClick={() => router.push(`/create-new-trip?to=${encodeURIComponent(item.destination.name)}&action=create`)}
                        className="rounded-xl px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <span>Plan Trip</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* TAB 2: Weather & Climate Forecast */}
            {activeMode === 'weather' && weatherResult && (
              <div className="bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-white/10 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                      <Sun className="w-4 h-4" /> Climate Risk & Meteorological Intelligence
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                      {weatherResult.destination} in {monthNames[travelMonth - 1]}
                    </h2>
                  </div>
                  <div className="px-4 py-2 bg-amber-500/15 text-amber-300 rounded-2xl text-xs font-bold border border-amber-500/30 self-start md:self-auto">
                    {weatherResult.confidenceScorePct}% ML Confidence Score
                  </div>
                </div>

                {/* Metric Gauges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Weather Condition</span>
                    <p className="text-xl font-black text-white">{weatherResult.condition}</p>
                    <span className="text-[10px] text-indigo-300 font-semibold">Severity: {weatherResult.weatherSeverity}</span>
                  </div>

                  <div className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Average Temp</span>
                    <p className="text-xl font-black text-white">{weatherResult.avgTempC}°C</p>
                    <span className="text-[10px] text-gray-400 font-medium">Min: {weatherResult.minTempC}°C | Max: {weatherResult.maxTempC}°C</span>
                  </div>

                  <div className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Precipitation Risk</span>
                    <p className="text-xl font-black text-white">{weatherResult.precipitationProb}%</p>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-sky-400 h-full rounded-full" style={{ width: `${weatherResult.precipitationProb}%` }} />
                    </div>
                  </div>

                  <div className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Humidity & UV</span>
                    <p className="text-xl font-black text-white">{weatherResult.humidityPct}% / UV {weatherResult.uvIndex}</p>
                    <span className="text-[10px] text-gray-400 font-medium">{weatherResult.uvIndex > 7 ? 'High UV Protection' : 'Moderate UV'}</span>
                  </div>
                </div>

                {/* Best Time of Day */}
                {weatherResult.bestTimeOfDayForTours && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block">Best Time of Day for Sightseeing:</span>
                      <span className="text-sm font-bold text-white">{weatherResult.bestTimeOfDayForTours}</span>
                    </div>
                  </div>
                )}

                {/* Advisory Notice */}
                <div className="p-5 bg-amber-950/30 rounded-2xl border border-amber-500/30 space-y-1.5">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Travel Advisory Notice
                  </h4>
                  <p className="text-sm font-semibold text-gray-200">{weatherResult.travelAdvisory}</p>
                </div>

                {/* Recommended Packing List Checklist */}
                {weatherResult.recommendedPackingList && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                      🎒 Recommended Packing Checklist ({weatherResult.recommendedPackingList.length} Items)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {weatherResult.recommendedPackingList.map((item: string, i: number) => {
                        const isChecked = !!checkedPackingItems[item];
                        return (
                          <div 
                            key={i}
                            onClick={() => togglePackingItem(item)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isChecked 
                                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' 
                                : 'bg-black/40 border-white/10 text-gray-300 hover:border-white/20'
                            }`}
                          >
                            <span className={`text-xs font-semibold ${isChecked ? 'line-through text-gray-400' : ''}`}>
                              {item}
                            </span>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isChecked ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20'
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Traffic & Transit Delay Risk */}
            {activeMode === 'traffic' && trafficResult && (
              <div className="bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-white/10 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold uppercase text-rose-400 tracking-wider flex items-center gap-1">
                      <Car className="w-4 h-4" /> Transit Delay & Mobility Forecast
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                      {trafficResult.destination} in {monthNames[travelMonth - 1]}
                    </h2>
                  </div>
                  <div className="px-4 py-2 bg-rose-500/15 text-rose-300 rounded-2xl text-xs font-bold border border-rose-500/30 self-start md:self-auto">
                    Risk Score: {trafficResult.peakHourRiskScore}/100
                  </div>
                </div>

                {/* Traffic Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Congestion Level</span>
                    <p className={`text-2xl font-black ${
                      trafficResult.congestionIndex === 'Severe' ? 'text-rose-500' :
                      trafficResult.congestionIndex === 'Heavy' ? 'text-amber-400' :
                      trafficResult.congestionIndex === 'Moderate' ? 'text-sky-400' : 'text-emerald-400'
                    }`}>
                      {trafficResult.congestionIndex}
                    </p>
                    <span className="text-[10px] text-gray-400">Transit Multiplier: {trafficResult.delayMultiplier}x</span>
                  </div>

                  <div className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Estimated Transit Delay</span>
                    <p className="text-2xl font-black text-white">+{trafficResult.predictedDelayMinutesPerTrip} Min</p>
                    <span className="text-[10px] text-gray-400">Per inter-city / attraction transit</span>
                  </div>

                  <div className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Recommended Transit Mode</span>
                    <p className="text-base font-black text-indigo-400 line-clamp-1">{trafficResult.recommendedTravelMode}</p>
                    <span className="text-[10px] text-gray-400">Optimized for terrain & road type</span>
                  </div>
                </div>

                {/* Best Departure Windows & Rush Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Zap className="w-4 h-4" /> Optimal Departure Windows
                    </span>
                    <div className="space-y-1">
                      {trafficResult.bestDepartureWindows?.map((win: string, i: number) => (
                        <p key={i} className="text-xs font-semibold text-gray-200">
                          🟢 {win}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Peak Rush Hour Windows
                    </span>
                    <div className="space-y-1">
                      {trafficResult.rushHours?.map((rush: string, i: number) => (
                        <p key={i} className="text-xs font-semibold text-gray-200">
                          🔴 {rush}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Optimization Tip */}
                <div className="p-5 bg-indigo-950/30 rounded-2xl border border-indigo-500/30 space-y-1.5">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Sathi Transit Optimization Strategy
                  </h4>
                  <p className="text-sm font-semibold text-gray-200">{trafficResult.travelOptimizationTip}</p>
                </div>
              </div>
            )}

            {/* TAB 4: Adaptive Rescheduler */}
            {activeMode === 'adapt' && adaptResult && (
              <div className="bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-white/10 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-1">
                      <Cpu className="w-4 h-4" /> Multi-Factor Constraint Engine
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                      Adaptive Itinerary for {adaptResult.destination} ({monthNames[travelMonth - 1]})
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="px-4 py-2.5 bg-cyan-500/15 rounded-2xl border border-cyan-500/30 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Time Saved</span>
                        <span className="text-base font-black text-cyan-300">{adaptResult.timeSavedMin || 45} Min Recuperated</span>
                      </div>
                    </div>
                    <div className="px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-2xl border border-cyan-500/30 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Suitability Score</span>
                        <span className="text-base font-black text-cyan-300">{adaptResult.overallSuitabilityScore} / 100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Customer Request Banner */}
                {adaptResult.customerRequest && (
                  <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 block">Customer Request Applied</span>
                        <p className="text-xs font-bold text-white">"{adaptResult.customerRequest}"</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-[10px] font-extrabold border border-cyan-400/30">
                      ML Re-allocated
                    </span>
                  </div>
                )}

                {/* Day-by-Day Adaptive Cards */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                    Day-Wise Adaptive Adjustments
                  </span>

                  {adaptResult.adaptedItinerary?.map((item: any, i: number) => (
                    <div 
                      key={i} 
                      className="p-5 bg-black/40 rounded-2xl border border-white/10 space-y-2.5 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-indigo-400">
                          Day {item.day} Plan
                        </span>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                          item.optimizationAction === 'Indoor Swapped' 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                          item.optimizationAction === 'Timing Shifted' 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          item.optimizationAction === 'Schedule Compressed'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                          item.optimizationAction === 'Relaxed Pace'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {item.optimizationAction}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 line-through">
                          Original: {item.originalPlan}
                        </p>
                        <p className="text-sm font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Adapted: {item.adaptedPlan}</span>
                        </p>
                      </div>

                      {item.customerNote && (
                        <p className="text-xs text-cyan-200 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/30 font-medium">
                          💡 <span className="font-bold">Customer Adjustment:</span> {item.customerNote}
                        </p>
                      )}

                      {item.weatherWarning && (
                        <p className="text-xs text-amber-300/90 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/20">
                          {item.weatherWarning}
                        </p>
                      )}

                      {item.trafficWarning && (
                        <p className="text-xs text-rose-300/90 bg-rose-950/20 p-2.5 rounded-xl border border-rose-500/20">
                          {item.trafficWarning}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Seasonal Suggestions */}
                {adaptResult.seasonalSuggestions && (
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                      💡 Month-Wise Seasonal Optimization Insights
                    </span>
                    <div className="space-y-1.5">
                      {adaptResult.seasonalSuggestions.map((sug: string, idx: number) => (
                        <p key={idx} className="text-xs font-medium text-gray-300">
                          {sug}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action CTA to Launch Trip */}
                <div className="pt-2 flex justify-end">
                  <Button
                    onClick={() => router.push(`/create-new-trip?to=${encodeURIComponent(adaptResult.destination)}&action=create`)}
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-2xl px-7 py-5 font-bold text-sm shadow-xl active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>Launch Optimized Trip Plan for {adaptResult.destination}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}
