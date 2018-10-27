var express = require('express');
var router = express.Router();

var snowData = require('../public/json/snowData.json') || 'waiting on data';

/* GET users listing. */
router.get('/', function(req, res) {
  res.send((snowData));
});

module.exports = router;
