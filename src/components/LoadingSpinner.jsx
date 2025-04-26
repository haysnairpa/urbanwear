import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <motion.div
        className="w-16 h-16 border-4 border-t-[#3b82f6] border-opacity-50 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="ml-4 text-lg font-medium text-gray-700">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
