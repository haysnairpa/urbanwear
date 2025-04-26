import { createContext, useContext, useState, useEffect } from 'react';
import { auth, subscribeToAuthChanges } from '../utils/firebase';

// Create the Auth Context
const AuthContext = createContext();

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Subscribe to auth state changes when component mounts
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);
  
  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
