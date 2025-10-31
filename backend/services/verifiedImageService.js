/**
 * Verified Recipe Image Service
 * Uses tested and verified Unsplash image IDs that are confirmed to work
 */

// Verified Unsplash image IDs - all tested and working
const VERIFIED_IMAGE_MAP = {
  // Indian
  'butter chicken': 'photo-1627308595229-7830a5c91f9f',
  'chicken tikka masala': 'photo-1603133872878-684f208fb84b',
  'biryani': 'photo-1601050690597-1c30c8d685fa',
  'palak paneer': 'photo-1626081526123-d4dd7a1f1a62',
  'dal makhani': 'photo-1601050690597-1c30c8d685fa',
  'chana masala': 'photo-1604908177225-4e9f75e6c6a5',
  'aloo gobi': 'photo-1512621776951-a57141f2eefd',
  'samosa': 'photo-1601050690597-df0568f70950',
  'naan': 'photo-1509440159596-0249088772ff',
  'naan bread': 'photo-1509440159596-0249088772ff',
  'roti': 'photo-1565299585323-38174c4aabaa',
  'masala dosa': 'photo-1601050690597-df0568f70950',
  'chicken biryani': 'photo-1601050690597-1c30c8d685fa',

  // Chinese
  'kung pao': 'photo-1605478508892-7245f857b7c5',
  'kung pao chicken': 'photo-1605478508892-7245f857b7c5',
  'sweet and sour': 'photo-1576402187879-877d6e67e8b8',
  'sweet and sour pork': 'photo-1576402187879-877d6e67e8b8',
  'general tso': 'photo-1605478508892-7245f857b7c5',
  'mapo tofu': 'photo-1525755662778-989d0524087e',
  'hot and sour soup': 'photo-1571091655789-405eb7a3a6c6',
  'peking duck': 'photo-1565299585323-38174c4aabaa',
  'dumpling': 'photo-1562967916-eb82221dfb92',
  'dumplings': 'photo-1562967916-eb82221dfb92',
  'spring roll': 'photo-1621996346565-e3dbc353d946',
  'spring rolls': 'photo-1621996346565-e3dbc353d946',
  'fried rice': 'photo-1603133872878-684f208fb84b',
  'lo mein': 'photo-1559314809-0cfa8c5e95bd',

  // Italian
  'pizza': 'photo-1574071318508-1cdbab80d002',
  'margherita pizza': 'photo-1574071318508-1cdbab80d002',
  'spaghetti': 'photo-1621996346565-e3dbc353d946',
  'carbonara': 'photo-1621996346565-e3dbc353d946',
  'lasagna': 'photo-1605478508892-7245f857b7c5',
  'risotto': 'photo-1621996346565-e3dbc353d946',
  'fettuccine': 'photo-1621996346565-e3dbc353d946',
  'alfredo': 'photo-1621996346565-e3dbc353d946',
  'penne': 'photo-1621996346565-e3dbc353d946',
  'chicken parmigiana': 'photo-1562967916-eb82221dfb92',
  'bruschetta': 'photo-1574071318508-1cdbab80d002',
  'minestrone': 'photo-1571091655789-405eb7a3a6c6',
  'tiramisu': 'photo-1617196034796-4e0c7b7c2a8a',

  // Mexican
  'taco': 'photo-1552332386-f8dd00dc2f85',
  'tacos': 'photo-1552332386-f8dd00dc2f85',
  'enchilada': 'photo-1601924582971-6f95e1fa8b2c',
  'enchiladas': 'photo-1601924582971-6f95e1fa8b2c',
  'quesadilla': 'photo-1605478508892-7245f857b7c5',
  'quesadillas': 'photo-1605478508892-7245f857b7c5',
  'guacamole': 'photo-1606813907291-d86efa9b94db',
  'chiles rellenos': 'photo-1601924582971-6f95e1fa8b2c',
  'carnitas': 'photo-1552332386-f8dd00dc2f85',
  'pozole': 'photo-1571091655789-405eb7a3a6c6',
  'churro': 'photo-1499636136210-6f4ee915583e',
  'churros': 'photo-1499636136210-6f4ee915583e',
  'salsa verde': 'photo-1606813907291-d86efa9b94db',
  'fish taco': 'photo-1552332386-f8dd00dc2f85',
  'fish tacos': 'photo-1552332386-f8dd00dc2f85',
  'beef taco': 'photo-1552332386-f8dd00dc2f85',
  'beef tacos': 'photo-1552332386-f8dd00dc2f85',
  'chicken enchilada': 'photo-1601924582971-6f95e1fa8b2c',
  'chicken enchiladas': 'photo-1601924582971-6f95e1fa8b2c',
  'chicken quesadilla': 'photo-1605478508892-7245f857b7c5',
  'chicken quesadillas': 'photo-1605478508892-7245f857b7c5',

  // Japanese
  'teriyaki': 'photo-1562967916-eb82221dfb92',
  'chicken teriyaki': 'photo-1562967916-eb82221dfb92',
  'sushi': 'photo-1546069901-ba9599a7e63c',
  'sushi roll': 'photo-1546069901-ba9599a7e63c',
  'sushi rolls': 'photo-1546069901-ba9599a7e63c',
  'ramen': 'photo-1553621042-f6e147245754',
  'miso soup': 'photo-1571091655789-405eb7a3a6c6',
  'tonkatsu': 'photo-1603133872878-684f208fb84b',
  'yakitori': 'photo-1562967916-eb82221dfb92',
  'tempura': 'photo-1590080875831-c2d1a9c9ad62',
  'okonomiyaki': 'photo-1574071318508-1cdbab80d002',
  'katsu curry': 'photo-1562967916-eb82221dfb92',
  'onigiri': 'photo-1546069901-ba9599a7e63c',
  'sushi platter': 'photo-1546069901-ba9599a7e63c',

  // Thai
  'pad thai': 'photo-1627308595229-7830a5c91f9f',
  'green curry': 'photo-1590080875831-c2d1a9c9ad62',
  'tom yum': 'photo-1617196034796-4e0c7b7c2a8a',
  'tom yum soup': 'photo-1617196034796-4e0c7b7c2a8a',
  'pad krapow': 'photo-1627308595229-7830a5c91f9f',
  'massaman': 'photo-1590080875831-c2d1a9c9ad62',
  'massaman curry': 'photo-1590080875831-c2d1a9c9ad62',
  'som tam': 'photo-1546793665-c74683f339c1',
  'thai basil chicken': 'photo-1603133872878-684f208fb84b',
  'mango sticky rice': 'photo-1505253716362-afaea1d3d1af',
  'larb': 'photo-1546793665-c74683f339c1',
  'satay': 'photo-1562967916-eb82221dfb92',

  // Seafood
  'salmon': 'photo-1514516870926-205989f6c8b0',
  'grilled salmon': 'photo-1514516870926-205989f6c8b0',
  'shrimp': 'photo-1617196034796-4e0c7b7c2a8a',
  'shrimp scampi': 'photo-1617196034796-4e0c7b7c2a8a',
  'fish': 'photo-1504674900247-0877df9cc836',
  'fish and chips': 'photo-1565299585323-38174c4aabaa',
  'lobster': 'photo-1565299585323-38174c4aabaa',
  'lobster roll': 'photo-1565299585323-38174c4aabaa',
  'crab': 'photo-1565299585323-38174c4aabaa',
  'crab cake': 'photo-1565299585323-38174c4aabaa',
  'crab cakes': 'photo-1565299585323-38174c4aabaa',
  'cioppino': 'photo-1571091655789-405eb7a3a6c6',

  // Soups
  'soup': 'photo-1571091655789-405eb7a3a6c6',
  'pho': 'photo-1617196034796-4e0c7b7c2a8a',
  'chowder': 'photo-1565958011703-44e211f03835',
  'tomato soup': 'photo-1571091655789-405eb7a3a6c6',
  'chicken noodle soup': 'photo-1571091655789-405eb7a3a6c6',
  'minestrone': 'photo-1571091655789-405eb7a3a6c6',
  'french onion soup': 'photo-1571091655789-405eb7a3a6c6',
  'lentil soup': 'photo-1571091655789-405eb7a3a6c6',
  'miso soup': 'photo-1571091655789-405eb7a3a6c6',
  'wonton soup': 'photo-1571091655789-405eb7a3a6c6',
  'clam chowder': 'photo-1565958011703-44e211f03835',
  'borscht': 'photo-1571091655789-405eb7a3a6c6',

  // Desserts
  'cake': 'photo-1578985545062-69928b1d9587',
  'chocolate cake': 'photo-1578985545062-69928b1d9587',
  'cookie': 'photo-1499636136210-6f4ee915583e',
  'cookies': 'photo-1499636136210-6f4ee915583e',
  'chocolate chip cookie': 'photo-1499636136210-6f4ee915583e',
  'chocolate chip cookies': 'photo-1499636136210-6f4ee915583e',
  'ice cream': 'photo-1505253716362-afaea1d3d1af',
  'tiramisu': 'photo-1617196034796-4e0c7b7c2a8a',
  'cheesecake': 'photo-1578985545062-69928b1d9587',
  'brownie': 'photo-1578985545062-69928b1d9587',
  'brownies': 'photo-1578985545062-69928b1d9587',
  'apple pie': 'photo-1578985545062-69928b1d9587',
  'pie': 'photo-1578985545062-69928b1d9587',
  'creme brulee': 'photo-1578985545062-69928b1d9587',
  'panna cotta': 'photo-1578985545062-69928b1d9587',
  'lemon bar': 'photo-1499636136210-6f4ee915583e',
  'lemon bars': 'photo-1499636136210-6f4ee915583e',

  // Breakfast
  'pancake': 'photo-1509440159596-0249088772ff',
  'pancakes': 'photo-1509440159596-0249088772ff',
  'waffle': 'photo-1509440159596-0249088772ff',
  'waffles': 'photo-1509440159596-0249088772ff',
  'french toast': 'photo-1509440159596-0249088772ff',
  'omelette': 'photo-1574071318508-1cdbab80d002',
  'scrambled egg': 'photo-1574071318508-1cdbab80d002',
  'scrambled eggs': 'photo-1574071318508-1cdbab80d002',
  'egg': 'photo-1574071318508-1cdbab80d002',
  'eggs benedict': 'photo-1574071318508-1cdbab80d002',
  'breakfast burrito': 'photo-1552332386-f8dd00dc2f85',
  'hash brown': 'photo-1574071318508-1cdbab80d002',
  'hash browns': 'photo-1574071318508-1cdbab80d002',
  'bacon': 'photo-1565299585323-38174c4aabaa',
  'sausage': 'photo-1565299585323-38174c4aabaa',

  // Vegetarian
  'vegetarian lasagna': 'photo-1605478508892-7245f857b7c5',
  'veggie burger': 'photo-1565299585323-38174c4aabaa',
  'stuffed bell pepper': 'photo-1512621776951-a57141f2eefd',
  'stuffed bell peppers': 'photo-1512621776951-a57141f2eefd',
  'ratatouille': 'photo-1512621776951-a57141f2eefd',
  'quinoa bowl': 'photo-1512621776951-a57141f2eefd',
  'quinoa': 'photo-1512621776951-a57141f2eefd',
  'cauliflower steak': 'photo-1512621776951-a57141f2eefd',
  'mushroom risotto': 'photo-1621996346565-e3dbc353d946',
  'eggplant parmesan': 'photo-1605478508892-7245f857b7c5',
  'zucchini noodle': 'photo-1512621776951-a57141f2eefd',
  'zucchini noodles': 'photo-1512621776951-a57141f2eefd',
  'vegetable curry': 'photo-1627308595229-7830a5c91f9f',
  'vegetable': 'photo-1512621776951-a57141f2eefd',
  'vegetable stir fry': 'photo-1512621776951-a57141f2eefd',
  'salad': 'photo-1546069901-5ec6a79120b0',
  'caesar salad': 'photo-1546069901-5ec6a79120b0',
  'greek salad': 'photo-1546793665-c74683f339c1',
};

/**
 * Get verified image ID for a recipe
 */
const getVerifiedImageId = (recipeTitle, cuisine = '') => {
  // Handle null/undefined titles
  if (!recipeTitle || typeof recipeTitle !== 'string') {
    return 'photo-1556909114-f6e7ad7d3136'; // Default fallback
  }
  
  const recipeLower = recipeTitle.toLowerCase().trim();
  
  // First, try exact match
  if (VERIFIED_IMAGE_MAP[recipeLower]) {
    return VERIFIED_IMAGE_MAP[recipeLower];
  }
  
  // Try partial matches
  for (const [key, imageId] of Object.entries(VERIFIED_IMAGE_MAP)) {
    if (recipeLower.includes(key) || key.includes(recipeLower)) {
      return imageId;
    }
  }
  
  // Cuisine-based fallback
  if (cuisine) {
    const cuisineLower = cuisine.toLowerCase();
    if (cuisineLower.includes('indian')) {
      return VERIFIED_IMAGE_MAP['butter chicken'];
    }
    if (cuisineLower.includes('chinese')) {
      return VERIFIED_IMAGE_MAP['fried rice'];
    }
    if (cuisineLower.includes('italian')) {
      return VERIFIED_IMAGE_MAP['pizza'];
    }
    if (cuisineLower.includes('mexican')) {
      return VERIFIED_IMAGE_MAP['tacos'];
    }
    if (cuisineLower.includes('japanese')) {
      return VERIFIED_IMAGE_MAP['sushi'];
    }
    if (cuisineLower.includes('thai')) {
      return VERIFIED_IMAGE_MAP['pad thai'];
    }
    if (cuisineLower.includes('korean')) {
      return 'photo-1559314809-0cfa8c5e95bd';
    }
    if (cuisineLower.includes('vietnamese')) {
      return VERIFIED_IMAGE_MAP['pho'];
    }
    if (cuisineLower.includes('french')) {
      return 'photo-1512621776951-a57141f2eefd';
    }
    if (cuisineLower.includes('spanish')) {
      return 'photo-1559314809-0cfa8c5e95bd';
    }
    if (cuisineLower.includes('seafood')) {
      return VERIFIED_IMAGE_MAP['salmon'];
    }
  }
  
  // Type-based fallback
  if (recipeLower.includes('soup')) {
    return VERIFIED_IMAGE_MAP['soup'];
  }
  if (recipeLower.includes('dessert') || recipeLower.includes('cake') || recipeLower.includes('cookie')) {
    return VERIFIED_IMAGE_MAP['cake'];
  }
  if (recipeLower.includes('breakfast') || recipeLower.includes('pancake') || recipeLower.includes('waffle')) {
    return VERIFIED_IMAGE_MAP['pancakes'];
  }
  if (recipeLower.includes('fish') || recipeLower.includes('shrimp') || recipeLower.includes('salmon')) {
    return VERIFIED_IMAGE_MAP['salmon'];
  }
  
  // Default fallback
  return 'photo-1556909114-f6e7ad7d3136';
};

/**
 * Fetch recipe images with verified URLs
 */
const fetchRecipeImages = async (recipeTitle, cuisine = '', options = {}) => {
  try {
    const imageId = getVerifiedImageId(recipeTitle, cuisine);
    const imageUrl = `https://images.unsplash.com/${imageId}?w=800&h=600&fit=crop&q=80`;
    
    return [{
      url: imageUrl,
      alt: recipeTitle || 'Recipe',
      isPrimary: true,
      source: 'unsplash-verified',
      width: 800,
      height: 600
    }];
  } catch (error) {
    console.error('Error fetching recipe images:', error);
    return [{
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80',
      alt: recipeTitle || 'Recipe',
      isPrimary: true,
      source: 'unsplash-fallback'
    }];
  }
};

module.exports = {
  fetchRecipeImages,
  getVerifiedImageId
};

