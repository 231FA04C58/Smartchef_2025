import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getCollections, createCollection, deleteCollection, addRecipeToCollection, removeRecipeFromCollection } from '../services/collectionService';
import { getFavorites } from '../services/recipeService';
import RecipeCard from './RecipeCard';
import RecipeGrid from './RecipeGrid';

const RecipeCollections = () => {
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast();
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Refresh favorites when page becomes visible or window gains focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUser) {
        loadFavorites();
      }
    };

    const handleFocus = () => {
      if (currentUser) {
        loadFavorites();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadCollections(), loadFavorites()]);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCollections = async () => {
    try {
      const response = await getCollections();
      if (response.success) {
        setCollections(response.data.collections || []);
      } else {
        console.error('Collections API error:', response);
        showError(response.message || 'Failed to load collections');
      }
    } catch (error) {
      console.error('Error loading collections:', error);
      showError(error.message || 'Failed to load collections');
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await getFavorites();
      if (response.success) {
        const updatedFavorites = response.data.recipes || [];
        setFavoriteRecipes(updatedFavorites);
        // If currently viewing Favorites collection, update it with fresh data
        if (activeCollection?.name === 'Favorites') {
          setActiveCollection({ name: 'Favorites', recipes: updatedFavorites });
        }
        return updatedFavorites;
      }
      return [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  };

  const createCollectionHandler = async () => {
    if (!newCollectionName.trim()) {
      showError('Please enter a collection name');
      return;
    }

    try {
      const response = await createCollection({ name: newCollectionName.trim() });
      if (response.success) {
        setCollections([...collections, response.data.collection]);
        setNewCollectionName('');
        setShowCreateModal(false);
        setActiveCollection(response.data.collection);
        success('Collection created!');
      }
    } catch (error) {
      console.error('Create collection error:', error);
      showError(error.message || 'Failed to create collection');
    }
  };

  const deleteCollectionHandler = async (collectionId) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) {
      return;
    }

    try {
      const response = await deleteCollection(collectionId);
      if (response.success) {
        setCollections(collections.filter(c => c._id !== collectionId));
        if (activeCollection?._id === collectionId) {
          setActiveCollection(null);
        }
        success('Collection deleted');
      }
    } catch (error) {
      console.error('Delete collection error:', error);
      showError('Failed to delete collection');
    }
  };

  const addRecipeHandler = async (collectionId, recipeId) => {
    try {
      const response = await addRecipeToCollection(collectionId, recipeId);
      if (response.success) {
        // Update collections state
        const updated = collections.map(c => 
          c._id === collectionId ? response.data.collection : c
        );
        setCollections(updated);
        if (activeCollection?._id === collectionId) {
          setActiveCollection(response.data.collection);
        }
        success('Recipe added to collection!');
      }
    } catch (error) {
      console.error('Add recipe error:', error);
      showError(error.message || 'Failed to add recipe');
    }
  };

  const removeRecipeHandler = async (collectionId, recipeId) => {
    try {
      const response = await removeRecipeFromCollection(collectionId, recipeId);
      if (response.success) {
        // Update collections state
        const updated = collections.map(c => 
          c._id === collectionId ? response.data.collection : c
        );
        setCollections(updated);
        if (activeCollection?._id === collectionId) {
          setActiveCollection(response.data.collection);
        }
        success('Recipe removed from collection');
      }
    } catch (error) {
      console.error('Remove recipe error:', error);
      showError('Failed to remove recipe');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading collections...</p>
      </div>
    );
  }

  return (
    <div className="recipe-collections">
      <div className="collections-header">
        <h2>
          <i className="fas fa-folder"></i> My Collections
        </h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="fas fa-plus"></i> New Collection
        </button>
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Collection</h3>
            <input
              type="text"
              placeholder="Collection name (e.g., 'Quick Weeknight Meals')"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createCollectionHandler()}
              className="form-input"
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={createCollectionHandler} className="btn btn-primary">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="collections-layout">
        {/* Collections Sidebar */}
        <div className="collections-sidebar">
          <div 
            className={`collection-item favorites ${activeCollection?.name === 'Favorites' ? 'active' : ''}`} 
            onClick={async () => {
              // Refresh favorites before showing them
              const updatedFavorites = await loadFavorites();
              setActiveCollection({ name: 'Favorites', recipes: updatedFavorites || favoriteRecipes });
            }}
          >
            <i className="fas fa-heart"></i>
            <span>Favorites</span>
            <span className="recipe-count">{favoriteRecipes.length}</span>
          </div>

          {collections.map(collection => (
            <div
              key={collection._id}
              className={`collection-item ${activeCollection?._id === collection._id ? 'active' : ''}`}
              onClick={() => setActiveCollection(collection)}
            >
              <i className="fas fa-folder"></i>
              <span>{collection.name}</span>
              <span className="recipe-count">{collection.recipes?.length || 0}</span>
              <button
                className="delete-collection-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCollectionHandler(collection._id);
                }}
                title="Delete collection"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}

          {collections.length === 0 && (
            <div className="empty-collections">
              <i className="fas fa-folder-open"></i>
              <p>No collections yet</p>
              <p>Create one to organize your recipes!</p>
            </div>
          )}
        </div>

        {/* Collection Content */}
        <div className="collection-content">
          {activeCollection ? (
            <>
              <div className="collection-header">
                <h3>{activeCollection.name}</h3>
                <span className="recipe-count-badge">
                  {activeCollection.recipes?.length || 0} recipe{(activeCollection.recipes?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>

              {(!activeCollection.recipes || activeCollection.recipes.length === 0) ? (
                <div className="empty-collection">
                  <i className="fas fa-utensils"></i>
                  <p>This collection is empty</p>
                  <p>Add recipes from your favorites or search results!</p>
                </div>
              ) : (
                <RecipeGrid recipes={activeCollection.recipes} />
              )}
            </>
          ) : (
            <div className="no-collection-selected">
              <i className="fas fa-hand-pointer"></i>
              <p>Select a collection to view recipes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCollections;
