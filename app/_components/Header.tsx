"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from 'motion/react';

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
];

function Header() {
  const { user } = useUser();
  const router = useRouter();
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full flex items-center justify-between px-6 md:px-12 py-4 
    bg-black/30 backdrop-blur-xl border-b border-white/10 z-50 transition-all duration-300 print:hidden">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
          <Image src="/logo.svg" alt="Logo" width={28} height={28} className="drop-shadow-lg" />
        </div>

        <h2 className="font-bold text-xl md:text-2xl tracking-tight text-white drop-shadow-md">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Trip Planner</span>
        </h2>
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
        {menuOptions.map((option, index) => (
          <Link key={index} href={option.path}>
            <span className="relative font-medium text-sm text-gray-300 hover:text-white transition duration-300 cursor-pointer group tracking-wide">
              {option.name}
              {/* animated underline */}
              <span className="absolute left-0 -bottom-1.5 h-0.5 w-0 bg-indigo-400 transition-all duration-300 group-hover:w-full rounded-full"></span>
            </span>
          </Link>
        ))}
      </nav>

      {/* Buttons / User Menu */}
      <div className="flex items-center gap-4">
        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          {!user ? (
            <SignInButton mode="modal">
              <Button
                className="rounded-xl px-6 py-2 font-semibold text-sm
                bg-white text-black hover:bg-gray-200
                shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
                transition-all duration-300 hover:scale-[1.02]"
              >
                Get Started
              </Button>
            </SignInButton>
          ) : (
            <div className="flex items-center gap-4">
              {path === '/create-new-trip' ? (
                <Button
                  onClick={() => router.push('/my-trips')}
                  className="rounded-xl px-6 py-2 font-semibold text-sm
                    bg-white text-black hover:bg-gray-200
                    shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
                    transition-all duration-300 hover:scale-[1.02]"
                >
                  My Trips
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/create-new-trip')}
                  className="rounded-xl px-6 py-2 font-semibold text-sm
                    bg-white text-black hover:bg-gray-200
                    shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
                    transition-all duration-300 hover:scale-[1.02]"
                >
                  Create New trip
                </Button>
              )}
              <UserButton appearance={{ elements: { avatarBox: "h-10 w-10 border border-white/20" } }} />
            </div>
          )}
        </div>

        {/* Mobile Avatar + Toggle Container */}
        <div className="flex sm:hidden items-center gap-3">
          {user && <UserButton appearance={{ elements: { avatarBox: "h-9 w-9 border border-white/20" } }} />}
        </div>

        {/* Hamburger Menu Toggle Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden p-2 rounded-xl text-gray-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition duration-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[73px] left-0 w-full bg-neutral-950/95 backdrop-blur-2xl border-b border-white/10 py-6 px-6 flex flex-col gap-6 md:hidden z-40 shadow-2xl"
          >
            {/* Nav Links */}
            <div className="flex flex-col gap-4">
              {menuOptions.map((option, index) => (
                <Link key={index} href={option.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className={`block py-2 text-base font-semibold transition duration-200 ${path === option.path ? 'text-indigo-400' : 'text-gray-300 hover:text-white'}`}>
                    {option.name}
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
              {!user ? (
                <SignInButton mode="modal">
                  <Button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full rounded-xl py-3 font-semibold text-sm bg-white text-black hover:bg-gray-200"
                  >
                    Get Started
                  </Button>
                </SignInButton>
              ) : (
                <div className="flex flex-col gap-3">
                  {path === '/create-new-trip' ? (
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push('/my-trips');
                      }}
                      className="w-full rounded-xl py-3 font-semibold text-sm bg-white text-black hover:bg-gray-200"
                    >
                      My Trips
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        router.push('/create-new-trip');
                      }}
                      className="w-full rounded-xl py-3 font-semibold text-sm bg-white text-black hover:bg-gray-200"
                    >
                      Create New Trip
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}

export default Header;