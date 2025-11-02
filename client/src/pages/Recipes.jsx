import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRecipes } from '../services/recipeService'
import RecipeSearch from '../components/RecipeSearch'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    category: '',
    difficulty: ''
  })

  useEffect(() => {
    loadRecipes()
  }, [page, filters])

  const loadRecipes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page,
        limit: 24,
        ...filters
      }
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key]
        }
      })
      
      console.log('🔍 Loading recipes with params:', params)
      const response = await getRecipes(params)
      console.log('📦 Full API Response:', response)
      console.log('📦 Response Type:', typeof response)
      console.log('📦 Response Keys:', Object.keys(response))
      console.log('📦 Response.success:', response.success)
      console.log('📦 Response.data:', response.data)
      
      if (response.success) {
        // ✅ CORRECT: Access recipes from response.data.recipes (matches backend structure)
        const recipes = response.data?.recipes || response.recipes || [];
        const totalPages = response.data?.pagination?.totalPages || response.data?.totalPages || response.pagination?.totalPages || 1;
        
        console.log(`✅ Loaded ${recipes.length} recipes`)
        console.log('📄 Recipes array type:', Array.isArray(recipes))
        console.log('📄 Recipes data:', recipes)
        console.log('📄 First recipe sample:', recipes[0])
        console.log('📄 Pagination data:', response.data?.pagination || response.pagination)
        
        // Verify we're accessing the correct path
        if (!recipes || recipes.length === 0) {
          console.warn('⚠️ API returned success but recipes array is EMPTY')
          console.warn('📋 Checking response structure...')
          console.warn('   - response.success:', response.success)
          console.warn('   - response.data:', response.data)
          console.warn('   - response.data?.recipes:', response.data?.recipes)
          console.warn('   - response.recipes:', response.recipes)
          console.warn('📋 Full response structure:', JSON.stringify(response, null, 2))
          
          // Try to diagnose why it's empty
          if (response.data?.pagination?.totalRecipes === 0) {
            console.warn('⚠️ Backend reports 0 total recipes in database')
            console.warn('💡 Backend needs to be restarted after fixing .env file!')
            console.warn('💡 Run: cd backend && npm start (restart backend)')
          }
        } else {
          console.log('✅ Recipes found! First recipe title:', recipes[0].title)
          console.log('✅ First recipe ID:', recipes[0]._id)
          console.log('✅ First recipe image:', recipes[0].images?.[0]?.url)
        }
        
        setRecipes(recipes)
        setTotalPages(totalPages)
        
        if (recipes.length === 0) {
          console.warn('⚠️ API returned success but no recipes found. Possible causes:')
          console.warn('   1. Backend not restarted after .env fix (CRITICAL!)')
          console.warn('   2. Database is empty - no recipes imported yet')
          console.warn('   3. All recipes are private (isPublic: false)')
          console.warn('   4. Filter criteria too restrictive')
          console.warn('   5. Backend connecting to wrong database (localhost vs Atlas)')
          console.warn('')
          console.warn('🔧 Quick fix: Restart your backend server!')
        }
      } else {
        console.error('❌ API returned error:', response)
        setError(response.message || 'Failed to load recipes')
      }
    } catch (err) {
      console.error('❌ Error loading recipes:', err)
      setError(err.message || 'Failed to load recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(1) // Reset to first page when filters change
  }

  return (
    <div className="container">
      <section className="recipes-page">
        <div className="page-header">
          <h1>All Recipes</h1>
          <p>Browse our collection of {recipes.length > 0 ? 'recipes' : 'delicious recipes'}</p>
        </div>

        <RecipeSearch 
          onFilter={(filterData) => {
            const newFilters = {
              search: filterData.search || '',
              cuisine: '',
              category: filterData.tag && filterData.tag !== 'all' ? filterData.tag : '',
              difficulty: ''
            };
            handleFilterChange(newFilters);
          }}
        />

        {/* Active Filters */}
        {(filters.search || filters.cuisine || filters.category || filters.difficulty) && (
          <div className="active-filters">
            <h3>Active Filters:</h3>
            <div className="filter-tags">
              {filters.search && (
                <span className="filter-tag">
                  Search: "{filters.search}"
                  <button onClick={() => handleFilterChange({ search: '' })}>×</button>
                </span>
              )}
              {filters.cuisine && (
                <span className="filter-tag">
                  Cuisine: {filters.cuisine}
                  <button onClick={() => handleFilterChange({ cuisine: '' })}>×</button>
                </span>
              )}
              {filters.category && (
                <span className="filter-tag">
                  Category: {filters.category}
                  <button onClick={() => handleFilterChange({ category: '' })}>×</button>
                </span>
              )}
              {filters.difficulty && (
                <span className="filter-tag">
                  Difficulty: {filters.difficulty}
                  <button onClick={() => handleFilterChange({ difficulty: '' })}>×</button>
                </span>
              )}
              <button 
                className="btn-small outline" 
                onClick={() => setFilters({ search: '', cuisine: '', category: '', difficulty: '' })}
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-grid">
            {[...Array(12)].map((_, index) => (
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
        ) : error ? (
          <div className="empty-container">
            <div className="empty-message">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Error Loading Recipes</h3>
              <p>{error}</p>
              <button className="btn primary" onClick={loadRecipes}>
                Try Again
              </button>
            </div>
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <div key={recipe._id} className="recipe-card">
                  <Link to={`/recipe/${recipe._id}`} className="recipe-link">
                    <div className="recipe-image-container">
                      <img
                        src={recipe.images?.[0]?.url || `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80`}
                        alt={recipe.title}
                        className="recipe-image"
                        loading="lazy"
                        onError={(e) => {
                          console.error(`❌ Image failed to load for ${recipe.title}:`, e.target.src);
                          e.target.src = `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80`;
                        }}
                        onLoad={() => {
                          console.log(`✅ Image loaded successfully for: ${recipe.title}`);
                        }}
                      />
                      <div className="difficulty-badge">
                        {recipe.difficulty || 'Easy'}
                      </div>
                      <div className="time-badge">
                        <i className="fas fa-clock"></i>
                        {(recipe.prepTime || 0) + (recipe.cookTime || 0)}m
                      </div>
                    </div>
                    <div className="recipe-content">
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <p className="recipe-description">{recipe.description}</p>
                      <div className="recipe-meta">
                        <div className="meta-item">
                          <i className="fas fa-user"></i>
                          <span>{recipe.servings || 4} serving{(recipe.servings || 4) !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-globe"></i>
                          <span>{recipe.cuisine || 'International'}</span>
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-tag"></i>
                          <span>{recipe.category || 'main-course'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="recipe-actions">
                    <Link to={`/recipe/${recipe._id}`} className="btn primary">
                      <i className="fas fa-eye"></i>
                      View Recipe
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                  Previous
                </button>
                <span className="page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}

            <div className="results-info">
              <p>Showing {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
            </div>
          </>
        ) : (
          <div className="empty-container">
            <div className="empty-message">
              <i className="fas fa-search"></i>
              <h3>No Recipes Found</h3>
              <p>Try adjusting your search criteria or filters.</p>
              <button 
                className="btn outline" 
                onClick={() => setFilters({ search: '', cuisine: '', category: '', difficulty: '' })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Recipes

