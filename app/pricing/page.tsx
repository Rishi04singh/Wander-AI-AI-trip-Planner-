"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Sparkles, Zap, Shield, HelpCircle, ChevronDown, Compass, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const faqs = [
  {
    question: "How does the AI Trip Planning work?",
    answer: "Our multi-agent AI analyzes live place data, weather patterns, traffic metrics, and user budget preferences to craft optimized hour-by-hour travel itineraries in seconds."
  },
  {
    question: "What is included in the Sathi 🧳 AI Companion?",
    answer: "Sathi 🧳 provides real-time destination matching, crowd predictions, live weather alerts, and automatic itinerary re-routing if unexpected weather or road delays occur during your trip."
  },
  {
    question: "Can I cancel or change my plan anytime?",
    answer: "Yes! You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings with zero cancellation fees."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 14-day money-back guarantee for all paid tiers if you're not completely satisfied with your AI travel itineraries."
  }
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-28 pb-20 px-6 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-500">Adventure Plan</span>
          </h1>
          
          <p className="text-base md:text-xl text-neutral-600 dark:text-neutral-400 font-medium max-w-2xl mx-auto">
            Unlock AI-powered itineraries, real-time weather adaptive routes, and live travel companion recommendations tailored to your journey.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="pt-6 flex items-center justify-center gap-4">
            <span className={`text-sm font-bold ${!isAnnual ? "text-neutral-900 dark:text-white" : "text-neutral-400"}`}>
              Monthly Billed
            </span>
            
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 p-1 border border-neutral-300 dark:border-neutral-700 transition-colors"
              aria-label="Toggle billing cycle"
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-6 h-6 rounded-full bg-indigo-600 ${isAnnual ? "translate-x-8" : "translate-x-0"}`}
              />
            </button>
            
            <span className={`text-sm font-bold flex items-center gap-2 ${isAnnual ? "text-neutral-900 dark:text-white" : "text-neutral-400"}`}>
              Annual Billed
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch mb-20">
          
          {/* Tier 1: Explorer */}
          <motion.div
            whileHover={{ y: -6 }}
            className="flex flex-col justify-between p-8 rounded-[36px] bg-white dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-xl relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">Explorer</h3>
                <Compass className="h-6 w-6 text-neutral-400" />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">Perfect for casual travelers planning occasional weekend trips.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-black text-neutral-900 dark:text-white">₹0</span>
                <span className="text-sm font-medium text-neutral-400 ml-1">/ forever free</span>
              </div>

              <div className="space-y-3.5 border-t border-neutral-100 dark:border-neutral-800/80 pt-6 mb-8">
                {[
                  "3 AI Itineraries per month",
                  "Basic Place & Hotel Details",
                  "Standard 3D Globe Visuals",
                  "Community Support Access"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/create-new-trip">
              <Button className="w-full h-12 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold transition-all">
                Get Started Free
              </Button>
            </Link>
          </motion.div>

          {/* Tier 2: Globetrotter Pro (Most Popular) */}
          <motion.div
            whileHover={{ y: -6 }}
            className="flex flex-col justify-between p-8 rounded-[36px] bg-gradient-to-b from-indigo-900/40 via-neutral-900 to-neutral-900 backdrop-blur-2xl border-2 border-indigo-500 shadow-2xl relative group overflow-hidden"
          >
            {/* Glowing Accent Badge */}
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" /> Most Popular
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  Globetrotter Pro <Zap className="h-5 w-5 text-indigo-400 fill-indigo-400" />
                </h3>
              </div>
              <p className="text-xs text-indigo-200/70 mb-6">For avid adventurers seeking full AI companion power and real-time route adaptation.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-black text-white">
                  {isAnnual ? "₹399" : "₹499"}
                </span>
                <span className="text-sm font-medium text-indigo-300 ml-1">/ month</span>
              </div>

              <div className="space-y-3.5 border-t border-indigo-500/20 pt-6 mb-8">
                {[
                  "Unlimited AI Trip Generations",
                  "Full Sathi 🧳 AI Companion Access",
                  "Live Weather & Traffic Route Adaptive Engine",
                  "HD Destination & Hotel Photo Resolution",
                  "1-Click Uber / Ola Ride Booking Integrations",
                  "Priority GPU Response Speed"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-white font-medium">
                    <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/create-new-trip">
              <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02]">
                Start 14-Day Free Trial
              </Button>
            </Link>
          </motion.div>

          {/* Tier 3: Nomad Enterprise */}
          <motion.div
            whileHover={{ y: -6 }}
            className="flex flex-col justify-between p-8 rounded-[36px] bg-white dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-xl relative"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">Nomad VIP</h3>
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">Designed for luxury group travels, agencies, and enterprise travelers.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-black text-neutral-900 dark:text-white">
                  {isAnnual ? "₹1,199" : "₹1,499"}
                </span>
                <span className="text-sm font-medium text-neutral-400 ml-1">/ month</span>
              </div>

              <div className="space-y-3.5 border-t border-neutral-100 dark:border-neutral-800/80 pt-6 mb-8">
                {[
                  "Everything in Globetrotter Pro",
                  "Multi-Traveler Team Collaboration",
                  "Export Itineraries to PDF & Google Calendar",
                  "Dedicated 24/7 VIP Travel Concierge",
                  "Custom Budget & ML Fine-Tuning"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                    <Check className="h-4 w-4 text-purple-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/contact">
              <Button className="w-full h-12 rounded-2xl bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold transition-all">
                Contact Concierge
              </Button>
            </Link>
          </motion.div>

        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-indigo-500" /> Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-900/80 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-base font-bold text-neutral-900 dark:text-white hover:text-indigo-500 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-indigo-500" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/50 pt-3"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}


