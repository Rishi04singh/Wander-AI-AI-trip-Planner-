import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, HistGradientBoostingRegressor, HistGradientBoostingClassifier
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score, accuracy_score, f1_score

def build_traffic_dataset():
    """
    Builds and saves Indian Tourist Transit & Mobility Congestion Dataset covering
    all 325 destinations across all 12 months (3,900 observations).
    Captures hill road bottlenecks, weekend tourist rushes, festival seasons, and urban choke-points.
    """
    raw_dir = os.path.join('data', 'raw')
    os.makedirs(raw_dir, exist_ok=True)
    raw_path = os.path.join(raw_dir, 'Indian_Tourism_Traffic.csv')

    places_path = os.path.join('data', 'processed', 'processed_places.csv')
    if os.path.exists(places_path):
        places_df = pd.read_csv(places_path)
    else:
        places_df = pd.DataFrame([
            {'Name': 'Manali & Solang Valley', 'City': 'Manali', 'State': 'Himachal Pradesh', 'Zone': 'Northern', 'Type': 'Hill Station'},
            {'Name': 'Goa Beaches', 'City': 'Panaji', 'State': 'Goa', 'Zone': 'Western', 'Type': 'Beach'}
        ])

    records = []
    np.random.seed(42)

    for _, place in places_df.iterrows():
        dest_name = str(place.get('Name', 'Destination')).strip()
        state = str(place.get('State', '')).lower()
        zone = str(place.get('Zone', 'Central')).lower()
        p_type = str(place.get('Type', '')).lower()

        is_himalayan = any(s in state for s in ['himachal', 'uttarakhand', 'kashmir', 'ladakh', 'sikkim', 'arunachal']) or 'hill' in p_type
        is_coastal = any(s in state for s in ['goa', 'kerala', 'tamil nadu', 'mumbai']) or 'beach' in p_type
        is_heritage = any(s in state for s in ['rajasthan', 'uttar pradesh', 'madhya pradesh']) or any(k in p_type for k in ['fort', 'palace', 'heritage', 'temple', 'ghat'])
        is_metro = any(c in str(place.get('City', '')).lower() for c in ['delhi', 'mumbai', 'bengaluru', 'kolkata', 'hyderabad', 'chennai'])

        if is_himalayan:
            road_type = 'Mountain Ghaut'
            infra_score = 5
        elif is_coastal:
            road_type = 'Coastal Highway'
            infra_score = 7
        elif is_metro:
            road_type = 'Metro Urban Core'
            infra_score = 8
        elif is_heritage:
            road_type = 'Heritage Bazaars'
            infra_score = 6
        else:
            road_type = 'National Highway Corridor'
            infra_score = 7

        for month in range(1, 13):
            # Model tourist influx pattern based on month and destination archetype
            if is_himalayan:
                # May-June (summer rush) & Dec-Jan (snow rush) are peak
                is_peak = 1 if month in [5, 6, 12, 1] else (0 if month in [7, 8] else 0)
                influx = np.random.uniform(80, 98) if is_peak else (np.random.uniform(25, 45) if month in [7, 8] else np.random.uniform(50, 70))
            elif is_coastal:
                # Nov-Feb is peak holiday & party season
                is_peak = 1 if month in [11, 12, 1, 2] else (0 if month in [6, 7, 8] else 0)
                influx = np.random.uniform(85, 99) if is_peak else (np.random.uniform(30, 50) if month in [6, 7, 8] else np.random.uniform(55, 75))
            elif is_heritage:
                # Oct-Mar is peak comfortable weather
                is_peak = 1 if month in [10, 11, 12, 1, 2, 3] else 0
                influx = np.random.uniform(75, 95) if is_peak else np.random.uniform(35, 55)
            else:
                is_peak = 1 if month in [10, 11, 12, 1] else 0
                influx = np.random.uniform(65, 88) if is_peak else np.random.uniform(40, 60)

            # Delay multiplier: ranges from 1.10 (low delay) to 2.10 (over 2x transit time during peak jams)
            base_multiplier = 1.15
            if is_peak:
                base_multiplier += 0.35 + (influx / 300.0)
            if road_type in ['Mountain Ghaut', 'Heritage Bazaars']:
                base_multiplier += 0.20
            
            delay_multiplier = float(np.clip(base_multiplier + np.random.uniform(-0.08, 0.08), 1.10, 2.20))
            delay_minutes = int(np.clip(round((delay_multiplier - 1.0) * 60 + np.random.uniform(-5, 8)), 8, 95))

            if delay_multiplier >= 1.70:
                congestion = 'Severe'
                risk_score = int(np.clip(round(80 + np.random.uniform(5, 15)), 75, 98))
            elif delay_multiplier >= 1.45:
                congestion = 'Heavy'
                risk_score = int(np.clip(round(65 + np.random.uniform(3, 10)), 60, 78))
            elif delay_multiplier >= 1.25:
                congestion = 'Moderate'
                risk_score = int(np.clip(round(40 + np.random.uniform(3, 10)), 35, 58))
            else:
                congestion = 'Low'
                risk_score = int(np.clip(round(20 + np.random.uniform(3, 10)), 15, 34))

            # Recommended travel mode based on geography and congestion
            if is_metro and congestion in ['Heavy', 'Severe']:
                travel_mode = 'Metro Rail & Short Walking'
            elif road_type == 'Mountain Ghaut':
                travel_mode = 'Pre-booked 4x4 / Local Registered Taxi'
            elif road_type == 'Coastal Highway':
                travel_mode = 'Two-Wheeler Rental / Coastal Ferry'
            elif road_type == 'Heritage Bazaars':
                travel_mode = 'E-Rickshaw / Heritage Walking Tour'
            else:
                travel_mode = 'Private AC Cab / Express Bus'

            # Best departure window
            if congestion in ['Heavy', 'Severe']:
                dep_window = '6:30 AM - 8:00 AM (Early Bird Departure)'
                rush_hours = ['9:30 AM - 1:00 PM', '5:30 PM - 8:30 PM']
            elif congestion == 'Moderate':
                dep_window = '8:00 AM - 9:30 AM (Standard Departure)'
                rush_hours = ['10:00 AM - 12:30 PM', '6:00 PM - 8:00 PM']
            else:
                dep_window = 'Anytime (Smooth Traffic Expected)'
                rush_hours = ['11:00 AM - 1:00 PM']

            records.append({
                'destination': dest_name,
                'state': str(place.get('State', 'India')),
                'zone': str(place.get('Zone', 'Central')),
                'type': str(place.get('Type', 'Attraction')),
                'road_type': road_type,
                'month': int(month),
                'is_peak_season': int(is_peak),
                'tourist_influx_index': round(float(influx), 1),
                'transit_infrastructure_rating': int(infra_score),
                'delay_multiplier': round(float(delay_multiplier), 2),
                'predicted_delay_minutes': int(delay_minutes),
                'congestion_index': congestion,
                'peak_hour_risk_score': int(risk_score),
                'recommended_mode': travel_mode,
                'best_departure_window': dep_window,
                'rush_hours': ", ".join(rush_hours)
            })

    traffic_df = pd.DataFrame(records)
    traffic_df.to_csv(raw_path, index=False)
    print(f"Traffic raw dataset created: {traffic_df.shape[0]} rows across {len(places_df)} destinations.")

    proc_dir = os.path.join('data', 'processed')
    os.makedirs(proc_dir, exist_ok=True)
    proc_path = os.path.join(proc_dir, 'processed_traffic.csv')
    traffic_df.to_csv(proc_path, index=False)
    print(f"Processed traffic dataset saved to: {proc_path}")

    return traffic_df

def main():
    print("=" * 60)
    print("MODEL 3 — TOURIST TRAFFIC & CONGESTION PREDICTION (TRAINING)")
    print("=" * 60)

    df = build_traffic_dataset()

    features = ['month', 'zone', 'type', 'road_type', 'is_peak_season', 'transit_infrastructure_rating']
    num_cols = ['month', 'is_peak_season', 'transit_infrastructure_rating']
    cat_cols = ['zone', 'type', 'road_type']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), cat_cols)
        ]
    )

    X = df[features]
    y_reg = df[['delay_multiplier', 'predicted_delay_minutes', 'peak_hour_risk_score']]
    y_clf = df['congestion_index']

    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=42
    )

    X_train_trans = preprocessor.fit_transform(X_train)
    X_test_trans = preprocessor.transform(X_test)

    print("\n--- Training and Comparing 3 Candidate Models ---")

    # Candidate 1: Random Forest
    rf_reg = RandomForestRegressor(n_estimators=100, random_state=42)
    rf_reg.fit(X_train_trans, y_reg_train)
    rf_reg_preds = rf_reg.predict(X_test_trans)
    rf_reg_mae = mean_absolute_error(y_reg_test, rf_reg_preds)
    rf_reg_r2 = r2_score(y_reg_test, rf_reg_preds)

    rf_clf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_clf.fit(X_train_trans, y_clf_train)
    rf_clf_preds = rf_clf.predict(X_test_trans)
    rf_clf_acc = accuracy_score(y_clf_test, rf_clf_preds)
    rf_clf_f1 = f1_score(y_clf_test, rf_clf_preds, average='weighted')

    print(f"\n[Model 3A] Random Forest:")
    print(f"  Regression MAE : {rf_reg_mae:.3f} | R²: {rf_reg_r2:.4f}")
    print(f"  Classification Acc : {rf_clf_acc*100:.2f}% | F1: {rf_clf_f1:.4f}")

    # Candidate 2: HistGradientBoosting (GBDT)
    hgb_models = {}
    hgb_preds = []
    for col in y_reg.columns:
        hgb = HistGradientBoostingRegressor(max_iter=100, random_state=42)
        hgb.fit(X_train_trans, y_reg_train[col])
        hgb_models[col] = hgb
        hgb_preds.append(hgb.predict(X_test_trans))
    hgb_preds = np.column_stack(hgb_preds)
    hgb_reg_mae = mean_absolute_error(y_reg_test, hgb_preds)
    hgb_reg_r2 = r2_score(y_reg_test, hgb_preds)

    hgb_clf = HistGradientBoostingClassifier(max_iter=100, random_state=42)
    hgb_clf.fit(X_train_trans, y_clf_train)
    hgb_clf_preds = hgb_clf.predict(X_test_trans)
    hgb_clf_acc = accuracy_score(y_clf_test, hgb_clf_preds)
    hgb_clf_f1 = f1_score(y_clf_test, hgb_clf_preds, average='weighted')

    print(f"\n[Model 3B] HistGradientBoosting (GBDT):")
    print(f"  Regression MAE : {hgb_reg_mae:.3f} | R²: {hgb_reg_r2:.4f}")
    print(f"  Classification Acc : {hgb_clf_acc*100:.2f}% | F1: {hgb_clf_f1:.4f}")

    # Candidate 3: Ridge + Logistic Regression Baseline
    ridge_reg = Ridge(alpha=1.0)
    ridge_reg.fit(X_train_trans, y_reg_train)
    ridge_preds = ridge_reg.predict(X_test_trans)
    ridge_mae = mean_absolute_error(y_reg_test, ridge_preds)
    ridge_r2 = r2_score(y_reg_test, ridge_preds)

    lr_clf = LogisticRegression(max_iter=500, random_state=42)
    lr_clf.fit(X_train_trans, y_clf_train)
    lr_preds = lr_clf.predict(X_test_trans)
    lr_acc = accuracy_score(y_clf_test, lr_preds)
    lr_f1 = f1_score(y_clf_test, lr_preds, average='weighted')

    print(f"\n[Model 3C] Ridge + Logistic Regression Baseline:")
    print(f"  Regression MAE : {ridge_mae:.3f} | R²: {ridge_r2:.4f}")
    print(f"  Classification Acc : {lr_acc*100:.2f}% | F1: {lr_f1:.4f}")

    # Model Selection: Pick best (Random Forest or GBDT)
    if rf_reg_mae <= hgb_reg_mae and rf_clf_acc >= hgb_clf_acc:
        selected_name = "Random Forest Regressor & Classifier Ensemble"
        best_reg = rf_reg
        best_clf = rf_clf
        best_mae = rf_reg_mae
        best_r2 = rf_reg_r2
        best_acc = rf_clf_acc
    else:
        selected_name = "HistGradientBoosting Regressor & Classifier Ensemble"
        best_reg = hgb_models
        best_clf = hgb_clf
        best_mae = hgb_reg_mae
        best_r2 = hgb_reg_r2
        best_acc = hgb_clf_acc

    print("\n" + "=" * 60)
    print(f"SELECTED WINNING MODEL: {selected_name}")
    print(f"Key Test Metrics: MAE = {best_mae:.3f}, R² = {best_r2:.4f}, Accuracy = {best_acc*100:.2f}%")
    print("=" * 60)

    # Save Artifacts
    models_dir = 'models'
    os.makedirs(models_dir, exist_ok=True)

    joblib.dump(best_reg, os.path.join(models_dir, 'traffic_reg_model.pkl'))
    joblib.dump(best_clf, os.path.join(models_dir, 'traffic_clf_model.pkl'))
    joblib.dump(preprocessor, os.path.join(models_dir, 'traffic_preprocessor.pkl'))
    joblib.dump(df, os.path.join(models_dir, 'traffic_dataframe.pkl'))

    meta = {
        'model_name': selected_name,
        'dataset_size': len(df),
        'metrics': {
            'mae': float(round(best_mae, 4)),
            'r2': float(round(best_r2, 4)),
            'accuracy': float(round(best_acc, 4))
        },
        'candidates_compared': [
            {'model': 'Random Forest Ensemble', 'mae': float(round(rf_reg_mae, 3)), 'r2': float(round(rf_reg_r2, 4)), 'acc': float(round(rf_clf_acc, 4))},
            {'model': 'HistGradientBoosting (GBDT)', 'mae': float(round(hgb_reg_mae, 3)), 'r2': float(round(hgb_reg_r2, 4)), 'acc': float(round(hgb_clf_acc, 4))},
            {'model': 'Ridge + Logistic Regression', 'mae': float(round(ridge_mae, 3)), 'r2': float(round(ridge_r2, 4)), 'acc': float(round(lr_acc, 4))}
        ]
    }

    with open(os.path.join(models_dir, 'traffic_metadata.json'), 'w') as f:
        json.dump(meta, f, indent=2)

    print("Saved traffic model artifacts to models/ directory successfully.")

if __name__ == '__main__':
    main()
