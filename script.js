const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric&lang=en';
const apiKey = '76d229b4daf66145f6cb3689045fb299';
const submitBtn = document.getElementById('submitBtn');
const userInput = document.getElementById('userInput');
const weatherImg = document.querySelector('.weather-img');

// Weather icon mapping
const weatherIcons = {
    'clear': 'images/clear.png',
    'clouds': 'images/clouds.png',
    'rain': 'images/rain.png',
    'drizzle': 'images/drizzle.png',
    'mist': 'images/mist.png',
    'snow': 'images/snow.png',
    'thunderstorm': 'images/thunderstorm.png'
};

async function getWeather(city) {
    try {
        console.log('Starting weather request for:', city);
        
        // Show loading state
        document.querySelector('.weather-city').innerHTML = 'Loading...';
        document.querySelector('.weather-temp').innerHTML = '--°C';
        document.querySelector('.humi-desc').innerHTML = '--%';
        document.querySelector('.wind-desc').innerHTML = '-- km/h';
        
        const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found');
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }
        
        const data = await response.json();
        console.log('Weather data:', data);

        // Update weather information
        document.querySelector('.weather-city').innerHTML = data.name;
        document.querySelector('.weather-temp').innerHTML = Math.round(data.main.temp) + '°C';
        document.querySelector('.humi-desc').innerHTML = data.main.humidity + '%';
        document.querySelector('.wind-desc').innerHTML = Math.round(data.wind.speed * 3.6) + ' km/h'; // Convert m/s to km/h
        
        // Update weather icon based on weather condition
        const weatherCondition = data.weather[0].main.toLowerCase();
        const iconPath = weatherIcons[weatherCondition] || 'images/clouds.png'; // Default to clouds if condition not found
        weatherImg.src = iconPath;
        weatherImg.alt = data.weather[0].description;
        
    } catch (error) {
        console.error('Error fetching weather:', error);
        
        // Show error in UI
        document.querySelector('.weather-city').innerHTML = 'Error';
        document.querySelector('.weather-temp').innerHTML = '--°C';
        document.querySelector('.humi-desc').innerHTML = '--%';
        document.querySelector('.wind-desc').innerHTML = '-- km/h';
        
        // Show error message to user
        if (error.message === 'City not found') {
            alert('City not found. Please check the spelling and try again.');
        } else {
            alert('Unable to fetch weather data. Please try again later.');
        }
    }
}

// Event listener for button click
submitBtn.addEventListener('click', function() {
    const cityName = userInput.value.trim();
    if (cityName) {
        getWeather(cityName);
    } else {
        alert('Please enter a city name');
    }
});

// Event listener for Enter key press
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const cityName = userInput.value.trim();
        if (cityName) {
            getWeather(cityName);
        } else {
            alert('Please enter a city name');
        }
    }
});

// Load default weather (Berlin) on page load
window.addEventListener('load', function() {
    getWeather('Berlin');
});