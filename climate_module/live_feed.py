import json
import time
import urllib.parse
import urllib.request

SERVER_URL = "http://127.0.0.1:5000/api/climate"

def get_coordinates(location_name):
    """Searches OpenStreetMap and handles small villages, hostels, and landmarks"""
    def search_osm(query_str):
        safe_location = urllib.parse.quote(query_str)
        geo_url = f"https://nominatim.openstreetmap.org/search?q={safe_location}&format=json&limit=1"
        req = urllib.request.Request(geo_url, headers={'User-Agent': 'ClimateFeederApp/1.0'})
        try:
            res_data = urllib.request.urlopen(req).read().decode('utf-8')
            res = json.loads(res_data)
            if len(res) > 0:
                first = res[0]
                lat = float(first["lat"])
                lon = float(first["lon"])
                display_name = first.get("display_name", query_str)
                short_name = display_name.split(",")[0]
                return lat, lon, short_name, display_name
        except Exception:
            pass
        return None, None, None, None

    # Try 1: Direct location search
    lat, lon, short_name, full_address = search_osm(location_name)
    if lat:
        return lat, lon, short_name, full_address

    # Try 2: Automatic fallback with state/region attached
    lat, lon, short_name, full_address = search_osm(f"{location_name}, Bengaluru")
    if lat:
        return lat, lon, short_name, full_address

    # Try 3: Default neighborhood fallback for specific PG/Hostel names
    return search_osm("Kattigenahalli, Bengaluru")

print("🌍 GLOBAL & VILLAGE REAL-TIME WEATHER FEEDER STARTED!")
print("Type ANY village, town, or city name (e.g., Kattigenahalli, Yelahanka, Gadag, London)\n")

city_input = input("👉 Enter Location/Village Name: ").strip()

lat, lon, short_name, full_address = get_coordinates(city_input)

if not lat or not lon:
    print(f"❌ Location '{city_input}' not found. Check spelling!")
    exit()

print(f"\n📍 Location Locked: {short_name}")
print(f"🏠 Full Address: {full_address}")
print(f"🌐 Coordinates: Lat {lat}, Lon {lon}")
print(f"📡 Sending Live Weather Data to Server ({SERVER_URL}) every 10 seconds...\n")

API_URL = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,direct_normal_irradiance"

while True:
    try:
        weather_req = urllib.request.Request(API_URL, headers={'User-Agent': 'Mozilla/5.0'})
        api_data = json.loads(urllib.request.urlopen(weather_req).read().decode('utf-8'))
        current = api_data.get('current', {})

        payload = {
            "source": f"osm_live_{short_name.lower().replace(' ', '_')}",
            "location": short_name,
            "full_address": full_address,
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
        
        print(f"✅ [{short_name}] Temp = {payload['temperature']}°C | Humidity = {payload['humidity']}% | Wind = {payload['wind_speed']} km/h")

    except Exception as e:
        print(f"❌ Error fetching live data: {e}")

    time.sleep(10)