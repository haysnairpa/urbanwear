import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { currentUser } = useAuth();
  const { orders, loading } = useOrder();
  const [activeTab, setActiveTab] = useState('orders');
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your profile.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-[#3b82f6] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {currentUser.email.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold">{currentUser.email}</h2>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left py-2 px-4 rounded-md mb-2 ${
                    activeTab === 'orders' ? 'bg-blue-50 text-[#3b82f6]' : 'hover:bg-gray-100'
                  }`}
                >
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left py-2 px-4 rounded-md ${
                    activeTab === 'settings' ? 'bg-blue-50 text-[#3b82f6]' : 'hover:bg-gray-100'
                  }`}
                >
                  Account Settings
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'orders' && (
                <OrderHistory orders={orders} loading={loading} />
              )}
              
              {activeTab === 'settings' && (
                <AccountSettings />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order History Component
const OrderHistory = ({ orders, loading }) => {
  if (loading) {
    return <LoadingSpinner />;
  }
  
  // Pastikan orders adalah array, jika undefined gunakan array kosong
  const orderItems = orders || [];
  
  if (orderItems.length === 0) {
    return (
      <div className="text-center py-8">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-4">
          You haven't made any purchases yet.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Order History</h2>
      
      <div className="space-y-6">
        {orderItems.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

// Order Item Component
const OrderItem = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <motion.div 
      className="border border-gray-200 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Order Header */}
      <div 
        className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Order placed on {formatDate(order.createdAt)}
          </p>
          <p className="font-medium">
            Order ID: {order.id.substring(0, 8)}...
          </p>
        </div>
        
        <div className="mt-2 md:mt-0 flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
            {order.status}
          </span>
          <span className="font-bold">
            ${order.total.toFixed(2)}
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {/* Order Details */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          {/* Order Items */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Order Items</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden mr-4">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="font-medium">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Shipping Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium mb-2">Shipping Information</h4>
              <p className="text-gray-600">{order.shippingInfo.fullName}</p>
              <p className="text-gray-600">{order.shippingInfo.address}</p>
              <p className="text-gray-600">
                {order.shippingInfo.city}, {order.shippingInfo.zipCode}
              </p>
              <p className="text-gray-600">{order.shippingInfo.country}</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Payment Method</h4>
              <p className="text-gray-600 capitalize">{order.paymentMethod.replace('-', ' ')}</p>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>
                {order.shipping === 0 ? (
                  <span className="text-green-500">Free</span>
                ) : (
                  `$${order.shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Account Settings Component
const AccountSettings = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
      <p className="text-gray-600">Account settings feature coming soon.</p>
    </div>
  );
};

export default Profile;