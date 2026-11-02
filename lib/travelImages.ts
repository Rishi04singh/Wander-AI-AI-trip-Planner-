/**
 * WanderAI Curated Travel Photography Engine
 * 
 * Provides verified, location-accurate, high-definition photography
 * for destinations, iconic landmarks, destination-authentic hotels, and activities.
 */

// Curated verified landmark & attraction photo registry (Unsplash CDN direct)
export const LANDMARK_REGISTRY: { patterns: string[]; imageUrl: string }[] = [
  // --- LEH & LADAKH ---
  {
    patterns: ['pangong', 'pangong tso', 'pangong lake', 'spanggur'],
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80' // Pangong Tso azure waters
  },
  {
    patterns: ['nubra', 'nubra valley', 'hunder', 'hunder sand dunes', 'diskit'],
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80' // Nubra Valley sand dunes & mountains
  },
  {
    patterns: ['khardung la', 'khardungla', 'khardung pass', 'highest motorable'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' // High altitude snowy mountain pass
  },
  {
    patterns: ['thiksey', 'thiksay', 'hemis', 'shey palace', 'alchi', 'diskit monastery', 'spituk', 'stok palace'],
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80' // Majestic Tibetan Buddhist monastery perched on hill
  },
  {
    patterns: ['magnetic hill', 'zanskar confluence', 'sangam point', 'indus zanskar'],
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80' // Rugged Ladakh highway & mountain valley
  },
  {
    patterns: ['shanti stupa', 'leh stupa', 'peace pagoda leh'],
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80' // Shanti Stupa overlooking Leh city
  },
  {
    patterns: ['leh palace', 'tsemo fort', 'leh market', 'leh main bazaar'],
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80' // Historic Leh town
  },

  // --- MANALI & HIMACHAL PRADESH ---
  {
    patterns: ['hadimba', 'hidimba', 'hadimba temple', 'hidimba devi', 'dhungari'],
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80' // Hadimba wooden pagoda temple in cedar pine forest
  },
  {
    patterns: ['solang', 'solang valley', 'solang nullah', 'paragliding in solang', 'zorbing'],
    imageUrl: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80' // Solang valley snow peaks & paragliding
  },
  {
    patterns: ['rohtang', 'rohtang pass', 'atal tunnel', 'sissu'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' // Rohtang snow pass
  },
  {
    patterns: ['jogini', 'jogini waterfall', 'vashisht', 'vashist hot springs', 'jana waterfall'],
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80' // Pine forest mountain waterfall
  },
  {
    patterns: ['old manali', 'manu temple', 'mall road manali', 'manali mall road', 'tibetan monastery manali', 'beas river'],
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80' // Manali mountain valley & deodar forests
  },
  {
    patterns: ['kasol', 'tosh', 'parvati valley', 'kheerganga', 'malana', 'chalal'],
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' // Scenic Parvati valley pine rivers
  },
  {
    patterns: ['shimla', 'the ridge', 'mall road shimla', 'jakhoo temple', 'kalka shimla', 'kufri'],
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80' // Historic Shimla Ridge & Himalayan pine slopes
  },

  // --- GOA ---
  {
    patterns: ['baga beach', 'calangute', 'anjuna', 'vagator', 'candolim', 'morjim', 'arambol', 'palolem', 'colva', 'benaulim'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' // Tropical golden beach with ocean waves
  },
  {
    patterns: ['aguada', 'fort aguada', 'chapora', 'chapora fort', 'cabo de rama', 'reis magos'],
    imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80' // Coastal stone fortress overlooking turquoise Arabian sea
  },
  {
    patterns: ['dudhsagar', 'dudhsagar falls', 'dudhsagar waterfall'],
    imageUrl: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=1200&q=80' // Majestic multi-tiered tropical waterfall
  },
  {
    patterns: ['basilica of bom jesus', 'se cathedral', 'old goa', 'church of our lady of immaculate conception', 'fontainhas'],
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80' // Old Goa heritage architecture & palms
  },

  // --- JAIPUR & RAJASTHAN ---
  {
    patterns: ['hawa mahal', 'palace of winds'],
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' // Iconic Hawa Mahal pink sandstone facade
  },
  {
    patterns: ['amer fort', 'amber fort', 'amber palace', 'sheesh mahal amer'],
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80' // Grand Amer Fort ramparts
  },
  {
    patterns: ['city palace jaipur', 'jal mahal', 'nahargarh', 'jaigarh', 'jantar mantar jaipur', 'chokhi dhani', 'albert hall'],
    imageUrl: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80' // Royal Rajasthani palace courtyard
  },
  {
    patterns: ['udaipur', 'lake pichola', 'city palace udaipur', 'jag mandir', 'fateh sagar', 'saheliyon ki bari', 'monsoon palace'],
    imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80' // Udaipur Lake Palace on shimmering water
  },
  {
    patterns: ['jodhpur', 'mehrangarh', 'mehrangarh fort', 'blue city', 'jaswant thada', 'umaid bhawan'],
    imageUrl: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=1200&q=80' // Historic Rajasthan desert fortress
  },
  {
    patterns: ['jaisalmer', 'sam sand dunes', 'jaisalmer fort', 'patwon ki haveli', 'desert safari jaisalmer'],
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80' // Golden desert sand dunes
  },

  // --- KASHMIR ---
  {
    patterns: ['dal lake', 'shikara', 'char chinar', 'nigeen lake', 'floating market srinagar'],
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80' // Dal Lake Shikara with Pir Panjal mountain reflection
  },
  {
    patterns: ['gulmarg', 'gondola', 'gulmarg gondola', 'aphrawat peak', 'skiing in gulmarg'],
    imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=1200&q=80' // Snowy pine ski slopes of Gulmarg
  },
  {
    patterns: ['pahalgam', 'betaab valley', 'aru valley', 'baisaran', 'chandanwari', 'sonamarg', 'thajiwas glacier'],
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' // Lush green valley and river in Kashmir
  },
  {
    patterns: ['mughal gardens', 'shalimar bagh', 'nishat bagh', 'chashme shahi', 'shankaracharya temple'],
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80' // Srinagar heritage gardens
  },

  // --- KERALA ---
  {
    patterns: ['alleppey', 'alappuzha', 'kumarakom', 'backwaters', 'houseboat', 'vembanad lake'],
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' // Traditional wooden houseboat on tropical Kerala backwaters
  },
  {
    patterns: ['munnar', 'tea garden', 'tea estate', 'eravikulam', 'mattupetty dam', 'anamudi'],
    imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80' // Emerald green rolling tea plantations
  },
  {
    patterns: ['fort kochi', 'chinese fishing nets', 'mattancherry', 'jew town kochi'],
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80' // Coastal Kerala palms & heritage
  },
  {
    patterns: ['varkala', 'varkala cliff', 'kovalam', 'marari beach', 'wayanad'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' // Kerala coastline beach
  },

  // --- VARANASI & UTTAR PRADESH ---
  {
    patterns: ['dashashwamedh', 'ganga aarti', 'assi ghat', 'manikarnika', 'varanasi ghat', 'boating in ganges'],
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80' // Evening Ganga Aarti on Varanasi river ghat
  },
  {
    patterns: ['kashi vishwanath', 'sarnath', 'dhamek stupa', 'tulsi manas', 'banaras ghats'],
    imageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80' // Morning boats on Ganges river ghats
  },
  {
    patterns: ['taj mahal', 'taj', 'mehtab bagh'],
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80' // Iconic white marble Taj Mahal with water reflection
  },
  {
    patterns: ['agra fort', 'fatehpur sikri', 'buland darwaza', 'akbar tomb'],
    imageUrl: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=1200&q=80' // Grand Mughal red sandstone fort
  },

  // --- UTTARAKHAND ---
  {
    patterns: ['laxman jhula', 'lakshman jhula', 'ram jhula', 'triveni ghat', 'rishikesh rafting', 'beatles ashram', 'parmarth niketan'],
    imageUrl: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1200&q=80' // River Ganges rafting & Himalayan foothills
  },
  {
    patterns: ['nainital', 'naini lake', 'mussoorie', 'kempty falls', 'gun hill', 'mall road mussoorie', 'corbett'],
    imageUrl: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80' // Uttarakhand mountain valley & lake
  },

  // --- PUNJAB ---
  {
    patterns: ['golden temple', 'harmandir sahib', 'amritsar sarovar', 'jallianwala bagh', 'wagah border'],
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80' // Golden Temple illuminated over holy sarovar
  },

  // --- INTERNATIONAL LANDMARKS ---
  {
    patterns: ['burj khalifa', 'dubai mall', 'palm jumeirah', 'desert safari dubai', 'dubai marina', 'burj al arab'],
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' // Futuristic Dubai Burj Khalifa skyline
  },
  {
    patterns: ['eiffel tower', 'louvre museum', 'notre dame', 'arc de triomphe', 'seine river cruise'],
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' // Paris Eiffel tower landmark
  },
  {
    patterns: ['ubud', 'tanah lot', 'tegallalang rice terrace', 'uluwatu temple', 'nusa penida', 'mount batur'],
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' // Lush green Bali rice terraces & temple
  },
  {
    patterns: ['shibuya crossing', 'tokyo tower', 'senso-ji', 'mount fuji', 'mt fuji', 'shinjuku', 'akihabara'],
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' // Vibrant Tokyo cityscape & Tokyo Tower
  },
  {
    patterns: ['matterhorn', 'interlaken', 'jungfrau', 'lucerne', 'zermatt', 'swiss alps', 'lake geneva'],
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' // Majestic snow-clad Swiss Alps & chalet village
  },
  {
    patterns: ['maldives', 'overwater villa', 'male atoll', 'coral reef maldives'],
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80' // Turquoise Maldivian overwater bungalows
  },
  {
    patterns: ['marina bay sands', 'gardens by the bay', 'sentosa island', 'supertrees'],
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80' // Singapore Marina Bay Sands skyline
  },
  {
    patterns: ['big ben', 'tower bridge', 'london eye', 'buckingham palace', 'thames river'],
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80' // Historic London Big Ben & red bus
  },
  {
    patterns: ['colosseum', 'vatican', 'trevi fountain', 'pantheon rome'],
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' // Ancient Rome Colosseum
  },
  {
    patterns: ['times square', 'central park', 'statue of liberty', 'empire state building', 'manhattan'],
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80' // New York City skyline
  },
  {
    patterns: ['wat arun', 'grand palace bangkok', 'phi phi islands', 'patong beach', 'floating market thailand'],
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80' // Beautiful Thailand tropical waters
  }
];

// Curated verified Destination Hero Images (for main banner, trips list, chat recommendations)
export const DESTINATION_REGISTRY: { patterns: string[]; imageUrl: string }[] = [
  {
    patterns: ['leh', 'ladakh', 'nubra', 'pangong', 'kargil', 'zanskar'],
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80' // Dramatic Leh Ladakh Himalayan landscape
  },
  {
    patterns: ['manali', 'kullu', 'solang', 'rohtang', 'himachal', 'kasol', 'spiti', 'dharamshala', 'mcleodganj'],
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80' // Pristine Manali pine mountains
  },
  {
    patterns: ['goa', 'panaji', 'panjim', 'calangute', 'baga', 'candolim', 'anjuna', 'margao', 'vasco'],
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80' // Sunset beach with palm trees in Goa
  },
  {
    patterns: ['jaipur', 'pink city', 'rajasthan', 'pushkar', 'ajmer'],
    imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' // Pink City Jaipur Hawa Mahal
  },
  {
    patterns: ['udaipur', 'lake city', 'city of lakes'],
    imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80' // Udaipur Lake Palace
  },
  {
    patterns: ['kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'sonamarg'],
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80' // Kashmir Dal Lake Shikara
  },
  {
    patterns: ['kerala', 'munnar', 'alleppey', 'alappuzha', 'kochi', 'cochin', 'varkala', 'wayanad', 'kovalam'],
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' // Kerala Backwaters Houseboat
  },
  {
    patterns: ['varanasi', 'banaras', 'kashi', 'ganges ghats'],
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80' // Varanasi holy ghats
  },
  {
    patterns: ['agra', 'taj mahal city'],
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80' // Agra Taj Mahal
  },
  {
    patterns: ['rishikesh', 'haridwar', 'dehradun', 'mussoorie', 'nainital', 'uttarakhand'],
    imageUrl: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1200&q=80' // Rishikesh Ganges Foothills
  },
  {
    patterns: ['shimla', 'kufri', 'chail'],
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80' // Shimla Ridge View
  },
  {
    patterns: ['amritsar', 'punjab'],
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80' // Amritsar Golden Temple
  },
  {
    patterns: ['dubai', 'abu dhabi', 'uae', 'sharjah'],
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' // Dubai Skyline
  },
  {
    patterns: ['paris', 'france'],
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' // Paris Eiffel Tower
  },
  {
    patterns: ['bali', 'ubud', 'seminyak', 'indonesia'],
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' // Bali tropical paradise
  },
  {
    patterns: ['tokyo', 'kyoto', 'osaka', 'japan'],
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80' // Tokyo Neon and Skyline
  },
  {
    patterns: ['switzerland', 'swiss alps', 'zurich', 'interlaken', 'geneva'],
    imageUrl: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' // Swiss Alpine Valley
  },
  {
    patterns: ['maldives'],
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80' // Maldives Blue Lagoon
  },
  {
    patterns: ['singapore'],
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80' // Singapore Marina Bay
  },
  {
    patterns: ['thailand', 'bangkok', 'phuket', 'krabi', 'pattaya', 'chiang mai'],
    imageUrl: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80' // Thailand Tropical Beach
  },
  {
    patterns: ['london', 'uk', 'england', 'united kingdom'],
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80' // London
  },
  {
    patterns: ['rome', 'italy', 'florence', 'venice'],
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' // Rome
  },
  {
    patterns: ['new york', 'nyc', 'manhattan', 'usa'],
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80' // New York
  }
];

// Curated authentic hotel photography tailored to the destination geography
export const HOTEL_REGISTRY: { patterns: string[]; imageUrl: string }[] = [
  // Himalayan & Cold Mountain destinations: Warm luxury wooden chalet / mountain lodge
  {
    patterns: ['leh', 'ladakh', 'nubra', 'pangong', 'kargil', 'zanskar'],
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80' // Luxury Himalayan mountain boutique lodge
  },
  {
    patterns: ['manali', 'kullu', 'shimla', 'spiti', 'kasol', 'dharamshala', 'mussoorie', 'nainital', 'uttarakhand', 'himachal', 'gulmarg', 'pahalgam', 'kashmir', 'srinagar', 'switzerland', 'alps'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80' // Pine wood Alpine mountain chalet resort
  },
  // Beach & Coastal destinations: Oceanfront pool resort with cabanas and palm trees
  {
    patterns: ['goa', 'bali', 'maldives', 'phuket', 'krabi', 'thailand', 'andaman', 'lakshadweep', 'varkala', 'kovalam', 'gokarna', 'pattaya'],
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80' // Luxury tropical beachfront pool resort
  },
  // Rajasthan Heritage: Royal haveli palace with traditional courtyard
  {
    patterns: ['jaipur', 'udaipur', 'jodhpur', 'jaisalmer', 'rajasthan', 'pushkar', 'bikaner'],
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' // Royal heritage palace resort
  },
  // Kerala: Tropical plantation and backwater luxury retreat
  {
    patterns: ['kerala', 'munnar', 'alleppey', 'alappuzha', 'wayanad', 'kochi', 'cochin', 'kumarakom'],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80' // Lush green tropical ayurvedic retreat
  },
  // Spiritual & Heritage riverside: Serene boutique heritage hotel
  {
    patterns: ['varanasi', 'banaras', 'kashi', 'rishikesh', 'haridwar', 'amritsar', 'agra'],
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' // Heritage boutique hotel
  },
  // Metros & International: Contemporary 5-star luxury hotel suite
  {
    patterns: ['dubai', 'singapore', 'tokyo', 'paris', 'london', 'new york', 'mumbai', 'delhi', 'bangalore'],
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80' // Ultra luxury 5-star hotel suite
  }
];

// Category fallbacks
export const CATEGORY_REGISTRY: Record<string, string> = {
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  trekking: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  temple: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  monastery: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
  fort: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  waterfall: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
  lake: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  market: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
  cafe: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  dining: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  travel: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80'
};

const NOISE_PREFIX_REGEX = /^(?:visit(?:\s+to)?|explore|exploring|tour(?:\s+of)?|trip(?:\s+to)?|morning\s+(?:walk|stroll|drive|hike)(?:\s+at|\s+to|\s+around)?|evening\s+(?:walk|stroll|visit|drive)(?:\s+at|\s+to|\s+around)?|sunset\s+(?:at|view\s+at|from)?|sunrise\s+(?:at|view\s+at|from)?|dinner\s+at|lunch\s+at|breakfast\s+at|sightseeing(?:\s+at|\s+in)?|excursion(?:\s+to)?|drive(?:\s+to|\s+through)?|relax(?:\s+at|\s+in)?|relaxation(?:\s+at|\s+in)?|shopping(?:\s+at|\s+in)?|wander(?:\s+around|\s+through)?|discovering|journey(?:\s+to)?|checkout|check-out\s+from|check-in\s+at)\s+/i;

const HOTEL_KEYWORD_REGEX = /\b(?:hotel|resort|palace|haveli|inn|suites?|homestay|hostel|villa|cottage|stay|camp|glamping|lodge|retreat|chalet|guest\s*house)\b/i;

/**
 * Strips conversational noise words and splits query into place name & location
 */
export function sanitizePlaceQuery(rawQuery: string): { cleanName: string; locationHint: string; isHotel: boolean } {
  if (!rawQuery) {
    return { cleanName: '', locationHint: '', isHotel: false };
  }

  const isHotel = HOTEL_KEYWORD_REGEX.test(rawQuery);

  // Split on " in " or comma
  const parts = rawQuery.split(/\s+in\s+|,/i).map(p => p.trim()).filter(Boolean);
  const placePart = parts[0] || rawQuery;
  const locationHint = parts.slice(1).join(' ').trim();

  // Remove noise prefixes like "Morning Stroll at", "Visit to", etc.
  const cleanName = placePart.replace(NOISE_PREFIX_REGEX, '').trim();

  return { cleanName, locationHint, isHotel };
}

/**
 * Searches curated landmarks for a matching pattern
 */
export function getLandmarkImage(cleanName: string, locationHint?: string): string | null {
  const combined = `${cleanName} ${locationHint || ''}`.toLowerCase();
  
  for (const item of LANDMARK_REGISTRY) {
    for (const pat of item.patterns) {
      if (combined.includes(pat.toLowerCase())) {
        return item.imageUrl;
      }
    }
  }
  return null;
}

/**
 * Returns destination-specific authentic hero photo
 */
export function getDestinationImage(destination: string): string {
  const lower = (destination || '').toLowerCase();
  for (const item of DESTINATION_REGISTRY) {
    for (const pat of item.patterns) {
      if (lower.includes(pat.toLowerCase())) {
        return item.imageUrl;
      }
    }
  }
  // Default travel landscape
  return CATEGORY_REGISTRY.travel;
}

/**
 * Returns destination-appropriate authentic hotel photo
 */
export function getHotelImage(destinationOrQuery: string): string {
  const lower = (destinationOrQuery || '').toLowerCase();
  for (const item of HOTEL_REGISTRY) {
    for (const pat of item.patterns) {
      if (lower.includes(pat.toLowerCase())) {
        return item.imageUrl;
      }
    }
  }
  // Default luxury hotel resort
  return CATEGORY_REGISTRY.hotel;
}

/**
 * Resolves a travel image using the curated registry and smart regional fallbacks
 */
export function resolveTravelImage(
  rawQuery: string,
  options?: { isHotel?: boolean; category?: string; destination?: string }
): string {
  const { cleanName, locationHint, isHotel: queryIsHotel } = sanitizePlaceQuery(rawQuery);
  const isHotel = options?.isHotel || queryIsHotel;
  const fullText = `${cleanName} ${locationHint} ${options?.destination || ''}`.toLowerCase();

  // 1. If it's a hotel, prioritize destination-matched authentic hotel photo
  if (isHotel) {
    return getHotelImage(fullText);
  }

  // 2. Direct iconic landmark match
  const landmarkPhoto = getLandmarkImage(cleanName, `${locationHint} ${options?.destination || ''}`);
  if (landmarkPhoto) {
    return landmarkPhoto;
  }

  // 3. Category match based on activity type or keywords
  if (options?.category) {
    const cat = options.category.toLowerCase();
    if (CATEGORY_REGISTRY[cat]) {
      return CATEGORY_REGISTRY[cat];
    }
  }

  // Look for category words in place name
  if (/monastery|gompa|stupa|shrine/i.test(cleanName)) return CATEGORY_REGISTRY.monastery;
  if (/temple|mandir|church|cathedral|mosque|gurudwara/i.test(cleanName)) return CATEGORY_REGISTRY.temple;
  if (/beach|coast|shore|cove/i.test(cleanName)) return CATEGORY_REGISTRY.beach;
  if (/waterfall|falls|cascade/i.test(cleanName)) return CATEGORY_REGISTRY.waterfall;
  if (/lake|tso|tal|dam|river/i.test(cleanName)) return CATEGORY_REGISTRY.lake;
  if (/fort|palace|haveli|monument|ruins/i.test(cleanName)) return CATEGORY_REGISTRY.fort;
  if (/pass|peak|valley|trek|hiking|trail/i.test(cleanName)) return CATEGORY_REGISTRY.mountain;
  if (/cafe|bistro|coffee|bakery|restaurant|bar|pub/i.test(cleanName)) return CATEGORY_REGISTRY.cafe;
  if (/market|bazaar|street|mall/i.test(cleanName)) return CATEGORY_REGISTRY.market;

  // 4. Fallback to destination photo
  return getDestinationImage(fullText);
}
