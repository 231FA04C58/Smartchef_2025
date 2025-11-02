const mongoose = require('mongoose');

// Your MongoDB Atlas connection
const ATLAS_URI = 'mongodb+srv://231fa04c58:17122005@smartchef17.xdpub9n.mongodb.net/smartchef?retryWrites=true&w=majority';

// Models
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Collection = require('./models/Collection');
const MealPlan = require('./models/MealPlan');

async function importToAtlas() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...\n');
    
    // Connect to Atlas
    await mongoose.connect(ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas\n');

    // Try to connect to local database if it exists
    const localURI = 'mongodb://localhost:27017/smartchef';
    let localConnection;
    let hasLocalData = false;

    try {
      localConnection = mongoose.createConnection(localURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await localConnection.asPromise();
      console.log('📦 Found local database, checking for data...\n');
      hasLocalData = true;
    } catch (err) {
      console.log('ℹ️ No local database found. Will only check Atlas.\n');
    }

    if (hasLocalData) {
      // Import from local to Atlas
      const LocalUser = localConnection.model('User', User.schema);
      const LocalRecipe = localConnection.model('Recipe', Recipe.schema);
      const LocalCollection = localConnection.model('Collection', Collection.schema);
      const LocalMealPlan = localConnection.model('MealPlan', MealPlan.schema);

      const counts = {
        users: await LocalUser.countDocuments(),
        recipes: await LocalRecipe.countDocuments(),
        collections: await LocalCollection.countDocuments(),
        mealPlans: await LocalMealPlan.countDocuments(),
      };

      console.log('📊 Local Database Contents:');
      console.log(`   Users: ${counts.users}`);
      console.log(`   Recipes: ${counts.recipes}`);
      console.log(`   Collections: ${counts.collections}`);
      console.log(`   Meal Plans: ${counts.mealPlans}\n`);

      if (counts.users > 0 || counts.recipes > 0 || counts.collections > 0 || counts.mealPlans > 0) {
        console.log('🚀 Starting import to Atlas...\n');

        // Import Users
        if (counts.users > 0) {
          const users = await LocalUser.find({}).lean();
          try {
            await User.insertMany(users, { ordered: false });
            console.log(`✅ Imported ${users.length} users`);
          } catch (err) {
            if (err.code === 11000) {
              console.log(`⚠️ Users already exist (skipped duplicates)`);
            } else {
              throw err;
            }
          }
        }

        // Import Recipes
        if (counts.recipes > 0) {
          const recipes = await LocalRecipe.find({}).lean();
          try {
            await Recipe.insertMany(recipes, { ordered: false });
            console.log(`✅ Imported ${recipes.length} recipes`);
          } catch (err) {
            if (err.code === 11000) {
              console.log(`⚠️ Recipes already exist (skipped duplicates)`);
            } else {
              throw err;
            }
          }
        }

        // Import Collections
        if (counts.collections > 0) {
          const collections = await LocalCollection.find({}).lean();
          try {
            await Collection.insertMany(collections, { ordered: false });
            console.log(`✅ Imported ${collections.length} collections`);
          } catch (err) {
            if (err.code === 11000) {
              console.log(`⚠️ Collections already exist (skipped duplicates)`);
            } else {
              throw err;
            }
          }
        }

        // Import Meal Plans
        if (counts.mealPlans > 0) {
          const mealPlans = await LocalMealPlan.find({}).lean();
          try {
            await MealPlan.insertMany(mealPlans, { ordered: false });
            console.log(`✅ Imported ${mealPlans.length} meal plans`);
          } catch (err) {
            if (err.code === 11000) {
              console.log(`⚠️ Meal Plans already exist (skipped duplicates)`);
            } else {
              throw err;
            }
          }
        }

        localConnection.close();
        console.log('\n🎉 Import completed successfully!');
      } else {
        console.log('ℹ️ No data found in local database to import.');
        localConnection.close();
      }
    }

    // Show Atlas database status
    console.log('\n📊 MongoDB Atlas Database Status:');
    const atlasCounts = {
      users: await User.countDocuments(),
      recipes: await Recipe.countDocuments(),
      collections: await Collection.countDocuments(),
      mealPlans: await MealPlan.countDocuments(),
    };
    console.log(`   Users: ${atlasCounts.users}`);
    console.log(`   Recipes: ${atlasCounts.recipes}`);
    console.log(`   Collections: ${atlasCounts.collections}`);
    console.log(`   Meal Plans: ${atlasCounts.mealPlans}\n`);

    await mongoose.connection.close();
    console.log('✅ All done! Your MongoDB Atlas database is ready.');
    console.log('\n💡 Next step: Update your .env file with:');
    console.log('   MONGODB_URI=mongodb+srv://231fa04c58:17122005@smartchef17.xdpub9n.mongodb.net/smartchef?retryWrites=true&w=majority');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

importToAtlas();

