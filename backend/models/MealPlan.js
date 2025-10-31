const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Meal plan name is required'],
    trim: true,
    maxlength: [100, 'Meal plan name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  meals: [{
    date: {
      type: Date,
      required: true
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
      required: true
    },
    servings: {
      type: Number,
      default: 1,
      min: 1
    },
    notes: {
      type: String,
      maxlength: [200, 'Notes cannot exceed 200 characters']
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  shoppingList: [{
    ingredient: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: String,
      required: true,
      trim: true
    },
    unit: {
      type: String,
      trim: true
    },
    isPurchased: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ['produce', 'meat', 'dairy', 'pantry', 'frozen', 'other'],
      default: 'other'
    }
  }],
  preferences: {
    dietaryRestrictions: [String],
    allergies: [String],
    budget: {
      type: Number,
      min: 0
    },
    servingsPerMeal: {
      type: Number,
      default: 1,
      min: 1
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for better query performance
mealPlanSchema.index({ user: 1, startDate: 1, endDate: 1 });
mealPlanSchema.index({ 'meals.date': 1, 'meals.mealType': 1 });

// Method to generate shopping list from meals
mealPlanSchema.methods.generateShoppingList = function() {
  const ingredientMap = new Map();
  
  this.meals.forEach(meal => {
    if (meal.recipe && meal.recipe.ingredients) {
      meal.recipe.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key);
          // Simple addition logic - in real app, you'd want more sophisticated unit conversion
          existing.amount = `${parseFloat(existing.amount) + parseFloat(ingredient.amount)}`;
        } else {
          ingredientMap.set(key, {
            ingredient: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit || '',
            isPurchased: false,
            category: 'other'
          });
        }
      });
    }
  });
  
  this.shoppingList = Array.from(ingredientMap.values());
  return this.save();
};

// Method to get meals for a specific date
mealPlanSchema.methods.getMealsForDate = function(date) {
  return this.meals.filter(meal => {
    const mealDate = new Date(meal.date);
    const targetDate = new Date(date);
    return mealDate.toDateString() === targetDate.toDateString();
  });
};

module.exports = mongoose.model('MealPlan', mealPlanSchema);
