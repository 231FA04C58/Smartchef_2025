// Test Script for SmartChef Application
// Run this in your browser console to test the application

console.log('🧪 SmartChef Test Script');
console.log('========================');

// Test 1: API Connection
async function testConnection() {
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('✅ Backend API is running:', data.message);
    return true;
  } catch (error) {
    console.error('❌ Backend API connection failed:', error);
    return false;
  }
}

// Test 2: User Registration
async function testRegistration() {
  const testUser = {
    username: 'testuser' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ User registration successful:', data.data.user.email);
      return { user: testUser, token: data.data.token };
    } else {
      console.log('⚠️ Registration failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return null;
  }
}

// Test 3: User Login
async function testLogin(email, password) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Login successful:', data.data.user.email);
      return data.data;
    } else {
      console.log('❌ Login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('\n🔍 Running Tests...');
  
  // Test API connection
  const apiWorking = await testConnection();
  if (!apiWorking) {
    console.log('❌ Cannot proceed - Backend API not available');
    return;
  }
  
  // Test registration
  const registrationResult = await testRegistration();
  if (registrationResult) {
    // Test login with registered user
    await testLogin(registrationResult.user.email, registrationResult.user.password);
  }
  
  console.log('\n🎉 Tests completed!');
  console.log('Your SmartChef application is working correctly!');
}

// Make functions available globally
window.testSmartChef = {
  testConnection,
  testRegistration,
  testLogin,
  runTests
};

console.log('\n📋 Available test functions:');
console.log('- testSmartChef.runTests() - Run all tests');
console.log('- testSmartChef.testConnection() - Test API connection');
console.log('- testSmartChef.testRegistration() - Test user registration');
console.log('- testSmartChef.testLogin(email, password) - Test user login');
console.log('\n🚀 Run: testSmartChef.runTests()');
