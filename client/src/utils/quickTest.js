// Quick Recipe Display Test - Run this in your browser console
import { API_BASE_URL } from '../config/api';

console.log('🔧 Quick Recipe Connection Test');
console.log('================================');

async function quickTest() {
  try {
    console.log('📡 Testing API connection...');
    const response = await fetch(`${API_BASE_URL}/recipes`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API Connection Successful!');
      console.log(`📊 Found ${data.data.recipes.length} recipes`);
      
      // Display recipes in a simple list
      console.log('\n🍳 Your Recipes:');
      data.data.recipes.forEach((recipe, index) => {
        console.log(`${index + 1}. ${recipe.title}`);
        console.log(`   📍 ${recipe.cuisine} | ${recipe.category} | ${recipe.difficulty}`);
        console.log(`   ⏱️ ${recipe.prepTime + recipe.cookTime} min | 👥 ${recipe.servings} servings`);
        console.log('---');
      });
      
      // Create a simple display on the page
      const display = document.createElement('div');
      display.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: #28a745;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      
      display.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px;">
          ✅ Recipes Loaded Successfully!
        </div>
        <div style="font-size: 14px;">
          Found ${data.data.recipes.length} recipes in your database
        </div>
        <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">
          If you still see "Failed to Load Recipes" on the page, try refreshing the browser.
        </div>
        <button onclick="this.parentElement.remove()" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          margin-top: 10px;
          cursor: pointer;
        ">Close</button>
      `;
      
      document.body.appendChild(display);
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (display.parentElement) {
          display.remove();
        }
      }, 10000);
      
    } else {
      console.error('❌ API Error:', data.message);
    }
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    
    // Show error message
    const errorDisplay = document.createElement('div');
    errorDisplay.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: #dc3545;
      color: white;
      padding: 15px;
      border-radius: 8px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    errorDisplay.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 10px;">
        ❌ Connection Failed
      </div>
      <div style="font-size: 14px;">
        ${error.message}
      </div>
      <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">
        Make sure both frontend and backend are running.
      </div>
      <button onclick="this.parentElement.remove()" style="
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        margin-top: 10px;
        cursor: pointer;
      ">Close</button>
    `;
    
    document.body.appendChild(errorDisplay);
  }
}

// Only run automatically in development and browser environment
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Run the test
  quickTest();
  
  console.log('\n📋 If you see a green success message, your recipes are working!');
  console.log('📋 If you see a red error message, there\'s a connection issue.');
  console.log('\n🔄 Try refreshing the page if recipes still don\'t show.');
}

// Make function available for manual execution
if (typeof window !== 'undefined') {
  window.quickTest = quickTest;
}
