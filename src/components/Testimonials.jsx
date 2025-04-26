import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Blogger',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    text: 'UrbanWear has completely transformed my wardrobe. The quality of their clothing is exceptional, and their customer service is top-notch. I\'ve been recommending them to all my followers!',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Loyal Customer',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    text: 'I\'ve been shopping with UrbanWear for over a year now, and I\'m always impressed by their attention to detail and the durability of their products. Definitely worth every penny.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Style Consultant',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    text: 'As a style consultant, I\'m very particular about the brands I recommend to my clients. UrbanWear consistently delivers trendy, high-quality pieces that my clients love.',
    rating: 4
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'Entrepreneur',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    text: 'The versatility of UrbanWear\'s collection is perfect for my busy lifestyle. From business meetings to casual outings, I can always find something appropriate and stylish.',
    rating: 5
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Render stars based on rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our happy customers have to say about their experience with UrbanWear.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <motion.div 
            key={testimonials[activeIndex].id}
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center">
              {/* Customer Image */}
              <div className="mb-6 md:mb-0 md:mr-8">
                <img 
                  src={testimonials[activeIndex].image} 
                  alt={testimonials[activeIndex].name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#3b82f6]"
                />
              </div>
              
              {/* Testimonial Content */}
              <div className="flex-1">
                <div className="flex mb-4">
                  {renderStars(testimonials[activeIndex].rating)}
                </div>
                
                <p className="text-gray-700 italic mb-6">
                  "{testimonials[activeIndex].text}"
                </p>
                
                <div>
                  <h4 className="font-bold text-lg">{testimonials[activeIndex].name}</h4>
                  <p className="text-gray-500">{testimonials[activeIndex].role}</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === activeIndex ? 'bg-[#3b82f6]' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
