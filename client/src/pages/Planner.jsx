import { useState, useEffect } from 'react'
import { usePlanner } from '../contexts/PlannerContext'
import { getRecipes } from '../services/recipeService'
import RecipeImage from '../components/RecipeImage'
import ShoppingList from '../components/ShoppingList'

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const Planner = () => {
  const { mealPlan, addToDay, clearPlan, getShoppingList, getRecipeIngredients } = usePlanner()
  const [selectedDay, setSelectedDay] = useState(null)
  const [recipeSearch, setRecipeSearch] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleAddToDay = (day, recipeTitle) => {
    addToDay(day, recipeTitle)
    setSelectedDay(null)
    setRecipeSearch('') // Clear search when recipe is added
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  // Filter recipes based on search
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
    recipe.category?.toLowerCase().includes(recipeSearch.toLowerCase()) ||
    recipe.cuisine?.toLowerCase().includes(recipeSearch.toLowerCase())
  )

  // Close recipe selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectedDay && !e.target.closest('.recipe-selector') && !e.target.closest('.btn-add-recipe')) {
        setSelectedDay(null)
        setRecipeSearch('')
      }
    }
    if (selectedDay) {
      // Use setTimeout to avoid immediate closure
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [selectedDay])

  const loadRecipes = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Loading recipes from API...')
      
      const response = await getRecipes({ limit: 100 })
      console.log('📦 API Response:', response)
      
      if (response.success) {
        console.log(`✅ Loaded ${response.data.recipes.length} recipes`)
        setRecipes(response.data.recipes)
      } else {
        console.error('❌ API Error:', response.message)
        setError(response.message || 'Failed to load recipes')
      }
    } catch (err) {
      console.error('❌ Error loading recipes:', err)
      console.error('   Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      })
      
      // More specific error messages
      if (err.message && err.message.includes('fetch')) {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smartchef-2025.onrender.com';
        setError(`Cannot connect to backend server. Make sure it's running on ${API_BASE_URL}`)
      } else if (err.message) {
        setError(`Error: ${err.message}`)
      } else {
        setError('Failed to load recipes. Please check if the backend is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  const shoppingList = getShoppingList(recipes)

  const handlePrintPlanner = () => {
    window.print()
  }

  return (
    <div className="container planner-page">
      <h1>Weekly Meal Planner</h1>
      <p className="muted">Select recipes for each day to plan your week.</p>

      <div className="planner-grid">
        <aside className="planner-recipes">
          <h3>All Recipes ({loading ? '...' : recipes.length})</h3>
          <p className="muted" style={{marginBottom: '1rem'}}>Click + button on a day to add recipes</p>
          
          {loading ? (
            <div className="loading-message">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading recipes from database...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              <p>{error}</p>
              <button className="btn primary" onClick={loadRecipes} style={{marginTop: '1rem'}}>
                <i className="fas fa-redo"></i> Retry
              </button>
            </div>
          ) : recipes.length === 0 ? (
            <div className="empty-message">
              <i className="fas fa-utensils"></i>
              <p>No recipes found in database.</p>
              <p className="muted" style={{fontSize: '0.875rem', marginTop: '0.5rem'}}>
                Add recipes through the API or import them to MongoDB.
              </p>
            </div>
          ) : (
            <div className="card-grid small">
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="card"
                  title={`${recipe.title} - ${recipe.cuisine} (${recipe.difficulty})`}
                >
                  <RecipeImage 
                    src={recipe.images?.[0]?.url || `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80`} 
                    alt={recipe.title} 
                  />
                  <h4>{recipe.title}</h4>
                  <p className="muted" style={{fontSize: '0.75rem', padding: '0.5rem'}}>
                    {recipe.category} • {recipe.cuisine}
                  </p>
                  <div style={{fontSize: '0.7rem', color: '#666', padding: '0 0.5rem 0.5rem'}}>
                    <i className="fas fa-clock"></i> {(recipe.prepTime + recipe.cookTime)}m
                    <span style={{marginLeft: '0.5rem'}}>
                      <i className="fas fa-users"></i> {recipe.servings}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        <section className="planner">
          <div className="planner-print-header">
            <h2 className="print-title">Weekly Meal Planner</h2>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h2>Your Plan</h2>
            <button 
              className="btn btn-primary no-print" 
              onClick={handlePrintPlanner}
              style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
            >
              <i className="fas fa-print"></i> Print Planner & Shopping List
            </button>
          </div>
          <div className="planner-days">
            {days.map((day) => (
              <div key={day} className="day">
                <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                <div className="slot">
                  {mealPlan[day] ? (
                    <div className="card planner-recipe-card">
                      <button 
                        className="btn-remove no-print" 
                        onClick={(e) => {
                          e.stopPropagation()
                          addToDay(day, null)
                        }}
                        style={{
                          position: 'absolute',
                          top: '0.25rem',
                          right: '0.25rem',
                          background: 'rgba(244, 67, 54, 0.9)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          fontSize: '0.7rem',
                          zIndex: 10
                        }}
                        title="Remove from plan"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <h4 style={{fontSize: '0.9rem', margin: 0, padding: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>{mealPlan[day]}</h4>
                    </div>
                  ) : (
                    <div style={{position: 'relative', width: '100%', height: '100%', zIndex: 1}}>
                      <button
                        className="btn-add-recipe"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDay(selectedDay === day ? null : day)
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'transparent',
                          border: '2px dashed var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem',
                          transition: 'all 0.3s',
                          fontSize: '0.85rem',
                          padding: '0.5rem',
                          position: 'relative',
                          zIndex: 1
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--primary)'
                          e.currentTarget.style.color = 'var(--primary)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)'
                          e.currentTarget.style.color = 'var(--text-muted)'
                        }}
                      >
                        <i className="fas fa-plus" style={{fontSize: '1.2rem'}}></i>
                        <span>Add</span>
                      </button>
                      {selectedDay === day && (
                        <div 
                          className="recipe-selector"
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 0.5rem)',
                            left: 0,
                            right: 0,
                            background: 'var(--bg-card)',
                            border: '2px solid var(--primary)',
                            borderRadius: '8px',
                            padding: '1rem',
                            width: '100%',
                            minWidth: '280px',
                            maxWidth: '400px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            zIndex: 1000,
                            boxShadow: '0 4px 12px var(--shadow)'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{marginBottom: '0.75rem', fontWeight: '600', color: 'var(--primary)'}}>
                            Select a recipe:
                          </div>
                          <input
                            type="text"
                            placeholder="Search recipes..."
                            value={recipeSearch}
                            onChange={(e) => setRecipeSearch(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              marginBottom: '0.75rem',
                              border: '2px solid var(--border)',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                              background: 'var(--bg)',
                              color: 'var(--text)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div style={{maxHeight: '280px', overflowY: 'auto'}}>
                            {filteredRecipes.length > 0 ? (
                              filteredRecipes.map((recipe) => (
                                <button
                                  key={recipe._id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAddToDay(day, recipe.title)
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    marginBottom: '0.5rem',
                                    background: 'var(--bg)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                    fontSize: '0.9rem'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'var(--primary)'
                                    e.currentTarget.style.color = 'white'
                                    e.currentTarget.style.borderColor = 'var(--primary)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'var(--bg)'
                                    e.currentTarget.style.color = 'var(--text)'
                                    e.currentTarget.style.borderColor = 'var(--border)'
                                  }}
                                >
                                  {recipe.title}
                                </button>
                              ))
                            ) : (
                              <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem'}}>
                                No recipes found matching "{recipeSearch}"
                              </p>
                            )}
                          </div>
                          {filteredRecipes.length > 0 && (
                            <p style={{fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center'}}>
                              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="planner-actions no-print">
            <button className="btn outline" onClick={clearPlan}>Clear Plan</button>
          </div>
        </section>

        {/* Enhanced Shopping List */}
        <section className="shopping-list-section">
          <ShoppingList />
        </section>
      </div>
    </div>
  )
}

export default Planner

