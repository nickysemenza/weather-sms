# Twilio + the weather: Intro to APIs
## Hello World talk by Nicky Semenza

This is a fairly basic nodejs application, that enables you to text a number with a location name, and it will reply with the weather.


To run this yourself, you need to have NodeJS and git installed. Google is your friend 😉
1. Sign up for Twilio and darksky.net, and get API keys for both.
2. run `git clone https://github.com/nickysemenza/weather-sms.git`
3. `cd weather-sms`
4. `npm install`
5. running `node server.js` will start the HTTP server on port 8392. But we need to point Twilio to this. This can be done by either hosting on a cloud platform (AWS, DigitalOcean, Heroku), or by using a service like `localtunnel` or `ngrok` You then put the Twilio Callback URL to be `http://publicurl.com/sms`