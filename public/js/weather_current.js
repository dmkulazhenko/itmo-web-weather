function updateCurrentCityWeather(weatherData) {
    document.getElementById("city_box_current_name").textContent = weatherData.name;
    document.getElementById("city_box_current_temp").textContent = weatherData.temp + "°C";
    document.getElementById("city_box_current_wind").textContent = `${weatherData.wind} m/s`;
    document.getElementById("city_box_current_clouds").textContent = weatherData.clouds;
    document.getElementById("city_box_current_pressure").textContent = `${weatherData.pressure}  hpa`;
    document.getElementById("city_box_current_humidity").textContent = `${weatherData.humidity}  %`;
    document.getElementById("city_box_current_coords").textContent = `[${weatherData.coords.lon}, ${weatherData.coords.lat}]`;
    document.getElementById("city_box_current_img").src = weatherData.icon;
}

function setReloadCityWeather() {
    document.getElementById("city_box_current_name").textContent = "Данные загружаются";
    document.getElementById("city_box_current_temp").textContent = "";
    document.getElementById("city_box_current_wind").textContent = "-";
    document.getElementById("city_box_current_clouds").textContent = "-";
    document.getElementById("city_box_current_pressure").textContent = "-";
    document.getElementById("city_box_current_humidity").textContent = "-";
    document.getElementById("city_box_current_coords").textContent = "-";
    document.getElementById("city_box_current_img").src = "/img/update_geo_button.png";
}

function updateCurrentCityWeatherByCoords(lat, lon) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${getCurrentHost()}/api/weather/forecast?lat=${lat}&lon=${lon}`);
    xhr.send();
    xhr.onload = function () {
        data = JSON.parse(xhr.response);
        updateCurrentCityWeather(data);
    }
}

function updateCurrentCityByLocation(location) {
    updateCurrentCityWeatherByCoords(
        location.coords.latitude,
        location.coords.longitude
    );
}

function errorHandlerGetCurrentLocation() {
    updateCurrentCityWeatherByCoords(53.9, 27.5667);
}

function loadCurrentCity() {
    navigator.geolocation.getCurrentPosition(
        updateCurrentCityByLocation,
        errorHandlerGetCurrentLocation
    );
}


function reloadCurrentCity() {
    setReloadCityWeather();
    loadCurrentCity();
}

window.addEventListener("load", () => {
    reloadCurrentCity();
    let updateButtonText = document.getElementById("update_geo_button_text");
    updateButtonText.addEventListener("click", () => reloadCurrentCity());
    let updateButtonImg = document.getElementById("update_geo_button_img");
    updateButtonImg.addEventListener("click", () => reloadCurrentCity());
})

