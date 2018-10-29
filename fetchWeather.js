const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path')
const zip = '80227'

const coords = [39.7392, -104.9848]; // for Denver Co
const lat = coords[0];
const lon = coords[1];

const updateWeatherInfo = () => {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID&APPID=eef8b0df2136b2a17532672c7ac59717`)
             //api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}
  .then(function(response) {
    return response.json();
  })
  .then(function(weatherJSON) {

    console.log("Weather info successfully fetched!"); // Success!
  
    var writeData = JSON.stringify(weatherJSON);

    fs.writeFile(path.join(__dirname, 'public/json/weatherData.json'), writeData, (err) => {
      console.log(`writing weather data to ${path.join(__dirname, 'public/json/weatherData.json')}`)
      if (err) { 
        console.log(`Error writing weather to JSON file: ${err}`);
      }
    })

    // write to mongodb instead of fs.writeFile, as fs does not 
    // actually work on heroku.

    const MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkiGfApp', (err, client) => {
      if (err) {
        return console.log('Unable to connect to MongoDB server');
      }
      console.log('Connected to MongoDB server');
      // db.collection('SkiGfApp').deleteMany({type: 'snow'}).then((result) => {
      //   console.log(result);

      // });
      
      let dbStr = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';
      const db = client.db(dbStr);

      db.collection(dbStr).insertOne({
        type: 'weather',
        data: writeData,
      }, (err, result) => {
        if (err) {
          console.log('Unable to insert weather data to SkiGfApp', err);
        } else {
          console.log(JSON.stringify(result.ops, undefined, 2));
        }
      });

      db.collection(dbStr).find().toArray().then((docs) => {
        console.log(`Total: ${docs.length} objects found`);
        console.log(docs);

        client.close();
        
      }, (err) => {
        console.log('Unable to fetch data', err);
      });

      
    });

  }).catch((e) => {
    console.log(e);
  })
  //
}

updateWeatherInfo();

module.exports = {
  updateWeatherInfo
}