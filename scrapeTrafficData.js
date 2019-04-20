const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// define the promise for scraping the data from the GOI70 website, since
// there isnt an api to use. probably will have to change this as they modify 
// the websites fairly often, it seems

// below, save the data

const updateTrafficInfo = () => {
  let scrape = async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();

    await page.goto('https://goi70.com/travel/');
    await page.click('.ccm-custom-style-fullscalearea2-636');
    await page.waitFor(1000);
    //await page.waitForSelector('.grid twelve');

    const traffic = await page.evaluate(() => {
      let weekendTraffic = document.querySelector('.ccm-custom-style-fullscalearea2-636').innerText;

      return {
        weekendTraffic: weekendTraffic.split('\n')
      }

    });

    
    browser.close();

    return ({
      traffic,
    })
  }

  // Enter the scraped data into mongoDB
  scrape().then((data) => {
    console.log('***************************TRAFFIC********************************');
    console.log("Got traffic info from GOI70.com/travel/"); // Success!

    var writeData = JSON.stringify(data);
    console.log(writeData)

    const MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkiGfApp', (err, client) => {
      if (err) {
        return console.log('Unable to connect to MongoDB server');
      }
      // connected to mongoDB
      console.log('Connected to MongoDB server');

      // local vs deployed dbase
      let dbStr = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';
      const db = client.db(dbStr);

      db.collection(dbStr).insertOne({
        type: 'traffic',
        data: writeData,
      }, (err, result) => {
        if (err) {
          // something went wrong
          console.log('Unable to insert traffic data to SkiGfApp');
        }
        // the data was entered!
        console.log(JSON.stringify(result.ops, undefined, 2))
        console.log('traffic data was entered into mongoDB')
      });

      db.collection('SkiGfApp').find().toArray().then((docs) => {
        console.log(`Total: ${docs.length} objects found`);
        //console.log(docs);

        client.close();
        
      }, (err) => {
        console.log('Unable to fetch data', err);
      });

    });

  });
  console.log('***********************************************************');

}

updateTrafficInfo();

module.exports = {
  updateTrafficInfo
}
