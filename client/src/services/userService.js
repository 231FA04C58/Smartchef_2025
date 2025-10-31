import { handleApiError } from '../utils/apiInterceptor';
import { API_BASE_URL } from '../config/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Failed to fetch profile');
      error.status = response.status;
      
      if (handleApiError(error)) {
        throw error;
      }
      
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Get user stats
export const getUserStats = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Failed to fetch stats');
      error.status = response.status;
      
      if (handleApiError(error)) {
        throw error;
      }
      
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Get stats error:', error);
    throw error;
  }
};

// Update user preferences
export const updateUserPreferences = async (preferences) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(preferences)
    });

    if (!response.ok) {
      throw new Error('Failed to update preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Update preferences error:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    return await response.json();
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

