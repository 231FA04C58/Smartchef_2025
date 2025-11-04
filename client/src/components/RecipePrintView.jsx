import { useRef } from 'react';
import { getIngredientName } from '../utils/ingredientHelper';

const RecipePrintView = ({ recipe }) => {
  const printRef = useRef(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = printRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${recipe.title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 2rem; line-height: 1.6; }
            .recipe-header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #333; padding-bottom: 1rem; }
            .recipe-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
            .recipe-meta { display: flex; justify-content: center; gap: 2rem; margin: 1rem 0; }
            .recipe-image { width: 100%; max-width: 600px; margin: 1rem auto; display: block; border-radius: 8px; }
            .section { margin: 2rem 0; }
            .section h2 { font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
            .ingredients-list { list-style: none; }
            .ingredients-list li { padding: 0.5rem 0; border-bottom: 1px dotted #ccc; }
            .instructions-list { list-style: decimal; margin-left: 2rem; }
            .instructions-list li { padding: 0.5rem 0; }
            .nutrition-info { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1rem; }
            .nutrition-item { text-align: center; padding: 1rem; background: #f5f5f5; border-radius: 8px; }
            @media print {
              body { padding: 1rem; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  if (!recipe) return null;

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <div className="recipe-print-view">
      <div className="print-actions no-print">
        <button onClick={handlePrint} className="btn btn-primary">
          <i className="fas fa-print"></i> Print Recipe
        </button>
        <button onClick={() => window.print()} className="btn btn-outline">
          <i className="fas fa-file-pdf"></i> Print as PDF
        </button>
      </div>

      <div ref={printRef} className="printable-recipe">
        <div className="recipe-header">
          <h1>{recipe.title}</h1>
          <p className="recipe-description">{recipe.description}</p>
          <div className="recipe-meta">
            <span><i className="fas fa-clock"></i> {totalTime} min</span>
            <span><i className="fas fa-users"></i> {recipe.servings} servings</span>
            <span><i className="fas fa-signal"></i> {recipe.difficulty || 'Easy'}</span>
            <span><i className="fas fa-globe"></i> {recipe.cuisine}</span>
          </div>
        </div>

        {recipe.images?.[0]?.url && (
          <img 
            src={recipe.images[0].url} 
            alt={recipe.title}
            className="recipe-image"
          />
        )}

        <div className="section">
          <h2><i className="fas fa-list"></i> Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients?.map((ingredient, index) => {
              const ingredientName = getIngredientName(ingredient, index);
              return (
                <li key={index}>
                  <strong>{ingredient.amount} {ingredient.unit}</strong> {ingredientName}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="section">
          <h2><i className="fas fa-tasks"></i> Instructions</h2>
          <ol className="instructions-list">
            {recipe.instructions?.map((instruction, index) => (
              <li key={index}>{instruction.instruction || instruction}</li>
            ))}
          </ol>
        </div>

        {recipe.nutrition && (
          <div className="section">
            <h2><i className="fas fa-chart-pie"></i> Nutrition (per serving)</h2>
            <div className="nutrition-info">
              <div className="nutrition-item">
                <div className="nutrition-value">{recipe.nutrition.calories || 'N/A'}</div>
                <div className="nutrition-label">Calories</div>
              </div>
              <div className="nutrition-item">
                <div className="nutrition-value">{recipe.nutrition.protein || 'N/A'}g</div>
                <div className="nutrition-label">Protein</div>
              </div>
              <div className="nutrition-item">
                <div className="nutrition-value">{recipe.nutrition.carbs || 'N/A'}g</div>
                <div className="nutrition-label">Carbs</div>
              </div>
              <div className="nutrition-item">
                <div className="nutrition-value">{recipe.nutrition.fat || 'N/A'}g</div>
                <div className="nutrition-label">Fat</div>
              </div>
            </div>
          </div>
        )}

        {recipe.dietaryInfo && (
          <div className="section">
            <h2><i className="fas fa-leaf"></i> Dietary Information</h2>
            <div className="dietary-tags">
              {recipe.dietaryInfo.vegetarian && <span className="dietary-tag">Vegetarian</span>}
              {recipe.dietaryInfo.vegan && <span className="dietary-tag">Vegan</span>}
              {recipe.dietaryInfo.glutenFree && <span className="dietary-tag">Gluten-Free</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePrintView;

