import subprocess
import json
import sys

# Force stdout encoding to utf-8 for Windows console support
sys.stdout.reconfigure(encoding='utf-8')

test_cases = [
    {"name": "1. Adventure + Friends + low budget + December", "payload": {"daily_budget": 3000, "vibe": "Adventure", "companions": "Friends", "month": 12}},
    {"name": "2. Beach + Couple + medium budget + July", "payload": {"daily_budget": 5000, "vibe": "Beach", "companions": "Couple", "month": 7}},
    {"name": "3. Spiritual + Family + low budget + October", "payload": {"daily_budget": 2500, "vibe": "Spiritual", "companions": "Family", "month": 10}},
    {"name": "4. Nature + Solo + low budget + May", "payload": {"daily_budget": 2500, "vibe": "Nature", "companions": "Solo", "month": 5}},
    {"name": "5. Cultural + Family + high budget + November", "payload": {"daily_budget": 7500, "vibe": "Cultural", "companions": "Family", "month": 11}},
    {"name": "6. Relaxation + Couple + medium budget + January", "payload": {"daily_budget": 3500, "vibe": "Relaxation", "companions": "Couple", "month": 1}},
    {"name": "7. Luxury + Couple + high budget + February", "payload": {"daily_budget": 7500, "vibe": "Luxury", "companions": "Couple", "month": 2}},
    {"name": "8. Adventure + Solo + low budget + June", "payload": {"daily_budget": 2500, "vibe": "Adventure", "companions": "Solo", "month": 6}},
    {"name": "9. Spiritual + Friends + medium budget + March", "payload": {"daily_budget": 3500, "vibe": "Spiritual", "companions": "Friends", "month": 3}},
    {"name": "10. Cultural + Solo + medium budget + August", "payload": {"daily_budget": 5000, "vibe": "Cultural", "companions": "Solo", "month": 8}},
]

print("=" * 70)
print("PHASE 13 — END-TO-END RECOMMENDATION VERIFICATION (10 TEST CASES)")
print("=" * 70)

top_dest_names = []

for idx, tc in enumerate(test_cases, 1):
    res = subprocess.run(['python', 'scripts/predict_places.py', json.dumps(tc['payload'])], capture_output=True, text=True, encoding='utf-8')
    try:
        data = json.loads(res.stdout)
        if data.get('success'):
            recs = data['data']
            top_rec = recs[0]
            top_dest = top_rec['destination']
            top_dest_names.append(top_dest['name'])
            print(f"\nTest Case {tc['name']}:")
            print(f"  Top Match: {top_dest['name']} ({top_dest['city']}, {top_dest['state']}) — {top_rec['matchScorePct']}% Match")
            print(f"  Category: {top_dest['category']} | Est Cost: ₹{top_dest['avgDailyCostINR']}/day")
            print(f"  Reason: {top_rec['recommendationReason']}")
            print(f"  Top 3 Recommendations: {', '.join([r['destination']['name'] for r in recs[:3]])}")
        else:
            print(f"\nTest Case {tc['name']} FAILED: {data.get('error')}")
    except Exception as e:
        print(f"\nTest Case {tc['name']} EXCEPTION: {e}")

print("\n" + "=" * 70)
print("DYNAMIC ADAPTABILITY CHECK:")
unique_top = len(set(top_dest_names))
print(f"  Total Test Cases: {len(test_cases)}")
print(f"  Unique Top Destinations Returned: {unique_top} / {len(test_cases)}")
if unique_top > 1:
    print("  SUCCESS: Recommendations dynamically adapt based on user preferences!")
else:
    print("  WARNING: Recommendations did not vary across inputs!")
print("=" * 70)
