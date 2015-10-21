window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.HistoryData = function(station) {
	this.station = station;
	this.NAME = "历史数据";
	this.ID = "HistoryData";
};

com.rrtms.system.HistoryData.prototype = {
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
			this.tree = null;
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

		this.CONTEXT.find('.date-picker').datepicker('remove');
		this.CONTEXT.find('.btn-export').off();
		$('.export4excel').remove();
	},
	init : function() {
		this.CONTEXT = $('#station-tab #' + this.ID);
		this.resize();
		this.prepareData();
		this.initComponent();
		this.eventComponent();
	},
	eventComponent : function() {
		var reference = this;
		this.CONTEXT.find('select[name="filter"]').change(function() {
			reference.loadDataPointGrid(reference.currentPoint);
		});
	},
	initComponent : function() {
		this.initSplitter();
		this.initDatapointTree();
		this.initDataPointGrid();
		this.initChart();

		this.CONTEXT.find('.date-picker').datepicker({
			autoclose : true
		}).next().on('click', function() {
			$(this).prev().focus();
		}).next().on('click', function() {
			$(this).prev().prev().val('');
		});
	},
	initChart : function() {
		var reference = this;

		this.chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'HistoryData-chart',
				animation : false,
				height : function() {
					return reference.CONTEXT.find('#HistoryData-chart').parent().height();
				}()
			},
			rangeSelector : {
				selected : 4,
				buttons : [],
				inputEnabled : false
			},
			title : {
				text : '历史数据'
			},

			tooltip : {
				formatter : function() {
					return '<b>' + this.points[0].series.name + '</b><br/>' + Highcharts.dateFormat('%H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
				}
			},
			legend : {
				enabled : true
			},
			exporting : {
				enabled : true,
			},
			series : []
		});
	},
	initDataPointGrid : function() {
		var reference = this;

		this.dataPointGrid = this.CONTEXT.find('#HistoryData-grid').kendoGrid({
			selectable : 'multiple',
			resizeable : true,
			height : function() {
				return reference.CONTEXT.find('#HistoryData-grid').parent().height();
			},
			columns : [ {
				hidden : true,
				field : 'guid'
			}, {
				hidden : true,
				field : 'subTagType.code'
			}, {
				field : 'name',
				title : '名称'
			}, {
				field : 'subTagType.name',
				title : '中文名称'
			}, {
				field : 'subTagType.tagType.name',
				title : '指标分类'
			}, {
				field : 'unit',
				title : '单位'
			}, {
				template : function(item) {
					return '<a href="#" class="k-button btn-export btn-' + item.guid + '">下载</a>';
				}
			} ]
		}).data('kendoGrid');

		this.dataPointGrid.bind('change', function(item) {
			reference.generateChart();
		});
	},
	initDatapointTree : function() {
		var reference = this;
		this.tree = new window.com.rrtms.system.DatapointTree({
			id : this.ID + "-tree",
			station : this.station,
			click : function(id) {
				var point = reference.tree.getUserData(id);
				reference.loadDataPointGrid(point);
			}
		});
	},
	loadDataPointGrid : function(point) {
		this.gridTimestamp = new Date().getTime();
		var _gridTimestamp = this.gridTimestamp;
		this.chartTimestamp = null;
		console.log('set', this.gridTimestamp, _gridTimestamp);

		var reference = this;
		this.clearContent();
		this.currentPoint = point;
		if (!point) {
			return;
		}

		$.ajax({
			url : '../../../system/station/point/' + point.id + '/datapoints',
			data : {
				'count' : -1,
				code : reference.CONTEXT.find('select[name="filter"]').val()
			},
			cache : false,
			error : function() {
				handleError(e);
			},
			success : function(response) {
				console.log('check', reference.gridTimestamp, _gridTimestamp);
				if (_gridTimestamp != reference.gridTimestamp) {
					console.log('已过时，退出！');
					return;
				}

				handleResult(response, true);
				var dataPoints = response.data;

				if (!dataPoints || dataPoints.length == 0) {
					return false;
				}

				reference.dataPointGrid.setDataSource(new kendo.data.DataSource({
					data : dataPoints
				}));
			}
		});

	},
	generateChart : function() {
		this.clearChart();

		var reference = this;
		this.chartTimestamp = new Date().getTime();
		var _chartTimestamp = this.chartTimestamp;

		var items = getSelectedItem(this.dataPointGrid);
		var _startDate = this.CONTEXT.find('.right-panel input[name="startDate"]').val();
		var _endDate = this.CONTEXT.find('.right-panel input[name="endDate"]').val();
		var startDate = _startDate ? new Date(_startDate) : new Date();
		var endDate = _endDate ? new Date(_endDate) : new Date();

		if (startDate.getFullYear() != endDate.getFullYear()) {
			bootbox.alert("不能跨年搜索！");
			return;
		}
		if (startDate.getMonth() != endDate.getMonth()) {
			bootbox.alert("不能跨月搜索！");
			return;
		}
		if (endDate.getTime() - startDate.getTime() < 0) {
			bootbox.alert("结束时间不能早于开始时间！");
			return;
		}

		items.some(function(item) {
			if (reference.chartTimestamp != _chartTimestamp) {
				console.log('已过时，退出！');
				return true;
			}

			console.log('do >>', item);
			$.ajax({
				url : '../../../system/station/' + reference.station.code + '/datapoint/history',
				cache : true,
				error : handleError,
				data : {
					guid : item.guid,
					startDate : startDate,
					endDate : endDate
				},
				success : function(response) {
					handleResult(response, true);
					if (response.hasOwnProperty('status')) {
						return;
					}
					if (reference.chartTimestamp != _chartTimestamp) {
						console.log('已过时，退出！');
						return;
					}
					console.log('History size>>', response.length);
					var hdatas = [];
					response.forEach(function(e) {
						hdatas.push([ new Date(e.atTime).getTime(), parseFloat(e.tagValue) ]);
					});
					reference.chart.addSeries({
						name : item.name,
						data : hdatas
					});

					reference.chart.options.exporting.filename = (function() {
						var filename = reference.tree.getSelectedItemText();
						var selectedItems = getSelectedItem(reference.dataPointGrid);
						filename += '(';
						selectedItems.forEach(function(item) {
							filename += '_' + item.name;
						});
						filename += ')';

						var __startDate = dateFormat(startDate);
						var __endDate = dateFormat(endDate);

						filename += (__startDate == __endDate) ? ('_' + __startDate) : ('_' + __startDate + '_' + __endDate);

						return filename;
					})();

					if (items.length == 1) {
						reference.CONTEXT.find('.btn-' + item.guid).click(function() {
							// 设置下载的文件名
							this.download = reference.chart.options.exporting.filename + '.xls';

							var buffer = [];
							buffer.push('<table id="' + _chartTimestamp + '" class="export4excel hide">');
							buffer.push('<tr><th>时间</th><th>数值</th></tr>');
							response.forEach(function(e) {
								buffer.push('<tr>');
								buffer.push('<td>' + dateTimeFormat(new Date(e.atTime)) + '</td>');
								buffer.push('<td>' + parseFloat(e.tagValue) + '</td>');
								buffer.push('</tr>');
							});
							buffer.push('</table>');

							$('body').append(buffer.join(''));

							ExcellentExport.excel(this, _chartTimestamp, reference.chart.options.exporting.filename);
						});
						reference.CONTEXT.find('.btn-' + item.guid).show();
					}
				}
			});
		});

	},
	clearContent : function() {
		if (this.dataPointGrid) {
			this.dataPointGrid.setDataSource(new kendo.data.DataSource({
				data : []
			}));
		}

		this.clearChart();

	},
	clearChart : function() {
		this.chart.destroy();
		this.chart = null;
		this.initChart();

		this.CONTEXT.find('.btn-export').off();
		this.CONTEXT.find('.btn-export').hide();
		$('.export4excel').remove();
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
			this.chart.setSize(this.CONTEXT.find('#HistoryData-chart').parent().width(), this.CONTEXT.find('#HistoryData-chart').parent().height(), doAnimation = true);
		}

		if (this.dataPointGrid) {
			this.CONTEXT.find('#HistoryData-grid').height(this.CONTEXT.find('#HistoryData-grid').parent().height() - 2);
			this.dataPointGrid.refresh();
		}
	}
};