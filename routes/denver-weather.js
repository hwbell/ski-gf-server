var express = require('express');
var router = express.Router();

const db = require('../mongo-retrieve');

let dbCollection = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';

router.get('/', (req, res) => {
  /* 
    if there is an error thrown in db.getData, asyncMiddleware
    will pass it to next() and express will handle the error;
  */

  denverData = db.getData('Denver-weather', dbCollection, (data) => {
    latest = data[data.length - 1];
    console.log(`Latest Denver-weather data:`)
    console.log(latest)
    res.send(latest);
  });

});

module.exports = router;
