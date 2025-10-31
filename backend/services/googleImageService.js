/**
 * Google Custom Search API Integration for Recipe Images
 * 
 * This service fetches images from Google Images based on recipe titles
 * using Google's Custom Search API
 */

const https = require('https');

// Google Custom Search API Configuration
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY || '';
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID || '';
const GOOGLE_IMAGES_API_URL = 'https://www.googleapis.com/customsearch/v1';

/**
 * Fetch image from Google Custom Search API based on query
 * @param {string} query - Search query (typically recipe title)
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Image URL and metadata
 */
const fetchGoogleImage = async (query, options = {}) => {
  try {
    // If no API key is configured, return a placeholder
    if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
      console.warn('Google Search API not configured. Using placeholder images.');
      return {
        url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(query)}`,
        alt: query,
        isPrimary: true,
        source: 'placeholder'
      };
    }

    const searchQuery = `${query} recipe food`;
    const params = new URLSearchParams({
      key: GOOGLE_SEARCH_API_KEY,
      cx: GOOGLE_SEARCH_ENGINE_ID,
      q: searchQuery,
      searchType: 'image',
      num: options.limit || 1,
      safe: 'active',
      imgSize: options.size || 'medium',
      imgType: 'photo',
      rights: 'cc_publicdomain,cc_attribute' // Use images that allow reuse
    });

    const url = `${GOOGLE_IMAGES_API_URL}?${params.toString()}`;

    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            
            if (response.error) {
              console.error('Google Search API Error:', response.error);
              reject(new Error(response.error.message));
              return;
            }

            if (response.items && response.items.length > 0) {
              const image = response.items[0];
              resolve({
                url: image.link,
                alt: query,
                isPrimary: true,
                source: 'google',
                width: image.image?.width || 400,
                height: image.image?.height || 300,
                contextUrl: image.image?.contextLink
              });
            } else {
              // No results found, return a placeholder
              resolve({
                url: `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80`,
                alt: query,
                isPrimary: true,
                source: 'unsplash-fallback'
              });
            }
          } catch (error) {
            console.error('Error parsing Google Search API response:', error);
            reject(error);
          }
        });
      }).on('error', (error) => {
        console.error('Google Search API request error:', error);
        reject(error);
      });
    });

  } catch (error) {
    console.error('Error fetching Google image:', error);
    // Return a fallback placeholder image
    return {
      url: `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80`,
      alt: query,
      isPrimary: true,
      source: 'unsplash-fallback'
    };
  }
};

/**
 * Fetch images for recipe based on title and cuisine
 * @param {string} title - Recipe title
 * @param {string} cuisine - Recipe cuisine (optional)
 * @param {object} options - Additional options
 * @returns {Promise<Array>} - Array of image objects
 */
const fetchRecipeImages = async (title, cuisine = '', options = {}) => {
  try {
    // Try to fetch with cuisine for better results
    const query = cuisine ? `${title} ${cuisine}` : title;
    
    const primaryImage = await fetchGoogleImage(query, options);
    
    // Optionally fetch additional images
    if (options.includeSecondary && options.includeSecondary > 0) {
      const params = new URLSearchParams({
        key: GOOGLE_SEARCH_API_KEY,
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: `${query} recipe food`,
        searchType: 'image',
        num: Math.min(options.includeSecondary + 1, 5), // +1 because we already got one
        safe: 'active'
      });

      const url = `${GOOGLE_IMAGES_API_URL}?${params.toString()}`;

      return new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              const response = JSON.parse(data);
              
              if (response.items && response.items.length > 0) {
                const images = [primaryImage, ...response.items.slice(1).map(item => ({
                  url: item.link,
                  alt: title,
                  isPrimary: false,
                  source: 'google',
                  width: item.image?.width || 400,
                  height: item.image?.height || 300
                }))];
                resolve(images);
              } else {
                resolve([primaryImage]);
              }
            } catch (error) {
              resolve([primaryImage]); // Return at least the primary image
            }
          });
        }).on('error', () => {
          resolve([primaryImage]); // Return at least the primary image
        });
      });
    }

    return [primaryImage];
  } catch (error) {
    console.error('Error fetching recipe images:', error);
    return [{
      url: `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80`,
      alt: title,
      isPrimary: true,
      source: 'unsplash-fallback'
    }];
  }
};

/**
 * Update or add images to a recipe in the database
 * @param {string} recipeId - MongoDB recipe ID
 * @param {string} title - Recipe title
 * @param {string} cuisine - Recipe cuisine
 * @param {object} options - Additional options
 * @returns {Promise<object>} - Updated recipe
 */
const updateRecipeWithGoogleImages = async (recipeId, title, cuisine = '', options = {}) => {
  try {
    const Recipe = require('../models/Recipe');
    
    // Fetch Google images
    const images = await fetchRecipeImages(title, cuisine, options);
    
    // Update recipe in database
    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { images },
      { new: true }
    );
    
    return recipe;
  } catch (error) {
    console.error('Error updating recipe with Google images:', error);
    throw error;
  }
};

module.exports = {
  fetchGoogleImage,
  fetchRecipeImages,
  updateRecipeWithGoogleImages
};

