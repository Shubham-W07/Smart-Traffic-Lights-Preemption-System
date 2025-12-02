import sys
import json
import numpy as np

def main():
    try:
        # Read JSON input from Node
        input_data = sys.stdin.read().strip()
        if not input_data:
            print(json.dumps({"error": "No input received"}))
            return
        
        data = json.loads(input_data)
        obj = data["obj"]
        nearby_signals = data["nearbySignals"]

        lat1 = obj["latitude"]
        lon1 = obj["longitude"]

        # Convert to numpy arrays
        signal_lats = np.array([s["latitude"] for s in nearby_signals], dtype=float)
        signal_lons = np.array([s["longitude"] for s in nearby_signals], dtype=float)

        # ---- Compute distances (Haversine) ----
        R = 6371.0
        dLat = np.radians(signal_lats - lat1)
        dLon = np.radians(signal_lons - lon1)
        a = np.sin(dLat / 2) ** 2 + np.cos(np.radians(lat1)) * np.cos(np.radians(signal_lats)) * np.sin(dLon / 2) ** 2
        c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
        distances = R * c

        # ---- Compute bearings ----
        y = np.sin(dLon) * np.cos(np.radians(signal_lats))
        x = np.cos(np.radians(lat1)) * np.sin(np.radians(signal_lats)) - np.sin(np.radians(lat1)) * np.cos(np.radians(signal_lats)) * np.cos(dLon)
        bearings = (np.degrees(np.arctan2(y, x)) + 360) % 360

        # ---- Determine direction ----
        directions = np.full_like(bearings, "NORTH", dtype=object)
        directions[(bearings >= 45) & (bearings < 135)] = "EAST"
        directions[(bearings >= 135) & (bearings < 225)] = "SOUTH"
        directions[(bearings >= 225) & (bearings < 315)] = "WEST"

        results = []

        for i, signal in enumerate(nearby_signals):
            curr_distKm = float(distances[i])
            direction = str(directions[i])
            pre_distKm = signal.get("pre_distKm")
            isApproching = False
            isLeaving = False
            hasSent = signal.get("hasSent", False)

            # ---- Detect approach or leave ----
            if pre_distKm is not None:
                if curr_distKm < pre_distKm:
                    isApproching = True
                    isLeaving = False
                elif curr_distKm > pre_distKm:
                    isApproching = False
                    isLeaving = True

            signal["pre_distKm"] = curr_distKm
            signal["isApproching"] = isApproching
            signal["isLeaving"] = isLeaving
            signal["direction"] = direction

            mqtt_action = None

            # ---- Approaching ----
            if curr_distKm <= 0.15 and isApproching and not hasSent:
                mqtt_action = {
                    "signal_topic": signal["signal_topic"],
                    "distKM": curr_distKm,
                    "direction": direction,
                    "state": "approaching"
                }
                signal["hasSent"] = True

            # ---- Leaving ----
            elif curr_distKm >= 0.05 and isLeaving and hasSent:
                mqtt_action = {
                    "signal_topic": signal["signal_topic"],
                    "distKM": curr_distKm,
                    "direction": direction,
                    "state": "leaving"
                }
                signal["hasSent"] = False

            results.append({
                "signal_topic": signal["signal_topic"],
                "distKM": curr_distKm,
                "direction": direction,
                "isApproching": isApproching,
                "isLeaving": isLeaving,
                "mqtt_action": mqtt_action
            })

        # Return both results and updated signal states
        print(json.dumps({
            "results": results,
            "updated_signals": nearby_signals
        }, ensure_ascii=False))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
