import React, { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import axios from 'axios'
import { motion } from 'motion/react'
import { resolveTravelImage } from '@/lib/travelImages'

interface PlaceCardItemProps {
    activity: {
        place_name: string;
        place_details: string;
        place_address: string;
        place_image_url?: string;
        time_travel_each_location: string;
        ticket_pricing: string;
        estimated_cost_per_person?: string;
        best_time_to_visit: string;
        is_evening_spot?: boolean;
        is_night_spot?: boolean;
        geo_coordinates?: {
            latitude?: number;
            longitude?: number;
            lat?: number;
            lng?: number;
        };
    };
    dayNumber: number;
    hourlyWeather?: {
        time: string[];
        temperature_2m: number[];
        weather_code: number[];
    } | null;
    onBookRide?: (name: string, lat: number, lng: number) => void;
}

function PlaceCardItem({ activity, dayNumber, hourlyWeather, onBookRide }: PlaceCardItemProps) {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (activity) {
            GetPlacePhoto();
        }
    }, [activity]);

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: activity.place_name + " in " + activity.place_address,
            isHotel: false,
            destination: activity.place_address
        }
        try {
            const result = await axios.post('/api/google-place-details', data);
            if (result.data && result.data.places && result.data.places.length > 0) {
                const photoUrl = result.data.places[0]?.photoUrl;
                if (photoUrl) {
                    setPhotoUrl(photoUrl);
                }
            } else {
                console.warn("No places found for activity:", activity.place_name);
            }
        } catch (error: any) {
            console.error("Error fetching activity photo details:", error.response?.data || error.message);
        }
    }

    const openGoogleMaps = () => {
        const query = encodeURIComponent(activity.place_name + " " + activity.place_address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }

    const rawTicketPricing = activity.ticket_pricing;
    const formattedTicketPricing = typeof rawTicketPricing === 'number'
        ? `₹${rawTicketPricing}`
        : typeof rawTicketPricing === 'string'
            ? rawTicketPricing.includes('₹') ? rawTicketPricing : `₹${rawTicketPricing.replace('$', '')}`
            : 'Free';

    const rawEstCost = activity.estimated_cost_per_person;
    const formattedEstCost = typeof rawEstCost === 'number'
        ? `₹${rawEstCost}`
        : typeof rawEstCost === 'string'
            ? rawEstCost.includes('₹') ? rawEstCost : `₹${rawEstCost.replace('$', '')}`
            : null;

    const getHourFromTimeString = (timeStr: string): number => {
        if (!timeStr) return 9;
        const cleanStr = timeStr.toLowerCase().trim();

        const match = cleanStr.match(/(\d+)(?::(\d+))?\s*(am|pm)/);
        if (match) {
            let hour = parseInt(match[1]);
            const period = match[3];
            if (period === 'pm' && hour < 12) hour += 12;
            if (period === 'am' && hour === 12) hour = 0;
            return hour;
        }

        if (cleanStr.includes('morning')) return 9;
        if (cleanStr.includes('afternoon')) return 13;
        if (cleanStr.includes('evening')) return 17;
        if (cleanStr.includes('night')) return 20;
        if (cleanStr.includes('noon')) return 12;

        return 9;
    };

    const hour = getHourFromTimeString(activity.best_time_to_visit);
    let forecastTemp: number | null = null;
    let forecastCondition = "Clear";
    let forecastIcon = "☀️";

    if (hourlyWeather && hourlyWeather.temperature_2m) {
        const index = ((dayNumber - 1) * 24 + hour) % hourlyWeather.temperature_2m.length;
        forecastTemp = Math.round(hourlyWeather.temperature_2m[index]);
        const code = hourlyWeather.weather_code[index];

        if (code === 0) { forecastCondition = "Clear Sky"; forecastIcon = "☀️"; }
        else if ([1, 2, 3].includes(code)) { forecastCondition = "Partly Cloudy"; forecastIcon = "⛅"; }
        else if ([45, 48].includes(code)) { forecastCondition = "Foggy"; forecastIcon = "🌫️"; }
        else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) { forecastCondition = "Rainy"; forecastIcon = "🌧️"; }
        else if ([71, 73, 75, 85, 86].includes(code)) { forecastCondition = "Snowy"; forecastIcon = "❄️"; }
        else if ([95, 96, 99].includes(code)) { forecastCondition = "Thunderstorm"; forecastIcon = "⛈️"; }
    }

    return (
        <motion.div 
            onClick={openGoogleMaps}
            whileHover={{ x: 6 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="flex flex-col md:flex-row gap-6 bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 group cursor-pointer"
        >
            <div className="w-full md:w-[220px] h-[150px] rounded-2xl overflow-hidden relative shrink-0 bg-neutral-100 dark:bg-neutral-800 shadow-inner">
                <img 
                    src={photoUrl || activity.place_image_url || resolveTravelImage(activity.place_name + " " + activity.place_address)} 
                    alt={activity.place_name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e: any) => {
                        e.target.src = resolveTravelImage(activity.place_name + " " + activity.place_address);
                    }}
                />
            </div>
            
            <div className="flex-1 flex flex-col justify-between py-1 space-y-4">
                <div className="space-y-2">
                    <div className="space-y-0.5">
                        <span className="text-[9px] text-blue-500 font-extrabold uppercase tracking-widest">{activity.time_travel_each_location}</span>
                        <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{activity.place_name}</h4>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs font-normal leading-relaxed line-clamp-2">{activity.place_details}</p>
                    <p className="text-neutral-400 text-[11px] font-medium flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-700 shrink-0" /> {activity.place_address}</p>
                </div>
                
                <div className="flex flex-wrap gap-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    {activity.is_evening_spot && (
                        <div className="px-3.5 py-1.5 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 text-orange-600 dark:text-orange-400 rounded-2xl text-[9px] font-extrabold uppercase tracking-wider border border-orange-100/60 dark:border-orange-900/20 flex items-center gap-1.5 shadow-sm">
                            🌅 Sunset Spot
                        </div>
                    )}
                    {activity.is_night_spot && (
                        <div className="px-3.5 py-1.5 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 text-indigo-600 dark:text-indigo-400 rounded-2xl text-[9px] font-extrabold uppercase tracking-wider border border-indigo-100/60 dark:border-indigo-900/20 flex items-center gap-1.5 shadow-sm">
                            🍽️ Night Spot
                        </div>
                    )}
                    <div className="px-3.5 py-1.5 bg-green-50/50 dark:bg-green-950/10 text-green-600 dark:text-green-400 rounded-2xl text-[9px] font-bold border border-green-100/60 dark:border-green-900/20 flex items-center gap-1.5 shadow-sm">
                        🎟️ {formattedTicketPricing}
                    </div>
                    {formattedEstCost && (
                        <div className="px-3.5 py-1.5 bg-yellow-50/50 dark:bg-yellow-950/10 text-yellow-600 dark:text-yellow-400 rounded-2xl text-[9px] font-bold border border-yellow-100/60 dark:border-yellow-900/20 flex items-center gap-1.5 shadow-sm">
                            💰 {formattedEstCost}
                        </div>
                    )}
                    <div className="px-3.5 py-1.5 bg-blue-50/50 dark:bg-blue-950/10 text-blue-600 dark:text-blue-400 rounded-2xl text-[9px] font-bold border border-blue-100/60 dark:border-blue-900/20 flex items-center gap-1.5 shadow-sm">
                        🕒 {activity.best_time_to_visit}
                    </div>
                    {forecastTemp !== null && (
                        <div className="px-3.5 py-1.5 bg-amber-50/50 dark:bg-amber-950/10 text-amber-600 dark:text-amber-400 rounded-2xl text-[9px] font-bold border border-amber-100/60 dark:border-amber-900/20 flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform duration-200 cursor-help" title={`Expected weather condition: ${forecastCondition}`}>
                            <span>{forecastIcon}</span>
                            <span>{forecastTemp}°C ({forecastCondition})</span>
                        </div>
                    )}
                    {onBookRide && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const lat = activity.geo_coordinates?.latitude || activity.geo_coordinates?.lat || 0;
                                const lng = activity.geo_coordinates?.longitude || activity.geo_coordinates?.lng || 0;
                                onBookRide(activity.place_name, lat, lng);
                            }}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[9px] font-bold shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all duration-200 print:hidden"
                        >
                            🚗 Book Ride
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default PlaceCardItem
