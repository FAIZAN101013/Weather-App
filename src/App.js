import React, { useState, useEffect } from 'react';
import './index.css';
import { motion, AnimatePresence } from 'framer-motion';
// Import icons for the geolocation feature
import { MapPin, Thermometer, Search } from 'lucide-react';

function App() {
  const [city, setCity] = useState("Pune");
  const [inputValue, setInputValue] = useState("Pune");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [unit, setUnit] = useState("metric"); // "metric" for Celsius, "imperial" for Fahrenheit
  const [locationLoading, setLocationLoading] = useState(false);

  const api_key = "c51c9a7270499450cf6c73e02a180dce";

  // Function to get weather icon URL from OpenWeatherMap
  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  const fetchWeatherData = async (coords = null) => {
    setLoading(true);
    setError(false);

    let api_url;

    // If coordinates are provided, use them for weather lookup
    if (coords) {
      api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${api_key}&units=${unit}`;
    } else {
      api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=${unit}`;
    }

    try {
      const response = await fetch(api_url);
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);
        setError(false);
        // If we got data from coordinates, update the city name in the input field
        if (coords && data.name) {
          setCity(data.name);
          setInputValue(data.name);
        }
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
      setLocationLoading(false);
    }
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    setLocationLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);
          setError(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      setLocationLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city, unit]);

  const handleInputChange = (e) => setInputValue(e.target.value);
  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setCity(inputValue);
    }
  };

  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Function to get time of day based on hour
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 21) return "evening";
    return "night";
  };

  // Weather detail formatter functions
  const formatWindSpeed = (speed) => {
    if (unit === "metric") {
      return `${Math.round(speed * 3.6)} km/h`; // Convert m/s to km/h for metric
    } else {
      return `${Math.round(speed)} mph`; // Already in mph for imperial
    }
  };

  const formatHumidity = (humidity) => {
    return `${humidity}%`;
  };

  // Temperature unit toggle function
  const toggleUnit = () => {
    setUnit(prevUnit => prevUnit === "metric" ? "imperial" : "metric");
  };

  // Function to format temperature with unit symbol
  const formatTemperature = (temp) => {
    const roundedTemp = Math.round(temp);
    return unit === "metric" ? `${roundedTemp}°C` : `${roundedTemp}°F`;
  };

  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
        <motion.h1
          className="container_date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {currentDate}
        </motion.h1>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="loading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="loading-spinner"
                animate={{
                  rotate: 360,
                  transition: { duration: 1, repeat: Infinity, ease: "linear" }
                }}
              ></motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Fetching weather data...
              </motion.p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="weather_data"
            >
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, duration: 0.7 }}
              >
                <img
                  src="/api/placeholder/150/150"
                  alt="Error"
                  className="weather-icon"
                />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                City not found
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ marginBottom: '20px' }}
              >
                Please try another location
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="weather"
              className="weather_data"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
            >
              <motion.div
                whileHover={iconVariants.hover}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
              >
                <motion.img
                  src={getWeatherIcon(weatherData.weather[0].icon)}
                  alt={weatherData.weather[0].description}
                  className="weather-icon"
                  drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={0.1}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.05, 1],
                    transition: {
                      repeat: Infinity,
                      duration: 5,
                      ease: "easeInOut"
                    }
                  }}
                />
              </motion.div>

              <motion.h2
                className="container_city"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.span
                  initial={{ color: "#FFF" }}
                  animate={{ color: ["#FFF", "#F8E71C", "#FFF"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                >
                  {weatherData.name}, {weatherData.sys.country}
                </motion.span>
              </motion.h2>

              <motion.h2
                className="container_degree"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              >
                {formatTemperature(weatherData.main.temp)}
              </motion.h2>

              <motion.h2
                className="country_per"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05, color: "#F8E71C" }}
              >
                {weatherData.weather[0].description}
              </motion.h2>

              <motion.div
                className="weather-details"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <motion.div
                  className="weather-detail"
                  variants={weatherDetailVariants}
                  whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <motion.i
                    className="wi wi-thermometer"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }
                    }}
                  ></motion.i>
                  <motion.span
                    initial={{ color: "#FFF" }}
                    animate={{ color: ["#FFF", "#90CAF9", "#FFF"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                  >
                    {formatTemperature(weatherData.main.feels_like)}
                  </motion.span>
                  <p>Feels Like</p>
                </motion.div>

                <motion.div
                  className="weather-detail"
                  variants={weatherDetailVariants}
                  whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <motion.i
                    className="wi wi-humidity"
                    animate={{
                      scale: [1, 1.2, 1],
                      transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }
                    }}
                  ></motion.i>
                  <motion.span
                    initial={{ color: "#FFF" }}
                    animate={{ color: ["#FFF", "#81D4FA", "#FFF"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                  >
                    {formatHumidity(weatherData.main.humidity)}
                  </motion.span>
                  <p>Humidity</p>
                </motion.div>

                <motion.div
                  className="weather-detail"
                  variants={weatherDetailVariants}
                  whileHover={{ y: -5, scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <motion.i
                    className="wi wi-strong-wind"
                    animate={{
                      x: [0, 5, -5, 0],
                      transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 }
                    }}
                  ></motion.i>
                  <motion.span
                    initial={{ color: "#FFF" }}
                    animate={{ color: ["#FFF", "#80DEEA", "#FFF"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 6 }}
                  >
                    {formatWindSpeed(weatherData.wind.speed)}
                  </motion.span>
                  <p>Wind</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="controls-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {/* Unit toggle button */}
          <motion.button
            className="unit-toggle-btn"
            onClick={toggleUnit}
            whileHover={{ scale: 1.05, backgroundColor: "#1E88E5" }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: [1, 1.05, 1],
              transition: { duration: 1.2, repeat: Infinity, repeatDelay: 5 }
            }}
          >
            <Thermometer size={18} />
            <span>{unit === "metric" ? "°C → °F" : "°F → °C"}</span>
          </motion.button>

          <motion.form
            className="form"
            onSubmit={handleSearch}
          >
            <div className="search-container">
              <motion.input
                className="input"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                animate={isInputFocused ? {
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
                  scale: 1.02,
                  transition: { duration: 0.3 }
                } : {
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  scale: 1,
                  transition: { duration: 0.3 }
                }}
                type="text"
                placeholder="Search for a city"
              />

              <motion.button
                className="btn"
                type="submit"
                whileHover={{ scale: 1.05, backgroundColor: "#F4511E" }}
                whileTap={{ scale: 0.95 }}
                initial={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
                animate={{
                  boxShadow: ["0 5px 15px rgba(0, 0, 0, 0.2)", "0 8px 25px rgba(255, 112, 67, 0.4)", "0 5px 15px rgba(0, 0, 0, 0.2)"],
                  scale: [1, 1.05, 1],
                  transition: { repeat: Infinity, repeatDelay: 3, duration: 2 }
                }}
              >
                <Search size={20} />
              </motion.button>
            </div>

            {/* Geolocation button */}
            <motion.button
              className="location-btn"
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              whileHover={{ scale: 1.05, backgroundColor: "#7CB342" }}
              whileTap={{ scale: 0.95 }}
              initial={{ boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
              animate={locationLoading ? {
                rotate: [0, 360],
                transition: { repeat: Infinity, duration: 1.5, ease: "linear" }
              } : {
                boxShadow: ["0 5px 15px rgba(0, 0, 0, 0.2)", "0 8px 25px rgba(124, 179, 66, 0.4)", "0 5px 15px rgba(0, 0, 0, 0.2)"],
                scale: [1, 1.05, 1],
                transition: { repeat: Infinity, repeatDelay: 4, duration: 2 }
              }}
            >
              <MapPin size={20} />
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;