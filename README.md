# Twilio + the weather: Intro to APIs
## Hello World talk by Nicky Semenza

[Link to my slides](https://docs.google.com/presentation/d/1mehkaVHPb2SrYNL-KQVq8pLYJ7VI5CV46syxsvrIoMg/edit?usp=sharing)

This is a fairly basic nodejs application, that enables you to text a number with a location name, and it will reply with the weather.

To run this yourself, you need to have NodeJS and git installed. Google is your friend 😉


###To run the basic example, that doesn't use twillio:
1. run `git clone https://github.com/nickysemenza/weather-sms.git`
2. `cd weather-sms`
3. Sign up for darksky.net, and get your API key. copy `settings.example.js` to `settings.js` and put in your key (ignore the twilio entries)
4. `npm install`
5. running `node example.js` will run it!


###To run the full example
1. run `git clone https://github.com/nickysemenza/weather-sms.git`
2. `cd weather-sms`
3. Sign up for Twilio and darksky.net, and get API keys for both. copy `settings.example.js` to `settings.js` and put in your keys
4. `npm install`
5. running `node server.js` will start the HTTP server on port 8392. But we need to point Twilio to this. This can be done by either hosting on a cloud platform (AWS, DigitalOcean, Heroku), or by using a service like `localtunnel` or `ngrok` You then put the Twilio Callback URL to be `http://publicurl.com/sms`