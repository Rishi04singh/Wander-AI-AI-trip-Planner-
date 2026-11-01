import os
import json
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, HistGradientBoostingRegressor, HistGradientBoostingClassifier
from sklearn.linear_model import Ridge, LogisticRegression
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score, accuracy_score, f1_score

def build_weather_dataset():
    """
    Builds and saves comprehensive Indian Tourism Climate Dataset covering
    regional geography (Himalayas, Coastal, Desert, Western Ghats, Gangetic Plains, Deccan)
    across all 12 months for 325 Indian destinations (3,900 destination-month records).
    """
    raw_dir = os.path.join('data', 'raw')
    os.makedirs(raw_dir, exist_ok=True)
    raw_path = os.path.join(raw_dir, 'Indian_Tourism_Weather.csv')

    places_path = os.path.join('data', 'processed', 'processed_places.csv')
    if os.path.exists(places_path):
        places_df = pd.read_csv(places_path)
    else:
        places_df = pd.DataFrame([
            {'Name': 'Manali & Solang Valley', 'City': 'Manali', 'State': 'Himachal Pradesh', 'Zone': 'Northern', 'Type': 'Hill Station'},
            {'Name': 'Goa Beaches', 'City': 'Panaji', 'State': 'Goa', 'Zone': 'Western', 'Type': 'Beach'},
            {'Name': 'Leh & Ladakh', 'City': 'Leh', 'State': 'Ladakh', 'Zone': 'Northern', 'Type': 'Adventure'},
            {'Name': 'Jaipur', 'City': 'Jaipur', 'State': 'Rajasthan', 'Zone': 'Western', 'Type': 'Heritage'},
            {'Name': 'Kerala Backwaters', 'City': 'Alleppey', 'State': 'Kerala', 'Zone': 'Southern', 'Type': 'Lake'},
            {'Name': 'Varanasi', 'City': 'Varanasi', 'State': 'Uttar Pradesh', 'Zone': 'Central', 'Type': 'Spiritual'}
        ])

    records = []
    np.random.seed(42)

    for _, place in places_df.iterrows():
        dest_name = str(place.get('Name', 'Destination')).strip()
        state = str(place.get('State', '')).lower()
        zone = str(place.get('Zone', 'Central')).lower()
        p_type = str(place.get('Type', '')).lower()

        is_himalayan = any(s in state for s in ['himachal', 'uttarakhand', 'kashmir', 'ladakh', 'sikkim', 'arunachal']) or 'hill' in p_type
        is_coastal = any(s in state for s in ['goa', 'kerala', 'tamil nadu', 'andhra', 'odisha', 'mumbai']) or 'beach' in p_type or 'island' in p_type
        is_desert = any(s in state for s in ['rajasthan', 'gujarat']) or 'desert' in p_type
        is_southern_hills = ('kerala' in state or 'karnataka' in state or 'tamil nadu' in state) and ('hill' in p_type or 'plantation' in p_type or 'falls' in p_type)

        for month in range(1, 13):
            # Base climate modeling according to India Meteorological Department (IMD) regional profiles
            if is_himalayan:
                # Sub-zero / cold winters (Nov-Feb), pleasant summer (Apr-Jun), monsoon rain (Jul-Aug)
                if month in [12, 1, 2]:
                    avg_temp = np.random.uniform(-4, 6)
                    max_temp = avg_temp + np.random.uniform(4, 7)
                    min_temp = avg_temp - np.random.uniform(5, 9)
                    rain_prob = np.random.uniform(15, 35)
                    rainfall_mm = np.random.uniform(20, 60)
                    condition = 'Snowy' if avg_temp <= 2 else 'Partly Cloudy'
                elif month in [7, 8]:
                    avg_temp = np.random.uniform(18, 24)
                    max_temp = avg_temp + np.random.uniform(5, 7)
                    min_temp = avg_temp - np.random.uniform(4, 6)
                    rain_prob = np.random.uniform(65, 90)
                    rainfall_mm = np.random.uniform(180, 380)
                    condition = 'Rainy'
                elif month in [3, 4, 5, 6]:
                    avg_temp = np.random.uniform(14, 22)
                    max_temp = avg_temp + np.random.uniform(6, 9)
                    min_temp = avg_temp - np.random.uniform(5, 7)
                    rain_prob = np.random.uniform(10, 25)
                    rainfall_mm = np.random.uniform(15, 45)
                    condition = 'Sunny'
                else: # 9, 10, 11
                    avg_temp = np.random.uniform(8, 16)
                    max_temp = avg_temp + np.random.uniform(5, 8)
                    min_temp = avg_temp - np.random.uniform(4, 7)
                    rain_prob = np.random.uniform(5, 15)
                    rainfall_mm = np.random.uniform(5, 25)
                    condition = 'Pleasant'

            elif is_coastal:
                # Warm tropical, high monsoon (Jun-Sep), dry mild winters (Nov-Feb)
                if month in [6, 7, 8, 9]:
                    avg_temp = np.random.uniform(27, 30)
                    max_temp = avg_temp + np.random.uniform(3, 5)
                    min_temp = avg_temp - np.random.uniform(3, 4)
                    rain_prob = np.random.uniform(75, 95)
                    rainfall_mm = np.random.uniform(250, 650)
                    condition = 'Rainy'
                elif month in [11, 12, 1, 2]:
                    avg_temp = np.random.uniform(25, 29)
                    max_temp = avg_temp + np.random.uniform(4, 6)
                    min_temp = avg_temp - np.random.uniform(4, 6)
                    rain_prob = np.random.uniform(2, 10)
                    rainfall_mm = np.random.uniform(0, 15)
                    condition = 'Pleasant'
                else: # 3, 4, 5, 10
                    avg_temp = np.random.uniform(31, 35)
                    max_temp = avg_temp + np.random.uniform(4, 6)
                    min_temp = avg_temp - np.random.uniform(3, 5)
                    rain_prob = np.random.uniform(15, 30)
                    rainfall_mm = np.random.uniform(10, 50)
                    condition = 'Sunny' if avg_temp < 33 else 'Extreme Heat'

            elif is_desert:
                # Scorching dry summer (Apr-Jun), chilly winter (Dec-Jan), brief scanty rain (Jul-Aug)
                if month in [4, 5, 6]:
                    avg_temp = np.random.uniform(36, 43)
                    max_temp = avg_temp + np.random.uniform(5, 8)
                    min_temp = avg_temp - np.random.uniform(7, 10)
                    rain_prob = np.random.uniform(5, 15)
                    rainfall_mm = np.random.uniform(2, 20)
                    condition = 'Extreme Heat'
                elif month in [11, 12, 1, 2]:
                    avg_temp = np.random.uniform(15, 23)
                    max_temp = avg_temp + np.random.uniform(6, 9)
                    min_temp = avg_temp - np.random.uniform(6, 10)
                    rain_prob = np.random.uniform(2, 8)
                    rainfall_mm = np.random.uniform(0, 10)
                    condition = 'Pleasant'
                elif month in [7, 8]:
                    avg_temp = np.random.uniform(31, 35)
                    max_temp = avg_temp + np.random.uniform(4, 7)
                    min_temp = avg_temp - np.random.uniform(5, 7)
                    rain_prob = np.random.uniform(35, 60)
                    rainfall_mm = np.random.uniform(40, 120)
                    condition = 'Partly Cloudy' if rain_prob < 50 else 'Rainy'
                else:
                    avg_temp = np.random.uniform(28, 33)
                    max_temp = avg_temp + np.random.uniform(5, 7)
                    min_temp = avg_temp - np.random.uniform(6, 8)
                    rain_prob = np.random.uniform(5, 15)
                    rainfall_mm = np.random.uniform(5, 25)
                    condition = 'Sunny'

            else:
                # Central & Deccan Plains
                if month in [4, 5, 6]:
                    avg_temp = np.random.uniform(34, 40)
                    max_temp = avg_temp + np.random.uniform(5, 7)
                    min_temp = avg_temp - np.random.uniform(6, 8)
                    rain_prob = np.random.uniform(10, 25)
                    rainfall_mm = np.random.uniform(10, 40)
                    condition = 'Extreme Heat' if avg_temp >= 36 else 'Sunny'
                elif month in [7, 8, 9]:
                    avg_temp = np.random.uniform(28, 32)
                    max_temp = avg_temp + np.random.uniform(4, 6)
                    min_temp = avg_temp - np.random.uniform(4, 6)
                    rain_prob = np.random.uniform(60, 85)
                    rainfall_mm = np.random.uniform(150, 320)
                    condition = 'Rainy'
                elif month in [12, 1]:
                    avg_temp = np.random.uniform(16, 22)
                    max_temp = avg_temp + np.random.uniform(5, 7)
                    min_temp = avg_temp - np.random.uniform(6, 9)
                    rain_prob = np.random.uniform(2, 8)
                    rainfall_mm = np.random.uniform(0, 10)
                    condition = 'Pleasant'
                else:
                    avg_temp = np.random.uniform(24, 30)
                    max_temp = avg_temp + np.random.uniform(5, 7)
                    min_temp = avg_temp - np.random.uniform(5, 7)
                    rain_prob = np.random.uniform(5, 18)
                    rainfall_mm = np.random.uniform(5, 30)
                    condition = 'Sunny'

            humidity = int(np.clip(
                (85 if is_coastal or condition == 'Rainy' else (35 if is_desert else 55)) + np.random.uniform(-10, 12),
                20, 98
            ))

            uv_index = int(np.clip(
                (9 if condition in ['Sunny', 'Extreme Heat'] else (3 if condition in ['Rainy', 'Snowy'] else 6)) + np.random.uniform(-1, 2),
                1, 11
            ))

            severity = 'High' if (condition in ['Rainy', 'Snowy', 'Extreme Heat'] and (rain_prob > 75 or avg_temp > 39 or avg_temp < 0)) else ('Moderate' if condition in ['Rainy', 'Extreme Heat'] else 'Low')

            records.append({
                'destination': dest_name,
                'state': str(place.get('State', 'India')),
                'zone': str(place.get('Zone', 'Central')),
                'type': str(place.get('Type', 'Attraction')),
                'month': int(month),
                'avg_temp_c': round(float(avg_temp), 1),
                'max_temp_c': round(float(max_temp), 1),
                'min_temp_c': round(float(min_temp), 1),
                'precipitation_prob': int(round(rain_prob)),
                'rainfall_mm': round(float(rainfall_mm), 1),
                'humidity_pct': int(humidity),
                'uv_index': int(uv_index),
                'condition': condition,
                'weather_severity': severity
            })

    weather_df = pd.DataFrame(records)
    weather_df.to_csv(raw_path, index=False)
    print(f"Weather raw dataset created: {weather_df.shape[0]} rows across {len(places_df)} destinations.")

    proc_dir = os.path.join('data', 'processed')
    os.makedirs(proc_dir, exist_ok=True)
    proc_path = os.path.join(proc_dir, 'processed_weather.csv')
    weather_df.to_csv(proc_path, index=False)
    print(f"Processed weather dataset saved to: {proc_path}")

    return weather_df

def main():
    print("=" * 60)
    print("MODEL 2 — WEATHER & CLIMATE RISK PREDICTION ENGINE (TRAINING)")
    print("=" * 60)

    df = build_weather_dataset()

    features = ['month', 'zone', 'type']
    num_cols = ['month']
    cat_cols = ['zone', 'type']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), cat_cols)
        ]
    )

    X = df[features]
    y_reg = df[['avg_temp_c', 'max_temp_c', 'min_temp_c', 'precipitation_prob', 'humidity_pct', 'uv_index']]
    y_clf = df['condition']

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

    print(f"\n[Model 2A] Random Forest:")
    print(f"  Regression MAE : {rf_reg_mae:.3f} | R²: {rf_reg_r2:.4f}")
    print(f"  Classification Acc : {rf_clf_acc*100:.2f}% | F1: {rf_clf_f1:.4f}")

    # Candidate 2: Multi-target HistGradientBoosting / Gradient Boosted Ensemble
    hgb_reg = HistGradientBoostingRegressor(max_iter=100, random_state=42)
    # HistGradientBoosting operates on 1D target, so we fit per-column
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

    print(f"\n[Model 2B] HistGradientBoosting (GBDT):")
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

    print(f"\n[Model 2C] Ridge + Logistic Regression Baseline:")
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

    joblib.dump(best_reg, os.path.join(models_dir, 'weather_reg_model.pkl'))
    joblib.dump(best_clf, os.path.join(models_dir, 'weather_clf_model.pkl'))
    joblib.dump(preprocessor, os.path.join(models_dir, 'weather_preprocessor.pkl'))
    joblib.dump(df, os.path.join(models_dir, 'weather_dataframe.pkl'))

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

    with open(os.path.join(models_dir, 'weather_metadata.json'), 'w') as f:
        json.dump(meta, f, indent=2)

    print("Saved weather model artifacts to models/ directory successfully.")

if __name__ == '__main__':
    main()
