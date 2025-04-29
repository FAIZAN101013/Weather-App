import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const App = () => {
  const [query, setQuery] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    // Handle search functionality
  };

  const handleLocation = () => {
    // Handle location functionality
  };

  const getCurrentLocation = () => {
    // Implement getting current location
  };

  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.5
      }
    }
  };

  // Icon animation variants
  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.3 }
    }
  };

  // Weather details animation variants
  const weatherDetailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="App">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="search-container">
          <input
            type="text"
            className="input"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <motion.button
            className="btn"
            type="submit"
            whileHover={{ scale: 1.05, backgroundColor: "#F4511E" }}
            whileTap={{ scale: 0.95 }}
            initial={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.3 }}
          >
            <Search size={20} />
          </motion.button>
          <motion.button
            className="location-btn"
            type="button"
            onClick={getCurrentLocation}
            disabled={locationLoading}
            whileHover={{ scale: 1.05, backgroundColor: "#7CB342" }}
            whileTap={{ scale: 0.95 }}
            initial={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
            animate={locationLoading ? {
              rotate: 360,
              transition: { duration: 1.5, ease: "linear" }
            } : {}}
          >
            <MapPin size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default App; 