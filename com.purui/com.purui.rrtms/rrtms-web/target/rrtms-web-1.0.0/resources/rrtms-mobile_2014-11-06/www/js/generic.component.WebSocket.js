window.generic = window.generic || {};
generic.component = generic.component || {};

generic.component.WebSocket = function(obj) {
	/**
	 * 0 : CONNECTING<br>
	 * 1 : OPEN<br>
	 * 2 : CLOSING<br>
	 * 3 : CLOSED
	 */
	var ws = null, interval = null, service = {
		destroy : function() {
			console.log('destroy WebSocket...');
			if (interval) {
				clearInterval(interval);
			}

			if (ws != null) {
				if (ws.readyState == 1) {
					this.unsubscribe();
				}
				console.log('close');
				ws.close();
				ws = null;
			}
		},
		url : generic.variables.url.WEBSOCKET_URL,
		init : function() {
			var reference = this;

			ws = new WebSocket(this.url);
			ws.onopen = function() {
				reference.heartbeat();
				if (reference.onopen) {
					reference.onopen();
				}
			};
			ws.onerror = function(event) {
				reference.onerror(event);
			};
			ws.onmessage = function(event) {
				reference.onmessage(event);
			};
		},
		heartbeat : function() {
			console.log('heartbeat');
			var reference = this;

			interval = setInterval(function() {
				if (ws.readyState == 1) {
					ws.send(JSON.stringify({
						actionType : 'HEARTBEAT'
					}));
				} else {
					console.log('WebSocket is not ready yet!');
				}
			}, 50000);
		},
		subscribe : function(channels) {
			console.log('subscribe', channels ? channels : '');
			if (!channels || channels.length == 0) {
				return;
			}

			if (ws == null) {
				generic.message.failure('WebSocket not init');
				return;
			}

			var state = ws.readyState, reference = this, request = null;

			if (state > 1) {
				generic.message.failure('WebSocket is closing or closed');
				return;
			}

			if (state != 1) {
				generic.message.failure('WebSocket is connecting, try again in one second!');
				setTimeout(function() {
					reference.subscribe(channels);
				}, 1000);
			}

			request = JSON.stringify({
				actionType : 'SUBSCRIBE',
				channel : channels
			});
			console.log(request);

			ws.send(request);
		},
		unsubscribe : function(channels) {
			console.log('unsubscribe', channels ? channels : '');

			if (!channels) {
				channels = [ '*' ];
			}

			if (ws != null && ws.readyState == 1) {
				ws.send(JSON.stringify({
					actionType : "UNSUBSCRIBE",
					channel : channels
				}));
			}

		},
		publish : function(channels, message){
			if (message === null || message.trim() === ''){
				generic.message.alert('请输入内容！');
				return;
			}
			
			if (ws != null && ws.readyState == 1) {
				ws.send(JSON.stringify({
					actionType : "PUBLISH",
					channel : channels,
					message : message
				}));
			}
		},
		onerror : function(event) {
			console.log('ERROR', event.data);
		},
		onmessage : function(event) {
			console.log('MESSAGE', event.data)
		}
	};

	if (obj) {
		$.extend(service, obj);
	}
	service.init();

	return {
		subscribe : function(channels) {
			service.subscribe(channels);
		},
		unsubscribe : function(channels) {
			service.unsubscribe(channels);
		},
		publish : service.publish,
		destroy : function() {
			service.destroy();
		}
	};
};
