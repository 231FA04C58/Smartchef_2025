const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartchef';
  
  // Log which MongoDB URI is being used (mask password for security)
  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@'); // Mask password
  console.log('🔗 Connecting to MongoDB...');
  console.log('📍 MongoDB URI:', maskedUri);
  
  // Check if using Atlas or localhost
  if (uri.includes('mongodb+srv://')) {
    console.log('☁️  MongoDB Atlas connection detected');
  } else if (uri.includes('localhost')) {
    console.log('💻 Local MongoDB connection detected');
    console.log('⚠️  WARNING: Using local MongoDB - make sure MongoDB is running locally!');
  } else {
    console.log('🔗 Custom MongoDB connection');
  }
  
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // other options if needed
    });
    
    // Get database name from URI
    const dbName = mongoose.connection.db?.databaseName || 'unknown';
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database name:', dbName);
    
    // Log connection details
    console.log('🔌 Connection state:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    console.error('📍 Attempted URI:', maskedUri);
    // exit in production so Render restarts and shows error
    if (process.env.NODE_ENV === 'production') process.exit(1);
    throw err;
  }
};

module.exports = { connect };
