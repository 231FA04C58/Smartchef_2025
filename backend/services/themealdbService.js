/**
 * TheMealDB API Service
 * Fetches real recipes from TheMealDB (free, no API key needed)
 * API Docs: https://www.themealdb.com/api.php
 */

const https = require('https');
const http = require('http');

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Make HTTP request to TheMealDB API
 */
const makeRequest = (endpoint) => {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

/**
 * Fetch random recipes
 */
const getRandomRecipes = async (count = 10) => {
  try {
    const recipes = [];
    for (let i = 0; i < count; i++) {
      const response = await makeRequest('/random.php');
      if (response.meals && response.meals[0]) {
        recipes.push(response.meals[0]);
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    return recipes;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
};

/**
 * Search recipes by name
 */
const searchRecipes = async (query) => {
  try {
    const response = await makeRequest(`/search.php?s=${encodeURIComponent(query)}`);
    return response.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

/**
 * Get recipes by cuisine/area
 */
const getRecipesByArea = async (area) => {
  try {
    const response = await makeRequest(`/filter.php?a=${encodeURIComponent(area)}`);
    return response.meals || [];
  } catch (error) {
    console.error('Error fetching recipes by area:', error);
    throw error;
  }
};

/**
 * Get full recipe details by ID
 */
const getRecipeById = async (id) => {
  try {
    const response = await makeRequest(`/lookup.php?i=${id}`);
    if (response.meals && response.meals.length > 0) {
      return response.meals[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
};

/**
 * Get recipes by category
 */
const getRecipesByCategory = async (category) => {
  try {
    const response = await makeRequest(`/filter.php?c=${encodeURIComponent(category)}`);
    return response.meals || [];
  } catch (error) {
    console.error('Error fetching recipes by category:', error);
    throw error;
  }
};

/**
 * Get all available areas (cuisines)
 */
const getAvailableAreas = async () => {
  try {
    const response = await makeRequest('/list.php?a=list');
    return response.meals || [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

/**
 * Get all available categories
 */
const getAvailableCategories = async () => {
  try {
    const response = await makeRequest('/list.php?c=list');
    return response.meals || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Convert TheMealDB recipe to our Recipe schema format
 */
const convertToRecipeSchema = (mealDbRecipe, userId = null) => {
  // Extract ingredients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = mealDbRecipe[`strIngredient${i}`];
    const measure = mealDbRecipe[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      const measureText = measure ? measure.trim() : '';
      // Ensure amount is always provided (required by schema)
      ingredients.push({
        name: ingredient.trim(),
        amount: measureText || '1', // Default to '1' if no measure
        unit: measureText || ''
      });
    }
  }
  
  // Extract instructions - split by newlines, periods, or numbered steps
  let instructions = [];
  if (mealDbRecipe.strInstructions) {
    // Split by double newlines, numbered steps, or periods followed by capital letters
    let text = mealDbRecipe.strInstructions;
    
    // Replace common step markers
    text = text.replace(/(STEP\s*\d+\s*[-:]\s*)/gi, '\n');
    text = text.replace(/(\d+\.\s*)/g, '\n');
    text = text.replace(/(DIRECTIONS?:)/gi, '\n');
    
    // Split by newlines first
    instructions = text
      .split(/\n+/)
      .map(step => step.trim())
      .filter(step => step.length > 10) // Filter out very short fragments
      .slice(0, 20); // Limit to 20 steps
    
    // If no good splits found, try splitting by periods
    if (instructions.length <= 1) {
      instructions = text
        .split(/\.\s+(?=[A-Z])/) // Split by period followed by capital letter
        .map(step => step.trim().replace(/\.$/, '') + '.') // Add period back
        .filter(step => step.length > 10)
        .slice(0, 15);
    }
    
    // If still no good splits, create one instruction
    if (instructions.length === 0) {
      instructions = [mealDbRecipe.strInstructions.trim()];
    }
  }
  
  // Ensure instructions is an array of strings
  if (!Array.isArray(instructions) || instructions.length === 0) {
    instructions = [`${mealDbRecipe.strMeal} preparation instructions`];
  }
  
  // Convert instructions array to schema format [{step: number, instruction: string}]
  const formattedInstructions = instructions.map((instruction, index) => ({
    step: index + 1,
    instruction: instruction,
    duration: 0
  }));
  
  // Map TheMealDB category to our schema categories
  const categoryMap = {
    'Beef': 'main-course',
    'Chicken': 'main-course',
    'Dessert': 'dessert',
    'Lamb': 'main-course',
    'Miscellaneous': 'main-course',
    'Pasta': 'main-course',
    'Pork': 'main-course',
    'Seafood': 'main-course',
    'Side': 'appetizer',
    'Starter': 'appetizer',
    'Vegetarian': 'main-course',
    'Breakfast': 'breakfast',
    'Goat': 'main-course'
  };
  
  const category = categoryMap[mealDbRecipe.strCategory] || 'main-course';
  
  // Map area to cuisine
  const cuisineMap = {
    'American': 'American',
    'British': 'British',
    'Canadian': 'Canadian',
    'Chinese': 'Chinese',
    'Croatian': 'Croatian',
    'Dutch': 'Dutch',
    'Egyptian': 'Egyptian',
    'Filipino': 'Filipino',
    'French': 'French',
    'Greek': 'Greek',
    'Indian': 'Indian',
    'Irish': 'Irish',
    'Italian': 'Italian',
    'Jamaican': 'Jamaican',
    'Japanese': 'Japanese',
    'Kenyan': 'Kenyan',
    'Malaysian': 'Malaysian',
    'Mexican': 'Mexican',
    'Moroccan': 'Moroccan',
    'Polish': 'Polish',
    'Portuguese': 'Portuguese',
    'Russian': 'Russian',
    'Spanish': 'Spanish',
    'Thai': 'Thai',
    'Tunisian': 'Tunisian',
    'Turkish': 'Turkish',
    'Unknown': 'International',
    'Vietnamese': 'Vietnamese'
  };
  
  const cuisine = cuisineMap[mealDbRecipe.strArea] || mealDbRecipe.strArea || 'International';
  
  // Estimate difficulty based on ingredients and instructions
  let difficulty = 'easy';
  if (ingredients.length > 10 || instructions.length > 8) {
    difficulty = 'hard';
  } else if (ingredients.length > 6 || instructions.length > 5) {
    difficulty = 'medium';
  }
  
  // Estimate prep and cook times (TheMealDB doesn't provide these)
  const prepTime = Math.max(10, Math.floor(ingredients.length * 2));
  const cookTime = Math.max(15, Math.floor(instructions.length * 5));
  
  return {
    title: mealDbRecipe.strMeal,
    description: `${mealDbRecipe.strMeal} - A delicious ${cuisine.toLowerCase()} ${mealDbRecipe.strCategory?.toLowerCase() || 'dish'}`,
    ingredients: ingredients,
    instructions: formattedInstructions,
    prepTime: prepTime,
    cookTime: cookTime,
    servings: 4, // Default, TheMealDB doesn't provide this
    difficulty: difficulty,
    cuisine: cuisine,
    category: category,
    tags: [mealDbRecipe.strCategory, cuisine].filter(Boolean),
    dietaryInfo: {
      vegetarian: ingredients.every(ing => 
        !['chicken', 'beef', 'pork', 'fish', 'meat', 'lamb', 'turkey', 'bacon', 'sausage'].some(meat => 
          ing.name.toLowerCase().includes(meat)
        )
      ),
      vegan: false, // Would need more complex check
      glutenFree: !ingredients.some(ing => 
        ['flour', 'wheat', 'bread', 'pasta'].some(gluten => ing.name.toLowerCase().includes(gluten))
      )
    },
    images: [{
      url: mealDbRecipe.strMealThumb || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
      alt: mealDbRecipe.strMeal,
      isPrimary: true,
      source: 'themealdb'
    }],
    author: userId,
    isPublic: true,
    rating: { average: 0, count: 0 },
    viewCount: 0,
    youtubeUrl: mealDbRecipe.strYoutube || null,
    sourceUrl: mealDbRecipe.strSource || null
  };
};

module.exports = {
  getRandomRecipes,
  searchRecipes,
  getRecipesByArea,
  getRecipesByCategory,
  getAvailableAreas,
  getAvailableCategories,
  getRecipeById,
  convertToRecipeSchema
};

