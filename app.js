var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var weatherPage = require('./routes/weather');
var snowPage = require('./routes/snow');
var port = process.env.PORT || 3000;

var weather = require('./fetchWeather.js');
var resort = require('./scrapeResortData.js')

var app = express();

//update data for weather and snow forecast every 30 mins
intervalTime = 60 * 30 * 1000; // 30 mins in milliseconds
let dataInterval = setInterval(() => {
	weather.updateWeatherInfo();
	resort.updateSnowInfo();
}, 5000);


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
