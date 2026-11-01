import os
import urllib.request
import io
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity

def main():
    print("=" * 60)
    print("PHASE 2 — DOWNLOADING REAL KAGGLE DATASET")
    print("=" * 60)
    
    raw_dir = os.path.join('data', 'raw')
    os.makedirs(raw_dir, exist_ok=True)
    raw_path = os.path.join(raw_dir, 'Top_Indian_Places_To_Visit.csv')
    
    dataset_url = 'https://raw.githubusercontent.com/Kaustabh-ba/Top-Indian-Places-to-Visit-Indian-Tourism-/main/Top%20Indian%20Places%20to%20Visit.csv'
    
    req = urllib.request.Request(dataset_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        content = resp.read()
    
    with open(raw_path, 'wb') as f:
        f.write(content)
        
    print(f"Downloaded raw dataset to {raw_path}")
    
    df = pd.read_csv(raw_path)
    print(f"Dataset Loaded. Shape: {df.shape[0]} rows, {df.shape[1]} columns.")
    
    print("\n" + "=" * 60)
    print("PHASE 3 & 4 — DATASET AUDIT & PREPROCESSING PIPELINE")
    print("=" * 60)
    
    # Standardize column names
    df.columns = [c.strip() for c in df.columns]
    
    if 'Unnamed: 0' in df.columns:
        df = df.drop(columns=['Unnamed: 0'])
        
    # Clean text values
    for col in ['Zone', 'State', 'City', 'Name', 'Type', 'Significance', 'DSLR Allowed']:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()

    # Map Vibe from Type & Significance
    def map_vibe(row):
        sig = str(row.get('Significance', '')).lower()
        t = str(row.get('Type', '')).lower()
        name = str(row.get('Name', '')).lower()
        
        if any(x in t or x in sig or x in name for x in ['beach', 'coastal', 'island', 'sea']):
            return 'Beach'
        elif any(x in t or x in sig or x in name for x in ['temple', 'religious', 'ghat', 'shrine', 'monastery', 'kashi', 'dham', 'church', 'mosque']):
            return 'Spiritual'
        elif any(x in t or x in sig or x in name for x in ['trekking', 'adventure', 'wildlife', 'national park', 'cave', 'waterfall', 'safari', 'hike']):
            return 'Adventure'
        elif any(x in t or x in sig or x in name for x in ['fort', 'palace', 'monument', 'museum', 'historical', 'cultural', 'heritage', 'tomb']):
            return 'Cultural'
        elif any(x in t or x in sig or x in name for x in ['lake', 'river', 'garden', 'nature', 'scenic', 'valley', 'hill station', 'park']):
            return 'Relaxation'
        elif any(x in t or x in sig or x in name for x in ['resort', 'luxury', 'royal']):
            return 'Luxury'
        else:
            return 'Nature'

    df['vibe'] = df.apply(map_vibe, axis=1)

    # Estimate Daily Expenditure in INR based on entrance fee, zone, and attraction vibe
    def calc_est_daily_budget(row):
        fee = float(row['Entrance Fee in INR']) if pd.notnull(row['Entrance Fee in INR']) else 0
        zone = str(row.get('Zone', '')).lower()
        vibe = row['vibe']
        
        base_cost = 2500
        if zone in ['northern', 'southern', 'western']:
            base_cost += 500
        if vibe in ['Luxury', 'Cultural']:
            base_cost += 1500
        elif vibe in ['Beach', 'Adventure']:
            base_cost += 1000
        elif vibe in ['Spiritual']:
            base_cost += 200
            
        daily_est = base_cost + (fee * 1.5)
        return float(np.clip(daily_est, 1500, 10000))

    df['est_daily_budget'] = df.apply(calc_est_daily_budget, axis=1)

    # Calculate companion suitability indices (0.0 to 1.0)
    def calc_companion_suitability(row):
        vibe = row['vibe']
        dslr = str(row.get('DSLR Allowed', '')).lower() == 'yes'
        rating = float(row['Google review rating']) if pd.notnull(row['Google review rating']) else 4.0
        
        friends_score = 0.6
        if vibe in ['Beach', 'Adventure', 'Relaxation']: friends_score += 0.3
        if dslr: friends_score += 0.1
        
        couple_score = 0.5
        if vibe in ['Beach', 'Relaxation', 'Luxury']: couple_score += 0.4
        if rating >= 4.3: couple_score += 0.1
        
        family_score = 0.6
        if vibe in ['Cultural', 'Spiritual', 'Nature']: family_score += 0.3
        if rating >= 4.2: family_score += 0.1
        
        solo_score = 0.5
        if vibe in ['Adventure', 'Spiritual', 'Nature']: solo_score += 0.4
        if rating >= 4.0: solo_score += 0.1
        
        return pd.Series({
            'suitability_friends': min(1.0, friends_score),
            'suitability_couple': min(1.0, couple_score),
            'suitability_family': min(1.0, family_score),
            'suitability_solo': min(1.0, solo_score)
        })

    companion_df = df.apply(calc_companion_suitability, axis=1)
    df = pd.concat([df, companion_df], axis=1)

    # Map optimal visiting months (1-12) based on geography and climate
    def calc_best_months(row):
        state = str(row.get('State', '')).lower()
        vibe = row['vibe']
        t = str(row.get('Type', '')).lower()
        
        if any(s in state for s in ['himachal', 'uttarakhand', 'jammu', 'kashmir', 'ladakh', 'sikkim']) or 'hill station' in t:
            return [4, 5, 6, 9, 10, 11, 12, 1, 2]
        elif vibe == 'Beach' or any(s in state for s in ['goa', 'kerala', 'tamil nadu', 'pondicherry']):
            return [10, 11, 12, 1, 2, 3]
        elif vibe == 'Nature' and any(s in state for s in ['maharashtra', 'karnataka', 'kerala']):
            return [7, 8, 9, 10, 11]
        else:
            return [10, 11, 12, 1, 2, 3]

    df['best_months_list'] = df.apply(calc_best_months, axis=1)

    # Save Processed Dataset
    proc_dir = os.path.join('data', 'processed')
    os.makedirs(proc_dir, exist_ok=True)
    proc_path = os.path.join(proc_dir, 'processed_places.csv')
    df.to_csv(proc_path, index=False)
    print(f"Processed dataset saved to {proc_path}")

    # Build Sklearn Preprocessing Pipeline
    feature_cols = ['est_daily_budget', 'suitability_friends', 'suitability_couple', 'suitability_family', 'suitability_solo', 'Google review rating']
    cat_cols = ['vibe']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', MinMaxScaler(), feature_cols),
            ('cat', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), cat_cols)
        ]
    )

    X_processed = preprocessor.fit_transform(df)

    # Train Nearest Neighbors model
    knn_model = NearestNeighbors(n_neighbors=15, metric='cosine', algorithm='brute')
    knn_model.fit(X_processed)

    print("\n" + "=" * 60)
    print("PHASE 5, 7 & 8 — MODEL EVALUATION")
    print("=" * 60)

    # Evaluate model accuracy on 200 synthetic query profiles
    np.random.seed(42)
    n_queries = 200
    sample_budgets = np.random.choice([2000, 3500, 5000, 7500], size=n_queries)
    sample_vibes = np.random.choice(['Adventure', 'Beach', 'Cultural', 'Relaxation', 'Spiritual', 'Luxury', 'Nature'], size=n_queries)
    sample_companions = np.random.choice(['Friends', 'Couple', 'Family', 'Solo'], size=n_queries)
    sample_months = np.random.randint(1, 13, size=n_queries)

    def compute_ground_truth(q_budget, q_vibe, q_comp, q_month, dest_row):
        cost_diff = abs(dest_row['est_daily_budget'] - q_budget)
        cost_score = max(0, 1.0 - (cost_diff / 5000)) * 35.0
        vibe_score = 35.0 if dest_row['vibe'].lower() == q_vibe.lower() else 10.0
        comp_col = f"suitability_{q_comp.lower()}"
        comp_score = float(dest_row[comp_col]) * 15.0
        month_score = 15.0 if q_month in dest_row['best_months_list'] else 5.0
        return np.clip(cost_score + vibe_score + comp_score + month_score, 0, 100)

    precision_list = []
    recall_list = []
    ndcg_list = []

    for i in range(n_queries):
        q_b, q_v, q_c, q_m = sample_budgets[i], sample_vibes[i], sample_companions[i], sample_months[i]
        gt_scores = np.array([compute_ground_truth(q_b, q_v, q_c, q_m, df.iloc[j]) for j in range(len(df))])
        relevant_indices = set(np.where(gt_scores >= 70)[0])
        if len(relevant_indices) == 0:
            relevant_indices = set(np.argsort(gt_scores)[-5:])

        q_dict = {
            'est_daily_budget': q_b,
            'suitability_friends': 1.0 if q_c == 'Friends' else 0.5,
            'suitability_couple': 1.0 if q_c == 'Couple' else 0.5,
            'suitability_family': 1.0 if q_c == 'Family' else 0.5,
            'suitability_solo': 1.0 if q_c == 'Solo' else 0.5,
            'Google review rating': 4.5,
            'vibe': q_v
        }
        q_vec = preprocessor.transform(pd.DataFrame([q_dict]))
        sims = cosine_similarity(q_vec, X_processed)[0]
        season_boost = np.array([0.15 if q_m in df.iloc[j]['best_months_list'] else 0.0 for j in range(len(df))])
        final_scores = sims + season_boost
        top_k_idx = np.argsort(final_scores)[-5:][::-1]

        hits = len(set(top_k_idx).intersection(relevant_indices))
        precision_list.append(hits / 5.0)
        recall_list.append(hits / float(len(relevant_indices)))

        dcg = sum([1.0 / np.log2(rank + 2) for rank, idx in enumerate(top_k_idx) if idx in relevant_indices])
        ideal_top_k = np.argsort(gt_scores)[-5:][::-1]
        idcg = sum([1.0 / np.log2(rank + 2) for rank, idx in enumerate(ideal_top_k) if idx in relevant_indices])
        ndcg_list.append(dcg / idcg if idcg > 0 else 1.0)

    print(f"  Precision@5 : {np.mean(precision_list):.4f} ({np.mean(precision_list)*100:.2f}%)")
    print(f"  Recall@5    : {np.mean(recall_list):.4f} ({np.mean(recall_list)*100:.2f}%)")
    print(f"  NDCG@5      : {np.mean(ndcg_list):.4f} ({np.mean(ndcg_list)*100:.2f}%)")

    print("\n" + "=" * 60)
    print("PHASE 10 — SAVING MODEL ARTIFACTS")
    print("=" * 60)

    models_dir = 'models'
    os.makedirs(models_dir, exist_ok=True)
    
    model_file = os.path.join(models_dir, 'places_model.pkl')
    preprocessor_file = os.path.join(models_dir, 'places_preprocessor.pkl')
    df_file = os.path.join(models_dir, 'places_dataframe.pkl')

    joblib.dump(knn_model, model_file)
    joblib.dump(preprocessor, preprocessor_file)
    joblib.dump(df, df_file)

    print(f"Artifact 1: {model_file}")
    print(f"Artifact 2: {preprocessor_file}")
    print(f"Artifact 3: {df_file}")
    print("\nTraining & Serialization Completed Successfully!")

if __name__ == '__main__':
    main()
