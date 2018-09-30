const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

let scrape = async () => {
    const browser = await puppeteer.launch({headless: true});
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

    return {
      keystoneWeather,
      aBasinWeather
    };
};

scrape().then((data) => {
  console.log(data); // Success!
  
  var writeData = JSON.stringify(data);

  fs.writeFile('./public/json/snowData.json', writeData, (err) => {
    console.log(err);
  });
  
});