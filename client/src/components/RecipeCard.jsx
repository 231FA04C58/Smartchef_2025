import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePlanner } from '../contexts/PlannerContext';
import { addToFavorites, removeFromFavorites, formatTime, formatDifficulty, getDietaryBadges, calculateNutritionPerServing } from '../services/recipeService';

const RecipeCard = ({ recipe, showNutrition = false, showQuickActions = true }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  
  // Get planner context - should be available since it's wrapped in PlannerProvider
  const planner = usePlanner();
  
  // Get today's day name
  const getTodayDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const totalTime = recipe.prepTime + recipe.cookTime;
  const dietaryBadges = getDietaryBadges(recipe.dietaryInfo || {});
  const nutritionPerServing = calculateNutritionPerServing(recipe.nutrition, recipe.servings);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorited) {
        const response = await removeFromFavorites(recipe._id);
        if (response.success) {
          setIsFavorited(false);
          success('Removed from favorites');
        } else {
          showError(response.message || 'Failed to remove from favorites');
        }
      } else {
        const response = await addToFavorites(recipe._id);
        if (response.success) {
          setIsFavorited(true);
          success('Added to favorites!');
        } else {
          showError(response.message || 'Failed to add to favorites');
        }
      }
    } catch (error) {
      console.error('Favorite error:', error);
      showError(error.message || 'Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/recipe/${recipe._id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#757575';
    }
  };

  const getTimeColor = (minutes) => {
    if (minutes <= 15) return '#4CAF50';
    if (minutes <= 30) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="recipe-card glow-on-hover" onClick={handleCardClick}>
      {/* Recipe Image */}
      <div className="recipe-image-container">
        {!imageError ? (
          <img
            src={recipe.images?.[0]?.url || `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80`}
            alt={recipe.title}
            className="recipe-image"
            onError={handleImageError}
          />
        ) : (
          <div className="recipe-image-placeholder">
            <i className="fas fa-utensils"></i>
            <span>No Image</span>
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <div className="recipe-overlay">
            <button
              className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={handleFavorite}
              disabled={isLoading}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <i className={`fas ${isFavorited ? 'fa-heart' : 'fa-heart-o'}`}></i>
            </button>
            
            <div className="recipe-stats">
              <span className="rating">
                <i className="fas fa-star"></i>
                {recipe.rating?.average?.toFixed(1) || '0.0'}
              </span>
              <span className="views">
                <i className="fas fa-eye"></i>
                {recipe.viewCount || 0}
              </span>
            </div>
          </div>
        )}

        {/* Difficulty Badge */}
        <div 
          className="difficulty-badge"
          style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
        >
          {formatDifficulty(recipe.difficulty)}
        </div>

        {/* Time Badge */}
        <div 
          className="time-badge"
          style={{ backgroundColor: getTimeColor(totalTime) }}
        >
          <i className="fas fa-clock"></i>
          {formatTime(totalTime)}
        </div>
      </div>

      {/* Recipe Content */}
      <div className="recipe-content">
        <div className="recipe-header">
          <h3 className="recipe-title">{recipe.title || 'Untitled Recipe'}</h3>
          <p className="recipe-description">{recipe.description || 'No description available'}</p>
        </div>

        {/* Recipe Meta */}
        <div className="recipe-meta">
          <div className="meta-item">
            <i className="fas fa-user"></i>
            <span>{recipe.servings || 1} serving{(recipe.servings || 1) !== 1 ? 's' : ''}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-globe"></i>
            <span>{recipe.cuisine || 'N/A'}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-tag"></i>
            <span>{recipe.category || 'N/A'}</span>
          </div>
        </div>

        {/* Dietary Badges */}
        {dietaryBadges.length > 0 && (
          <div className="dietary-badges">
            {dietaryBadges.slice(0, 3).map((badge, index) => (
              <span key={index} className="dietary-badge">
                {badge}
              </span>
            ))}
            {dietaryBadges.length > 3 && (
              <span className="dietary-badge more">
                +{dietaryBadges.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Nutrition Info */}
        {showNutrition && nutritionPerServing && (
          <div className="nutrition-preview">
            <div className="nutrition-item">
              <span className="nutrition-value">{nutritionPerServing.calories}</span>
              <span className="nutrition-label">cal</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-value">{nutritionPerServing.protein}g</span>
              <span className="nutrition-label">protein</span>
            </div>
            <div className="nutrition-item">
              <span className="nutrition-value">{nutritionPerServing.carbs}g</span>
              <span className="nutrition-label">carbs</span>
            </div>
          </div>
        )}

        {/* Author Info */}
        {recipe.author && (
          <div className="recipe-author">
            <div className="author-avatar">
              <i className="fas fa-user"></i>
            </div>
            <div className="author-info">
              <span className="author-name">
                {recipe.author.firstName ? 
                  `${recipe.author.firstName} ${recipe.author.lastName}` : 
                  recipe.author.username
                }
              </span>
              <span className="recipe-date">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* AI Generated Badge */}
        {recipe.isAIGenerated && (
          <div className="ai-badge">
            <i className="fas fa-robot"></i>
            <span>AI Generated</span>
          </div>
        )}
      </div>

      {/* Recipe Actions */}
      <div className="recipe-actions">
        <button className="btn primary" onClick={handleCardClick}>
          <i className="fas fa-eye"></i>
          View Recipe
        </button>
        <button className="btn secondary" onClick={(e) => {
          e.stopPropagation();
          if (!currentUser) {
            navigate('/login');
            return;
          }
          try {
            if (planner && planner.addToDay) {
              planner.addToDay(getTodayDay(), recipe.title);
              success(`Added "${recipe.title}" to meal plan!`);
            } else {
              // Navigate to planner page instead
              navigate('/planner');
              success('Navigate to planner to add recipes');
            }
          } catch (error) {
            console.error('Error adding to plan:', error);
            showError('Failed to add to meal plan');
          }
        }}>
          <i className="fas fa-calendar-plus"></i>
          Add to Plan
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
