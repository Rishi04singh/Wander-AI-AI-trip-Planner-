import sys
import json
from predict_adaptive import predict

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

test_profiles = [
    {"destination": "Manali & Solang Valley", "travelMonth": 12, "desc": "Manali (Winter Trek December)"},
    {"destination": "Goa Beaches & Forts", "travelMonth": 7, "desc": "Goa (Monsoon Beach July)"},
    {"destination": "Jaipur (Pink City)", "travelMonth": 5, "desc": "Jaipur (Summer Midday May)"},
    {"destination": "Leh & Ladakh", "travelMonth": 8, "desc": "Leh Ladakh (August High Altitude)"},
    {"destination": "Kerala Backwaters (Alleppey)", "travelMonth": 1, "desc": "Kerala (January Houseboat)"},
    {"destination": "Varanasi (Kashi)", "travelMonth": 11, "desc": "Varanasi (November Ghats)"},
    {"destination": "Udaipur (City of Lakes)", "travelMonth": 2, "desc": "Udaipur (February Lakes)"},
    {"destination": "Munnar Tea Gardens", "travelMonth": 6, "desc": "Munnar (June Plantation Trek)"},
    {"destination": "Darjeeling & Kanchenjunga", "travelMonth": 4, "desc": "Darjeeling (April Himalayan)"},
    {"destination": "Rishikesh & Haridwar", "travelMonth": 10, "desc": "Rishikesh (October River Rafting)"}
]

print("=" * 70)
print("TESTING 10 ADAPTIVE TRIP OPTIMIZATION COMBINATIONS (END-TO-END)")
print("=" * 70)

for idx, p in enumerate(test_profiles, 1):
    payload = {"destination": p["destination"], "travelMonth": p["travelMonth"]}
    data = predict(payload)
    a = data["data"]
    actions = [item["optimizationAction"] for item in a["adaptedItinerary"]]
    print(f"[{idx:02d}] {p['desc']:<35} -> Suitability: {a['overallSuitabilityScore']}% | Actions: {actions} | Weather: {a['weatherSummary'][:25]}...")

print("\nVerification of 10 Adaptive Combinations Completed Successfully!")
