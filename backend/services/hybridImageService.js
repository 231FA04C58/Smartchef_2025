/**
 * Hybrid Image Service
 * Tries Spoonacular first, falls back to enhanced image service
 * Best of both worlds: accurate Spoonacular images when available,
 * smart Unsplash matching when not
 */

const { getRecipeImage } = require('./enhancedRecipeImageService');
const https = require('https');

const API_BASE_URL = 'https://api.spoonacular.com/recipes';

/**
 * Search for a recipe in Spoonacular and get its image
 */
const getSpoonacularImage = async (recipeTitle) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    
    if (!apiKey) {
      return null;
    }
    
    // Search for the recipe
    const query = recipeTitle.replace(/[^\w\s]/g, '').trim();
    const url = `${API_BASE_URL}/complexSearch?query=${encodeURIComponent(query)}&number=1&addRecipeInformation=false&apiKey=${apiKey}`;
    
    const data = await new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let body = '';
        
        // If rate limit or other error, return null to fall back
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }
        
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve(null);
          }
        });
      }).on('error', () => resolve(null));
    });
    
    if (data && data.results && data.results.length > 0 && data.results[0].image) {
      return data.results[0].image;
    }
    
    return null;
  } catch (error) {
    // Silently fail and use fallback
    return null;
  }
};

/**
 * Get recipe images - tries Spoonacular first, falls back to enhanced service
 */
const fetchRecipeImages = async (recipeTitle, cuisine = '', options = {}) => {
  try {
    // Try Spoonacular first (if API key is available)
    const spoonacularImage = await getSpoonacularImage(recipeTitle);
    
    if (spoonacularImage) {
      return [{
        url: spoonacularImage,
        alt: recipeTitle,
        isPrimary: true,
        source: 'spoonacular',
        width: 800,
        height: 600
      }];
    }
    
    // Fallback to enhanced image service
    const imageUrl = getRecipeImage(recipeTitle, cuisine);
    
    return [{
      url: imageUrl,
      alt: recipeTitle,
      isPrimary: true,
      source: 'unsplash-enhanced',
      width: 800,
      height: 600
    }];
  } catch (error) {
    console.error('Error fetching recipe images:', error);
    // Ultimate fallback
    return [{
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
      alt: recipeTitle,
      isPrimary: true,
      source: 'unsplash-fallback'
    }];
  }
};

module.exports = {
  fetchRecipeImages,
  getSpoonacularImage
};

