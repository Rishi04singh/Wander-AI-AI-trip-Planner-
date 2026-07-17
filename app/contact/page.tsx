"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-28 pb-16 px-6 relative overflow-hidden transition-colors duration-300">
      {/* Dynamic background glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Hero Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Support & Feedback</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white tracking-tight"
          >
            Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Conversation</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed"
          >
            Have questions about customized plans, business partnerships, or just want to leave feedback? Drop us a line.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Side (4 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Info Cards */}
            <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xl p-8 rounded-[40px] border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl space-y-8">
              <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-2">
                <MessageSquare className="text-indigo-500 h-6 w-6" /> Contact Info
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100/50 dark:border-indigo-900/20 shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Us</p>
                    <a href="mailto:support@wandertrip.com" className="text-neutral-800 dark:text-neutral-200 font-bold hover:text-indigo-500 transition-colors">
                      support@wandertrip.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100/50 dark:border-indigo-900/20 shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Call Us</p>
                    <a href="tel:+15551234567" className="text-neutral-800 dark:text-neutral-200 font-bold hover:text-indigo-500 transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100/50 dark:border-indigo-900/20 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Our Headquarters</p>
                    <p className="text-neutral-800 dark:text-neutral-200 font-bold">
                      100 Pine Street, San Francisco, CA 94111
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100/50 dark:border-indigo-900/20 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Support Hours</p>
                    <p className="text-neutral-800 dark:text-neutral-200 font-bold">
                      24/7 Live Agent Availability
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Answer Banner */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-950 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
              <h4 className="text-xl font-black mb-3">Looking for quick answers?</h4>
              <p className="text-sm text-indigo-200/80 leading-relaxed mb-6">
                Most general inquiries about plan generation credits, account subscriptions, or route options can be resolved immediately in our pricing details.
              </p>
              <Button 
                onClick={() => window.location.href = '/pricing'}
                className="bg-white text-indigo-950 hover:bg-neutral-100 rounded-2xl font-bold px-6 py-2.5 shadow-lg flex items-center gap-2 group/btn"
              >
                <span>View Pricing Plans</span>
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          {/* Form Side (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-[40px] p-8 md:p-10 border border-neutral-200/60 dark:border-neutral-800/60 shadow-2xl relative">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-950/20 text-green-500 rounded-full flex items-center justify-center border border-green-100 dark:border-green-800/30 shadow-lg">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-neutral-800 dark:text-neutral-100">Message Received!</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-sm">
                      Thank you for reaching out. Our support crew will review your ticket and reply back shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formState.name}
                          onChange={handleChange}
                          placeholder="Jane Doe"
                          className="w-full h-12 px-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-neutral-400"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Your Email *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formState.email}
                          onChange={handleChange}
                          placeholder="jane@example.com"
                          className="w-full h-12 px-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-neutral-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        placeholder="Feedback on Itineraries / Partnerships"
                        className="w-full h-12 px-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-neutral-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">How can we help? *</label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Write details about your question..."
                        className="w-full p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium placeholder:text-neutral-400 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formState.name || !formState.email || !formState.message}
                      className="w-full h-14 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="h-4.5 w-4.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}

export default ContactPage;
