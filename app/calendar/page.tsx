"use client"
import React from 'react'
import TripCalendar from '@/components/TripCalendar'
import { useUserDetail } from '../provider'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function CalendarPage() {
  const { userDetail } = useUserDetail();

  const userTrips = useQuery(api.trips.getUserTrips, {
    userEmail: userDetail?.email || ""
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <TripCalendar userTrips={userTrips || []} />
    </div>
  )
}
