const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// define the promise for scraping the data from the GOI70 website, since
// there isnt an api to use. probably will have to change this as they modify 
// the websites fairly often, it seems

// below, save the data

const updateTrafficInfo = () => {
  let scrape = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://goi70.com/travel/');
    await page.click('.main-content');
    await page.waitFor(1000);
    //await page.waitForSelector('.grid twelve');

    const traffic = await page.evaluate(() => {
      let weekendTraffic = document.querySelector('.main-content').innerText;

      return {
        weekendTraffic: weekendTraffic.split('\n')
      }

    });

    
    browser.close();

    return ({
      traffic,
    })
  }

  // Once we have the data, save it to a local json file on the server. if 
  // one is present with the same name, it just gets replaced, so there isnt
  // a data buildup.
  
  scrape().then((data) => {
    console.log("Got traffic info from GOI70.com/travel/"); // Success!

    var writeData = JSON.stringify(data);

    fs.writeFile(path.join(__dirname, 'public/json/trafficData.json'), writeData, (err) => {
      if (err) {
        console.log(err);
      }
    });

  });
}

updateTrafficInfo();

module.exports = {
  updateTrafficInfo
}
