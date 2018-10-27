var express = require('express');
var router = express.Router();

var weatherData = require('../public/json/weatherData.json') || 'waiting on data';

/* GET home page. */
router.get('/', function(req, res) {
  res.send(weatherData);
});

module.exports = router;
