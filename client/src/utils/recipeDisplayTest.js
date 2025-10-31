// Test Recipe Display - Run this in your browser console
console.log('🧪 Testing Recipe Display from Database');
console.log('=====================================');

// Test 1: Fetch recipes from API
async function testRecipeAPI() {
  try {
    console.log('📡 Fetching recipes from API...');
    const response = await fetch('http://localhost:5000/api/recipes');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API Response:', data);
      console.log(`📊 Found ${data.data.recipes.length} recipes:`);
      
      data.data.recipes.forEach((recipe, index) => {
        console.log(`${index + 1}. ${recipe.title}`);
        console.log(`   - Cuisine: ${recipe.cuisine}`);
        console.log(`   - Category: ${recipe.category}`);
        console.log(`   - Difficulty: ${recipe.difficulty}`);
        console.log(`   - Time: ${recipe.prepTime + recipe.cookTime} minutes`);
        console.log(`   - Servings: ${recipe.servings}`);
        console.log(`   - Author: ${recipe.author.firstName} ${recipe.author.lastName}`);
        console.log('---');
      });
      
      return data.data.recipes;
    } else {
      console.error('❌ API Error:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    return null;
  }
}

// Test 2: Display recipes in a simple format
async function displayRecipes() {
  const recipes = await testRecipeAPI();
  
  if (recipes && recipes.length > 0) {
    console.log('\n🎨 Creating Recipe Display...');
    
    // Create a simple HTML display
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-height: 80vh;
      overflow-y: auto;
      background: white;
      border: 2px solid #007bff;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: Arial, sans-serif;
    `;
    
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #007bff;">🍳 Your Recipes</h3>
        <button onclick="this.parentElement.parentElement.remove()" style="background: #dc3545; color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">✕</button>
      </div>
      <div style="font-size: 12px; color: #666; margin-bottom: 15px;">
        Found ${recipes.length} recipes in your database
      </div>
    `;
    
    recipes.forEach((recipe, index) => {
      const recipeDiv = document.createElement('div');
      recipeDiv.style.cssText = `
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
        background: #f9f9f9;
      `;
      
      recipeDiv.innerHTML = `
        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">
          ${index + 1}. ${recipe.title}
        </div>
        <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
          ${recipe.description}
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px;">
          <span style="background: #e3f2fd; color: #1976d2; padding: 2px 6px; border-radius: 3px; font-size: 11px;">
            ${recipe.cuisine}
          </span>
          <span style="background: #f3e5f5; color: #7b1fa2; padding: 2px 6px; border-radius: 3px; font-size: 11px;">
            ${recipe.category}
          </span>
          <span style="background: ${recipe.difficulty === 'easy' ? '#e8f5e8' : recipe.difficulty === 'medium' ? '#fff3e0' : '#ffebee'}; 
                   color: ${recipe.difficulty === 'easy' ? '#2e7d32' : recipe.difficulty === 'medium' ? '#f57c00' : '#c62828'}; 
                   padding: 2px 6px; border-radius: 3px; font-size: 11px;">
            ${recipe.difficulty}
          </span>
        </div>
        <div style="font-size: 11px; color: #888;">
          ⏱️ ${recipe.prepTime + recipe.cookTime} min | 👥 ${recipe.servings} servings | 👤 ${recipe.author.firstName} ${recipe.author.lastName}
        </div>
      `;
      
      container.appendChild(recipeDiv);
    });
    
    document.body.appendChild(container);
    console.log('✅ Recipe display created! Check the top-right corner of your page.');
    
  } else {
    console.log('❌ No recipes found to display');
  }
}

// Test 3: Check if frontend components are working
function testFrontendComponents() {
  console.log('\n🔍 Testing Frontend Components...');
  
  // Check if RecipeGrid component exists
  const recipeGrids = document.querySelectorAll('.recipe-grid, .card-grid, .recipes-grid');
  console.log(`📊 Found ${recipeGrids.length} recipe grid elements on page`);
  
  // Check if recipe cards exist
  const recipeCards = document.querySelectorAll('.recipe-card, .card');
  console.log(`📊 Found ${recipeCards.length} recipe card elements on page`);
  
  // Check if RecipeSearch component exists
  const searchElements = document.querySelectorAll('input[type="search"], .search-input, .recipe-search');
  console.log(`📊 Found ${searchElements.length} search input elements on page`);
  
  if (recipeCards.length > 0) {
    console.log('✅ Recipe cards are being rendered on the page');
  } else {
    console.log('⚠️ No recipe cards found - recipes might not be loading');
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Recipe Display Tests...\n');
  
  await displayRecipes();
  testFrontendComponents();
  
  console.log('\n🎉 Tests completed!');
  console.log('If you see recipes in the popup and recipe cards on the page, everything is working!');
}

// Make functions available globally
window.testRecipeDisplay = {
  testRecipeAPI,
  displayRecipes,
  testFrontendComponents,
  runAllTests
};

console.log('\n📋 Available test functions:');
console.log('- testRecipeDisplay.runAllTests() - Run all tests');
console.log('- testRecipeDisplay.testRecipeAPI() - Test API only');
console.log('- testRecipeDisplay.displayRecipes() - Show recipes popup');
console.log('- testRecipeDisplay.testFrontendComponents() - Check frontend components');
console.log('\n🚀 Run: testRecipeDisplay.runAllTests()');
