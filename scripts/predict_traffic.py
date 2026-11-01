import sys
import json
import os
import joblib
import pandas as pd
import numpy as np

def predict(input_data):
    models_dir = 'models'
    reg_file = os.path.join(models_dir, 'traffic_reg_model.pkl')
    clf_file = os.path.join(models_dir, 'traffic_clf_model.pkl')
    prep_file = os.path.join(models_dir, 'traffic_preprocessor.pkl')
    df_file = os.path.join(models_dir, 'traffic_dataframe.pkl')

    if not (os.path.exists(reg_file) and os.path.exists(clf_file) and os.path.exists(prep_file) and os.path.exists(df_file)):
        raise FileNotFoundError("Traffic model artifacts missing. Run python scripts/train_traffic_model.py first.")

    reg_model = joblib.load(reg_file)
    clf_model = joblib.load(clf_file)
    preprocessor = joblib.load(prep_file)
    df = joblib.load(df_file)

    destination = str(input_data.get('destination', 'Manali & Solang Valley')).strip()
    month = int(input_data.get('travelMonth', input_data.get('month', 12)))

    dest_matches = df[df['destination'].str.lower().str.contains(destination.lower().split('&')[0].strip(), regex=False)]
    if len(dest_matches) > 0:
        matched_row = dest_matches.iloc[0]
        zone = matched_row['zone']
        p_type = matched_row['type']
        road_type = matched_row['road_type']
        infra_rating = int(matched_row['transit_infrastructure_rating'])
        actual_name = matched_row['destination']
        state = matched_row['state']
    else:
        actual_name = destination
        state = "India"
        lower_dest = destination.lower()
        if any(h in lower_dest for h in ['manali', 'leh', 'shimla', 'ladakh', 'kashmir', 'sikkim', 'darjeeling', 'munnar']):
            zone = 'Northern'
            p_type = 'Hill Station'
            road_type = 'Mountain Ghaut'
            infra_rating = 5
        elif any(c in lower_dest for c in ['goa', 'kerala', 'alleppey', 'mumbai']):
            zone = 'Western'
            p_type = 'Beach'
            road_type = 'Coastal Highway'
            infra_rating = 7
        elif any(d in lower_dest for d in ['jaipur', 'udaipur', 'jodhpur', 'varanasi']):
            zone = 'Western'
            p_type = 'Heritage'
            road_type = 'Heritage Bazaars'
            infra_rating = 6
        else:
            zone = 'Central'
            p_type = 'Attraction'
            road_type = 'National Highway Corridor'
            infra_rating = 7

    # Check seasonality peak
    is_peak = 1 if month in [5, 6, 10, 11, 12, 1] else 0

    sample_df = pd.DataFrame([{
        'month': month,
        'zone': zone,
        'type': p_type,
        'road_type': road_type,
        'is_peak_season': is_peak,
        'transit_infrastructure_rating': infra_rating
    }])

    sample_trans = preprocessor.transform(sample_df)

    if isinstance(reg_model, dict):
        reg_preds = {}
        for col_name, model in reg_model.items():
            reg_preds[col_name] = float(model.predict(sample_trans)[0])
    else:
        raw_pred = reg_model.predict(sample_trans)[0]
        cols = ['delay_multiplier', 'predicted_delay_minutes', 'peak_hour_risk_score']
        reg_preds = {c: float(raw_pred[i]) for i, c in enumerate(cols)}

    congestion = str(clf_model.predict(sample_trans)[0])

    delay_mult = round(float(np.clip(reg_preds['delay_multiplier'], 1.10, 2.20)), 2)
    delay_mins = int(np.clip(round(reg_preds['predicted_delay_minutes']), 8, 95))
    risk_score = int(np.clip(round(reg_preds['peak_hour_risk_score']), 15, 98))

    # Travel mode & departure window recommendations
    if 'mountain' in road_type.lower():
        travel_mode = "Pre-booked 4x4 or Registered Local Taxi"
    elif 'coastal' in road_type.lower():
        travel_mode = "Scooter / Two-Wheeler Rental or Local Ferry"
    elif 'heritage' in road_type.lower():
        travel_mode = "Battery E-Rickshaw & Walking Heritage Tour"
    elif 'metro' in road_type.lower():
        travel_mode = "Metro Rail & App Cabs"
    else:
        travel_mode = "Private AC Cab / Express Tourist Coach"

    if congestion in ['Heavy', 'Severe']:
        dep_windows = ["6:30 AM - 8:00 AM (Early Departure)", "1:30 PM - 3:30 PM (Mid-Day Lull)"]
        rush_hours = ["9:30 AM - 1:00 PM (Morning Influx)", "5:30 PM - 8:30 PM (Evening Sunset Rush)"]
        tip = f"🚨 High tourist traffic detected (+{int((delay_mult - 1) * 100)}% transit delay). Depart before 8:00 AM and rely on {travel_mode}."
    elif congestion == 'Moderate':
        dep_windows = ["8:00 AM - 9:30 AM", "2:00 PM - 4:00 PM"]
        rush_hours = ["10:30 AM - 12:30 PM", "6:00 PM - 8:00 PM"]
        tip = f"⚡ Moderate traffic expected. Maintain buffer time of {delay_mins} mins for inter-city travel."
    else:
        dep_windows = ["Flexible (Full Day Free Flow)"]
        rush_hours = ["11:30 AM - 1:00 PM"]
        tip = f"🟢 Smooth free-flowing traffic expected (+{int((delay_mult - 1) * 100)}% nominal delay). Standard transit modes recommended."

    result = {
        "success": True,
        "model": "Kaggle Indian Traffic Gradient Boosting Model (3,900 Route Observations)",
        "data": {
            "destination": actual_name,
            "state": state,
            "roadType": road_type,
            "month": month,
            "delayMultiplier": delay_mult,
            "congestionIndex": congestion,
            "predictedDelayMinutesPerTrip": delay_mins,
            "peakHourRiskScore": risk_score,
            "rushHours": rush_hours,
            "bestDepartureWindows": dep_windows,
            "recommendedTravelMode": travel_mode,
            "travelOptimizationTip": tip
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
