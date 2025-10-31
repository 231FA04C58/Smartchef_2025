import React from 'react';

const RecipeImage = ({ src, alt, className = '' }) => {
  if (!src) {
    return (
      <div className={`recipe-image-placeholder ${className}`}>
        <i className="fas fa-utensils"></i>
        <span>No Image</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`recipe-image ${className}`}
      onError={(e) => {
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  );
};

export default RecipeImage;