import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserStats } from '../services/userService';
import { getRecipes, getRecentlyViewed } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';
import RecipeGrid from '../components/RecipeGrid';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recentRes, trendingRes, viewedRes] = await Promise.all([
        getUserStats(),
        getRecipes({ sort: 'newest', limit: 6 }),
        getRecipes({ sort: 'popular', limit: 6 }),
        getRecentlyViewed().catch(() => ({ success: false })) // Don't fail if not available
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }

      if (recentRes.success) {
        setRecentRecipes(recentRes.data.recipes || []);
      }

      if (trendingRes.success) {
        setTrendingRecipes(trendingRes.data.recipes || []);
      }

      if (viewedRes.success) {
        setRecentlyViewed(viewedRes.data.recentlyViewed?.map(item => item.recipe).filter(Boolean) || []);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back{currentUser?.firstName ? `, ${currentUser.firstName}` : ''}!</h1>
          <p>Here's what's happening with your recipes today</p>
        </div>
        <div className="dashboard-actions">
          <button onClick={() => navigate('/recipes/new')} className="btn btn-primary">
            <i className="fas fa-plus"></i> Create Recipe
          </button>
        </div>
      </div>

      {stats && (
        <div className="dashboard-stats">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <i className="fas fa-heart"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.favoriteRecipes || 0}</div>
              <div className="stat-label">Favorite Recipes</div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.createdRecipes || 0}</div>
              <div className="stat-label">My Recipes</div>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.mealPlans || 0}</div>
              <div className="stat-label">Meal Plans</div>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.reviewsGiven || 0}</div>
              <div className="stat-label">Reviews Given</div>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-fire"></i> Trending Recipes
            </h2>
            <button onClick={() => navigate('/recipes?sort=popular')} className="btn-link">
              View All <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          {trendingRecipes.length > 0 ? (
            <div className="recipe-grid-compact">
              {trendingRecipes.map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p className="empty-message">No trending recipes found</p>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-clock"></i> Recent Recipes
            </h2>
            <button onClick={() => navigate('/recipes?sort=newest')} className="btn-link">
              View All <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          {recentRecipes.length > 0 ? (
            <div className="recipe-grid-compact">
              {recentRecipes.map(recipe => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p className="empty-message">No recent recipes found</p>
          )}
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-history"></i> Recently Viewed
            </h2>
            <span className="section-subtitle">Continue where you left off</span>
          </div>
          <RecipeGrid recipes={recentlyViewed.slice(0, 6)} />
        </div>
      )}

      <div className="dashboard-quick-actions">
        <h2>
          <i className="fas fa-bolt"></i> Quick Actions
        </h2>
        <div className="quick-actions-grid">
          <button onClick={() => navigate('/recipes/new')} className="quick-action-card">
            <i className="fas fa-plus-circle"></i>
            <h3>Create Recipe</h3>
            <p>Add your own recipe</p>
          </button>
          <button onClick={() => navigate('/planner')} className="quick-action-card">
            <i className="fas fa-calendar-check"></i>
            <h3>Meal Planner</h3>
            <p>Plan your meals</p>
          </button>
          <button onClick={() => navigate('/recipes')} className="quick-action-card">
            <i className="fas fa-search"></i>
            <h3>Browse Recipes</h3>
            <p>Discover new dishes</p>
          </button>
          <button onClick={() => navigate('/collections')} className="quick-action-card">
            <i className="fas fa-folder"></i>
            <h3>My Collections</h3>
            <p>Organize recipes</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

