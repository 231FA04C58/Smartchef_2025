import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getUserProfile, getUserStats } from '../services/userService';
import RecipeCard from '../components/RecipeCard';
import RecipeGrid from '../components/RecipeGrid';

const Profile = () => {
  const { currentUser, user, logout } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        setProfile(response.data.user);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getUserStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    }
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const displayUser = currentUser || user;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {displayUser?.firstName ? (
              displayUser.firstName[0].toUpperCase()
            ) : displayUser?.username ? (
              displayUser.username[0].toUpperCase()
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
          <button onClick={handleEditProfile} className="btn btn-outline btn-sm edit-avatar-btn">
            <i className="fas fa-camera"></i>
          </button>
        </div>
        
        <div className="profile-info">
          <h1>
            {displayUser?.firstName && displayUser?.lastName
              ? `${displayUser.firstName} ${displayUser.lastName}`
              : displayUser?.username || 'User'}
          </h1>
          <p className="profile-email">{displayUser?.email}</p>
          <p className="profile-bio">
            {profile?.bio || 'No bio yet. Click Edit Profile to add one!'}
          </p>
          <div className="profile-actions">
            <button onClick={handleEditProfile} className="btn btn-primary">
              <i className="fas fa-edit"></i> Edit Profile
            </button>
            <button onClick={() => navigate('/recipes/new')} className="btn btn-outline">
              <i className="fas fa-plus"></i> Create Recipe
            </button>
          </div>
        </div>
      </div>

      {stats && (
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-bookmark"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.favoriteRecipes || 0}</div>
              <div className="stat-label">Favorites</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-utensils"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.createdRecipes || 0}</div>
              <div className="stat-label">My Recipes</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.mealPlans || 0}</div>
              <div className="stat-label">Meal Plans</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.reviewsGiven || 0}</div>
              <div className="stat-label">Reviews</div>
            </div>
          </div>
        </div>
      )}

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-home"></i> Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <i className="fas fa-utensils"></i> My Recipes ({profile?.createdRecipes?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          <i className="fas fa-heart"></i> Favorites ({profile?.favoriteRecipes?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <i className="fas fa-cog"></i> Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-section">
              <h2>
                <i className="fas fa-chart-line"></i> Your Activity
              </h2>
              <div className="activity-timeline">
                <div className="activity-item">
                  <div className="activity-icon">
                    <i className="fas fa-utensils"></i>
                  </div>
                  <div className="activity-content">
                    <p>You've created {stats?.createdRecipes || 0} recipes</p>
                    <span className="activity-date">Active contributor</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <div className="activity-content">
                    <p>You've favorited {stats?.favoriteRecipes || 0} recipes</p>
                    <span className="activity-date">Food lover</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <i className="fas fa-calendar"></i>
                  </div>
                  <div className="activity-content">
                    <p>You have {stats?.mealPlans || 0} meal plans</p>
                    <span className="activity-date">Well organized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="recipes-tab">
            {profile?.createdRecipes && profile.createdRecipes.length > 0 ? (
              <RecipeGrid recipes={profile.createdRecipes} />
            ) : (
              <div className="empty-state">
                <i className="fas fa-utensils"></i>
                <h3>No recipes yet</h3>
                <p>Start creating your own recipes!</p>
                <button onClick={() => navigate('/recipes/new')} className="btn btn-primary">
                  <i className="fas fa-plus"></i> Create Your First Recipe
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-tab">
            {profile?.favoriteRecipes && profile.favoriteRecipes.length > 0 ? (
              <RecipeGrid recipes={profile.favoriteRecipes} />
            ) : (
              <div className="empty-state">
                <i className="fas fa-heart"></i>
                <h3>No favorites yet</h3>
                <p>Start favoriting recipes you love!</p>
                <button onClick={() => navigate('/recipes')} className="btn btn-primary">
                  <i className="fas fa-search"></i> Browse Recipes
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <div className="settings-section">
              <h2>
                <i className="fas fa-user-cog"></i> Account Settings
              </h2>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Change Password</h3>
                    <p>Update your account password</p>
                  </div>
                  <button className="btn btn-outline" onClick={() => navigate('/change-password')}>
                    Change
                  </button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Dietary Preferences</h3>
                    <p>Manage your dietary restrictions and preferences</p>
                  </div>
                  <button className="btn btn-outline" onClick={() => navigate('/preferences')}>
                    Manage
                  </button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Privacy Settings</h3>
                    <p>Control your profile visibility</p>
                  </div>
                  <button className="btn btn-outline">
                    Configure
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-section danger-zone">
              <h2>
                <i className="fas fa-exclamation-triangle"></i> Danger Zone
              </h2>
              <div className="danger-item">
                <div className="danger-info">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and all data</p>
                </div>
                <button className="btn btn-danger">
                  <i className="fas fa-trash"></i> Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

