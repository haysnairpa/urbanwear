import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const { cartItems, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    paymentMethod: 'credit-card'
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Calculate shipping cost (free over $100)
  const shippingCost = total > 100 ? 0 : 10;
  
  // Calculate tax (10%)
  const tax = total * 0.1;
  
  // Calculate final total
  const finalTotal = total + shippingCost + tax;
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.address || 
        !formData.city || !formData.zipCode || !formData.country) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Process order (simulated)
    setIsProcessing(true);
    
    // Simulate API call to process order
    setTimeout(() => {
      // Clear cart
      clearCart();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Redirect to home page
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty. Add some products before checkout.</p>
            <button 
              onClick={() => navigate('/products')}
              className="bg-[#3b82f6] text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Address */}
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Zip Code */}
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                        required
                      />
                    </div>
                    
                    {/* Country */}
                    <div className="md:col-span-2">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                        required
                      >
                        <option value="">Select a country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="ID">Indonesia</option>
                        <option value="SG">Singapore</option>
                        <option value="MY">Malaysia</option>
                      </select>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                  
                  <div className="space-y-4 mb-8">
                    {/* Credit Card */}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="credit-card"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === 'credit-card'}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                      <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit Card
                      </label>
                      <div className="ml-auto flex space-x-2">
                        <img src="src/assets/visa.png" alt="Visa" className="h-6" />
                        <img src="src/assets/mastercard.png" alt="Mastercard" className="h-6" />
                      </div>
                    </div>
                    
                    {/* PayPal */}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                      <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                        Digital Wallet
                      </label>
                      <div className="ml-auto flex space-x-2">
                        <img src="src/assets/gopay.png" alt="GoPay" className="h-6" />
                        <img src="src/assets/shopeepay.png" alt="ShopeePay" className="h-6" />
                      </div>
                    </div>
                    
                    {/* Cash on Delivery */}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="h-4 w-4 text-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                      <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="mt-8">
                    <motion.button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center ${
                        isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                      whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Order...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
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
                
                {/* Cart Items */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-3">Items ({cartItems.length})</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Summary */}
                <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
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
                
                {/* Security Note */}
                <div className="text-xs text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Secure checkout. Your data is protected.
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
