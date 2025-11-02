// API Configuration
// In production, this will use VITE_API_URL environment variable
// In development, defaults to Render URL
// If VITE_API_URL doesn't end with '/api', it will be appended
const baseURL = import.meta.env.VITE_API_URL || 'https://smartchef-2025.onrender.com';
export const API_BASE_URL = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`;

export default API_BASE_URL;

