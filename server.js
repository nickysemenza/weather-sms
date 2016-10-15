var request = require('request');
var NodeGeocoder = require('node-geocoder');
var twilio = require('twilio');
var bodyParser = require('body-parser');
var settings = require('./settings');
const DARKSKY_API_KEY = settings.keys.darksky;
const accountSid = settings.keys.twilioAccountSid; // Your Account SID from www.twilio.com/console
const authToken = settings.keys.twilioAuthToken;   // Your Auth Token from www.twilio.com/console
const TWILIO_NUMBER = settings.keys.twilioNumber;
var client = new twilio.RestClient(accountSid, authToken);

/** 
 * Given latitude and longitude, along with requested location and phone nummber
 * Calls darkSky API and messages the number with the result
 */ 
function sendForecast(lat, lon, location, requesterPhoneNumber) {
	request('https://api.darksky.net/forecast/'+DARKSKY_API_KEY+'/'+lat+','+lon, function (error, response, body) {
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
	//res is an object containing our latitude and longitude
		if(res==null || res[0]==null || res[0].latitude==null)
			sendTwillioMessage(requesterPhoneNumber,location+" is not a valid location 😢");
  		else
  			sendForecast(res[0].latitude,res[0].longitude,location, requesterPhoneNumber);
	});
}

/**
* Given a Phone number and message, it will send given message to that number.
*/ 
function sendTwillioMessage(number, message) {
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
  res.send('Hello World!');
  getWeather("west lafayette",14083964786);

});

app.post('/sms', function (req, res) {
  var msg = req.body.Body;
  var from = req.body.From;
  console.log("Message '"+msg+"' received from "+from);
  getWeather(msg, from);
  //res.send(200);

});

app.listen(8392, function () {
  console.log('app listening on port 8392!');
});