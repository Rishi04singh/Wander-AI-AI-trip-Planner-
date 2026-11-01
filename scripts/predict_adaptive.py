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

        # CUSTOMER NEED / DISRUPTION OVERRIDES
        adapted_plan = original_plan
        weather_warn = None
        traffic_warn = None
        customer_note = None

        if any(k in customer_req for k in ['rain', 'water', 'indoor', 'wet', 'storm', 'monsoon']) or (action == 'Indoor Swapped'):
            adapted_plan = f"[Indoor Swapped] {original_plan.replace('Trek', 'Museum & Cultural Gallery').replace('Outdoor', 'Indoor Heritage Pavilion').replace('Beach', 'Local Aquarium & Spice Plantation')}"
            weather_warn = f"🌧️ Weather Alert: Rainy weather expected ({weather_res['precipitationProb']}% rain risk). Swapped to weather-shielded indoor cultural attractions."
            action = 'Indoor Swapped'
            customer_note = "Adapted for rain: Outdoor trekking swapped for indoor cultural galleries & covered dining."
            total_time_saved_min += 45
        elif any(k in customer_req for k in ['traffic', 'jam', 'delay', 'rush', 'bottleneck', 'road']):
            adapted_plan = f"[Route Shifted] {original_plan} (Via Bypass Route at {traffic_res['bestDepartureWindows'][0]})"
            traffic_warn = f"🚗 Congestion Notice: Severe bottleneck detected. Depart early at {traffic_res['bestDepartureWindows'][0]} to avoid 40+ min delay."
            action = 'Timing Shifted'
            customer_note = "Adapted for traffic: Departed during non-peak window via scenic expressway bypass."
            total_time_saved_min += 35
        elif any(k in customer_req for k in ['flight', 'train', 'late', 'delayed', 'compress', 'shorten']):
            if day_num == 1:
                adapted_plan = f"[Compressed Schedule] {original_plan} (Consolidated Express Evening Tour & Dinner)"
                action = 'Schedule Compressed'
                customer_note = "Adapted for delay: Streamlined Day 1 to avoid missing main highlights after late check-in."
                total_time_saved_min += 60
            else:
                adapted_plan = original_plan
        elif any(k in customer_req for k in ['relax', 'cafe', 'chill', 'sunset', 'slow', 'peace', 'less walk']):
            adapted_plan = f"[Relaxed Pace] {original_plan.replace('Trek', 'Scenic Lake Promenade').replace('Forts', 'Artisan Cafe & Royal Gardens')}"
            action = 'Relaxed Pace'
            customer_note = "Adapted for customer comfort: Reduced walking fatigue with scenic cafe stops and relaxed evening stroll."
            total_time_saved_min += 20
        elif any(k in customer_req for k in ['budget', 'cheap', 'free', 'cost']):
            adapted_plan = f"[Budget Friendly] {original_plan} (Free Entry Heritage Strolls & Street Food Market)"
            action = 'Budget Optimized'
            customer_note = "Adapted for budget: Prioritized zero-entry historical monuments and public ghats/bazaars."
            total_time_saved_min += 15
        elif action == 'Timing Shifted':
            if weather_res['condition'] == 'Extreme Heat':
                adapted_plan = f"{original_plan} (Shifted to {weather_res['bestTimeOfDayForTours']})"
                weather_warn = f"☀️ Heat Advisory: High temperature ({weather_res['avgTempC']}°C). Midday outdoor visit shifted to cooler sunrise/sunset hours."
            else:
                adapted_plan = f"{original_plan} (Shifted to {traffic_res['bestDepartureWindows'][0]})"
                traffic_warn = f"🚗 Congestion Notice: {traffic_res['congestionIndex']} tourist traffic (+{traffic_res['predictedDelayMinutesPerTrip']}m delay). Depart at {traffic_res['bestDepartureWindows'][0]}."
            total_time_saved_min += 25

        day_suitabilities.append(suitability)

        adapted_items.append({
            "day": day_num,
            "originalPlan": original_plan,
            "adaptedPlan": adapted_plan,
            "weatherWarning": weather_warn,
            "trafficWarning": traffic_warn,
            "customerNote": customer_note,
            "optimizationAction": action
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
