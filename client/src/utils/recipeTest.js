// Quick Recipe Test - Run this in your browser console
import { API_BASE_URL } from '../config/api';

console.log('🍳 Testing Recipe Display...');

async function testRecipes() {
  try {
    // Test API connection
    const response = await fetch(`${API_BASE_URL}/recipes`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ SUCCESS! Recipes loaded from database');
      console.log(`📊 Found ${data.data.recipes.length} recipes:`);
      
      data.data.recipes.forEach((recipe, index) => {
        console.log(`${index + 1}. ${recipe.title} (${recipe.cuisine})`);
      });
      
      // Show success message on page
      const successDiv = document.createElement('div');
      successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
      `;
      
      successDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">
          ✅ Recipes Working!
        </div>
        <div style="font-size: 14px;">
          Found ${data.data.recipes.length} recipes in your database
        </div>
        <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">
          Your frontend should now display these recipes properly.
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
      
      document.body.appendChild(successDiv);
      
      // Auto-remove after 8 seconds
      setTimeout(() => {
        if (successDiv.parentElement) {
          successDiv.remove();
        }
      }, 8000);
      
    } else {
      console.error('❌ API Error:', data.message);
    }
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
  }
}

// Run the test
testRecipes();

console.log('\n📋 Instructions:');
console.log('1. If you see a GREEN success message → Your recipes are working!');
console.log('2. If you see a RED error message → There\'s still a connection issue');
console.log('3. Check your frontend at http://localhost:5173');
console.log('4. The recipes should now display properly on the home page');