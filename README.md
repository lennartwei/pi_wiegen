# Drink & Roll

A web-based drinking game that runs on a Raspberry Pi Zero 2W with HX711 load cell integration.

## Features

- Interactive dice rolling game
- Real-time weight measurements
- Player management
- Leaderboard tracking
- Scale calibration
- Settings customization

## Requirements

- Raspberry Pi Zero 2W
- HX711 load cell amplifier
- Load cell sensor
- Node.js 18+
- Python 3.7+

## Hardware Setup

1. Connect the HX711 to the Raspberry Pi:
   - VCC to 5V
   - GND to GND
   - DT to GPIO5
   - SCK to GPIO6

2. Connect the load cell to the HX711 following the manufacturer's specifications.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/drink-and-roll.git
   cd drink-and-roll
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install Python dependencies:
   ```bash
   cd server
   pip3 install -r requirements.txt
   ```

## Running the Application

1. Start the Python backend:
   ```bash
   cd server
   python3 app.py
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Calibration

Before first use:
1. Go to the Calibration page
2. Follow the on-screen instructions
3. Use a known weight (100g) for accurate calibration

## License

MIT