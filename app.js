const socketServer = require('./socket-j5-server.js');
const io = socketServer.io;
const five = socketServer.five;
const bridge = socketServer.bridge;

bridge.on('test', () => {
	console.log('test!');
});

