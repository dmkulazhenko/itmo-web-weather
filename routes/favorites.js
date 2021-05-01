const Favorites = require('../db')
const weather_api = require("../weather_api")()

const express = require('express');
const router = express.Router();


router.get('/', async function (req, res) {
    const cities = await Favorites.findAll({
        where: {
            token: req.cookies.token
        },
        attributes: ['city_id']
    })

    let data = [];
    for (const city of cities) {
        data.push(await weather_api.getForecastById(city.city_id));
    }
    res.json(data)
});

router.post('/', async function (req, res) {
    const cityName = req.body.name

    let weather_data = null;
    try {
        weather_data = await weather_api.getForecastByName(cityName)
    } catch (err) {
        res.sendStatus(404);
        return;
    }

    const city = await Favorites.findOne({
        where: {
            token: req.cookies.token,
            city_id: weather_data["id"]
        }
    })
    if (city !== null) {
        res.sendStatus(409);
        return;
    }

    await Favorites.create({
        token: req.cookies.token,
        city_id: weather_data["id"],
    })

    res.json(weather_data)
});

router.delete('/', async function (req, res) {
    const cityId = parseInt(req.body.id)
    await Favorites.destroy({
        where: {
            token: req.cookies.token,
            city_id: cityId
        }
    })
    res.sendStatus(200)
});


module.exports = router;
