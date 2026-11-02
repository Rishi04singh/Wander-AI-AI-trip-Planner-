import sys
import json
import os
import joblib
import pandas as pd
import numpy as np

# Import sibling prediction engines for unified multi-factor evaluation
from predict_weather import predict as predict_weather_engine
from predict_traffic import predict as predict_traffic_engine

def predict(input_data):
    models_dir = 'models'
    reg_file = os.path.join(models_dir, 'adaptive_reg_model.pkl')
    clf_file = os.path.join(models_dir, 'adaptive_clf_model.pkl')
    prep_file = os.path.join(models_dir, 'adaptive_preprocessor.pkl')

    if not (os.path.exists(reg_file) and os.path.exists(clf_file) and os.path.exists(prep_file)):
        raise FileNotFoundError("Adaptive model artifacts missing. Run python scripts/train_adaptive_model.py first.")

    reg_model = joblib.load(reg_file)
    clf_model = joblib.load(clf_file)
    preprocessor = joblib.load(prep_file)

    destination = str(input_data.get('destination', 'Manali & Solang Valley')).strip()
    month = int(input_data.get('travelMonth', input_data.get('month', 12)))
    raw_itinerary = input_data.get('itinerary', [])

    if not raw_itinerary:
        raw_itinerary = [
            {'day': 1, 'day_plan': 'Outdoor Hillside Sightseeing & Trekking', 'best_time_to_visit_day': '9:00 AM'},
            {'day': 2, 'day_plan': 'Local Heritage Forts & Scenic Viewpoint Tour', 'best_time_to_visit_day': '1:00 PM'},
            {'day': 3, 'day_plan': 'River Adventures & Evening Sunset Point', 'best_time_to_visit_day': '5:00 PM'}
        ]

    customer_req = str(input_data.get('customerRequest', input_data.get('disruptionType', input_data.get('customer_request', '')))).strip().lower()

    # Extract target days if user mentioned specific days (e.g. "Day 2", "Day 1", "second day", etc.)
    import re
    target_days = []
    for m in re.finditer(r'\bday\s*[-#]?\s*(\d+)\b', customer_req):
        target_days.append(int(m.group(1)))
    ordinal_map = {
        r'\b(?:1st|first)\s+day\b': 1,
        r'\bday\s+(?:one|1)\b': 1,
        r'\b(?:2nd|second)\s+day\b': 2,
        r'\bday\s+(?:two|2)\b': 2,
        r'\b(?:3rd|third)\s+day\b': 3,
        r'\bday\s+(?:three|3)\b': 3,
        r'\b(?:4th|fourth)\s+day\b': 4,
        r'\bday\s+(?:four|4)\b': 4,
        r'\b(?:5th|fifth)\s+day\b': 5,
        r'\bday\s+(?:five|5)\b': 5,
        r'\b(?:6th|sixth)\s+day\b': 6,
        r'\bday\s+(?:six|6)\b': 6,
        r'\b(?:7th|seventh)\s+day\b': 7,
        r'\bday\s+(?:seven|7)\b': 7,
    }
    for pattern, d in ordinal_map.items():
        if re.search(pattern, customer_req):
            target_days.append(d)
    target_days = sorted(list(set(target_days)))

    # Run weather and traffic engines
    weather_res = predict_weather_engine({'destination': destination, 'travelMonth': month})['data']
    traffic_res = predict_traffic_engine({'destination': destination, 'travelMonth': month})['data']

    adapted_items = []
    day_suitabilities = []
    total_time_saved_min = 0

    for idx, day_obj in enumerate(raw_itinerary):
        day_num = day_obj.get('day', idx + 1)
        original_plan = str(day_obj.get('day_plan', f'Day {day_num} Exploration'))
        time_slot = str(day_obj.get('best_time_to_visit_day', '9:00 AM'))

        # Map activity archetype
        lower_plan = original_plan.lower()
        if any(w in lower_plan for w in ['trek', 'hike', 'climb', 'camp', 'safari', 'waterfall']):
            act_type = 'Outdoor Trek'
        elif any(b in lower_plan for b in ['beach', 'water sport', 'surf', 'dive', 'snorkel']):
            act_type = 'Beach Sports'
        elif any(m in lower_plan for m in ['museum', 'palace', 'gallery', 'indoor', 'art']):
            act_type = 'Museum & Palace'
        elif any(c in lower_plan for c in ['cruise', 'boat', 'shikara', 'lake', 'ferry']):
            act_type = 'Boat Cruise'
        elif any(s in lower_plan for s in ['temple', 'ghat', 'aarti', 'spiritual', 'ashram']):
            act_type = 'Spiritual Aarti'
        elif any(k in lower_plan for k in ['market', 'bazaar', 'shopping', 'food', 'street']):
            act_type = 'Market Shopping'
        else:
            act_type = 'Heritage Walk'

        # Map slot
        if any(m in time_slot for m in ['8:', '9:', '10:', 'morning']):
            mapped_slot = 'Morning (9:00 AM)'
        elif any(a in time_slot for a in ['12:', '1:', '2:', '3:', 'afternoon', 'mid-day']):
            mapped_slot = 'Mid-Day (1:00 PM)'
        elif any(e in time_slot for e in ['4:', '5:', '6:', '7:', 'evening', 'sunset']):
            mapped_slot = 'Evening (5:00 PM)'
        else:
            mapped_slot = 'Night (8:00 PM)'

        sample_df = pd.DataFrame([{
            'activity_type': act_type,
            'time_slot': mapped_slot,
            'weather_condition': weather_res['condition'],
            'precipitation_prob': float(weather_res['precipitationProb']),
            'avg_temp_c': float(weather_res['avgTempC']),
            'congestion_level': traffic_res['congestionIndex'],
            'delay_minutes': float(traffic_res['predictedDelayMinutesPerTrip'])
        }])

        sample_trans = preprocessor.transform(sample_df)
        action = str(clf_model.predict(sample_trans)[0])

        if isinstance(reg_model, dict):
            suitability = float(reg_model['suitability_score'].predict(sample_trans)[0])
        else:
            suitability = float(reg_model.predict(sample_trans)[0][0])

        # Check if user specified particular day(s) to modify
        is_target_day = (day_num in target_days) if target_days else True

        # CUSTOMER NEED / DISRUPTION OVERRIDES
        clean_plan = re.sub(r'^\[[^\]]+\]\s*', '', original_plan)
        adapted_plan = original_plan
        weather_warn = None
        traffic_warn = None
        customer_note = None

        if is_target_day:
            if any(k in customer_req for k in ['rain', 'water', 'indoor', 'wet', 'storm', 'monsoon']) or (action == 'Indoor Swapped'):
                adapted_plan = f"[Indoor Swapped] {clean_plan.replace('Trek', 'Museum & Cultural Gallery').replace('Outdoor', 'Indoor Heritage Pavilion').replace('Beach', 'Local Aquarium & Spice Plantation')}"
                weather_warn = f"🌧️ Weather Alert for Day {day_num}: Rain expected ({weather_res['precipitationProb']}% risk). Outdoor activities swapped to weather-shielded indoor venues."
                action = 'Indoor Swapped'
                customer_note = f"Adapted Day {day_num} for rain: Outdoor activities swapped for indoor cultural galleries & covered dining."
                total_time_saved_min += 45
            elif any(k in customer_req for k in ['traffic', 'jam', 'delay', 'rush', 'bottleneck', 'road']):
                adapted_plan = f"[Route Shifted] {clean_plan} (Via Bypass Route at {traffic_res['bestDepartureWindows'][0]})"
                traffic_warn = f"🚗 Congestion Notice for Day {day_num}: Severe bottleneck detected. Depart early at {traffic_res['bestDepartureWindows'][0]} to avoid delay."
                action = 'Timing Shifted'
                customer_note = f"Adapted Day {day_num} for traffic: Departed during non-peak window via scenic expressway bypass."
                total_time_saved_min += 35
            elif any(k in customer_req for k in ['flight', 'train', 'late', 'delayed', 'compress', 'shorten']):
                adapted_plan = f"[Compressed Schedule] {clean_plan} (Consolidated Express Highlights & Dinner)"
                action = 'Schedule Compressed'
                customer_note = f"Adapted Day {day_num} for delay: Streamlined schedule to avoid missing main highlights."
                total_time_saved_min += 60
            elif any(k in customer_req for k in ['relax', 'cafe', 'chill', 'sunset', 'slow', 'peace', 'less walk']):
                adapted_plan = f"[Relaxed Pace] {clean_plan.replace('Trek', 'Scenic Lake Promenade').replace('Forts', 'Artisan Cafe & Royal Gardens')}"
                action = 'Relaxed Pace'
                customer_note = f"Adapted Day {day_num} for comfort: Reduced walking fatigue with scenic cafe stops and relaxed evening stroll."
                total_time_saved_min += 20
            elif any(k in customer_req for k in ['budget', 'cheap', 'free', 'cost']):
                adapted_plan = f"[Budget Friendly] {clean_plan} (Free Entry Heritage Strolls & Street Food Market)"
                action = 'Budget Optimized'
                customer_note = f"Adapted Day {day_num} for budget: Prioritized zero-entry historical monuments and public ghats/bazaars."
                total_time_saved_min += 15
            elif action == 'Timing Shifted':
                if weather_res['condition'] == 'Extreme Heat':
                    adapted_plan = f"{clean_plan} (Shifted to {weather_res['bestTimeOfDayForTours']})"
                    weather_warn = f"☀️ Heat Advisory: High temperature ({weather_res['avgTempC']}°C). Midday outdoor visit shifted to cooler sunrise/sunset hours."
                else:
                    adapted_plan = f"{clean_plan} (Shifted to {traffic_res['bestDepartureWindows'][0]})"
                    traffic_warn = f"🚗 Congestion Notice: {traffic_res['congestionIndex']} tourist traffic. Depart at {traffic_res['bestDepartureWindows'][0]}."
                total_time_saved_min += 25
        else:
            # Days not targeted by the customer remain untouched and optimal
            action = 'Optimal'
            adapted_plan = original_plan
            customer_note = None
            weather_warn = None
            traffic_warn = None

        # Also adapt activities if present on target day
        adapted_activities = []
        if day_obj.get('activities') and isinstance(day_obj.get('activities'), list):
            for act in day_obj.get('activities'):
                act_copy = dict(act)
                if is_target_day:
                    if action == 'Indoor Swapped':
                        det = act_copy.get('place_details', '')
                        if not det.startswith('[Sheltered Venue]'):
                            act_copy['place_details'] = f"[Sheltered / Indoor Venue] {det}"
                    elif action == 'Timing Shifted':
                        det = act_copy.get('place_details', '')
                        if not det.startswith('[Timing Adjusted]'):
                            act_copy['place_details'] = f"[Timing Adjusted] {det}"
                    elif action == 'Relaxed Pace':
                        det = act_copy.get('place_details', '')
                        if not det.startswith('[Relaxed Leisure Stop]'):
                            act_copy['place_details'] = f"[Relaxed Leisure Stop] {det}"
                adapted_activities.append(act_copy)

        day_suitabilities.append(suitability)

        adapted_items.append({
            "day": day_num,
            "originalPlan": original_plan,
            "adaptedPlan": adapted_plan,
            "weatherWarning": weather_warn,
            "trafficWarning": traffic_warn,
            "customerNote": customer_note,
            "optimizationAction": action,
            "activities": adapted_activities
        })

    overall_score = int(np.clip(round(np.mean(day_suitabilities)), 50, 99))

    month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    target_month_name = month_names[month - 1] if 1 <= month <= 12 else "Selected Month"

    suggestions = [
        f"🗓️ {target_month_name} Strategy: {weather_res['travelAdvisory']}",
        f"🚦 Transit Protocol: Use {traffic_res['recommendedTravelMode']} for seamless city travel.",
        f"🎒 Gear Recommendation: Pack {', '.join(weather_res['recommendedPackingList'][:3])}."
    ]
    if customer_req:
        suggestions.insert(0, f"🎯 Customer Request Applied: Rescheduled according to \"{input_data.get('customerRequest', input_data.get('disruptionType', ''))}\"")

    result = {
        "success": True,
        "model": "Multi-Factor ML Adaptive Optimizer (2,500 Constraint Evaluation Scenarios)",
        "data": {
            "destination": destination,
            "targetMonth": month,
            "customerRequest": input_data.get('customerRequest', input_data.get('disruptionType', '')),
            "weatherSummary": f"{weather_res['condition']} ({weather_res['avgTempC']}°C, {weather_res['precipitationProb']}% rain risk)",
            "trafficSummary": f"{traffic_res['congestionIndex']} Congestion (+{int((traffic_res['delayMultiplier']-1)*100)}% transit delay)",
            "overallSuitabilityScore": overall_score,
            "timeSavedMin": max(total_time_saved_min, 30),
            "adaptedItinerary": adapted_items,
            "seasonalSuggestions": suggestions
        }
    }
    return result

if __name__ == '__main__':
    try:
        input_payload = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {"destination": "Manali & Solang Valley", "travelMonth": 12}
        output = predict(input_payload)
        print(json.dumps(output))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)
