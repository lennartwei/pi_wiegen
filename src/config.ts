// Get the hostname dynamically from the current window location
const hostname = window.location.hostname;

// Use the hostname to construct the API URL
export const API_BASE_URL = `http://${hostname}:5000`;