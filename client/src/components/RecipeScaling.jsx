import { useState, useMemo } from 'react';

const RecipeScaling = ({ recipe, onServingsChange }) => {
  const [servings, setServings] = useState(recipe.servings || 4);
  const [multiplier, setMultiplier] = useState(1);

  useMemo(() => {
    const mult = servings / (recipe.servings || 4);
    setMultiplier(mult);
    if (onServingsChange) {
      onServingsChange(servings);
    }
  }, [servings, recipe.servings, onServingsChange]);

  const adjustServings = (delta) => {
    const newServings = Math.max(1, servings + delta);
    setServings(newServings);
  };

  const setCustomServings = (value) => {
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setServings(num);
    }
  };

  const scaleIngredient = (amount) => {
    if (!amount || amount === 'to taste' || amount === 'as needed') {
      return amount;
    }
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    const scaled = (num * multiplier).toFixed(2);
    // Clean up trailing zeros
    return parseFloat(scaled).toString();
  };

  return (
    <div className="recipe-scaling">
      <div className="scaling-controls">
        <label>
          <i className="fas fa-users"></i> Servings:
        </label>
        <div className="servings-controls">
          <button 
            className="btn btn-sm"
            onClick={() => adjustServings(-1)}
            disabled={servings <= 1}
          >
            <i className="fas fa-minus"></i>
          </button>
          <input
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setCustomServings(e.target.value)}
            className="servings-input"
          />
          <button 
            className="btn btn-sm"
            onClick={() => adjustServings(1)}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        <div className="quick-buttons">
          <button className="btn btn-sm" onClick={() => setServings(2)}>2</button>
          <button className="btn btn-sm" onClick={() => setServings(4)}>4</button>
          <button className="btn btn-sm" onClick={() => setServings(6)}>6</button>
          <button className="btn btn-sm" onClick={() => setServings(8)}>8</button>
        </div>
      </div>

      {multiplier !== 1 && (
        <div className="scaling-info">
          <i className="fas fa-info-circle"></i>
          {multiplier > 1 ? 'Increased' : 'Decreased'} by {Math.abs((multiplier - 1) * 100).toFixed(0)}%
        </div>
      )}

      {/* Scaled Ingredients List */}
      <div className="scaled-ingredients">
        <h3>Ingredients (for {servings} servings):</h3>
        <ul>
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index}>
              <strong>{scaleIngredient(ingredient.amount)} {ingredient.unit}</strong> {ingredient.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeScaling;

