const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Collection = require('./models/Collection');
const MealPlan = require('./models/MealPlan');

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://231fa04c58:17122005@smartchef17.xdpub9n.mongodb.net/smartchef?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error);
    return false;
  }
}

// Import data from source database
async function importData() {
  try {
    console.log('🔄 Starting data import...\n');

    // Connect to source database (your old database)
    const sourceURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartchef';
    const sourceConnection = mongoose.createConnection(sourceURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connecting to source database...');
    await sourceConnection.asPromise();
    console.log('✅ Connected to source database');

    // Get source collections
    const sourceUserModel = sourceConnection.model('User', User.schema);
    const sourceRecipeModel = sourceConnection.model('Recipe', Recipe.schema);
    const sourceCollectionModel = sourceConnection.model('Collection', Collection.schema);
    const sourceMealPlanModel = sourceConnection.model('MealPlan', MealPlan.schema);

    // Check what data exists
    const userCount = await sourceUserModel.countDocuments();
    const recipeCount = await sourceRecipeModel.countDocuments();
    const collectionCount = await sourceCollectionModel.countDocuments();
    const mealPlanCount = await sourceMealPlanModel.countDocuments();

    console.log('\n📊 Source Database Statistics:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Recipes: ${recipeCount}`);
    console.log(`   Collections: ${collectionCount}`);
    console.log(`   Meal Plans: ${mealPlanCount}\n`);

    if (userCount === 0 && recipeCount === 0 && collectionCount === 0 && mealPlanCount === 0) {
      console.log('⚠️ No data found in source database. Skipping import.');
      sourceConnection.close();
      return;
    }

    // Import Users
    if (userCount > 0) {
      console.log('👥 Importing users...');
      const users = await sourceUserModel.find({}).lean();
      await User.insertMany(users, { ordered: false });
      console.log(`✅ Imported ${users.length} users`);
    }

    // Import Recipes
    if (recipeCount > 0) {
      console.log('🍳 Importing recipes...');
      const recipes = await sourceRecipeModel.find({}).lean();
      await Recipe.insertMany(recipes, { ordered: false });
      console.log(`✅ Imported ${recipes.length} recipes`);
    }

    // Import Collections
    if (collectionCount > 0) {
      console.log('📚 Importing collections...');
      const collections = await sourceCollectionModel.find({}).lean();
      await Collection.insertMany(collections, { ordered: false });
      console.log(`✅ Imported ${collections.length} collections`);
    }

    // Import Meal Plans
    if (mealPlanCount > 0) {
      console.log('📅 Importing meal plans...');
      const mealPlans = await sourceMealPlanModel.find({}).lean();
      await MealPlan.insertMany(mealPlans, { ordered: false });
      console.log(`✅ Imported ${mealPlans.length} meal plans`);
    }

    sourceConnection.close();
    console.log('\n🎉 Data import completed successfully!');

  } catch (error) {
    console.error('❌ Error during import:', error);
    if (error.code === 11000) {
      console.log('⚠️ Some documents already exist (duplicate key error). This is normal if re-running the import.');
    }
  }
}

// Main function
async function main() {
  // First, connect to target database (MongoDB Atlas)
  if (!(await connectToDatabase())) {
    process.exit(1);
  }

  // Import data
  await importData();

  // Close connection
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
}

// Run the import
main().catch(console.error);

