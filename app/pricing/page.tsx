"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Globe, Zap, Sparkles, ArrowRight, HelpCircle, ChevronDown, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import Image from 'next/image'

function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const clerk = useClerk();

  const plans = [
    {
      name: 'Free Starter',
      icon: <Compass className="h-6 w-6 text-emerald-400" />,
      description: 'Ideal for trying out the AI planner with essential features.',
      price: { monthly: 0, yearly: 0 },
      features: [
        '3 Free AI Trip Generations',
        'Standard Day-by-Day Schedules',
        '3D Interactive Globe Visualization',
        'Leaflet Street Maps & Routes',
        'Basic Weather & Traffic Advisories'
      ],
      cta: 'Start Planning Free',
      actionType: 'free',
      popular: false,
      badge: 'Free Forever',
      colorClass: 'from-emerald-500 to-teal-500 text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      glowColor: 'group-hover:shadow-emerald-500/10'
    },
    {
      name: 'Monthly Pro',
      icon: <Zap className="h-6 w-6 text-indigo-400 animate-pulse" />,
      description: 'For active travelers seeking unlimited journeys and deep AI.',
      price: { monthly: 9.99, yearly: 8 },
      features: [
        'Unlimited Trip Planner & Generations',
        'Sathi Real-Time ML Suite (4 Models)',
        'Dynamic Weather & Transit Adaptation',
        'Interactive Monthly Trip Calendar',
        'Priority Route Optimization',
        '24/7 Priority Support'
      ],
      cta: 'Upgrade to Unlimited',
      actionType: 'pay',
      popular: true,
      badge: 'Most Popular',
      colorClass: 'from-indigo-500 to-blue-500 text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      glowColor: 'group-hover:shadow-indigo-500/10'
    },
    {
      name: 'Premium Agency',
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      description: 'Ideal for travel bloggers, agencies, and group organizers.',
      price: { monthly: 29, yearly: 25 },
      features: [
        'Everything in Monthly Pro',
        'Custom branding & white-label PDFs',
        'Group collaboration & shared plans',
        'API access for developers',
        'Dedicated 24/7 priority concierge',
        'Early access to next-gen AI models'
      ],
      cta: 'Choose Premium',
      actionType: 'pay',
      popular: false,
      badge: 'For Agencies',
      colorClass: 'from-blue-500 to-cyan-500 text-blue-400 bg-blue-500/10 border-blue-500/20',
      glowColor: 'group-hover:shadow-blue-500/10'
    }
  ];

  const faqs = [
    {
      q: "How do trip generation credits work?",
      a: "On the Free Starter plan, you get 3 free trip generation credits. After you generate 3 journeys, your free credits finish and you can easily upgrade to our Monthly Pro or Premium plan to unlock unlimited trip itineraries!"
    },
    {
      q: "Can I cancel my plan anytime?",
      a: "Yes, absolutely! There are no long-term commitments. If you cancel, your Pro features will remain active until the end of your billing cycle."
    },
    {
      q: "Do you offer refunds?",
      a: "We want you to love Wander AI. If you are not satisfied with your purchase, contact support within 7 days of upgrading and we will refund your payment in full."
    }
  ];

  const handlePlanSelection = (plan: any) => {
    if (plan.actionType === 'free') {
      router.push('/create-new-trip');
      return;
    }

    if (!isLoaded) return;

    if (!user) {
      clerk.openSignIn({});
      return;
    }

    clerk.openUserProfile({ initialPage: 'billing' } as any);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-20 px-6 relative overflow-hidden">
      {/* Dynamic Cosmic Glow Backdrop */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-screen pointer-events-none">
        <Image 
          src="/premium_pricing_bg.png" 
          alt="Cosmic Pricing Background" 
          fill 
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Decorative dynamic glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      
      {/* Animated Grid lines background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Animated Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-indigo-400 animate-spin-slow" />
            <span>Pricing Plans</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight"
          >
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">Adventure</span> Plan
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-neutral-400 text-base md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Unlock the power of AI-driven travel planning. From 3 free journeys on the Starter plan to unlimited expeditions on Pro, find the perfect fit.
          </motion.p>
        </div>

        {/* Billing Period Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex justify-center items-center gap-4 mb-16"
        >
          <span className={`text-sm font-semibold transition-colors duration-200 ${billingPeriod === 'monthly' ? 'text-white' : 'text-neutral-500'}`}>
            Monthly Billing
          </span>
          <button 
            onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-white/10 border border-white/10 rounded-full p-1 transition-colors duration-300 relative focus:outline-hidden cursor-pointer"
          >
            <motion.div 
              layout
              className="w-6 h-6 bg-indigo-500 rounded-full"
              animate={{ x: billingPeriod === 'monthly' ? 0 : 24 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold transition-colors duration-200 ${billingPeriod === 'yearly' ? 'text-white' : 'text-neutral-500'}`}>
              Yearly Billing
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-black text-white bg-indigo-500 rounded-full uppercase tracking-wider animate-bounce">
              Save ~20%
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-24 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.12, type: "spring", stiffness: 90 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-[36px] border relative transition-all duration-300 overflow-hidden group shadow-lg hover:shadow-2xl ${plan.glowColor} ${
                plan.popular 
                  ? 'border-indigo-500/50 ring-4 ring-indigo-500/10' 
                  : 'border-white/10'
              }`}
            >
              {/* Popular glowing border accent */}
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 animate-pulse"></div>
              )}

              {/* Card Body */}
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Badge & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-xs group-hover:scale-110 transition-transform duration-300">
                      {plan.icon}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${plan.colorClass}`}>
                      {plan.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-neutral-400 mb-6 leading-relaxed min-h-[40px]">{plan.description}</p>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black text-white transition-all duration-300">
                      ${billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-sm font-semibold text-neutral-400">
                      {plan.price.monthly === 0 ? "forever" : "/ month"}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <motion.div 
                        key={fIdx} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * fIdx }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-5 h-5 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm text-neutral-300 font-medium leading-tight">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <Button
                  onClick={() => handlePlanSelection(plan)}
                  className={`w-full h-12 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02]'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-[1.01]'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto mb-16 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="text-indigo-400 h-6 w-6" /> Frequently Asked Questions
            </h2>
            <p className="text-sm text-neutral-400">Everything you need to know about our plans and billing cycles.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-sm text-neutral-400 leading-relaxed border-t border-white/10">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Footer Disclaimer */}
        <div className="mt-16 text-center max-w-xl mx-auto">
          <p className="text-xs text-neutral-500 leading-relaxed">
            * All transactions are processed securely via Clerk Billing and Stripe. You can switch, upgrade, or cancel your subscription at any time directly through your account dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pricing
