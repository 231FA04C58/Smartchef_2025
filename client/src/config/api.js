// API Configuration
// In production, this will use VITE_API_URL environment variable
// In development, defaults to localhost
// If VITE_API_URL doesn't end with '/api', it will be appended
const getBaseURL = () => {
  // If VITE_API_URL is set, use it
  if (import.meta.env.VITE_API_URL) {
    console.log('🌐 Using VITE_API_URL from environment:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  // In development, use localhost
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    console.log('%c🌐 Development Mode Active', 'color: #4CAF50; font-weight: bold; font-size: 14px; background: #E8F5E9; padding: 4px 8px; border-radius: 4px;');
    console.log('%c📍 Backend URL:', 'color: #2196F3; font-weight: bold;', 'http://localhost:5000');
    return 'http://localhost:5000';
  }
  // Production fallback
  const fallbackURL = 'https://smartchef-2025.onrender.com';
  console.log('⚠️ No VITE_API_URL set - using fallback:', fallbackURL);
  console.log('💡 Tip: Set VITE_API_URL environment variable in Render for production');
  return fallbackURL;
};

const baseURL = getBaseURL();
export const API_BASE_URL = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`;

// Enhanced console logging with colors for better visibility
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #667eea; font-weight: bold;');
console.log('%c🚀 API Configuration Status', 'color: #667eea; font-weight: bold; font-size: 16px;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #667eea; font-weight: bold;');
console.log('%c📍 API_BASE_URL:', 'color: #4CAF50; font-weight: bold;', API_BASE_URL);
console.log('%c📋 Environment:', 'color: #FF9800; font-weight: bold;', import.meta.env.MODE || 'unknown');
console.log('%c🔧 VITE_API_URL:', 'color: #2196F3; font-weight: bold;', import.meta.env.VITE_API_URL || 'not set');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #667eea; font-weight: bold;');

export default API_BASE_URL;

