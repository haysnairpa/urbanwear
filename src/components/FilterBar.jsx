import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchCategories } from '../utils/api';

const FilterBar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  sortOption, 
  setSortOption,
  setIsLoading
}) => {
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Sort options
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];
  
  // Fetch categories from API
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(['all', ...data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(['all', "men's clothing", "women's clothing", 'jewelery', 'electronics']);
      }
    };
    
    getCategories();
  }, []);
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setIsLoading(true);
    setSelectedCategory(category);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  // Format category name for display
  const formatCategoryName = (category) => {
    if (category === 'all') return 'All Products';
    return category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden flex items-center justify-between w-full p-2 border rounded mb-4"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span className="font-medium">Filters</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Categories - Desktop always visible, Mobile conditionally visible */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category 
                    ? 'bg-[#3b82f6] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryChange(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {formatCategoryName(category)}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Sort Dropdown */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block mt-4 md:mt-0`}>
          <label htmlFor="sort" className="block font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className="block w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-[#3b82f6] focus:border-[#3b82f6]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
