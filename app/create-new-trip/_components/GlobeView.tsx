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

  // Fast offline coordinates dictionary for instant 0ms camera navigation
  const FAST_COORDS: Record<string, { lat: number; lng: number }> = {
    paris: { lat: 48.8566, lng: 2.3522 },
    tokyo: { lat: 35.6762, lng: 139.6503 },
    "new york": { lat: 40.7128, lng: -74.0060 },
    nyc: { lat: 40.7128, lng: -74.0060 },
    london: { lat: 51.5074, lng: -0.1278 },
    mumbai: { lat: 19.0760, lng: 72.8777 },
    delhi: { lat: 28.6139, lng: 77.2090 },
    "new delhi": { lat: 28.6139, lng: 77.2090 },
    bengaluru: { lat: 12.9716, lng: 77.5946 },
    bangalore: { lat: 12.9716, lng: 77.5946 },
    dubai: { lat: 25.2048, lng: 55.2708 },
    singapore: { lat: 1.3521, lng: 103.8198 },
    rome: { lat: 41.9028, lng: 12.4964 },
    bali: { lat: -8.4095, lng: 115.1889 },
    interlaken: { lat: 46.6863, lng: 7.8632 },
    santorini: { lat: 36.3932, lng: 25.4615 },
    "machu picchu": { lat: -13.1631, lng: -72.5450 },
    "grand canyon": { lat: 36.1069, lng: -112.1129 },
    kyoto: { lat: 35.0116, lng: 135.7681 },
    queenstown: { lat: -45.0312, lng: 168.6626 },
    banff: { lat: 51.1784, lng: -115.5708 },
    goa: { lat: 15.2993, lng: 74.1240 },
    manali: { lat: 32.2432, lng: 77.1892 },
    leh: { lat: 34.1526, lng: 77.5771 },
    ladakh: { lat: 34.1526, lng: 77.5771 },
    jaipur: { lat: 26.9124, lng: 75.7873 },
    udaipur: { lat: 24.5854, lng: 73.7125 },
    hallstatt: { lat: 47.5622, lng: 13.6493 },
    chefchaouen: { lat: 35.1714, lng: -5.2697 },
    sintra: { lat: 38.8029, lng: -9.3817 },
    meteora: { lat: 39.7217, lng: 21.6306 },
    gokayama: { lat: 36.4022, lng: 136.9175 },
    moab: { lat: 38.5738, lng: -109.5498 },
    patagonia: { lat: -51.2532, lng: -72.8817 },
    "skellig michael": { lat: 51.7708, lng: -10.5403 },
    "great barrier reef": { lat: -18.2871, lng: 147.6992 },
    "san francisco": { lat: 37.7749, lng: -122.4194 },
    sydney: { lat: -33.8688, lng: 151.2093 }
  };

  // Geocoding helper with instant dictionary lookup + Nominatim fallback
  const geocode = async (query: string) => {
    if (!query || query.length < 2) return null;
    
    // Check dictionary first (instant)
    const lower = query.toLowerCase().trim();
    for (const [key, coords] of Object.entries(FAST_COORDS)) {
      if (lower.includes(key)) {
        return { lat: coords.lat, lng: coords.lng, name: query };
      }
    }

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
      console.warn('Geocoding network fallback:', error);
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

  const [autoRotate, setAutoRotate] = useState(true);

  const resetCamera = () => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 1500);
    }
  };

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = autoRotate;
      globeEl.current.controls().autoRotateSpeed = 0.8;
    }
  }, [autoRotate]);

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
      <div className="absolute top-8 left-8 z-10 p-6 bg-black/40 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] pointer-events-none transition-all duration-500 group-hover:bg-black/60 group-hover:scale-105">
         <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-2">
               <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Live 3D Globe Visualization</span>
            </div>
            
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">
              {destination || "Planet Earth"}
            </h3>
            
            {origin && (
              <div className="flex items-center gap-2 mt-2">
                 <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Route:</span>
                 <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-500/30">
                   {origin} → {destination || "?"}
                 </span>
              </div>
            )}
         </div>
      </div>

      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-8 right-8 z-10 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="px-4 py-2 bg-black/50 hover:bg-indigo-600/50 backdrop-blur-md rounded-full border border-white/15 text-xs font-bold text-white transition-all shadow-lg hover:scale-105"
        >
          {autoRotate ? "Pause Rotate" : "Auto Rotate"}
        </button>
        <button
          onClick={resetCamera}
          className="px-4 py-2 bg-black/50 hover:bg-indigo-600/50 backdrop-blur-md rounded-full border border-white/15 text-xs font-bold text-white transition-all shadow-lg hover:scale-105"
        >
          Reset View
        </button>
      </div>
    </div>
  );
};

export default GlobeView;
