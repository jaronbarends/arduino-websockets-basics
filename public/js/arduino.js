(function() {

	'use strict';

	/* globals io, hubProxy */ //instruction for jshint
	
	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.
	// hubProxy is defined in socket.io-hub-proxy.js

	const body = document.body;


	/**
	* send some event to all clients through the hubProxy
	* @returns {undefined}
	*/
	const someSendFunction = function() {
		// example code:
		const data = {
			foo: bar
		};
		window.hubProxy.sendEventToClients('someEventName', data);
	};
	

	/**
	* handle someEvent coming from socket
	* @param {CustomEvent} evt - The event coming from the socket through the hubProxy
	* @returns {undefined}
	*/
	const someEventHandler = function(evt) {
		console.log('event data:', evt.detail);
	};
	
	

	/**
	* add listeners for body-events coming from the hub through the hubProxy
	* @returns {undefined}
	*/
	const initHubProxyListeners = function() {
		// example code:
		body.addEventListener('someEventName.hub', someEventHandler);
	};

	/**
	* initialize led toggle
	* @returns {undefined}
	*/
	const initToggle = function() {
		const cb = document.getElementById('led');
		cb.addEventListener('change', (e) => {
			const on = e.target.checked;
			window.hubProxy.sendEvent('led', {
				on
			});
			// const led = new five.Led(8);

			// if (on) {
			// 	led.on();
			// } else {
			// 	led.off();
			// }
		});
	};
	

	
	/**
	* initialize this script when the hub-proxy is ready
	* @returns {undefined}
	*/
	const init = function() {
		initHubProxyListeners();
		initToggle();
	};



	// single point of entry: init when connection is ready	
	if (window.hubProxy && window.hubProxy.isReady) {
		init();
	} else {
		body.addEventListener('hubready.hub', init);
	}

})();