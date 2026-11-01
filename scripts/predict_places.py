import sys
import json
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def predict(input_data):
    models_dir = 'models'
    model_file = os.path.join(models_dir, 'places_model.pkl')
    preprocessor_file = os.path.join(models_dir, 'places_preprocessor.pkl')
    df_file = os.path.join(models_dir, 'places_dataframe.pkl')

    if not (os.path.exists(model_file) and os.path.exists(preprocessor_file) and os.path.exists(df_file)):
        raise FileNotFoundError("Trained model artifacts missing in models/ directory. Run python scripts/train_places_model.py first.")

    knn_model = joblib.load(model_file)
    preprocessor = joblib.load(preprocessor_file)
    df = joblib.load(df_file)

    daily_budget = float(input_data.get('daily_budget', input_data.get('budgetINR', 3500)))
    vibe = str(input_data.get('vibe', input_data.get('categoryPreference', 'All')))
    companions = str(input_data.get('companions', input_data.get('travelCompanion', 'Friends')))
    month = int(input_data.get('month', input_data.get('travelMonth', 12)))

    # Fallback vibe normalization
    vibe_mapped = vibe
    if vibe == 'All' or not vibe:
        vibe_mapped = 'Cultural'

    # Build input feature vector
    q_dict = {
        'est_daily_budget': daily_budget,
        'suitability_friends': 1.0 if companions == 'Friends' else 0.5,
        'suitability_couple': 1.0 if companions == 'Couple' else 0.5,
        'suitability_family': 1.0 if companions == 'Family' else 0.5,
        'suitability_solo': 1.0 if companions == 'Solo' else 0.5,
        'Google review rating': 4.5,
        'vibe': vibe_mapped
    }
    
    q_df = pd.DataFrame([q_dict])
    q_vec = preprocessor.transform(q_df)

    # Transform all dataset rows using preprocessor
    X_processed = preprocessor.transform(df)

    # Compute Cosine Similarity between user query and all 325 real destinations
    sims = cosine_similarity(q_vec, X_processed)[0]

    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    target_month_name = month_names[month - 1] if 1 <= month <= 12 else "Selected Month"

    results = []
    for idx, row in df.iterrows():
        base_sim = float(sims[idx])
        
        # Seasonality Affinity
        best_months = row['best_months_list'] if isinstance(row['best_months_list'], list) else [10, 11, 12, 1, 2, 3]
        is_best_month = month in best_months
        month_score = 35 if is_best_month else 15

        # Budget Proximity
        dest_budget = float(row['est_daily_budget'])
        cost_diff = abs(dest_budget - daily_budget)
        cost_ratio = max(0.0, 1.0 - (cost_diff / 5000.0))
        cost_score = round(cost_ratio * 35)

        # Vibe Match
        vibe_match = (vibe != 'All' and row['vibe'].lower() == vibe.lower())
        vibe_score = 30 if vibe_match else (20 if vibe == 'All' else 10)

        # Total Match Score % (65 - 98)
        raw_pct = (base_sim * 40) + (month_score * 0.8) + (cost_score * 0.8) + (vibe_score * 0.4)
        match_score_pct = int(np.clip(round(raw_pct), 65, 98))

        # Dynamic Data-Driven Recommendation Reason
        reasons = []
        if vibe_match:
            reasons.append(f"Ideal match for {row['vibe']} enthusiasts")
        if is_best_month:
            reasons.append(f"🌟 Peak tourist season in {target_month_name}")
        else:
            reasons.append(f"Off-peak visit in {target_month_name}")
        
        reasons.append(f"budget approx ₹{int(dest_budget)}/day for {companions}")

        reason_str = f"Strong match for {row['Name']} ({row['City']}, {row['State']}). " + ", ".join(reasons) + "."

        dest_obj = {
            "id": f"dest_{idx}",
            "name": row['Name'],
            "city": row['City'],
            "state": row['State'],
            "zone": row['Zone'],
            "category": row['vibe'],
            "significance": row['Significance'],
            "type": row['Type'],
            "avgDailyCostINR": int(dest_budget),
            "entranceFeeINR": int(row['Entrance Fee in INR']) if pd.notnull(row['Entrance Fee in INR']) else 0,
            "googleRating": float(row['Google review rating']) if pd.notnull(row['Google review rating']) else 4.2,
            "description": f"Located in {row['City']}, {row['State']}. Famous for {row['Type']} ({row['Significance']} significance).",
            "highlights": [str(row['Type']), str(row['Significance']), f"Zone: {row['Zone']}", f"DSLR: {row['DSLR Allowed']}"]
        }

        results.append({
            "destination": dest_obj,
            "matchScorePct": match_score_pct,
            "monthAffinityScore": month_score,
            "costAffinityScore": cost_score,
            "recommendationReason": reason_str
        })

    # Sort by highest match score percentage
    results = sorted(results, key=lambda x: x['matchScorePct'], reverse=True)
    return results[:10]

if __name__ == '__main__':
    try:
        if len(sys.argv) > 1:
            input_raw = sys.argv[1]
        else:
            input_raw = sys.stdin.read()
        
        input_data = json.loads(input_raw)
        recs = predict(input_data)
        print(json.dumps({"success": True, "model": "Kaggle Real ML KNN & Cosine Similarity Engine (325 Indian Destinations)", "data": recs}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
