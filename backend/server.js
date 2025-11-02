const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const userRoutes = require('./routes/users');
const plannerRoutes = require('./routes/planner');
const collectionRoutes = require('./routes/collections');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 10000 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ✅ CORS configuration - Allow both local and deployed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://smartchef-2025-frontend.onrender.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Database connection
const dbConnection = require('./config/database');

// Connect to database
dbConnection.connect()
  .then(() => {
    // Verify connection and count recipes
    const Recipe = require('./models/Recipe');
    Recipe.countDocuments({})
      .then(count => {
        console.log(`📊 Total recipes in database: ${count}`);
        if (count === 0) {
          console.log('⚠️  Database is empty - use /api/recipes/seed to import recipes');
        }
      })
      .catch(err => {
        console.log('⚠️  Could not count recipes:', err.message);
      });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/collections', collectionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SmartChef API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test recipes endpoint - returns recipe count and sample
app.get('/api/test-recipes', async (req, res) => {
  try {
    const Recipe = require('./models/Recipe');
    const mongoose = require('mongoose');
    
    const totalCount = await Recipe.countDocuments({});
    const publicCount = await Recipe.countDocuments({ isPublic: true });
    const privateCount = await Recipe.countDocuments({ $or: [{ isPublic: false }, { isPublic: { $exists: false } }] });
    
    const sampleRecipes = await Recipe.find({})
      .limit(3)
      .select('title cuisine category images isPublic createdAt')
      .lean();
    
    res.json({
      success: true,
      message: 'Recipe database test',
      data: {
        totalRecipes: totalCount,
        publicRecipes: publicCount,
        privateRecipes: privateCount,
        sampleRecipes: sampleRecipes,
        connection: {
          connected: mongoose.connection.readyState === 1,
          databaseName: mongoose.connection.db?.databaseName || 'unknown',
          mongoUri: process.env.MONGODB_URI ? 
            process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 
            'not set (using default: localhost)'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Server port configuration
// Default to 5000 for development, use PORT env variable for production
const DEFAULT_PORT = 5000;
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

