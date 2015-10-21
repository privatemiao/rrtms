$(function() {
	window.com = window.com || {};
	window.com.rrtms = window.com.rrtms || {};
	window.com.rrtms.system = window.com.rrtms.system || {};
	window.com.rrtms.system.loadresponse = window.com.rrtms.system.loadresponse || {};

	com.rrtms.system.loadresponse.Control = function() {
		this.init();
	};

	com.rrtms.system.loadresponse.Control.prototype = {
		destroy : function() {
			console.log('destroy Control...');
			if (this.map && this.map.dispose) {
				console.log('destroy map');
				this.map.clear();
				this.map.dispose();
				this.map = null;
			}

			$('.date-picker').datepicker('remove');
			$('.time-picker').timepicker('remove');

			if (this.stationGrid && this.stationGrid.destroy) {
				console.log('destroy station grid');
				this.stationGrid.destroy();
				this.stationGrid = null;
			}
		},
		init : function() {
			this.initComponent();
			this.eventComponent();

			$('#baseDays').val(10).trigger('change');
		},
		eventComponent : function() {
			this.eventFormComponent();
		},
		eventFormComponent : function() {
			var reference = this;

			$('input[name="baseDays"]').change(this.calcBaseDate);
			// validate
			$('input[name="startDate"]').change(function() {
				var endDate = $('input[name="endDate"]').val();
				var startDate = $(this).val();
				startDate = parseDate(startDate);

				if (endDate) {
					endDate = parseDate(endDate);

					if (startDate.getTime() > endDate.getTime()) {
						bootbox.alert('开始日期不能大于截止日期！');
						return;
					}
				}

				var currentDate = parseDate(dateFormat(new Date()));
				if (startDate.getTime() > currentDate.getTime()) {
					bootbox.alert('开始日期不能大于今天！');
				}

			});
			$('input[name="endDate"]').change(function() {
				var endDate = $(this).val();
				if (!endDate) {
					return;
				}
				endDate = parseDate(endDate);

				var currentDate = parseDate(dateFormat(new Date()));

				if (endDate.getTime() >= currentDate.getTime()) {
					bootbox.alert('截至日期不能大于今天！');
					return;
				}

				var startDate = $('input[name="startDate"]').val();
				if (!startDate) {
					return;
				}

				startDate = parseDate(startDate);
				if (endDate.getTime() < startDate.getTime()) {
					bootbox.alert('截止日期不能小于开始日期！');
					return;
				}
			});

			$('input[name="applyStartTime"]').change(function() {

			});
			$('input[name="applyEndTime"]').change(function() {

			});

			$('.btn-test').click(function() {
				var timestamp = new Date().getTime();
				reference.btnTestTimestamp = timestamp;

				reference.resetStationGrid();

				if (!reference.validateForTest()) {
					return;
				}

				var startDate = $('#startDate').val();
				var endDate = $('#endDate').val();
				var stations = reference.stationGrid.dataSource.data();
				var percent = $('#percent').val();
				stations.some(function(station) {
					if (timestamp != reference.btnTestTimestamp) {
						console.log('已经过时');
						return true;
					}
					$.get('system/loadresponse/' + station.stationCode + '/basetotalload', {
						startDate : parseDate(startDate),
						endDate : parseDate(endDate)
					}, function(response) {
						if (timestamp != reference.btnTestTimestamp) {
							console.log('已经过时');
							return true;
						}
						if (!response.totalValue) {
							return false;
						}

						var avg = response.totalValue / response.count;
						avg = avg.toFixed(3);
						var tr = $('#station-grid tr:contains("' + station.stationCode + '")');
						if (tr.length != 1) {
							return false;
						}

						tr.find('td:nth-child(3)').html(avg);
						tr.find('td:nth-child(4)').html((avg * percent / 100).toFixed(3));
					});
				});
			});

			$('.btn-okay').click(function() {
				if (!reference.validateForApply()) {
					return;
				}

				var loadControl = $('#load-control-form').serializeObject();
				loadControl.applyStartDate = parseDateTime(loadControl.applyStartDate + ' ' + loadControl.applyStartTime);
				loadControl.applyEndDate = parseDateTime(loadControl.applyEndDate + ' ' + loadControl.applyEndTime);
				delete loadControl.applyStartTime;
				delete loadControl.applyEndTime;

				loadControl.endDate = parseDate(loadControl.endDate);
				loadControl.startDate = parseDate(loadControl.startDate);

				loadControl.areaName = reference.param;

				// 去除不必要的属性
				if (loadControl.hasOwnProperty('hour')) {
					delete loadControl.hour;
				}
				if (loadControl.hasOwnProperty('minute')) {
					delete loadControl.minute;
				}
				if (loadControl.hasOwnProperty('second')) {
					delete loadControl.second;
				}

				$.ajax({
					url : 'system/loadresponse/applyinstruction',
					data : loadControl,
					async : false,
					cache : false,
					type : 'POST',
					error : handleError,
					success : function(response) {
						if (!response.hasOwnProperty('status')) {
							console.log(response);
							return;
						}

						if (response.status == 'SUCCESS') {
							var data = JSON.parse(response.result);
							message.success(data.MSG);
						} else {
							handleError(response);
						}
					}
				});
			});
		},
		resetStationGrid : function() {
			var tr = $('#station-grid .k-grid-content tr');
			$(tr).find('td:nth-child(3)').html('');
			$(tr).find('td:nth-child(4)').html('');
		},
		validateForApply : function() {
			if (!this.validateForTest()) {
				return false;
			}

			var applyStartDate = $('#applyStartDate').val(), applyEndDate = $('#applyEndDate').val(), percent = $('#percent').val(), applyStartTime = $('#applyStartTime').val(), applyEndTime = $(
					'#applyEndTime').val(), currentTime = new Date().getTime();

			if (!applyStartDate) {
				bootbox.alert('请输入指令开始执行日期！');
				return false;
			}
			if (!applyEndDate) {
				bootbox.alert('请输入指令结束日期！');
				return false;
			}
			if (!percent) {
				bootbox.alert('请输入控制目标值！');
				return false;
			}

			applyStartDate = new Date(parseDate(applyStartDate).getTime() + parseTime(applyStartTime));
			applyEndDate = new Date(parseDate(applyEndDate).getTime() + parseTime(applyEndTime));

			if (applyStartDate.getTime() <= currentTime) {
				bootbox.alert('指令开始执行时间不能早于当前时间！');
				return false;
			}

			if (applyStartDate.getTime() >= applyEndDate.getTime()) {
				bootbox.alert('指令结束时间必须晚于开始时间！');
				return false;
			}

			return true;

		},
		validateForTest : function() {
			var startDate = $('#startDate').val(), endDate = $('#endDate').val();

			if (!this.param) {
				bootbox.alert('请选择地图上的目标区域！');
				return false;
			}

			if (!startDate) {
				bootbox.alert('请输入开始日期！');
				return false;
			}

			if (!endDate) {
				bootbox.alert('请输入截止日期');
				return false;
			}

			if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
				bootbox.alert('开始日期不能大于截止日期！');
				return false;
			}

			return true;
		},
		calcBaseDate : function() {
			var endDate = $('input[name="endDate"]'), endDateVal = endDate.val(), startDate;

			if (!endDateVal) {
				endDateVal = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
			} else {
				endDateVal = parseDate(endDateVal);
			}
			endDate.val(dateFormat(endDateVal));

			startDate = new Date(endDateVal.getTime() - (24 * 60 * 60 * 1000 * $(this).val()));
			$('input[name="startDate"]').val(dateFormat(startDate));

			$('input[name="endDate"]').trigger('change');

		},
		initComponent : function() {
			this.prepare();
			this.initDate();
			this.initStationGrid();
		},
		initDate : function() {
			$('.date-picker').datepicker({
				autoclose : true
			}).next().on('click', function() {
				$(this).prev().focus();
			}).next().on('click', function() {
				$(this).prev().prev().val('');
			});

			$('.time-picker').timepicker({
				minuteStep : 1,
				showSeconds : true,
				showMeridian : false,
				defaultTime : '00:00:00',
			}).next().on('click', function() {
				$(this).prev().focus();
			});

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

					reference.loadStation();
				});

			});

		},
		loadStation : function() {
			if (!this.param) {
				this.stationGrid.setDataSource(new kendo.data.DataSource({
					data : []
				}));
				return;
			}

			var reference = this;
			$.post('system/dashboard/stationbyarea', {
				areaName : this.param,
				trade : true,
				count : -1
			}, function(response) {
				handleResult(response);
				if (response.data) {
					reference.stationGrid.setDataSource(new kendo.data.DataSource({
						data : response.data
					}));
				}
			});
		},
		initStationGrid : function() {
			var reference = this;

			this.stationGrid = $('#station-grid').kendoGrid({
				sortable : true,
				resizable : true,
				height : $.GRID_HEIGHT,
				selectable : 'multiple',
				columns : [ {
					hidden : true,
					field : 'stationCode',
					title : '站点代码'
				}, {
					field : 'stationName',
					title : '站点名称'
				}, {
					field : 'baseValue',
					title : '基准值（KW）'
				}, {
					field : 'controlValue',
					title : '控制量（KW）'
				} ]
			}).data('kendoGrid');
		}

	};
});