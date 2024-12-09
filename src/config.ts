// Get the hostname dynamically from the current window location
const hostname = window.location.hostname;

// Use the hostname to construct the API URLs
export const API_BASE_URL = `http://${hostname}:5000`;
export const SOCKET_URL = `http://${hostname}:5000`;

// Weight display configuration
export const WEIGHT_DISPLAY_CONFIG = {
  MIN_UPDATE_RATE: 500,  // Minimum update rate in milliseconds
  MAX_UPDATE_RATE: 10000, // Maximum update rate in milliseconds
  DEFAULT_UPDATE_RATE: 2000 // Default update rate in milliseconds
};