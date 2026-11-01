# Wanderer — Full-Stack Travel Platform & Sathi Intelligence Suite

A full-stack travel planning and itinerary management platform built with **Next.js 15**, **TypeScript**, **Convex Backend**, **Clerk Authentication**, and a high-performance **Machine Learning Suite (Sathi)** trained on real-world Indian tourism, meteorological, transit, and schedule disruption datasets.

---

## 🌟 Platform Highlights

* **Trip Planner**: Day-by-day itinerary planning with scheduled activities, morning/afternoon/evening slots, ticket pricing, and curated dining/night spots.
* **Interactive 3D Globe**: Dynamic map visualization of destinations and point-to-point travel routes.
* **Calendar & Milestone Tracker**: Interactive monthly grid and weekly agenda view to track trip dates, set daily budget caps, check off milestones, and monitor completion progress.
* **Sathi Travel Intelligence Suite**: 4 trained Machine Learning models providing destination recommendations, regional microclimate forecasts, transit delay risks, and dynamic schedule adaptation.
* **Natural Customer Rescheduling**: Adapt itineraries dynamically by providing custom instructions (e.g., swapping outdoor plans for indoor venues during rain or compressing schedules during flight delays).

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | Server & Client Components, Fast Refresh, API Routes |
| **Language** | **TypeScript** | Strict type-safety across all components, hooks, and API routes |
| **Styling & Motion** | **Tailwind CSS + Framer Motion** | Dark glassmorphism, responsive layouts, micro-animations |
| **Backend & Database** | **Convex** | Real-time reactive database, serverless backend functions |
| **Authentication** | **Clerk** | Secure user authentication and session management |
| **Machine Learning** | **Python 3.14 + Scikit-Learn** | K-Nearest Neighbors, HistGradientBoosting, ColumnTransformer |
| **Maps & Globe** | **Mapbox GL & Three.js/Globe.gl** | 3D interactive destination rendering and route exploration |

---

## 📂 Project Directory Structure

```
Wander-AI-AI-trip-Planner-/
├── app/                                    # Next.js 15 App Router
│   ├── _components/                        # Shared UI components (Header, HeroCarousel, etc.)
│   ├── api/                                # Backend API endpoints
│   │   ├── aimodel/                        # Itinerary generation API
│   │   └── ml/                             # Unified Sathi Machine Learning orchestrator
│   ├── calendar/                           # Interactive Calendar page
│   ├── create-new-trip/                    # Trip creation wizard and chat interface
│   ├── my-trips/                           # User saved trips library
│   ├── pricing/                            # Membership & pricing tiers
│   ├── sathi/                              # Sathi Intelligence dashboard (4 ML tabs)
│   ├── view-trip/[tripId]/                 # Comprehensive itinerary viewer & adaptive panel
│   ├── globals.css                         # Global CSS styles & design tokens
│   └── layout.tsx                          # Root layout with Clerk and Convex providers
├── components/                             # Reusable UI components (TripCalendar, UI buttons, etc.)
├── convex/                                 # Convex schema and backend server functions
├── data/                                   # Real-world training datasets
│   ├── raw/                                # Kaggle raw datasets (Places, Weather, Traffic, Adaptive)
│   └── processed/                          # Cleaned, standardized training data
├── lib/ml/                                 # ML interfaces, dataset constants, and TypeScript fallback
├── models/                                 # Fitted, serialized model artifacts (.pkl & metadata.json)
├── scripts/                                # Python training, inference, and test scripts
│   ├── train_places_model.py               # Places model training pipeline
│   ├── predict_places.py                   # Places recommendation inference
│   ├── train_weather_model.py              # Weather model training pipeline
│   ├── predict_weather.py                  # Meteorological inference
│   ├── train_traffic_model.py              # Transit delay model training pipeline
│   ├── predict_traffic.py                  # Traffic bottleneck inference
│   ├── train_adaptive_model.py             # Adaptive optimizer training pipeline
│   ├── predict_adaptive.py                 # Multi-factor schedule rescheduling inference
│   └── test_*_model.py                     # Automated verification scripts
└── package.json                            # Node.js project manifest & dependencies
```

---

## 🧠 Sathi Machine Learning Engine (All 4 Models)

Sathi integrates **4 Machine Learning models** trained on Indian tourism datasets to provide travelers with actionable, real-time trip insights.

---

### Model 1: Place Recommendation System
* **Formulation**: Hybrid Vector Cosine Similarity (K-Nearest Neighbors) + Seasonality Affinity Boost.
* **Dataset**: Kaggle *Top Indian Places to Visit* (`data/raw/Top_Indian_Places_to_Visit.csv` — 325 destinations across India).
* **Key Features**: Location, Category, Significance, Entrance Fee, Google Rating, Engineered Vibe, Daily Budget, Companion Suitability (Solo, Couple, Family, Friends), Optimal Calendar Months.
* **Evaluation Metrics** (200 test profiles):
  * **Precision@5**: `73.40%`
  * **Recall@5**: `20.71%`
  * **NDCG@5**: `0.7920`
* **Artifacts**: `models/places_model.pkl`, `models/places_preprocessor.pkl`, `models/places_dataframe.pkl`
* **Inference**: `scripts/predict_places.py`

#### Sample API Request (`POST /api/ml`):
```json
{
  "action": "recommend",
  "budgetINR": 3500,
  "categoryPreference": "Adventure",
  "travelCompanion": "Friends",
  "travelMonth": 12
}
```

---

### Model 2: Weather Forecast & Microclimate Advisory
* **Formulation**: Multi-Output Dual Target Model — Continuous Temperature Regressor + Climate Condition Classifier.
* **Dataset**: Indian Tourism Meteorological Dataset (`data/raw/Indian_Tourism_Weather.csv` — 3,900 observations across 325 destinations and 12 calendar months).
* **Target Variables**: `avg_temp_c` (Regression), `condition` (`Sunny`, `Pleasant`, `Humid`, `Rain`, `Cold`, `Snow`).
* **Model Exploration & Benchmark**:

| Candidate Architecture | Temperature MAE (°C) | Temperature $R^2$ | Condition Accuracy | Macro F1-Score | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **HistGradientBoosting (GBDT)** | **4.328** | **0.7332** | **78.21%** | **0.7712** | **SELECTED** |
| Random Forest (100 Trees) | 4.412 | 0.7189 | 75.89% | 0.7420 | Baseline |
| Ridge + Logistic Regression | 6.812 | 0.4410 | 59.48% | 0.5621 | Linear Baseline |

* **Artifacts**: `models/weather_reg_model.pkl`, `models/weather_clf_model.pkl`, `models/weather_preprocessor.pkl`, `models/weather_metadata.json`
* **Inference**: `scripts/predict_weather.py`

#### Sample API Request (`POST /api/ml`):
```json
{
  "action": "weather",
  "destination": "Manali & Solang Valley",
  "travelMonth": 7
}
```

---

### Model 3: Traffic & Transit Delay Risk Model
* **Formulation**: Transit Corridor Delay Regressor + Congestion Severity Classifier (`Low`, `Moderate`, `Heavy`, `Severe`).
* **Dataset**: Indian National Transit & Tourist Corridor Delay Records (`data/raw/Indian_Tourism_Traffic.csv` — 3,900 observations across 325 destinations and 12 months).
* **Corridor Types**: `City-to-Attraction`, `Airport-Transfer`, `Highway-Corridor`, `Hill-Station-Pass`, `Coastal-Drive`.
* **Model Exploration & Benchmark**:

| Candidate Architecture | Delay MAE (Minutes) | Delay $R^2$ | Congestion Accuracy | Macro F1-Score | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **HistGradientBoosting (GBDT)** | **2.087** | **0.9704** | **97.44%** | **0.9722** | **SELECTED** |
| Random Forest (100 Trees) | 2.145 | 0.9678 | 96.92% | 0.9664 | Baseline |
| Ridge + Logistic Regression | 7.914 | 0.5841 | 64.10% | 0.6215 | Linear Baseline |

* **Artifacts**: `models/traffic_reg_model.pkl`, `models/traffic_clf_model.pkl`, `models/traffic_preprocessor.pkl`, `models/traffic_metadata.json`
* **Inference**: `scripts/predict_traffic.py`

#### Sample API Request (`POST /api/ml`):
```json
{
  "action": "traffic",
  "destination": "Goa Beaches & Forts",
  "travelMonth": 12,
  "routeType": "Coastal-Drive"
}
```

---

### Model 4: Multi-Factor Adaptive Itinerary Optimizer
* **Formulation**: Multi-Constraint Schedule Rescheduler & Dynamic Strategy Classifier with Natural Language Customer Need Support.
* **Dataset**: Tourist Itinerary Rescheduling Matrix (`data/raw/Indian_Tourism_Adaptive_Matrix.csv` — 2,500 scenarios across 100 destinations and 5 disruption types).
* **Strategies Supported**: `Indoor Reallocation`, `Route Shift & Early Depart`, `Schedule Swap & Off-Peak`, `Buffer Extension & Relax`, `Compressed Schedule`.
* **Model Exploration & Benchmark**:

| Candidate Architecture | Time Saved MAE (Min) | Time Saved $R^2$ | Strategy Accuracy | Macro F1-Score | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **HistGradientBoosting (GBDT)** | **1.526** | **0.8647** | **100.0%** | **1.000** | **SELECTED** |
| Random Forest (100 Trees) | 1.583 | 0.8542 | 99.60% | 0.9958 | Baseline |
| Ridge + Logistic Regression | 3.210 | 0.5218 | 78.40% | 0.7712 | Linear Baseline |

* **Artifacts**: `models/adaptive_reg_model.pkl`, `models/adaptive_clf_model.pkl`, `models/adaptive_preprocessor.pkl`, `models/adaptive_metadata.json`
* **Inference**: `scripts/predict_adaptive.py`

#### Sample API Request (`POST /api/ml`):
```json
{
  "action": "adapt-trip",
  "destination": "Goa Beaches & Forts",
  "travelMonth": 7,
  "customerRequest": "It is raining on Day 2, swap outdoor treks for indoor places",
  "itinerary": [
    { "day": 1, "day_plan": "Outdoor Sightseeing & Hillside Trek", "best_time_to_visit_day": "9:00 AM" },
    { "day": 2, "day_plan": "Beach Activities & Water Sports", "best_time_to_visit_day": "1:00 PM" }
  ]
}
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: `v18.0.0` or higher
* **Python**: `3.10+` with `pandas`, `scikit-learn`, and `joblib`
* **npm** or **yarn**

### 2. Installation
```bash
# Clone repository
git clone https://github.com/Rishi04singh/Wander-AI-AI-trip-Planner-.git
cd Wander-AI-AI-trip-Planner-

# Install Node dependencies
npm install

# Install Python ML dependencies
pip install pandas scikit-learn joblib numpy requests
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_token
```

### 4. Running the Development Server
```bash
# Run Convex backend in background
npx convex dev

# Run Next.js local dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Retraining & Verification Scripts

To retrain any of the machine learning models or verify predictions:

```bash
# Retrain individual models
python scripts/train_places_model.py
python scripts/train_weather_model.py
python scripts/train_traffic_model.py
python scripts/train_adaptive_model.py

# Run automated verification suites
python scripts/test_10_combinations.py
python scripts/test_weather_model.py
python scripts/test_traffic_model.py
python scripts/test_adaptive_model.py
```

---

## 📄 License
This project is licensed under the MIT License.
