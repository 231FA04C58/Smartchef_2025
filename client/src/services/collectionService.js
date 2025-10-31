import { handleApiError } from '../utils/apiInterceptor';
import { API_BASE_URL } from '../config/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get all collections
export const getCollections = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/collections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Failed to fetch collections');
      error.status = response.status;
      
      // Check if error was handled by interceptor
      if (handleApiError(error)) {
        throw error;
      }
      
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('Get collections error:', error);
    throw error;
  }
};

// Get single collection
export const getCollection = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch collection');
    }

    return await response.json();
  } catch (error) {
    console.error('Get collection error:', error);
    throw error;
  }
};

// Create collection
export const createCollection = async (collectionData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(collectionData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create collection');
    }

    return await response.json();
  } catch (error) {
    console.error('Create collection error:', error);
    throw error;
  }
};

// Update collection
export const updateCollection = async (id, collectionData) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(collectionData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update collection');
    }

    return await response.json();
  } catch (error) {
    console.error('Update collection error:', error);
    throw error;
  }
};

// Delete collection
export const deleteCollection = async (id) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete collection');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete collection error:', error);
    throw error;
  }
};

// Add recipe to collection
export const addRecipeToCollection = async (collectionId, recipeId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/collections/${collectionId}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ recipeId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add recipe to collection');
    }

    return await response.json();
  } catch (error) {
    console.error('Add recipe to collection error:', error);
    throw error;
  }
};

// Remove recipe from collection
export const removeRecipeFromCollection = async (collectionId, recipeId) => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/collections/${collectionId}/recipes/${recipeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to remove recipe from collection');
    }

    return await response.json();
  } catch (error) {
    console.error('Remove recipe from collection error:', error);
    throw error;
  }
};

