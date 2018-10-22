var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var weatherPage = require('./routes/weather');
var snowPage = require('./routes/snow');
var trafficPage = require('./routes/traffic');

var weather = require('./fetchWeather.js');
var resort = require('./scrapeResortData.js')
var traffic = require('./scrapeTrafficData.js')

var port = process.env.PORT || 3000;
var app = express();

// Get data once on startup and then update data every 60 mins
weather.updateWeatherInfo();
resort.updateSnowInfo();
traffic.updateTrafficInfo();

const intervalTime = 60 * 60 * 1000; // 60 mins in milliseconds
let dataInterval = setInterval(() => {
	weather.updateWeatherInfo();
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

console.log(`path: ${path}`);
console.log(`__dirname: ${__dirname}`);


app.use('/weather', weatherPage);
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
