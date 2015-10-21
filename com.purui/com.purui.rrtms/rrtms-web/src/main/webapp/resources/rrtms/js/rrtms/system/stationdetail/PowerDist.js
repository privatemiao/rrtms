window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.PowerDist = function(station) {
	this.station = station;
	this.NAME = "电量分布图";
	this.ID = "PowerDist";

	this.gridStatus = "EMPTY";
};

com.rrtms.system.PowerDist.prototype = {
	destroy : function() {
		console.log('destroy PowerDist...');

		if (this.splitterv && this.splitterv.destroy) {
			console.log('destroy splitterv...');
			this.splitterv.destroy();
			this.splitterv = null;
		}

		if (this.powerChart && this.powerChart.destroy) {
			console.log('destroy powerChart');
			this.powerChart.destroy();
			this.powerChart = null;
		}

		if (this.moneyChart && this.moneyChart.destroy) {
			console.log('destroy moneyChart');
			this.moneyChart.destroy();
			this.moneyChart = null;
		}

		if (this.grid && this.grid.destroy) {
			console.log('destroy grid');
			this.grid.destroy();
			this.grid = null;
		}

		if (this.ws && this.ws.destroy) {
			console.log('destroy ws');
			this.ws.destroy();
			this.ws = null;
		}
	},
	init : function() {
		this.CONTEXT = $('#station-tab #' + this.ID);
		this.prepareData();
		this.initComponent();
	},
	prepareData : function() {
		this.pointArray = [];
		var reference = this;
		(function _fetch(points) {
			points.forEach(function(point) {
				var p = JSON.parse(JSON.stringify(point));
				delete p.children;
				delete p.dataPoints;
				delete p.energyType;
				console.log(p);
				reference.pointArray.push(p);
				if (point.children && point.children.length > 0) {
					_fetch(point.children);
				}
			});
		})(this.station.points[0].children);
	},
	initComponent : function() {
		this.layout();
		this.initChart();
		this.initGrid();

		var reference = this;
		this.ws = new com.component.WebSocket({
			onmessage : function(event) {
				var data = JSON.parse(event.data);

				if (data.hasOwnProperty("EnergyList")) {
					var labels = reference.CONTEXT.find("#powerdist-grid").find(".k-toolbar").find("label");
					$(labels[0]).find("span").html(dateTimeFormat(new Date(data.Atime)));
					$(labels[1]).find("span").html(data.CumulativeTime);

					data.EnergyList.forEach(function(e) {
						var totalPrice = 0;
						var totalValue = 0;
						totalPrice = e.FPrice + e.GPrice + e.PPrice;
						totalValue = e.FValue + e.GValue + e.PValue;
						e.TotalPrice = Number(totalPrice.toFixed(3));
						e.TotalValue = Number(totalValue.toFixed(3));

						e.FPrice = Number(e.FPrice.toFixed(3));
						e.GPrice = Number(e.GPrice.toFixed(3));
						e.PPrice = Number(e.PPrice.toFixed(3));

						e.FValue = Number(e.FValue.toFixed(3));
						e.GValue = Number(e.GValue.toFixed(3));
						e.PValue = Number(e.PValue.toFixed(3));

					});

					if (reference.gridStatus == "EMPTY") {
						reference.grid.dataSource.data(data.EnergyList);
						reference.gridStatus = "FULL";
					} else {
						var trs = reference.CONTEXT.find('#powerdist-grid').find("tbody>tr");
						for ( var i = 0; i < data.EnergyList.length; i++) {
							var item = data.EnergyList[i];
							$(trs[i]).find("td:nth-child(2)").html(item.TotalValue);
							$(trs[i]).find("td:nth-child(3)").html(item.TotalPrice);
							$(trs[i]).find("td:nth-child(4)").html(item.FValue);
							$(trs[i]).find("td:nth-child(5)").html(item.FPrice);
							$(trs[i]).find("td:nth-child(6)").html(item.GValue);
							$(trs[i]).find("td:nth-child(7)").html(item.GPrice);
							$(trs[i]).find("td:nth-child(8)").html(item.PValue);
							$(trs[i]).find("td:nth-child(9)").html(item.PPrice);
						}
					}
					reference.refreshChart();
				}
			}
		});

		this.subscribe();
	},
	refreshChart : function() {
		var reference = this;
		var selecteds = $.map(this.grid.select(), function(item) {
			return reference.grid.dataItem(item);
		});
		if (selecteds == null || selecteds.length == 0) {
			selecteds = this.grid.dataSource.data();
		}

		if (selecteds == null || selecteds.length == 0) {
			this.powerChart.series[0].data[0].update(0);
			this.powerChart.series[0].data[1].update(0);
			this.powerChart.series[0].data[2].update(0);
			this.moneyChart.series[0].data[0].update(0);
			this.moneyChart.series[0].data[1].update(0);
			this.moneyChart.series[0].data[2].update(0);
		}

		if (selecteds.length == 1) {
			// 显示当前峰、谷、平 电量和费用
			this.powerChart.series[0].data[0].update(selecteds[0].FValue);
			this.powerChart.series[0].data[1].update(selecteds[0].GValue);
			this.powerChart.series[0].data[2].update(selecteds[0].PValue);

			this.moneyChart.series[0].data[0].update(selecteds[0].FPrice);
			this.moneyChart.series[0].data[1].update(selecteds[0].GPrice);
			this.moneyChart.series[0].data[2].update(selecteds[0].PPrice);
		} else {
			var fvalue = 0;
			var gvalue = 0;
			var pvalue = 0;

			var fprice = 0;
			var gprice = 0;
			var pprice = 0;
			selecteds.forEach(function(e) {
				fvalue += e.FValue;
				gvalue += e.GValue;
				pvalue += e.PValue;

				fprice += e.FPrice;
				gprice += e.GPrice;
				pprice += e.PPrice;
			});
			this.powerChart.series[0].data[0].update(fvalue);
			this.powerChart.series[0].data[1].update(gvalue);
			this.powerChart.series[0].data[2].update(pvalue);

			this.moneyChart.series[0].data[0].update(fprice);
			this.moneyChart.series[0].data[1].update(gprice);
			this.moneyChart.series[0].data[2].update(pprice);

		}
	},
	subscribe : function() {
		var reference = this;
		if (this.ws.getStatus() != 1) {
			console.log('ws not ready, call back in one second!');
			setTimeout(function() {
				reference.subscribe();
			}, 1000);
		} else {
			this.ws.subscribe([ this.station.code + '.energy' ]);
		}
	},
	initGrid : function() {
		this.grid = this.CONTEXT.find("#powerdist-grid").kendoGrid({
			sortable : true,
			resizable : true,
			selectable : "multiple",
			toolbar : kendo.template($("#template-power-dist").html()),
			dataSource : this.pointArray,
			columns : [ {
				field : "SeeName",
				title : "名称"
			}, {
				field : "TotalValue",
				title : "总电量"
			}, {
				field : "TotalPrice",
				title : "总电费"
			}, {
				field : "FValue",
				title : "峰电量"
			}, {
				field : "FPrice",
				title : "峰电费"
			}, {
				field : "GValue",
				title : "谷电量"
			}, {
				field : "GPrice",
				title : "谷电费"
			}, {
				field : "PValue",
				title : "平电量"
			}, {
				field : "PPrice",
				title : "平电费"
			} ]
		}).data("kendoGrid");

		this.resize();

		var reference = this;
		this.grid.bind("change", function() {
			reference.refreshChart();
		});

		var btnChkAll = reference.CONTEXT.find("#powerdist-grid").find(".k-toolbar").find("button");
		btnChkAll.click(function() {
			reference.grid.clearSelection();
		});

	},
	layout : function() {
		var reference = this;

		this.splitterv = this.CONTEXT.find(".vertical").kendoSplitter({
			orientation : "vertical",
			panes : [ {
				collapsible : true
			}, {
				collapsible : true
			} ]
		}).data("kendoSplitter");

		this.splitterv.bind('resize', function() {
			reference.resize();
		});

	},
	initChart : function() {
		this.powerChart = new Highcharts.Chart({
			chart : {
				plotBackgroundColor : null,
				plotBorderWidth : null,
				plotShadow : false,
				renderTo : "powerdist-powerchart"
			},
			title : {
				text : '电量'
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
						color : '#000000',
						connectorColor : '#000000',
						format : '<b>{point.name}</b>: {point.percentage:.1f}% [{point.y}]'
					}
				}
			},
			series : [ {
				type : 'pie',
				name : '电量',
				data : [ [ '峰', 0 ], [ '谷', 0 ], [ '平', 0 ] ]
			} ]
		});

		this.moneyChart = new Highcharts.Chart({
			chart : {
				plotBackgroundColor : null,
				plotBorderWidth : null,
				plotShadow : false,
				renderTo : "powerdist-moneychart"
			},
			title : {
				text : '电费'
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
						color : '#000000',
						connectorColor : '#000000',
						format : '<b>{point.name}</b>: {point.percentage:.1f}% [{point.y}]'
					}
				}
			},
			series : [ {
				type : 'pie',
				name : '费用',
				data : [ [ '峰', 0 ], [ '谷', 0 ], [ '平', 0 ] ]
			} ]
		});

		this.resize();
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

		if (this.powerChart) {
			this.powerChart.setSize(this.CONTEXT.find('#powerdist-powerchart').parent().width() / 2 - 2, this.CONTEXT.find('#powerdist-powerchart').parent().height(), doAnimation = true);
		}
		if (this.moneyChart) {
			this.moneyChart.setSize(this.CONTEXT.find('#powerdist-moneychart').parent().width() / 2 - 2, this.CONTEXT.find('#powerdist-moneychart').parent().height(), doAnimation = true);
		}

		if (this.grid) {
			this.CONTEXT.find('#powerdist-grid').height(this.CONTEXT.find('#powerdist-grid').parent().height() - 2);
			this.grid.refresh();
		}
	}
};