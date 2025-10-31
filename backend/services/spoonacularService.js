/**
 * Spoonacular API Service
 * Fetches recipes with accurate images and full recipe data
 * Free tier: 150 requests/day
 */

const https = require('https');

const API_BASE_URL = 'https://api.spoonacular.com/recipes';

/**
 * Make a request to Spoonacular API
 */
const makeRequest = async (endpoint, params = {}) => {
  try {
    // Use provided API key or env variable
    const apiKey = process.env.SPOONACULAR_API_KEY || '64c2bd730b08413a89cf5d66bdc670d1';
    
    if (!apiKey) {
      throw new Error('SPOONACULAR_API_KEY is not set');
    }
    
    const queryParams = new URLSearchParams({
      ...params,
      apiKey: apiKey
    });
    
    const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;
    
    return await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let body = '';
        
        if (res.statusCode !== 200) {
          let errorBody = '';
          res.on('data', chunk => errorBody += chunk);
          res.on('end', () => {
            try {
              const error = JSON.parse(errorBody);
              reject(new Error(error.message || `API request failed: ${res.statusCode} ${res.statusMessage}`));
            } catch (e) {
              reject(new Error(`API request failed: ${res.statusCode} ${res.statusMessage}`));
            }
          });
          return;
        }
        
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        });
      }).on('error', reject);
    });
  } catch (error) {
    console.error('Spoonacular API Error:', error);
    throw error;
  }
};

/**
 * Search recipes by query
 */
const searchRecipes = async (query, options = {}) => {
  try {
    const {
      number = 10,
      addRecipeInformation = true,
      addRecipeNutrition = false,
      cuisine = '',
      type = '',
      diet = '',
      intolerances = ''
    } = options;
    
    const params = {
      query: query,
      number: number,
      addRecipeInformation: addRecipeInformation.toString(),
      addRecipeNutrition: addRecipeNutrition.toString()
    };
    
    if (cuisine) params.cuisine = cuisine;
    if (type) params.type = type;
    if (diet) params.diet = diet;
    if (intolerances) params.intolerances = intolerances;
    
    const data = await makeRequest('/complexSearch', params);
    return data.results || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

/**
 * Get recipe by ID (full details)
 */
const getRecipeById = async (id) => {
  try {
    const params = {
      includeNutrition: 'false'
    };
    
    return await makeRequest(`/${id}/information`, params);
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
};

/**
 * Get random recipes
 */
const getRandomRecipes = async (number = 10, tags = '') => {
  try {
    const params = {
      number: number
    };
    
    if (tags) params.tags = tags;
    
    const data = await makeRequest('/random', params);
    return data.recipes || [];
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
};

/**
 * Get recipes by cuisine
 */
const getRecipesByCuisine = async (cuisine, number = 10) => {
  try {
    return await searchRecipes('', {
      number,
      cuisine: cuisine.toLowerCase(),
      addRecipeInformation: true
    });
  } catch (error) {
    console.error('Error fetching recipes by cuisine:', error);
    throw error;
  }
};

/**
 * Convert Spoonacular recipe to our Recipe schema
 */
const convertToRecipeSchema = (spoonRecipe, authorId = null) => {
  // Parse ingredients
  const ingredients = [];
  if (spoonRecipe.extendedIngredients && Array.isArray(spoonRecipe.extendedIngredients)) {
    spoonRecipe.extendedIngredients.forEach(ing => {
      ingredients.push({
        name: ing.name || ing.originalName || 'Unknown',
        amount: ing.amount ? ing.amount.toString() : '1',
        unit: ing.unit || ''
      });
    });
  }
  
  // Parse instructions
  const instructions = [];
  if (spoonRecipe.analyzedInstructions && spoonRecipe.analyzedInstructions.length > 0) {
    const steps = spoonRecipe.analyzedInstructions[0].steps || [];
    instructions.push(...steps.map((step, index) => ({
      step: index + 1,
      instruction: step.step || '',
      duration: 0
    })));
  } else if (spoonRecipe.instructions) {
    // Fallback to plain text instructions
    const steps = spoonRecipe.instructions
      .split(/\n+|\.\s+(?=[A-Z])/)
      .filter(s => s.trim().length > 10)
      .slice(0, 20);
    
    instructions.push(...steps.map((step, index) => ({
      step: index + 1,
      instruction: step.trim(),
      duration: 0
    })));
  }
  
  // Map cuisines
  const cuisineMap = {
    'indian': 'Indian',
    'italian': 'Italian',
    'chinese': 'Chinese',
    'mexican': 'Mexican',
    'japanese': 'Japanese',
    'thai': 'Thai',
    'french': 'French',
    'greek': 'Greek',
    'mediterranean': 'Mediterranean',
    'american': 'American',
    'british': 'British'
  };
  
  let cuisine = 'International';
  if (spoonRecipe.cuisines && spoonRecipe.cuisines.length > 0) {
    const firstCuisine = spoonRecipe.cuisines[0].toLowerCase();
    cuisine = cuisineMap[firstCuisine] || spoonRecipe.cuisines[0];
  }
  
  // Map dish types
  const categoryMap = {
    'main course': 'main-course',
    'main dish': 'main-course',
    'side dish': 'appetizer',
    'dessert': 'dessert',
    'appetizer': 'appetizer',
    'breakfast': 'breakfast',
    'lunch': 'lunch',
    'dinner': 'dinner',
    'snack': 'snack',
    'beverage': 'beverage'
  };
  
  let category = 'main-course';
  if (spoonRecipe.dishTypes && spoonRecipe.dishTypes.length > 0) {
    const firstType = spoonRecipe.dishTypes[0].toLowerCase();
    category = categoryMap[firstType] || 'main-course';
  }
  
  // Determine difficulty
  let difficulty = 'easy';
  const prepTime = spoonRecipe.preparationMinutes || 0;
  const cookTime = spoonRecipe.cookingMinutes || 0;
  const totalTime = prepTime + cookTime;
  
  if (totalTime > 60) {
    difficulty = 'hard';
  } else if (totalTime > 30) {
    difficulty = 'medium';
  }
  
  // Dietary info
  const dietaryInfo = {
    vegetarian: spoonRecipe.vegetarian || false,
    vegan: spoonRecipe.vegan || false,
    glutenFree: spoonRecipe.glutenFree || false,
    dairyFree: spoonRecipe.dairyFree || false,
    nutFree: false, // Spoonacular doesn't provide this directly
    keto: false,
    paleo: false,
    halal: false,
    kosher: false
  };
  
  // Check for nuts
  if (ingredients.some(ing => {
    const name = ing.name.toLowerCase();
    return name.includes('nut') || name.includes('almond') || name.includes('peanut');
  })) {
    dietaryInfo.nutFree = false;
  }
  
  // Nutrition
  const nutrition = {
    calories: Math.round(spoonRecipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 
                         spoonRecipe.weightWatcherSmartPoints ? spoonRecipe.weightWatcherSmartPoints * 50 : 300),
    protein: Math.round(spoonRecipe.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 20),
    carbs: Math.round(spoonRecipe.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 40),
    fat: Math.round(spoonRecipe.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 10),
    fiber: Math.round(spoonRecipe.nutrition?.nutrients?.find(n => n.name === 'Fiber')?.amount || 5),
    sugar: Math.round(spoonRecipe.nutrition?.nutrients?.find(n => n.name === 'Sugar')?.amount || 10),
    sodium: Math.round(spoonRecipe.nutrition?.nutrients?.find(n => n.name === 'Sodium')?.amount || 500)
  };
  
  // Images - Spoonacular provides direct image URLs
  const images = [];
  if (spoonRecipe.image) {
    images.push({
      url: spoonRecipe.image,
      alt: spoonRecipe.title,
      isPrimary: true,
      source: 'spoonacular',
      width: 800,
      height: 600
    });
  }
  
  return {
    title: spoonRecipe.title,
    description: spoonRecipe.summary ? 
      spoonRecipe.summary.replace(/<[^>]*>/g, '').substring(0, 500) : 
      `${spoonRecipe.title} - A delicious ${cuisine.toLowerCase()} dish`,
    ingredients: ingredients.length > 0 ? ingredients : [
      { name: 'Ingredients not available', amount: '1', unit: '' }
    ],
    instructions: instructions.length > 0 ? instructions : [
      { step: 1, instruction: 'Follow the recipe instructions.', duration: 0 }
    ],
    prepTime: prepTime || 15,
    cookTime: cookTime || 30,
    servings: spoonRecipe.servings || 4,
    difficulty: difficulty,
    cuisine: cuisine,
    category: category,
    tags: [...(spoonRecipe.cuisines || []), ...(spoonRecipe.dishTypes || []), ...(spoonRecipe.diets || [])],
    dietaryInfo: dietaryInfo,
    nutrition: nutrition,
    images: images,
    author: authorId,
    isPublic: true,
    sourceUrl: spoonRecipe.sourceUrl || null,
    spoonacularId: spoonRecipe.id ? spoonRecipe.id.toString() : null
  };
};

module.exports = {
  searchRecipes,
  getRecipeById,
  getRandomRecipes,
  getRecipesByCuisine,
  convertToRecipeSchema,
  makeRequest
};

