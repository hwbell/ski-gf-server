var express = require('express');
var router = express.Router();

var snowData = require('../public/json/snowData.json');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send((snowData));
});

module.exports = router;
