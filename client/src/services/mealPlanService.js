// Meal Plan Service - Connects frontend to backend API
import { handleApiError } from '../utils/apiInterceptor';
import { API_BASE_URL } from '../config/api';

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// Get all meal plans for current user
export const getUserMealPlans = async (page = 1, limit = 10) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/planner?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to fetch meal plans');
      error.status = response.status;
      
      if (handleApiError(error)) {
        throw error;
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Get meal plans error:', error);
    throw error;
  }
};

// Get active meal plan for current week
export const getActiveMealPlan = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // Get current week's start and end dates
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    // Get all active meal plans
    const response = await getUserMealPlans(1, 100);
    
    if (response.success) {
      // Find active meal plan for this week
      const activePlan = response.data.mealPlans.find(plan => {
        return plan.isActive &&
               new Date(plan.startDate) <= endOfWeek &&
               new Date(plan.endDate) >= startOfWeek;
      });

      return {
        success: true,
        data: { mealPlan: activePlan || null }
      };
    }

    return { success: false, data: { mealPlan: null } };
  } catch (error) {
    console.error('Get active meal plan error:', error);
    return { success: false, data: { mealPlan: null } };
  }
};

// Create or update weekly meal plan
export const saveWeeklyMealPlan = async (weeklyPlan) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    // Convert weekly plan (monday: recipeName, etc.) to API format
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const meals = [];

    // Build meals array from weekly plan
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const recipeName = weeklyPlan[day];

      if (recipeName) {
        // Find recipe by title
        const recipeResponse = await fetch(`${API_BASE_URL}/recipes?search=${encodeURIComponent(recipeName)}&limit=1`);
        const recipeData = await recipeResponse.json();

        if (recipeData.success && recipeData.data.recipes.length > 0) {
          const recipeId = recipeData.data.recipes[0]._id;
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);

          meals.push({
            date: date.toISOString(),
            mealType: 'dinner', // Default to dinner, can be customized
            recipe: recipeId,
            servings: 4
          });
        }
      }
    }

    if (meals.length === 0) {
      return {
        success: false,
        message: 'No recipes to save'
      };
    }

    // Check if meal plan already exists for this week
    const existingResponse = await getActiveMealPlan();
    let response;

    if (existingResponse.success && existingResponse.data.mealPlan) {
      // Update existing meal plan
      response = await fetch(`${API_BASE_URL}/planner/${existingResponse.data.mealPlan._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          meals: meals
        })
      });
    } else {
      // Create new meal plan
      response = await fetch(`${API_BASE_URL}/planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `Week of ${startOfWeek.toLocaleDateString()}`,
          description: 'Weekly meal plan',
          startDate: startOfWeek.toISOString(),
          endDate: endOfWeek.toISOString(),
          meals: meals,
          isActive: true
        })
      });
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to save meal plan');
      error.status = response.status;
      
      if (handleApiError(error)) {
        throw error;
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Save meal plan error:', error);
    throw error;
  }
};

// Load weekly meal plan from database
export const loadWeeklyMealPlan = async () => {
  try {
    const activePlanResponse = await getActiveMealPlan();
    
    if (!activePlanResponse.success || !activePlanResponse.data.mealPlan) {
      return {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null
      };
    }

    const mealPlan = activePlanResponse.data.mealPlan;
    const weeklyPlan = {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null
    };

    // Convert meal plan meals to weekly format
    mealPlan.meals.forEach(meal => {
      if (meal.recipe) {
        const date = new Date(meal.date);
        const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[dayIndex];
        
        if (dayName && meal.recipe.title) {
          weeklyPlan[dayName] = meal.recipe.title;
        }
      }
    });

    return weeklyPlan;
  } catch (error) {
    console.error('Load meal plan error:', error);
    return {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null
    };
  }
};

// Delete meal plan
export const deleteMealPlan = async (planId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/planner/${planId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to delete meal plan');
      error.status = response.status;
      
      if (handleApiError(error)) {
        throw error;
      }
      
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Delete meal plan error:', error);
    throw error;
  }
};

