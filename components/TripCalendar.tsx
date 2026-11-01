"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Target, 
  MapPin, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  Compass, 
  TrendingUp, 
  Coffee, 
  Car, 
  Camera, 
  ArrowRight,
  Filter,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface DailyTarget {
  id: string;
  dateStr: string; // YYYY-MM-DD
  title: string;
  category: 'Sightseeing' | 'Dining & Cafes' | 'Transit & Rides' | 'Budget Target' | 'Milestone';
  targetValue: string;
  completed: boolean;
  timeSlot?: string;
}

interface TripCalendarProps {
  userTrips?: any[];
}

export default function TripCalendar({ userTrips = [] }: TripCalendarProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default July 2026 for rich showcase
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-07-15');
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Daily targets initial state linked by date string YYYY-MM-DD
  const [dailyTargets, setDailyTargets] = useState<DailyTarget[]>([
    { id: '1', dateStr: '2026-07-15', title: 'Visit Amber Fort & Palace Courtyard', category: 'Sightseeing', targetValue: '2 Places', completed: true, timeSlot: '09:00 AM' },
    { id: '2', dateStr: '2026-07-15', title: 'Daily Budget Cap (₹3,500 max)', category: 'Budget Target', targetValue: '₹3,500 Cap', completed: false, timeSlot: 'All Day' },
    { id: '3', dateStr: '2026-07-15', title: 'Sunset at Nahargarh Fort Rooftop Cafe', category: 'Dining & Cafes', targetValue: '06:00 PM', completed: true, timeSlot: '06:00 PM' },
    { id: '4', dateStr: '2026-07-16', title: 'Local Heritage Bazaar & Handicraft Shopping', category: 'Sightseeing', targetValue: 'Johari Bazaar', completed: false, timeSlot: '11:00 AM' },
    { id: '5', dateStr: '2026-07-16', title: 'Express Airport Transfer Cab', category: 'Transit & Rides', targetValue: 'Pre-booked', completed: false, timeSlot: '03:30 PM' },
    { id: '6', dateStr: '2026-07-22', title: 'Alpine Cable Car Expedition', category: 'Milestone', targetValue: 'Peak Summit', completed: false, timeSlot: '10:00 AM' },
  ]);

  const [newTargetTitle, setNewTargetTitle] = useState('');
  const [newTargetValue, setNewTargetValue] = useState('');
  const [newTargetCategory, setNewTargetCategory] = useState<DailyTarget['category']>('Sightseeing');
  const [newTargetTime, setNewTargetTime] = useState('10:00 AM');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  // Helper to format YYYY-MM-DD
  const formatDateStr = (dayNum: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Map trips to dates (assign trips to days of month for visualization)
  const getTripForDay = (dayNum: number) => {
    if (userTrips && userTrips.length > 0) {
      // Map saved user trips across dates
      const tripIndex = (dayNum % userTrips.length);
      const trip = userTrips[tripIndex];
      const plan = trip?.tripData?.trip_plan || trip?.tripData;
      const destName = plan?.destination || trip?.userSelection?.to || 'India Trip';
      
      if (dayNum >= 12 && dayNum <= 17) {
        return { 
          id: trip?.tripId || 'mock-1', 
          name: destName, 
          destination: destName.split('&')[0].trim(), 
          bubbleColor: 'bg-indigo-500 shadow-indigo-500/50',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        };
      }
      if (dayNum >= 22 && dayNum <= 26 && userTrips.length > 1) {
        const trip2 = userTrips[(tripIndex + 1) % userTrips.length];
        const plan2 = trip2?.tripData?.trip_plan || trip2?.tripData;
        const destName2 = plan2?.destination || trip2?.userSelection?.to || 'Goa & Beaches';
        return { 
          id: trip2?.tripId || 'mock-2', 
          name: destName2, 
          destination: destName2.split('&')[0].trim(), 
          bubbleColor: 'bg-cyan-500 shadow-cyan-500/50',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
        };
      }
    } else {
      // High-quality showcase trips when no saved trips exist
      if (dayNum >= 14 && dayNum <= 18) {
        return { 
          id: 'demo-jaipur', 
          name: 'Jaipur & Royal Forts Experience', 
          destination: 'Jaipur', 
          bubbleColor: 'bg-indigo-500 shadow-indigo-500/50',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        };
      }
      if (dayNum >= 22 && dayNum <= 25) {
        return { 
          id: 'demo-goa', 
          name: 'Goa Coastal & Heritage Voyage', 
          destination: 'Goa', 
          bubbleColor: 'bg-cyan-500 shadow-cyan-500/50',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
        };
      }
    }
    return null;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Filter targets for selected date
  const selectedDateTargets = dailyTargets.filter(t => {
    const matchesDate = t.dateStr === selectedDateStr;
    const matchesCategory = selectedCategoryFilter === 'All' || t.category === selectedCategoryFilter;
    return matchesDate && matchesCategory;
  });

  const totalAllTargets = dailyTargets.length;
  const totalCompletedAll = dailyTargets.filter(t => t.completed).length;
  const overallCompletionPct = totalAllTargets > 0 ? Math.round((totalCompletedAll / totalAllTargets) * 100) : 0;

  const currentDayTargetsAll = dailyTargets.filter(t => t.dateStr === selectedDateStr);
  const completedCount = currentDayTargetsAll.filter(t => t.completed).length;
  const progressPct = currentDayTargetsAll.length > 0 
    ? Math.round((completedCount / currentDayTargetsAll.length) * 100) 
    : 0;

  const toggleTarget = (id: string) => {
    setDailyTargets(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTarget = (id: string) => {
    setDailyTargets(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetTitle.trim()) return;
    const newT: DailyTarget = {
      id: Date.now().toString(),
      dateStr: selectedDateStr,
      title: newTargetTitle.trim(),
      category: newTargetCategory,
      targetValue: newTargetValue.trim() || 'Scheduled',
      completed: false,
      timeSlot: newTargetTime || '10:00 AM'
    };
    setDailyTargets(prev => [...prev, newT]);
    setNewTargetTitle('');
    setNewTargetValue('');
  };

  // Get active trip for the currently selected date
  const selectedDayNum = parseInt(selectedDateStr.split('-')[2] || '1', 10);
  const selectedDateTrip = getTripForDay(selectedDayNum);

  const getCategoryIcon = (cat: DailyTarget['category']) => {
    switch (cat) {
      case 'Sightseeing': return <Camera className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Dining & Cafes': return <Coffee className="w-3.5 h-3.5 text-amber-400" />;
      case 'Transit & Rides': return <Car className="w-3.5 h-3.5 text-rose-400" />;
      case 'Budget Target': return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Milestone': return <Target className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <Compass className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Top Header & Overview */}
      <div className="bg-gradient-to-r from-indigo-950 via-neutral-900 to-black rounded-[36px] p-6 md:p-10 text-white shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/15 via-cyan-500/15 to-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Trip Schedule & Milestone Tracker
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Trip Schedule & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300">Daily Targets</span>
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Track multi-day itineraries, click any date to customize activities, monitor daily budgets, and check off milestone targets with real-time feedback.
            </p>
          </div>

          {/* Month Indicator & Mode Toggles */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10">
              <CalendarIcon className="h-5 w-5 text-indigo-400" />
              <span className="text-base font-extrabold text-white tracking-wide">{monthNames[month]} {year}</span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex bg-black/60 p-1 rounded-2xl border border-white/10">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'month' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Month Grid
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'agenda' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                Agenda View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Saved Trips Active', value: userTrips.length > 0 ? userTrips.length : '2 Demo Trips', icon: Compass, color: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-500/30' },
          { label: 'Scheduled Activities', value: `${totalAllTargets} Goals`, icon: Target, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-500/30' },
          { label: 'Completed Targets', value: `${totalCompletedAll} Done`, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/30' },
          { label: 'Target Completion Rate', value: `${overallCompletionPct}%`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/30' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-4 rounded-3xl border ${stat.bg} backdrop-blur-xl flex items-center justify-between`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">{stat.label}</span>
                <span className={`text-xl font-black ${stat.color} mt-0.5 block`}>{stat.value}</span>
              </div>
              <Icon className={`w-6 h-6 ${stat.color} opacity-80`} />
            </div>
          );
        })}
      </div>

      {/* Main Grid: Calendar on Left, Daily Action Dock on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CALENDAR COLUMN (7 Cols) */}
        <div className="lg:col-span-7 bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-white/10 shadow-xl space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span>{monthNames[month]}</span>
                <span className="text-indigo-400">{year}</span>
              </h2>
              <button
                onClick={jumpToToday}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={prevMonth} variant="outline" size="icon" className="rounded-xl h-9 w-9 border-white/10 bg-black/40 text-white hover:bg-white/10 cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={nextMonth} variant="outline" size="icon" className="rounded-xl h-9 w-9 border-white/10 bg-black/40 text-white hover:bg-white/10 cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === 'month' ? (
            <>
              {/* Weekday Labels */}
              <div className="grid grid-cols-7 text-center font-black text-[11px] text-gray-400 uppercase tracking-wider">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                  <div key={idx} className="py-1">{day}</div>
                ))}
              </div>

              {/* Month Days Grid */}
              <div className="grid grid-cols-7 gap-2 md:gap-2.5">
                {/* Empty slots for month alignment */}
                {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-16 md:h-20 rounded-2xl bg-black/20 border border-white/5 opacity-25"></div>
                ))}

                {/* Actual Days */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = formatDateStr(dayNum);
                  const trip = getTripForDay(dayNum);
                  const isSelected = dateStr === selectedDateStr;
                  const dayTargets = dailyTargets.filter(t => t.dateStr === dateStr);

                  return (
                    <motion.div
                      key={dayNum}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`relative h-16 md:h-20 rounded-2xl p-2 flex flex-col justify-between cursor-pointer border transition-all ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-950/60 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400' 
                          : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-black/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs md:text-sm font-black ${isSelected ? 'text-indigo-300' : 'text-gray-200'}`}>
                          {dayNum}
                        </span>

                        {/* Activity count badge */}
                        {dayTargets.length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                        )}
                      </div>

                      {/* Active Trip Bubble */}
                      {trip ? (
                        <div className="flex items-center gap-1 mt-auto">
                          <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${trip.bubbleColor} shrink-0`}></div>
                          <span className="text-[9px] font-bold text-gray-200 truncate">
                            {trip.destination}
                          </span>
                        </div>
                      ) : (
                        <div className="h-2"></div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            /* AGENDA VIEW */
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {Array.from({ length: 7 }).map((_, i) => {
                const dayNum = 12 + i;
                const dateStr = formatDateStr(dayNum);
                const trip = getTripForDay(dayNum);
                const dayTargets = dailyTargets.filter(t => t.dateStr === dateStr);
                const isSelected = dateStr === selectedDateStr;

                return (
                  <div
                    key={i}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-400' : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{monthNames[month]} {dayNum}</span>
                        {trip && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${trip.badgeColor}`}>
                            📍 {trip.destination}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 font-semibold">{dayTargets.length} Activities</span>
                    </div>

                    <div className="mt-2 space-y-1">
                      {dayTargets.map(t => (
                        <p key={t.id} className="text-xs text-gray-300 flex items-center gap-1.5">
                          {t.completed ? <Check className="w-3 h-3 text-emerald-400" /> : <Circle className="w-3 h-3 text-gray-500" />}
                          <span className={t.completed ? 'line-through text-gray-500' : ''}>{t.title}</span>
                          <span className="text-[10px] text-gray-500 ml-auto">({t.timeSlot || 'Anytime'})</span>
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DAILY AGENDA & TARGETS DOCK (5 Cols) */}
        <div className="lg:col-span-5 bg-neutral-900 rounded-[32px] p-6 md:p-8 border border-white/10 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            
            {/* Selected Date Header & Progress */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 block">Selected Date Plan</span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  {selectedDateStr}
                </h3>
                {selectedDateTrip && (
                  <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold border ${selectedDateTrip.badgeColor}`}>
                    📍 Active Destination: {selectedDateTrip.destination}
                  </span>
                )}
              </div>

              {/* Progress Meter */}
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Target Completion</span>
                <span className="text-xl font-black text-cyan-400">{progressPct}%</span>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 rounded-full"
              />
            </div>

            {/* Active Trip Banner Link (if trip scheduled) */}
            {selectedDateTrip && (
              <div className="p-3.5 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-indigo-300">Scheduled Journey</span>
                  <p className="text-xs font-bold text-white truncate">{selectedDateTrip.name}</p>
                </div>
                <Link
                  href={selectedDateTrip.id.startsWith('demo') ? `/sathi` : `/view-trip/${selectedDateTrip.id}`}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all shrink-0"
                >
                  <span>Open Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] font-bold uppercase text-gray-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {['All', 'Sightseeing', 'Dining & Cafes', 'Transit & Rides', 'Budget Target'].map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategoryFilter === cat 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Daily Targets List */}
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              <AnimatePresence>
                {selectedDateTargets.length === 0 ? (
                  <div className="py-10 text-center text-gray-400 space-y-2 border-2 border-dashed border-white/10 rounded-2xl">
                    <Target className="h-7 w-7 mx-auto text-gray-600" />
                    <p className="text-xs font-semibold">No targets or activities set for this day yet.</p>
                    <p className="text-[11px] text-gray-500">Add an activity below to track your itinerary goals!</p>
                  </div>
                ) : (
                  selectedDateTargets.map((target) => (
                    <motion.div
                      key={target.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                        target.completed 
                          ? 'bg-emerald-950/20 border-emerald-500/30 opacity-75' 
                          : 'bg-black/50 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleTarget(target.id)} 
                          className="text-indigo-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          {target.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-500" />
                          )}
                        </button>

                        <div className="space-y-0.5">
                          <h4 className={`text-xs md:text-sm font-extrabold ${target.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {target.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-300">
                              {getCategoryIcon(target.category)}
                              {target.category}
                            </span>
                            <span className="text-[10px] text-gray-400">• {target.targetValue}</span>
                            {target.timeSlot && (
                              <span className="text-[10px] text-indigo-300 font-semibold">• ⏱️ {target.timeSlot}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => deleteTarget(target.id)} 
                        className="text-gray-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Add Daily Target Form */}
          <form onSubmit={handleAddTarget} className="space-y-3 border-t border-white/10 pt-4">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-indigo-400" /> Add New Daily Activity / Goal
            </span>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Target title (e.g. Visit Museum & Take Photos)..."
                value={newTargetTitle}
                onChange={(e) => setNewTargetTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500 placeholder:text-gray-500"
              />

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Goal value (e.g. ₹3,500)"
                  value={newTargetValue}
                  onChange={(e) => setNewTargetValue(e.target.value)}
                  className="px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500 placeholder:text-gray-500"
                />

                <select
                  value={newTargetCategory}
                  onChange={(e) => setNewTargetCategory(e.target.value as any)}
                  className="px-2.5 py-2 bg-black/60 border border-white/15 rounded-xl text-[11px] font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Sightseeing" className="bg-neutral-900 text-white">Sightseeing</option>
                  <option value="Dining & Cafes" className="bg-neutral-900 text-white">Dining & Cafes</option>
                  <option value="Transit & Rides" className="bg-neutral-900 text-white">Transit & Rides</option>
                  <option value="Budget Target" className="bg-neutral-900 text-white">Budget Target</option>
                  <option value="Milestone" className="bg-neutral-900 text-white">Milestone</option>
                </select>

                <select
                  value={newTargetTime}
                  onChange={(e) => setNewTargetTime(e.target.value)}
                  className="px-2.5 py-2 bg-black/60 border border-white/15 rounded-xl text-[11px] font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="09:00 AM" className="bg-neutral-900 text-white">09:00 AM</option>
                  <option value="11:00 AM" className="bg-neutral-900 text-white">11:00 AM</option>
                  <option value="01:30 PM" className="bg-neutral-900 text-white">01:30 PM</option>
                  <option value="04:00 PM" className="bg-neutral-900 text-white">04:00 PM</option>
                  <option value="06:30 PM" className="bg-neutral-900 text-white">06:30 PM</option>
                  <option value="08:30 PM" className="bg-neutral-900 text-white">08:30 PM</option>
                </select>
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-extrabold h-9 shadow-md cursor-pointer text-xs"
              >
                Save Activity to Schedule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
