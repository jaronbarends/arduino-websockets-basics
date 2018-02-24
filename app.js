const nodeBridge = require('./socket.io-node-bridge.js');
const hubProxy = nodeBridge.hubProxy;
const five = require('johnny-five');


/**
* handle led toggle
* @returns {undefined}
*/
const ledHandler = function(data) {
	const led = new five.Led(8);

	if (data.isOn) {
		led.on();
	} else {
		led.off();
	}
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
			pin: 11
		};
		hubProxy.sendEventToClients('buttonDown.j5', data);
	});

};


/**
* initialize this app
* @returns {undefined}
*/
const init = function() {
	five.Board().on('ready', initFive);
	hubProxy.on('led.hub', ledHandler);
};

init();
