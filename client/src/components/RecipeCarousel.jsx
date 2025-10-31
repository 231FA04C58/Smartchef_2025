import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RecipeCarousel = ({ recipes = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || recipes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recipes.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, recipes.length]);

  if (recipes.length === 0) return null;

  const currentRecipe = recipes[currentIndex];

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10s
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % recipes.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="recipe-carousel">
      <div className="carousel-container">
        <div 
          className="carousel-slide"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {recipes.map((recipe, index) => (
            <div key={recipe._id || index} className="carousel-item">
              <div className="carousel-image-wrapper">
                <img
                  src={recipe.images?.[0]?.url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop&q=80'}
                  alt={recipe.title}
                  className="carousel-image"
                />
                <div className="carousel-overlay"></div>
              </div>
              
              <div className="carousel-content">
                <div className="carousel-badges">
                  <span className="carousel-badge cuisine">{recipe.cuisine}</span>
                  <span className="carousel-badge difficulty">{recipe.difficulty || 'Easy'}</span>
                  <span className="carousel-badge time">
                    <i className="fas fa-clock"></i>
                    {recipe.prepTime + recipe.cookTime} min
                  </span>
                </div>
                
                <h2 className="carousel-title">{recipe.title}</h2>
                <p className="carousel-description">{recipe.description}</p>
                
                <div className="carousel-actions">
                  <Link to={`/recipe/${recipe._id}`} className="btn btn-large btn-primary">
                    <i className="fas fa-book-open"></i>
                    View Recipe
                  </Link>
                  <Link to="/recipes" className="btn btn-large btn-outline">
                    <i className="fas fa-utensils"></i>
                    Explore More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {recipes.length > 1 && (
          <>
            <button className="carousel-nav carousel-prev" onClick={goToPrevious}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="carousel-nav carousel-next" onClick={goToNext}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {recipes.length > 1 && (
          <div className="carousel-dots">
            {recipes.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCarousel;

