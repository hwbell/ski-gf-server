var express = require('express');
var router = express.Router();

const db = require('../mongo-retrieve');

currentData = db.getData('snow', (data) => {
  console.log(`Latest snow data: ${data[data.length-1].data}`)
  return data[data.length-1].data[0];
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.send((currentData));
});

module.exports = router;
