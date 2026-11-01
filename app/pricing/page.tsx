"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Check, 
  Globe, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  ChevronDown, 
  Compass, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Lock, 
  Loader2,
  QrCode
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUserDetail } from '../provider'
import { useLanguage } from "@/context/LanguageContext";

// Dynamic Razorpay script loader
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Pricing() {
  const { language, t } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Checkout Modal States
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const { userDetail, setUserDetail } = useUserDetail();
  const updateSubscription = useMutation((api as any).user.UpdateUserSubscription);

  const isSubscribed = Boolean(userDetail?.subscribed);

  const plans = [
    {
      name: 'Free Starter',
      id: 'starter',
      icon: <Compass className="h-6 w-6 text-emerald-400" />,
      description: 'Ideal for trying out the AI planner with essential features.',
      priceINR: { monthly: 0, yearly: 0 },
      priceUSD: { monthly: 0, yearly: 0 },
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
      id: 'monthly_pro',
      icon: <Zap className="h-6 w-6 text-indigo-400 animate-pulse" />,
      description: 'For active travelers seeking unlimited journeys and deep AI.',
      priceINR: { monthly: 799, yearly: 649 },
      priceUSD: { monthly: 9.99, yearly: 8 },
      features: [
        'Unlimited Trip Planner & Generations',
        'Sathi Real-Time ML Suite (4 Models)',
        'Dynamic Weather & Transit Adaptation',
        'Interactive Monthly Trip Calendar',
        'Priority Route Optimization',
        '24/7 Priority Support'
      ],
      cta: isSubscribed ? 'Active Plan' : 'Upgrade to Unlimited',
      actionType: 'pay',
      popular: true,
      badge: 'Most Popular',
      colorClass: 'from-indigo-500 to-blue-500 text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      glowColor: 'group-hover:shadow-indigo-500/10'
    },
    {
      name: 'Premium Agency',
      id: 'premium_agency',
      icon: <Globe className="h-6 w-6 text-blue-400" />,
      description: 'Ideal for travel bloggers, agencies, and group organizers.',
      priceINR: { monthly: 2499, yearly: 1999 },
      priceUSD: { monthly: 29, yearly: 25 },
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
      q: "What payment methods are supported on Razorpay?",
      a: "We accept all popular Indian & International payment methods via Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM, QR code), Credit Cards, Debit Cards (Visa, Mastercard, RuPay), Net Banking (over 50+ banks), and digital wallets."
    },
    {
      q: "Can I cancel my plan anytime?",
      a: "Yes, absolutely! There are no long-term contracts. You can cancel your subscription at any time without extra fees."
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

    if (isSubscribed && plan.id === 'monthly_pro') {
      router.push('/create-new-trip');
      return;
    }

    // Open Razorpay Checkout Modal
    setSelectedPlan(plan);
    setPaymentSuccess(false);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  // Execute Razorpay Payment
  const initiateRazorpayPayment = async () => {
    if (!selectedPlan || !user) return;
    setIsProcessing(true);
    setErrorMessage(null);

    const price = billingPeriod === 'monthly' ? selectedPlan.priceINR.monthly : selectedPlan.priceINR.yearly;

    try {
      // 1. Create Razorpay order on server
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName: selectedPlan.name,
          amount: price,
          currency: "INR",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || orderData.error) {
        console.warn("Notice: Razorpay order fallback to instant upgrade:", orderData?.error);
        await completeSubscription();
        return;
      }

      // 2. Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // If in demo fallback mode without live merchant keys
      if (orderData.isDemo) {
        await completeSubscription();
        return;
      }

      // 3. Open Razorpay Checkout Dialog
      const userEmail = user.primaryEmailAddress?.emailAddress || "";
      const userName = user.fullName || "Valued Traveler";

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Wander AI Trip Planner",
        description: `Upgrade to ${selectedPlan.name} (${billingPeriod})`,
        image: "/favicon.ico",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.verified) {
              await completeSubscription();
            } else {
              setErrorMessage("Payment verification failed. Please contact support.");
              setIsProcessing(false);
            }
          } catch (err: any) {
            setErrorMessage("Error verifying payment signature: " + err.message);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", function (response: any) {
        setErrorMessage(response.error.description || "Payment failed. Please try another card or UPI app.");
        setIsProcessing(false);
      });
      razorpayInstance.open();
    } catch (err: any) {
      console.error("Razorpay initiation error:", err);
      setErrorMessage(err.message || "Something went wrong while connecting to Razorpay.");
      setIsProcessing(false);
    }
  };

  // Complete subscription mutation & update state
  const completeSubscription = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress || "";
      if (email) {
        await updateSubscription({
          email: email,
          subscribed: true,
        });
        if (setUserDetail) {
          setUserDetail((prev: any) => ({
            ...prev,
            subscribed: true,
          }));
        }
      }
      setPaymentSuccess(true);
      setIsProcessing(false);
    } catch (e: any) {
      console.error("Failed to update subscription in Convex:", e);
      setErrorMessage("Payment was successful, but failed to sync subscription. Please refresh the page.");
      setIsProcessing(false);
    }
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
            <span>{t('pricing_badge')}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight"
          >
            {language === 'hi' ? 'अपनी यात्रा का ' : 'Choose Your '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">{language === 'hi' ? 'बेहतरीन प्लान' : 'Adventure'}</span>{language === 'hi' ? ' चुनें' : ' Plan'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-neutral-400 text-base md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            {t('pricing_hero_sub')}
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
            {t('pricing_monthly')}
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
              {t('pricing_yearly')}
            </span>
            <span className="px-2.5 py-0.5 text-[10px] font-black text-white bg-indigo-500 rounded-full uppercase tracking-wider animate-bounce">
              {t('pricing_save_20')}
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-24 max-w-6xl mx-auto">
          {plans.map((plan, idx) => {
            const isPlanActive = isSubscribed && plan.id === 'monthly_pro';
            const priceINR = billingPeriod === 'monthly' ? plan.priceINR.monthly : plan.priceINR.yearly;
            const priceUSD = billingPeriod === 'monthly' ? plan.priceUSD.monthly : plan.priceUSD.yearly;

            return (
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
                        {isPlanActive ? 'Current Plan' : plan.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-neutral-400 mb-6 leading-relaxed min-h-[40px]">{plan.description}</p>

                    {/* Price Block */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl sm:text-5xl font-black text-white transition-all duration-300">
                          {priceINR === 0 ? "₹0" : `₹${priceINR}`}
                        </span>
                        <span className="text-sm font-semibold text-neutral-400">
                          {priceINR === 0 ? "forever" : "/ month"}
                        </span>
                      </div>
                      {priceINR > 0 && (
                        <p className="text-xs text-neutral-500 mt-1">
                          approx. ${priceUSD} USD • Billed {billingPeriod}
                        </p>
                      )}
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
                    disabled={isPlanActive}
                    className={`w-full h-12 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${
                      isPlanActive
                        ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 cursor-default'
                        : plan.popular
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02]'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:scale-[1.01]'
                    }`}
                  >
                    {isPlanActive ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Current Active Plan</span>
                      </>
                    ) : (
                      <>
                        <span>{plan.cta}</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto mb-16 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="text-indigo-400 h-6 w-6" /> Frequently Asked Questions
            </h2>
            <p className="text-sm text-neutral-400">Everything you need to know about payments, credits, and billing.</p>
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

        {/* Payment Security Banner */}
        <div className="max-w-xl mx-auto text-center space-y-3 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-4 text-neutral-400 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 256-Bit SSL Encrypted</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-indigo-400" /> Razorpay Verified Checkout</span>
            <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-blue-400" /> Instant UPI Activation</span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            * All payments are processed securely through Razorpay. You can cancel or switch your plan at any time.
          </p>
        </div>
      </div>

      {/* RAZORPAY PAYMENT CHECKOUT MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  if (!isProcessing) setIsModalOpen(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {paymentSuccess ? (
                // SUCCESS CELEBRATION VIEW
                <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{t('payment_success_title')}</h3>
                    <p className="text-sm text-neutral-300 mt-2">
                      Congratulations! Your account is now upgraded to <strong className="text-indigo-400">{selectedPlan.name}</strong>.
                    </p>
                    <p className="text-xs text-emerald-400 mt-1 font-semibold">
                      ✓ 3-Credit Limit Removed • Unlimited Journeys Activated
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setIsModalOpen(false);
                      router.push('/create-new-trip');
                    }}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-bold cursor-pointer shadow-lg"
                  >
                    {t('payment_success_btn')}
                  </Button>
                </div>
              ) : (
                // CHECKOUT FORM VIEW
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t('checkout_secure_title')}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white">
                      {t('checkout_upgrade_to')} {selectedPlan.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Billed {billingPeriod} • Cancel anytime with zero fees
                    </p>
                  </div>

                  {/* Price Summary Card */}
                  <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-neutral-300">Plan Total ({billingPeriod}):</span>
                      <span className="text-2xl font-black text-white">
                        ₹{billingPeriod === 'monthly' ? selectedPlan.priceINR.monthly : selectedPlan.priceINR.yearly}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 border-t border-white/10 pt-2.5 flex items-center justify-between">
                      <span>Unlimited AI Trip Generations</span>
                      <span className="text-emerald-400 font-bold">Included</span>
                    </div>
                  </div>

                  {/* Payment Methods Supported */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                      Accepted Payment Methods
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1">
                        <Smartphone className="w-5 h-5 text-emerald-400" />
                        <span className="text-[11px] font-bold text-neutral-200">UPI / QR</span>
                        <span className="text-[9px] text-neutral-400">GPay, PhonePe</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1">
                        <CreditCard className="w-5 h-5 text-indigo-400" />
                        <span className="text-[11px] font-bold text-neutral-200">Debit / Credit</span>
                        <span className="text-[9px] text-neutral-400">Visa, RuPay</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <span className="text-[11px] font-bold text-neutral-200">Netbanking</span>
                        <span className="text-[9px] text-neutral-400">50+ Banks</span>
                      </div>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={initiateRazorpayPayment}
                      disabled={isProcessing}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-600 hover:from-indigo-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Connecting to Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4" />
                          <span>
                            Pay ₹{billingPeriod === 'monthly' ? selectedPlan.priceINR.monthly : selectedPlan.priceINR.yearly} via Razorpay
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    {/* Instant Simulation / Test Mode Button */}
                    <button
                      onClick={completeSubscription}
                      disabled={isProcessing}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-neutral-200 text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{t('checkout_test_btn')}</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Pricing
