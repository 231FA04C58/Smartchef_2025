const express = require('express');
const { body, validationResult, query } = require('express-validator');
const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipe');
const { authenticateToken, requireOwnership } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/planner
// @desc    Get user's meal plans
// @access  Private
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('active').optional().isIn(['true', 'false', '1', '0']).withMessage('Active filter must be true, false, 1, or 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('⚠️ Meal planner validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Cap at 100
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    
    if (req.query.active !== undefined) {
      // Handle both string and boolean values
      const activeValue = req.query.active;
      filter.isActive = activeValue === 'true' || activeValue === true || activeValue === '1' || activeValue === 1;
    }

    const mealPlans = await MealPlan.find(filter)
      .populate('meals.recipe', 'title images prepTime cookTime servings')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MealPlan.countDocuments(filter);

    res.json({
      success: true,
      data: {
        mealPlans,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPlans: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get meal plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching meal plans'
    });
  }
});

// @route   GET /api/planner/:id
// @desc    Get single meal plan
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('meals.recipe');

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      data: {
        mealPlan
      }
    });

  } catch (error) {
    console.error('Get meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching meal plan'
    });
  }
});

// @route   POST /api/planner
// @desc    Create new meal plan
// @access  Private
router.post('/', authenticateToken, [
  body('name')
    .notEmpty()
    .withMessage('Meal plan name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('meals')
    .isArray({ min: 1 })
    .withMessage('At least one meal is required'),
  body('meals.*.date')
    .isISO8601()
    .withMessage('Meal date must be a valid date'),
  body('meals.*.mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  body('meals.*.recipe')
    .isMongoId()
    .withMessage('Invalid recipe ID'),
  body('meals.*.servings')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Servings must be at least 1')
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

    const { name, description, startDate, endDate, meals, preferences } = req.body;

    // Validate that all recipe IDs exist
    const recipeIds = meals.map(meal => meal.recipe);
    const existingRecipes = await Recipe.find({ _id: { $in: recipeIds } });
    
    if (existingRecipes.length !== recipeIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more recipes not found'
      });
    }

    const mealPlanData = {
      user: req.user._id,
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      meals: meals.map(meal => ({
        ...meal,
        date: new Date(meal.date),
        servings: meal.servings || 1
      })),
      preferences: preferences || {}
    };

    const mealPlan = new MealPlan(mealPlanData);
    await mealPlan.save();

    // Generate shopping list
    await mealPlan.generateShoppingList();

    await mealPlan.populate('meals.recipe', 'title images prepTime cookTime servings');

    res.status(201).json({
      success: true,
      message: 'Meal plan created successfully',
      data: {
        mealPlan
      }
    });

  } catch (error) {
    console.error('Create meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating meal plan'
    });
  }
});

// @route   PUT /api/planner/:id
// @desc    Update meal plan
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    const allowedUpdates = [
      'name', 'description', 'startDate', 'endDate', 'meals', 'preferences', 'isActive'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // If meals are updated, regenerate shopping list
    if (updates.meals) {
      updates.meals = updates.meals.map(meal => ({
        ...meal,
        date: new Date(meal.date),
        servings: meal.servings || 1
      }));
    }

    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('meals.recipe', 'title images prepTime cookTime servings');

    // Regenerate shopping list if meals were updated
    if (updates.meals) {
      await updatedMealPlan.generateShoppingList();
    }

    res.json({
      success: true,
      message: 'Meal plan updated successfully',
      data: {
        mealPlan: updatedMealPlan
      }
    });

  } catch (error) {
    console.error('Update meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating meal plan'
    });
  }
});

// @route   DELETE /api/planner/:id
// @desc    Delete meal plan
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal plan deleted successfully'
    });

  } catch (error) {
    console.error('Delete meal plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting meal plan'
    });
  }
});

// @route   GET /api/planner/:id/shopping-list
// @desc    Get shopping list for meal plan
// @access  Private
router.get('/:id/shopping-list', authenticateToken, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      data: {
        shoppingList: mealPlan.shoppingList
      }
    });

  } catch (error) {
    console.error('Get shopping list error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching shopping list'
    });
  }
});

// @route   PUT /api/planner/:id/shopping-list/:itemId
// @desc    Update shopping list item
// @access  Private
router.put('/:id/shopping-list/:itemId', authenticateToken, [
  body('isPurchased')
    .isBoolean()
    .withMessage('isPurchased must be boolean')
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

    const mealPlan = await MealPlan.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    const item = mealPlan.shoppingList.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Shopping list item not found'
      });
    }

    item.isPurchased = req.body.isPurchased;
    await mealPlan.save();

    res.json({
      success: true,
      message: 'Shopping list item updated successfully',
      data: {
        item
      }
    });

  } catch (error) {
    console.error('Update shopping list item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating shopping list item'
    });
  }
});

// @route   GET /api/planner/calendar/:year/:month
// @desc    Get meal plans for specific month
// @access  Private
router.get('/calendar/:year/:month', authenticateToken, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month) - 1; // JavaScript months are 0-indexed

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const mealPlans = await MealPlan.find({
      user: req.user._id,
      isActive: true,
      $or: [
        {
          startDate: { $lte: endDate },
          endDate: { $gte: startDate }
        }
      ]
    }).populate('meals.recipe', 'title images');

    // Group meals by date
    const calendarData = {};
    mealPlans.forEach(plan => {
      plan.meals.forEach(meal => {
        const dateKey = meal.date.toISOString().split('T')[0];
        if (!calendarData[dateKey]) {
          calendarData[dateKey] = [];
        }
        calendarData[dateKey].push({
          mealType: meal.mealType,
          recipe: meal.recipe,
          servings: meal.servings,
          isCompleted: meal.isCompleted
        });
      });
    });

    res.json({
      success: true,
      data: {
        calendarData
      }
    });

  } catch (error) {
    console.error('Get calendar data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching calendar data'
    });
  }
});

module.exports = router;
