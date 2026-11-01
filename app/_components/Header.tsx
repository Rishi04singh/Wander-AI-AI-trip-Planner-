"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Calendar & Targets", path: "/calendar" },
  { name: "Sathi 🧳", path: "/sathi" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
];

function Header() {
  const { user } = useUser();
  const router = useRouter();
  const path = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full flex items-center justify-between px-6 md:px-12 py-3.5 
    bg-black/50 backdrop-blur-2xl border-b border-white/10 z-50 transition-all duration-300 print:hidden">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 rounded-2xl group-hover:from-indigo-500/30 group-hover:to-blue-500/20 transition-all border border-indigo-500/20">
          <Image src="/logo.svg" alt="Logo" width={26} height={26} className="drop-shadow-lg group-hover:scale-110 transition-transform" />
        </div>

        <h2 className="font-bold text-xl md:text-2xl tracking-tight text-white drop-shadow-md flex items-center gap-1.5">
          Wanderer <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-blue-400">Travel</span>
        </h2>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl">
        {menuOptions.map((option, index) => {
          const isActive = path === option.path;
          return (
            <Link key={index} href={option.path}>
              <span className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 cursor-pointer block tracking-wide ${
                isActive ? "text-white bg-white/10 font-semibold" : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}>
                {option.name}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_8px_#818cf8]" />
                )}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Buttons */}
      <div className="flex items-center gap-3">
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
            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9 border border-white/20 hover:scale-105 transition-transform" } }} />
          </div>
        )}

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-neutral-950/95 border-b border-white/10 backdrop-blur-2xl px-6 py-6 flex flex-col gap-3 md:hidden shadow-2xl"
          >
            {menuOptions.map((option, index) => {
              const isActive = path === option.path;
              return (
                <Link
                  key={index}
                  href={option.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-medium transition-all ${
                    isActive ? "bg-indigo-600/30 text-white border border-indigo-500/40" : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {option.name}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}

export default Header;