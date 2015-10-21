com.rrtms.Dashboard = function() {
	this.init();
};
com.rrtms.Dashboard.prototype = {
	destroy : function() {
		console.log('destroy Dashboard...');
		if (this.map && this.map.dispose) {
			console.log('destroy map');
			try {
				this.map.clear();
				this.map.dispose();
				this.map = null;
			} catch (e) {
				console.log(e);
			}
		}

		if (this.stationGrid && this.stationGrid.destroy) {
			console.log('destroy station grid');
			this.stationGrid.destroy();
			this.stationGrid = null;
		}

		if (this.chart && this.chart.destroy) {
			console.log('destroy chart');
			this.chart.destroy();
			this.chart = null;
		}

		if (this.enquiryLoop) {
			console.log('clear interval');
			clearInterval(this.enquiryLoop);
		}

		$(document).off('click', '.pop-station-up');
	},
	init : function() {
		this.initComponent();
	},
	initComponent : function() {
		this.prepare();
		this.initStationGrid();
		this.initChart();
		this.refreshChart();

		$(document).off('click', '.pop-station-up').on('click', '.pop-station-up', function(e) {
			e.preventDefault();
			var code = $(this).attr('data-code');
			window.open('system/station/' + code + '/detail?_=' + new Date().getTime());
		});
	},
	initStationGrid : function() {
		var reference = this;

		this.stationGrid = $('#station-grid').kendoGrid({
			dataSource : {
				pageSize : 10,
				type : 'json',
				serverPaging : true,
				serverSorting : true,
				transport : {
					read : {
						url : 'system/dashboard/stationbyarea',
						type : 'POST',
						cache : false
					},
					parameterMap : function(params) {
						var obj = {};
						obj.areaName = reference.param;
						obj.curPage = params.curPage;
						obj.count = params.pageSize;
						obj.orderBy = getOrderBy(params.sort);
						obj.sortBy = getSortBy(params.sort);
						obj.skip = params.skip;
						return obj;
					}
				},
				schema : {
					data : function(response) {
						return response.data;
					},
					page : function(response) {
						return response.curPage;
					},
					total : function(response) {
						return response.maxCount;
					}
				}
			},
			sortable : true,
			resizable : true,
			height : 350,
			pageable : {
				refresh : true,
				pageSizes : true,
				numeric : true
			},
			selectable : 'multiple',
			columns : [ {
				field : 'stationName',
				title : '站点名称'
			}, {
				field : 'areaName',
				title : '区域'
			}, {
				field : 'runStatus',
				title : '运行状态',
				template : function(item) {
					switch (item.runStatus) {
					case 0:
						return '停止';
					case 1:
						if (item.atTime) {
							var current = new Date().getTime();
							if ((current - item.atTime) > (5 * 60 * 1000)) {
								return '长时间无数据';
							}
						}
						return '正常';
					case 2:
						return '抢修';
					case 3:
						return '负荷控制';
					case 4:
						return '长时间无数据';
					default:
						return '未知';
					}
				}
			}, {
				field : 'energyEnable',
				title : '能源中心上报',
				template : function(item) {
					if (item.hasOwnProperty('energyEnable')) {
						if (item.energyEnable) {
							return '是';
						} else {
							return '否';
						}
					} else {
						return '';
					}
				}
			}, {
				field : 'tradeEnable',
				title : '负荷响应',
				template : function(item) {
					if (item.hasOwnProperty('tradeEnable')) {
						if (item.tradeEnable) {
							return '是';
						} else {
							return '否';
						}
					} else {
						return '';
					}
				}
			}, {
				field : 'atTime',
				title : '最后通讯时间',
				template : function(item) {
					if (item.atTime) {
						return dateTimeFormat(new Date(item.atTime));
					} else {
						return '';
					}
				}
			}, {
				title : '详情',
				width : 60,
				template : function(item) {
					if (user.stationCache[item.stationCode]) {
						return '<a class="pop-station-up" href="#" data-code="' + item.stationCode + '">查看</a>';
					} else {
						return '';
					}
				}
			} ]
		}).data('kendoGrid');
	},
	prepare : function() {
		var fileLocation = 'resources/echarts-1.4.1/build/echarts-map';

		require.config({
			paths : {
				'echarts' : fileLocation,
				'echarts/chart/line' : fileLocation,
				'echarts/chart/bar' : fileLocation,
				'echarts/chart/scatter' : fileLocation,
				'echarts/chart/k' : fileLocation,
				'echarts/chart/pie' : fileLocation,
				'echarts/chart/radar' : fileLocation,
				'echarts/chart/map' : fileLocation,
				'echarts/chart/chord' : fileLocation,
				'echarts/chart/force' : fileLocation
			}
		});

		var reference = this;

		$.get('system/loadresponse/areaload', function(response) {
			reference.areaLoad = response;
			reference.initAreaMap();
		});
	},
	initAreaMap : function() {
		var reference = this;

		require([ 'echarts', 'echarts/chart/line', 'echarts/chart/bar', 'echarts/chart/scatter', 'echarts/chart/k', 'echarts/chart/pie', 'echarts/chart/radar', 'echarts/chart/force',
				'echarts/chart/chord', 'echarts/chart/map' ], function(ec) {
			reference.map = ec.init(document.getElementById('area-map'));

			require('echarts/util/mapData/params').params.SZ = {
				getGeoJson : function(callback) {
					$.getJSON('resources/echarts-1.4.1/src/util/mapData/rawData/geoJson/su_zhou_geo.json', callback);
				}
			};

			var data = [];
			var max = 0;
			reference.areaLoad.forEach(function(stationRun) {
				var val = stationRun.loadData.realtimeSumValue.toFixed(2);
				data.push({
					name : stationRun.areaName,
					value : val
				});
				max = Math.max(max, val);
			});
			max = Math.round(max) + 500;

			var title = '苏州市区域用电分布图';
			var option = {
				title : {
					text : ' '
				},
				tooltip : {
					trigger : 'item',
					formatter : '{b}<br/>{c} KW'
				},
				toolbox : {
					show : true,
					orient : 'vertical',
					x : 'right',
					y : 'center',
					feature : {
						mark : {
							show : true
						},
						dataView : {
							show : true,
							readOnly : false
						},
						restore : {
							show : true
						},
						saveAsImage : {
							show : true
						}
					}
				},
				dataRange : {
					min : 0,
					max : max,
					text : [ '高', '低' ],
					realtime : false,
					calculable : true,
					color : [ 'orangered', 'yellow', 'lightskyblue' ]
				},
				series : [ {
					name : title,
					selectedMode : 'single',
					type : 'map',
					mapType : 'SZ', // 自定义扩展图表类型
					itemStyle : {
						normal : {
							label : {
								show : true
							}
						},
						emphasis : {
							label : {
								show : true
							}
						}
					},
					data : data
				} ]
			};

			reference.map.setOption(option, true);
			reference.map.on('mapSelected', function(param) {
				reference.param = null;
				for ( var areaName in param.selected) {
					if (param.selected[areaName]) {
						reference.param = areaName;
						break;
					}
				}
				reference.stationGrid.dataSource.page(1);
			});

		});

	},
	initChart : function() {
		$('.sparkline').each(function() {
			var $box = $(this).closest('.infobox');
			var barColor = !$box.hasClass('infobox-dark') ? $box.css('color') : '#FFF';
			$(this).sparkline('html', {
				tagValuesAttribute : 'data-values',
				type : 'bar',
				barColor : barColor,
				chartRangeMin : $(this).data('min') || 0
			});
		});

		// $('.easy-pie-chart.percentage').each(function() {
		// var $box = $(this).closest('.infobox');
		// var barColor = $(this).data('color') ||
		// (!$box.hasClass('infobox-dark') ? $box.css('color') :
		// 'rgba(255,255,255,0.95)');
		// var trackColor = barColor == 'rgba(255,255,255,0.95)' ?
		// 'rgba(255,255,255,0.25)' : '#E2E2E2';
		// var size = parseInt($(this).data('size')) || 50;
		//			
		// $(this).easyPieChart({
		// barColor : barColor,
		// trackColor : trackColor,
		// scaleColor : false,
		// lineCap : 'butt',
		// lineWidth : parseInt(size / 10),
		// animate : /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ?
		// false : 1000,
		// size : size
		// });
		// });

		// data.push([ station.areaName, station.loadData.realtimeSumValue ]);
		// 区域负荷

		this.chart = new Highcharts.Chart({
			chart : {
				renderTo : 'are-load-info',
				height : 240,
				zoomType : 'y',
				type : 'column'
			},
			title : {
				text : ' '
			},
			xAxis : {
				categories : []
			},
			yAxis : {
				title : {
					text : 'KW'
				}
			},
			tooltip : {
				formatter : function() {
					var s;
					if (this.point.name) { // the pie chart
						s = '' + this.point.name + ': ' + this.y + ' %';
					} else {
						s = '' + this.x + ': ' + this.y + ' KW';
					}
					return s;
				}
			},
			series : [ {
				name : '区域负荷',
				data : []
			}, {
				type : 'pie',
				name : '负荷占比',
				data : [],
				center : (function() {
					return [ $('#are-load-info').width() - 70 - 10 - 60, 10 ];
				})(),
				size : 70,
				showInLegend : false,
				dataLabels : {
					enabled : false
				}
			} ]
		});
	},
	refreshChart : function() {
		var enquiry = false;
		var reference = this;

		this.enquiryLoop = setInterval(function() {
			if (enquiry == false) {
				enquiry = true;
				$.get('system/loadresponse/areaload?_' + new Date().getTime(), function(response) {
					if (reference.chart && response.push) {

						var categories = [];
						var data = [];
						var pieData = [];
						var total = 0;

						response.forEach(function(area) {
							var d = parseFloat(area.loadData.realtimeSumValue.toFixed(3));
							categories.push(area.areaName);
							data.push(d);
							total += d;
							pieData.push({
								name : area.areaName,
								y : d
							});
						});

						pieData.forEach(function(data) {
							data.y = parseFloat((data.y / total * 100).toFixed(3));
						});

						reference.chart.xAxis[0].setCategories(categories);
						reference.chart.series[0].update({
							data : data
						});
						reference.chart.series[1].update({
							data : pieData
						});
					}

					enquiry = false;
				});
			} else {
				console.log('未完成，退出！');
			}

		}, 5000);
	}
};