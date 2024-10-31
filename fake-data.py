import random
import time
from datetime import datetime

import requests

API_URL = "http://localhost:3000/api/snapshot"

def generate_fake_reading():
    return {
        "motorTemperature": random.uniform(60, 120),      # 60-120°C
        "batteryTemperature": random.uniform(20, 45),     # 20-45°C
        "batteryPercentage": random.uniform(0, 100),      # 0-100%
        "tyrePressure": random.uniform(28, 35),           # 28-35 PSI
        "speed": random.uniform(0, 120),                  # 0-120 km/h
        "chargeRate": random.uniform(0, 150),             # 0-150 kW
    }

def send_reading(data):
    try:
        response = requests.post(API_URL, json=data)
        response.raise_for_status()
        print(f"Successfully sent reading at {datetime.now()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error sending reading: {e}")
        return False

def main():
    print("Starting fake data generation...")

    # Generate and send data every 2 seconds
    while True:
        reading = generate_fake_reading()

        # Add some realistic patterns
        current_hour = datetime.now().hour

        # Simulate higher speeds during rush hours (8-10am and 4-6pm)
        if 8 <= current_hour <= 10 or 16 <= current_hour <= 18:
            reading["speed"] = random.uniform(40, 120)

        # Simulate battery drain during driving
        if reading["speed"] > 0:
            reading["batteryPercentage"] -= random.uniform(0.1, 0.3)
            reading["motorTemperature"] += random.uniform(1, 3)

        # Simulate charging when stopped
        if reading["speed"] == 0 and reading["batteryPercentage"] < 90:
            reading["chargeRate"] = random.uniform(50, 150)
            reading["batteryTemperature"] += random.uniform(0.5, 1.5)
        else:
            reading["chargeRate"] = 0

        success = send_reading(reading)

        if not success:
            print("Failed to send reading, retrying in 5 seconds...")
            time.sleep(5)
            continue

        time.sleep(2)  # Wait 2 seconds before next reading

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopping data generation...")
