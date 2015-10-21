window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.RealtimeData = function(station) {
	this.station = station;
	this.NAME = "实时数据";
	this.ID = "RealtimeData";
	this.fixedCompare = "-10-11-12-13-14-15-18-19-";
};

com.rrtms.system.RealtimeData.prototype = {
	destroy : function() {
		if (this.splitterh && this.splitterh.destroy) {
			console.log('destroy splitterh');
			this.splitterh.destroy();
			this.splitterh = null;
		}
		if (this.splitterv && this.splitterv.destroy) {
			console.log('destroy splitterv');
			this.splitterv.destroy();
			this.splitterv = null;
		}

		if (this.tree && this.tree.destroy) {
			this.tree.destroy();
		}

		if (this.dataPointGrid && this.dataPointGrid.destroy) {
			this.dataPointGrid.destroy();
			this.dataPointGrid = null;
		}

		if (this.chart && this.chart.destroy) {
			console.log('destroy chart');
			this.chart.destroy();
			this.chart = null;
		}

		if (this.ws && this.ws.destroy) {
			this.ws.destroy();
			this.ws = null;
		}
	},
	init : function() {
		this.CONTEXT = $('#station-tab #' + this.ID);
		this.resize();
		this.prepareData();
		this.initComponent();
		this.eventComponent();
	},
	prepareData : function() {
		var reference = this;

		$.ajax({
			url : '../../../system/tagtypes',
			async : true,
			cahced : true,
			error : function(e) {
				handleError(e);
			},
			success : function(tagTypes) {
				tagTypes.forEach(function(tagType) {
					reference.CONTEXT.find('select[name="filter"]').append('<option value="' + tagType.code + '">' + tagType.name + '</options>');
				});
			}
		});
	},
	initComponent : function() {
		var reference = this;

		this.initSplitter();
		this.initDatapointTree();
		this.initDataPointGrid();
		this.initChart();
		this.ws = new com.component.WebSocket({
			onmessage : function(event) {
				var data = JSON.parse(event.data);
				if (!data.length) {
					console.log(data);
					return;
				}

				data.forEach(function(e) {
					var fixed = 2;
					var tr = reference.CONTEXT.find("tr:contains('" + e.TagID + "')");
					var tagSubCode = $(tr).find("td:nth-child(2)").html();
					if (tagSubCode) {
						if (reference.fixedCompare.indexOf("-" + tagSubCode + "-") != -1) {
							fixed = 3;
						}
					}

					if (e.hasOwnProperty("TagValue")) {
						var _val = 0;
						if (e.TagValue == null || e.TagValue.length == 0) {
							fixed == 2 ? (_val = .00) : (_val = .000);
						} else {
							_val = new Number(e.TagValue).toFixed(fixed);
						}
						$(tr).find("td:nth-child(6)").html(_val == 0 ? e.TagValue : _val);

						var name = $(tr).find("td:nth-child(3)").html();
						for ( var i = 0; i < reference.chart.series.length; i++) {
							var s = reference.chart.series[i];
							if (name === s.name) {
								s.addPoint([ new Date(e.Atime).getTime(), parseFloat(_val) ], true, s.data.length > 10);
								break;
							}
						}
					}

					if (e.hasOwnProperty("Atime")) {
						if (e.Atime) {
							var d = new Date(e.Atime);
							$(tr).find("td:nth-child(8)").html(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
						}
					}

					if (e.hasOwnProperty("MinValue")) {
						if (e.MinValue) {
							if (!isNaN(e.MinValue)) {
								$(tr).find("td:nth-child(9)").html(new Number(e.MinValue).toFixed(fixed));
							}
						} else {
							$(tr).find("td:nth-child(9)").html("0" + (fixed == 2 ? ".00" : ".000"));
						}
					}

					if (e.hasOwnProperty("MinTime")) {
						if (e.MinTime) {
							var d = new Date(e.MinTime);
							$(tr).find("td:nth-child(10)").html(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
						}
					}

					if (e.hasOwnProperty("MaxValue")) {
						if (e.MaxValue) {
							if (!isNaN(e.MaxValue)) {
								$(tr).find("td:nth-child(11)").html(new Number(e.MaxValue).toFixed(fixed));
							}
						} else {
							$(tr).find("td:nth-child(11)").html("0" + (fixed == 2 ? ".00" : ".000"));
						}
					}

					if (e.hasOwnProperty("MaxTime")) {
						if (e.MaxTime) {
							var d = new Date(e.MaxTime);
							$(tr).find("td:nth-child(12)").html(d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
						}
					}

				});// end data for each
			}// end on message
		});
	},
	initChart : function() {
		var reference = this;

		this.chart = new Highcharts.Chart({
			chart : {
				type : 'spline',
				renderTo : 'RealtimeData-chart',
				animation : false,
				height : function() {
					return reference.CONTEXT.find('#RealtimeData-chart').parent().height();
				}()
			},
			title : {
				text : '实时数据'
			},
			xAxis : {
				type : 'datetime',
				tickPixelInterval : 150
			},
			yAxis : {
				title : {
					text : ''
				},
				plotLines : [ {
					value : 0,
					width : 1,
					color : '#808080'
				} ]
			},
			tooltip : {
				formatter : function() {
					return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
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
	initDataPointGrid : function() {
		var reference = this;

		this.dataPointGrid = this.CONTEXT.find('#RealtimeData-grid').kendoGrid({
			selectable : 'multiple',
			resizeable : true,
			height : function() {
				return reference.CONTEXT.find('#RealtimeData-grid').parent().height();
			},
			columns : [ {
				hidden : true,
				field : 'guid'
			}, {
				hidden : true,
				field : 'subTagType.code'
			}, {
				field : 'name',
				width : 50,
				title : '名称'
			}, {
				field : 'subTagType.name',
				width : 130,
				title : '中文名称'
			}, {
				field : 'subTagType.tagType.name',
				title : '指标分类'
			}, {
				field : '',
				width : 100,
				title : '值'
			}, {
				field : 'unit',
				width : 50,
				title : '单位'
			}, {
				field : '',
				title : '采样时间'
			}, {
				field : '',
				width : 100,
				title : '最小值'
			}, {
				field : '',
				title : '最小时间'
			}, {
				field : '',
				width : 100,
				title : '最大值'
			}, {
				field : '',
				title : '最大时间'
			} ]
		}).data('kendoGrid');

		this.dataPointGrid.bind('change', function(item) {
			var selected = $.map(this.select(), function(item) {
				return item;
			});

			reference.chart.series.forEach(function(e) {
				e.hide();
			});
			selected.forEach(function(e) {
				reference.chart.series[$(e).index("")].show();
			});
		});
	},
	initDatapointTree : function() {
		var reference = this;
		this.tree = new window.com.rrtms.system.DatapointTree({
			id : this.ID + "-tree",
			station : this.station,
			click : function(id) {
				var point = reference.tree.getUserData(id);
				reference.generateContent(point);
			}
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
		this.splitterv = this.CONTEXT.find(".vertical").kendoSplitter({
			orientation : "vertical",
			panes : [ {
				collapsible : true
			}, {
				collapsible : true
			} ]
		}).data("kendoSplitter");

		this.splitterh.bind('resize', function() {
			reference.resize();
		});
		this.splitterv.bind('resize', function() {
			reference.resize();
		});
	},
	eventComponent : function() {
		var reference = this;

		this.CONTEXT.find('select[name="filter"]').change(function() {
			reference.generateContent(reference.currentPoint);
		});
	},
	generateContent : function(point) {
		var reference = this;

		this.ws.unsubscribe();

		this.clearContent();

		this.currentPoint = point;

		if (!point) {
			return;
		}

		$.ajax({
			url : '../../../system/station/point/' + point.id + '/datapoints',
			data : {
				'count' : 1000,
				code : reference.CONTEXT.find('select[name="filter"]').val()
			},
			error : function() {
				handleError(e);
			},
			success : function(response) {
				var dataPoints = response.data;

				if (!dataPoints || dataPoints.length == 0) {
					return false;
				}

				reference.dataPointGrid.setDataSource(new kendo.data.DataSource({
					data : dataPoints
				}));

				dataPoints.forEach(function(dataPoint) {
					reference.chart.addSeries({
						name : dataPoint.name,
						data : []
					});
				});

				if (!point.currentId) {
					return;
				}

				var channel = [ reference.station.code + ".rt." + (point.currentId.substring(point.currentId.lastIndexOf("_") + 1)),
						reference.station.code + ".Mdata." + (point.currentId.substring(point.currentId.lastIndexOf("_") + 1)) ];
				reference.ws.subscribe(channel);
			}
		});
	},
	clearContent : function() {
		this.dataPointGrid.setDataSource(new kendo.data.DataSource({
			data : []
		}));

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
			this.chart.setSize(this.CONTEXT.find('#RealtimeData-chart').parent().width(), this.CONTEXT.find('#RealtimeData-chart').parent().height(), doAnimation = true);
		}

		if (this.dataPointGrid) {
			this.CONTEXT.find('#RealtimeData-grid').height(this.CONTEXT.find('#RealtimeData-grid').parent().height() - 2);
			this.dataPointGrid.refresh();
		}
	}
};