import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import Testimonials from '../components/Testimonials';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchProducts } from '../utils/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const getFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const products = await fetchProducts();
        // Get 4 random products for featured section
        const randomProducts = [...products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        setFeaturedProducts(randomProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Failed to load featured products. Please try again later.');
        setIsLoading(false);
      }
    };
    
    getFeaturedProducts();
  }, []);
  
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Featured Products
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover our handpicked selection of the season's most stylish and trending items.
            </motion.p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              <p>{error}</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
          
          <div className="text-center mt-12">
            <motion.a 
              href="/products" 
              className="inline-block bg-black text-white font-medium py-3 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Products
            </motion.a>
          </div>
        </div>
      </section>
      
      {/* Collection Banner */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-[#f97316] text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                EXCLUSIVE OFFER
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Summer Collection 2025
              </h2>
              <p className="text-gray-600 mb-6">
                Beat the heat with our new summer collection. Lightweight fabrics, vibrant colors, and stylish designs perfect for the season.
              </p>
              <motion.a 
                href="/products?category=summer" 
                className="inline-block bg-[#3b82f6] text-white font-medium py-3 px-8 rounded-full hover:bg-blue-600 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Collection
              </motion.a>
            </motion.div>
            
            <motion.div
              className="rounded-lg overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Summer Collection" 
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Newsletter Section */}
      <section className="py-16 bg-[#3b82f6]">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center text-white">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Join Our Newsletter
            </motion.h2>
            <motion.p 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Subscribe to our newsletter and be the first to know about new collections, special offers, and exclusive events.
            </motion.p>
            
            <motion.form 
              className="flex flex-col sm:flex-row gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-full text-white border border-white focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <motion.button 
                type="submit" 
                className="bg-white text-[#3b82f6] font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
