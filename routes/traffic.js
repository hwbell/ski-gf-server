var express = require('express');
var router = express.Router();

var trafficData = require('../public/json/trafficData.json');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send((trafficData));
});

module.exports = router;
