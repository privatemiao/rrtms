window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.LoadBalance = function(station) {
	this.station = station;
	this.NAME = "负荷平衡图";
	this.ID = "LoadBalance";
};

com.rrtms.system.LoadBalance.prototype = {
	destroy : function() {
		console.log('destroy LoadBalance...');
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
		if (this.chart && this.chart.destroy) {
			console.log('destroy chart');
			this.chart.destroy();
			this.chart = null;
		}

		if (this.grid && this.grid.destroy) {
			console.log('destroy grid');
			this.grid.destroy();
			this.grid = null;
		}

		if (this.ws && this.ws.destroy) {
			console.log('destroy websocket');
			this.ws.destroy();
			this.ws = null;
		}

		if (this.tree && this.tree.destroy) {
			console.log('destroy tree');
			this.tree.destroy();
			this.tree = null;
		}
	},
	init : function() {
		this.CONTEXT = $('#station-tab #' + this.ID);
		this.initComponent();
	},
	initComponent : function() {
		this.initSplitter();
		this.initTree();
		this.initChart();
		this.initGrid();
		this.initWS();
	},
	initWS : function() {
		var reference = this;
		
		this.ws = new com.component.WebSocket({
			onmessage : function(event) {
				var data = JSON.parse(event.data);
				if (data.hasOwnProperty('TagID')){
					var tr = reference.CONTEXT.find('tr:contains("'+data.TagID+'")');
					if (!tr || tr.length != 1){
						return;
					}
					
					$(tr).find("td:nth-child(4)").html(new Number(data.TagValue).toFixed(3));
					var ue = $(tr).find("td:nth-child(3)").html();
					ue = parseFloat(ue);
					if (!isNaN(ue)){
						$(tr).find("td:nth-child(5)").html(new Number(data.TagValue / ue * 100).toFixed(3));
					}
					
					$(tr).find("td:nth-child(6)").html(dateTimeFormat(new Date(data.Atime)));
					
					
					var dataIndex = $(tr).index("");
					reference.chart.series[1].data[dataIndex].update(Math.round(data.TagValue * Math.pow(10, 2)) / Math.pow(10, 2), true, false);
				}else{
					console.log(data);
				}
			}
		});
	},
	initGrid : function() {
		var reference = this;

		this.grid = this.CONTEXT.find('#LoadBalance-grid').kendoGrid({
			resizeable : true,
			height : function() {
				return reference.CONTEXT.find('#LoadBalance-grid').parent().height();
			},
			columns : [ {
				field : 'subscribedId',
				hidden : true
			}, {
				field : 'name',
				width : 50,
				title : '名称'
			}, {
				field : 'ue',
				width : 50,
				title : '额定负荷（KW）'
			}, {
				field : 'currentLoad',
				width : 50,
				title : '当前负荷（KW）'
			}, {
				field : 'loadPercent',
				width : 50,
				title : '负荷占比（%）'
			}, {
				field : 'updateTime',
				width : 50,
				title : '更新时间'
			} ]
		}).data('kendoGrid');

	},
	initChart : function() {
		var reference = this;

		this.chart = new Highcharts.Chart({
			chart : {
				type : 'column',
				renderTo : 'LoadBalance-chart',
				animation : false,
				height : function() {
					return reference.CONTEXT.find('#LoadBalance-chart').parent().height();
				}()
			},
			title : {
				text : reference.NAME
			},
			xAxis : {
				categories : []
			},
			yAxis : {
				title : {
					text : ''
				},
			},
			credits : {
				enabled : false
			},
			series : []
		});
	},
	initTree : function() {
		var reference = this;
		this.tree = new window.com.rrtms.system.DatapointTree({
			id : this.ID + "-tree",
			station : this.station,
			checkbox : true,
			cascade : false,
			click : function(id) {
				var point = reference.tree.getUserData(id);
				console.log(point);
				point.dataPoints.forEach(function(dataPoint) {
					if (dataPoint.subTagType.code == '17') {
						console.log('Type17', dataPoint);
					}
				});
			},
			checkHandler : function(id) {
				reference.subscribe();
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
			this.chart.setSize(this.CONTEXT.find('#LoadBalance-chart').parent().width(), this.CONTEXT.find('#LoadBalance-chart').parent().height(), doAnimation = true);
		}

		if (this.grid) {
			this.CONTEXT.find('#LoadBalance-grid').height(this.CONTEXT.find('#LoadBalance-grid').parent().height() - 2);
			this.grid.refresh();
		}
	},
	clearContent : function() {
		this.ws.unsubscribe([ '*' ]);

		this.grid.setDataSource(new kendo.data.DataSource({
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
	subscribe : function() {
		this.clearContent();

		var reference = this;

		var items = this.tree.getAllCheckedItems();
		if (!items || items.length == 0) {
			return;
		}

		var dataSource = [];
		var categories = [];
		var ratedDataSource = [];
		var runtimeDataSource = [];
		var subject = [];

		items.forEach(function(item) {
			dataSource.push(item.obj);
			categories.push(item.obj.name);
			ratedDataSource.push(item.obj.ue);
			runtimeDataSource.push(0);

			item.obj.dataPoints.some(function(dataPoint) {
				if (dataPoint.subTagType) {
					if (dataPoint.subTagType.code == '17') {
						item.obj.subscribedId = dataPoint.guid;
						subject.push(reference.station.code + ".rt." + (item.obj.currentId.substring(item.obj.currentId.lastIndexOf("_") + 1)) + "." + dataPoint.guid);
						return true;
					}
				}
			});
		});
		this.grid.dataSource.data(dataSource);
		this.chart.xAxis[0].setCategories(categories);

		this.chart.addSeries({
			name : '额定负荷',
			color : '#cc3',
			data : ratedDataSource
		});
		this.chart.addSeries({
			name : '实时负荷',
			color : '#060',
			data : runtimeDataSource
		});

		this.ws.subscribe(subject);
	}
};