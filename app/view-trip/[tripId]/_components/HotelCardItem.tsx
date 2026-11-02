import React, { useEffect, useState } from 'react'
import { MapPin, Map } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { getHotelImage } from '@/lib/travelImages'

interface HotelCardItemProps {
    hotel: {
        hotel_name: string;
        hotel_address: string;
        price_per_night: string;
        rating: number;
        description: string;
        hotel_image_url?: string;
        geo_coordinates?: {
            latitude?: number;
            longitude?: number;
            lat?: number;
            lng?: number;
        };
    };
    onBookRide?: (name: string, lat: number, lng: number) => void;
}

function HotelCardItem({ hotel, onBookRide }: HotelCardItemProps) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (hotel) {
            GetPlacePhoto();
        }
    }, [hotel]);

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: hotel.hotel_name + " in " + hotel.hotel_address,
            isHotel: true,
            destination: hotel.hotel_address
        }
        try {
            const result = await axios.post('/api/google-place-details', data);
            if (result.data && result.data.places && result.data.places.length > 0) {
                const photoUrl = result.data.places[0]?.photoUrl;
                if (photoUrl) {
                    setPhotoUrl(photoUrl);
                }
            } else {
                console.warn("No places found for hotel:", hotel.hotel_name);
            }
        } catch (error: any) {
            console.error("Error fetching hotel photo details:", error.response?.data || error.message);
        }
    }

    const openGoogleMaps = () => {
        const query = encodeURIComponent(hotel.hotel_name + " " + hotel.hotel_address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }

    const rawPrice = hotel.price_per_night;
    const formattedPrice = typeof rawPrice === 'number'
        ? `₹${rawPrice}`
        : typeof rawPrice === 'string'
            ? rawPrice.includes('₹') ? rawPrice : `₹${rawPrice.replace('$', '')}`
            : '₹N/A';

    return (
        <motion.div 
            onClick={openGoogleMaps}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-neutral-100 dark:border-neutral-800 group cursor-pointer flex flex-col h-full"
        >
            <div className="h-48 relative overflow-hidden">
                <img 
                    src={photoUrl || hotel.hotel_image_url || getHotelImage(hotel.hotel_address || hotel.hotel_name)} 
                    alt={hotel.hotel_name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e: any) => {
                        e.target.src = getHotelImage(hotel.hotel_address || hotel.hotel_name);
                    }}
                />
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1 shadow-md border border-white/50 dark:border-neutral-800">
                    ⭐ <span className="text-neutral-800 dark:text-neutral-200">{hotel.rating || 'N/A'}</span>
                </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 leading-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{hotel.hotel_name}</h3>
                        <p className="text-[11px] font-medium text-neutral-400 flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /> {hotel.hotel_address}</p>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs font-normal leading-relaxed line-clamp-2">{hotel.description}</p>
                </div>
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400">Nightly Rate</p>
                        <p className="text-lg font-black text-green-600 dark:text-green-400 tracking-tight">{formattedPrice}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        {onBookRide && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const lat = hotel.geo_coordinates?.latitude || hotel.geo_coordinates?.lat || 0;
                                    const lng = hotel.geo_coordinates?.longitude || hotel.geo_coordinates?.lng || 0;
                                    onBookRide(hotel.hotel_name, lat, lng);
                                }}
                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold shadow-sm cursor-pointer hover:scale-105 transition-all duration-200 print:hidden"
                            >
                                🚗 Book Ride
                            </button>
                        )}
                        <div className="w-9 h-9 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shrink-0">
                            <Map className="h-4.5 w-4.5" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default HotelCardItem
