# Solar Vehicle Telemetry Dashboard

This dashboard is designed to display telemetry data from the solar vehicle in real-time. The data is collected from the solar vehicle and sent to a server at fixed intervals, which is then displayed in the dashboard.

## Data collected from Vehicle

- Motor temperature
- Battery temperature
- Battery percentage
- Tyre pressure
- Speed
- Charge rate

## API Routes

- POST /api/snapshot - To send a snapshot of the vehicle data to the server

## Usage

Use fake-data.py to send fake data to the server for testing purposes.

```bash
python fake-data.py
```

