import { useState } from 'react';

const CategoryFilters = ({ onFilterChange, activeFilters = {} }) => {
  const categories = [
    { id: 'all', name: 'All', icon: 'fas fa-th', color: '#6c757d' },
    { id: 'main-course', name: 'Main Course', icon: 'fas fa-utensils', color: '#ff7f50' },
    { id: 'appetizer', name: 'Appetizers', icon: 'fas fa-wine-glass', color: '#6cb6ff' },
    { id: 'dessert', name: 'Desserts', icon: 'fas fa-birthday-cake', color: '#ff6b9d' },
    { id: 'breakfast', name: 'Breakfast', icon: 'fas fa-coffee', color: '#ffc107' },
    { id: 'soup', name: 'Soups', icon: 'fas fa-bowl-food', color: '#17a2b8' },
    { id: 'salad', name: 'Salads', icon: 'fas fa-leaf', color: '#28a745' },
    { id: 'drink', name: 'Drinks', icon: 'fas fa-glass-water', color: '#007bff' }
  ];

  const cuisines = [
    { id: 'all', name: 'All Cuisines', flag: '🌍' },
    { id: 'Indian', name: 'Indian', flag: '🇮🇳' },
    { id: 'Italian', name: 'Italian', flag: '🇮🇹' },
    { id: 'Chinese', name: 'Chinese', flag: '🇨🇳' },
    { id: 'Mexican', name: 'Mexican', flag: '🇲🇽' },
    { id: 'Japanese', name: 'Japanese', flag: '🇯🇵' },
    { id: 'Thai', name: 'Thai', flag: '🇹🇭' },
    { id: 'American', name: 'American', flag: '🇺🇸' },
    { id: 'French', name: 'French', flag: '🇫🇷' },
    { id: 'Korean', name: 'Korean', flag: '🇰🇷' }
  ];

  const handleCategoryClick = (categoryId) => {
    onFilterChange({ ...activeFilters, category: categoryId === 'all' ? null : categoryId });
  };

  const handleCuisineClick = (cuisineId) => {
    onFilterChange({ ...activeFilters, cuisine: cuisineId === 'all' ? null : cuisineId });
  };

  return (
    <div className="category-filters">
      {/* Category Filters */}
      <div className="filter-section">
        <h3 className="filter-section-title">
          <i className="fas fa-filter"></i> Categories
        </h3>
        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-card ${activeFilters.category === category.id ? 'active' : ''} ${activeFilters.category === null && category.id === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              style={{ '--category-color': category.color }}
            >
              <div className="category-icon">
                <i className={category.icon}></i>
              </div>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Filters */}
      <div className="filter-section">
        <h3 className="filter-section-title">
          <i className="fas fa-globe"></i> Cuisines
        </h3>
        <div className="cuisine-grid">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine.id}
              className={`cuisine-card ${activeFilters.cuisine === cuisine.id ? 'active' : ''} ${activeFilters.cuisine === null && cuisine.id === 'all' ? 'active' : ''}`}
              onClick={() => handleCuisineClick(cuisine.id)}
            >
              <span className="cuisine-flag">{cuisine.flag}</span>
              <span className="cuisine-name">{cuisine.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilters;

