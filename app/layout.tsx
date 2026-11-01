import type { Metadata } from "next";
import {Outfit} from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";


export const metadata: Metadata = {
  title: "Wanderer | Smart Travel & Itinerary Platform",
  description: "Explore destinations, plan day-by-day itineraries, track travel milestones, and optimize trips with real-time weather and traffic intelligence.",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      </head>
      <body
       className={outfit.className}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>

      </body>
    </html>
      </ClerkProvider>
  );
}
