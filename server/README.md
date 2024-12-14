# Scale Server

This is the Python backend for the Drink & Roll game. It handles communication with the HX711 load cell amplifier and provides a REST API for the frontend.

## Hardware Setup

1. Connect the HX711 to the Raspberry Pi:
   - VCC to 5V
   - GND to GND
   - DT to GPIO5
   - SCK to GPIO6

2. Connect the load cell to the HX711 following the manufacturer's specifications.

## Installation

1. Install system dependencies:
   ```bash
   sudo apt-get update
   sudo apt-get install -y python3-pip python3-venv git
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

1. Activate the virtual environment (if not already activated):
   ```bash
   source venv/bin/activate
   ```

2. Start the server:
   ```bash
   python app.py
   ```

The server will start on port 5000 and listen on all network interfaces.

## Troubleshooting

If you encounter permission issues with GPIO:

1. Add your user to the gpio group:
   ```bash
   sudo usermod -a -G gpio $USER
   ```

2. Create udev rules for GPIO access:
   ```bash
   sudo nano /etc/udev/rules.d/20-gpiomem.rules
   ```
   Add the following line:
   ```
   SUBSYSTEM=="bcm2835-gpiomem", KERNEL=="gpiomem", GROUP="gpio", MODE="0660"
   ```

3. Reboot the Raspberry Pi:
   ```bash
   sudo reboot
   ```