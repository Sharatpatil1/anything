import json
import os
import urllib.request
from flask import Flask, request, jsonify

app = Flask(__name__)

# Auto-create local Ladakh data files
winter_data = {
    "profile": "Ladakh Winter",
    "temperature": -15.0,
    "irradiance": 850.0,
    "humidity": 20.0,
    "wind_speed": 5.5,
    "pressure": 1010.0,
    "sunshine_duration": 8.0
}

summer_data = {
    "profile": "Ladakh Summer",
    "temperature": 18.0,
    "irradiance": 1100.0,
    "humidity": 35.0,
    "wind_speed": 3.0,
    "pressure": 1015.0,
    "sunshine_duration": 12.5
}

with open("ladakh_winter.json", "w") as f:
    json.dump(winter_data, f, indent=2)

with open("ladakh_summer.json", "w") as f:
    json.dump(summer_data, f, indent=2)

# Route 1: Live Telemetry / User Input (Mode 1 & Mode 2)
@app.route('/api/climate', methods=['POST'])
def receive_climate():
    data = request.json
    print("\n📬 LIVE CLIMATE DATA RECEIVED:")
    print(data)
    return jsonify({"status": "success", "data": data}), 200

# Route 2: Historical Profile Loader
@app.route('/api/climate/historical/<season>', methods=['GET'])
def get_historical(season):
    filename = f"ladakh_{season.lower()}.json"
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            data = json.load(f)
        return jsonify({"status": "success", "data": data}), 200
    else:
        return jsonify({"status": "error", "message": "Profile not found"}), 404

# Route 3: Live Climate Data by Location (Lat & Lon)
@app.route('/api/climate/location', methods=['GET'])
def get_by_location():
    lat = request.args.get('lat', '34.1526')  # Default: Leh, Ladakh
    lon = request.args.get('lon', '77.5771')
    
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m"
    
    try:
        req = urllib.request.urlopen(url)
        res = json.loads(req.read().decode('utf-8'))
        
        current = res.get('current', {})
        climate_payload = {
            "location": {"latitude": lat, "longitude": lon},
            "temperature": current.get('temperature_2m'),
            "humidity": current.get('relative_humidity_2m'),
            "pressure": current.get('surface_pressure'),
            "wind_speed": current.get('wind_speed_10m')
        }
        return jsonify({"status": "success", "data": climate_payload}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)