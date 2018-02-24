const nodeBridge = require('./socket.io-node-bridge.js');
const hubProxy = nodeBridge.hubProxy;
const five = require('johnny-five');



/**
* handle led toggle
* @returns {undefined}
*/
const ledHandler = function(data) {
	console.log('ledHandler');
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
		console.log('button down');
		const data = {
			pin: 11
		};
		// nodeBridge.sendEventToClients('buttonDown.j5', data);
		hubProxy.sendEventToClients('buttonDown.j5', data);
		// passThroughHandler(data);
	});

};


/**
* initialize this app
* @returns {undefined}
*/
const init = function() {
	five.Board().on('ready', initFive);
	// nodeBridge.eventEmitter.on('led.hub', ledHandler);
	hubProxy.on('led.hub', ledHandler);

	console.log('on:', nodeBridge.on);
	console.log('eventEmitter.on:', nodeBridge.eventEmitter.on);

	nodeBridge.eventEmitter.on('test', () => {
		console.log('app.js received test on nodeBridge');
	});
};

init();
