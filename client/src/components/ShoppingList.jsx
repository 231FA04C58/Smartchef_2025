import { useState, useEffect } from 'react';
import { usePlanner } from '../contexts/PlannerContext';
import { useToast } from '../contexts/ToastContext';
import { API_BASE_URL } from '../config/api';

const ShoppingList = () => {
  const { mealPlan, getShoppingList } = usePlanner();
  const { success } = useToast();
  const [ingredients, setIngredients] = useState([]);
  const [groupedIngredients, setGroupedIngredients] = useState({});
  const [checkedItems, setCheckedItems] = useState(new Set());

  useEffect(() => {
    generateShoppingList();
  }, [mealPlan]);

  const generateShoppingList = async () => {
    try {
      // Fetch all recipes from the meal plan
      const plannedRecipes = Object.values(mealPlan).filter(Boolean);
      const allIngredients = [];

      for (const recipeName of plannedRecipes) {
        const response = await fetch(`${API_BASE_URL}/recipes?search=${encodeURIComponent(recipeName)}&limit=1`);
        const data = await response.json();
        
        if (data.success && data.data.recipes.length > 0) {
          const recipe = data.data.recipes[0];
          if (recipe.ingredients) {
            recipe.ingredients.forEach(ing => {
              allIngredients.push({
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit || '',
                recipe: recipe.title
              });
            });
          }
        }
      }

      // Group ingredients by name
      const grouped = {};
      allIngredients.forEach(ing => {
        const key = ing.name.toLowerCase().trim();
        if (!grouped[key]) {
          grouped[key] = {
            name: ing.name,
            items: []
          };
        }
        grouped[key].items.push(ing);
      });

      // Combine amounts for same ingredients
      const combined = Object.values(grouped).map(group => {
        const totalAmount = group.items.reduce((sum, item) => {
          const amount = parseFloat(item.amount) || 0;
          return sum + amount;
        }, 0);
        
        const units = [...new Set(group.items.map(i => i.unit).filter(Boolean))];
        const recipes = [...new Set(group.items.map(i => i.recipe))];

        return {
          name: group.name,
          amount: totalAmount > 0 ? totalAmount.toString() : 'to taste',
          unit: units.length === 1 ? units[0] : units.join(' or '),
          recipes: recipes
        };
      });

      setIngredients(combined);
      setGroupedIngredients(groupIngredientsByCategory(combined));
    } catch (error) {
      console.error('Error generating shopping list:', error);
    }
  };

  const groupIngredientsByCategory = (ingredients) => {
    const categories = {
      'Produce': ['onion', 'garlic', 'tomato', 'pepper', 'carrot', 'potato', 'lettuce', 'spinach', 'broccoli', 'cauliflower', 'mushroom', 'avocado', 'lemon', 'lime', 'ginger', 'herbs'],
      'Meat & Seafood': ['chicken', 'beef', 'pork', 'lamb', 'fish', 'salmon', 'shrimp', 'crab', 'lobster', 'turkey', 'bacon', 'sausage'],
      'Dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'sour cream', 'parmesan', 'mozzarella', 'cheddar'],
      'Pantry': ['oil', 'flour', 'sugar', 'salt', 'pepper', 'spices', 'rice', 'pasta', 'noodles', 'beans', 'lentils', 'vinegar', 'soy sauce'],
      'Bakery': ['bread', 'tortilla', 'naan', 'roti', 'pita'],
      'Other': []
    };

    const grouped = {};
    ingredients.forEach(ing => {
      const name = ing.name.toLowerCase();
      let category = 'Other';
      
      for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => name.includes(keyword))) {
          category = cat;
          break;
        }
      }

      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(ing);
    });

    return grouped;
  };

  const toggleItem = (index) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  const exportToText = () => {
    const text = ingredients
      .map((ing, index) => `${checkedItems.has(index) ? '✓' : '☐'} ${ing.amount} ${ing.unit} ${ing.name}`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
    success('Shopping list exported!');
  };

  const exportToPDF = () => {
    window.print();
    success('Print shopping list');
  };

  const clearChecked = () => {
    setCheckedItems(new Set());
  };

  return (
    <div className="shopping-list-container">
      <div className="shopping-list-header">
        <h2>
          <i className="fas fa-shopping-cart"></i> Shopping List
        </h2>
        <div className="shopping-list-actions no-print">
          <button onClick={clearChecked} className="btn btn-outline">
            <i className="fas fa-check-square"></i> Clear Checked
          </button>
          <button onClick={exportToText} className="btn btn-outline">
            <i className="fas fa-download"></i> Export Text
          </button>
          <button onClick={exportToPDF} className="btn btn-primary">
            <i className="fas fa-print"></i> Print/PDF
          </button>
        </div>
      </div>

      {ingredients.length === 0 ? (
        <div className="empty-shopping-list">
          <i className="fas fa-shopping-basket"></i>
          <p>No recipes in your meal plan yet.</p>
          <p>Add recipes to your meal plan to generate a shopping list!</p>
        </div>
      ) : (
        <div className="shopping-list-content">
          {Object.entries(groupedIngredients).map(([category, items]) => (
            <div key={category} className="shopping-category">
              <h3 className="category-title">
                <i className="fas fa-tag"></i> {category}
              </h3>
              <ul className="shopping-items">
                {items.map((ingredient, index) => {
                  const itemIndex = ingredients.findIndex(i => 
                    i.name === ingredient.name && 
                    i.amount === ingredient.amount
                  );
                  const isChecked = checkedItems.has(itemIndex);
                  
                  return (
                    <li 
                      key={`${category}-${index}`}
                      className={`shopping-item ${isChecked ? 'checked' : ''}`}
                      onClick={() => toggleItem(itemIndex)}
                    >
                      <div className="item-checkbox">
                        <i className={`fas ${isChecked ? 'fa-check-square' : 'fa-square'}`}></i>
                      </div>
                      <div className="item-content">
                        <span className="item-name">{ingredient.name}</span>
                        <span className="item-amount">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                        {ingredient.recipes.length > 0 && (
                          <span className="item-recipes">
                            {ingredient.recipes.join(', ')}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {ingredients.length > 0 && (
        <div className="shopping-list-summary">
          <p>
            <strong>{ingredients.length}</strong> items total • 
            <strong> {checkedItems.size}</strong> checked
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;

