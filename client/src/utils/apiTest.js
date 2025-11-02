// API Test Utility for Browser environment
import { API_BASE_URL } from '../config/api';

const testAPI = {
  async testConnection() {
    try {
      console.log('Testing API connection...');
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      console.log('✅ API Connection successful:', data);
      return data;
    } catch (error) {
      console.error('❌ API Connection failed:', error);
      return null;
    }
  },

  async testForgotPassword(email) {
    try {
      console.log('Testing forgot password endpoint...');
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log('✅ Forgot password test successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Forgot password test failed:', error);
      return null;
    }
  },

  async testLogin(email, password) {
    try {
      console.log('Testing login endpoint...');
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('✅ Login test successful:', data);
      return data;
    } catch (error) {
      console.error('❌ Login test failed:', error);
      return null;
    }
  }
};

// Make available globally for browser console
window.testAPI = testAPI;

console.log('🔧 API Test functions loaded. Use:');
console.log('- testAPI.testConnection()');
console.log('- testAPI.testForgotPassword("your-email@example.com")');
console.log('- testAPI.testLogin("email@example.com", "password")');

export default testAPI;