const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

const apiKey = 'f4acb283bb3d2cbc2e4602f53a11014f';

const translations = {
  en: {
    temperature: "Temperature: ",
    description: "Description: ",
    humidity: "Humidity: ",
    windSpeed: "Wind Speed: ",
  },
  fr: {
    temperature: "Température : ",
    description: "Description : ",
    humidity: "Humidité : ",
    windSpeed: "Vitesse du vent : ",
  },

  hi: {
    temperature: " तापमान : ",
    description: "विवरण:",
    humidity: "आर्द्रता: ",
    windSpeed: "हवा की गति:",
  },

  sp: {
    temperature: "Temperatura:",
    description: "Descripción:",
    humidity: "Humedad: ",
    windSpeed: "Velocidad del viento:",
  },

  ch: {
    temperature: "温度：",
    description: "描述：",
    humidity: "湿度： ",
    windSpeed: "风速:",
  },

  Ti: {
    temperature: "வெப்பநிலை:",
    description: "விளக்கம்:",
    humidity: "ஈரப்பதம்: ",
    windSpeed: "காற்றின் வேகம்:",
  },
};

async function checkWeather(city) {
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  const weather_data = await fetch(url).then((response) => response.json());

  if (weather_data.cod === "404") {
    location_not_found.style.display = "flex";
    weather_body.style.display = "none";
    console.log("error");
    return;
  }

  location_not_found.style.display = "none";
  weather_body.style.display = "flex";

  const languageSelect = document.getElementById('languageSelect');
  const selectedLanguage = languageSelect.value;

  temperature.innerHTML = `${translations[selectedLanguage].temperature}${Math.round(weather_data.main.temp - 273.15)}°C`;
  description.innerHTML = `${translations[selectedLanguage].description}${weather_data.weather[0].description}`;

  humidity.innerHTML = `${translations[selectedLanguage].humidity}${weather_data.main.humidity}%`;
  wind_speed.innerHTML = `${translations[selectedLanguage].windSpeed}${weather_data.wind.speed}Km/hr`;

  switch (weather_data.weather[0].main) {
    case "Clouds":
      weather_img.src = "/images/cloud.png";
      break;
    case "Clear":
      weather_img.src = "/images/clear.png";
      break;
    case "Rain":
      weather_img.src = "/images/rain.png";
      break;
    case "Mist":
      weather_img.src = "/images/mist.png";
      break;
    case "Snow":
      weather_img.src = "/images/snow.png";
      break;
  }

  console.log(weather_data);
}

searchBtn.addEventListener('click', () => {
  checkWeather(inputBox.value);
});

inputBox.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    checkWeather(inputBox.value);
  }
});

languageSelect.addEventListener('change', () => {
  checkWeather(inputBox.value);
});
