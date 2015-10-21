window.generic = window.generic || {};

generic.Summary = function(obj) {
	$.extend(this, obj);
	this.init();
};

generic.Summary.prototype = {
	destroy : function() {
		if (this.energyChart && this.energyChart.destroy) {
			this.energyChart.destroy();
			this.energyChart = null;
		}

		if (this.loadChart && this.loadChart.destroy) {
			this.loadChart.destroy();
			this.loadChart = null;
		}
	},
	init : function() {
		(function(reference) {
			$(document).off('pageshow', reference.href).on('pageshow', reference.href, function() {
				console.log('page show');
				reference.resizeChart();
			});
		})(this);
		this.initComponent();
	},
	active : function() {
		this.fetchTotalLoadOfMonth();
	},
	stop : function() {
		this.destroy();
	},
	initComponent : function() {
		console.log('init component');

		this.initChart();
		this.generateData();
		this.resizeChart();

		this.initEnergyOfMonthChart();
		this.fetchTotalLoadOfMonth();
	},
	initEnergyOfMonthChart : function() {
		this.energyOfMonthChart = this.energyOfMonthChart || $('#energy-of-month-chart').easyPieChart({
			barColor : 'rgba(124,181,236,0.95)',
			trackColor : '#FFF',
			scaleColor : false,
			lineCap : 'butt',
			lineWidth : parseInt(50 / 10),
			animate : /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
			size : 50
		}).data('easyPieChart');
	},
	fetchTotalLoadOfMonth : function(date) {
		if (date === undefined) {
			date = new Date();
		}
		var reference = this, url = 'http://' + generic.variables.SERVER_IP + '/system/station/' + generic.variables.currentCode + '/totalloadofmonth';
		generic.ajax({
			url : url,
			data : {
				date : date
			},
			final : function(response) {
				console.log(response);
				var currentStation = generic.service.getStationHierarchy(generic.variables.currentCode);
				console.log(currentStation.designkw);
				if (!reference.energyOfMonthChart){
					return;
				}
				reference.energyOfMonthChart.update(parseInt(response.value/currentStation.designkw * 100));
				$('#energy-of-month-chart').find('.percent').text(parseInt(response.value/currentStation.designkw * 100));
//				$('#energy-of-month-chart').next().text(parseInt(response.value) + '/' + parseInt(currentStation.designkw));
				$('#energy-of-month-chart').next().text(response.value.toFixed(2) + "KW");
			}
		});

	},
	generateData : function() {
		this.clearChart();

		(function(reference) {
			var series = {
				name : '能耗比对',
				data : [],
				dataLabels : {
					enabled : true,
					rotation : -90,
					color : '#FFFFFF',
					align : 'right',
					x : 4,
					y : 10,
					style : {
						fontSize : '13px',
						fontFamily : 'Verdana, sans-serif',
						textShadow : '0 0 3px black'
					}
				}
			}, url = 'http://' + generic.variables.SERVER_IP + '/system/station/' + generic.variables.currentCode + '/maxenergyofday', today = new Date(), yesterday = new Date(
					today.getTime() - 86400000);

			$.when($.ajax({
				url : url,
				data : {
					date : yesterday
				},
				beforeSend : function() {
					$.mobile.loading('show');
				},
				complete : function() {
					$.mobile.loading('hide');
				},
				success : function(energy) {
					if (energy && energy.data && energy.data.value) {
						series.data.push([ dateFormat(yesterday), parseFloat(energy.data.value.toFixed(3)) ]);
					}
				}
			}), $.ajax({
				url : url,
				data : {
					date : today
				},
				beforeSend : function() {
					$.mobile.loading('show');
				},
				complete : function() {
					$.mobile.loading('hide');
				},
				success : function(energy) {
					if (energy && energy.data && energy.data.value) {
						series.data.push([ dateFormat(today), parseFloat(energy.data.value.toFixed(3)) ]);
					}
				}
			})).done(function() {
				reference.energyChart.series.forEach(function(s) {
					s.remove();
				});

				reference.energyChart.addSeries(series);
				reference.resizeChart();

				if (series.data.length == 0) {
					reference.energyChart.setTitle({
						text : '没有数据'
					});
				}
			});
		})(this);

		(function(reference) {
			var series = {
				name : '负荷比对',
				data : [],
				dataLabels : {
					enabled : true,
					rotation : -90,
					color : '#FFFFFF',
					align : 'right',
					x : 4,
					y : 10,
					style : {
						fontSize : '13px',
						fontFamily : 'Verdana, sans-serif',
						textShadow : '0 0 3px black'
					}
				}
			}, url = 'http://' + generic.variables.SERVER_IP + '/system/station/' + generic.variables.currentCode + '/maxloadofday', today = new Date(), yesterday = new Date(
					today.getTime() - 86400000);

			$.when($.ajax({
				url : url,
				data : {
					date : yesterday
				},
				beforeSend : function() {
					$.mobile.loading('show');
				},
				complete : function() {
					$.mobile.loading('hide');
				},
				success : function(load) {
					if (load && load.load) {
						series.data.push([ dateFormat(yesterday), parseFloat(load.load.toFixed(3)) ]);
					}
				}
			}), $.ajax({
				url : url,
				data : {
					date : today
				},
				beforeSend : function() {
					$.mobile.loading('show');
				},
				complete : function() {
					$.mobile.loading('hide');
				},
				success : function(load) {
					if (load && load.load) {
						series.data.push([ dateFormat(today), parseFloat(load.load.toFixed(3)) ]);
					}
				}
			})).done(function() {
				reference.loadChart.series.forEach(function(s) {
					s.remove();
				});

				reference.loadChart.addSeries(series);
				reference.resizeChart();

				if (series.data.length == 0) {
					reference.loadChart.setTitle({
						text : '没有数据'
					});
				}
			});
		})(this);

	},
	initChart : function() {
		this.energyChart = new Highcharts.Chart({
			chart : {
				renderTo : 'summary-energy-chart',
				animation : false,
				type : 'column'
			},
			title : {
				text : '能耗对比'
			},
			xAxis : {
				type : 'category',
				labels : {
					rotation : -45,
					style : {
						fontSize : '13px',
						fontFamily : 'Verdana, sans-serif'
					}
				}
			},
			yAxis : {
				min : 0,
				title : {
					text : 'KW'
				}
			},
			legend : {
				enabled : false
			},
			tooltip : {
				pointFormat : '能耗对比: <b>{point.y:.1f} KW</b>'
			},
			series : []
		});

		this.loadChart = new Highcharts.Chart({
			chart : {
				renderTo : 'summary-load-chart',
				animation : false,
				type : 'column'
			},
			title : {
				text : '负荷对比'
			},
			xAxis : {
				type : 'category',
				labels : {
					rotation : -45,
					style : {
						fontSize : '13px',
						fontFamily : 'Verdana, sans-serif'
					}
				}
			},
			yAxis : {
				min : 0,
				title : {
					text : 'KW'
				}
			},
			legend : {
				enabled : false
			},
			tooltip : {
				pointFormat : '负荷对比: <b>{point.y:.1f} KW</b>'
			},
			series : []
		});

	},
	clearChart : function() {
		this.energyChart.series.forEach(function(s) {
			s.remove();
		});

		this.loadChart.series.forEach(function(s) {
			s.remove();
		});
	},
	resizeChart : function() {
		if (this.energyChart) {
			var height = $(window).height() - this.$context.find('[data-role=header]').outerHeight() - this.$context.find('[data-role=footer]').outerHeight();
			this.energyChart.setSize(this.$context.find('#summary-energy-chart').parent().width(), height, doAnimation = true);
		}

		if (this.loadChart) {
			var height = $(window).height() - this.$context.find('[data-role=header]').outerHeight() - this.$context.find('[data-role=footer]').outerHeight();
			this.loadChart.setSize(this.$context.find('#summary-load-chart').parent().width(), height, doAnimation = true);
		}
	}

};