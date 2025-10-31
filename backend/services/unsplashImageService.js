/**
 * Unsplash Image Service - Free, open-source image fetching
 * No API key required for basic usage
 */

const https = require('https');

// Unsplash Source API endpoint (free, no auth required)
const UNSPLASH_SEARCH_URL = 'https://source.unsplash.com/800x600/?';

/**
 * Fetch recipe image from Unsplash using recipe title
 * @param {string} recipeTitle - Recipe title
 * @param {string} cuisine - Recipe cuisine (optional)
 * @returns {Promise<object>} - Image object
 */
const fetchUnsplashRecipeImage = async (recipeTitle, cuisine = '') => {
  try {
    // Clean recipe title for URL
    const cleanTitle = recipeTitle.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    // Build search query
    const searchQuery = cuisine 
      ? `${cleanTitle},${cuisine.toLowerCase()},food` 
      : `${cleanTitle},food,recipe`;
    
    // Unsplash Source API (free, no key needed)
    const imageUrl = `${UNSPLASH_SEARCH_URL}${encodeURIComponent(searchQuery)}`;
    
    return {
      url: imageUrl,
      alt: recipeTitle,
      isPrimary: true,
      source: 'unsplash',
      width: 800,
      height: 600
    };
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    // Fallback to generic food image
    return {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
      alt: recipeTitle,
      isPrimary: true,
      source: 'unsplash-fallback'
    };
  }
};

/**
 * Fetch multiple recipe images (for future use)
 * @param {string} recipeTitle - Recipe title
 * @param {string} cuisine - Recipe cuisine
 * @param {object} options - Options
 * @returns {Promise<Array>} - Array of image objects
 */
const fetchRecipeImages = async (recipeTitle, cuisine = '', options = {}) => {
  try {
    const image = await fetchUnsplashRecipeImage(recipeTitle, cuisine);
    return [image];
  } catch (error) {
    console.error('Error fetching recipe images:', error);
    return [{
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
      alt: recipeTitle,
      isPrimary: true,
      source: 'unsplash-fallback'
    }];
  }
};

module.exports = {
  fetchUnsplashRecipeImage,
  fetchRecipeImages
};

