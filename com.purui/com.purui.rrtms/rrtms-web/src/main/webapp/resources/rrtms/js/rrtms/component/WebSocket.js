if (!window.com) {
	var com = {};
}
if (!com.component) {
	com.component = {};
}
com.component.WebSocket = function(params) {
	var url = (params && params.url) || 'ws://' + window.location.host + '/ws';

	var ws = new WebSocket(url);

	var interval = null;
	var status = "INIT";
	STATUS = {
		INIT : 'INIT',
		SUBSCRIBE : 'SUBSCRIBE',
		UNSUBSCRIBE : 'UNSUBSCRIBE'
	};

	ws.onerror = onerror;
	ws.onmessage = onmessage;

	interval = setInterval(function() {
		if (ws.readyState != 1) {
			console.log('WebSocket is not ready yet!');
			return;
		}
		ws.send(JSON.stringify({
			actionType : "HEARTBEAT"
		}));
	}, 50000);

	function onerror(event) {
		if (params && params.onerror) {
			params.onerror(event);
		} else {
			bootbox.alert(event.data);
		}
	}
	function onmessage(event) {
		if (params && params.onmessage) {
			if (status === STATUS.SUBSCRIBE) {
				params.onmessage(event);
			} else {
				console.log('已经注销', event.data);
			}
		} else {
			console.log(event.data);
		}
	}
	function validateWS() {
		if (ws == null) {
			bootbox.alert('连接失败！');
			return false;
		} else if (ws.readyState != 1) {
			bootbox.alert('正在连接中，请稍后重试！');
			return false;
		}
		return true;
	}

	function subscribe(channel) {
		if (!ws) {
			console.log('ws 已注销，退出');
			message.error('WebSocket 初始化失败');
			return;
		}

		if (!channel || channel.length == 0) {
			message.error('主题不能为空');
			return;
		}

		if (ws.readyState != 1) {
			message.warning('建立连接中...');
			setTimeout(function() {
				console.log(new Date().getTime(), '>>resubscribe...');
				subscribe(channel);
			}, 1000);
			return;
		}

		var request = JSON.stringify({
			actionType : 'SUBSCRIBE',
			channel : channel
		});
		console.log(request);

		ws.send(request);
		status = STATUS.SUBSCRIBE;
	}

	return {
		destroy : function() {
			console.log('destroy websocket');
			if (interval) {
				clearInterval(interval);
			}
			this.unsubscribe([ '*' ]);
			if (ws || ws.readyState == 1) {
				ws.close();
			}
			ws = null;
		},
		subscribe : function(channels) {
			subscribe(channels);
		},
		unsubscribe : function(channels) {
			if (!channels || channels.length == 0) {
				channels = [ '*' ];
			}

			if (!validateWS()) {
				return false;
			}

			ws.send(JSON.stringify({
				actionType : "UNSUBSCRIBE",
				channel : channels
			}));
			status = STATUS.UNSUBSCRIBEE;
		},
		getStatus : function() {
			if (!ws) {
				return -1;
			}
			return ws.readyState;
		},
		getOriginalWebSocket : function() {
			return ws;
		}
	};
};