"use client";

import React from "react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { motion } from "motion/react";

export function VideoSection() {
  return (
    <section className="relative w-full py-20 md:py-32 bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -top-40 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight"
          >
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Future of Travel</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg lg:text-xl max-w-3xl mx-auto font-medium"
          >
            Watch how our AI plans your perfect itinerary in seconds. Sit back, relax, and let the magic happen before your eyes.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full max-w-5xl mx-auto relative group aspect-video"
        >
          {/* Cinematic lighting effect behind video */}
          <div className="absolute -inset-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-blue-500/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-neutral-900/40 backdrop-blur-2xl">
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=3540&auto=format&fit=crop"
              thumbnailAlt="AI Travel Planner Experience"
              className="size-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
