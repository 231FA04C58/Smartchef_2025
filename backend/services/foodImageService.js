/**
 * Free Food Image Service
 * Uses curated Unsplash food images - no API key required
 */

// Curated list of food images with direct Unsplash URLs (all food-related, high quality)
const FOOD_IMAGE_MAPPING = {
  // Indian
  'butter chicken': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'chicken tikka masala': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80',
  'biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d4d0?w=800&h=600&fit=crop&q=80',
  'palak paneer': 'https://images.unsplash.com/photo-1567213819538-ff3e2e06a775?w=800&h=600&fit=crop&q=80',
  'dal makhani': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
  'chana masala': 'https://images.unsplash.com/photo-1572058688129-c9e3b8a2aefd?w=800&h=600&fit=crop&q=80',
  
  // Chinese
  'kung pao chicken': 'https://images.unsplash.com/photo-1582894097876-5b676108fa1b?w=800&h=600&fit=crop&q=80',
  'sweet and sour pork': 'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=800&h=600&fit=crop&q=80',
  'general tso': 'https://images.unsplash.com/photo-1582894097876-5b676108fa1b?w=800&h=600&fit=crop&q=80',
  'fried rice': 'https://images.unsplash.com/photo-1512058688129-c9e3b8a2aefd?w=800&h=600&fit=crop&q=80',
  'dumplings': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80',
  
  // Italian
  'pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'spaghetti': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  'lasagna': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'risotto': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=800&h=600&fit=crop&q=80',
  
  // Mexican
  'tacos': 'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=800&h=600&fit=crop&q=80',
  'enchiladas': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
  'quesadillas': 'https://images.unsplash.com/photo-1565299585323-38174c4aabaa?w=800&h=600&fit=crop&q=80',
  'guacamole': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&q=80',
  
  // Japanese
  'sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80',
  'ramen': 'https://images.unsplash.com/photo-1559314809-0cfa8c5e95bd?w=800&h=600&fit=crop&q=80',
  'teriyaki': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  'tempura': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
  
  // Thai
  'pad thai': 'https://images.unsplash.com/photo-1559314809-0cfa8c5e95bd?w=800&h=600&fit=crop&q=80',
  'green curry': 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&h=600&fit=crop&q=80',
  'tom yum': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  
  // Seafood
  'salmon': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  'shrimp': 'https://images.unsplash.com/photo-1559314809-0cfa8c5e95bd?w=800&h=600&fit=crop&q=80',
  'fish': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=80',
  
  // Soups
  'soup': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  'pho': 'https://images.unsplash.com/photo-1559314809-0cfa8c5e95bd?w=800&h=600&fit=crop&q=80',
  'chowder': 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&h=600&fit=crop&q=80',
  
  // Desserts
  'cake': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80',
  'ice cream': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  'tiramisu': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80',
  
  // Breakfast
  'pancakes': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'waffles': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop&q=80',
  'eggs': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  'toast': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&q=80',
  
  // Vegetarian
  'quinoa': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'vegetable': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
  'salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop&q=80',
  
  // Default food images
  'default': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
  'food': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
  'cooking': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'
};

/**
 * Get image URL for a recipe based on its title and cuisine
 * Now returns direct Unsplash URLs (not IDs)
 */
const getImageUrlForRecipe = (title, cuisine = '') => {
  const titleLower = title.toLowerCase();
  
  // First, try exact match in mapping
  for (const [key, imageUrl] of Object.entries(FOOD_IMAGE_MAPPING)) {
    if (titleLower.includes(key)) {
      return imageUrl; // Already a complete URL
    }
  }
  
  // Try cuisine-based images
  const cuisineLower = cuisine.toLowerCase();
  if (cuisineLower.includes('indian')) {
    return FOOD_IMAGE_MAPPING['biryani'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (cuisineLower.includes('chinese')) {
    return FOOD_IMAGE_MAPPING['fried rice'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (cuisineLower.includes('italian')) {
    return FOOD_IMAGE_MAPPING['pizza'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (cuisineLower.includes('mexican')) {
    return FOOD_IMAGE_MAPPING['tacos'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (cuisineLower.includes('japanese')) {
    return FOOD_IMAGE_MAPPING['sushi'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (cuisineLower.includes('thai')) {
    return FOOD_IMAGE_MAPPING['pad thai'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (cuisineLower.includes('seafood') || titleLower.includes('fish') || titleLower.includes('shrimp') || titleLower.includes('salmon')) {
    return FOOD_IMAGE_MAPPING['salmon'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (titleLower.includes('soup')) {
    return FOOD_IMAGE_MAPPING['soup'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (titleLower.includes('dessert') || titleLower.includes('cake') || titleLower.includes('cookie')) {
    return FOOD_IMAGE_MAPPING['cake'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (titleLower.includes('breakfast') || titleLower.includes('pancake') || titleLower.includes('waffle')) {
    return FOOD_IMAGE_MAPPING['pancakes'] || FOOD_IMAGE_MAPPING['default'];
  }
  if (titleLower.includes('vegetable') || titleLower.includes('veggie')) {
    return FOOD_IMAGE_MAPPING['vegetable'] || FOOD_IMAGE_MAPPING['default'];
  }
  
  // Default food image
  return FOOD_IMAGE_MAPPING['default'];
};

/**
 * Fetch recipe images using Unsplash direct URLs
 * @param {string} recipeTitle - Recipe title
 * @param {string} cuisine - Recipe cuisine
 * @param {object} options - Options
 * @returns {Promise<Array>} - Array of image objects
 */
const fetchRecipeImages = async (recipeTitle, cuisine = '', options = {}) => {
  try {
    const imageUrl = getImageUrlForRecipe(recipeTitle, cuisine); // Already a complete URL
    
    return [{
      url: imageUrl,
      alt: recipeTitle,
      isPrimary: true,
      source: 'unsplash',
      width: 800,
      height: 600
    }];
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
  fetchRecipeImages,
  getImageUrlForRecipe
};

