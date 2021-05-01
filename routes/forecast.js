const weather_api = require("../weather_api")()

const express = require('express');
const router = express.Router();


router.get('/', async function (req, res) {
    const data = await weather_api.getForecastByCoords(req.query.lat, req.query.lon)
    res.json(data)
});

module.exports = router;
