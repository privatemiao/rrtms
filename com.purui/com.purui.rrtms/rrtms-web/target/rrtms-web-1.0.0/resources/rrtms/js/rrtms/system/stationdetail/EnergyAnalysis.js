window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.EnergyAnalysis = function(station) {
	this.station = station;
	this.NAME = "耗电类比分析";
	this.ID = "EnergyAnalysis";
};

com.rrtms.system.EnergyAnalysis.prototype = {
	destroy : function() {
		console.log('destroy EnergyAnalysis...');
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

		this.destroyCalendar();
	},
	destroyCalendar : function() {
		if (this.date && this.date.destroy) {
			console.log('destroy date');
			this.date.destroy();
			this.date = null;
		}
	},
	init : function() {
		this.CONTEXT = $('#station-tab #' + this.ID);
		this.initComponent();
		this.eventComponent();
	},
	eventComponent : function() {
		var reference = this;

		this.changeDateType();

		this.CONTEXT.find('.btn-analysis').click(function() {
			reference.refreshChart();
		});
	},
	changeDateType : function() {
		var reference = this;

		this.CONTEXT.find('#' + this.ID + '-type').change(function(e) {
			reference.destroyCalendar();
			switch ($(this).val()) {
			case 'month':
				reference.date = reference.CONTEXT.find('#' + reference.ID + '-date').kendoDatePicker({
					start : "year",
					depth : "year",
					format : "yyyy-MM"
				}).data("kendoDatePicker");
				break;
			case 'year':
				reference.date = reference.CONTEXT.find('#' + reference.ID + '-date').kendoDatePicker({
					start : "decade",
					depth : "decade",
					format : "yyyy"
				}).data("kendoDatePicker");
				break;
			default:// day
				reference.date = reference.CONTEXT.find('#' + reference.ID + '-date').kendoDatePicker({
					format : "yyyy-MM-dd"
				}).data("kendoDatePicker");
				break;
			}
		});

		this.CONTEXT.find('#' + this.ID + '-curve').change(function(e) {
			var curve = $(this).val();
			var options = reference.CONTEXT.find('#' + reference.ID + '-kind').find('option');
			if (options.length == 4) {
				$(options[3]).remove();
			}

			if (curve == 3 || curve == 4) {
				$(options).parent().append('<option value="D">' + (curve == 3 ? '总功率' : '总负荷') + '</option>');
			}
		});
	},
	initComponent : function() {
		this.initSplitter();
		this.initTree();
		this.initChart();

		this.date = this.CONTEXT.find('#' + this.ID + '-date').kendoDatePicker({
			format : "yyyy-MM-dd"
		}).data("kendoDatePicker");

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
			checkbox : true,
			station : this.station,
		});
	},
	refreshChart : function() {
		var reference = this;

		var timestamp = new Date().getTime();
		reference._refreshChartTimestamp = timestamp;

		this.clearChart();
		var items = this.tree.getAllCheckedItems();
		if (!items) {
			bootbox.alert('请选择左侧的比对节点！');
			return;
		}

		console.log(items);

		var data = {};
		data.pointIds = (function(items) {
			var d = [];
			items.forEach(function(item) {
				d.push(item.id);
			});
			return d;
		})(items);

		data.type = this.CONTEXT.find('#' + this.ID + '-type').val();
		data.curve = this.CONTEXT.find('#' + this.ID + '-curve').val();
		data.kind = this.CONTEXT.find('#' + this.ID + '-kind').val();
		data.date = this.date.value();
		data.code = this.station.code;

		if (!data.date) {
			this.date.value(new Date());
			data.date = this.date.value();
		}

		$.ajax({
			url : '../../../system/analysis/energy',
			cache : false,
			traditional : true,
			data : data,
			error : handleError,
			success : function(response) {
				if (timestamp != reference._refreshChartTimestamp) {
					console.log('已过时，退出！');
					return;
				}

				handleResult(response, true);
				var key = 'maxValue';
				if (data.type == 'day') {
					key = 'avgValue';
				}

				if (!response.push) {
					return;
				}

				response.forEach(function(point) {
					point.dataPoints.forEach(function(dataPoint) {
						var data = [];
						dataPoint.mDatas.forEach(function(mData) {
							data.push({
								x : new Date(parseInt(mData.atTime)).getTime(),
								y : mData[key]
							});
						});
						console.log('length', data.length);
						reference.chart.addSeries({
							turboThreshold : 0,
							name : point.name + '-' + dataPoint.name,
							data : data
						});
					});
				});
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
	},
	//当前TAB被激活
	active : function(){
		if (this.splitterh){
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
