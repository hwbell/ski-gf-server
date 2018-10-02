const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path')
const zip = '80227'

const updateWeatherInfo = () => {
  fetch("https://api.openweathermap.org/data/2.5/forecast?zip=80227,US&APPID&APPID=eef8b0df2136b2a17532672c7ac59717")
             //api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}
  .then(function(response) {
    return response.json();
  })
  .then(function(weatherJSON) {

    console.log("Weather info successfully fetched!"); // Success!
  
    var writeData = JSON.stringify(weatherJSON);

    fs.writeFile(path.join(__dirname, 'public/json/weatherData.json'), writeData, (err) => {
      if (err) { 
        console.log(`Error writing weather to JSON file: ${err}`);
      }
    })

  }).catch((e) => {
    console.log(e);
  })
  //
}

module.exports = {
  updateWeatherInfo
}