"use client"
import React from 'react'
import { useUserDetail } from '../provider'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Globe, Users, Wallet, MapPin, Sparkles, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

function MyTrips() {
  const { userDetail } = useUserDetail();
  const router = useRouter();
  
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Adventures</span>
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Your personalized collection of AI-crafted travel itineraries.
            </p>
          </div>
          <Button 
            onClick={() => router.push('/create-new-trip')}
            className="rounded-2xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all w-full md:w-auto"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Plan New Trip
          </Button>
        </div>

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
            {userTrips?.map((trip: any, index: number) => (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onClick={() => router.push(`/view-trip/${trip.tripId}`)}
                className="group cursor-pointer"
              >
                <div className="relative h-80 w-full overflow-hidden rounded-[40px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm transition-all hover:shadow-2xl hover:border-indigo-500/50">
                   {/* Background Image Layer */}
                   <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                      <img 
                        src={`https://loremflickr.com/800/600/${encodeURIComponent(trip.userSelection.to || "travel")}`} 
                        alt={trip.userSelection.to} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                   </div>

                   {/* Content Overlay */}
                   <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>{trip.userSelection.from}</span>
                      </div>
                      
                      <h3 className="text-3xl font-black mb-6 uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                        {trip.userSelection.to}
                      </h3>
                      
                      <div className="flex items-center justify-between border-t border-white/10 pt-6">
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Travelers</span>
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-indigo-400" />
                              <span className="text-sm font-black">
                                {trip.userSelection?.travelers ? String(trip.userSelection.travelers).split(' ')[0] : '1'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Budget</span>
                            <div className="flex items-center gap-1.5">
                              <Wallet className="h-3.5 w-3.5 text-indigo-400" />
                              <span className="text-sm font-black capitalize">{trip.userSelection.budget}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300">
                           <ChevronRight className="h-6 w-6 text-white" />
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