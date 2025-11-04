import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIngredientName } from '../utils/ingredientHelper';

const QuickViewModal = ({ recipe, isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !recipe) return null;

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const servings = recipe.servings || 4;

  return (
    <div className="quick-view-modal" onClick={onClose}>
      <div className="quick-view-content" onClick={(e) => e.stopPropagation()}>
        <button className="quick-view-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="quick-view-grid">
          {/* Recipe Image */}
          <div className="quick-view-image">
            {!imageError ? (
              <img
                src={recipe.images?.[0]?.url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&q=80'}
                alt={recipe.title}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="recipe-image-placeholder">
                <i className="fas fa-utensils"></i>
              </div>
            )}
            <div className="quick-view-badges">
              <span className="badge">{recipe.difficulty || 'Easy'}</span>
              <span className="badge">
                <i className="fas fa-clock"></i> {totalTime} min
              </span>
              <span className="badge">
                <i className="fas fa-users"></i> {servings} servings
              </span>
            </div>
          </div>

          {/* Recipe Info */}
          <div className="quick-view-info">
            <h2>{recipe.title}</h2>
            <p className="quick-view-description">{recipe.description}</p>

            <div className="quick-view-meta">
              <div className="meta-row">
                <span><i className="fas fa-globe"></i> {recipe.cuisine || 'International'}</span>
                <span><i className="fas fa-tag"></i> {recipe.category || 'Main Course'}</span>
              </div>
              {recipe.rating && recipe.rating.average > 0 && (
                <div className="quick-view-rating">
                  <i className="fas fa-star"></i>
                  <span>{recipe.rating.average.toFixed(1)}</span>
                  <span className="rating-count">({recipe.rating.count} ratings)</span>
                </div>
              )}
            </div>

            {/* Ingredients Preview */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div className="quick-view-ingredients">
                <h3>
                  <i className="fas fa-list"></i> Ingredients
                </h3>
                <ul>
                  {recipe.ingredients.slice(0, 5).map((ingredient, index) => {
                    const ingredientName = getIngredientName(ingredient, index);
                    return (
                      <li key={index}>
                        {ingredient.amount} {ingredient.unit} {ingredientName}
                      </li>
                    );
                  })}
                  {recipe.ingredients.length > 5 && (
                    <li className="more-items">+{recipe.ingredients.length - 5} more ingredients</li>
                  )}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="quick-view-actions">
              <Link to={`/recipe/${recipe._id}`} className="btn btn-primary btn-large">
                <i className="fas fa-book-open"></i> View Full Recipe
              </Link>
              <button className="btn btn-secondary btn-large" onClick={onClose}>
                <i className="fas fa-window-close"></i> Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

