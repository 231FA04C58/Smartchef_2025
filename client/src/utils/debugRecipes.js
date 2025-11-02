// Debug Recipe Display - Run this in browser console
import { API_BASE_URL } from '../config/api';

console.log('🔍 Debugging Recipe Display...');

async function debugRecipes() {
  try {
    console.log('1. Testing API connection...');
    const response = await fetch(`${API_BASE_URL}/recipes?limit=6`);
    const data = await response.json();
    
    console.log('2. API Response:', data);
    
    if (data.success) {
      console.log('✅ API is working!');
      console.log(`📊 Found ${data.data.recipes.length} recipes`);
      
      data.data.recipes.forEach((recipe, index) => {
        console.log(`Recipe ${index + 1}:`, {
          id: recipe._id,
          title: recipe.title,
          cuisine: recipe.cuisine,
          category: recipe.category,
          servings: recipe.servings,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          hasImage: !!recipe.images?.[0]?.url,
          description: recipe.description?.substring(0, 50) + '...'
        });
      });
      
      // Check if recipes are being displayed
      const recipeCards = document.querySelectorAll('.recipe-card');
      console.log(`3. Recipe cards found on page: ${recipeCards.length}`);
      
      if (recipeCards.length === 0) {
        console.log('❌ No recipe cards found on page!');
        console.log('🔍 Checking for loading state...');
        const loadingGrid = document.querySelector('.loading-grid');
        if (loadingGrid) {
          console.log('⏳ Still loading...');
        } else {
          console.log('❌ Not loading and no cards found. Check Home.jsx component.');
        }
      } else {
        console.log('✅ Recipe cards are displaying!');
        recipeCards.forEach((card, index) => {
          const title = card.querySelector('.recipe-title');
          console.log(`Card ${index + 1}: ${title?.textContent || 'No title'}`);
        });
      }
      
    } else {
      console.error('❌ API Error:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.log(`💡 Make sure your backend is running on ${API_BASE_URL}`);
  }
}

// Only run automatically in development and browser environment
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Run the debug
  debugRecipes();
  
  console.log('\n📋 Debug Instructions:');
  console.log('1. Open your browser console (F12)');
  console.log('2. Go to http://localhost:5173');
  console.log('3. Run this script to see what\'s happening');
  console.log('4. Check the console output for any errors');
}

// Make function available for manual execution
if (typeof window !== 'undefined') {
  window.debugRecipes = debugRecipes;
}
