const mongoose = require('mongoose');

const connect = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartchef';
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // other options if needed
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    // exit in production so Render restarts and shows error
    if (process.env.NODE_ENV === 'production') process.exit(1);
    throw err;
  }
};

module.exports = { connect };
