import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroCarousel from "./_components/HeroCarousel";
import { VideoSection } from "./_components/VideoSection";
import { Popularcitylist } from "./_components/Popularcitylist";

export default function Home() {
  return (
    <div className="bg-neutral-950 min-h-screen">
      <HeroCarousel />
      <VideoSection />
      <Popularcitylist />
    </div>
  );
}
