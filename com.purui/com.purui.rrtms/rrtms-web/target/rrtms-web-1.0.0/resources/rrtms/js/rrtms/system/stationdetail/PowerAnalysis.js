window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.PowerAnalysis = function(station) {
	this.station = station;
	this.NAME = "电力指标分析";
	this.ID = "PowerAnalysis";
};

com.rrtms.system.PowerAnalysis.prototype = {
	destroy : function() {
		console.log('destroy PowerAnalysis...');
		this.CONTEXT.find('.date-picker').datepicker('remove');

		if (this.splitterh && this.splitterh.destroy) {
			console.log('destroy splitterh');
			this.splitterh.destroy();
			this.splitterh = null;
		}

		if (this.tree && this.tree.destroy) {
			console.log('destroy tree');
			this.tree.destroy();
			this.tree = null;
		}

		if (this.chart && this.chart.destroy) {
			console.log('destroy chart');
			this.chart.destroy();
			this.chart = null;
		}

	},
	init : function() {
		this.CONTEXT = $('#station-tab #' + this.ID);
		this.initComponent();
		this.eventComponent();
	},
	eventComponent : function() {
		var reference = this;

		this.CONTEXT.find('.btn-analysis').click(function() {
			reference.refreshChart();
		});
	},
	initComponent : function() {
		this.initSplitter();
		this.initTree();
		this.initChart();

		this.CONTEXT.find('.date-picker').datepicker({
			autoclose : true
		}).next().on('click', function() {
			$(this).prev().focus();
		}).next().on('click', function() {
			$(this).prev().prev().val('');
		});
		// open right panel
		$('#' + this.ID).find('.right-panel>div:first-child').trigger('click');
	},
	initChart : function() {
		var reference = this;
		this.chart = new Highcharts.Chart({
			chart : {
				type : 'spline',
				animation : false,
				marginRight : 10,
				renderTo : this.ID + "-chart",
				height : (function() {
					return $('#' + reference.ID + "-chart").parent().height();
				})()
			},
			title : {
				text : ' '
			},
			xAxis : {
				type : 'datetime'
			},
			yAxis : {
				title : {
					text : ' '
				},
				plotLines : [ {
					value : 0,
					width : 1,
					color : '#808080'
				} ]
			},
			tooltip : {
				formatter : function() {
					return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
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
	initSplitter : function() {
		var reference = this;

		this.splitterh = this.CONTEXT.find(".horizontal").kendoSplitter({
			orientation : "horizontal",
			panes : [ {
				collapsible : true,
				size : "300px"
			} ]
		}).data("kendoSplitter");

		this.splitterh.bind('resize', function() {
			reference.resize();
		});
	},
	initTree : function() {
		var reference = this;
		this.tree = new window.com.rrtms.system.DatapointTree({
			id : this.ID + "-tree",
			station : this.station,
		});
	},
	refreshChart : function() {
		var reference = this;

		var timestamp = new Date().getTime();
		this._refreshChartTimestamp = timestamp;

		var item = this.tree.getSelectedItem();

		this.clearChart();

		if (!item || !item.userData) {
			bootbox.alert('请选择左侧需要分析的节点！');
			return;
		}

		var data = {};
		data.pointId = item.id;
		data.code = this.station.code;
		var date = this.CONTEXT.find('input[name="date"]');
		if (!$.trim(date.val())) {
			data.date = new Date();
			date.val(dateFormat(data.date));
		} else {
			data.date = parseDate(date.val());
		}

		data.curve = this.CONTEXT.find('select[name="curve"]').val();

		data.kinds = [];
		var kinds = this.CONTEXT.find('input[name="kind"]');
		for (var i = 0; i < kinds.length; i++) {
			if ($(kinds[i]).is(':checked')) {
				data.kinds.push($(kinds[i]).val());
			}
		}

		if (data.kinds.length == 0) {
			bootbox.alert('请选择用电项！');
			return;
		}

		var type = this.CONTEXT.find('select[name="type"]').val();

		$.ajax({
			url : '../../../system/analysis/powerIndicator',
			traditional : true,
			data : data,
			error : handleError,
			success : function(response) {
				if (timestamp != reference._refreshChartTimestamp) {
					console.log('已过时，退出！');
					return;
				}

				handleResult(response, true);
				if (!response.hasOwnProperty('dataPoints')) {
					return;
				}

				if (!reference.chart) {
					console.log(reference);
					return;
				}

				response.dataPoints.forEach(function(dataPoint) {
					var data = [];
					dataPoint.mDatas.forEach(function(mData) {
						data.push({
							x : new Date(parseInt(mData.atTime)).getTime(),
							y : mData[type]
						});
					});
					reference.chart.addSeries({
						name : dataPoint.name,
						data : data
					});
				});

				reference.chart.setTitle({
					text : item.text
				});

				// 功率因数
				if (data.curve == '3') {
					var min = new Date().getTime();
					var max = 0;
					reference.chart.series.forEach(function(series) {
						if (series.data.length > 0) {
							var first = series.data[0].x;
							var last = series.data[series.data.length - 1].x;
							min = min < first ? min : first;
							max = max > last ? max : last;
						}
					});

					reference.chart.addSeries({
						name : "基线",
						color : '#000',
						data : [ {
							x : min,
							y : reference.station.company.cardinalInclude
						}, {
							x : max,
							y : reference.station.company.cardinalInclude
						} ]
					});
				}
			}
		});

	},
	clearChart : function() {
		if (this.chart) {
			(function _removeSeries(reference) {
				if (!reference.chart) {
					return;
				}
				reference.chart.series.forEach(function(s) {
					s.remove();
				});
				if (reference.chart.series.length > 0) {
					_removeSeries(reference);
				}
			})(this);
			this.chart.redraw();
		}
	},// 当前TAB被激活
	active : function() {
		if (this.splitterh) {
			this.splitterh.toggle(this.CONTEXT.find('.left-pane'));
			this.splitterh.toggle(this.CONTEXT.find('.left-pane'));
		}
	},
	resize : function() {
		if (!this.CONTEXT.hasClass('active')) {
			return;
		}

		if (this.chart) {
			this.chart.setSize(this.CONTEXT.find('#' + this.ID + '-chart').parent().width(), this.CONTEXT.find('#' + this.ID + '-chart').parent().height(), doAnimation = true);
		}
	}
};