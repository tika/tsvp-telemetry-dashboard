# Solar Vehicle Telemetry Dashboard

This dashboard is designed to display real-time telemetry data from solar vehicles. The data is collected from the vehicle and sent to a server at fixed intervals, which is then visualized in an interactive dashboard.

## Features

- **Real-time Data Visualization**: Monitor vehicle metrics with auto-updating charts
- **Multiple Time Ranges**: View data in 1-minute, 5-minute, 10-minute, or 30-minute windows
- **Historical Data**: Access and compare data from different runs
- **Data Export**: Export run data to CSV format for further analysis
- **Unit Conversion**: Toggle between different units (e.g., Celsius/Fahrenheit for temperature)

## Data Metrics

The dashboard tracks the following vehicle metrics:

- **Motor Temperature**: 60-120°C range
- **Battery Temperature**: 20-45°C range
- **Battery Percentage**: 0-100%
- **Tyre Pressure**: 28-35 PSI
- **Speed**: 0-120 km/h
- **Charge Rate**: 0-150 kW

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.x (for fake data generation)
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd solar-vehicle-dashboard
```

2. Install dependencies:

```bash
yarn install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

4. Initialize the database:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
yarn dev
```

### Testing with Fake Data

The project includes a Python script to generate and send fake telemetry data for testing:

1. Install Python dependencies:

```bash
pip install requests
```

2. Run the fake data generator:

```bash
python fake-data.py
```

The script will simulate realistic vehicle behavior, including:

- Higher speeds during rush hours (8-10am and 4-6pm)
- Battery drain during movement
- Temperature increases during operation
- Charging behavior when stationary

## API Routes

### Snapshot Endpoints

- `POST /api/snapshot`: Send new telemetry data
- `GET /api/snapshot?runId={id}`: Retrieve data for a specific run
- `GET /api/runs`: Get list of available runs

### Data Format

```typescript
{
  motorTemperature: number,
  batteryTemperature: number,
  batteryPercentage: number,
  tyrePressure: number,
  speed: number,
  chargeRate: number
}
```

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **API**: Next.js API Routes

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
