import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { registerUser, loginUser } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      // Redirect to the page they were trying to access, or home
      const destination = location.state?.from || '/';
      navigate(destination, { replace: true });
    }
  }, [currentUser, navigate, location]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Validate form
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    
    try {
      let result;
      
      if (isLogin) {
        // Login user
        result = await loginUser(email, password);
      } else {
        // Register user
        result = await registerUser(email, password);
      }
      
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }
      
      // Success
      toast.success(isLogin ? 'Login successful!' : 'Account created successfully!');
      
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
      setIsLoading(false);
      
      // Navigate to home or redirect URL
      const destination = location.state?.from || '/';
      navigate(destination, { replace: true });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <motion.div 
            className="bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-4 text-center font-medium ${
                  isLogin ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]' : 'text-gray-500'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`flex-1 py-4 text-center font-medium ${
                  !isLogin ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]' : 'text-gray-500'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Name Field (Register only) */}
                {!isLogin && (
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                )}
                
                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                
                {/* Password Field */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    {isLogin && (
                      <Link to="/forgot-password" className="text-sm text-[#3b82f6] hover:text-blue-700">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                
                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    isLogin ? 'Login' : 'Create Account'
                  )}
                </motion.button>
              </form>
              
              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4"/>
                  </svg>
                  Continue with Google
                </button>
                
                <button className="w-full flex items-center justify-center bg-[#1877F2] rounded-lg px-4 py-3 text-white font-medium hover:bg-[#166FE5] transition-colors">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#fff"/>
                  </svg>
                  Continue with Facebook
                </button>
              </div>
              
              {/* Toggle Login/Register */}
              <p className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#3b82f6] font-medium hover:text-blue-700"
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
