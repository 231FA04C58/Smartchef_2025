// API service functions for OTP authentication
import { API_BASE_URL } from '../config/api';

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
    const error = new Error(errorMessage);
    
    // Include detailed error message in development
    if (errorData.error) {
      error.details = errorData.error;
    }
    
    throw error;
  }
  return response.json();
};

// Forgot Password - Send OTP
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Forgot password error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Verify OTP
export const verifyOTP = async (email, otp, type = 'password-reset') => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, type }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Verify OTP error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Reset Password
export const resetPassword = async (email, newPassword, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword, otp }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Resend OTP
export const resendOTP = async (email, type = 'password-reset') => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, type }),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Resend OTP error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};
