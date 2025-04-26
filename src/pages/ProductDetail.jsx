import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchProductById } from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  
  // Dummy sizes and colors (since the API doesn't provide these)
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Black', value: 'black' },
    { name: 'White', value: 'white' },
    { name: 'Navy', value: 'navy' },
    { name: 'Gray', value: 'gray' }
  ];
  
  // Fetch product details
  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
        setIsLoading(false);
      } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        setError('Failed to load product details. Please try again later.');
        setIsLoading(false);
      }
    };
    
    getProduct();
  }, [id]);
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Add size and color to product for cart
    const productWithOptions = {
      ...product,
      selectedSize,
      selectedColor
    };
    
    addToCart(productWithOptions, quantity);
    
    // Show success message or redirect to cart
    navigate('/cart');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
          <p>Product not found.</p>
        </div>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div 
            className="bg-gray-50 rounded-xl p-8 flex items-center justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={product.image} 
              alt={product.title}
              className="max-h-[400px] object-contain"
            />
          </motion.div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <button onClick={() => navigate('/products')} className="hover:text-[#3b82f6]">
                Products
              </button>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{product.category}</span>
            </div>
            
            {/* Title and Price */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg 
                    key={index}
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${
                      index < Math.round(product.rating?.rate || 0) 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating?.rate || 0} ({product.rating?.count || 0} reviews)
              </span>
            </div>
            
            {/* Price */}
            <p className="text-2xl font-bold text-gray-900 mb-6">
              ${product.price.toFixed(2)}
            </p>
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#3b82f6] bg-blue-50 text-[#3b82f6]'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex flex-wrap gap-3 ">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`cursor-pointer w-8 h-8 rounded-full border-2 ${
                      selectedColor === color.value
                        ? 'border-[#3b82f6]'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="px-4 py-2 text-center w-12">{quantity}</span>
                
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              
              {/* Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                className="flex-1 bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </motion.button>
            </div>
            
            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">SKU</p>
                  <p className="font-medium">UW-{product.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
