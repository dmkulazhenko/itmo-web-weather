function getNewCityBox() {
    let city_box = document.getElementById("city_box").cloneNode(true);
    city_box.removeAttribute("hidden");

    return city_box;
}


function addCityBoxToCityList(city_box) {
    let city_list = document.getElementById("city_list");
    city_list.appendChild(city_box);
}

function removeCityFromStorage(id) {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", `${getCurrentHost()}/api/weather/favorites`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"id": id}));
    xhr.onerror = function () {
        alert("Не удалось удалить город.")
    }
}

function removeCity(id) {
    document.getElementById(id + "_city_box").style.display = "none";
    removeCityFromStorage(id);
}

function renderCity(weatherData) {
    let city_box = getNewCityBox();

    city_box.getElementsByClassName("city_box_name")[0].textContent = weatherData.name;
    city_box.getElementsByClassName("city_box_temp")[0].textContent = weatherData.temp + "°C";
    city_box.getElementsByClassName("city_box_data_wind")[0].textContent = `${weatherData.wind} m/s`;
    city_box.getElementsByClassName("city_box_data_clouds")[0].textContent = `${weatherData.clouds}`;
    city_box.getElementsByClassName("city_box_data_pressure")[0].textContent = `${weatherData.pressure}  hpa`;
    city_box.getElementsByClassName("city_box_data_humidity")[0].textContent = `${weatherData.humidity}  %`;
    city_box.getElementsByClassName("city_box_data_coords")[0].textContent = `[${weatherData.coords.lon}, ${weatherData.coords.lat}]`;
    city_box.getElementsByClassName("city_box_weather_icon")[0].src = weatherData.icon;

    city_box.setAttribute("id", weatherData.id + "_city_box");
    let remove_button = city_box.getElementsByClassName("round_button")[0];
    remove_button.id = weatherData.id;
    remove_button.addEventListener("click", (event) => removeCity(event.target.id))

    addCityBoxToCityList(city_box);
}


function getCityNameFromForm() {
    let form = document.getElementById("city_new_form");
    let input = form.getElementsByTagName("input")[0];
    let name = input.value;
    input.value = "";
    return name;
}

function addNewCity() {
    let name = getCityNameFromForm();

    let xhr = new XMLHttpRequest();
    xhr.open("POST", `${getCurrentHost()}/api/weather/favorites`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({"name": name}));
    xhr.onload = function () {
        if (xhr.status === 404) {
            alert("Город " + name + " не найден.");
            return;
        }
        if (xhr.status === 409) {
            alert("Город " + name + " уже добавлен.")
            return;
        }
        renderCity(JSON.parse(xhr.response));
    }
}


function renderCitiesFromStorage() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${getCurrentHost()}/api/weather/favorites`);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status !== 200) return;
        let cities = JSON.parse(xhr.response)
        for (const city of cities) {
            renderCity(city);
        }
    }
}


window.addEventListener("load", (event) => {
    renderCitiesFromStorage();
    let form = document.getElementById("city_new_form");
    form.addEventListener("submit", (event) => {
        addNewCity();
        event.preventDefault();
    })
})
