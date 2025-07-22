// UPDATES THE CURRENT DATE AND DAY IN THE HEADER //
function updateDate() {
    const now = new Date();
    const days = [
        "Sunday",
        "Monday", 
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    const formattedDate = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    document.getElementById("currentDay").innerHTML = days[now.getDay()];
    document.getElementById("currentDate").innerHTML = formattedDate;
}

updateDate();

// --- API CONFIGURATION / WE will use this info in the next session --- create your account and activate your API Key
const API__KEY = '2ac838b0f3f57c117c0429ba2ba8003d'
const BASE__URL = 'https://api.openweathermap.org/data/2.5/weather'

// DOM - document object module - ELEMENT REFERENCES
const cityInputElement = document.getElementById('city__input');
const serachButton = document.getElementById('search__button');
const cityNameElement = document.getElementById('city__name');
const weatherIconElement = document.getElementById('weather__emoji');
const temperatureElement = document.querySelector('.temperature');
const conditionElement = document.querySelector('.condition');
const messageBox = document.getElementById('message__box');
const messageText = document.getElementById('message__text');

// DISPLAYS A MESSAGE BOX WITH DYNAMIC STYLING
function showMessage(message, type = "info") {
    messageText.innerHTML = message;
    const styles = 
    {
        success: { bg: '#1a532e', border: '#3cba54', text: '#c8e6c9' },
        error: { bg: '#5c1818', border: '#d93025', text: '#fca7a7' },
        warning: { bg: '#5e4d00', border: '#fbbc05', text: '#ffe082' },
        info: { bg: '#0b3d63', border: '#1a73e8', text: '#b3d4f8' },
    } [type] || styles.info; // Default to info

    messageBox.style.cssText = `
        background-color: ${styles.bg};
        border: 1px solid ${styles.border};
        color: ${styles.text};
        padding:0.8rem 1.2rem;
        border-radius: 0.8rem;
        margin-bottom: 1.5rem;
        text-align: center;
        width: calc(100% - 20px);
        font-size: 0.95rem
        font-weight: 500;
        transition: all 0.3s ease-in-out;
        margin-left: auto;
        margin-right: auto;
        `;
        // 1 rem = 16 pixels - usually more scaleable, pixels are more precise - there are more to dig - try to only use one throughout
    messageBox.classList.remove('hidden');
    setTimeout(() => messageBox.classList.add('hidden'), 5000);
}

// HANDLES CITY SEARCH INPUT
function handleSearch() {
    const city = cityInputElement.value.trim();
    if (!city) { showMessage('Please enter a city name.', 'warning'); return; }
    fetchWeatherFromAPI(city);
}

// EVENT LISTENERS
serachButton.addEventListener("click", handleSearch);
cityInputElement.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') handleSearch(); 
}); // !!! not sure if this is right //

// FETCHES WEATHER DATA FROM OpenWeatherMap API //
async function fetchWeatherFromAPI(city) {
    if (!API__KEY) {
        showMessage(
            "Please get you OpenWeatherMap API Key and replace the placeholder.",
            "error"
        );
        return;
    }
    weatherIconElement.innerHTML = "⌛"; // Loading Emoji

    try {
        const res = await fetch(
            `${BASE__URL}?q=${city}&appid=${API__KEY}&units=imperial`
        );
        console.log(res)
        if (!res.ok) {
            const msg =
                res.staus === 404
                    ? `City "${city}" not found.`
                    : res.status === 401
                    ? "Invalid API Key."
                    : `Error: ${res.statusText}`;
            showMessage(msg, "error");
            cityNameElement.innerHTML = "Error";
            temperatureElement.innerHTML = "--°F"
            conditionElement.innerHTML = "N/A";
            weatherIconElement.innerHTML = "❓";
            return;
        }
        const data = await res.json();
        updateWeatherDisplay(data);
        showMessage(`Weather for ${data.name} fetched!`, "success");
    } catch (error) {
        console.error("Fetch error:", error);
        showMessage("Failed to connect to weather service.", "error");
        cityNameElement.innerHTML = "Error";
        temperatureElement.innerHTML = "--°F"
        conditionElement.innerHTML = "N/A";
        weatherIconElement.innerHTML = "❗";
    }
}

// UPDATES WEATHER DISPLAY WITH API DATA USING map() AND innerHTML. //
function updateWeatherDisplay(data) {
    const emojiMap = {
        "01d": "☀️",
        "01n": "🌙",
        "02d": "🌤️",
        "02n": "☁️",
        "03d": "☁️",
        "03n": "☁️",
        "04d": "🌥️",
        "04n": "🌥️",
        "09d": "🌨️",
        "09n": "🌨️",
        "10d": "🌦️",
        "10n": "🌧️",
        "11d": "⛈️",
        "11n": "⛈️",
        "13d": "❄️",
        "13n": "❄️",
        "50d": "🌫️",
        "50n": "🌫️",
    };
    const weather = data.weather.map((w) => ({
        desc: w.description,
        icon: w.icon,
    }))[0]; // w/o this 0 you would get = [{ desc: "description here", icon:"icon here" }] vs. [0] === { desc: "description here", icon: "icon here" } -- takes it out of the array

    cityNameElement.innerHTML = data.name;
    temperatureElement.innerHTML = `${Math.round(data.main.temp)}°F`;
    conditionElement.innerHTML = weather.desc;
    weatherIconElement.innerHTML = emojiMap[weather.icon] || "❓";
}