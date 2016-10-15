//import a bunch of node libraries
var request = require('request');
var NodeGeocoder = require('node-geocoder');
var twilio = require('twilio');
var bodyParser = require('body-parser');
var settings = require('./settings');

//load our keys from settings.js
const DARKSKY_API_KEY = settings.keys.darksky;
const accountSid = settings.keys.twilioAccountSid; // Your Account SID from www.twilio.com/console
const authToken = settings.keys.twilioAuthToken;   // Your Auth Token from www.twilio.com/console
const TWILIO_NUMBER = settings.keys.twilioNumber;

/** 
 * Given latitude and longitude, along with requested location and phone nummber
 * Calls darkSky API and messages the number with the result
 */ 
function sendForecast(lat, lon, location, requesterPhoneNumber) {
	var requestUrl = 'https://api.darksky.net/forecast/'+DARKSKY_API_KEY+'/'+lat+','+lon;
	request(requestUrl, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var parsed = JSON.parse(body);
	    var msg =
	    	"It is currently " + parsed.currently.temperature + 
	    	" degrees, with " + (parsed.currently.precipProbability * 100) + 
	    	"% chance of rain in " + location;
		sendTwillioMessage(requesterPhoneNumber,msg);
	  }
	});
}

/**
 * Given a location and phone of requester, it will:
 * geocode that location (convert to longitude and latitude)
 * If geocode is unsuccesfull, it will text back saying so
 * If geocode, works it calls sendForecast
 */ 
function getWeather(location, requesterPhoneNumber) {
	var geocoder = NodeGeocoder({provider: 'google'});
	geocoder.geocode(location, function(err, res) {
		if(res==null || res[0]==null || res[0].latitude==null) //geocoding failed 
			sendTwillioMessage(requesterPhoneNumber,location+" is not a valid location 😢");
  		else //we got the longitude and latitude
  			sendForecast(res[0].latitude,res[0].longitude,location, requesterPhoneNumber);
	});
}

/**
* Given a Phone number and message, it will send given message to that number.
*/ 
function sendTwillioMessage(number, message) {
	var client = new twilio.RestClient(accountSid, authToken);
	client.messages.create({
	    body: message,
	    to: number,
	    from: TWILIO_NUMBER
	}, function(err, message) {
		console.log(err);
		console.log(message);
	});
}

var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/', function (req, res) {
  res.send('Hello World!');//sends the plain text "Hello World!" to the browser
});

app.post('/sms', function (req, res) {
  var msg = req.body.Body;// these are POST request parameters that Twilio sends us
  var from = req.body.From;// these are POST request parameters that Twilio sends us
  console.log("Message '"+msg+"' received from "+from);
  getWeather(msg, from);
});

app.listen(8392, function () {
  console.log('app listening on port 8392!');
});