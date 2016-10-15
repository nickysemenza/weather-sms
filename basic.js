//import a bunch of node libraries
var request = require('request');
var NodeGeocoder = require('node-geocoder');
var settings = require('./settings');

//load our keys from settings.js
const DARKSKY_API_KEY = settings.keys.darksky;

/** 
 * Given latitude and longitude, along with requested location and phone nummber
 * Calls darkSky API and messages the number with the result
 */ 
function getForecast(lat, lon, location) {
	var requestUrl = 'https://api.darksky.net/forecast/'+DARKSKY_API_KEY+'/'+lat+','+lon;
	request(requestUrl, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	var parsed = JSON.parse(body);
	    var msg =
	    	"It is currently " + parsed.currently.temperature + 
	    	" degrees, with " + (parsed.currently.precipProbability * 100) + 
	    	"% chance of rain in " + location;
		console.log(msg);
	  }
	});
}
/**
 * Given a location and phone of requester, it will:
 * geocode that location (convert to longitude and latitude)
 * If geocode is unsuccesfull, it will let us know
 * If geocode, works it calls sendForecast
 */ 
function getWeather(location) {
	var geocoder = NodeGeocoder({provider: 'google'});
	geocoder.geocode(location, function(err, res) {
		if(res==null || res[0]==null || res[0].latitude==null) //geocoding failed 
			console.log('oops something went wrong with geocode');
  		else //we got the longitude and latitude
  			getForecast(res[0].latitude,res[0].longitude,location);
	});
}
getWeather("West Lafayette");
getWeather("bad location");