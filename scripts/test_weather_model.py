import sys
import json
from predict_weather import predict

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

test_profiles = [
    {"destination": "Manali & Solang Valley", "travelMonth": 12, "desc": "Manali (Winter December)"},
    {"destination": "Goa Beaches & Forts", "travelMonth": 7, "desc": "Goa (Peak Monsoon July)"},
    {"destination": "Jaipur (Pink City)", "travelMonth": 5, "desc": "Jaipur (Peak Summer May)"},
    {"destination": "Leh & Ladakh", "travelMonth": 8, "desc": "Leh Ladakh (Summer August)"},
    {"destination": "Kerala Backwaters (Alleppey)", "travelMonth": 1, "desc": "Kerala Backwaters (Winter January)"},
    {"destination": "Varanasi (Kashi)", "travelMonth": 11, "desc": "Varanasi (Pleasant November)"},
    {"destination": "Udaipur (City of Lakes)", "travelMonth": 2, "desc": "Udaipur (Spring February)"},
    {"destination": "Munnar Tea Gardens", "travelMonth": 6, "desc": "Munnar (Monsoon Onset June)"},
    {"destination": "Darjeeling & Kanchenjunga", "travelMonth": 4, "desc": "Darjeeling (Spring April)"},
    {"destination": "Rishikesh & Haridwar", "travelMonth": 10, "desc": "Rishikesh (Autumn October)"}
]

print("=" * 70)
print("TESTING 10 WEATHER PREDICTION COMBINATIONS (END-TO-END)")
print("=" * 70)

for idx, p in enumerate(test_profiles, 1):
    payload = {"destination": p["destination"], "travelMonth": p["travelMonth"]}
    data = predict(payload)
    c = data["data"]
    print(f"[{idx:02d}] {p['desc']:<35} -> Condition: {c['condition']:<12} | Avg Temp: {c['avgTempC']:>5.1f}°C | Rain: {c['precipitationProb']:>2d}% | Advisory: {c['travelAdvisory'][:45]}...")

print("\nVerification of 10 Weather Combinations Completed Successfully!")
