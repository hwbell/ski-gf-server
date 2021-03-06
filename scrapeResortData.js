const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// define the promise for scraping the data from keystone/abasin websites, since
// there isnt an api to use. probably will have to change this as they modify 
// the websites fairly often, it seems

// below, save the data

const updateSnowInfo = () => {
  let scrape = async () => {
    const today = new Date();
    const timeStamp = (`${today.getDate()}, ${today.getHours()}: ${today.getMinutes()}`);
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();

    // // keystone scrape
    // await page.goto('https://www.keystoneresort.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx');
    // await page.click('#forecastTodayContainer');
    // await page.waitFor(1000);
    // await page.waitForSelector('.snow_report__metrics');

    // const keystoneWeather = await page.evaluate(() => {
    //   let keystoneToday = document.querySelector('.snow_report__metrics').innerText;

    //   return {
    //     keystoneToday: keystoneToday.split('\n')
    //   }

    // });

    // abasin scrape
    await page.goto('https://www.arapahoebasin.com/');
    await page.click('.ab-headerConditions_conditions');
    await page.waitFor(1000);
    await page.waitForSelector('.ab-condition_wrapper');

    const aBasinWeather = await page.evaluate(() => {
      let aBasinToday = document.querySelector('.ab-condition_wrapper').innerText;

      return {
        aBasinToday: aBasinToday.split('\n')
      }

    });

    // opensnow scrape
    await page.goto('https://opensnow.com/dailysnow/colorado');
    await page.waitFor(1000);
    await page.waitForSelector('.post');

    const openSnowOutlook = await page.evaluate(() => {
      let openSnowToday = document.querySelector('.post').innerText;
      console.log(openSnowToday)
      return {
        openSnowToday: openSnowToday.split('\n')
      }
    
    });

    browser.close();

    return ({
      timeStamp,
      // keystoneWeather,
      aBasinWeather,
      openSnowOutlook
    })
  }

  // Once we have the data, save it to a local json file on the server. if 
  // one is present with the same name, it just gets replaced, so there isnt
  // a data buildup.

  scrape().then((data) => {
    console.log('***********************************************************');
    console.log("Got snow info from Keystone + A Basin"); // Success!

    var writeData = JSON.stringify(data);
    console.log(writeData)
    
    // fs.writeFile(path.join(__dirname, 'public/json/snowData.json'), writeData, (err) => {
    //   console.log(`writing snow data to ${path.join(__dirname, 'public/json/snowData.json')}`);
    //   if (err) {
    //     console.log(err);
    //   }
    // });

    // write to mongodb instead of fs.writeFile, as fs does not 
    // actually work on heroku.

    const MongoClient = require('mongodb').MongoClient;

    MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkiGfApp', (err, client) => {
      if (err) {
        return console.log('Unable to connect to MongoDB server');
      }
      console.log('Connected to MongoDB server');
      let dbStr = process.env.MONGODB_URI ? 'heroku_ktdh1smp' : 'SkiGfApp';
      const db = client.db(dbStr);

      db.collection(dbStr).insertOne({
        type: 'snow',
        data: writeData,
      }, (err, result) => {
        if (err) {
          console.log('Unable to insert snow data to SkiGfApp');
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
      });

      db.collection('SkiGfApp').find().toArray().then((docs) => {
        console.log(`Total: ${docs.length} objects found`);
        // console.log(docs);

        client.close();
        
      }, (err) => {
        console.log('Unable to fetch data', err);
      });

      
    });

  });
  console.log('*****************************SNOW******************************');

}

// updateSnowInfo();

module.exports = {
  updateSnowInfo
}