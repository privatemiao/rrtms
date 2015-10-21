window.generic = window.generic || {};
generic.StationDetail = function() {
	this.station = ko.observable();
	this.points = ko.observableArray();
	this.tips = ko.observable([]);

	this.warninginfos = ko.observableArray([]);

	this.currentStation = JSON.parse(plus.storage.getItem('currentStation'));

	this.$chart = document.querySelector('#chart');

	this.init();
	
};

generic.StationDetail.prototype = {
	init : function() {
		this.prepare();

		this.prepareWarning(true);
		this.eventComponent();
	},
	prepare : function() {
		var station = JSON.parse(plus.storage.getItem('currentStation'));
		console.log('getCurrentStation>>' + plus.storage.getItem('currentStation'));
		station.pointSize = 0;
		(function(reference) {
			generic.ajax({
				url : generic.variables.url.STATION_STATUS.replace('{code}', station.code),
				final : function(response) {
					mui.extend(station, response);
					if (station.loadData && station.loadData.realtimeSumValue) {
						station.loadData.realtimeSumValue = station.loadData.realtimeSumValue.toFixed(2);
					}

					generic.ajax({
						url : generic.variables.url.POINTS.replace('{code}', station.code),
						final : function(response) {
							station.pointSize = response.length > 0 ? response.length - 1 : response.length;
							reference.station(station);
						}
					});

				}
			});
		})(this);

		(function(reference) {
			generic.ajax({
				url : generic.variables.url.STATION_HIERARCHY.replace('{code}', station.code),
				final : function(response) {
					reference.stationHierarchy = response;
					reference.loadPointUI();
				}
			});
		})(this);
	},
	loadPointUI : function(guid) {
		if (guid === undefined || guid === null) {
			this.points(this.stationHierarchy.points[0].children);
			this.eventPointList();
		} else {
			(function(reference) {
				(function _findChildren(points) {
					for (var i = 0; i < points.length; i++) {
						if (points[i].guid === guid) {
							if (points[i].children.length === 0) {
								return;
							}
							reference.points(points[i].children);
							reference.eventPointList();
						} else {
							_findChildren(points[i].children);
						}
					}
				})(reference.stationHierarchy.points[0].children);
			})(this);
		}
	},
	eventPointList : function() {
		var anchors = document.querySelectorAll('#realtime a.mui-navigate-right');
		(function(reference) {
			for (var i = 0; i < anchors.length; i++) {
				anchors[i].addEventListener('click', function() {
					var guid = this.getAttribute('guid');
					reference.loadPointUI(guid);
				});
				anchors[i].addEventListener('longtap', function() {
					var guid = this.getAttribute('guid');
					var point = reference.getPoint(guid);
					plus.storage.setItem('currentPoint', JSON.stringify(point));
					//generic.openWindow('realtime.html');
					mui.openWindow({url:'realtime.html'});
				});
			}
		})(this);
	},
	getPoint : function(guid) {
		var found = null;

		(function _find(points) {
			for (var i = 0; i < points.length; i++) {
				if (points[i].guid === guid) {
					found = points[i];
					return;
				} else {
					_find(points[i].children);
				}
			}
		})(this.stationHierarchy.points[0].children);

		return found;
	},
	eventComponent : function() {
		(function(reference) {
			document.querySelector('.cust-action-back').addEventListener('click', function(e) {
				var tap = document.querySelector('.mui-content>div.mui-active');
				if (tap.getAttribute('id') === 'realtime') {
					var guid = document.querySelector('#realtime a').getAttribute('guid');
					var parent = reference.getParentPoint(guid);
					if (parent === null) {
						mui.back();
						return;
					}

					var grandpa = reference.getParentPoint(parent.guid);
					reference.loadPointUI(grandpa ? grandpa.guid : null);
				} else {
					mui.back();
				}
			});
		})(this);

		(function(reference) {
			var anchors = document.querySelectorAll('#warning-configured-tab>a');
			for (var i = 0; i < anchors.length; i++) {
				anchors[i].addEventListener('click', function() {
					var configured = this.getAttribute('configured');
					reference.warninginfos([]);
					reference.prepareWarning(configured == null ? null : (configured === 'true' ? true : false));
				});
			}
		})(this);

		(function(reference) {
			var anchors = document.querySelectorAll('#compare a');
			for (var i = 0; i < anchors.length; i++) {
				anchors[i].addEventListener('click', function() {
					for (var n = 0; n < anchors.length; n++) {
						anchors[n].style.color = '#007AFF';
						anchors[n].style.backgroundColor = '#fff';
					}
					this.style.backgroundColor = '#007AFF';
					this.style.color = '#fff';

					var method = this.getAttribute('method');
					if (method === null) {
						generic.message.error('没有指定方法！');
						return;
					}
					reference[method].call(reference);
				});
			}
		})(this);

		// (function(reference) {
		// var list = document.querySelectorAll('#compare li');
		// for (var i = 0; i < list.length; i++) {
		// list[i].addEventListener('click', function() {
		// for (var n = 0; n < list.length; n++) {
		// list[n].style.color = '#007AFF';
		// list[n].style.backgroundColor = '#fff';
		// }
		// this.style.backgroundColor = '#007AFF';
		// this.style.color = '#fff';
		//
		// var method = this.getAttribute('method');
		// if (method === null) {
		// generic.message.error('没有指定方法！');
		// return;
		// }
		// reference[method].call(reference);
		// });
		// }
		// })(this);
		(function(reference) {
			var anchors = document.querySelectorAll('nav>a');
			var tabs = document.querySelectorAll('.mui-content>div');
			for (var i = 0; i < anchors.length; i++) {
				anchors[i].addEventListener('click', function() {
					var id = this.getAttribute('href');
					for (var n = 0; n < tabs.length; n++) {
						if ('#' + tabs[n].getAttribute('id') == id) {
							tabs[n].style.display = 'block';
						} else {
							tabs[n].style.display = 'none';
						}
					}
				})
			}
		})(this);

	},
	getParentPoint : function(guid) {
		var list = this.stationHierarchy.points[0].children;
		for (var i = 0; i < list.length; i++) {
			if (list[i].guid === guid) {
				return null;
			}
		}

		var found = null;
		(function _findParent(points) {
			for (var i = 0; i < points.length; i++) {
				for (var n = 0; n < points[i].children.length; n++) {
					if (points[i].children[n].guid === guid) {
						found = points[i];
						break;
					} else {
						_findParent(points[i].children);
					}
				}
			}
		})(list);

		return found;
	},
	prepareWarning : function(configured) {
		(function(reference) {
			var data = {
				code : reference.currentStation.code,
				orderBy : 'atTime',
				sortBy : 'DESC',
				count : 10,
				skip : reference.warninginfos().length,
				configured : configured
			};
			console.log('Query Warning History>>' + JSON.stringify(data));
			generic.ajax({
				url : generic.variables.url.WARNING_HISTORY,
				traditional : true,
				data : data,
				final : function(response) {
					console.log("Warining History>>" + JSON.stringify(response));
					response.data.forEach(function(warn) {
						warn.warnContent = warn.warnContent.replace(/,/g, '</h5><h5>');
						warn.warnContent = '<h5>' + warn.warnContent + '</h5>';
						warn.date = dateTimeFormat(new Date(warn.atTime));
					});
					reference.warninginfos(reference.warninginfos().concat(response.data));

					// more button
					var _btn = document.querySelector('.btn-more-warninginfo');
					if (_btn) {
						_btn.remove();
					}
					if (response.skip + response.data.length < response.maxCount) {
						if (!document.querySelector('.btn-more-warninginfo')) {
							var div = document.createElement('div');
							div.innerHTML = '<li><button class="btn-more-warninginfo mui-btn mui-btn-positive mui-btn-block">更多</button></li>';
							document.querySelector('#list-warning-configured').appendChild(div.firstChild);

							document.querySelector('.btn-more-warninginfo').addEventListener('click', function() {
								reference.prepareWarning(configured);
							});
						}
						document.querySelector('.btn-more-warninginfo').innerHTML = '更多（' + (response.maxCount - response.skip - response.data.length) + '/' + response.maxCount + '）';
					}

				}
			});
		})(this);
	},
	compareEnergy : function() {
		(function(reference) {
			var currentDate = new Date();

			generic.ajax({
				url : generic.variables.url.COMPARE_ENERGY,
				data : {
					compareBy : 'code',
					compareByValue : reference.currentStation.code,
					startDate : new Date(currentDate.getTime() - 86400000),
					endDate : currentDate,
					type : 'day'
				},
				final : function(response) {
					if (!response || response.length == 0) {
						return;
					}

					response.forEach(function(e) {
						e.data = e.totalEnergys;
						delete e.totalEnergys;
					});
					reference.generateChart(response);

				}
			});
		})(this);

	},
	compareLoad : function() {
		(function(reference) {
			var currentDate = new Date();

			generic.ajax({
				url : generic.variables.url.COMPARE_LOAD,
				data : {
					compareBy : 'code',
					compareByValue : reference.currentStation.code,
					startDate : new Date(currentDate.getTime() - 86400000),
					endDate : currentDate,
					type : 'day'
				},
				final : function(response) {
					if (!response || response.length == 0) {
						return;
					}
					response.forEach(function(e) {
						e.data = e.totalLoads;
						delete e.totalLoads;
					});
					reference.generateChart(response);

				}
			});
		})(this);
	},
	generateChart : function(response) {
		if (this.chart && this.chart.destroy) {
			this.chart.destroy();
			this.chart = null;
		}

		if (!this.$chart) {
			return;
		}

		response[1].data = response[1].data.slice(0, new Date().getHours());
		var tips = [];
		response.forEach(function(e) {
			var t = {
				date : dateFormat(new Date(e.date)),
				max : 0,
				min : Number.MAX_VALUE
			};
			e.data.forEach(function(d) {
				d.totalValue = parseFloat(d.totalValue.toFixed(2));
				t.max = Math.max(t.max, d.totalValue);
				t.min = Math.min(t.max, d.totalValue);
			});
			tips.push(t);
		});

		console.log(JSON.stringify(response));
		this.tips(tips);

		this.$chart.setAttribute('width', plus.display.resolutionWidth);
		this.$chart.setAttribute('height', plus.display.resolutionWidth);

		this.chart = new Chart(this.$chart.getContext('2d'))
				.Line(
						{
							labels : (function() {
								var length = response[0].data.length;
								var _labels = [];
								for (var i = 1; i <= length; i++) {
									_labels.push(i);
								}
								return _labels;
							})(),
							datasets : [ {
								label : dateFormat(new Date(response[0].date)),
								fillColor : "rgba(220,220,220,0.2)",
								strokeColor : "rgba(220,220,220,1)",
								pointColor : "rgba(220,220,220,1)",
								pointStrokeColor : "#fff",
								pointHighlightFill : "#fff",
								pointHighlightStroke : "rgba(220,220,220,1)",
								max : tips[0].max,
								min : tips[0].min,
								data : (function() {
									var vals = [];
									response[0].data.forEach(function(e) {
										vals.push(e.totalValue);
									});
									return vals;
								})()
							}, {
								label : dateFormat(new Date(response[1].date)),
								fillColor : "rgba(151,187,205,0.2)",
								strokeColor : "rgba(151,187,205,1)",
								pointColor : "rgba(151,187,205,1)",
								pointStrokeColor : "#fff",
								pointHighlightFill : "#fff",
								pointHighlightStroke : "rgba(151,187,205,1)",
								max : tips[1].max,
								min : tips[1].min,
								data : (function() {
									var vals = [];
									response[1].data.forEach(function(e) {
										vals.push(e.totalValue);
									});
									return vals;
								})()
							} ]
						},
						{
							legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].pointColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
							animation : false
						});
		console.log(this.chart.generateLegend());
		var div = document.createElement('div');
		div.innerHTML = this.chart.generateLegend();
		document.querySelector('#chart-holder').appendChild(div.firstChild);
		var legendHeight = document.querySelector('#chart-holder .line-legend').offsetHeight + 30;
		var chartHolderHeight = document.querySelector('#chart-holder').offsetHeight;
		console.log('legend height ' + legendHeight);
		console.log('chart hodler height ' + chartHolderHeight)
		if (chartHolderHeight < legendHeight) {
			document.querySelector('#chart-holder').style.height = legendHeight + 'px';
		}
	}
};