var express = require('express');
var router = express.Router();

const db = require('../mongo-retrieve');

let dbCollection = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';

currentData = db.getData('traffic', dbCollection, (data) => {
  console.log(`Latest traffic data: ${data[data.length-1].data}`)
  return data[data.length-1].data[0];
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.send((currentData));
});

module.exports = router;