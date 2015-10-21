window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.Portal = function(station) {
	this.station = station;
	this.NAME = "首页";
	this.ID = "Portal";
	// indexed by id
	this.dataPointIndexed = {};
};

com.rrtms.system.Portal.prototype = {
	destroy : function() {
		console.log('destroy Portal...');
		if (this.portalLoadChart && this.portalLoadChart.destroy) {
			this.portalLoadChart.destroy();
			this.portalLoadChart = null;
		}

		if (this.loadTrendChart && this.loadTrendChart.destroy) {
			this.loadTrendChart.destroy();
			this.loadTrendChart = null;
		}

		if (this.energyTrendChart && this.energyTrendChart.destroy) {
			this.energyTrendChart.destroy();
			this.energyTrendChart = null;
		}

		if (this.ws && this.ws.destroy) {
			this.ws.destroy();
			this.ws = null;
		}

		if (this.tree && this.tree.destructor) {
			this.tree.destructor();
			this.tree = null;
		}
	},
	init : function() {
		this.CONTEXT = $('#station-tab #' + this.ID);
		this.initComponent();
		this.eventComponent();
	},
	initComponent : function() {
		var reference = this;

		this.ws = new com.component.WebSocket({
			onmessage : function(event) {
				var data = JSON.parse(event.data);

				if (!data.StationCode) {
					return;
				}

				// 总负荷晴雨表

				if (!reference.portalLoadChart.titled) {
					reference.portalLoadChart.titled = true;
					reference.portalLoadChart.yAxis[0].setTitle({
						text : reference.station.code + '<br><span style="font-size:8px;">' + reference.station.name + '</span><br>额定负荷：' + data.Pe
					});
				}

				var per = 0;
				if (data.Pe < data.StationFuHeDatas.RTSumFuheValue) {
					per = 100;
				} else {
					per = Math.round(data.StationFuHeDatas.RTSumFuheValue / data.Pe * 100);
				}
				reference.portalLoadChart.series[0].points[0].update(per);
				reference.portalLoadChart.redraw();

				// end 总负荷晴雨表
				// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				// 总负荷趋势
				reference.loadTrendChart.series[0].addPoint([ new Date(data.Atime).getTime(), data.StationFuHeDatas.RTSumFuheValue ], true, reference.loadTrendChart.series[0].data.length > 10);
				reference.loadTrendChart.series[1].addPoint([ new Date(data.Atime).getTime(), data.StationFuHeDatas.HistoryMaxValue ], true, reference.loadTrendChart.series[1].data.length > 10);
				reference.loadTrendChart.series[2].addPoint([ new Date(data.Atime).getTime(), data.StationFuHeDatas.HistoryMinValue ], true, reference.loadTrendChart.series[2].data.length > 10);
				reference.loadTrendChart.series[3].addPoint([ new Date(data.Atime).getTime(), data.StationFuHeDatas._5MinAvgValue ], true, reference.loadTrendChart.series[3].data.length > 10);
				// end 总负荷趋势

				// 能耗
				reference.energyTrendChart.series[0].addPoint([ new Date(data.Atime).getTime(), data.EnergyChangeValue ], true, reference.energyTrendChart.series[0].data.length > 10);
				// end 能耗

				reference.refreshStation(data);

				reference.refreshConsumeChart(data);
			}
		});
		this.userDataPointWS = new com.component.WebSocket({
			onmessage : function(event) {
				var data = JSON.parse(event.data);
				if (!data.TagID) {
					console.log(data);
					return;
				}
				reference.CONTEXT.find('div[data-id="' + data.TagID + '"]>span').text(data.TagValue.toFixed(2));

			}
		});

		// 用户选择关心的监测点
		this.initDefaultDataPointTree();

		this.initPortalLoadChart();
		this.initLoadTrendChart();
		this.initLoadEnergyChart();
		this.initConsumeTypeChart();

		setTimeout(function() {
			reference.ws.subscribe([ reference.station.code + '.stationstatus' ]);
		}, 3000);

		this.initUserDataPointPane();

	},
	refreshStation : function(response) {
		var buffer = [];
		buffer.push('<div class="col-xs-4">站点名称</div>');
		buffer.push('<div class="col-xs-8">' + response.StationName + '</div>');

		buffer.push('<div class="col-xs-4">站点代码</div>');
		buffer.push('<div class="col-xs-8">' + response.StationCode + '</div>');

		buffer.push('<div class="col-xs-4">用户号</div>');
		buffer.push('<div class="col-xs-8">' + response.CronNo + '</div>');

		if (response.LineName) {
			if (response.LineName.length <= 1) {
				buffer.push('<div class="col-xs-4">线路</div>');
				buffer.push('<div class="col-xs-8">' + response.LineName + '</div>');
			} else {
				buffer.push('<div class="col-xs-4">线路</div>');
				response.LineName.forEach(function(line) {
					buffer.push('<div class="col-xs-4"></div>');
					buffer.push('<div class="col-xs-8">' + line + '</div>');
				});
			}
		} else {
			buffer.push('<div class="col-xs-4">线路</div>');
			buffer.push('<div class="col-xs-8"></div>');
		}

		buffer.push('<div class="col-xs-4">运行状态</div>');
		buffer.push('<div class="col-xs-8">');
		switch (response.RunStatus) {
		case 0:
			buffer.push('停止');
			break;
		case 1:
			buffer.push('运行');
			break;
		case 2:
			buffer.push('故障抢修');
			break;
		case 3:
			buffer.push('故障');
			break;
		case 4:
			buffer.push('负荷交易');
			break;
		}
		buffer.push('</div>');

		buffer.push('<div class="col-xs-4">上报能源中心</div>');
		buffer.push('<div class="col-xs-8">' + (response.EnergyEnable == true ? '是' : '否') + '</div>');

		buffer.push('<div class="col-xs-4">支持负荷交易</div>');
		buffer.push('<div class="col-xs-8">' + (response.FuheTradingEnable == true ? '是' : '否') + '</div>');

		buffer.push('<div class="col-xs-4">采集时间</div>');
		buffer.push('<div class="col-xs-8">' + dateTimeFormat(new Date(response.Atime)) + '</div>');

		$('#station-info .info').html(buffer.join(''));

	},
	initUserDataPointPane : function() {
		var reference = this;

		reference.CONTEXT.find('#user-data-point').empty();
		$.get('../../../system/station/' + reference.station.code + '/userdatapoints?_=' + new Date().getTime(), function(data) {
			var channels = [];
			data.forEach(function(dataPoint) {
				$.extend(dataPoint, reference.dataPointIndexed[dataPoint.dataPointId]);
				console.log(dataPoint);
				if (!dataPoint.hasOwnProperty('parentCurrentId')) {
					return;
				}
				var channel = reference.station.code + '.rt.' + dataPoint.parentCurrentId.substring(dataPoint.parentCurrentId.indexOf('_') + 1) + '.' + dataPoint.guid;
				channels.push(channel);
				reference.CONTEXT.find('#user-data-point').append(
						'<div class="col-xs-8">' + dataPoint.parentName + '->' + dataPoint.text + '</div><div data-id="' + dataPoint.guid + '" class="col-xs-4"><span>loading...</span> '
								+ dataPoint.unit + '</div>');
			});
			if (!channels || channels.length == 0) {
				return;
			}
			setTimeout(function() {
				reference.userDataPointWS.subscribe(channels);
			}, 3000);
		});
	},
	initDefaultDataPointTree : function() {
		var reference = this;

		this.tree = new dhtmlXTreeObject('default-data-point-modal-tree', '100%', '100%', '-1');
		this.tree.enableCheckBoxes(1);
		this.tree.setImagePath("../../../resources/dhtmlx/tree/imgs/csh_dhx_skyblue/");

		var data = JSON.parse(JSON.stringify(this.station.points));
		(function _convertPoints(points) {
			points.forEach(function(point) {
				if (point.type == 'POINT') {
					point.nocheckbox = true;
				}

				if (point.type != 'DATAPOINT') {
					point.id = point.type + '_' + point.id;
				}

				point.text = point.name;
				delete point.name;

				point.item = point.children;
				delete point.children;

				// data points
				if (point.dataPoints) {
					$.merge(point.item, point.dataPoints);
					// generate datapoint index
					point.dataPoints.forEach(function(e) {
						reference.dataPointIndexed[e.id] = e;
					});
				}

				if (point.type) {
					if (point.type == 'POINT') {
						point.im0 = 'point.png';
						point.im1 = 'point.png';
						point.im2 = 'point.png';
					} else if (point.type == 'DATAPOINT') {
						point.im0 = 'data-point.png';
						point.im1 = 'data-point.png';
						point.im2 = 'data-point.png';
					}
				}

				if (point.item && point.item.length > 0) {
					_convertPoints(point.item);
				}
			});
		})(data);

		this.tree.loadJSONObject({
			id : '-1',
			text : '^',
			item : [ {
				id : '0',
				text : reference.station.name,
				nocheckbox : true,
				im0 : 'station.png',
				im1 : 'station.png',
				im2 : 'station.png',
				item : data
			} ]
		});
		this.tree.openItem(0);
	},
	refreshConsumeChart : function(data) {
		this.consumeTypeChart.series[0].data[0].update(data.EnergyFValue);
		this.consumeTypeChart.series[0].data[1].update(data.EnergyGValue);
		this.consumeTypeChart.series[0].data[2].update(data.EnergyPValue);
		if (data.EnergyTimeStr){
			$('#consume-type .title').html('（' + data.EnergyTimeStr + '）');
		}
	},
	initConsumeTypeChart : function() {
		this.consumeTypeChart = new Highcharts.Chart({
			chart : {
				plotBackgroundColor : null,
				plotBorderWidth : null,
				plotShadow : false,
				renderTo : 'consume-type-chart',
				height : 200
			},
			title : {
				text : ''
			},
			tooltip : {
				pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			exporting : {
				enabled : false
			},
			plotOptions : {
				pie : {
					allowPointSelect : true,
					cursor : 'pointer',
					dataLabels : {
						enabled : false
					},
					showInLegend : true
				}
			},
			series : [ {
				type : 'pie',
				name : '能耗峰谷平',
				data : [ [ '峰', 50 ], [ '谷', 20 ], [ '平', 30 ] ]
			} ]
		});
	},
	initLoadEnergyChart : function() {
		this.energyTrendChart = new Highcharts.Chart({
			chart : {
				type : 'spline',
				renderTo : 'energy-trend-chart',
				animation : false,
				height : 200,
				marginRight : 10
			},
			title : {
				text : ''
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
					return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
				}
			},
			legend : {
				enabled : false
			},
			exporting : {
				enabled : false
			},
			series : [ {
				name : '能耗变化值',
				data : []
			} ]
		});
	},
	initLoadTrendChart : function() {
		this.loadTrendChart = new Highcharts.Chart({
			chart : {
				type : 'spline',
				renderTo : 'load-trend-chart',
				animation : false,
				height : 200,
				marginRight : 10
			},
			title : {
				text : ''
			},
			xAxis : {
				type : 'datetime',
				tickPixelInterval : 120
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
					return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
				}
			},
			legend : {
				enabled : true
			},
			exporting : {
				enabled : false
			},
			series : [ {
				name : '实时数据',
				data : []
			}, {
				name : '历史最大值',
				data : [],
				visible : false
			}, {
				name : '历史最小值',
				data : [],
				visible : false
			}, {
				name : '滑动平均值',
				data : []
			} ]
		});
	},
	initPortalLoadChart : function() {
		var reference = this;

		this.portalLoadChart = new Highcharts.Chart({
			chart : {
				type : 'gauge',
				renderTo : 'portal-load-chart',
				plotBorderWidth : 1,
				plotBackgroundColor : {
					linearGradient : {
						x1 : 0,
						y1 : 0
					},
					stops : [ [ 0, '#FFF4C6' ], [ 0.3, '#FFFFFF' ], [ 1, '#FFF4C6' ] ]
				},
				plotBackgroundImage : null,
				height : 200
			},

			title : {
				text : ''
			},
			exporting : {
				enabled : false
			},
			pane : [ {
				startAngle : -50,
				endAngle : 50,
				background : null,
				center : [ '50%', '110%' ],
				size : 300
			} ],
			yAxis : [ {
				min : 0,
				max : 100,
				minorTickPosition : 'outside',
				tickPosition : 'outside',
				labels : {
					rotation : 'auto',
					distance : 20
				},
				plotBands : [ {
					from : 80,
					to : 100,
					color : '#C02316',
					innerRadius : '100%',
					outerRadius : '105%'
				}, {
					from : 50,
					to : 80,
					color : 'yellow',
					innerRadius : '100%',
					outerRadius : '105%'
				}, {
					from : 0,
					to : 50,
					color : '#5f9',
					innerRadius : '100%',
					outerRadius : '105%'
				} ],
				pane : 0,
				title : {
					text : reference.station.code + '<br/><span style="font-size:8px">' + reference.station.name + '</span>',
					y : -20
				}
			} ],

			plotOptions : {
				gauge : {
					dataLabels : {
						enabled : false
					},
					dial : {
						radius : '100%'
					}
				}
			},

			series : [ {
				name : '负荷率',
				data : [ 0 ],
				yAxis : 0
			} ]

		});
	},
	eventComponent : function() {
		var reference = this;

		this.popupDefaultDataPointModalForm();
		this.eventModalBtnGroup();
		$('#default-data-point-modal').on('show.bs.modal', function() {
			reference.tree.closeAllItems(0);
			$('#default-data-point-modal .btn-un-select-all').trigger('click');
		});

		this.saveUserDataPoint();

	},
	saveUserDataPoint : function() {
		var reference = this;

		$('#default-data-point-modal .btn-save').click(function() {
			var ids = reference.tree.getAllChecked();
			var data = {};

			if (ids) {
				ids = ids.split(',');
				if (ids.length > 10) {
					bootbox.alert('最多10个监测点！');
					return;
				}
				for (var i = 0; i < ids.length; i++) {
					data['userDataPoints[' + i + '].dataPointId'] = ids[i];
					data['userDataPoints[' + i + '].parentName'] = reference.tree.getItemText(reference.tree.getParentId(ids[i]));
					data['userDataPoints[' + i + '].code'] = reference.station.code;
				}
			}

			$.ajax({
				url : '../../../system/station/' + reference.station.code + '/userdatapoints?_=' + new Date().getTime(),
				cache : false,
				data : data,
				type : "POST",
				error : handleError,
				success : function(response) {
					handleResult(response);
					$('#default-data-point-modal').modal('hide');
					reference.initUserDataPointPane();
				}
			});
		});
	},
	eventModalBtnGroup : function() {
		var reference = this;
		$('#default-data-point-modal .btn-expand').click(function() {
			if (!reference.tree) {
				return;
			}

			reference.tree.openAllItems(reference.tree.getSelectedItemId() || 0);
		});

		$('#default-data-point-modal .btn-collapse').click(function() {
			if (!reference.tree) {
				return;
			}

			reference.tree.closeAllItems(reference.tree.getSelectedItemId() || 0);
		});

		$('#default-data-point-modal .btn-un-select-all').click(function() {
			if (!reference.tree) {
				return;
			}

			var checked = reference.tree.getAllChecked();
			if (checked) {
				var checkedArray = checked.split(',');
				checkedArray.forEach(function(id) {
					reference.tree.setCheck(id, false);
				});
			}
		});
	},
	popupDefaultDataPointModalForm : function() {
		var reference = this;
		this.CONTEXT.find('#pop-up').click(function() {
			$('#default-data-point-modal').modal('show');
		});
	}

};