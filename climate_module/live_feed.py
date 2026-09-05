import json
import time
import urllib.parse
import urllib.request

SERVER_URL = "http://127.0.0.1:5000/api/climate"

def get_coordinates(location_name):
    safe_location = urllib.parse.quote(location_name)
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={safe_location}&count=1&language=en&format=json"
    
    # User-Agent header prevents API request blocks
    req = urllib.request.Request(geo_url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        res_data = urllib.request.urlopen(req).read().decode('utf-8')
        res = json.loads(res_data)
        
        if "results" in res and len(res["results"]) > 0:
            first = res["results"][0]
            return first["latitude"], first["longitude"], first["name"], first.get("country", "")
    except Exception as e:
        print(f"Error fetching coordinates: {e}")
        
    return None, None, None, None

print("🌍 GLOBAL REAL-TIME WEATHER FEEDER STARTED!")
print("Type any city name in the world (e.g., Bengaluru, Delhi, London, Tokyo, New York)\n")

city_input = input("👉 Enter City Name: ").strip()

lat, lon, city_name, country = get_coordinates(city_input)

if not lat or not lon:
    print(f"❌ City '{city_input}' not found. Check spelling!")
    exit()

print(f"\n📍 Location Locked: {city_name}, {country} (Lat: {lat}, Lon: {lon})")
print(f"📡 Sending Live Weather Data to Server ({SERVER_URL}) every 10 seconds...\n")

API_URL = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,direct_normal_irradiance"

while True:
    try:
        weather_req = urllib.request.Request(API_URL, headers={'User-Agent': 'Mozilla/5.0'})
        api_data = json.loads(urllib.request.urlopen(weather_req).read().decode('utf-8'))
        current = api_data.get('current', {})

        payload = {
            "source": f"open_meteo_live_{city_name.lower().replace(' ', '_')}",
            "location": f"{city_name}, {country}",
            "latitude": lat,
            "longitude": lon,
            "temperature": current.get('temperature_2m'),
            "humidity": current.get('relative_humidity_2m'),
            "pressure": current.get('surface_pressure'),
            "wind_speed": current.get('wind_speed_10m'),
            "irradiance": current.get('direct_normal_irradiance', 850.0)
        }

        data_json = json.dumps(payload).encode('utf-8')
        post_req = urllib.request.Request(SERVER_URL, data=data_json, headers={'Content-Type': 'application/json'})
        response = urllib.request.urlopen(post_req)
        
        print(f"✅ [{city_name}] Live Temp = {payload['temperature']}°C | Humidity = {payload['humidity']}% | Wind = {payload['wind_speed']} km/h")

    except Exception as e:
        print(f"❌ Error fetching live data: {e}")

    time.sleep(10)