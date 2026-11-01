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
from sklearn.metrics import mean_absolute_error, r2_score, accuracy_score, f1_score

def build_adaptive_dataset():
    """
    Builds and saves Indian Tourism Adaptive Multi-Constraint Optimization Matrix.
    Simulates 2,500 day-plan activity scheduling scenarios across weather risks,
    traffic congestion, and companion constraints.
    """
    raw_dir = os.path.join('data', 'raw')
    os.makedirs(raw_dir, exist_ok=True)
    raw_path = os.path.join(raw_dir, 'Indian_Tourism_Adaptive_Matrix.csv')

    np.random.seed(42)
    n_samples = 2500

    activity_types = ['Outdoor Trek', 'Beach Sports', 'Heritage Walk', 'Museum & Palace', 'Boat Cruise', 'Market Shopping', 'Spiritual Aarti']
    time_slots = ['Morning (9:00 AM)', 'Mid-Day (1:00 PM)', 'Evening (5:00 PM)', 'Night (8:00 PM)']
    weather_conditions = ['Sunny', 'Pleasant', 'Rainy', 'Extreme Heat', 'Snowy']
    congestion_levels = ['Low', 'Moderate', 'Heavy', 'Severe']

    records = []
    for _ in range(n_samples):
        act = np.random.choice(activity_types)
        time = np.random.choice(time_slots)
        weather = np.random.choice(weather_conditions, p=[0.35, 0.25, 0.20, 0.12, 0.08])
        congestion = np.random.choice(congestion_levels, p=[0.25, 0.35, 0.25, 0.15])
        rain_prob = np.random.uniform(65, 95) if weather == 'Rainy' else np.random.uniform(5, 30)
        temp_c = np.random.uniform(37, 44) if weather == 'Extreme Heat' else (np.random.uniform(-4, 5) if weather == 'Snowy' else np.random.uniform(18, 32))
        delay_mins = np.random.uniform(50, 90) if congestion in ['Heavy', 'Severe'] else np.random.uniform(10, 30)

        # Baseline suitability calculation
        base_score = 95.0
        is_outdoor = act in ['Outdoor Trek', 'Beach Sports', 'Heritage Walk', 'Boat Cruise']

        # Rule evaluation for ground truth
        action = 'Optimal'
        if weather == 'Rainy' and is_outdoor:
            action = 'Indoor Swapped'
            base_score -= 30.0
        elif weather == 'Extreme Heat' and time == 'Mid-Day (1:00 PM)' and is_outdoor:
            action = 'Timing Shifted'
            base_score -= 25.0
        elif weather == 'Snowy' and (time in ['Morning (9:00 AM)', 'Night (8:00 PM)']) and act in ['Outdoor Trek', 'Boat Cruise']:
            action = 'Timing Shifted'
            base_score -= 35.0
        elif congestion in ['Heavy', 'Severe'] and (time in ['Morning (9:00 AM)', 'Evening (5:00 PM)']):
            action = 'Timing Shifted'
            base_score -= 20.0
        elif congestion == 'Moderate':
            base_score -= 8.0

        optimized_suitability = float(np.clip(base_score + (18.0 if action != 'Optimal' else 0.0) + np.random.uniform(-3, 3), 45, 99))
        risk_reduction = float(np.clip(25.0 if action == 'Indoor Swapped' else (18.0 if action == 'Timing Shifted' else 0.0) + np.random.uniform(-2, 2), 0, 35))

        records.append({
            'activity_type': act,
            'time_slot': time,
            'weather_condition': weather,
            'precipitation_prob': round(float(rain_prob), 1),
            'avg_temp_c': round(float(temp_c), 1),
            'congestion_level': congestion,
            'delay_minutes': round(float(delay_mins), 1),
            'optimization_action': action,
            'suitability_score': round(optimized_suitability, 1),
            'risk_reduction_pct': round(risk_reduction, 1)
        })

    adaptive_df = pd.DataFrame(records)
    adaptive_df.to_csv(raw_path, index=False)
    print(f"Adaptive raw dataset created: {adaptive_df.shape[0]} scenarios.")

    proc_dir = os.path.join('data', 'processed')
    os.makedirs(proc_dir, exist_ok=True)
    proc_path = os.path.join(proc_dir, 'processed_adaptive.csv')
    adaptive_df.to_csv(proc_path, index=False)
    print(f"Processed adaptive dataset saved to: {proc_path}")

    return adaptive_df

def main():
    print("=" * 60)
    print("MODEL 4 — ADAPTIVE TRIP OPTIMIZER ENGINE (TRAINING)")
    print("=" * 60)

    df = build_adaptive_dataset()

    features = ['activity_type', 'time_slot', 'weather_condition', 'precipitation_prob', 'avg_temp_c', 'congestion_level', 'delay_minutes']
    num_cols = ['precipitation_prob', 'avg_temp_c', 'delay_minutes']
    cat_cols = ['activity_type', 'time_slot', 'weather_condition', 'congestion_level']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_cols),
            ('cat', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), cat_cols)
        ]
    )

    X = df[features]
    y_reg = df[['suitability_score', 'risk_reduction_pct']]
    y_clf = df['optimization_action']

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

    print(f"\n[Model 4A] Random Forest:")
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

    print(f"\n[Model 4B] HistGradientBoosting (GBDT):")
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

    print(f"\n[Model 4C] Ridge + Logistic Regression Baseline:")
    print(f"  Regression MAE : {ridge_mae:.3f} | R²: {ridge_r2:.4f}")
    print(f"  Classification Acc : {lr_acc*100:.2f}% | F1: {lr_f1:.4f}")

    # Selection
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

    joblib.dump(best_reg, os.path.join(models_dir, 'adaptive_reg_model.pkl'))
    joblib.dump(best_clf, os.path.join(models_dir, 'adaptive_clf_model.pkl'))
    joblib.dump(preprocessor, os.path.join(models_dir, 'adaptive_preprocessor.pkl'))
    joblib.dump(df, os.path.join(models_dir, 'adaptive_dataframe.pkl'))

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

    with open(os.path.join(models_dir, 'adaptive_metadata.json'), 'w') as f:
        json.dump(meta, f, indent=2)

    print("Saved adaptive model artifacts to models/ directory successfully.")

if __name__ == '__main__':
    main()
