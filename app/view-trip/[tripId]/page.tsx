"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Globe, MapPin, Calendar, Wallet, Users, Hotel, Compass, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import HotelCardItem from './_components/HotelCardItem'
import PlaceCardItem from './_components/PlaceCardItem'
import TripMapGlobe from './_components/TripMapGlobe'
import RideBookingModal from './_components/RideBookingModal'
import MLAdaptiveTripPanel from './_components/MLAdaptiveTripPanel'
import { motion, AnimatePresence } from 'motion/react'

function ViewTrip() {
    const params = useParams()
    const tripId = params.tripId as string
    const trip = useQuery((api as any).trips.getTrip, tripId ? { tripId } : "skip")
    const [venuePhotoUrl, setVenuePhotoUrl] = useState<string | null>(null);
    const [rideModalOpen, setRideModalOpen] = useState(false);
    const [ridePlaceName, setRidePlaceName] = useState('');
    const [rideLat, setRideLat] = useState(0);
    const [rideLng, setRideLng] = useState(0);
    const [adaptedItineraryOverride, setAdaptedItineraryOverride] = useState<any[] | null>(null);

    const handleItineraryAdapted = (adaptedData: any) => {
        const rawPlan = trip?.tripData?.trip_plan || trip?.tripData;
        if (adaptedData?.adaptedItinerary && Array.isArray(rawPlan?.itinerary)) {
            const updated = rawPlan.itinerary.map((day: any, idx: number) => {
                const match = adaptedData.adaptedItinerary.find((a: any) => a.day === day.day || a.day === idx + 1);
                if (match) {
                    return {
                        ...day,
                        day_plan: match.adaptedPlan,
                        customerNote: match.customerNote,
                        weatherWarning: match.weatherWarning,
                        trafficWarning: match.trafficWarning,
                        optimizationAction: match.optimizationAction
                    };
                }
                return day;
            });
            setAdaptedItineraryOverride(updated);
        }
    };

    const handleBookRide = (name: string, lat: number, lng: number) => {
        setRidePlaceName(name);
        setRideLat(lat);
        setRideLng(lng);
        setRideModalOpen(true);
    };

    useEffect(() => {
        if (trip) {
            GetDestinationPhoto();
        }
    }, [trip]);

    const GetDestinationPhoto = async () => {
        const plan = trip?.tripData?.trip_plan || trip?.tripData;
        if (!plan?.destination) return;

        const data = {
            textQuery: plan.destination
        }
        try {
            const response = await axios.post('/api/google-place-details', data);
            if (response.data && response.data.places && response.data.places.length > 0) {
                const photoUrl = response.data.places[0]?.photoUrl;
                if (photoUrl) {
                    setVenuePhotoUrl(photoUrl);
                }
            }
        } catch (error) {
            console.error("Error fetching destination photo:", error);
        }
    }

    interface WeatherData {
        temp: number;
        condition: string;
        humidity: number;
        wind: number;
        icon: string;
    }
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [hourlyWeather, setHourlyWeather] = useState<any>(null);
    const [loadingWeather, setLoadingWeather] = useState<boolean>(false);

    useEffect(() => {
        if (trip) {
            fetchLiveWeather();
        }
    }, [trip]);

    const fetchLiveWeather = async () => {
        const plan = trip?.tripData?.trip_plan || trip?.tripData;
        if (!plan?.destination) return;

        setLoadingWeather(true);
        try {
            const geoRes = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(plan.destination)}&count=1&language=en&format=json`);
            if (geoRes.data?.results && geoRes.data.results.length > 0) {
                const city = geoRes.data.results[0];
                const lat = city.latitude;
                const lon = city.longitude;

                const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code`);
                const current = weatherRes.data?.current;
                const hourly = weatherRes.data?.hourly;

                if (hourly) {
                    setHourlyWeather(hourly);
                }

                if (current) {
                    const code = current.weather_code;
                    let condition = "Clear";
                    let icon = "☀️";

                    if (code === 0) { condition = "Clear Sky"; icon = "☀️"; }
                    else if ([1, 2, 3].includes(code)) { condition = "Partly Cloudy"; icon = "⛅"; }
                    else if ([45, 48].includes(code)) { condition = "Foggy"; icon = "🌫️"; }
                    else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) { condition = "Rainy"; icon = "🌧️"; }
                    else if ([71, 73, 75, 85, 86].includes(code)) { condition = "Snowy"; icon = "❄️"; }
                    else if ([95, 96, 99].includes(code)) { condition = "Thunderstorm"; icon = "⛈️"; }

                    setWeather({
                        temp: Math.round(current.temperature_2m),
                        condition,
                        humidity: current.relative_humidity_2m,
                        wind: Math.round(current.wind_speed_10m),
                        icon
                    });
                }
            }
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        } finally {
            setLoadingWeather(false);
        }
    };

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleDownloadPDF = () => {
        window.print();
    };

    const handleShareTrip = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setToastMessage("Trip link copied to clipboard! Share it with your friends ✈️");
            setTimeout(() => {
                setToastMessage(null);
            }, 3000);
        } catch (err) {
            console.error("Failed to copy link:", err);
            // Fallback
            const el = document.createElement('input');
            el.value = window.location.href;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setToastMessage("Trip link copied to clipboard! Share it with your friends ✈️");
            setTimeout(() => {
                setToastMessage(null);
            }, 3000);
        }
    };

  if (trip === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950 p-10">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-neutral-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading your dream trip...</p>
      </div>
    )
  }

  if (trip === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-950 p-10">
        <h2 className="text-2xl font-black text-neutral-800 dark:text-neutral-200">Trip not found</h2>
        <Button className="mt-4" onClick={() => window.location.href = '/'}>Go back home</Button>
      </div>
    )
  }

  const { tripData, userSelection } = trip
  const plan = tripData?.trip_plan || tripData

  const containerVariants = {
      hidden: { opacity: 0 },
      show: {
          opacity: 1,
          transition: {
              staggerChildren: 0.08
          }
      }
  } as const;

  const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-4 md:p-8 lg:p-12 space-y-16 mt-16">
      {/* Hero Section */}
      <motion.section 
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.6, ease: "easeOut" }}
         className="relative h-[350px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-xl group"
      >
         <img 
            src={venuePhotoUrl || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop`} 
            alt="Hero" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
            onError={(e: any) => {
                e.target.src = `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop`;
            }}
         />

         {/* Live Weather Widget (Top-Right of Hero) */}
         {weather && (
            <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/50 backdrop-blur-xl border border-white/10 px-3 py-2 md:px-4 md:py-3 rounded-2xl text-white shadow-2xl flex items-center gap-2 md:gap-3 transition-all hover:bg-black/75 group/weather z-20 print:hidden scale-90 md:scale-100 origin-top-right">
               <div className="text-2xl md:text-3xl animate-bounce" style={{ animationDuration: '4s' }}>{weather.icon}</div>
               <div className="flex flex-col">
                  <span className="text-[8px] md:text-[9px] uppercase font-black tracking-widest text-neutral-300">Live Weather</span>
                  <span className="text-base md:text-lg font-black leading-none mt-0.5">{weather.temp}°C</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-blue-300 mt-1">{weather.condition}</span>
               </div>
               <div className="h-6 md:h-8 w-[1px] bg-white/10 mx-0.5 md:mx-1"></div>
               <div className="flex flex-col text-[8px] md:text-[10px] text-neutral-300 font-semibold gap-0.5">
                  <span>💧 {weather.humidity}% Hum</span>
                  <span>💨 {weather.wind} km/h</span>
               </div>
            </div>
         )}
         {loadingWeather && (
            <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/50 backdrop-blur-xl border border-white/10 px-3 py-2 md:px-4 md:py-3 rounded-2xl text-white shadow-2xl flex items-center gap-2 md:gap-3 z-20 print:hidden scale-90 md:scale-100 origin-top-right">
               <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
               <span className="text-[8px] md:text-[10px] font-black uppercase tracking-wider text-neutral-300">Loading Weather...</span>
            </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10 lg:p-12">
            <div className="space-y-4 max-w-4xl">
               <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white rounded-full text-[9px] font-extrabold uppercase tracking-wider border border-blue-400/20">AI Itinerary</span>
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white rounded-full text-[9px] font-extrabold uppercase tracking-wider border border-white/10">Ready ✨</span>
               </div>
               <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                  Exploring <span className="text-blue-400 italic">{plan?.destination}</span>
               </h1>
               <div className="flex flex-wrap gap-2.5 text-white/95 font-bold">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-sm hover:bg-white/20 transition-all cursor-default">
                     <MapPin className="h-4 w-4 text-blue-400" /> 
                     <span className="text-xs md:text-sm">{plan?.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-sm hover:bg-white/20 transition-all cursor-default">
                     <Calendar className="h-4 w-4 text-green-400" /> 
                     <span className="text-xs md:text-sm">{plan?.duration} Days</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-sm hover:bg-white/20 transition-all cursor-default">
                     <Wallet className="h-4 w-4 text-yellow-400" /> 
                     <span className="text-xs md:text-sm capitalize">{plan?.budget} Budget</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-sm hover:bg-white/20 transition-all cursor-default">
                     <Users className="h-4 w-4 text-purple-400" /> 
                     <span className="text-xs md:text-sm">{plan?.group_size}</span>
                  </div>
               </div>
            </div>
         </div>
      </motion.section>

      {/* Hotels Section */}
      <section className="space-y-8">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
               <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800 dark:text-neutral-100 flex items-center gap-3 tracking-tight">
                  <Hotel className="h-8 w-8 text-blue-600" /> Recommended Stays
               </h2>
               <p className="text-sm text-neutral-500 font-medium max-w-xl">Curated hotel options optimized for your budget and preferences.</p>
            </div>
            <div className="flex gap-2">
               <Button variant="ghost" className="rounded-xl font-bold h-10 w-10 p-0 border border-neutral-200 dark:border-neutral-800"><Sparkles className="h-4 w-4 text-blue-500" /></Button>
               <Button className="rounded-xl px-5 h-10 bg-blue-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/10 hover:scale-103 transition-all">Check Deals</Button>
            </div>
         </div>
         
         <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
         >
            {Array.isArray(plan?.hotels) && plan.hotels.map((hotel: any, index: number) => (
               <motion.div variants={itemVariants} key={index}>
                  <HotelCardItem hotel={hotel} onBookRide={handleBookRide} />
               </motion.div>
            ))}
         </motion.div>
      </section>

      {/* Interactive Globe/Map View Section */}
      <TripMapGlobe plan={plan} />

      {/* Kaggle ML Adaptive Trip Optimizer */}
      <MLAdaptiveTripPanel 
        destination={plan?.destination || ''} 
        itinerary={plan?.itinerary || []} 
        onItineraryAdapted={handleItineraryAdapted}
      />

      {/* Itinerary Section */}
      <section className="space-y-10">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1.5">
               <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800 dark:text-neutral-100 flex items-center gap-3 tracking-tight">
                  <Compass className="h-8 w-8 text-red-500" /> Your Curated Journey
               </h2>
               <p className="text-sm text-neutral-500 font-medium max-w-xl">Optimized routes so you can make the most out of your travels.</p>
            </div>
            {adaptedItineraryOverride && (
               <span className="px-3.5 py-1.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-black flex items-center gap-1.5 self-start sm:self-auto animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" /> Personalized Schedule Active
               </span>
            )}
         </div>

         <div className="space-y-12">
            {Array.isArray(adaptedItineraryOverride || plan?.itinerary) && (adaptedItineraryOverride || plan?.itinerary).map((day: any, dIdx: number) => (
               <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: dIdx * 0.05 }}
                  key={dIdx} 
                  className="relative pl-10 md:pl-16 border-l-2 border-dashed border-neutral-200 dark:border-neutral-800"
               >
                  <div className="absolute -left-6 top-0 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-md shadow-red-500/10 ring-4 ring-neutral-50 dark:ring-neutral-950 transition-transform hover:rotate-6 cursor-default">
                     <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Day</span>
                     <span className="text-lg font-black leading-none">{day.day}</span>
                  </div>
                  
                  <div className="space-y-6">
                     <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm inline-flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                           <h4 className="text-base md:text-lg font-extrabold text-neutral-800 dark:text-neutral-100 tracking-tight">{day.day_plan}</h4>
                           {day.optimizationAction && (
                              <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase rounded-md">
                                 {day.optimizationAction}
                              </span>
                           )}
                        </div>

                        {day.customerNote && (
                           <p className="text-xs text-cyan-400 font-semibold bg-cyan-950/30 px-3 py-1.5 rounded-xl border border-cyan-500/20">
                              💡 {day.customerNote}
                           </p>
                        )}

                        <div className="flex items-center">
                          <span className="px-2.5 py-1 bg-red-50 dark:bg-red-950/10 text-red-500 dark:text-red-400 rounded-full text-[9px] font-bold uppercase tracking-wider border border-red-100/60 dark:border-red-900/20">
                             ✨ Best Time: {day.best_time_to_visit_day}
                          </span>
                        </div>
                     </div>

                     <div className="flex flex-col gap-5">
                        {Array.isArray(day?.activities) && day.activities.map((activity: any, aIdx: number) => (
                           <PlaceCardItem 
                              key={aIdx} 
                              activity={activity} 
                              dayNumber={dIdx + 1} 
                              hourlyWeather={hourlyWeather} 
                              onBookRide={handleBookRide}
                           />
                        ))}
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-16 md:py-24 text-center space-y-8 md:space-y-10 bg-gradient-to-br from-neutral-900 via-blue-950 to-neutral-900 rounded-[32px] md:rounded-[80px] relative overflow-hidden group shadow-[0_50px_100px_rgba(30,58,138,0.3)] print:hidden mx-2 md:mx-0">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
         <div className="relative z-10 space-y-6 md:space-y-8">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-2xl rounded-[35%] flex items-center justify-center mx-auto shadow-2xl border border-white/20 animate-bounce" style={{ animationDuration: '4s' }}>
                <Globe className="h-8 w-8 md:h-12 md:w-12 text-blue-400 animate-pulse" />
            </div>
            <div className="space-y-3 md:space-y-4">
               <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter max-w-4xl mx-auto px-4 md:px-6">
                  Ready for <span className="text-blue-400">Success</span> in {plan?.destination}?
               </h2>
               <p className="text-sm md:text-xl text-neutral-400 font-medium max-w-2xl mx-auto px-6 md:px-8 leading-relaxed opacity-80 italic">
                  "Adventure is worthwhile in itself." – Amelia Earhart
               </p>
            </div>
             <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-6 md:px-10 print:hidden">
                <Button 
                   onClick={handleDownloadPDF}
                   className="w-full sm:w-auto rounded-full px-8 md:px-12 h-14 md:h-20 bg-white text-blue-600 hover:bg-neutral-100 font-black text-lg md:text-2xl shadow-[0_20px_50px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 group/btn"
                >
                   Download PDF <Sparkles className="ml-3 h-5 w-5 md:h-6 md:w-6 group-hover/btn:animate-spin" />
                </Button>
                <Button 
                   onClick={handleShareTrip}
                   variant="outline" 
                   className="w-full sm:w-auto rounded-full px-8 md:px-12 h-14 md:h-20 bg-transparent text-white border-2 border-white/25 hover:bg-white/10 font-black text-lg md:text-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
                >
                   Share Trip ✈️
                </Button>
             </div>
          </div>
       </footer>

       {/* Toast Notification */}
       <AnimatePresence>
          {toastMessage && (
             <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-10 right-6 md:right-12 z-50 bg-neutral-900 dark:bg-white text-white dark:text-black font-extrabold px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 dark:border-neutral-200 flex items-center gap-3"
             >
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse animate-bounce" />
                <span className="text-sm tracking-wide">{toastMessage}</span>
             </motion.div>
          )}
       </AnimatePresence>

       {/* Ride Booking Modal */}
       <AnimatePresence>
          {rideModalOpen && (
             <RideBookingModal
                isOpen={rideModalOpen}
                onClose={() => setRideModalOpen(false)}
                placeName={ridePlaceName}
                destinationName={plan?.destination || ''}
                lat={rideLat}
                lng={rideLng}
             />
          )}
       </AnimatePresence>
    </div>
  )
}

export default ViewTrip
