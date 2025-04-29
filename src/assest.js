import './clear.webm';
import './sun.png'
import './thunder.png';
import './rain_with_cloud.png
import clear from './assets/clear.png';
import clouds from './assets/clouds.png';
import rain from './assets/rain.png';
import thunder from './assets/thunder.png';
import snow from './assets/snow.png';
import defaultIcon from './assets/default.png'; // fallback image

const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
        case 'clear':
            return clear;
        case 'clouds':
            return clouds;
        case 'rain':
            return rain;
        case 'thunderstorm':
            return thunder;
        case 'snow':
            return snow;
        default:
            return defaultIcon;
    }
};
';