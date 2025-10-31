import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { createRecipe, updateRecipe, getRecipeById } from '../services/recipeService';

const RecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cuisine: '',
    category: '',
    difficulty: 'medium',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [''],
    tags: [],
    dietaryInfo: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      keto: false,
      paleo: false,
      halal: false,
      kosher: false
    },
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    }
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await getRecipeById(id);
      if (response.success) {
        const recipe = response.data.recipe;
        setFormData({
          title: recipe.title || '',
          description: recipe.description || '',
          cuisine: recipe.cuisine || '',
          category: recipe.category || '',
          difficulty: recipe.difficulty || 'medium',
          prepTime: recipe.prepTime || 0,
          cookTime: recipe.cookTime || 0,
          servings: recipe.servings || 1,
          ingredients: recipe.ingredients?.length > 0 
            ? recipe.ingredients.map(ing => ({
                name: ing.name || '',
                amount: ing.amount || '',
                unit: ing.unit || ''
              }))
            : [{ name: '', amount: '', unit: '' }],
          instructions: recipe.instructions?.length > 0 
            ? recipe.instructions 
            : [''],
          tags: recipe.tags || [],
          dietaryInfo: recipe.dietaryInfo || {},
          nutrition: recipe.nutrition || {}
        });
      }
    } catch (err) {
      console.error('Fetch recipe error:', err);
      showError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
      }));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...formData.ingredients];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: updated }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...formData.instructions];
    updated[index] = value;
    setFormData(prev => ({ ...prev, instructions: updated }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showError('Recipe title is required');
      return;
    }

    if (formData.ingredients.length === 0 || !formData.ingredients[0].name) {
      showError('At least one ingredient is required');
      return;
    }

    if (formData.instructions.length === 0 || !formData.instructions[0].trim()) {
      showError('At least one instruction is required');
      return;
    }

    try {
      setLoading(true);
      
      const recipeData = {
        ...formData,
        ingredients: formData.ingredients
          .filter(ing => ing.name.trim())
          .map(ing => ({
            name: ing.name.trim(),
            amount: ing.amount || '1',
            unit: ing.unit || ''
          })),
        instructions: formData.instructions
          .filter(inst => inst.trim())
          .map(inst => inst.trim()),
        totalTime: formData.prepTime + formData.cookTime
      };

      let response;
      if (isEditing) {
        response = await updateRecipe(id, recipeData);
      } else {
        response = await createRecipe(recipeData);
      }

      if (response.success) {
        success(isEditing ? 'Recipe updated successfully!' : 'Recipe created successfully!');
        navigate(`/recipe/${response.data.recipe._id}`);
      } else {
        showError(response.message || 'Failed to save recipe');
      }
    } catch (err) {
      console.error('Submit error:', err);
      showError(err.message || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="recipe-form-page">
      <div className="form-header">
        <h1>{isEditing ? 'Edit Recipe' : 'Create New Recipe'}</h1>
        <p>Share your delicious recipe with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-section">
          <h2>
            <i className="fas fa-info-circle"></i> Basic Information
          </h2>
          
          <div className="form-group">
            <label>Recipe Title <span className="required">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Classic Chocolate Chip Cookies"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your recipe..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cuisine</label>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                placeholder="e.g., Italian, Mexican"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select category</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="appetizer">Appetizer</option>
                <option value="main-course">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="snack">Snack</option>
                <option value="beverage">Beverage</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prep Time (minutes)</label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Cook Time (minutes)</label>
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Servings</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>
            <i className="fas fa-shopping-basket"></i> Ingredients
          </h2>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                required={index === 0}
                className="ingredient-name"
              />
              <input
                type="text"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                className="ingredient-amount"
              />
              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                className="ingredient-unit"
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="btn btn-outline">
            <i className="fas fa-plus"></i> Add Ingredient
          </button>
        </div>

        <div className="form-section">
          <h2>
            <i className="fas fa-list-ol"></i> Instructions
          </h2>
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="instruction-row">
              <span className="step-number">{index + 1}</span>
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder={`Step ${index + 1}...`}
                rows="3"
                required={index === 0}
                className="instruction-text"
              />
              {formData.instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addInstruction} className="btn btn-outline">
            <i className="fas fa-plus"></i> Add Step
          </button>
        </div>

        <div className="form-section">
          <h2>
            <i className="fas fa-check-square"></i> Dietary Information
          </h2>
          <div className="dietary-checkboxes">
            {Object.keys(formData.dietaryInfo).map(key => (
              <label key={key} className="checkbox-label">
                <input
                  type="checkbox"
                  name={`dietaryInfo.${key}`}
                  checked={formData.dietaryInfo[key]}
                  onChange={handleChange}
                />
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i> {isEditing ? 'Update' : 'Create'} Recipe
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;

