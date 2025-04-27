import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getOrdersByUserId, saveOrder } from '../utils/firebase';

// Create Order Context
const OrderContext = createContext();

// Custom hook to use Order Context
export const useOrder = () => {
  return useContext(OrderContext);
};

// Order Provider Component
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  
  // Fetch current user's order history
  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const userOrders = await getOrdersByUserId(currentUser.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setOrders([]);
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser]);
  
  // Add a new order
  const addOrder = async (orderData) => {
    if (!currentUser) return null;
    
    try {
      const newOrder = {
        ...orderData,
        userId: currentUser.uid,
        orderDate: new Date().toISOString(),
        status: 'completed'
      };
      
      const orderId = await saveOrder(newOrder);
      
      // Update orders state
      setOrders(prevOrders => [
        { id: orderId, ...newOrder },
        ...prevOrders
      ]);
      
      return orderId;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  };
  
  // Context value
  const value = {
    orders,
    loading,
    addOrder
  };
  
  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;