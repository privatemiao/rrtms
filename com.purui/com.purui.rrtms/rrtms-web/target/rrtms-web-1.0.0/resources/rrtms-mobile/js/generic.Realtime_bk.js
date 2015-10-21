window.generic = window.generic || {};
generic.Realtime = function() {
	this.point = ko.observable();
	this.init();
};
generic.Realtime.prototype = {
	init: function() {
		var p = JSON.parse(plus.storage.getItem('currentPoint'));
		var index = {};
		for (var i = 0; i < p.dataPoints.length; i++) {
			if (p.dataPoints[i].subTagType.code === '53' || p.dataPoints[i].subTagType.code === '54') {
				p.dataPoints.splice(i, 1);
				i--;
				continue;
			}
			if (p.dataPoints[i].subTagType.code === '52') {
				p.dataPoints[i].val = '关闭';
				p.dataPoints[i].isSwitch = true;
				p.dataPoints[i].css = 'mui-table-view-cell';
			} else {
				p.dataPoints[i].val = 0;
				p.dataPoints[i].css = 'mui-table-view-cell mui-navigate-right';
			}
			index[p.dataPoints[i].guid] = i;
		}
		this.index = index;
		
		this.point(p);
		//console.log('peter point'+JSON.stringify(p.dataPoints));
		console.log('point>>' + JSON.stringify(this.point()));

		this.refreshData();

		this.eventComponent();
	},
	refreshData: function() {
		(function(reference) {
			generic.ajax({
				url: generic.variables.url.GET_REDIS_DATA,
				data: {
					subject: reference.point().currentId.replace('_', '.rt.')
				},
				final: function(response) {
					console.log('RESPONSE>>' + response);
					if (!response || response.length === 0) {
						return;
					}

					var data = JSON.parse(response);
					if (!data || data.length === 0) {
						return;
					}

					var point = reference.point();
					data.forEach(function(e) {
						var dataPoint = point.dataPoints[reference.index[e.guid]];
						if (!dataPoint) {
							generic.message.error('没有找到 - ' + e.guid);
							return;
						}
						if (dataPoint.isSwitch) {
							if (e.TagValue === 1) {
								dataPoint.val = '合闸状态';
							} else {
								dataPoint.val = '分闸状态';
							}
						} else {
							dataPoint.val = e.TagValue;
						}
					});
					reference.point(point);

				}
			});
		})(this);

	},
	eventComponent: function() {
		(function(reference) {
			document.querySelector('a.mui-icon-refresh').addEventListener('click', function() {
				reference.refreshData();
			});
		})(this);

		(function(reference) {
			mui('.mui-content').on('tap', 'li.mui-navigate-right', function() {
				var guid = this.getAttribute('guid');
				reference.point().dataPoints.forEach(function(e) {
					if (e.guid === guid) {
						plus.storage.setItem('dataPoint', JSON.stringify(e));
						console.log('found set to storage>' + JSON.stringify(e));
						console.log('open detail page');
//						mui.openWindow({
//							url: 'datapoint_detail.html'
//						});
					}
				});
			});
		})(this);
	}

};