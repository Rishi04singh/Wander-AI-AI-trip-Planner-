import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function Pricing() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-[#0a0a0b] dark:to-[#111113] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Choose Your <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-blue-500">Adventure Plan</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Unlock the full power of AI-driven travel planning. From weekend getaways to global expeditions, we have a plan that fits your journey.
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex justify-center">
        <PricingTable />
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-500">
          All plans include access to our basic AI recommendations. Upgrade for HD images, priority generation, and more.
        </p>
      </div>
    </div>
  )
}

export default Pricing

