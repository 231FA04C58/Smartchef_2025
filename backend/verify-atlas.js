require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://231fa04c58:17122005@smartchef17.xdpub9n.mongodb.net/smartchef?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Connected to MongoDB Atlas\n');
  
  const recipeCount = await Recipe.countDocuments();
  const userCount = await User.countDocuments();
  
  console.log('📊 Database Status:');
  console.log(`   Recipes: ${recipeCount}`);
  console.log(`   Users: ${userCount}\n`);
  
  console.log('✅ Your backend is now configured to use MongoDB Atlas!');
  console.log('🚀 You can start your server with: npm start or npm run dev');
  
  await mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
  process.exit(1);
});

