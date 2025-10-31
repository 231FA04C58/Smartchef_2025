// Enhanced Recipe Service for API Integration
import { handleApiError } from '../utils/apiInterceptor';
import { API_BASE_URL } from '../config/api';

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  console.log('📡 API Response status:', response.status, response.statusText);
  console.log('📡 API Response URL:', response.url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    console.error('❌ API Error Response:', errorData);
    
    // Check if error was handled by interceptor (like 401 redirect)
    if (handleApiError(error)) {
      throw error; // Re-throw even if handled, to stop execution
    }
    
    throw error;
  }
  
  const data = await response.json();
  console.log('✅ API Success Response:', data);
  return data;
};

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Get all recipes with filtering and pagination
export const getRecipes = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all parameters to query string
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const url = `${API_BASE_URL}/recipes?${queryParams.toString()}`;
    console.log('🌐 Fetching from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('❌ Get recipes error:', error);
    console.error('   Error type:', error.name);
    console.error('   Error message:', error.message);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const detailedError = new Error('Unable to connect to backend server at https://smartchef-2025.onrender.com. Please make sure:\n1. Backend server is running\n2. No firewall is blocking the connection\n3. MongoDB is running');
      detailedError.originalError = error;
      throw detailedError;
    }
    throw error;
  }
};

// Get single recipe by ID
export const getRecipeById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Get recipe error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Create new recipe
export const createRecipe = async (recipeData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(recipeData),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Create recipe error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Update recipe
export const updateRecipe = async (id, recipeData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(recipeData),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Update recipe error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Delete recipe
export const deleteRecipe = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Delete recipe error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Add recipe to favorites
export const addToFavorites = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    if (!id) {
      throw new Error('Recipe ID is required');
    }

    const url = `${API_BASE_URL}/recipes/${id}/favorite`;
    console.log('Adding to favorites - URL:', url);
    console.log('Adding to favorites - Recipe ID:', id);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Add to favorites error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Remove recipe from favorites
export const removeFromFavorites = async (id) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/recipes/${id}/favorite`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Remove from favorites error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Get user's favorite recipes
export const getFavorites = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/users/favorites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Get favorites error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Get recently viewed recipes
export const getRecentlyViewed = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/users/recently-viewed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Get recently viewed error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Add review to recipe
export const addReview = async (id, reviewData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required. Please login first.');
    }

    const response = await fetch(`${API_BASE_URL}/recipes/${id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error('Add review error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

// Search recipes with advanced filters
export const searchRecipes = async (searchParams) => {
  try {
    const params = {
      search: searchParams.query || '',
      cuisine: searchParams.cuisine || '',
      category: searchParams.category || '',
      difficulty: searchParams.difficulty || '',
      dietary: searchParams.dietary || '',
      sort: searchParams.sort || 'newest',
      page: searchParams.page || 1,
      limit: searchParams.limit || 12
    };

    return await getRecipes(params);
  } catch (error) {
    console.error('Search recipes error:', error);
    throw error;
  }
};

// Get popular recipes
export const getPopularRecipes = async (limit = 6) => {
  try {
    return await getRecipes({ sort: 'popular', limit });
  } catch (error) {
    console.error('Get popular recipes error:', error);
    throw error;
  }
};

// Get trending recipes (most viewed recently)
export const getTrendingRecipes = async (limit = 6) => {
  try {
    return await getRecipes({ sort: 'popular', limit });
  } catch (error) {
    console.error('Get trending recipes error:', error);
    throw error;
  }
};

// Get recipes by cuisine
export const getRecipesByCuisine = async (cuisine, limit = 12) => {
  try {
    return await getRecipes({ cuisine, limit });
  } catch (error) {
    console.error('Get recipes by cuisine error:', error);
    throw error;
  }
};

// Get recipes by dietary restrictions
export const getRecipesByDietary = async (dietary, limit = 12) => {
  try {
    return await getRecipes({ dietary, limit });
  } catch (error) {
    console.error('Get recipes by dietary error:', error);
    throw error;
  }
};

// Get quick recipes (under 30 minutes)
export const getQuickRecipes = async (limit = 12) => {
  try {
    const response = await getRecipes({ limit });
    if (response.success) {
      // Filter recipes with total time under 30 minutes
      const quickRecipes = response.data.recipes.filter(recipe => {
        const totalTime = recipe.prepTime + recipe.cookTime;
        return totalTime <= 30;
      });
      
      return {
        ...response,
        data: {
          ...response.data,
          recipes: quickRecipes.slice(0, limit)
        }
      };
    }
    return response;
  } catch (error) {
    console.error('Get quick recipes error:', error);
    throw error;
  }
};

// Get healthy recipes (low calorie, high protein, etc.)
export const getHealthyRecipes = async (limit = 12) => {
  try {
    const response = await getRecipes({ limit });
    if (response.success) {
      // Filter recipes with good nutrition profile
      const healthyRecipes = response.data.recipes.filter(recipe => {
        if (!recipe.nutrition) return false;
        const { calories, protein, fat } = recipe.nutrition;
        return calories < 500 && protein > 15 && fat < 20;
      });
      
      return {
        ...response,
        data: {
          ...response.data,
          recipes: healthyRecipes.slice(0, limit)
        }
      };
    }
    return response;
  } catch (error) {
    console.error('Get healthy recipes error:', error);
    throw error;
  }
};

// Utility functions
export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatDifficulty = (difficulty) => {
  const difficultyMap = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard'
  };
  return difficultyMap[difficulty] || difficulty;
};

export const formatCategory = (category) => {
  const categoryMap = {
    'main-course': 'Main Course',
    'appetizer': 'Appetizer',
    'dessert': 'Dessert',
    'beverage': 'Beverage',
    'snack': 'Snack',
    'breakfast': 'Breakfast',
    'lunch': 'Lunch',
    'dinner': 'Dinner'
  };
  return categoryMap[category] || category;
};

export const getDietaryBadges = (dietaryInfo) => {
  const badges = [];
  if (dietaryInfo.vegetarian) badges.push('Vegetarian');
  if (dietaryInfo.vegan) badges.push('Vegan');
  if (dietaryInfo.glutenFree) badges.push('Gluten-Free');
  if (dietaryInfo.dairyFree) badges.push('Dairy-Free');
  if (dietaryInfo.nutFree) badges.push('Nut-Free');
  if (dietaryInfo.keto) badges.push('Keto');
  if (dietaryInfo.paleo) badges.push('Paleo');
  if (dietaryInfo.halal) badges.push('Halal');
  if (dietaryInfo.kosher) badges.push('Kosher');
  return badges;
};

export const calculateNutritionPerServing = (nutrition, servings) => {
  if (!nutrition || !servings) return null;
  
  return {
    calories: Math.round(nutrition.calories / servings),
    protein: Math.round((nutrition.protein / servings) * 10) / 10,
    carbs: Math.round((nutrition.carbs / servings) * 10) / 10,
    fat: Math.round((nutrition.fat / servings) * 10) / 10,
    fiber: Math.round((nutrition.fiber / servings) * 10) / 10,
    sugar: Math.round((nutrition.sugar / servings) * 10) / 10,
    sodium: Math.round(nutrition.sodium / servings)
  };
};
