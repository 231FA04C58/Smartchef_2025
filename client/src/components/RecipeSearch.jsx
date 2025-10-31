import React, { useState } from 'react';

const RecipeSearch = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const tags = [
    'all', 'breakfast', 'lunch', 'dinner', 'dessert', 
    'vegetarian', 'vegan', 'gluten-free', 'quick', 'healthy'
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilter({ search: value, tag: selectedTag });
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setSelectedTag(value);
    onFilter({ search: searchTerm, tag: value });
  };

  return (
    <div className="recipe-search">
      <div className="search-controls">
        <div className="search-input-group">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        
        <select
          value={selectedTag}
          onChange={handleTagChange}
          className="tag-filter"
        >
          {tags.map(tag => (
            <option key={tag} value={tag}>
              {tag === 'all' ? 'All Categories' : tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RecipeSearch;