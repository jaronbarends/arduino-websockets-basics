const socketServer = require('./socket-j5-server.js');
// create shorter versions of socketServer properties
const {io, five, hubProxy} = socketServer;
// const five = socketServer.five;
// const hubProxy = socketServer.hubProxy;

hubProxy.on('test', () => {
	console.log('test!');
});

hubProxy.on('test.hub', (data) => {
	console.log('test.hub', data);
});

io.on('hubevent', (data) => {
	console.log('hubevent from io');
});

