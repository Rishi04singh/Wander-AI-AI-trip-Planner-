"use client"
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to prevent SSR issues with Globe.gl
const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-neutral-500 animate-pulse tracking-widest uppercase">Initializing Globe...</p>
    </div>
  )
});

interface GlobeViewProps {
  destination?: string;
  origin?: string;
}

const GlobeView = ({ destination, origin }: GlobeViewProps) => {
  const globeEl = useRef<any>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [arcsData, setArcsData] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container size
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Geocoding helper using Nominatim (OpenStreetMap)
  const geocode = async (query: string) => {
    if (!query || query.length < 3) return null;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
      const data = await response.json();
      if (data && data[0]) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: query
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  useEffect(() => {
    const updateGlobeData = async () => {
      const gOrigin = origin ? await geocode(origin) : null;
      const gDest = destination ? await geocode(destination) : null;

      const newPlaces = [];
      if (gOrigin) newPlaces.push({ ...gOrigin, color: '#818cf8', size: 1.2 }); // indigo-400
      if (gDest) newPlaces.push({ ...gDest, color: '#f87171', size: 1.6 }); // red-400

      setPlaces(newPlaces);

      if (gOrigin && gDest) {
        setArcsData([{
          startLat: gOrigin.lat,
          startLng: gOrigin.lng,
          endLat: gDest.lat,
          endLng: gDest.lng,
          color: ['#818cf8', '#f87171']
        }]);
      } else {
        setArcsData([]);
      }

      // Animate camera to destination or origin
      const target = gDest || gOrigin;
      if (target && globeEl.current) {
        globeEl.current.pointOfView({ 
          lat: target.lat, 
          lng: target.lng, 
          altitude: 1.8 
        }, 3000);
      }
    };

    updateGlobeData();
  }, [destination, origin]);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing group overflow-hidden">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        // Labels (Markers)
        labelsData={places}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lng}
        labelText={(d: any) => d.name}
        labelSize={(d: any) => d.size}
        labelDotRadius={0.4}
        labelColor={(d: any) => d.color}
        labelResolution={3}
        labelAltitude={0.01}

        // Arcs (Flight Path)
        arcsData={arcsData}
        arcColor={(d: any) => d.color}
        arcDashLength={0.4}
        arcDashGap={2}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.15}
      />

      {/* Modern Overlay Info */}
      <div className="absolute top-8 left-8 z-10 p-6 bg-white/5 dark:bg-black/20 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-none transition-all duration-500 group-hover:bg-white/10 group-hover:scale-105">
         <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
               <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Live Global View</span>
            </div>
            
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">
              {destination || "Planet Earth"}
            </h3>
            
            {origin && (
              <div className="flex items-center gap-2 mt-2">
                 <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Route:</span>
                 <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                   {origin} → {destination || "?"}
                 </span>
              </div>
            )}
         </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 px-4 py-2 bg-white/5 dark:bg-black/40 backdrop-blur-md rounded-full border border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] pointer-events-none group-hover:text-white/60 transition-colors">
         Drag to Rotate • Scroll to Zoom
      </div>
    </div>
  );
};

export default GlobeView;
