// This is the server-side file of the socket server implementation
// It initializes socket.io and a new express instance.
// Start it by running 'node socket.io-server' from your terminal.


// Define global vars
let express,
	app,
	port,
	io,
	clients,
	five;


/**
* initialize basic requirements for the server
* @returns {undefined}
*/
const initBasicRequirements = function() {

	//create express server
	express = require('express');
	app = express();

	//set port that we'll use
	port = process.env.PORT || 3000;// This is needed if the app is run on heroku and other cloud providers

	// Initialize a new socket.io object. It is bound to 
	// the express app, which allows them to coexist.
	io = require('socket.io').listen(app.listen(port));

	// Make the files in the public folder available to the world
	app.use(express.static(__dirname + '/public'));

	five = require('johnny-five');
};



/**
* handle event that just has to be passed through to all sockets
* this way, we don't have to listen for and handle specific events separately
* @param {object} data Object containing {string} eventName and [optional {object} eventData]
* @returns {undefined}
*/
const passThroughHandler = function(data) {
	if (data.eventName) {
		clients.emit('hubevent', data);// hub-client-socketIO.js will pick this up and fire body event
	}
};

/**
* handle led toggle
* @returns {undefined}
*/
const ledHandler = function(data) {
	// console.log(data);
	const led = new five.Led(8);

	if (data.on) {
		led.on();
	} else {
		led.off();
	}
};



/**
* initialize connections to clients
* @returns {undefined}
*/
const initClientConnections = function() {
	clients = io.on('connect', function (socket) {
		// A new client has come online; send it a connectionready event
		socket.emit('connectionready');

		//set handler for events that only have to be passsed on to all sockets
		socket.on('passthrough', passThroughHandler);

		//set handlers for j5 events
		socket.on('led', ledHandler);
	});
};

/**
* initialize johnny-five
* @returns {undefined}
*/
const initFive = function() {
	console.log('Arduino is ready');
	const button = new five.Button({
		pin: 11,
		isPullup: true
	});

	button.on('down', () => {
		const data = {
			eventName: 'buttonDown.j5',
			pin: 11
		};
		passThroughHandler(data);
	});

};



/**
* Initialize everything
* @param {string} varname Description
* @returns {undefined}
*/
const init = function() {
	initBasicRequirements();
	initClientConnections();
	five.Board().on('ready', initFive);
	console.log('Now running on http://localhost:' + port);
};


// kick things off
init();
