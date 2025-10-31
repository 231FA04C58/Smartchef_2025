import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { updateRecipe } from '../services/recipeService';

const NutritionEditor = ({ recipe, onSave, onCancel }) => {
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [nutrition, setNutrition] = useState({
    calories: recipe.nutrition?.calories || 0,
    protein: recipe.nutrition?.protein || 0,
    carbs: recipe.nutrition?.carbs || 0,
    fat: recipe.nutrition?.fat || 0,
    fiber: recipe.nutrition?.fiber || 0,
    sugar: recipe.nutrition?.sugar || 0,
    sodium: recipe.nutrition?.sodium || 0,
    cholesterol: recipe.nutrition?.cholesterol || 0,
    saturatedFat: recipe.nutrition?.saturatedFat || 0,
    vitaminA: recipe.nutrition?.vitaminA || 0,
    vitaminC: recipe.nutrition?.vitaminC || 0,
    calcium: recipe.nutrition?.calcium || 0,
    iron: recipe.nutrition?.iron || 0
  });

  const handleChange = (field, value) => {
    setNutrition(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSave = async () => {
    if (!currentUser) {
      showError('Please login to edit nutrition');
      return;
    }

    // Check if user owns the recipe
    const recipeAuthorId = recipe.author?._id || recipe.author || recipe.authorId;
    const currentUserId = currentUser.id || currentUser._id;
    
    if (recipeAuthorId && recipeAuthorId.toString() !== currentUserId.toString()) {
      showError('You can only edit nutrition for recipes you created');
      return;
    }

    try {
      setIsSaving(true);
      
      const updatedRecipe = await updateRecipe(recipe._id, {
        nutrition: nutrition
      });

      if (updatedRecipe.success) {
        success('Nutrition details updated successfully!');
        if (onSave) {
          onSave(updatedRecipe.data.recipe);
        }
      } else {
        showError(updatedRecipe.message || 'Failed to update nutrition');
      }
    } catch (error) {
      console.error('Update nutrition error:', error);
      showError(error.message || 'Failed to update nutrition details');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="nutrition-editor">
      <div className="nutrition-editor-header">
        <h3>
          <i className="fas fa-edit"></i> Edit Nutrition Information
        </h3>
        <p>Add or update nutritional information for this recipe (per serving)</p>
      </div>

      <div className="nutrition-form">
        <div className="nutrition-form-section">
          <h4>Macronutrients</h4>
          <div className="nutrition-form-grid">
            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-fire"></i> Calories (kcal)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={nutrition.calories}
                onChange={(e) => handleChange('calories', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-dumbbell"></i> Protein (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nutrition.protein}
                onChange={(e) => handleChange('protein', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-bread-slice"></i> Carbohydrates (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nutrition.carbs}
                onChange={(e) => handleChange('carbs', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-tint"></i> Fat (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nutrition.fat}
                onChange={(e) => handleChange('fat', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-leaf"></i> Saturated Fat (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nutrition.saturatedFat}
                onChange={(e) => handleChange('saturatedFat', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-seedling"></i> Fiber (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nutrition.fiber}
                onChange={(e) => handleChange('fiber', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-candy-cane"></i> Sugar (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nutrition.sugar}
                onChange={(e) => handleChange('sugar', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-flask"></i> Cholesterol (mg)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={nutrition.cholesterol}
                onChange={(e) => handleChange('cholesterol', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="nutrition-form-section">
          <h4>Vitamins & Minerals</h4>
          <div className="nutrition-form-grid">
            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-capsules"></i> Sodium (mg)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={nutrition.sodium}
                onChange={(e) => handleChange('sodium', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-pills"></i> Vitamin A (IU)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={nutrition.vitaminA}
                onChange={(e) => handleChange('vitaminA', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-pills"></i> Vitamin C (mg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nutrition.vitaminC}
                onChange={(e) => handleChange('vitaminC', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-bone"></i> Calcium (mg)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={nutrition.calcium}
                onChange={(e) => handleChange('calcium', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="nutrition-form-item">
              <label>
                <i className="fas fa-hammer"></i> Iron (mg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={nutrition.iron}
                onChange={(e) => handleChange('iron', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="nutrition-editor-actions">
        <button
          onClick={onCancel}
          className="btn btn-outline"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="btn btn-primary"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Saving...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i> Save Nutrition Details
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NutritionEditor;

