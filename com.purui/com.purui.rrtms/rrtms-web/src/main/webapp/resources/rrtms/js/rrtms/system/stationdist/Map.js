com.rrtms.system.Map = function(params) {
	var subscribedChannels = {};
	var map = new BMap.Map("map");

	var markerIndex = {}, status = [ {
		code : 0,
		desc : '停止',
		getIcon : function() {
			return new BMap.Icon("resources/rrtms/image/station_stop.png", new BMap.Size(30, 30));
		}
	}, {
		code : 1,
		desc : '运行',
		getIcon : function() {
			return new BMap.Icon("resources/rrtms/image/station_run.png", new BMap.Size(30, 30));
		}
	}, {
		code : 2,
		desc : '故障抢修',
		getIcon : function() {
			return new BMap.Icon("resources/rrtms/image/station_fix.png", new BMap.Size(30, 30));
		}
	}, {
		code : 3,
		desc : '故障',
		getIcon : function() {
			return new BMap.Icon("resources/rrtms/image/station_fix.png", new BMap.Size(30, 30));
		}
	}, {
		code : 4,
		desc : '负荷交易',
		getIcon : function() {
			return new BMap.Icon("resources/rrtms/image/station_trade.png", new BMap.Size(30, 30));
		}
	} ];

	var lng = 120.603809;
	var lat = 31.274541;
	if (params.initLocation) {
		lng = params.initLocation.lng;
		lat = params.initLocation.lat;
	}

	var point = new BMap.Point(lng, lat); // 创建点坐标

	map.centerAndZoom(point, params.zoom ? params.zoom : 1);
	map.enableScrollWheelZoom();
	map.addControl(new BMap.NavigationControl());

	if (params.onClick) {
		map.addEventListener("click", params.onClick);
	}

	// map.addEventListener("moveend", generateMarker, false);
	// map.addEventListener("zoomend", generateMarker, false);

	var ws = new com.component.WebSocket({
		onmessage : function(event) {
			var data = JSON.parse(event.data);

			if (data.hasOwnProperty('RunStatus')) {
				var label = $('#lbl_' + data.StationCode);
				if (label.length == 0) {
					ws.unsubscribe([ data.StationCode + '.stationstatus' ]);
					console.log('没找到 ' + data.StationCode + ', 注销...');
					delete markerIndex[data.StationCode];
					return;
				}

				var marker = markerIndex[data.StationCode].marker;

				var text = 0;
				if (data.RunStatus == 1) {
					text = data.StationFuHeDatas.RTSumFuheValue.toFixed(3);
				}
				label.html('[' + text + ' KW]');

				var olderStatus = markerIndex[data.StationCode].status;
				if (olderStatus != data.RunStatus) {
					var icon = null;
					if (status[data.RunStatus] && status[data.RunStatus].getIcon) {
						icon = status[data.RunStatus].getIcon();
					}
					if (icon) {
						marker.setIcon(icon);
					}
					markerIndex[data.StationCode].status = data.RunStatus;
				}

				markerIndex[data.StationCode].updateTime = new Date().getTime();
			} else if (data.hasOwnProperty("warnLevel")) {
				if (user.userType != 'INTERNAL' && user.userType != 'PROVIDER') {
					if (data.EventTypeName == '网络事件' || data.EventTypeName == '网络通讯') {
						return;
					}
				}

				var strArray = [];
				strArray.push("<b>告警源：</b>");
				strArray.push(data.SeeName);
				strArray.push("&nbsp;&nbsp;&nbsp;&nbsp;");
				strArray.push("<b>报警类型：</b>");
				strArray.push(data.EventTypeName);
				strArray.push("&nbsp;&nbsp;&nbsp;&nbsp;");
				strArray.push("<b>报警等级：</b>");
				strArray.push(data.warnLevel);
				strArray.push("&nbsp;&nbsp;&nbsp;&nbsp;");
				strArray.push("<b>内容：</b>");
				strArray.push(data.WarnContent);
				strArray.push("&nbsp;&nbsp;&nbsp;&nbsp;");
				strArray.push("<b>发生时间：</b>");
				strArray.push(dateTimeFormat(new Date(data.Atime)));
				strArray.push("&nbsp;&nbsp;&nbsp;&nbsp;");
				strArray.push("&nbsp;&nbsp;&nbsp;&nbsp;");
				if (user.userType == 'INTERNAL' || isAdmin()) {
					strArray.push('<a class="warn" guid="' + data.MsgGuid + '" href="#" date="' + new Date(data.Atime).getTime() + '" code = "' + data.StationCode + '">处理</a>');
				}
				strArray.push("&nbsp;&nbsp;&nbsp;&nbsp;");
				strArray.push("&nbsp;&nbsp;&nbsp;&nbsp;");
				strArray.push('<a href="system/station/' + data.StationCode + '/detail?_=' + new Date().getTime() + '" target="_blank">站点</a>');
				kendoConsole.error(strArray.join(""));

				addWarning(data.StationCode);
			}

		}
	});

	function addWarning(code) {
		if (markerIndex.hasOwnProperty(code + '-WARNING')) {
			return;
		}

		if (!markerIndex[code]) {
			return;
		}

		move(markerIndex[code].position);

		var stationMarker = markerIndex[code].marker;

		var warnMarker = new BMap.Marker(stationMarker.getPosition(), {
			icon : new BMap.Icon("resources/rrtms/image/warning.gif", new BMap.Size(126, 70))
		});
		map.addOverlay(warnMarker);
		markerIndex[code + '-WARNING'] = warnMarker;
		$('#warnAudio')[0].play();
	}

	generateMarker();

	function getBounds() {
		var bounds = map.getBounds();
		return [ {
			lng : bounds.Tf.lng,
			lat : bounds.Tf.lat
		}, {
			lng : bounds.Lf.lng,
			lat : bounds.Lf.lat
		} ];
	}

	// 加载标注点
	function generateMarker() {
		var url = 'system/station/stationsbyarea';
		var bounds = getBounds();
		$.ajax({
			url : url,
			cache : true,
			async : true,
			dataType : 'json',
			data : {
				'positions[0].lng' : bounds[0].lng,
				'positions[0].lat' : bounds[0].lat,
				'positions[1].lng' : bounds[1].lng,
				'positions[1].lat' : bounds[1].lat
			},
			error : handleError,
			success : function(stations) {
				setTimeout(function() {
					addMarkers(stations, bounds);
					map.setZoom(12);
				}, 1000);
			}
		});
	}

	function addMarkers(stations, bounds) {
		if (bounds) {
			var currentBounds = getBounds();
			if (JSON.stringify(bounds) != JSON.stringify(currentBounds)) {
				return;
			}
		}

		map.clearOverlays();
		for (var i = 0; i < stations.length; i++) {
			addMarker(stations[i]);
		}

		subscribe(stations, bounds);

		console.log(markerIndex);
	}

	function addMarker(station) {
		var point = new BMap.Point(station.lon, station.lat);
		var marker = new BMap.Marker(point, {
			icon : new BMap.Icon("resources/rrtms/image/station.png", new BMap.Size(30, 30))
		});

		var label = new BMap.Label(station.name + " <span id='lbl_" + station.code + "'></span>", {
			"offset" : new BMap.Size(15, -20)
		});

		marker.setLabel(label);
		map.addOverlay(marker);
		markerIndex[station.code] = {
			marker : marker,
			updateTime : new Date().getTime(),
			status : 99999,
			position : {
				lng : station.lon,
				lat : station.lat
			}
		};

		if (true) {
			return;
		}
		(function() {
			var infoWindow = new BMap.InfoWindow('<div class="infoWindow" style="border : 1px solid #ADADAD;width:250px;height:150px;overflow-y:auto;">' + station.code + '</div>');
			label.addEventListener("click", function(e) {
				marker.openInfoWindow(infoWindow);
			});
			marker.addEventListener("click", function(e) {
				marker.openInfoWindow(infoWindow);
			});

			infoWindow.addEventListener('open', function() {
				marker.getLabel().hide();
			});
			infoWindow.addEventListener('close', function() {
				marker.getLabel().show();
			});
		})();
	}

	function subscribe(stations) {
		ws.unsubscribe([ '*' ]);
		var channel = [];

		stations.forEach(function(station) {
			channel.push(station.code + '.stationstatus');
			channel.push('warns.' + station.code);
		});

		if (channel.length == 0) {
			return;
		}
		ws.subscribe(channel);
		console.log('订阅 ' + channel.length / 2 + ' 个');

	}

	function move(params) {
		if (!params.lng || !params.lat) {
			return;
		}

		map.setZoom(params.zoom ? params.zoom : 14);
		map.setCenter(new BMap.Point(params.lng, params.lat));
	}

	var loop = setInterval(function() {
		var code = null;
		var current = new Date().getTime();
		for (code in markerIndex) {
			if (current - markerIndex[code].updateTime > $.STATION_DIST_TIME_OUT) {
				if (markerIndex[code].status != 0) {
					markerIndex[code].marker.setIcon(status[0].getIcon());
					console.log('change stop icon');
					markerIndex[code].status = 0;
				}
			}
		}
	}, 1000);

	function removeWarning(code) {
		if (markerIndex.hasOwnProperty(code + '-WARNING')) {
			map.removeOverlay(markerIndex[code + '-WARNING']);
			delete markerIndex[code + '-WARNING'];
		}
	}

	return {
		destroy : function() {
			if (ws && ws.destroy) {
				console.log('destroy ws');
				ws.destroy();
				ws = null;
			}
			if (map) {
				console.log('destroy map');
				map = null;
			}

			clearInterval(loop);
		},
		getBounds : function() {
			return getBounds();
		},
		move : function(params) {
			move(params);
		},
		getOriginalMap : function() {
			return map;
		},
		getOriginalWebSocket : function() {
			return ws.getOriginalWebSocket();
		},
		removeWarning : function(code) {
			removeWarning(code);
		}
	};
};