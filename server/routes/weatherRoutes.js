const express = require('express');
const { getWeatherByCity } = require('../controllers/weatherController');

const router = express.Router();

// GET /api/weather?city=CityName
router.get('/', getWeatherByCity);

module.exports = router;


