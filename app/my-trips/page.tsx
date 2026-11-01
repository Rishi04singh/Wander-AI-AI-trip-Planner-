"use client"
import React, { useState } from 'react'
import { useUserDetail } from '../provider'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Globe, Users, Wallet, MapPin, Sparkles, ChevronRight, Search, Calendar, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'

function MyTrips() {
  const { userDetail } = useUserDetail();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const userTrips = useQuery(api.trips.getUserTrips, {
    userEmail: userDetail?.email || ""
  });

  if (userTrips === undefined) {
    return (
       <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-24 pb-12 px-6 flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-neutral-500 font-medium animate-pulse uppercase tracking-widest text-xs">Loading your adventures...</p>
         </div>
       </div>
    );
  }

  const filteredTrips = userTrips?.filter((trip: any) => {
    const to = trip.userSelection?.to?.toLowerCase() || '';
    const from = trip.userSelection?.from?.toLowerCase() || '';
    const budget = trip.userSelection?.budget?.toLowerCase() || '';
    const query = searchTerm.toLowerCase();
    return to.includes(query) || from.includes(query) || budget.includes(query);
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-blue-500">Adventures</span>
            </h1>
            <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
              Your personalized collection of AI-crafted travel itineraries.
            </p>
          </div>

          <Button 
            onClick={() => router.push('/create-new-trip')}
            className="rounded-2xl h-12 px-8 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold shadow-lg shadow-indigo-600/25 active:scale-95 transition-all w-full md:w-auto"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Plan New Trip
          </Button>
        </div>

        {/* Search & Filter Bar */}
        {userTrips?.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-neutral-900/80 p-3 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm backdrop-blur-xl">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search trips by city, origin, or budget..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            
            <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 px-4">
              Showing {filteredTrips?.length} of {userTrips?.length} Trips
            </div>
          </div>
        )}

        {/* Empty State */}
        {userTrips?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl rounded-[40px] border border-neutral-200 dark:border-neutral-800 shadow-sm text-center px-6">
             <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-800">
                <Globe className="h-12 w-12 text-indigo-500" />
             </div>
             <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">No adventures found</h2>
             <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-8">
               You haven't planned any trips yet. Start your first AI-guided journey today and discover the world's best destinations.
             </p>
             <Button 
               onClick={() => router.push('/create-new-trip')}
               className="rounded-2xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg"
             >
               Start Crafting
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips?.map((trip: any, index: number) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => router.push(`/view-trip/${trip.tripId}`)}
                className="group cursor-pointer"
              >
                <div className="relative h-88 w-full overflow-hidden rounded-[36px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/50 hover:-translate-y-1">
                   {/* Background Image Layer */}
                   <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop`} 
                        alt={trip.userSelection.to} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                   </div>

                   {/* Content Overlay */}
                   <div className="absolute inset-0 p-7 flex flex-col justify-end text-white">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>From {trip.userSelection.from || 'Origin'}</span>
                      </div>
                      
                      <h3 className="text-3xl font-black mb-4 uppercase tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {trip.userSelection.to}
                      </h3>
                      
                      <div className="flex items-center justify-between border-t border-white/15 pt-4">
                        <div className="flex items-center gap-5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Travelers</span>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-indigo-400" />
                              <span className="text-sm font-extrabold">
                                {trip.userSelection?.travelers ? String(trip.userSelection.travelers).split(' ')[0] : '1'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Budget</span>
                            <div className="flex items-center gap-1.5">
                              <Wallet className="h-3.5 w-3.5 text-indigo-400" />
                              <span className="text-sm font-extrabold capitalize">{trip.userSelection.budget}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300">
                           <ChevronRight className="h-5 w-5 text-white group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;