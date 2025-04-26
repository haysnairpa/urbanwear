import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchProducts, fetchProductsByCategory } from '../utils/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get category from URL params or default to 'all'
  const initialCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState('default');
  
  // Fetch products based on selected category
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        let data;
        
        if (selectedCategory === 'all') {
          data = await fetchProducts();
        } else {
          data = await fetchProductsByCategory(selectedCategory);
        }
        
        setProducts(data);
        setFilteredProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        setIsLoading(false);
      }
    };
    
    getProducts();
    
    // Update URL params when category changes
    if (selectedCategory === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: selectedCategory });
    }
  }, [selectedCategory, setSearchParams]);
  
  // Sort products when sort option changes
  useEffect(() => {
    if (products.length === 0) return;
    
    let sorted = [...products];
    
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default sorting (no change)
        break;
    }
    
    setFilteredProducts(sorted);
  }, [sortOption, products]);
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Shop All Products</h1>
          <p className="text-gray-600">
            Browse our collection of high-quality products
          </p>
        </div>
        
        {/* Filter and Sort Bar */}
        <FilterBar 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortOption={sortOption}
          setSortOption={setSortOption}
          setIsLoading={setIsLoading}
        />
        
        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">
              We couldn't find any products matching your criteria. Try changing your filters.
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        
        {/* Product Count */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-gray-500">
            Showing {filteredProducts.length} products
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
