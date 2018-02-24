const events = require('events');
const socketServer = require('./socket-j5-server.js');
// create shorter versions of socketServer properties
const io = socketServer.io;// send events here
const ioEventEmitter = socketServer.ioEventEmitter;// listen on this one for events
const eventEmitter = new events.EventEmitter();
// const five = socketServer.five;
// const ioEventEmitter = socketServer.ioEventEmitter;
const hubProxy = new events.EventEmitter();


/**
* send an event to the hub
* @param {string} eventName The name of the event to send
* @param {object} data The event's data
* @returns {undefined}
*/
const sendHubEvent = function(eventName, data) {
	io.emit(eventName, data);
};


/**
* send an event to the hub to have it passed on to all clients
* @param {string} eventName The name of the event to send
* @param {object} data The event's data
* @returns {undefined}
*/
const sendEventToClients = function(eventName, eventData) {
	// console.log('nodebridge sendEventToClients', eventName, eventData);
	const data = {
		eventName,
		eventData
	};
	// trigger passthroughHandler on hub; hub will just forward it to all clients
	socketServer.passThroughHandler(data);
};


/**
* handle incoming event from hub
* @returns {undefined}
*/
const hubeventHandler = function(data) {
	const eventName = data.eventName + '.hub',
		eventData = data.eventData;

	console.log('hubeventHandler go emit:', eventName, eventData);
	// trigger the appropriate event from the body
	// eventEmitter.emit(eventName, eventData)
	hubProxy.emit(eventName, eventData)
};


/**
* initialize this app
* @returns {undefined}
*/
const init = function() {
	// ioEventEmitter.on('led.hub', ledHandler);
	ioEventEmitter.on('hubevent', hubeventHandler);

	// create hubProxy object for export, based on EventEmitter
	// const hubProxy = 
	// extend object with methods
	hubProxy.sendEvent = sendHubEvent;
	hubProxy.sendEventToClients = sendEventToClients;

	exports.sendEventToClients = sendEventToClients;
	exports.sendEvent = sendHubEvent;
	exports.on = eventEmitter.on;
	exports.eventEmitter = eventEmitter;

	exports.hubProxy = hubProxy;

	// setTimeout(() => {
	// 	console.log('emit test');
	// 	eventEmitter.emit('test');
	// }, 1000);
};

init();
