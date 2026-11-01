import { NextRequest, NextResponse } from 'next/server';
import { WanderMLSuite } from '@/lib/ml/ml_models';
import { execFile } from 'child_process';
import path from 'path';
import util from 'util';

const execFileAsync = util.promisify(execFile);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, budgetINR, budgetUSD, categoryPreference, travelMonth, travelCompanion, destination, itinerary } = body;

    const month = Number(travelMonth) || (new Date().getMonth() + 1);
    const budget = Number(budgetINR) || (Number(budgetUSD) ? Number(budgetUSD) * 80 : 3500);
    const dest = destination || 'Manali & Solang Valley';

    // ACTION 1: ML Recommendation Engine (K-Nearest Neighbors + Cosine Similarity)
    if (action === 'recommend') {
      try {
        const payload = JSON.stringify({
          daily_budget: budget,
          vibe: categoryPreference || 'All',
          companions: travelCompanion || 'Friends',
          month: month
        });

        const scriptPath = path.join(process.cwd(), 'scripts', 'predict_places.py');
        const { stdout } = await execFileAsync('python', [scriptPath, payload], {
          cwd: process.cwd(),
          timeout: 8000
        });

        const parsed = JSON.parse(stdout);
        if (parsed.success && Array.isArray(parsed.data) && parsed.data.length > 0) {
          return NextResponse.json({
            success: true,
            model: parsed.model || 'Kaggle Real ML KNN Engine (325 Destinations)',
            data: parsed.data
          });
        }
      } catch (pyErr) {
        console.warn('Python ML Model 1 (Places) fallback triggered:', pyErr);
      }

      // Fallback to TS engine
      const recommendations = WanderMLSuite.predictPlaceRecommendations({
        budgetINR: budget,
        categoryPreference,
        travelMonth: month,
        travelCompanion
      });
      return NextResponse.json({ success: true, model: 'Kaggle Indian Recommendation Model (JS Fallback)', data: recommendations });
    }

    // ACTION 2: ML Weather & Climate Risk Predictor (HistGradientBoosting / GBDT)
    if (action === 'weather') {
      try {
        const payload = JSON.stringify({
          destination: dest,
          travelMonth: month
        });

        const scriptPath = path.join(process.cwd(), 'scripts', 'predict_weather.py');
        const { stdout } = await execFileAsync('python', [scriptPath, payload], {
          cwd: process.cwd(),
          timeout: 8000
        });

        const parsed = JSON.parse(stdout);
        if (parsed.success && parsed.data) {
          return NextResponse.json({
            success: true,
            model: parsed.model || 'Kaggle Indian Climate HistGradientBoosting Model (3,900 Observation Vectors)',
            data: parsed.data
          });
        }
      } catch (pyErr) {
        console.warn('Python ML Model 2 (Weather) fallback triggered:', pyErr);
      }

      const weatherPrediction = WanderMLSuite.predictWeather(dest, month);
      return NextResponse.json({ success: true, model: 'Kaggle Weather Decision Tree Model (JS Fallback)', data: weatherPrediction });
    }

    // ACTION 3: ML Traffic & Transit Delay Predictor (HistGradientBoosting / GBDT)
    if (action === 'traffic') {
      try {
        const payload = JSON.stringify({
          destination: dest,
          travelMonth: month,
          travelCompanion
        });

        const scriptPath = path.join(process.cwd(), 'scripts', 'predict_traffic.py');
        const { stdout } = await execFileAsync('python', [scriptPath, payload], {
          cwd: process.cwd(),
          timeout: 8000
        });

        const parsed = JSON.parse(stdout);
        if (parsed.success && parsed.data) {
          return NextResponse.json({
            success: true,
            model: parsed.model || 'Kaggle Indian Traffic Gradient Boosting Model (3,900 Route Observations)',
            data: parsed.data
          });
        }
      } catch (pyErr) {
        console.warn('Python ML Model 3 (Traffic) fallback triggered:', pyErr);
      }

      const trafficPrediction = WanderMLSuite.predictTraffic(dest, month);
      return NextResponse.json({ success: true, model: 'Kaggle Urban Traffic Gradient Boosting Model (JS Fallback)', data: trafficPrediction });
    }

    // ACTION 4: ML Adaptive Itinerary Optimizer (Constraint GBDT Ensemble)
    if (action === 'adapt-trip' || action === 'adaptive') {
      const customerRequest = body.customerRequest || body.userMessage || body.disruptionType || '';
      try {
        const payload = JSON.stringify({
          destination: dest,
          travelMonth: month,
          customerRequest,
          itinerary: itinerary || []
        });

        const scriptPath = path.join(process.cwd(), 'scripts', 'predict_adaptive.py');
        const { stdout } = await execFileAsync('python', [scriptPath, payload], {
          cwd: process.cwd(),
          timeout: 9000
        });

        const parsed = JSON.parse(stdout);
        if (parsed.success && parsed.data) {
          return NextResponse.json({
            success: true,
            model: parsed.model || 'Multi-Factor ML Adaptive Optimizer (2,500 Constraint Evaluation Scenarios)',
            data: parsed.data
          });
        }
      } catch (pyErr) {
        console.warn('Python ML Model 4 (Adaptive) fallback triggered:', pyErr);
      }

      const adaptedPlan = WanderMLSuite.adaptTripPlan(dest, month, itinerary || [], customerRequest);
      return NextResponse.json({ success: true, model: 'Multi-Factor ML Adaptive Optimizer (JS Fallback)', data: adaptedPlan });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/ml Error:', error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
