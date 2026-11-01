"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Sparkles, 
  Home as HomeIcon, 
  Calendar as CalendarIcon, 
  Compass, 
  Tag, 
  Mail, 
  FolderHeart,
  ChevronRight,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const menuOptions = [
  { 
    name: "Home", 
    path: "/", 
    icon: <HomeIcon className="w-4 h-4 text-indigo-400" />,
    badge: null 
  },
  { 
    name: "Sathi 🧳", 
    path: "/sathi", 
    icon: <Bot className="w-4 h-4 text-emerald-400" />,
    badge: "ML Suite" 
  },
  { 
    name: "Calendar & Targets", 
    path: "/calendar", 
    icon: <CalendarIcon className="w-4 h-4 text-amber-400" />,
    badge: "Tracker" 
  },
  { 
    name: "Pricing", 
    path: "/pricing", 
    icon: <Tag className="w-4 h-4 text-blue-400" />,
    badge: null 
  },
  { 
    name: "Contact", 
    path: "/contact", 
    icon: <Mail className="w-4 h-4 text-purple-400" />,
    badge: null 
  },
];

function Header() {
  const { user } = useUser();
  const router = useRouter();
  const path = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [path]);

  return (
    <>
      <header className="fixed top-0 w-full flex items-center justify-between px-3.5 sm:px-6 md:px-12 py-3 bg-black/60 backdrop-blur-2xl border-b border-white/10 z-40 transition-all duration-300 print:hidden">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 rounded-2xl group-hover:from-indigo-500/30 group-hover:to-blue-500/20 transition-all border border-indigo-500/20">
            <Image src="/logo.svg" alt="Logo" width={22} height={22} className="drop-shadow-lg group-hover:scale-110 transition-transform" />
          </div>

          <h2 className="font-bold text-base sm:text-xl md:text-2xl tracking-tight text-white drop-shadow-md flex items-center gap-1">
            Wanderer <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-blue-400">Travel</span>
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl">
          {menuOptions.map((option, index) => {
            const isActive = path === option.path;
            return (
              <Link key={index} href={option.path}>
                <span className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 cursor-pointer flex items-center gap-1.5 tracking-wide ${
                  isActive ? "text-white bg-white/10 font-semibold" : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}>
                  <span>{option.name}</span>
                  {option.badge && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {option.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_#818cf8]" />
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Sathi pill on mobile navbar so it's ALWAYS 1-tap away */}
          <Link
            href="/sathi"
            className="flex md:hidden items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Sathi 🧳</span>
          </Link>

          {/* Desktop Auth / Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {!user ? (
              <SignInButton mode="modal">
                <Button
                  className="rounded-xl px-5 py-2 font-semibold text-sm
                  bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white
                  shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]
                  transition-all duration-300 hover:scale-[1.02] border border-indigo-400/30"
                >
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Get Started
                </Button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-3">
                {path === '/create-new-trip' ? (
                  <Button
                    onClick={() => router.push('/my-trips')}
                    className="rounded-xl px-5 py-2 font-semibold text-sm
                      bg-white/10 hover:bg-white/20 text-white border border-white/15
                      shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    My Trips
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push('/create-new-trip')}
                    className="rounded-xl px-5 py-2 font-semibold text-sm
                      bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white
                      shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 hover:scale-[1.02]"
                  >
                    Create Trip
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* User Button */}
          {user && (
            <UserButton appearance={{ elements: { avatarBox: "h-8 w-8 sm:h-9 sm:w-9 border border-white/20 hover:scale-105 transition-transform" } }} />
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-95 border border-white/15 transition-all flex items-center justify-center cursor-pointer shadow-sm"
            aria-label="Open side menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

      </header>

      {/* Modern Mobile Slide-in Side Drawer ("Side Wala Menu Bar") */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dimmed Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Slide-in Panel from Right */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed top-0 right-0 h-full w-[82vw] max-w-[320px] bg-neutral-950/98 border-l border-white/10 backdrop-blur-2xl z-50 flex flex-col justify-between p-6 shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 rounded-xl border border-indigo-500/20">
                      <Image src="/logo.svg" alt="Logo" width={22} height={22} />
                    </div>
                    <span className="font-extrabold text-base text-white">Menu Navigation</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Action Button: Plan New Trip */}
                <Link
                  href="/create-new-trip"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-blue-600/30 border border-indigo-500/40 text-white shadow-lg active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
                      <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "5s" }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Plan New Trip</h4>
                      <p className="text-[11px] text-indigo-200">AI Step-by-Step Copilot</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-300" />
                </Link>

                {/* Navigation Links */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 px-3">
                    Explore Platform
                  </span>
                  {menuOptions.map((option, index) => {
                    const isActive = path === option.path;
                    return (
                      <Link
                        key={index}
                        href={option.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-indigo-600/30 text-white border border-indigo-500/40 shadow-inner"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                            {option.icon}
                          </div>
                          <span>{option.name}</span>
                        </div>
                        {option.badge && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {option.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="border-t border-white/10 pt-4 mt-6 space-y-3">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      href="/my-trips"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-all"
                    >
                      <FolderHeart className="w-3.5 h-3.5 text-indigo-400" />
                      <span>My Saved Trips</span>
                    </Link>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-xs text-gray-300 truncate max-w-[190px]">
                        {user.fullName || user.primaryEmailAddress?.emailAddress}
                      </span>
                      <UserButton appearance={{ elements: { avatarBox: "h-7 w-7" } }} />
                    </div>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full rounded-xl py-3 font-semibold text-sm bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-xl cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get Started / Sign In
                    </Button>
                  </SignInButton>
                )}

                <p className="text-[10px] text-gray-500 text-center">
                  Wanderer Travel • Built for Explorers
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
