window.generic = window.generic || {};

generic.Energy = function(obj) {
	$.extend(this, obj);

	this.$filterContext = $('#page-energy-filter');
	this.$startDate = this.$filterContext.find('#energy-start-date');
	this.$endDate = this.$filterContext.find('#energy-end-date');
	this.$btnQuery = this.$filterContext.find('.btn-query');
	this.$btnCancelQuery = this.$filterContext.find('.btn-cancel');
	this.init();
};

generic.Energy.prototype = {
	destroy : function() {
		console.log('destroy ' + this.title);

		if (this.chart && this.chart.destroy) {
			console.log('destroy chart');
			this.chart.destroy();
			this.chart = null;
		}
	},
	init : function() {
		console.log('init ' + this.title);

		(function(reference) {
			$(document).off('pageshow', reference.href).on('pageshow', reference.href, function() {
				console.log('pageshow event');
				reference.$context.find('div[data-role=navbar]').find('a[href=' + reference.href + ']').removeClass('ui-btn-active').addClass('ui-btn-active');
				reference.resizeChart();
			});
		})(this);

		this.eventComponent();
	},
	active : function() {
		console.log('active ' + this.title);
		this.resizeChart();
	},
	stop : function() {
		console.log('stop ' + this.title);
	},
	eventComponent : function() {

		(function(reference) {
			reference.$filterContext.find('[name=type]').unbind('click').click(function() {
				reference.$filterContext.find('.datepicker').datepicker("option", "dateFormat", $(this).attr('data-format'));
				reference.$filterContext.find('.datepicker').datepicker('refresh');
			});
		})(this);

		(function(reference) {
			reference.$btnQuery.unbind('click').click(function() {
				var data = {}, startDate = reference.$startDate.val().trim(), endDate = reference.$endDate.val().trim();
				data.type = reference.$filterContext.find('[name=type]:checked').val();

				startDate = startDate ? new Date(startDate) : new Date(dateFormat(new Date(new Date().getTime() - 86400000)));
				endDate = endDate ? new Date(endDate) : new Date(dateFormat(new Date()));
				if (data.type === 'day') {
					if (endDate.getTime() < startDate.getTime()) {
						generic.message.alert('结束时间不能小于开始时间');
						return;
					}

					if (startDate.getFullYear() != endDate.getFullYear()) {
						generic.message.alert('不能跨年搜索');
						return;
					}

					if (endDate.getTime() > new Date().getTime()) {
						generic.message.alert("结束时间超出最大时间");
						return;
					}

					reference.$startDate.val(dateFormat(startDate));
					reference.$endDate.val(dateFormat(endDate));
				}

				if (startDate === '' || endDate === '') {
					generic.message.alert('请输入日期范围！');
					return;
				}

				data.startDate = startDate;
				data.endDate = endDate;

				$.mobile.changePage(reference.href, {
					transition : 'flip'
				});

				reference.genericChart(data);
			});
		})(this);

		(function(reference) {
			reference.$btnCancelQuery.unbind('click').click(function() {
				$.mobile.changePage(reference.href, {
					transition : 'flip'
				});
			});
		})(this);
	},
	initChart : function() {
		this.chart = new Highcharts.Chart({
			chart : {
				renderTo : 'chart-energy',
				animation : false
			},
			title : {
				text : ''
			},
			xAxis : {
				categories : []
			},
			yAxis : {
				title : {
					text : 'KW'
				},
				plotLines : [{
					value : 0,
					width : 1,
					color : '#808080'
				}]
			},
			tooltip : {
				formatter : function() {
					return '<b>' + this.series.name + '</b><br/>' + this.x + '<br/>' + Highcharts.numberFormat(this.y, 2);
				}
			},
			legend : {
				enabled : true
			},
			exporting : {
				enabled : false
			},
			series : []
		});
	},
	genericChart : function(data) {
		this.currentTimestamp = new Date().getTime();
		var _currentTimestamp = this.currentTimestamp;
		if (this.chart && this.chart.destroy) {
			console.log('destroy chart');
			this.chart.destroy();
			this.chart = null;
		}

		this.initChart();
		this.resizeChart();

		data.compareBy = 'code';
		data.compareByValue = [ generic.variables.currentCode ];

		(function(reference) {
			generic.ajax({
				url : generic.variables.url.COMPARE_ENERGY,
				data : data,
				traditional : true,
				final : function(response) {
					
					if (!reference || !reference.chart){
						return;
					}
					
					if (_currentTimestamp !== reference.currentTimestamp) {
						console.log('已过时，退出！');
						return;
					}

					console.log(response);

					if (!response.push) {
						return;
					}

					var name = generic.service.getStationHierarchy(data.compareByValue).name;
					console.log(name);

					response.forEach(function(e) {
						reference.chart.addSeries({
							name : (function() {
								switch (data.type) {
								case "day":
									return name + '-' + dateFormat(new Date(e.date));
								case "month":
									return name + '-' + dateFormat(new Date(e.date)).substring(0, 7);
								case "year":
									return name + '-' + dateFormat(new Date(e.date)).substring(0, 4);
							}
							})(),
							data : (function() {
								var d = [];
								var count = 0;
								e.totalEnergys.forEach(function(load) {
									d.push([++count, load.totalValue]);
								});
								return d;
							})()
						});
					});
				}
			});
		})(this);

	},
	resizeChart : function() {
		if (this.chart) {
			var height = $(window).height() - this.$context.find('[data-role=header]').outerHeight() - this.$context.find('[data-role=footer]').outerHeight();
			this.chart.setSize(this.$context.find('#chart-energy').parent().width(), height, doAnimation = true);
		}
	}

};
