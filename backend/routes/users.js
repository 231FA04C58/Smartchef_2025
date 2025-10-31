const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('mealPlans', 'name startDate endDate');
    
    // Get favorite recipes separately
    const favoriteRecipes = await Recipe.find({ favorites: req.user._id })
      .select('title images rating');
    
    // Add favoriteRecipes to user object
    const userObj = user.toObject();
    userObj.favoriteRecipes = favoriteRecipes;

    res.json({
      success: true,
      data: {
        user: userObj
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   GET /api/users/favorites
// @desc    Get user's favorite recipes
// @access  Private
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    // Query recipes where user ID is in the favorites array
    const recipes = await Recipe.find({ favorites: req.user._id })
      .populate('author', 'username firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        recipes
      }
    });

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching favorites'
    });
  }
});

// @route   GET /api/users/my-recipes
// @desc    Get user's own recipes
// @access  Private
router.get('/my-recipes', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find({ author: req.user._id })
      .populate('author', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-instructions');

    const total = await Recipe.countDocuments({ author: req.user._id });

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
    console.error('Get my recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your recipes'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', authenticateToken, [
  body('dietaryRestrictions')
    .optional()
    .isArray()
    .withMessage('Dietary restrictions must be an array'),
  body('allergies')
    .optional()
    .isArray()
    .withMessage('Allergies must be an array'),
  body('favoriteCuisines')
    .optional()
    .isArray()
    .withMessage('Favorite cuisines must be an array'),
  body('cookingSkill')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid cooking skill level')
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

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences'
    });
  }
});

// @route   POST /api/users/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticateToken, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
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

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticateToken, [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account')
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

    const { password } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Soft delete - deactivate account instead of hard delete
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [
      totalRecipes,
      totalFavorites,
      totalMealPlans,
      totalReviews
    ] = await Promise.all([
      Recipe.countDocuments({ author: req.user._id }),
      Recipe.countDocuments({ favorites: req.user._id }),
      require('../models/MealPlan').countDocuments({ user: req.user._id }),
      Recipe.countDocuments({ 'reviews.user': req.user._id })
    ]);

    res.json({
      success: true,
      data: {
        createdRecipes: totalRecipes,
        favoriteRecipes: totalFavorites,
        mealPlans: totalMealPlans,
        reviewsGiven: totalReviews
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   GET /api/users/recently-viewed
// @desc    Get user's recently viewed recipes
// @access  Private
router.get('/recently-viewed', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'recentlyViewed.recipe',
        select: 'title images prepTime cookTime servings rating cuisine category'
      })
      .select('recentlyViewed');

    // Sort by viewedAt (most recent first) and get last 20
    const recentlyViewed = user.recentlyViewed
      .filter(item => item.recipe !== null) // Filter out deleted recipes
      .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt))
      .slice(0, 20)
      .map(item => ({
        recipe: item.recipe,
        viewedAt: item.viewedAt
      }));

    res.json({
      success: true,
      data: {
        recentlyViewed
      }
    });
  } catch (error) {
    console.error('Get recently viewed error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recently viewed recipes'
    });
  }
});

module.exports = router;
