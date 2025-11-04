import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById, addToFavorites, removeFromFavorites, addReview } from '../services/recipeService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import RecipeScaling from './RecipeScaling';
import RecipePrintView from './RecipePrintView';
import CookMode from './CookMode';
import NutritionEditor from './NutritionEditor';
import { getIngredientName } from '../utils/ingredientHelper';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [servings, setServings] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showNutritionEditor, setShowNutritionEditor] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [showCookMode, setShowCookMode] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings || 1);
      setIsFavorite(recipe.favorites?.includes(user?._id) || false);
      setRating(recipe.rating?.average || 0);
      setUserRating(recipe.userRating || 0);
    }
  }, [recipe, user]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await getRecipeById(id);
      // Handle both response formats
      const recipeData = response.data?.recipe || response;
      setRecipe(recipeData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        const response = await removeFromFavorites(id);
        if (response.success) {
          setIsFavorite(false);
        }
      } else {
        const response = await addToFavorites(id);
        if (response.success) {
          setIsFavorite(true);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleRatingSubmit = async () => {
    if (!user && !currentUser) {
      showError('Please login to submit a review');
      navigate('/login');
      return;
    }

    if (userRating === 0) {
      showError('Please select a rating');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await addReview(id, {
        rating: userRating,
        comment: review.trim() || ''
      });

      if (response.success) {
        success('Review submitted successfully!');
        setShowReviewForm(false);
        setReview('');
        setUserRating(0);
        await fetchRecipe(); // Refresh recipe data
      } else {
        showError(response.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      showError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleNutritionSave = (updatedRecipe) => {
    setRecipe(updatedRecipe);
    setShowNutritionEditor(false);
  };

  const startTimer = (duration) => {
    setTimerDuration(duration);
    setTimerActive(true);
    setTimer(duration);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setTimer(null);
  };

  useEffect(() => {
    let interval = null;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      // Timer finished - could show notification
      alert('Timer finished!');
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustServings = (factor) => {
    setServings(prev => Math.max(1, Math.round(prev * factor)));
  };

  const getAdjustedIngredient = (ingredient) => {
    if (!ingredient.amount) return ingredient.name;
    const adjustedAmount = (ingredient.amount * servings) / (recipe.servings || 1);
    return `${adjustedAmount} ${ingredient.unit || ''} ${ingredient.name}`.trim();
  };

  if (loading) {
    return (
      <div className="recipe-detail-loading">
        <div className="loading-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-meta"></div>
            <div className="skeleton-tabs"></div>
            <div className="skeleton-body"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-detail-error">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Recipe Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/recipes')} className="btn btn-primary">
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  // Show Cook Mode if enabled
  if (showCookMode) {
    return <CookMode recipe={recipe} onExit={() => setShowCookMode(false)} />;
  }

  // Show Print View if enabled
  if (showPrintView) {
    return <RecipePrintView recipe={recipe} />;
  }

  return (
    <div className="recipe-detail">
      {/* Header with Image */}
      <div className="recipe-header">
        <div className="recipe-image-container">
          {recipe.images?.[0]?.url ? (
            <img 
              src={recipe.images[0].url} 
              alt={recipe.title} 
              className="recipe-image"
              loading="lazy"
              onError={(e) => {
                console.error(`❌ Image failed to load for ${recipe.title}:`, e.target.src);
                e.target.style.display = 'none';
                const placeholder = e.target.nextElementSibling;
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
              onLoad={() => {
                console.log(`✅ Image loaded successfully for: ${recipe.title}`);
              }}
            />
          ) : (
            <div className="recipe-image-placeholder">
              <i className="fas fa-utensils"></i>
              <span>No Image</span>
            </div>
          )}
          <div className="recipe-overlay">
            <button 
              onClick={() => navigate('/recipes')} 
              className="back-btn"
              title="Back to Recipes"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <button 
              onClick={handleFavoriteToggle}
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <i className={`fas fa-heart ${isFavorite ? 'solid' : 'regular'}`}></i>
            </button>
          </div>
        </div>

        <div className="recipe-info">
          <div className="recipe-title-section">
            <div className="recipe-title-row">
              <h1 className="recipe-title">{recipe.title}</h1>
              {user && (recipe.author?._id || recipe.author)?.toString() === (currentUser?.id || currentUser?._id || user?._id)?.toString() && (
                <button
                  onClick={() => navigate(`/recipes/${recipe._id}/edit`)}
                  className="btn btn-outline btn-sm"
                  title="Edit Recipe"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
              )}
            </div>
            <div className="recipe-meta">
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>{recipe.prepTime || 0} min prep</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-fire"></i>
                <span>{recipe.cookTime || 0} min cook</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-users"></i>
                <span>{servings} serving{servings !== 1 ? 's' : ''}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-signal"></i>
                <span>{recipe.difficulty || 'medium'}</span>
              </div>
            </div>
          </div>

          <div className="recipe-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <i 
                  key={star} 
                  className={`fas fa-star ${star <= (recipe.rating?.average || 0) ? 'filled' : ''}`}
                ></i>
              ))}
              <span className="rating-text">({recipe.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          <div className="recipe-description">
            <p>{recipe.description}</p>
          </div>

          <div className="recipe-tags">
            {recipe.tags?.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          {/* Recipe Actions */}
          <div className="recipe-actions-bar">
            <button 
              onClick={handleFavoriteToggle}
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'}`}
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <i className={`fas fa-heart ${isFavorite ? 'solid' : 'regular'}`}></i>
              {isFavorite ? ' Remove from Favorites' : ' Add to Favorites'}
            </button>
            {(user || currentUser) && (
              <button 
                onClick={() => {
                  setActiveTab('reviews');
                  setShowReviewForm(true);
                }}
                className="btn btn-outline"
                title="Write a Review"
              >
                <i className="fas fa-star"></i> Write Review
              </button>
            )}
            <button 
              onClick={() => setShowCookMode(true)}
              className="btn btn-primary"
            >
              <i className="fas fa-utensils"></i> Start Cook Mode
            </button>
            <button 
              onClick={() => setShowPrintView(true)}
              className="btn btn-outline"
            >
              <i className="fas fa-print"></i> Print Recipe
            </button>
          </div>
        </div>
      </div>

      {/* Timer Section */}
      {timerActive && (
        <div className="timer-section">
          <div className="timer-display">
            <i className="fas fa-clock"></i>
            <span className="timer-text">{formatTime(timer)}</span>
            <button onClick={stopTimer} className="timer-stop">
              <i className="fas fa-stop"></i>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="recipe-content">
        {/* Tabs */}
        <div className="recipe-tabs">
          <button 
            className={`tab ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingredients')}
          >
            <i className="fas fa-list"></i>
            Ingredients
          </button>
          <button 
            className={`tab ${activeTab === 'instructions' ? 'active' : ''}`}
            onClick={() => setActiveTab('instructions')}
          >
            <i className="fas fa-clipboard-list"></i>
            Instructions
          </button>
          <button 
            className={`tab ${activeTab === 'nutrition' ? 'active' : ''}`}
            onClick={() => setActiveTab('nutrition')}
          >
            <i className="fas fa-chart-pie"></i>
            Nutrition
          </button>
          <button 
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <i className="fas fa-comments"></i>
            Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'ingredients' && (
            <div className="ingredients-section">
              <RecipeScaling 
                recipe={recipe} 
                onServingsChange={(newServings) => setServings(newServings)}
              />
              <ul className="ingredients-list">
                {recipe.ingredients?.map((ingredient, index) => {
                  const multiplier = servings / (recipe.servings || 1);
                  const scaledAmount = ingredient.amount && typeof ingredient.amount === 'string' && ingredient.amount !== 'to taste'
                    ? (parseFloat(ingredient.amount) * multiplier).toFixed(2)
                    : ingredient.amount;
                  
                  // Get ingredient name using helper function
                  const ingredientName = getIngredientName(ingredient, index);
                  
                  // Build display string
                  let displayText = '';
                  if (scaledAmount && scaledAmount !== 'to taste' && scaledAmount !== '0') {
                    displayText = `${scaledAmount} ${ingredient.unit || ''} ${ingredientName}`.trim();
                  } else if (ingredient.amount === 'to taste' || scaledAmount === 'to taste') {
                    displayText = `${ingredientName} (to taste)`;
                  } else {
                    displayText = ingredientName;
                  }
                  
                  return (
                    <li key={index} className="ingredient-item">
                      <input type="checkbox" id={`ingredient-${index}`} />
                      <label htmlFor={`ingredient-${index}`}>
                        {displayText}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="instructions-section">
              <h3>Cooking Instructions</h3>
              <div className="instructions-list">
                {recipe.instructions?.map((instruction, index) => (
                  <div key={index} className="instruction-step">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-content">
                      <p>{typeof instruction === 'string' ? instruction : (instruction.instruction || instruction.step || instruction.text || '')}</p>
                      {(instruction.duration > 0 || (typeof instruction === 'string' && instruction.includes('minutes'))) && (
                        <button 
                          onClick={() => {
                            const duration = instruction.duration || 0;
                            if (duration > 0) {
                              startTimer(duration * 60);
                            } else {
                              const match = instruction.match(/(\d+)\s*minutes?/i);
                              if (match) {
                                startTimer(parseInt(match[1]) * 60);
                              }
                            }
                          }}
                          className="timer-btn"
                        >
                          <i className="fas fa-clock"></i>
                          Set Timer {instruction.duration > 0 && `(${instruction.duration} min)`}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="nutrition-section">
              <div className="nutrition-section-header">
                <h3>Nutrition Information</h3>
                {(currentUser || user) && (
                  <button
                    onClick={() => setShowNutritionEditor(true)}
                    className="btn btn-outline btn-sm"
                  >
                    <i className="fas fa-edit"></i> {recipe.nutrition ? 'Edit' : 'Add'} Nutrition
                  </button>
                )}
              </div>

              {showNutritionEditor ? (
                <NutritionEditor
                  recipe={recipe}
                  onSave={handleNutritionSave}
                  onCancel={() => setShowNutritionEditor(false)}
                />
              ) : recipe.nutrition ? (
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-label">
                      <i className="fas fa-fire"></i> Calories
                    </span>
                    <span className="nutrition-value">{recipe.nutrition.calories || 0} kcal</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">
                      <i className="fas fa-dumbbell"></i> Protein
                    </span>
                    <span className="nutrition-value">{recipe.nutrition.protein || 0}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">
                      <i className="fas fa-bread-slice"></i> Carbohydrates
                    </span>
                    <span className="nutrition-value">{recipe.nutrition.carbs || 0}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">
                      <i className="fas fa-tint"></i> Fat
                    </span>
                    <span className="nutrition-value">{recipe.nutrition.fat || 0}g</span>
                  </div>
                  {recipe.nutrition.saturatedFat > 0 && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Saturated Fat</span>
                      <span className="nutrition-value">{recipe.nutrition.saturatedFat}g</span>
                    </div>
                  )}
                  <div className="nutrition-item">
                    <span className="nutrition-label">
                      <i className="fas fa-seedling"></i> Fiber
                    </span>
                    <span className="nutrition-value">{recipe.nutrition.fiber || 0}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">
                      <i className="fas fa-candy-cane"></i> Sugar
                    </span>
                    <span className="nutrition-value">{recipe.nutrition.sugar || 0}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">
                      <i className="fas fa-flask"></i> Sodium
                    </span>
                    <span className="nutrition-value">{recipe.nutrition.sodium || 0}mg</span>
                  </div>
                  {recipe.nutrition.cholesterol > 0 && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Cholesterol</span>
                      <span className="nutrition-value">{recipe.nutrition.cholesterol}mg</span>
                    </div>
                  )}
                  {recipe.nutrition.vitaminA > 0 && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Vitamin A</span>
                      <span className="nutrition-value">{recipe.nutrition.vitaminA} IU</span>
                    </div>
                  )}
                  {recipe.nutrition.vitaminC > 0 && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Vitamin C</span>
                      <span className="nutrition-value">{recipe.nutrition.vitaminC}mg</span>
                    </div>
                  )}
                  {recipe.nutrition.calcium > 0 && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Calcium</span>
                      <span className="nutrition-value">{recipe.nutrition.calcium}mg</span>
                    </div>
                  )}
                  {recipe.nutrition.iron > 0 && (
                    <div className="nutrition-item">
                      <span className="nutrition-label">Iron</span>
                      <span className="nutrition-value">{recipe.nutrition.iron}mg</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-nutrition">
                  <i className="fas fa-chart-pie"></i>
                  <p>Nutrition information not available for this recipe.</p>
                  {(currentUser || user) && (
                    <button
                      onClick={() => setShowNutritionEditor(true)}
                      className="btn btn-primary"
                    >
                      <i className="fas fa-plus"></i> Add Nutrition Information
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-section">
              <div className="reviews-header">
                <h3>Reviews ({recipe.reviewCount || 0})</h3>
                {user && (
                  <button 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="btn btn-primary"
                  >
                    Write Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="review-form">
                  <div className="rating-input">
                    <span>Your Rating:</span>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <i 
                          key={star}
                          className={`fas fa-star ${star <= userRating ? 'filled' : ''}`}
                          onClick={() => setUserRating(star)}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review..."
                    rows="4"
                  />
                  <div className="review-actions">
                    <button 
                      onClick={() => {
                        setShowReviewForm(false);
                        setReview('');
                        setUserRating(0);
                      }} 
                      className="btn btn-secondary"
                      disabled={isSubmittingReview}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleRatingSubmit} 
                      className="btn btn-primary"
                      disabled={isSubmittingReview || userRating === 0}
                    >
                      {isSubmittingReview ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check"></i> Submit Review
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="reviews-list">
                {recipe.reviews && recipe.reviews.length > 0 ? (
                  recipe.reviews.map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="reviewer-name">{review.user?.name || review.user?.username || 'Anonymous'}</span>
                          <div className="review-rating">
                            {[1, 2, 3, 4, 5].map(star => (
                              <i 
                                key={star}
                                className={`fas fa-star ${star <= review.rating ? 'filled' : ''}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <span className="review-date">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-reviews">
                    <i className="fas fa-comment-slash"></i>
                    <p>No reviews yet. Be the first to review this recipe!</p>
                    {(!user && !currentUser) && (
                      <button 
                        onClick={() => navigate('/login')}
                        className="btn btn-primary"
                        style={{marginTop: '1rem'}}
                      >
                        <i className="fas fa-sign-in-alt"></i> Login to Write Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
