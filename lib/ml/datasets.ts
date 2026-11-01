// Kaggle Travel & Climate Datasets for Wander-AI (Indian Travel Destinations Focused)

export interface KaggleDestination {
  id: string;
  name: string;
  state: string;
  country: string;
  category: 'Adventure' | 'Cultural' | 'Relaxation' | 'Luxury' | 'Budget' | 'Nature' | 'Beach' | 'Spiritual';
  avgDailyCostINR: number;
  bestMonths: number[]; // 1 = Jan, 12 = Dec
  popularityScore: number; // 0 - 100
  rating: number; // 1 - 5
  tags: string[];
  recommendedDays: number;
  description: string;
  weatherProfile: {
    peakSeasonTempC: number;
    offSeasonTempC: number;
    rainyMonths: number[];
  };
  highlights: string[];
}

export interface KaggleClimateRecord {
  destination: string;
  month: number; // 1 - 12
  monthName: string;
  avgTempC: number;
  maxTempC: number;
  minTempC: number;
  precipitationProb: number; // 0 - 100%
  humidityPct: number;
  uvIndex: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Snowy' | 'Extreme Heat' | 'Pleasant';
  weatherSeverity: 'Low' | 'Moderate' | 'High';
}

export interface KaggleTrafficRecord {
  destination: string;
  month: number;
  peakHourDelayMultiplier: number; // e.g. 1.45 means +45% delay
  congestionIndex: 'Low' | 'Moderate' | 'Heavy' | 'Severe';
  rushHours: string[];
  bestDepartureWindows: string[];
  recommendedTravelMode: string;
}

// Kaggle Indian Destinations Dataset (Feature Vectors)
export class KaggleDatasets {
  static DESTINATIONS: KaggleDestination[] = [
    {
      id: 'ind_1',
      name: 'Manali & Solang Valley',
      state: 'Himachal Pradesh',
      country: 'India',
      category: 'Adventure',
      avgDailyCostINR: 3500,
      bestMonths: [3, 4, 5, 6, 10, 11, 12],
      popularityScore: 98,
      rating: 4.8,
      tags: ['Snow', 'Paragliding', 'Himalayas', 'River Rafting', 'Hill Station'],
      recommendedDays: 4,
      description: 'Lush snow-capped Himalayan valley famous for paragliding, skiing, and scenic mountain passes.',
      weatherProfile: { peakSeasonTempC: 18, offSeasonTempC: 3, rainyMonths: [7, 8] },
      highlights: ['Solang Valley Adventures', 'Atal Tunnel Drive', 'Rohtang Pass Snow Point']
    },
    {
      id: 'ind_2',
      name: 'Goa Beaches & Forts',
      state: 'Goa',
      country: 'India',
      category: 'Beach',
      avgDailyCostINR: 4500,
      bestMonths: [10, 11, 12, 1, 2, 3],
      popularityScore: 99,
      rating: 4.9,
      tags: ['Beaches', 'Water Sports', 'Nightlife', 'Seafood', 'Portuguese Heritage'],
      recommendedDays: 5,
      description: 'India\'s beach capital with golden sands, vibrant shacks, water sports, and historic churches.',
      weatherProfile: { peakSeasonTempC: 30, offSeasonTempC: 28, rainyMonths: [6, 7, 8, 9] },
      highlights: ['Baga & Palolem Beach', 'Dudhsagar Waterfalls', 'Aguada Fort Sunset']
    },
    {
      id: 'ind_3',
      name: 'Leh & Ladakh',
      state: 'Ladakh',
      country: 'India',
      category: 'Adventure',
      avgDailyCostINR: 5500,
      bestMonths: [5, 6, 7, 8, 9],
      popularityScore: 96,
      rating: 4.9,
      tags: ['High Altitude', 'Pangong Lake', 'Monasteries', 'Biking', 'Valleys'],
      recommendedDays: 6,
      description: 'Land of high passes featuring crystal blue lakes, barren cold desert landscapes, and ancient gompas.',
      weatherProfile: { peakSeasonTempC: 18, offSeasonTempC: -12, rainyMonths: [] },
      highlights: ['Pangong Tso Lake', 'Nubra Valley Sand Dunes', 'Magnetic Hill']
    },
    {
      id: 'ind_4',
      name: 'Jaipur (Pink City)',
      state: 'Rajasthan',
      country: 'India',
      category: 'Cultural',
      avgDailyCostINR: 3800,
      bestMonths: [10, 11, 12, 1, 2, 3],
      popularityScore: 97,
      rating: 4.8,
      tags: ['Forts', 'Palaces', 'Royal Heritage', 'Bazaars', 'Rajasthani Food'],
      recommendedDays: 3,
      description: 'Royal capital of Rajasthan renowned for grand hilltop forts, pink sandstone architecture, and vibrant bazaars.',
      weatherProfile: { peakSeasonTempC: 24, offSeasonTempC: 38, rainyMonths: [7, 8] },
      highlights: ['Amer Fort Elephant Ride', 'Hawa Mahal View', 'City Palace & Jantar Mantar']
    },
    {
      id: 'ind_5',
      name: 'Kerala Backwaters (Alleppey & Kumarakom)',
      state: 'Kerala',
      country: 'India',
      category: 'Relaxation',
      avgDailyCostINR: 4200,
      bestMonths: [9, 10, 11, 12, 1, 2, 3],
      popularityScore: 95,
      rating: 4.9,
      tags: ['Houseboat', 'Backwaters', 'Ayurveda', 'Coconut Groves', 'Village Life'],
      recommendedDays: 4,
      description: 'Tranquil network of canals, lagoons, and emerald paddy fields navigated by traditional luxury houseboats.',
      weatherProfile: { peakSeasonTempC: 28, offSeasonTempC: 31, rainyMonths: [6, 7, 8] },
      highlights: ['Overnight Houseboat Cruise', 'Vembanad Lake Sunset', 'Ayurvedic Massage Therapy']
    },
    {
      id: 'ind_6',
      name: 'Varanasi (Kashi)',
      state: 'Uttar Pradesh',
      country: 'India',
      category: 'Spiritual',
      avgDailyCostINR: 2500,
      bestMonths: [10, 11, 12, 1, 2, 3],
      popularityScore: 96,
      rating: 4.8,
      tags: ['Ganga Aarti', 'Ancient Temples', 'Ghats', 'Boat Rides', 'Silk Sarees'],
      recommendedDays: 3,
      description: 'The spiritual heart of India on the banks of holy river Ganga with mesmerizing evening aartis.',
      weatherProfile: { peakSeasonTempC: 22, offSeasonTempC: 40, rainyMonths: [7, 8] },
      highlights: ['Dashashwamedh Ghat Evening Aarti', 'Subah-e-Banaras Morning Boat Tour', 'Kashi Vishwanath Temple']
    },
    {
      id: 'ind_7',
      name: 'Udaipur (City of Lakes)',
      state: 'Rajasthan',
      country: 'India',
      category: 'Luxury',
      avgDailyCostINR: 4800,
      bestMonths: [10, 11, 12, 1, 2, 3],
      popularityScore: 97,
      rating: 4.9,
      tags: ['Lakes', 'Lake Palace', 'Heritage', 'Romance', 'Fine Dining'],
      recommendedDays: 3,
      description: 'Romantic oasis surrounded by sparkling Aravalli hills, palatial marble palaces, and scenic lakes.',
      weatherProfile: { peakSeasonTempC: 24, offSeasonTempC: 36, rainyMonths: [7, 8] },
      highlights: ['City Palace Lake View', 'Lake Pichola Boat Ride', 'Jag Mandir Palace']
    },
    {
      id: 'ind_8',
      name: 'Rishikesh & Haridwar',
      state: 'Uttarakhand',
      country: 'India',
      category: 'Adventure',
      avgDailyCostINR: 2800,
      bestMonths: [2, 3, 4, 5, 9, 10, 11],
      popularityScore: 94,
      rating: 4.8,
      tags: ['White Water Rafting', 'Yoga', 'Ganga Ghats', 'Bungee Jumping', 'Spiritual'],
      recommendedDays: 3,
      description: 'Yoga capital of the world offering adrenaline white-water rafting, bungee jumps, and serene river ashrams.',
      weatherProfile: { peakSeasonTempC: 25, offSeasonTempC: 14, rainyMonths: [7, 8] },
      highlights: ['Shivpuri Ganga River Rafting', 'Laxman Jhula', 'Triveni Ghat Evening Aarti']
    },
    {
      id: 'ind_9',
      name: 'Munnar Tea Gardens',
      state: 'Kerala',
      country: 'India',
      category: 'Nature',
      avgDailyCostINR: 3200,
      bestMonths: [9, 10, 11, 12, 1, 2, 3, 4, 5],
      popularityScore: 93,
      rating: 4.8,
      tags: ['Tea Estates', 'Misty Hills', 'Waterfalls', 'Trekking', 'Wildlife'],
      recommendedDays: 3,
      description: 'Rolling green tea plantations, misty mountain peaks, and endangered Nilgiri Tahr wildlife sanctuaries.',
      weatherProfile: { peakSeasonTempC: 20, offSeasonTempC: 15, rainyMonths: [6, 7] },
      highlights: ['Kolukkumalai Tea Estate Sunrise', 'Eravikulam National Park', 'Mattupetty Dam']
    },
    {
      id: 'ind_10',
      name: 'Darjeeling & Kanchenjunga',
      state: 'West Bengal',
      country: 'India',
      category: 'Nature',
      avgDailyCostINR: 3000,
      bestMonths: [3, 4, 5, 9, 10, 11, 12],
      popularityScore: 92,
      rating: 4.7,
      tags: ['Toy Train', 'Tea Gardens', 'Himalayan Views', 'Monasteries', 'Culture'],
      recommendedDays: 3,
      description: 'Queen of the Hills with UNESCO Toy Train heritage, fragrant tea gardens, and views of Mt. Kanchenjunga.',
      weatherProfile: { peakSeasonTempC: 17, offSeasonTempC: 6, rainyMonths: [6, 7, 8] },
      highlights: ['Tiger Hill Sunrise over Kanchenjunga', 'Darjeeling Himalayan Railway Toy Train', 'Batasia Loop']
    }
  ];

  // Helper to get historical climate predictions for Indian places
  static getClimateData(destinationName: string, month: number): KaggleClimateRecord {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lower = destinationName.toLowerCase();

    // High Himalayan Cold Desert & Alpine Zone
    const isLadakh = ['leh', 'ladakh', 'nubra', 'pangong', 'zanskar', 'spiti', 'kargil', 'dras'].some(k => lower.includes(k));
    const isAlpine = ['gulmarg', 'sonamarg', 'auli', 'rohtang'].some(k => lower.includes(k));

    if (isLadakh) {
      const ladakhMap: Record<number, { avg: number; max: number; min: number; cond: KaggleClimateRecord['condition']; sev: KaggleClimateRecord['weatherSeverity']; prec: number; uv: number }> = {
        1:  { avg: -13, max: -4, min: -20, cond: 'Snowy', sev: 'High', prec: 50, uv: 4 },
        2:  { avg: -11, max: -3, min: -18, cond: 'Snowy', sev: 'High', prec: 45, uv: 5 },
        3:  { avg: -2,  max: 5,  min: -8,  cond: 'Snowy', sev: 'Moderate', prec: 40, uv: 6 },
        4:  { avg: 7,   max: 13, min: 1,   cond: 'Partly Cloudy', sev: 'Low', prec: 20, uv: 7 },
        5:  { avg: 13,  max: 19, min: 5,   cond: 'Sunny', sev: 'Low', prec: 10, uv: 9 },
        6:  { avg: 17,  max: 23, min: 9,   cond: 'Sunny', sev: 'Low', prec: 8,  uv: 10 },
        7:  { avg: 20,  max: 26, min: 12,  cond: 'Sunny', sev: 'Low', prec: 15, uv: 10 },
        8:  { avg: 19,  max: 25, min: 11,  cond: 'Sunny', sev: 'Low', prec: 18, uv: 9 },
        9:  { avg: 14,  max: 21, min: 6,   cond: 'Sunny', sev: 'Low', prec: 8,  uv: 8 },
        10: { avg: 8,   max: 15, min: -1,  cond: 'Sunny', sev: 'Low', prec: 10, uv: 6 },
        11: { avg: -1,  max: 7,  min: -7,  cond: 'Partly Cloudy', sev: 'Moderate', prec: 25, uv: 5 },
        12: { avg: -8,  max: 1,  min: -15, cond: 'Snowy', sev: 'High', prec: 40, uv: 4 },
      };
      const info = ladakhMap[month] || ladakhMap[2];
      return {
        destination: destinationName || 'Leh & Ladakh',
        month,
        monthName: monthNames[month - 1] || 'Feb',
        avgTempC: info.avg,
        maxTempC: info.max,
        minTempC: info.min,
        precipitationProb: info.prec,
        humidityPct: [1, 2, 12].includes(month) ? 55 : 40,
        uvIndex: info.uv,
        condition: info.cond,
        weatherSeverity: info.sev
      };
    }

    if (isAlpine && [11, 12, 1, 2, 3].includes(month)) {
      const alpineAvg = [1, 2].includes(month) ? -5 : -1;
      return {
        destination: destinationName,
        month,
        monthName: monthNames[month - 1] || 'Feb',
        avgTempC: alpineAvg,
        maxTempC: alpineAvg + 5,
        minTempC: alpineAvg - 6,
        precipitationProb: 65,
        humidityPct: 75,
        uvIndex: 4,
        condition: 'Snowy',
        weatherSeverity: 'High'
      };
    }

    const dest = this.DESTINATIONS.find(d => 
      d.name.toLowerCase().includes(destinationName.toLowerCase()) || 
      destinationName.toLowerCase().includes(d.name.toLowerCase())
    );

    const isMonsoon = dest?.weatherProfile.rainyMonths.includes(month) ?? (month === 7 || month === 8);
    const isSummer = [4, 5, 6].includes(month);
    const isWinter = [11, 12, 1, 2].includes(month);

    let avgTemp = 24;
    if (dest) {
      if (isSummer) {
        avgTemp = dest.weatherProfile.peakSeasonTempC + 6;
      } else if (isWinter) {
        avgTemp = dest.weatherProfile.offSeasonTempC;
      } else {
        avgTemp = dest.weatherProfile.peakSeasonTempC;
      }
    }

    let condition: KaggleClimateRecord['condition'] = 'Sunny';
    let precProb = 12;
    let severity: KaggleClimateRecord['weatherSeverity'] = 'Low';

    if (isMonsoon) {
      condition = 'Rainy';
      precProb = 85;
      severity = 'Moderate';
    } else if (avgTemp > 38) {
      condition = 'Extreme Heat';
      severity = 'High';
    } else if (avgTemp < 5) {
      condition = 'Snowy';
      precProb = 35;
      severity = isWinter ? 'High' : 'Moderate';
    } else if (precProb > 25) {
      condition = 'Partly Cloudy';
    }

    return {
      destination: dest?.name || destinationName,
      month,
      monthName: monthNames[month - 1] || 'Jan',
      avgTempC: avgTemp,
      maxTempC: avgTemp + 6,
      minTempC: avgTemp - 5,
      precipitationProb: precProb,
      humidityPct: isMonsoon ? 88 : 50,
      uvIndex: isSummer ? 9 : 5,
      condition,
      weatherSeverity: severity
    };
  }

  // Helper to get traffic congestion metrics for Indian places
  static getTrafficData(destinationName: string, month: number): KaggleTrafficRecord {
    const isPeakMonsoonOrHoliday = [6, 7, 10, 11, 12].includes(month);
    const congestion: KaggleTrafficRecord['congestionIndex'] = isPeakMonsoonOrHoliday ? 'Heavy' : 'Moderate';
    const delayMultiplier = isPeakMonsoonOrHoliday ? 1.38 : 1.15;

    return {
      destination: destinationName,
      month,
      peakHourDelayMultiplier: delayMultiplier,
      congestionIndex: congestion,
      rushHours: ['08:30 AM - 11:00 AM', '05:30 PM - 08:30 PM'],
      bestDepartureWindows: ['07:00 AM - 08:30 AM', '01:00 PM - 03:30 PM', '09:00 PM onwards'],
      recommendedTravelMode: isPeakMonsoonOrHoliday ? 'Autorickshaw / Local Metro / Pre-booked Cab' : 'Private Taxi / Bike Rental'
    };
  }
}
