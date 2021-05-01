const axios = require("axios")

const config = require("./config")()

async function callAPI(params) {
    let url = "https://api.openweathermap.org/data/2.5/weather?";
    for (const [key, val] of Object.entries(params)) url += `${key}=${val}&`;
    url += `appid=${config.API_KEY}&units=metric`
    return (await axios.get(url)).data;
}

async function getForecast(params) {
    const data = await callAPI(params);
    return {
        "id": data["id"],
        "name": data["name"],
        "temp": ~~data["main"]["temp"],
        "wind": data["wind"]["speed"],
        "clouds": data["weather"][0]["description"],
        "pressure": data["main"]["pressure"],
        "humidity": data["main"]["humidity"],
        "coords": {"lon": data["coord"]["lon"], "lat": data["coord"]["lat"]},
        "icon": `https://openweathermap.org/img/w/${data["weather"][0]["icon"]}.png`
    }
}

async function getForecastByCoords(lat, lon) {
    return await getForecast({"lat": lat, "lon": lon});
}

async function getForecastById(id) {
    return await getForecast({"id": id.toString()});
}

async function getForecastByName(name) {
    return await getForecast({"q": encodeURIComponent(name)});
}

module.exports = () => ({
    getForecastById, getForecastByCoords, getForecastByName
})
