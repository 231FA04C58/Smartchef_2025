const express = require('express');
const { body, validationResult } = require('express-validator');
const Collection = require('../models/Collection');
const Recipe = require('../models/Recipe');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/collections
// @desc    Get all user collections
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id })
      .populate('recipes', 'title images prepTime cookTime servings rating dietaryInfo nutrition difficulty cuisine category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        collections
      }
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching collections'
    });
  }
});

// @route   GET /api/collections/:id
// @desc    Get single collection
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('recipes');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: {
        collection
      }
    });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching collection'
    });
  }
});

// @route   POST /api/collections
// @desc    Create new collection
// @access  Private
router.post('/', authenticateToken, [
  body('name')
    .notEmpty()
    .withMessage('Collection name is required')
    .isLength({ max: 100 })
    .withMessage('Collection name cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
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

    const { name, description, color } = req.body;

    const collection = new Collection({
      user: req.user._id,
      name,
      description: description || '',
      color: color || '#ff7f50',
      recipes: []
    });

    await collection.save();
    await collection.populate('recipes', 'title images prepTime cookTime servings rating dietaryInfo nutrition difficulty cuisine category');

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: {
        collection
      }
    });
  } catch (error) {
    console.error('Create collection error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A collection with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating collection'
    });
  }
});

// @route   PUT /api/collections/:id
// @desc    Update collection
// @access  Private
router.put('/:id', authenticateToken, [
  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Collection name cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
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

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    const allowedUpdates = ['name', 'description', 'isPublic', 'color'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        collection[key] = req.body[key];
      }
    });

    await collection.save();
    await collection.populate('recipes', 'title images prepTime cookTime servings rating dietaryInfo nutrition difficulty cuisine category');

    res.json({
      success: true,
      message: 'Collection updated successfully',
      data: {
        collection
      }
    });
  } catch (error) {
    console.error('Update collection error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A collection with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating collection'
    });
  }
});

// @route   DELETE /api/collections/:id
// @desc    Delete collection
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting collection'
    });
  }
});

// @route   POST /api/collections/:id/recipes
// @desc    Add recipe to collection
// @access  Private
router.post('/:id/recipes', authenticateToken, [
  body('recipeId')
    .notEmpty()
    .withMessage('Recipe ID is required')
    .isMongoId()
    .withMessage('Invalid recipe ID')
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

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    const { recipeId } = req.body;

    // Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if recipe already in collection
    if (collection.recipes.includes(recipeId)) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already in collection'
      });
    }

    collection.recipes.push(recipeId);
    await collection.save();
    await collection.populate('recipes', 'title images prepTime cookTime servings rating dietaryInfo nutrition difficulty cuisine category');

    res.json({
      success: true,
      message: 'Recipe added to collection',
      data: {
        collection
      }
    });
  } catch (error) {
    console.error('Add recipe to collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding recipe to collection'
    });
  }
});

// @route   DELETE /api/collections/:id/recipes/:recipeId
// @desc    Remove recipe from collection
// @access  Private
router.delete('/:id/recipes/:recipeId', authenticateToken, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    collection.recipes = collection.recipes.filter(
      recipeId => recipeId.toString() !== req.params.recipeId
    );
    
    await collection.save();
    await collection.populate('recipes', 'title images prepTime cookTime servings rating dietaryInfo nutrition difficulty cuisine category');

    res.json({
      success: true,
      message: 'Recipe removed from collection',
      data: {
        collection
      }
    });
  } catch (error) {
    console.error('Remove recipe from collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing recipe from collection'
    });
  }
});

module.exports = router;

