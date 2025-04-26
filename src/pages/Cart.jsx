import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cartItems, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  
  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      toast.info('Please login to continue to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    // Navigate to checkout page
    navigate('/checkout');
  };
  
  // Calculate shipping cost (free over $100)
  const shippingCost = total > 100 ? 0 : 10;
  
  // Calculate tax (10%)
  const tax = total * 0.1;
  
  // Calculate final total
  const finalTotal = total + shippingCost + tax;
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <motion.div 
            className="bg-white rounded-lg shadow-md p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products">
              <motion.button 
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Shopping
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>
                
                <AnimatePresence>
                  {cartItems.map(item => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-500">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Promo Code */}
                <div className="mb-6">
                  <label htmlFor="promo" className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="promo"
                      className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                      placeholder="Enter promo code"
                    />
                    <button className="bg-gray-900 text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <motion.button
                  onClick={handleCheckout}
                  className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>
                
                {/* Payment Methods */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2 text-center">We Accept</p>
                  <div className="flex justify-center space-x-2">
                    <img src="https://via.placeholder.com/40x25/ffffff/000000?text=VISA" alt="Visa" className="h-6" />
                    <img src="https://via.placeholder.com/40x25/ffffff/000000?text=MC" alt="Mastercard" className="h-6" />
                    <img src="https://via.placeholder.com/40x25/ffffff/000000?text=AMEX" alt="American Express" className="h-6" />
                    <img src="https://via.placeholder.com/40x25/ffffff/000000?text=PP" alt="PayPal" className="h-6" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
