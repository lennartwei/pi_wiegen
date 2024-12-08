#!/bin/bash

# Exit on error
set -e

echo "Installing Drink and Roll server..."

# Install system dependencies
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv git

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up service
sudo cp drinkandroll.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable drinkandroll
sudo systemctl start drinkandroll

# Add current user to gpio group
sudo usermod -a -G gpio $USER

# Set up GPIO permissions
echo 'SUBSYSTEM=="bcm2835-gpiomem", KERNEL=="gpiomem", GROUP="gpio", MODE="0660"' | sudo tee /etc/udev/rules.d/20-gpiomem.rules

echo "Installation complete! Please reboot your Raspberry Pi."
echo "After reboot, the server will start automatically."