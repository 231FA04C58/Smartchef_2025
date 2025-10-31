// API Configuration
// In production, this will use VITE_API_URL environment variable
// In development, defaults to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default API_BASE_URL;

