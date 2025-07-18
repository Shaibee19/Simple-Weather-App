// Updates the current date and day in the header //
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

// --- API Configuration / WE will use this info in the next session --- create your account and activate your API Key
const API__KEY = 'paste your own key here'
const BASE__URL = 'https://api.openweatherapp'

// DOM - document object module - ELEMENT REFERENCES
const cityInputElement = document.getElementById('city__input');
const serachButton = document.getElementById('search__button');
const cityNameElement = document.getElementById('city__name');
const weatherIconElement = document.getElementById('weather__emoji');
const temperatureElement = document.querySelector('.temperature');
const conditionElement = document.querySelector('.condition');
const messageBox = document.getElementById('message__box');
const messageText = document.getElementById('message__text');

// Displays a message box with dynamic styling
function showMessage(message, type = 'info') {
    messageText.innerHTML = message;
    const styles = {
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

// Handles city search input
function handleSearch() {
    const city = cityInputElement.value.trim();
    if (!city) { showMessage('Please enter a city name.', 'warning'); return; }
    fetchWeatherFromAPI(city);
}

// Event Listeners
serachButton.addEventListener('click', handleSearch);
cityInputElement.addEventListener('keypress', (e) => {if (e.key === 'Enter') handleSearch(); }); // !!! not sure if this is right //