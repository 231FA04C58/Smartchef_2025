// Test API Connection Script
// Run this in browser console to test the connection

export const testAPIConnection = async () => {
  console.log('🧪 Testing API Connection...\n');
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');
    
    // Test 2: Recipes Endpoint
    console.log('2️⃣ Testing recipes endpoint...');
    const recipesResponse = await fetch('http://localhost:5000/api/recipes?limit=6');
    
    if (!recipesResponse.ok) {
      throw new Error(`HTTP error! status: ${recipesResponse.status}`);
    }
    
    const recipesData = await recipesResponse.json();
    console.log('✅ Recipes response:', recipesData);
    console.log('');
    
    // Test 3: Check structure
    if (recipesData.success) {
      console.log('3️⃣ Recipe data structure check...');
      console.log(`   - Total recipes: ${recipesData.data.recipes.length}`);
      console.log(`   - First recipe: ${recipesData.data.recipes[0]?.title || 'N/A'}`);
      console.log('✅ Structure looks correct!');
      console.log('');
      return { success: true, recipes: recipesData.data.recipes };
    } else {
      console.log('❌ API returned success: false');
      console.log('   Message:', recipesData.message);
      return { success: false, error: recipesData.message };
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('');
    console.log('🔍 Troubleshooting:');
    console.log('   1. Is the backend running on port 5000?');
    console.log('   2. Check browser console for CORS errors');
    console.log('   3. Try: curl http://localhost:5000/api/recipes');
    return { success: false, error: error.message };
  }
};

// Auto-run if imported
if (typeof window !== 'undefined') {
  window.testAPIConnection = testAPIConnection;
  console.log('💡 Run testAPIConnection() in console to test API');
}

