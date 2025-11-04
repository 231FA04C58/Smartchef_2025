/**
 * Helper function to get ingredient name with fallback handling
 * Fixes cases where ingredient.name is missing or just a number (like "1", "2", "3")
 */
export const getIngredientName = (ingredient, index = 0) => {
  if (!ingredient) return `Ingredient ${index + 1}`;
  
  let ingredientName = ingredient.name || '';
  
  // If name is missing, empty, or is just a number (like "1", "2", "3"), try to reconstruct
  if (!ingredientName || ingredientName.trim() === '' || /^\d+$/.test(ingredientName.trim())) {
    if (typeof ingredient === 'string') {
      ingredientName = ingredient;
    } else {
      // Try to get name from other fields
      ingredientName = ingredient.ingredient || ingredient.text || ingredient.originalName || '';
      
      // If still empty or a number, try to reconstruct from original field
      if (!ingredientName || /^\d+$/.test(ingredientName.trim())) {
        if (ingredient.original || ingredient.originalString) {
          const original = ingredient.original || ingredient.originalString;
          const parts = original.split(/\s+/);
          if (parts.length >= 3) {
            ingredientName = parts.slice(2).join(' ');
          } else {
            ingredientName = parts.slice(1).join(' ') || original;
          }
        }
        
        // Final fallback
        if (!ingredientName || /^\d+$/.test(ingredientName.trim())) {
          ingredientName = `Ingredient ${index + 1}`;
        }
      }
    }
  }
  
  // Ensure ingredient name is not empty
  if (!ingredientName || ingredientName.trim() === '') {
    ingredientName = `Ingredient ${index + 1}`;
  }
  
  return ingredientName;
};

