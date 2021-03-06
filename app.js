var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// import the routes
var denverWeatherPage = require('./routes/denver-weather');
var silverthorneWeatherPage = require('./routes/silverthorne-weather');
var snowPage = require('./routes/snow');
var trafficPage = require('./routes/traffic');

// import the data gathering functions 
var weather = require('./fetchDarkSkyWeather.js');
var resort = require('./scrapeResortData.js')
var traffic = require('./scrapeTrafficData.js')

var port = process.env.PORT || 3000;
var app = express();

// locations are for darksky weather api, add more later?
const denver = {
  name: 'Denver',
  lat: 39.7392,
  long: -104.9848
};

const silverthorne = {
  name: 'Silverthorne',
  lat: 39.6296,
  long: -106.0713
};

const locations = [denver, silverthorne];

// Get data once on startup and then update data every 60 mins
weather.updateWeatherInfo(locations);
resort.updateSnowInfo();
traffic.updateTrafficInfo();

const intervalTime = 60 * 60 * 1000; // 0.5 mins in milliseconds
let dataInterval = setInterval(() => {
	weather.updateWeatherInfo(locations);
	resort.updateSnowInfo();
	traffic.updateTrafficInfo();
}, intervalTime);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// console.log(`path: ${path}`);
// console.log(`__dirname: ${__dirname}`);


app.use('/denver-weather', denverWeatherPage);
app.use('/silverthorne-weather', silverthorneWeatherPage);
app.use('/snow', snowPage);
app.use('/traffic', trafficPage);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


app.listen(port, () => {
	console.log(`Started up at port ${port}`);
})

module.exports = app;
