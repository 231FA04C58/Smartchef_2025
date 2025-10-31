import { useState, useEffect } from 'react'
import { usePlanner } from '../contexts/PlannerContext'
import { getRecipes } from '../services/recipeService'
import RecipeImage from '../components/RecipeImage'
import ShoppingList from '../components/ShoppingList'

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const Planner = () => {
  const { mealPlan, addToDay, clearPlan, getShoppingList, getRecipeIngredients } = usePlanner()
  const [draggedRecipe, setDraggedRecipe] = useState(null)
  const [dragOverDay, setDragOverDay] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleDragStart = (recipeName) => {
    setDraggedRecipe(recipeName)
  }

  const handleDragOver = (e, day) => {
    e.preventDefault()
    setDragOverDay(day)
  }

  const handleDragLeave = () => {
    setDragOverDay(null)
  }

  const handleDrop = (e, day) => {
    e.preventDefault()
    if (draggedRecipe) {
      addToDay(day, draggedRecipe)
    }
    setDraggedRecipe(null)
    setDragOverDay(null)
  }

  useEffect(() => {
    loadRecipes()
  }, [])

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
        setError('Cannot connect to backend server. Make sure it\'s running on http://localhost:5000')
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

  return (
    <div className="container planner-page">
      <h1>Weekly Meal Planner</h1>
      <p className="muted">Select recipes for each day to plan your week.</p>

      <div className="planner-grid">
        <aside className="planner-recipes">
          <h3>All Recipes ({loading ? '...' : recipes.length})</h3>
          <p className="muted" style={{marginBottom: '1rem'}}>Drag recipes to days to plan your week</p>
          
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
                  draggable="true"
                  onDragStart={() => handleDragStart(recipe.title)}
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
          <h2>Your Plan</h2>
          <div className="planner-days">
            {days.map((day) => (
              <div key={day} className="day">
                <h4>{day.charAt(0).toUpperCase() + day.slice(1)}</h4>
                <div
                  className={`slot ${dragOverDay === day ? 'dragover' : ''}`}
                  onDragOver={(e) => handleDragOver(e, day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  {mealPlan[day] && (
                    <div
                      className="card"
                      draggable="true"
                      onDragStart={() => handleDragStart(mealPlan[day])}
                    >
                      <h4>{mealPlan[day]}</h4>
                      <p className="muted">{getRecipeIngredients(mealPlan[day], recipes)}</p>
                      <button 
                        className="btn-remove" 
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
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                        title="Remove from plan"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="planner-actions">
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

