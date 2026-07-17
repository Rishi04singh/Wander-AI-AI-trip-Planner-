"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { Globe as GlobeIcon, Map as MapIcon, Navigation, Compass, Loader2 } from 'lucide-react';

// Dynamically import react-globe.gl to support SSR in Next.js
const Globe = dynamic(() => import('react-globe.gl'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-400 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="text-xs font-semibold uppercase tracking-widest animate-pulse">Initializing 3D Space...</span>
        </div>
    )
});

interface Waypoint {
    id: string;
    name: string;
    details: string;
    address: string;
    type: 'origin' | 'destination' | 'hotel' | 'activity';
    lat: number;
    lng: number;
    dayNumber?: number;
    orderIndex: number;
}

interface TripMapGlobeProps {
    plan: any;
}

export default function TripMapGlobe({ plan }: TripMapGlobeProps) {
    const [activeTab, setActiveTab] = useState<'globe' | 'street'>('globe');
    const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [originCoords, setOriginCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [destCoords, setDestCoords] = useState<{ lat: number; lng: number } | null>(null);

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const globeRef = useRef<any>(null);

    // 1. Geocode all locations
    useEffect(() => {
        if (!plan) return;

        const getCoords = async (item: any, query: string) => {
            // Option 1: Direct coordinates check from AI generated schema
            const geo = item.geo_coordinates || item.coordinates || item.geometry;
            if (geo) {
                const lat = Number(geo.latitude || geo.lat);
                const lng = Number(geo.longitude || geo.lng || geo.lon);
                if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                    return { lat, lng };
                }
            }

            // Sleep a small duration to avoid API rate limiting (429) on free keyless geocoding API
            await new Promise(resolve => setTimeout(resolve, 200));

            // Option 2: Geocode search fallback
            try {
                const res = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
                if (res.data?.results?.[0]) {
                    const r = res.data.results[0];
                    return { lat: r.latitude, lng: r.longitude };
                }
            } catch (e) {
                console.error("Geocode lookup failed for query:", query, e);
            }
            return null;
        };

        const geocodeAll = async () => {
            setLoading(true);
            const foundWaypoints: Waypoint[] = [];
            let originPoint: { lat: number; lng: number } | null = null;
            let destPoint: { lat: number; lng: number } | null = null;

            try {
                // Geocode Destination
                if (plan.destination) {
                    const coords = await getCoords(plan, plan.destination);
                    if (coords) {
                        destPoint = coords;
                        foundWaypoints.push({
                            id: 'destination-root',
                            name: plan.destination,
                            details: 'Primary destination',
                            address: plan.destination,
                            type: 'destination',
                            lat: coords.lat,
                            lng: coords.lng,
                            orderIndex: 0
                        });
                        setDestCoords(destPoint);
                    }
                }

                // Geocode Origin
                if (plan.origin) {
                    const coords = await getCoords({}, plan.origin);
                    if (coords) {
                        originPoint = coords;
                        foundWaypoints.push({
                            id: 'origin-root',
                            name: plan.origin,
                            details: 'Starting Point',
                            address: plan.origin,
                            type: 'origin',
                            lat: coords.lat,
                            lng: coords.lng,
                            orderIndex: -1
                        });
                        setOriginCoords(originPoint);
                    }
                }

                // Geocode Hotels
                if (Array.isArray(plan.hotels)) {
                    for (let i = 0; i < plan.hotels.length; i++) {
                        const hotel = plan.hotels[i];
                        const query = `${hotel.hotel_name}, ${plan.destination}`;
                        const coords = await getCoords(hotel, query);
                        if (coords) {
                            foundWaypoints.push({
                                id: `hotel-${i}`,
                                name: hotel.hotel_name,
                                details: `Hotel Recommendation (Price: ${hotel.price_per_night || 'N/A'})`,
                                address: hotel.hotel_address || plan.destination,
                                type: 'hotel',
                                lat: coords.lat,
                                lng: coords.lng,
                                orderIndex: 10 + i
                            });
                        }
                    }
                }

                // Geocode Activities (Day by Day)
                if (Array.isArray(plan.itinerary)) {
                    let actCounter = 0;
                    for (let dIdx = 0; dIdx < plan.itinerary.length; dIdx++) {
                        const day = plan.itinerary[dIdx];
                        if (Array.isArray(day?.activities)) {
                            for (let aIdx = 0; aIdx < day.activities.length; aIdx++) {
                                const act = day.activities[aIdx];
                                const query = `${act.place_name}, ${plan.destination}`;
                                const coords = await getCoords(act, query);
                                if (coords) {
                                    foundWaypoints.push({
                                        id: `act-${dIdx}-${aIdx}`,
                                        name: act.place_name,
                                        details: `Day ${dIdx + 1} - Visit at ${act.best_time_to_visit || 'scheduled time'}`,
                                        address: act.place_address || plan.destination,
                                        type: 'activity',
                                        lat: coords.lat,
                                        lng: coords.lng,
                                        dayNumber: dIdx + 1,
                                        orderIndex: 100 + dIdx * 24 + actCounter++
                                    });
                                }
                            }
                        }
                    }
                }

                // Sort waypoints chronologically
                foundWaypoints.sort((a, b) => a.orderIndex - b.orderIndex);
                setWaypoints(foundWaypoints);
            } catch (err) {
                console.error("Geocoding workflow error:", err);
            } finally {
                setLoading(false);
            }
        };

        geocodeAll();
    }, [plan]);

    // 2. Leaflet initialization for Street Map view (always initialized on mount/updates)
    useEffect(() => {
        if (loading || !destCoords) return;

        const initLeaflet = () => {
            const L = (window as any).L;
            if (!L || !mapContainerRef.current) return;

            // Destroy previous instance if any
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }

            // Create map
            const map = L.map(mapContainerRef.current, {
                zoomControl: true,
                attributionControl: false
            }).setView([destCoords.lat, destCoords.lng], 13);
            mapInstanceRef.current = map;

            // Load high-quality Voyager tile sets
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                maxZoom: 20
            }).addTo(map);

            const points: [number, number][] = [];

            // Add markers
            waypoints.forEach((wp) => {
                if (wp.type === 'origin') return; // Only focus on local destinations

                points.push([wp.lat, wp.lng]);

                // marker color definition
                let color = '#3b82f6'; // blue for activities
                if (wp.type === 'hotel') color = '#ef4444'; // red for hotels
                if (wp.type === 'destination') color = '#10b981'; // green for center

                const markerHtml = `
                    <div style="
                        background-color: ${color};
                        width: 14px;
                        height: 14px;
                        border-radius: 50%;
                        border: 2px solid white;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    "></div>
                `;

                const customIcon = L.divIcon({
                    html: markerHtml,
                    className: 'custom-map-icon',
                    iconSize: [14, 14],
                    iconAnchor: [7, 7]
                });

                const marker = L.marker([wp.lat, wp.lng], { icon: customIcon }).addTo(map);
                marker.bindPopup(`
                    <div style="font-family: inherit; font-size: 12px; padding: 4px; max-width: 200px;">
                        <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: ${color};">${wp.type}</span>
                        <h4 style="margin: 2px 0; font-weight: 700; color: #171717;">${wp.name}</h4>
                        <p style="margin: 0; color: #6b7280; font-size: 11px;">${wp.details}</p>
                    </div>
                `);
            });

            // Connect waypoints with polyline routing paths
            const activityPoints = waypoints
                .filter(wp => wp.type === 'activity' || wp.type === 'hotel')
                .map(wp => [wp.lat, wp.lng] as [number, number]);

            if (activityPoints.length > 1) {
                L.polyline(activityPoints, {
                    color: '#3b82f6',
                    weight: 3.5,
                    opacity: 0.8,
                    dashArray: '8, 8',
                    lineJoin: 'round'
                }).addTo(map);
            }

            if (points.length > 0) {
                const bounds = L.latLngBounds(points);
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        };

        if ((window as any).L) {
            initLeaflet();
            return;
        }

        // Inject Leaflet library assets if not available
        const linkId = 'leaflet-css';
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link');
            link.id = linkId;
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        const scriptId = 'leaflet-js';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.onload = () => {
                initLeaflet();
            };
            document.body.appendChild(script);
        } else {
            if ((window as any).L) {
                initLeaflet();
            }
        }
    }, [waypoints, loading, destCoords]);

    // 3. Handle Map resizing and bounds fitting when switching tabs to 'street'
    useEffect(() => {
        if (activeTab === 'street' && mapInstanceRef.current) {
            const timer = setTimeout(() => {
                // Invalidate size to recalculate rendering container limits
                mapInstanceRef.current.invalidateSize();

                // Re-fit map bounds
                const points = waypoints
                    .filter(wp => wp.type !== 'origin')
                    .map(wp => [wp.lat, wp.lng] as [number, number]);
                if (points.length > 0) {
                    const L = (window as any).L;
                    if (L) {
                        const bounds = L.latLngBounds(points);
                        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
                    }
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [activeTab, waypoints]);

    // Focus globe view on the destination
    useEffect(() => {
        if (activeTab === 'globe' && globeRef.current && destCoords) {
            setTimeout(() => {
                globeRef.current.pointOfView({
                    lat: destCoords.lat,
                    lng: destCoords.lng,
                    altitude: 1.5
                }, 1500);
            }, 1000);
        }
    }, [activeTab, destCoords]);

    // Prepare 3D globe visualization elements
    const globeMarkers = waypoints.map(wp => ({
        lat: wp.lat,
        lng: wp.lng,
        size: wp.type === 'destination' ? 0.8 : wp.type === 'hotel' ? 0.5 : 0.4,
        color: wp.type === 'destination' ? '#10b981' : wp.type === 'hotel' ? '#ef4444' : '#3b82f6',
        label: wp.name
    }));

    const arcsData = originCoords && destCoords ? [{
        startLat: originCoords.lat,
        startLng: originCoords.lng,
        endLat: destCoords.lat,
        endLng: destCoords.lng,
        color: ['#3b82f6', '#10b981']
    }] : [];

    return (
        <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black text-neutral-800 dark:text-neutral-200 tracking-tight flex items-center gap-2">
                        <Compass className="h-7 w-7 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
                        Interactive Travel Route
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
                        Visualize your route on a 3D spinning globe and zoom in to street level.
                    </p>
                </div>

                {/* Tab Toggles */}
                <div className="flex bg-neutral-200/60 dark:bg-neutral-800/40 p-1 rounded-xl border border-neutral-300/10 self-start shadow-sm print:hidden">
                    <button
                        onClick={() => setActiveTab('globe')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                            activeTab === 'globe'
                                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-md shadow-neutral-900/5'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                    >
                        <GlobeIcon className="h-4 w-4" />
                        3D Globe View
                    </button>
                    <button
                        onClick={() => setActiveTab('street')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${
                            activeTab === 'street'
                                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-md shadow-neutral-900/5'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                    >
                        <MapIcon className="h-4 w-4" />
                        Street Route Map
                    </button>
                </div>
            </div>

            {/* Map Canvas Frame */}
            <div className="h-[450px] w-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl bg-neutral-100 dark:bg-neutral-900 relative">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                        <span className="text-xs font-extrabold uppercase tracking-widest text-neutral-500 animate-pulse">Mapping coordinates...</span>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        {/* 3D Globe Container */}
                        <div className={`w-full h-full bg-neutral-950 ${activeTab === 'globe' ? 'block' : 'hidden'}`}>
                            <Globe
                                ref={globeRef}
                                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                                pointsData={globeMarkers}
                                pointColor="color"
                                pointAltitude={0.06}
                                pointRadius="size"
                                pointsMerge={true}
                                arcsData={arcsData}
                                arcColor="color"
                                arcDashLength={0.5}
                                arcDashGap={0.2}
                                arcDashAnimateTime={2000}
                                arcStroke={0.5}
                                labelsData={globeMarkers}
                                labelLat="lat"
                                labelLng="lng"
                                labelText="label"
                                labelSize={1.2}
                                labelColor={() => '#ffffff'}
                                labelDotRadius={0.3}
                                labelAltitude={0.07}
                                onPointClick={() => {
                                    setActiveTab('street');
                                }}
                            />
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-[10px] font-bold z-10 select-none">
                                💡 Tip: Click any point or select 'Street Map' to zoom to street-level routing
                            </div>
                        </div>

                        {/* 2D Street Map Container */}
                        <div className={`w-full h-full relative ${activeTab === 'street' ? 'block' : 'hidden'}`}>
                            <div ref={mapContainerRef} className="w-full h-full z-10" />
                            <button
                                onClick={() => setActiveTab('globe')}
                                className="absolute bottom-4 left-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white px-3 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 hover:scale-103 transition-transform z-20"
                            >
                                <Navigation className="h-3.5 w-3.5 rotate-45 text-blue-500" />
                                Back to 3D Globe
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
