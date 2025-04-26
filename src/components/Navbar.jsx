import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../utils/firebase';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getCartItemCount } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        toast.success('Logged out successfully');
        navigate('/');
      } else {
        toast.error('Failed to logout. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <motion.span 
            className={`text-2xl font-bold ${isScrolled ? 'text-black' : 'text-gray-900'}`}
            whileHover={{ scale: 1.05 }}
          >
            UrbanWear
          </motion.span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" isScrolled={isScrolled} />
          <NavLink to="/products" label="Products" isScrolled={isScrolled} />
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className={`font-medium ${isScrolled ? 'text-black' : 'text-gray-900'} hover:text-[#3b82f6] transition-colors`}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" label="Login" isScrolled={isScrolled} />
          )}
          
          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 ${isScrolled ? 'text-black' : 'text-gray-900'}`} 
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
              {getCartItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#f97316] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </motion.div>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 ${isScrolled ? 'text-black' : 'text-white'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <MobileNavLink to="/" label="Home" />
              <MobileNavLink to="/products" label="Products" />
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block py-2 text-gray-800 hover:text-[#3b82f6]"
                >
                  Logout
                </button>
              ) : (
                <MobileNavLink to="/login" label="Login" />
              )}
              <MobileNavLink to="/cart" label="Cart" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, label, isScrolled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to}>
      <motion.span 
        className={`font-medium ${
          isScrolled 
            ? (isActive ? 'text-[#3b82f6]' : 'text-black hover:text-[#3b82f6]') 
            : (isActive ? 'text-[#3b82f6]' : 'text-gray-900 hover:text-[#3b82f6]')
        } transition-colors`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {label}
      </motion.span>
    </Link>
  );
};

// Mobile Navigation Link
const MobileNavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`block py-2 ${isActive ? 'text-[#3b82f6] font-medium' : 'text-gray-800'}`}>
      {label}
    </Link>
  );
};

export default Navbar;
