// API Configuration
// In production, this will use VITE_API_URL environment variable
// In development, defaults to localhost
// If VITE_API_URL doesn't end with '/api', it will be appended
const getBaseURL = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // In development, use localhost
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:5000';
  }
  // Production fallback
  return 'https://smartchef-2025.onrender.com';
};

const baseURL = getBaseURL();
export const API_BASE_URL = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`;

export default API_BASE_URL;

