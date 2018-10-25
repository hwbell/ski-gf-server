const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// define the promise for scraping the data from keystone/abasin websites, since
// there isnt an api to use. probably will have to change this as they modify 
// the websites fairly often, it seems

// below, save the data

const updateSnowInfo = () => {
  let scrape = async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.keystoneresort.com/the-mountain/mountain-conditions/snow-and-weather-report.aspx');
    await page.click('#forecastTodayContainer');
    await page.waitFor(1000);
    await page.waitForSelector('.forecast__today__primary');

    const keystoneWeather = await page.evaluate(() => {
      let keystoneToday = document.querySelector('.forecast__today__primary').innerText;

      return {
        keystoneToday: keystoneToday.split('\n')
      }

    });

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

    browser.close();

    return ({
      keystoneWeather,
      aBasinWeather
    })
  }

  // Once we have the data, save it to a local json file on the server. if 
  // one is present with the same name, it just gets replaced, so there isnt
  // a data buildup.
  
  scrape().then((data) => {
    console.log("Got snow info from Keystone + A Basin"); // Success!

    var writeData = JSON.stringify(data);

    fs.writeFile(path.join(__dirname, 'public/json/snowData.json'), writeData, (err) => {
      console.log(`writing snow data to ${path.join(__dirname, 'public/json/snowData.json')}`);
      if (err) {
        console.log(err);
      }
    });

  });
}

updateSnowInfo();

module.exports = {
  updateSnowInfo
}