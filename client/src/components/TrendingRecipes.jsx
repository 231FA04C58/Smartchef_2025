import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import { API_BASE_URL } from '../config/api';

const TrendingRecipes = () => {
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingRecipes();
  }, []);

  const loadTrendingRecipes = async () => {
    try {
      // Get recipes sorted by viewCount or favorites
      const response = await fetch(`${API_BASE_URL}/recipes?limit=8&sortBy=viewCount`);
      const data = await response.json();
      
      if (data.success) {
        // Sort by trending score (viewCount + favorites)
        const scored = data.data.recipes.map(recipe => ({
          ...recipe,
          trendingScore: (recipe.viewCount || 0) + (recipe.favorites?.length || 0) * 5
        })).sort((a, b) => b.trendingScore - a.trendingScore);
        
        setTrendingRecipes(scored.slice(0, 6));
      }
    } catch (error) {
      console.error('Error loading trending recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="trending-recipes">
        <div className="container">
          <div className="section-header">
            <h2>
              <i className="fas fa-fire"></i> Trending Now
            </h2>
            <p>Most popular recipes this week</p>
          </div>
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="recipe-card-skeleton"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (trendingRecipes.length === 0) return null;

  return (
    <section className="trending-recipes">
      <div className="container">
        <div className="section-header">
          <h2>
            <i className="fas fa-fire"></i> Trending Now
          </h2>
          <p>Most popular recipes this week</p>
          <Link to="/recipes" className="view-all-link">
            View All <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        
        <div className="trending-grid">
          {trendingRecipes.map((recipe, index) => (
            <div key={recipe._id} className="trending-item">
              <div className="trending-rank">{index + 1}</div>
              <RecipeCard recipe={recipe} showQuickActions={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingRecipes;

