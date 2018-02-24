const events = require('events');
const socketServer = require('./socket-j5-server.js');
// create shorter versions of socketServer properties
const io = socketServer.io;// send events here
const ioEventEmitter = socketServer.ioEventEmitter;// listen on this one for events
const hubProxy = new events.EventEmitter();// object that will be exported


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

	// trigger the appropriate event
	hubProxy.emit(eventName, eventData)
};


/**
* initialize this app
* @returns {undefined}
*/
const init = function() {
	// listen for events coming from io
	ioEventEmitter.on('hubevent', hubeventHandler);

	// extend hubProxy object with methods
	hubProxy.sendEvent = sendHubEvent;
	hubProxy.sendEventToClients = sendEventToClients;

	exports.hubProxy = hubProxy;
};

init();
