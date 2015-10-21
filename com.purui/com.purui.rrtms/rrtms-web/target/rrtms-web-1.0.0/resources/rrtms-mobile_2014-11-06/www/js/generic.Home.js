window.generic = window.generic || {};

generic.Home = function(obj) {
	$.extend(this, obj);
	this.init();
};

generic.Home.prototype = {
	init : function() {
		console.log('init ' + this.title);
		this.$areaInfo = this.$context.find('#area-info');
	},
	destroy : function() {
		console.log('destroy ' + this.title);
		if (this.chart && this.chart.destroy) {
			this.chart.destroy();
			this.chart = null;
		}
	},
	active : function() {
		console.log('active ' + this.title);
		this.loadAreaInfo();
	},
	stop : function() {
		console.log('stop ' + this.title);
	},
	loadAreaInfo : function() {
		var reference = this, buffer = [];
		generic.ajax({
			url : generic.variables.url.AREA_LOAD,
			final : function(stations) {
				console.log(stations);
				stations.forEach(function(station) {
					buffer.push('<li class="area-info ui-li-static ui-body-inherit">' + station.areaName + '：' + station.loadData.realtimeSumValue.toFixed(3) + '（KW）</li>');
				});
				if (buffer.length === 0) {
					return;
				}

				reference.$context.find('.area-info').remove();
				reference.$areaInfo.after(buffer.join(''));

				if (!reference.chart) {
					reference.initChart();
				}

				reference.clearChart();

				reference.chart.addSeries({
					type : 'pie',
					name : '区域负荷分布图',
					data : (function() {
						var _data = [];
						stations.forEach(function(station) {
							_data.push([ station.areaName, parseFloat(station.loadData.realtimeSumValue.toFixed(3)) ]);
						});
						return _data;
					})()
				});

			}
		});
	},
	initChart : function() {
		this.chart = new Highcharts.Chart({
			chart : {
				plotBackgroundColor : null,
				plotBorderWidth : 0,// null,
				renderTo : 'home-area-chart',
				plotShadow : false
			},
			title : {
				text : ''
			},
			tooltip : {
				pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions : {
				pie : {
					allowPointSelect : true,
					cursor : 'pointer',
					dataLabels : {
						enabled : true,
						format : '<b>{point.name}</b>: {point.percentage:.1f} %',
						style : {
							color : (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
						}
					}
				}
			},
			series : [ {
				type : 'pie',
				name : 'Browser share',
				data : [ [ 'Firefox', 45.0 ], [ 'IE', 26.8 ], {
					name : 'Chrome',
					y : 12.8,
					sliced : true,
					selected : true
				}, [ 'Safari', 8.5 ], [ 'Opera', 6.2 ], [ 'Others', 0.7 ] ]
			} ]
		});
	},
	clearChart : function() {
		console.log('clear chart');
		this.chart.series.forEach(function(s) {
			s.remove();
		});

		if (this.chart.series.length > 0) {
			this.clearChart();
		}
	}
};