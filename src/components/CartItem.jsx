import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(item.id, newQuantity);
  };
  
  // Handle remove item
  const handleRemove = () => {
    removeFromCart(item.id);
  };
  
  return (
    <motion.div 
      className="flex flex-col sm:flex-row border-b border-gray-200 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-contain p-2"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-1 sm:ml-4 flex flex-col sm:flex-row justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{item.category}</p>
          <p className="font-bold">${item.price.toFixed(2)}</p>
        </div>
        
        {/* Quantity Controls */}
        <div className="flex items-center mt-4 sm:mt-0">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <span className="px-4 py-1 text-center">{item.quantity}</span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          
          {/* Remove Button */}
          <motion.button
            onClick={handleRemove}
            className="ml-4 text-red-500 hover:text-red-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Remove item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
