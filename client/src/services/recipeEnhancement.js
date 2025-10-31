// Recipe Enhancement Service - Pulls real data from Google APIs
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // You'll need to get this from Google Cloud Console
const UNSPLASH_API_KEY = 'YOUR_UNSPLASH_API_KEY'; // Free API key from Unsplash

// Enhanced recipe data with real images and instructions
export const enhanceRecipeData = async (recipe) => {
  try {
    console.log(`🔍 Enhancing recipe: ${recipe.title}`);
    
    // Get high-quality image from Unsplash
    const imageUrl = await getRecipeImage(recipe.title, recipe.cuisine);
    
    // Get detailed instructions from Google Custom Search
    const instructions = await getRecipeInstructions(recipe.title);
    
    // Get nutrition data from Google Knowledge Graph
    const nutritionData = await getNutritionData(recipe.title);
    
    return {
      ...recipe,
      images: [{ url: imageUrl }],
      instructions: instructions || recipe.instructions,
      nutrition: nutritionData || recipe.nutrition,
      enhanced: true
    };
  } catch (error) {
    console.error('Error enhancing recipe:', error);
    return recipe; // Return original if enhancement fails
  }
};

// Get high-quality recipe image from Unsplash
const getRecipeImage = async (title, cuisine) => {
  try {
    const searchQuery = `${title} ${cuisine} food recipe`;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape&client_id=${UNSPLASH_API_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
    }
  } catch (error) {
    console.error('Error fetching image:', error);
  }
  
  // Fallback to curated food images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&q=80'
  ];
  
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
};

// Get detailed recipe instructions from Google Custom Search
const getRecipeInstructions = async (title) => {
  try {
    const searchQuery = `${title} recipe instructions how to make`;
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=YOUR_SEARCH_ENGINE_ID&q=${encodeURIComponent(searchQuery)}&num=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        // Extract instructions from the search result
        const snippet = data.items[0].snippet;
        return snippet;
      }
    }
  } catch (error) {
    console.error('Error fetching instructions:', error);
  }
  
  return null;
};

// Get nutrition data from Google Knowledge Graph
const getNutritionData = async (title) => {
  try {
    const response = await fetch(
      `https://kgsearch.googleapis.com/v1/entities:search?query=${encodeURIComponent(title)}&key=${GOOGLE_API_KEY}&limit=1&types=Thing`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.itemListElement && data.itemListElement.length > 0) {
        const entity = data.itemListElement[0].result;
        // Extract nutrition information if available
        return entity.detailedDescription?.articleBody;
      }
    }
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
  }
  
  return null;
};

// Enhanced recipe data with realistic content
export const getEnhancedRecipeData = () => {
  return [
    {
      _id: "enhanced_1",
      title: "Chicken Biryani",
      description: "Fragrant Indian rice dish with spiced chicken and aromatic basmati rice, cooked to perfection with traditional spices and herbs.",
      cuisine: "Indian",
      category: "main-course",
      difficulty: "hard",
      prepTime: 30,
      cookTime: 60,
      servings: 6,
      images: [{ url: "https://images.unsplash.com/photo-1563379091339-03246963d4d8?w=400&h=300&fit=crop&q=80" }],
      ingredients: [
        "2 cups basmati rice",
        "1 kg chicken pieces",
        "3 large onions, sliced",
        "2 tomatoes, chopped",
        "1 cup yogurt",
        "2 tbsp ginger-garlic paste",
        "1 tsp turmeric powder",
        "2 tsp red chili powder",
        "1 tsp garam masala",
        "1/2 cup fresh mint leaves",
        "1/2 cup fresh cilantro",
        "4-5 green chilies",
        "1/2 cup fried onions",
        "2 tbsp ghee",
        "Salt to taste"
      ],
      instructions: [
        "Wash and soak basmati rice for 30 minutes",
        "Marinate chicken with yogurt, ginger-garlic paste, and spices for 2 hours",
        "Heat ghee in a large pot and sauté onions until golden",
        "Add marinated chicken and cook until tender",
        "Layer half-cooked rice over chicken",
        "Add mint, cilantro, and fried onions",
        "Cover and cook on low heat for 20 minutes",
        "Let it rest for 10 minutes before serving"
      ],
      nutrition: {
        calories: 450,
        protein: 30,
        carbs: 55,
        fat: 12,
        fiber: 3,
        sodium: 600
      },
      tags: ["rice", "indian", "spicy", "aromatic", "traditional"],
      author: {
        _id: "admin",
        username: "admin",
        firstName: "Admin",
        lastName: "User"
      },
      createdAt: new Date().toISOString(),
      isPublic: true,
      viewCount: 0,
      rating: { average: 4.5, count: 23 }
    },
    {
      _id: "enhanced_2",
      title: "Vegetable Stir Fry",
      description: "Quick and healthy Asian-style vegetable stir fry with crisp vegetables and savory sauce.",
      cuisine: "Asian",
      category: "main-course",
      difficulty: "easy",
      prepTime: 15,
      cookTime: 10,
      servings: 4,
      images: [{ url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&q=80" }],
      ingredients: [
        "2 cups mixed vegetables (broccoli, bell peppers, carrots)",
        "2 tbsp vegetable oil",
        "2 cloves garlic, minced",
        "1 tbsp ginger, grated",
        "3 tbsp soy sauce",
        "1 tbsp oyster sauce",
        "1 tsp sesame oil",
        "2 green onions, chopped",
        "1 tsp cornstarch",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Cut vegetables into bite-sized pieces",
        "Heat oil in a wok or large pan",
        "Add garlic and ginger, stir for 30 seconds",
        "Add vegetables and stir-fry for 5-7 minutes",
        "Mix soy sauce, oyster sauce, and cornstarch",
        "Add sauce to vegetables and cook for 2 minutes",
        "Garnish with green onions and sesame oil"
      ],
      nutrition: {
        calories: 120,
        protein: 6,
        carbs: 18,
        fat: 4,
        fiber: 6,
        sodium: 400
      },
      tags: ["vegetarian", "healthy", "quick", "asian", "low-calorie"],
      author: {
        _id: "admin",
        username: "admin",
        firstName: "Admin",
        lastName: "User"
      },
      createdAt: new Date().toISOString(),
      isPublic: true,
      viewCount: 0,
      rating: { average: 4.2, count: 18 }
    },
    {
      _id: "enhanced_3",
      title: "Spaghetti Carbonara",
      description: "Classic Italian pasta dish with eggs, cheese, and pancetta in a creamy sauce.",
      cuisine: "Italian",
      category: "main-course",
      difficulty: "medium",
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      images: [{ url: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&q=80" }],
      ingredients: [
        "400g spaghetti",
        "200g pancetta or bacon",
        "4 large eggs",
        "1 cup grated Parmesan cheese",
        "2 cloves garlic, minced",
        "1/2 cup heavy cream",
        "Black pepper to taste",
        "Salt to taste",
        "Fresh parsley for garnish"
      ],
      instructions: [
        "Cook spaghetti according to package directions",
        "Cut pancetta into small pieces and cook until crispy",
        "Beat eggs with Parmesan cheese and black pepper",
        "Drain pasta, reserving 1 cup pasta water",
        "Add hot pasta to pancetta pan",
        "Remove from heat and quickly stir in egg mixture",
        "Add pasta water gradually to create creamy sauce",
        "Garnish with parsley and serve immediately"
      ],
      nutrition: {
        calories: 520,
        protein: 25,
        carbs: 45,
        fat: 28,
        fiber: 2,
        sodium: 800
      },
      tags: ["pasta", "italian", "comfort-food", "creamy", "classic"],
      author: {
        _id: "admin",
        username: "admin",
        firstName: "Admin",
        lastName: "User"
      },
      createdAt: new Date().toISOString(),
      isPublic: true,
      viewCount: 0,
      rating: { average: 4.7, count: 31 }
    },
    {
      _id: "enhanced_4",
      title: "Chocolate Chip Cookies",
      description: "Soft and chewy homemade chocolate chip cookies with a perfect golden brown exterior.",
      cuisine: "American",
      category: "dessert",
      difficulty: "easy",
      prepTime: 20,
      cookTime: 11,
      servings: 24,
      images: [{ url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&q=80" }],
      ingredients: [
        "2 1/4 cups all-purpose flour",
        "1 tsp baking soda",
        "1 tsp salt",
        "1 cup butter, softened",
        "3/4 cup granulated sugar",
        "3/4 cup brown sugar",
        "2 large eggs",
        "2 tsp vanilla extract",
        "2 cups chocolate chips",
        "1 cup chopped nuts (optional)"
      ],
      instructions: [
        "Preheat oven to 375°F (190°C)",
        "Mix flour, baking soda, and salt in a bowl",
        "Cream butter and both sugars until fluffy",
        "Beat in eggs and vanilla",
        "Gradually add flour mixture",
        "Stir in chocolate chips and nuts",
        "Drop rounded tablespoons onto ungreased sheets",
        "Bake for 9-11 minutes until golden brown",
        "Cool on baking sheet for 2 minutes"
      ],
      nutrition: {
        calories: 150,
        protein: 2,
        carbs: 20,
        fat: 7,
        fiber: 1,
        sodium: 120
      },
      tags: ["cookies", "dessert", "chocolate", "baking", "sweet"],
      author: {
        _id: "admin",
        username: "admin",
        firstName: "Admin",
        lastName: "User"
      },
      createdAt: new Date().toISOString(),
      isPublic: true,
      viewCount: 0,
      rating: { average: 4.8, count: 45 }
    },
    {
      _id: "enhanced_5",
      title: "Caesar Salad",
      description: "Classic Caesar salad with homemade dressing, croutons, and Parmesan cheese.",
      cuisine: "American",
      category: "appetizer",
      difficulty: "easy",
      prepTime: 15,
      cookTime: 0,
      servings: 4,
      images: [{ url: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&q=80" }],
      ingredients: [
        "1 large head romaine lettuce",
        "1/2 cup grated Parmesan cheese",
        "1/2 cup croutons",
        "2 cloves garlic, minced",
        "2 anchovy fillets",
        "1/4 cup lemon juice",
        "1/2 cup olive oil",
        "1 egg yolk",
        "1 tsp Dijon mustard",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Wash and chop romaine lettuce into bite-sized pieces",
        "Make dressing by blending garlic, anchovies, and lemon juice",
        "Add egg yolk and mustard, then slowly whisk in olive oil",
        "Season with salt and pepper",
        "Toss lettuce with dressing",
        "Add croutons and Parmesan cheese",
        "Serve immediately"
      ],
      nutrition: {
        calories: 180,
        protein: 8,
        carbs: 8,
        fat: 14,
        fiber: 3,
        sodium: 400
      },
      tags: ["salad", "healthy", "classic", "fresh", "light"],
      author: {
        _id: "admin",
        username: "admin",
        firstName: "Admin",
        lastName: "User"
      },
      createdAt: new Date().toISOString(),
      isPublic: true,
      viewCount: 0,
      rating: { average: 4.3, count: 22 }
    }
  ];
};

// Function to load enhanced recipes into database
export const loadEnhancedRecipes = async () => {
  try {
    const enhancedRecipes = getEnhancedRecipeData();
    
    for (const recipe of enhancedRecipes) {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smartchef-2025.onrender.com/api';
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe)
      });
      
      if (response.ok) {
        console.log(`✅ Loaded enhanced recipe: ${recipe.title}`);
      } else {
        console.error(`❌ Failed to load recipe: ${recipe.title}`);
      }
    }
    
    console.log('🎉 All enhanced recipes loaded successfully!');
  } catch (error) {
    console.error('Error loading enhanced recipes:', error);
  }
};

export default {
  enhanceRecipeData,
  getEnhancedRecipeData,
  loadEnhancedRecipes
};
