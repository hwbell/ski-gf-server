var express = require('express');
var router = express.Router();

var weatherData = require('../public/json/weatherData.json');

/* GET home page. */
router.get('/', function(req, res) {
  res.send(JSON.stringify(weatherData));
});

module.exports = router;
