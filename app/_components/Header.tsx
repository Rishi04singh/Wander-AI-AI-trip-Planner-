import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
];

function Header() {
  return (
    <header className="fixed top-0 w-full flex items-center justify-between px-6 md:px-12 py-4 
    bg-black/20 backdrop-blur-xl border-b border-white/10 z-50 transition-all duration-300">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="p-2 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
          <Image src="/logo.svg" alt="Logo" width={28} height={28} className="drop-shadow-lg" />
        </div>

        <h2 className="font-bold text-2xl tracking-tight text-white drop-shadow-md">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Trip Planner</span>
        </h2>
      </Link>

      {/* Menu */}
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

      {/* Button */}
      <Button
        className="rounded-xl px-6 py-2 font-semibold text-sm
        bg-white text-black hover:bg-gray-200
        shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
        transition-all duration-300 hover:scale-[1.02]"
      >
        Get Started
      </Button>

    </header>
  );
}

export default Header;