window.generic = window.generic || {};

generic.Realtime = function(obj) {
	$.extend(this, obj);
	this.init();
};
generic.Realtime.prototype = {
	destroy : function() {
		console.log('destroy ' + this.title);
		if (this.ws && this.ws.destroy) {
			this.ws.destroy();
			this.ws = null;
		}
	},
	init : function() {
		console.log('init ' + this.title);
		this.$listPoint = this.$context.find('#list-point');
		this.$listPoint.empty();
		this.initWebSocket();
		this.station = generic.service.getStationHierarchy(generic.variables.currentCode);
		this.listAllPoint();
	},
	active : function() {
		console.log('active ' + this.title);
	},
	stop : function() {
		console.log('stop ' + this.title);
		this.destroy();
	},
	listAllPoint : function() {
		var buffer = [];

		(function _parse(points) {
			console.log(points);
			points.forEach(function(point) {
				buffer.push('<li><a class="data-point ui-btn ui-btn-icon-right ui-icon-carat-r" href="#" guid="' + point.guid + '">' + point.name + '</a></li>');

				if (point.children && point.children.length > 0) {
					_parse(point.children);
				}
			});
		})(this.station.points[0].children);

		this.$listPoint.empty().append(buffer.join(''));

		(function(reference) {
			reference.$listPoint.find('a.data-point').unbind('click').bind('click', function() {
				reference.listDataPoint($(this).attr('guid'));
			});
		})(this);
	},
	// not use
	listPoint : function(guid) {
		var reference = this, buffer = [];

		if (!guid) {
			this.station.points.forEach(function(point) {
				buffer.push('<li><a class="point ui-btn ui-btn-icon-right ui-icon-carat-r" href="#" guid="' + point.guid + '">' + point.name + '</a></li>');
			});
		} else {
			(function _find(points) {
				points.some(function(point) {
					if (point.guid == guid) {
						point.children.forEach(function(e) {
							if (e.children.length == 0) {
								buffer.push('<li class="ui-li-static ui-body-inherit">' + e.name + '</li>');
							} else {
								buffer.push('<li><a class="point ui-btn ui-btn-icon-right ui-icon-carat-r" href="#" guid="' + e.guid + '">' + e.name + '</a>' + '</li>');
							}
							buffer.push('<li><a class="data-point ui-btn ui-btn-icon-right ui-icon-carat-r" href="#" guid="' + e.guid + '">采集点</a></li>');
						});
						return true;
					} else {
						_find(point.children);
					}
				});
			})(this.station.points);
		}

		if (buffer.length == 0) {
			return;
		}

		this.$listPoint.empty().append(buffer.join(''));

		reference.$listPoint.find('a.point').unbind('click').bind('click', function() {
			reference.listPoint($(this).attr('guid'));
		});
		reference.$listPoint.find('a.data-point').unbind('click').bind('click', function() {
			reference.listDataPoint($(this).attr('guid'));
		});
	},
	listDataPoint : function(guid) {
		var buffer = [], currentPoint = null;

		(function _find(points) {
			points.some(function(point) {
				if (point.guid == guid) {
					point.dataPoints.forEach(function(dataPoint) {
						if (dataPoint.subTagType.code != '53' && dataPoint.subTagType.code != '54') {
							buffer.push('<li class="area-info ui-li-static ui-body-inherit ' + (dataPoint.subTagType.code == '52' ? 'switch' : '') + '">' + dataPoint.name + ' - '
									+ dataPoint.subTagType.name + ' - [<span guid=' + dataPoint.guid + '>0</span>' + dataPoint.unit + ']</li>');
						}
					});
					currentPoint = point;
					return true;
				} else {
					_find(point.children);
				}
			});
		})(this.station.points);

		if (buffer.length == 0) {
			return;
		}

		this.$listPoint.empty().append(buffer.join(''));
		var channel = currentPoint.currentId.replace('_', '.rt.');
		console.log(channel);
		this.ws.unsubscribe([ channel ]);
		this.ws.subscribe([ channel ]);
	},
	initWebSocket : function() {
		var reference = this;

		this.ws = new generic.component.WebSocket({
			onmessage : function(event) {
				console.log(event.data);

				var data = $.parseJSON(event.data);

				if (!data.push) {
					return;
				}

				data.forEach(function(e) {
					if (!e.hasOwnProperty('TagValue')) {
						return;
					}

					var $span = reference.$listPoint.find('span[guid="' + e.TagID + '"]');
					if ($span.length == 0) {
						return;
					}
					if ($span.parent().hasClass('switch')) {
						var _val = parseInt(e.TagValue);
						if (_val === 1) {
							$span.text('合闸-' + e.TagValue);
						} else if (_val === 0) {
							$span.text('分闸-' + e.TagValue);
						} else {
							$span.text(e.TagValue);
						}
					} else {
						$span.text(e.TagValue);
					}
				});

			}
		});
	}
};