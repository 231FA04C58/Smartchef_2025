import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { generateAIRecipe } from '../services/aiRecipeService';
import { API_BASE_URL } from '../config/api';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedRecipe(null);

    try {
      // Generate recipe using AI service
      const recipe = await generateAIRecipe(prompt);
      
      if (recipe) {
        setGeneratedRecipe(recipe);
        success('Recipe generated successfully!');
      } else {
        showError('Failed to generate recipe. Please try again.');
      }
    } catch (err) {
      console.error('AI Generation Error:', err);
      showError('An error occurred while generating the recipe.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!currentUser) {
      showError('Please login to save recipes');
      navigate('/login');
      return;
    }

    if (!generatedRecipe) return;

    try {
      // Convert AI recipe format to our schema format
      const recipeData = {
        title: generatedRecipe.name,
        description: `A delicious ${generatedRecipe.cuisine.toLowerCase()} dish generated from your ingredients: ${prompt}`,
        ingredients: generatedRecipe.ingredients.map((ing, index) => {
          // Parse ingredient string to extract amount, unit, and name
          const parts = ing.trim().split(/\s+/);
          let amount = '1';
          let unit = '';
          let name = ing;

          // Try to parse common patterns like "2 cups", "1 tablespoon", etc.
          if (parts.length >= 2 && !isNaN(parts[0])) {
            amount = parts[0];
            if (['cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp', 'teaspoon', 'teaspoons', 'oz', 'ounce', 'ounces', 'lb', 'pound', 'pounds', 'g', 'gram', 'grams', 'kg', 'kilogram', 'kilograms', 'ml', 'milliliter', 'milliliters', 'l', 'liter', 'liters'].includes(parts[1].toLowerCase())) {
              unit = parts[1];
              name = parts.slice(2).join(' ');
            } else {
              name = parts.slice(1).join(' ');
            }
          }

          return {
            name: name || ing,
            amount: amount,
            unit: unit
          };
        }),
        instructions: generatedRecipe.steps.map((step, index) => ({
          step: index + 1,
          instruction: typeof step === 'string' ? step : (step.description || step.title)
        })),
        prepTime: parseInt(generatedRecipe.prepTime) || 15,
        cookTime: 20,
        totalTime: parseInt(generatedRecipe.prepTime) || 35,
        servings: 4,
        difficulty: generatedRecipe.difficulty?.toLowerCase() || 'medium',
        cuisine: generatedRecipe.cuisine || 'American',
        category: 'main-course',
        tags: [generatedRecipe.cuisine.toLowerCase(), 'ai-generated'],
        nutrition: generatedRecipe.nutrition || {
          calories: 350,
          protein: 25,
          carbs: 30,
          fat: 12,
          fiber: 4,
          sugar: 5,
          sodium: 600
        },
        isAIGenerated: true,
        aiPrompt: prompt
      };

      // Get token from localStorage or AuthContext
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      
      if (!token) {
        showError('Please login to save recipes');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipeData)
      });

      const data = await response.json();

      if (data.success) {
        success('Recipe saved successfully!');
        // Navigate to the new recipe
        setTimeout(() => {
          navigate(`/recipe/${data.data.recipe._id}`);
        }, 1000);
      } else {
        showError(data.message || 'Failed to save recipe');
      }
    } catch (err) {
      console.error('Save Recipe Error:', err);
      showError('An error occurred while saving the recipe.');
    }
  };

  const handleReset = () => {
    setPrompt('');
    setGeneratedRecipe(null);
  };

  return (
    <section className="ai-generator">
      <div className="container">
        <div className="ai-generator-content">
          <div className="ai-header">
            <h2>
              <i className="fas fa-magic"></i> AI Recipe Generator
            </h2>
            <p>Describe what you want to cook or list your ingredients, and our AI will create a custom recipe for you!</p>
          </div>
          
          {!generatedRecipe ? (
            <form onSubmit={handleGenerate} className="ai-form">
              <div className="ai-input-group">
                <label htmlFor="ai-prompt">What would you like to cook?</label>
                <textarea
                  id="ai-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'chicken, rice, vegetables, soy sauce' or 'A healthy vegetarian pasta dish with seasonal vegetables'"
                  rows="4"
                  disabled={isGenerating}
                  className="ai-textarea"
                />
                <div className="ai-examples">
                  <span className="examples-label">Try these examples:</span>
                  <button 
                    type="button"
                    className="example-btn"
                    onClick={() => setPrompt('chicken, bell peppers, onions, garlic, soy sauce')}
                    disabled={isGenerating}
                  >
                    Asian Chicken Stir Fry
                  </button>
                  <button 
                    type="button"
                    className="example-btn"
                    onClick={() => setPrompt('pasta, tomato, basil, garlic, olive oil')}
                    disabled={isGenerating}
                  >
                    Italian Pasta
                  </button>
                  <button 
                    type="button"
                    className="example-btn"
                    onClick={() => setPrompt('salmon, vegetables, lemon, herbs')}
                    disabled={isGenerating}
                  >
                    Healthy Salmon
                  </button>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-large"
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Generating Recipe...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic"></i>
                      Generate Recipe
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="generated-recipe">
              <div className="generated-recipe-header">
                <h3>
                  <i className="fas fa-utensils"></i> Your Generated Recipe
                </h3>
                <div className="recipe-actions">
                  <button onClick={handleReset} className="btn btn-outline">
                    <i className="fas fa-redo"></i> Generate Another
                  </button>
                  <button onClick={handleSaveRecipe} className="btn btn-primary">
                    <i className="fas fa-save"></i> Save Recipe
                  </button>
                </div>
              </div>

              <div className="generated-recipe-content">
                <div className="recipe-name-section">
                  <h2>{generatedRecipe.name}</h2>
                  <div className="recipe-info-badges">
                    <span className="badge">
                      <i className="fas fa-globe"></i> {generatedRecipe.cuisine}
                    </span>
                    <span className="badge">
                      <i className="fas fa-signal"></i> {generatedRecipe.difficulty}
                    </span>
                    <span className="badge">
                      <i className="fas fa-clock"></i> {generatedRecipe.prepTime}
                    </span>
                    <span className="badge">
                      <i className="fas fa-users"></i> {generatedRecipe.servings}
                    </span>
                  </div>
                </div>

                <div className="recipe-section">
                  <h4>
                    <i className="fas fa-list"></i> Ingredients
                  </h4>
                  <ul className="ingredients-list">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="recipe-section">
                  <h4>
                    <i className="fas fa-clipboard-list"></i> Instructions
                  </h4>
                  <ol className="instructions-list">
                    {generatedRecipe.steps.map((step, index) => (
                      <li key={index}>
                        <strong>{typeof step === 'object' && step.title ? step.title : `Step ${index + 1}`}</strong>
                        <p>{typeof step === 'object' ? step.description : step}</p>
                        {typeof step === 'object' && step.time && (
                          <span className="step-time">
                            <i className="fas fa-clock"></i> {step.time}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

                {generatedRecipe.nutrition && (
                  <div className="recipe-section">
                    <h4>
                      <i className="fas fa-chart-pie"></i> Estimated Nutrition (per serving)
                    </h4>
                    <div className="nutrition-grid">
                      <div className="nutrition-item">
                        <span className="nutrition-label">Calories</span>
                        <span className="nutrition-value">{generatedRecipe.nutrition.calories}</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-label">Protein</span>
                        <span className="nutrition-value">{generatedRecipe.nutrition.protein}g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-label">Carbs</span>
                        <span className="nutrition-value">{generatedRecipe.nutrition.carbs}g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-label">Fat</span>
                        <span className="nutrition-value">{generatedRecipe.nutrition.fat}g</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="ai-note">
                  <i className="fas fa-info-circle"></i>
                  <p>This recipe was generated using AI based on your input. Feel free to adjust ingredients and instructions to your taste!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIGenerator;
