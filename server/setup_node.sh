#!/bin/bash

# Exit on error
set -e

echo "Installing Node.js and setting up the project..."

# Install Node.js repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Create project directory if it doesn't exist
mkdir -p /home/pi/pi_wiegen_by_bolt/client

# Navigate to project directory
cd /home/pi/pi_wiegen_by_bolt/client

# Initialize npm project
npm init -y

# Install project dependencies
npm install vite@latest react@latest react-dom@latest react-router-dom@latest lucide-react@latest

# Install dev dependencies
npm install -D @types/react @types/react-dom typescript@latest @vitejs/plugin-react tailwindcss postcss autoprefixer

echo "Node.js setup complete!"