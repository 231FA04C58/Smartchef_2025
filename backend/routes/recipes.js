const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Recipe = require('../models/Recipe');
const { authenticateToken, requireOwnership } = require('../middleware/auth');
const { fetchRecipeImages, updateRecipeWithGoogleImages } = require('../services/googleImageService');
const { searchRecipes, convertToRecipeSchema } = require('../services/spoonacularService');

const router = express.Router();

// @route   GET /api/recipes
// @desc    Get all recipes with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 500 }).withMessage('Limit must be between 1 and 500'),
  query('search').optional().isLength({ max: 100 }).withMessage('Search term too long'),
  query('cuisine').optional().isLength({ max: 50 }).withMessage('Cuisine filter too long'),
  query('category').optional().isIn(['appetizer', 'main-course', 'dessert', 'beverage', 'snack', 'breakfast', 'lunch', 'dinner']),
  query('difficulty').optional().isIn(['easy', 'medium', 'hard']),
  query('dietary').optional().isIn(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'paleo', 'halal', 'kosher'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    // Include recipes that are public OR don't have isPublic field (treat as public by default)
    const baseFilter = {
      $or: [
        { isPublic: true },
        { isPublic: { $exists: false } }
      ]
    };
    
    const filter = { ...baseFilter };
    
    if (req.query.search) {
      // Combine text search with public filter
      filter.$and = [
        baseFilter,
        { $text: { $search: req.query.search } }
      ];
      delete filter.$or;
      delete filter.$text;
    }
    
    if (req.query.cuisine) {
      filter.cuisine = new RegExp(req.query.cuisine, 'i');
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    
    if (req.query.dietary) {
      const dietaryField = req.query.dietary.replace('-', '');
      filter[`dietaryInfo.${dietaryField}`] = true;
    }

    // Build sort object
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'rating':
          sort = { 'rating.average': -1 };
          break;
        case 'popular':
          sort = { viewCount: -1 };
          break;
        case 'time':
          sort = { totalTime: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }

    const recipes = await Recipe.find(filter)
      .populate('author', 'username firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-instructions'); // Exclude detailed instructions for list view

    const total = await Recipe.countDocuments(filter);

    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecipes: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipes'
    });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username firstName lastName')
      .populate('reviews.user', 'username firstName lastName');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Increment view count
    recipe.viewCount = (recipe.viewCount || 0) + 1;
    await recipe.save();

    // Track recently viewed if user is authenticated
    if (req.headers.authorization) {
      try {
        const User = require('../models/User');
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userId = decoded.userId || decoded.id;

        await User.findByIdAndUpdate(userId, {
          $pull: { 'recentlyViewed': { recipe: recipe._id } }
        });
        
        await User.findByIdAndUpdate(userId, {
          $push: {
            recentlyViewed: {
              $each: [{ recipe: recipe._id, viewedAt: new Date() }],
              $slice: -20 // Keep only last 20 viewed recipes
            }
          }
        });
      } catch (error) {
        // Silently fail if token is invalid or user not found
        console.log('Could not track recently viewed:', error.message);
      }
    }

    res.json({
      success: true,
      data: {
        recipe
      }
    });

  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipe'
    });
  }
});

// @route   POST /api/recipes
// @desc    Create new recipe
// @access  Private
router.post('/', authenticateToken, [
  body('title')
    .notEmpty()
    .withMessage('Recipe title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .notEmpty()
    .withMessage('Recipe description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  body('ingredients.*.name')
    .notEmpty()
    .withMessage('Ingredient name is required'),
  body('ingredients.*.amount')
    .notEmpty()
    .withMessage('Ingredient amount is required'),
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('At least one instruction is required'),
  body('instructions.*.instruction')
    .notEmpty()
    .withMessage('Instruction text is required'),
  body('prepTime')
    .isInt({ min: 0 })
    .withMessage('Preparation time must be a non-negative integer'),
  body('cookTime')
    .isInt({ min: 0 })
    .withMessage('Cooking time must be a non-negative integer'),
  body('servings')
    .isInt({ min: 1 })
    .withMessage('Servings must be at least 1'),
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level'),
  body('cuisine')
    .notEmpty()
    .withMessage('Cuisine is required'),
  body('category')
    .isIn(['appetizer', 'main-course', 'dessert', 'beverage', 'snack', 'breakfast', 'lunch', 'dinner'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const recipeData = {
      ...req.body,
      author: req.user._id
    };

    const recipe = new Recipe(recipeData);
    await recipe.save();

    await recipe.populate('author', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: {
        recipe
      }
    });

  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating recipe'
    });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private (Owner only)
router.put('/:id', authenticateToken, requireOwnership(Recipe), async (req, res) => {
  try {
    const allowedUpdates = [
      'title', 'description', 'ingredients', 'instructions', 'prepTime', 'cookTime',
      'servings', 'difficulty', 'cuisine', 'category', 'tags', 'dietaryInfo',
      'nutrition', 'images', 'isPublic'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName');

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      data: {
        recipe
      }
    });

  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating recipe'
    });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private (Owner only)
router.delete('/:id', authenticateToken, requireOwnership(Recipe), async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting recipe'
    });
  }
});

// @route   POST /api/recipes/:id/favorite
// @desc    Add recipe to favorites
// @access  Private
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Ensure favorites array exists
    if (!recipe.favorites) {
      recipe.favorites = [];
    }

    // Check if already favorited - convert to string for comparison
    const userIdStr = req.user._id.toString();
    const isAlreadyFavorited = recipe.favorites.some(
      favId => favId && favId.toString() === userIdStr
    );
    
    if (isAlreadyFavorited) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already in favorites'
      });
    }

    recipe.favorites.push(req.user._id);
    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe added to favorites',
      data: {
        recipe: {
          _id: recipe._id,
          favorites: recipe.favorites
        }
      }
    });

  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/recipes/:id/favorite
// @desc    Remove recipe from favorites
// @access  Private
router.delete('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    recipe.favorites = recipe.favorites.filter(
      favoriteId => favoriteId.toString() !== req.user._id.toString()
    );
    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe removed from favorites'
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from favorites'
    });
  }
});

// @route   POST /api/recipes/:id/review
// @desc    Add review to recipe
// @access  Private
router.post('/:id/review', authenticateToken, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if user already reviewed
    const existingReview = recipe.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this recipe'
      });
    }

    const review = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment || ''
    };

    recipe.reviews.push(review);
    await recipe.calculateAverageRating();

    await recipe.populate('reviews.user', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: {
        recipe
      }
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   POST /api/recipes/:id/update-images
// @desc    Update recipe images from Google
// @access  Private
router.post('/:id/update-images', authenticateToken, requireOwnership(Recipe), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Fetch Google images
    const images = await fetchRecipeImages(recipe.title, recipe.cuisine, { limit: 1 });
    
    // Update recipe
    recipe.images = images;
    await recipe.save();

    res.json({
      success: true,
      message: 'Recipe images updated successfully',
      data: {
        recipe,
        images
      }
    });

  } catch (error) {
    console.error('Update recipe images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating recipe images',
      error: error.message
    });
  }
});

// @route   GET /api/recipes/:id/images
// @desc    Get images for a recipe (from Google if not available)
// @access  Public
router.get('/:id/images', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // If recipe already has images, return them
    if (recipe.images && recipe.images.length > 0) {
      return res.json({
        success: true,
        data: {
          images: recipe.images,
          source: 'database'
        }
      });
    }

    // Otherwise, fetch from Google
    const images = await fetchRecipeImages(recipe.title, recipe.cuisine, { limit: 1 });
    
    res.json({
      success: true,
      data: {
        images,
        source: 'google'
      }
    });

  } catch (error) {
    console.error('Get recipe images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recipe images',
      error: error.message
    });
  }
});

// @route   GET /api/recipes/spoonacular/search
// @desc    Search recipes from Spoonacular API (doesn't save to DB)
// @access  Public
router.get('/spoonacular/search', [
  query('query').optional().isLength({ min: 1, max: 100 }).withMessage('Query must be between 1 and 100 characters'),
  query('number').optional().isInt({ min: 1, max: 50 }).withMessage('Number must be between 1 and 50'),
  query('cuisine').optional().isLength({ max: 50 }),
  query('diet').optional().isIn(['vegetarian', 'vegan', 'gluten-free', 'ketogenic', 'paleo'])
], async (req, res) => {
  try {
    if (!process.env.SPOONACULAR_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'Spoonacular API key not configured. Please set SPOONACULAR_API_KEY in .env file.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { query, number = 10, cuisine, diet } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required'
      });
    }

    const recipes = await searchRecipes(query, {
      number: parseInt(number),
      addRecipeInformation: true,
      cuisine: cuisine || '',
      diet: diet || ''
    });

    res.json({
      success: true,
      data: {
        recipes: recipes,
        count: recipes.length
      }
    });
  } catch (error) {
    console.error('Spoonacular search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search recipes from Spoonacular'
    });
  }
});

// @route   POST /api/recipes/spoonacular/import
// @desc    Import a recipe from Spoonacular to MongoDB
// @access  Public (can be protected later)
router.post('/spoonacular/import', [
  body('spoonacularId').isInt().withMessage('Valid Spoonacular recipe ID is required'),
  body('author').optional().isMongoId().withMessage('Valid author ID is required')
], async (req, res) => {
  try {
    if (!process.env.SPOONACULAR_API_KEY) {
      return res.status(503).json({
        success: false,
        message: 'Spoonacular API key not configured'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { spoonacularId, author } = req.body;

    // Get admin user or use provided author
    let authorId = author;
    if (!authorId) {
      const User = require('../models/User');
      const adminUser = await User.findOne({ email: 'admin@example.com' });
      if (!adminUser) {
        return res.status(400).json({
          success: false,
          message: 'No author specified and admin user not found'
        });
      }
      authorId = adminUser._id;
    }

    // Check if recipe already exists
    const existing = await Recipe.findOne({ spoonacularId: spoonacularId.toString() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Recipe already exists in database',
        data: { recipe: existing }
      });
    }

    // Fetch full recipe from Spoonacular
    const spoonRecipe = await getRecipeById(spoonacularId);
    if (!spoonRecipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found in Spoonacular'
      });
    }

    // Convert to our schema
    const recipe = convertToRecipeSchema(spoonRecipe, authorId);

    // Save to database
    const savedRecipe = await Recipe.create(recipe);

    res.status(201).json({
      success: true,
      message: 'Recipe imported successfully',
      data: { recipe: savedRecipe }
    });
  } catch (error) {
    console.error('Import recipe error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to import recipe'
    });
  }
});

module.exports = router;
