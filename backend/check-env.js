/**
 * Check Environment Variables
 * Run this to see which MongoDB URI is being used
 * 
 * Usage: node check-env.js
 */

require('dotenv').config();

console.log('🔍 Environment Variables Check\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check MONGODB_URI
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  // Mask password for security
  const maskedUri = mongoUri.replace(/:([^:@]+)@/, ':****@');
  console.log('✅ MONGODB_URI is SET');
  console.log('📍 MongoDB URI:', maskedUri);
  
  // Check which database it's using
  if (mongoUri.includes('mongodb+srv://')) {
    console.log('☁️  Type: MongoDB Atlas (Cloud)');
    
    // Extract database name
    const dbMatch = mongoUri.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/);
    if (dbMatch) {
      console.log('📊 Database name:', dbMatch[1]);
    }
  } else if (mongoUri.includes('localhost')) {
    console.log('💻 Type: Local MongoDB');
    console.log('⚠️  WARNING: Using localhost - make sure MongoDB is running!');
  } else {
    console.log('🔗 Type: Custom MongoDB connection');
  }
} else {
  console.log('❌ MONGODB_URI is NOT SET');
  console.log('⚠️  Will use default fallback: mongodb://localhost:27017/smartchef');
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check for duplicate MONGODB_URI entries
console.log('🔍 Checking for duplicate entries...\n');
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  const mongoLines = lines.filter(line => 
    line.trim().startsWith('MONGODB_URI') && 
    !line.trim().startsWith('#')
  );
  
  if (mongoLines.length > 1) {
    console.log('⚠️  WARNING: Found MULTIPLE MONGODB_URI entries!');
    console.log('   Node.js will use the LAST one it reads.\n');
    mongoLines.forEach((line, index) => {
      const masked = line.replace(/:([^:@]+)@/, ':****@');
      console.log(`   ${index + 1}. ${masked}`);
    });
    console.log('\n💡 Solution: Keep only ONE MONGODB_URI line (the Atlas one)');
    console.log('   Comment out or delete the localhost one.\n');
  } else if (mongoLines.length === 1) {
    console.log('✅ Found 1 MONGODB_URI entry (correct)');
    const masked = mongoLines[0].replace(/:([^:@]+)@/, ':****@');
    console.log(`   ${masked}\n`);
  } else {
    console.log('⚠️  No MONGODB_URI found in .env file');
    console.log('   Will use default: mongodb://localhost:27017/smartchef\n');
  }
} else {
  console.log('⚠️  No .env file found in backend directory');
  console.log('   Create one with: MONGODB_URI=your_atlas_connection_string\n');
}

// Check other important env vars
console.log('📋 Other Environment Variables:\n');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('   PORT:', process.env.PORT || '5000 (default)');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ set' : '❌ not set');
console.log('   SPOONACULAR_API_KEY:', process.env.SPOONACULAR_API_KEY ? '✅ set' : '⚠️  using fallback');
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL || 'not set');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

