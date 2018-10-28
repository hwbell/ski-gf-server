var express = require('express');
var router = express.Router();

const db = require('../mongo-retrieve');

currentData = db.getData('weather', (data) => {
  console.log(`Latest weather data: ${data[data.length-1].data}`)
  return data[data.length-1].data[0];
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.send((currentData));
});

module.exports = router;