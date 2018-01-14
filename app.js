'use strict';

// Imports dependencies and set up http server
const
	express = require('express'),
	bodyParser = require('body-parser'),
	request = require('request'),
	apiaiApp = require('apiai')('ffe516c82504460f9cfcda9bf3b14b29'),
	app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('Webhook is listening'));

app.get('/', (req, res) => {
	res.status(200).send("It works!");
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {

	let body = req.body;

	// Checks this is an event from a page subscription
	if (body.object === 'page') {

		// Iterates over each entry - there may be multiple if batched
		body.entry.forEach(function(entry) {

			// Gets the message. entry.messaging is an array, but 
			// will only ever contain one message, so we get index 0
			entry.messaging.forEach((event) => {
				if (event.message && event.message.text) {
					sendMessage(event);
				}
			});
			console.log(entry);
		});
		// Returns a '200 OK' response to all requests
		res.status(200).send('EVENT_RECEIVED');
	} else {
		// Returns a '404 Not Found' if event is not from a page subscription
		res.sendStatus(404);
	}

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

	// Your verify token. Should be a random string.
	let VERIFY_TOKEN = "TOKEN"

	// Parse the query params
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	// Checks if a token and mode is in the query string of the request
	if (mode && token) {

		// Checks the mode and token sent is correct
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {

			// Responds with the challenge token from the request
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);

		} else {
			// Responds with '403 Forbidden' if verify tokens do not match
			res.sendStatus(403);
		}
	} else res.status(404).send("Request not found");
});

function sendMessage(event) {
	let sender = event.sender.id;
	let text = event.message.text;

	let apiai = apiaiApp.textRequest(text, {
		sessionId: 'tabby_cat' // use any arbitrary id
	});

	apiai.on('response', (response) => {
		let aiText = response.result.fulfillment.speech;

		request({
			url: 'https://graph.facebook.com/v2.6/me/messages',
			qs: {
				access_token: 'EAAZAn1fUAdrYBAFhv9Fjb11QgSQWnw0bVpZBIIsYZAfCsADr4cYDN0TXaIXrN0cU3J7oKZA9bW9JgOp2R8GrFSVHxIFvk9pWFuzLcw1a3gZCJ0bg2YAKmrPquAP2F6wez2OVCmCAJn7wxpUOLo2QOZAS70LYYugoowITqZCBVQkx1x7yBDGaDzJ'
			},
			method: 'POST',
			json: {
				recipient: {
					id: sender
				},
				message: {
					text: aiText
				}
			}
		}, (error, response) => {
			if (error) {
				console.log('Error sending message: ', error);
			} else if (response.body.error) {
				console.log('Error: ', response.body.error);
			}
		});
	});

	apiai.on('error', (error) => {
		console.log(error);
	});

	apiai.end();
}

/*
function sendMessage(event) {
	let sender = event.sender.id;
	let text = event.message.text;

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: 'EAAZAn1fUAdrYBAFhv9Fjb11QgSQWnw0bVpZBIIsYZAfCsADr4cYDN0TXaIXrN0cU3J7oKZA9bW9JgOp2R8GrFSVHxIFvk9pWFuzLcw1a3gZCJ0bg2YAKmrPquAP2F6wez2OVCmCAJn7wxpUOLo2QOZAS70LYYugoowITqZCBVQkx1x7yBDGaDzJ'
		},
		method: 'POST',
		json: {
			recipient: {
				id: sender
			},
			message: {
				text: text
			}
		}
	}, function(error, response) {
		if (error) {
			console.log('Error sending message: ', error);
		} else if (response.body.error) {
			console.log('Error: ', response.body.error);
		}
	});
} */