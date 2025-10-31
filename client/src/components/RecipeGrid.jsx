import { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { getRecipes, getPopularRecipes, getQuickRecipes, getHealthyRecipes } from '../services/recipeService';

const RecipeGrid = ({ 
  recipes: recipesProp,
  type = 'all', 
  filters = {}, 
  showNutrition = false,
  showQuickActions = true,
  limit = 12 
}) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // If recipes are passed as prop, use them directly
  useEffect(() => {
    if (recipesProp !== undefined) {
      setRecipes(Array.isArray(recipesProp) ? recipesProp : []);
      setLoading(false);
      setError(null);
      setPagination(null);
      return;
    }
    // Only load recipes if recipesProp is undefined
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipesProp, type, filters, limit]);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      
      switch (type) {
        case 'popular':
          response = await getPopularRecipes(limit);
          break;
        case 'quick':
          response = await getQuickRecipes(limit);
          break;
        case 'healthy':
          response = await getHealthyRecipes(limit);
          break;
        case 'search':
          response = await getRecipes({ ...filters, limit });
          break;
        default:
          response = await getRecipes({ limit });
      }

      if (response.success) {
        setRecipes(response.data.recipes);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to load recipes');
      }
    } catch (error) {
      console.error('Load recipes error:', error);
      setError(error.message || 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadRecipes();
  };

  if (loading) {
    return (
      <div className="recipe-grid-container">
        <div className="loading-grid">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="recipe-card-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-description"></div>
                <div className="skeleton-meta"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Failed to Load Recipes</h3>
          <p>{error}</p>
          <button className="btn primary" onClick={handleRetry}>
            <i className="fas fa-redo"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="empty-container">
        <div className="empty-message">
          <i className="fas fa-utensils"></i>
          <h3>No Recipes Found</h3>
          <p>Try adjusting your search criteria or browse our popular recipes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-grid-container">
      <div className="recipe-grid">
        {recipes
          .filter(recipe => recipe && recipe._id)
          .map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              showNutrition={showNutrition}
              showQuickActions={showQuickActions}
            />
          ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn secondary"
            disabled={!pagination.hasPrev}
            onClick={() => {
              // Handle pagination
              const newFilters = { ...filters, page: pagination.currentPage - 1 };
              loadRecipes();
            }}
          >
            <i className="fas fa-chevron-left"></i>
            Previous
          </button>

          <div className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
            <span className="total-recipes">
              ({pagination.totalRecipes} recipes)
            </span>
          </div>

          <button
            className="btn secondary"
            disabled={!pagination.hasNext}
            onClick={() => {
              // Handle pagination
              const newFilters = { ...filters, page: pagination.currentPage + 1 };
              loadRecipes();
            }}
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeGrid;
