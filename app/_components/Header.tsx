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
    <header className="w-full flex items-center justify-between px-10 py-4 bg-white/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <Image src="/logo.svg" alt="Logo" width={34} height={34} />
        <h2 className="font-bold text-2xl text-gray-800 tracking-tight">
          AI Trip Planner
        </h2>
      </div>

      {/* Menu Options */}
      <nav className="flex items-center gap-8">
        {menuOptions.map((option, index) => (
          <Link href={option.path} key={index}>
            <span className="text-gray-700 font-medium hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group">
              {option.name}

              {/* underline animation */}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        ))}
      </nav>

      {/* Get Started Button */}
      <Button className="rounded-xl px-6 py-2 text-base font-semibold bg-blue-500 hover:bg-blue-600 transition-all shadow-md hover:shadow-lg hover:scale-105">
        Get Started
      </Button>
    </header>
  );
}

export default Header;