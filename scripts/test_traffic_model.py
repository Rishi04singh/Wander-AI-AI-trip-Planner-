import sys
import json
from predict_traffic import predict

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

test_profiles = [
    {"destination": "Manali & Solang Valley", "travelMonth": 12, "desc": "Manali (Snow Peak Dec)"},
    {"destination": "Goa Beaches & Forts", "travelMonth": 12, "desc": "Goa (New Year Peak Dec)"},
    {"destination": "Jaipur (Pink City)", "travelMonth": 1, "desc": "Jaipur (Lit Fest & Winter Jan)"},
    {"destination": "Leh & Ladakh", "travelMonth": 7, "desc": "Leh Ladakh (Bikers Peak July)"},
    {"destination": "Kerala Backwaters (Alleppey)", "travelMonth": 8, "desc": "Kerala (Snake Boat Monsoon Aug)"},
    {"destination": "Varanasi (Kashi)", "travelMonth": 11, "desc": "Varanasi (Dev Deepawali Nov)"},
    {"destination": "Udaipur (City of Lakes)", "travelMonth": 2, "desc": "Udaipur (Wedding Season Feb)"},
    {"destination": "Munnar Tea Gardens", "travelMonth": 5, "desc": "Munnar (Summer Influx May)"},
    {"destination": "Darjeeling & Kanchenjunga", "travelMonth": 4, "desc": "Darjeeling (Toy Train Peak Apr)"},
    {"destination": "Rishikesh & Haridwar", "travelMonth": 3, "desc": "Rishikesh (Rafting Season Mar)"}
]

print("=" * 70)
print("TESTING 10 TRAFFIC & CONGESTION COMBINATIONS (END-TO-END)")
print("=" * 70)

for idx, p in enumerate(test_profiles, 1):
    payload = {"destination": p["destination"], "travelMonth": p["travelMonth"]}
    data = predict(payload)
    t = data["data"]
    print(f"[{idx:02d}] {p['desc']:<35} -> Congestion: {t['congestionIndex']:<10} | Delay Mult: {t['delayMultiplier']}x | Delay Mins: {t['predictedDelayMinutesPerTrip']:>2d}m | Mode: {t['recommendedTravelMode'][:30]}...")

print("\nVerification of 10 Traffic Combinations Completed Successfully!")
