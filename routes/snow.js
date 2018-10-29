var express = require('express');
var router = express.Router();

const db = require('../mongo-retrieve');

let dbCollection = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';

currentData = db.getData('snow', dbCollection, (data) => {
  console.log(`Latest snow data: ${data[data.length-1].data}`)
  return data[data.length-1].data;
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.send((currentData));
});

module.exports = router;
