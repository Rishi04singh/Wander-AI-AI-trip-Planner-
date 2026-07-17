"use client";

import React from 'react';
import { motion } from 'motion/react';
import { X, ArrowUpRight, Car, HelpCircle } from 'lucide-react';

interface RideOption {
    name: string;
    description: string;
    logo: string;
    color: string;
    textColor: string;
    getLink: (lat: number, lng: number, name: string) => string;
}

const SERVICES: Record<string, RideOption> = {
    uber: {
        name: 'Uber',
        description: 'Global ride-sharing and premium cabs.',
        logo: '🚗',
        color: 'bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-900',
        textColor: 'text-white',
        getLink: (lat, lng, name) => `https://m.uber.com/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(name)}`
    },
    lyft: {
        name: 'Lyft',
        description: 'Fast, friendly ride-sharing across North America.',
        logo: '🚙',
        color: 'bg-[#ff00bf] hover:bg-[#d600a0] text-white',
        textColor: 'text-white',
        getLink: (lat, lng, name) => `https://lyft.com/ride?id=lyft&destination[latitude]=${lat}&destination[longitude]=${lng}`
    },
    ola: {
        name: 'Ola Cabs',
        description: 'Leading cab booking option in India.',
        logo: '🚖',
        color: 'bg-[#a3c639] hover:bg-[#8ca82f] text-black',
        textColor: 'text-black',
        getLink: () => `https://www.olacabs.com/`
    },
    rapido: {
        name: 'Rapido',
        description: 'Fast bike-taxis & auto rides in India.',
        logo: '🏍️',
        color: 'bg-[#fcd116] hover:bg-[#deb40b] text-black',
        textColor: 'text-black',
        getLink: () => `https://www.rapido.bike/`
    },
    grab: {
        name: 'Grab',
        description: 'Preferred ride & transport service in Southeast Asia.',
        logo: '🚕',
        color: 'bg-[#00b14f] hover:bg-[#009141] text-white',
        textColor: 'text-white',
        getLink: () => `https://grab.onelink.me/2tBt/rideGrab`
    },
    gojek: {
        name: 'Gojek',
        description: 'Super-app for rides & moto taxis in SE Asia.',
        logo: '🛵',
        color: 'bg-[#00aa13] hover:bg-[#008f10] text-white',
        textColor: 'text-white',
        getLink: () => `https://www.gojek.com/`
    },
    bolt: {
        name: 'Bolt',
        description: 'Quick & affordable rides in Europe & London.',
        logo: '⚡',
        color: 'bg-[#34d399] hover:bg-[#059669] text-black font-extrabold',
        textColor: 'text-black',
        getLink: () => `https://bolt.eu/`
    },
    careem: {
        name: 'Careem',
        description: 'Popular ride-booking app in the UAE & Middle East.',
        logo: '💚',
        color: 'bg-[#4cbe23] hover:bg-[#3e9e1c] text-white',
        textColor: 'text-white',
        getLink: () => `https://www.careem.com/`
    }
};

const getOptionsForDestination = (destination: string) => {
    const dest = destination.toLowerCase();
    
    if (dest.includes('india') || dest.includes('bangalore') || dest.includes('delhi') || dest.includes('mumbai') || dest.includes('goa') || dest.includes('kolkata') || dest.includes('chennai') || dest.includes('hyderabad') || dest.includes('jaipur') || dest.includes('pune')) {
        return [SERVICES.uber, SERVICES.ola, SERVICES.rapido];
    }
    if (dest.includes('usa') || dest.includes('united states') || dest.includes('america') || dest.includes('new york') || dest.includes('california') || dest.includes('los angeles') || dest.includes('san francisco') || dest.includes('canada') || dest.includes('toronto') || dest.includes('vancouver')) {
        return [SERVICES.uber, SERVICES.lyft];
    }
    if (dest.includes('singapore') || dest.includes('thailand') || dest.includes('bangkok') || dest.includes('malaysia') || dest.includes('kuala lumpur') || dest.includes('indonesia') || dest.includes('bali') || dest.includes('vietnam') || dest.includes('hanoi') || dest.includes('philippines')) {
        return [SERVICES.grab, SERVICES.gojek, SERVICES.uber];
    }
    if (dest.includes('uk') || dest.includes('united kingdom') || dest.includes('london') || dest.includes('europe') || dest.includes('france') || dest.includes('paris') || dest.includes('germany') || dest.includes('berlin') || dest.includes('spain') || dest.includes('madrid') || dest.includes('italy') || dest.includes('rome')) {
        return [SERVICES.uber, SERVICES.bolt];
    }
    if (dest.includes('dubai') || dest.includes('uae') || dest.includes('united arab emirates') || dest.includes('abu dhabi') || dest.includes('saudi') || dest.includes('riyadh') || dest.includes('egypt') || dest.includes('cairo')) {
        return [SERVICES.careem, SERVICES.uber];
    }
    
    // Default fallback
    return [SERVICES.uber];
};

interface RideBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    placeName: string;
    destinationName: string;
    lat: number;
    lng: number;
}

export default function RideBookingModal({
    isOpen,
    onClose,
    placeName,
    destinationName,
    lat,
    lng
}: RideBookingModalProps) {
    if (!isOpen) return null;

    const rideOptions = getOptionsForDestination(destinationName);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-fade-in print:hidden">
            {/* Modal Box */}
            <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl relative"
            >
                {/* Header Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Title */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-2xl flex items-center justify-center">
                        <Car className="h-5.5 w-5.5" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg text-neutral-800 dark:text-neutral-100 leading-tight">
                            Book a Ride
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium">
                            Book local transit directly to your location
                        </p>
                    </div>
                </div>

                {/* Target Information */}
                <div className="bg-neutral-50 dark:bg-neutral-850 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800/40 mb-5">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-500">Destination Spot</span>
                    <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm mt-0.5">{placeName}</h4>
                    <p className="text-[10px] text-neutral-500 mt-1">Coordinates: {lat.toFixed(5)}, {lng.toFixed(5)}</p>
                </div>

                {/* Provider List */}
                <div className="space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                        Available services in {destinationName.split(',')[0]}
                    </span>
                    {rideOptions.map((opt, idx) => {
                        const bookingLink = opt.getLink(lat, lng, placeName);
                        return (
                            <a
                                key={idx}
                                href={bookingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-800/30 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-850 rounded-2xl transition group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl h-10 w-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-center shadow-sm">
                                        {opt.logo}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h5 className="font-extrabold text-neutral-800 dark:text-neutral-200 text-sm">
                                            {opt.name}
                                        </h5>
                                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                                            {opt.description}
                                        </p>
                                    </div>
                                </div>
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${opt.color}`}>
                                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </a>
                        );
                    })}
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex gap-2 text-[10px] text-neutral-400 dark:text-neutral-500 font-medium leading-normal">
                    <HelpCircle className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span>Clicking a service will launch the app or mobile booking page with pre-filled destination coordinates.</span>
                </div>
            </motion.div>
        </div>
    );
}
