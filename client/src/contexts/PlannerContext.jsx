import { createContext, useContext, useState, useEffect } from 'react'
import { loadWeeklyMealPlan, saveWeeklyMealPlan } from '../services/mealPlanService'
import { useAuth } from './AuthContext'

const PlannerContext = createContext()

export const usePlanner = () => {
  const context = useContext(PlannerContext)
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerContext')
  }
  return context
}

// Recipe data
const recipesData = [
  { 
    name: 'Creamy Tomato Pasta', 
    ingredients: ['pasta', 'olive oil', 'garlic', 'crushed tomatoes', 'heavy cream', 'parmesan cheese', 'salt', 'pepper', 'fresh basil'] 
  },
  { 
    name: 'Grilled Lemon Salmon', 
    ingredients: ['salmon fillet', 'olive oil', 'lemon', 'garlic', 'dill', 'salt', 'pepper'] 
  },
  { 
    name: 'Avocado Toast Deluxe', 
    ingredients: ['bread', 'avocado', 'lime', 'garlic powder', 'salt', 'pepper', 'red pepper flakes', 'pumpkin seeds'] 
  },
  { 
    name: 'Chicken Caesar Salad', 
    ingredients: ['romaine lettuce', 'chicken breast', 'croutons', 'parmesan cheese', 'caesar dressing'] 
  },
  { 
    name: 'Vegetable Stir Fry', 
    ingredients: ['broccoli', 'carrots', 'bell pepper', 'snap peas', 'ginger', 'soy sauce', 'rice vinegar'] 
  }
]

export const PlannerProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [mealPlan, setMealPlan] = useState({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Load meal plan from database on mount
  useEffect(() => {
    if (currentUser) {
      loadMealPlanFromDB()
    } else {
      setIsLoading(false)
    }
  }, [currentUser])

  const loadMealPlanFromDB = async () => {
    try {
      setIsLoading(true)
      const weeklyPlan = await loadWeeklyMealPlan()
      setMealPlan(weeklyPlan)
    } catch (error) {
      console.error('Failed to load meal plan:', error)
      // Continue with empty plan if load fails
    } finally {
      setIsLoading(false)
    }
  }

  const addToDay = async (day, recipeName) => {
    const updatedPlan = {
      ...mealPlan,
      [day]: recipeName
    }
    setMealPlan(updatedPlan)
    
    // Save to database if user is logged in
    if (currentUser) {
      try {
        setIsSaving(true)
        await saveWeeklyMealPlan(updatedPlan)
      } catch (error) {
        console.error('Failed to save meal plan:', error)
        // Revert on error
        setMealPlan(mealPlan)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const removeFromDay = async (day) => {
    const updatedPlan = {
      ...mealPlan,
      [day]: null
    }
    setMealPlan(updatedPlan)
    
    // Save to database if user is logged in
    if (currentUser) {
      try {
        setIsSaving(true)
        await saveWeeklyMealPlan(updatedPlan)
      } catch (error) {
        console.error('Failed to save meal plan:', error)
        // Revert on error
        setMealPlan(mealPlan)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const clearPlan = async () => {
    if (window.confirm('Are you sure you want to clear your meal plan?')) {
      const emptyPlan = {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null
      }
      setMealPlan(emptyPlan)
      
      // Save to database if user is logged in
      if (currentUser) {
        try {
          setIsSaving(true)
          await saveWeeklyMealPlan(emptyPlan)
        } catch (error) {
          console.error('Failed to clear meal plan:', error)
          // Revert on error
          setMealPlan(mealPlan)
        } finally {
          setIsSaving(false)
        }
      }
    }
  }

  const getShoppingList = (recipesList = []) => {
    const plannedRecipes = Object.values(mealPlan).filter(Boolean)
    const allIngredients = []
    
    plannedRecipes.forEach(recipeName => {
      // Try to find in passed recipes list (from database) first
      const dbRecipe = recipesList.find(r => r.title === recipeName)
      if (dbRecipe && dbRecipe.ingredients) {
        dbRecipe.ingredients.forEach(ing => {
          const ingredientStr = ing.unit ? `${ing.amount} ${ing.unit} ${ing.name}` : `${ing.amount} ${ing.name}`
          if (!allIngredients.includes(ingredientStr)) {
            allIngredients.push(ingredientStr)
          }
        })
      } else {
        // Fallback to hardcoded data
        const recipe = recipesData.find(r => r.name === recipeName)
        if (recipe) {
          recipe.ingredients.forEach(ingredient => {
            if (!allIngredients.includes(ingredient)) {
              allIngredients.push(ingredient)
            }
          })
        }
      }
    })
    
    return allIngredients
  }

  const getRecipeIngredients = (recipeName, recipesList = []) => {
    // Try to find in passed recipes list (from database) first
    const dbRecipe = recipesList.find(r => r.title === recipeName)
    if (dbRecipe && dbRecipe.ingredients && dbRecipe.ingredients.length > 0) {
      return dbRecipe.ingredients.slice(0, 3)
        .map(ing => ing.unit ? `${ing.amount} ${ing.unit} ${ing.name}` : `${ing.amount} ${ing.name}`)
        .join(', ')
    }
    // Fallback to hardcoded data
    const recipe = recipesData.find(r => r.name === recipeName)
    return recipe ? recipe.ingredients.slice(0, 3).join(', ') : ''
  }

  const value = {
    mealPlan,
    addToDay,
    removeFromDay,
    clearPlan,
    getShoppingList,
    getRecipeIngredients,
    recipesData,
    isLoading,
    isSaving,
    refreshMealPlan: loadMealPlanFromDB
  }

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
}

