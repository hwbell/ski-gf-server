var express = require('express');
var router = express.Router();

const db = require('../mongo-retrieve');

let dbCollection = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';

const async = require('./asyncMiddleware');

router.get('/', (req, res) => {
  /* 
    if there is an error thrown in db.getData, asyncMiddleware
    will pass it to next() and express will handle the error;
  */
  currentData = db.getData('snow', dbCollection, (data) => {
    console.log(`Latest snow data: ${data[data.length - 1].data}`)
    res.send(data[data.length - 1].data);
    
  });

  

});

module.exports = router;
