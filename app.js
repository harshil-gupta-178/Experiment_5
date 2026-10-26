const weatherCodes = {
0: 'Clear sky',
1: 'Mainly clear',
2: 'Partly cloudy',
3: 'Overcast',
45: 'Fog',
48: 'Fog',
51: 'Light drizzle',
53: 'Moderate drizzle',
55: 'Dense drizzle',
61: 'Slight rain',
63: 'Moderate rain',
65: 'Heavy rain',
71: 'Slight snow',
73: 'Moderate snow',
75: 'Heavy snow',
80: 'Rain showers',
81: 'Rain showers',
82: 'Violent rain showers',
95: 'Thunderstorm'
};
const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weather = document.getElementById('weather');
const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
form.addEventListener('submit', async (e) => {
e.preventDefault();
const city = cityInput.value.trim();
if (!city) return;
loading.classList.remove('hidden');
error.classList.add('hidden');
weather.classList.add('hidden');
try {
const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
const geoData = await geoRes.json();
if (!geoData.results || geoData.results.length === 0) {
throw new Error('City not found');
}
const { name, country, latitude, longitude } = geoData.results[0];
const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
const weatherData = await weatherRes.json();
const current = weatherData.current;
cityName.textContent = `${name}${country ? ', ' + country : ''}`;
temp.textContent = `${Math.round(current.temperature_2m)}°C`;
condition.textContent = weatherCodes[current.weather_code] || 'Cloudy';
humidity.textContent = current.relative_humidity_2m;
wind.textContent = current.wind_speed_10m;
weather.classList.remove('hidden');
} catch (err) {
error.textContent = err.message || 'Failed to fetch weather';
error.classList.remove('hidden');
} finally {
loading.classList.add('hidden');
}
});