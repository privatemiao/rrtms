$(function() {
	// com.rrtms.system.loadresponse.Solution

	window.com = window.com || {};
	window.com.rrtms = window.com.rrtms || {};
	window.com.rrtms.system = window.com.rrtms.system || {};
	window.com.rrtms.system.loadresponse = window.com.rrtms.system.loadresponse || {};

	com.rrtms.system.loadresponse.Solution = function() {
		this.init();
	};

	com.rrtms.system.loadresponse.Solution.prototype = {
		destroy : function() {
			console.log('destroy Solution...');

			if (this.avalibleGrid && this.avalibleGrid.destroy) {
				console.log('destroy avalible grid');
				this.avalibleGrid.destroy();
				this.avalibleGrid = null;
			}

			if (this.historyGrid && this.historyGrid.destroy) {
				console.log('destroy history grid');
				this.historyGrid.destroy();
				this.historyGrid = null;
			}
		},
		init : function() {
			this.layout();
			this.initComponent();
			this.eventComponent();
		},
		eventComponent : function() {
			var reference = this;

			$('.widget-header a').click(function() {
				var target = $(this).attr('href');
				if (target == '#history') {
					if (reference.historyGrid) {
						setTimeout(function() {
							if (reference && reference.historyGrid) {
								reference.historyGrid.refresh();
							}
						}, 1000);
					}
				}
			});
		},
		layout : function() {
			$('#instruction-tab .widget-body').height($.TAB_HEIGHT - $('#instruction-tab .widget-header').height());
			$('#instruction-tab .tab-content').height($('#instruction-tab .tab-content').parent().parent().height() - 44);
			this.GRID_HEIGHT = $('#instruction-tab .tab-content').height();
		},
		initComponent : function() {
			this.initGrid();
		},
		initGrid : function() {
			var reference = this;

			this.avalibleGrid = $('#avalible-grid').kendoGrid({
				dataSource : {
					pageSize : 10,
					type : 'json',
					serverPaging : true,
					serverSorting : true,
					transport : {
						read : {
							url : 'system/loadresponse/query',
							type : 'POST',
							cache : false
						},
						parameterMap : function(params) {
							var obj = {};
							obj.history = false;
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
				height : reference.GRID_HEIGHT,
				pageable : {
					refresh : true,
					pageSizes : true,
					numeric : true
				},
				selectable : 'multiple',
				columns : [ {
					field : 'areaName',
					title : '地区'
				}, {
					field : 'startDate',
					title : '开始日期',
					template : function(item) {
						if (!item.startDate) {
							return '';
						}
						return dateFormat(new Date(item.startDate));
					}
				}, {
					field : 'endDate',
					title : '截止日期',
					template : function(item) {
						if (!item.endDate) {
							return '';
						}
						return dateFormat(new Date(item.endDate));
					}
				}, {
					field : 'applyStartDate',
					title : '指令开始时间',
					template : function(item) {
						if (!item.applyStartDate) {
							return '';
						}
						return dateTimeFormat(new Date(item.applyStartDate));
					}
				}, {
					field : 'applyEndDate',
					title : '指令截止时间',
					template : function(item) {
						if (!item.applyEndDate) {
							return '';
						}
						return dateTimeFormat(new Date(item.applyEndDate));
					}
				}, {
					field : 'percent',
					title : '负荷控制目标（%）'
				}, {
					field : 'status',
					title : '状态',
					template : function(item) {
						console.log(item);
						if (item.applyStartDate < new Date().getTime()) {
							return '运行中';
						} else {
							return '未开始';
						}
					}
				}, {
					field : 'insertTime',
					title : '指令下发时间',
					width : 180,
					template : function(item) {
						if (item.insertTime) {
							return dateTimeFormat(new Date(item.insertTime));
						} else {
							return '';
						}
					}
				}, {
					command : {
						text : '详细信息',
						click : function(e) {
							var item = this.dataItem($(e.currentTarget).closest('tr'));
							window.open('system/loadresponse/detail/' + item.guid + '?_=' + new Date().getTime());
						}
					},
					width : 110,
					title : ' '
				} ]
			}).data('kendoGrid');

			this.historyGrid = $('#history-grid').kendoGrid({
				dataSource : {
					pageSize : 10,
					type : 'json',
					serverPaging : true,
					serverSorting : true,
					transport : {
						read : {
							url : 'system/loadresponse/query',
							type : 'POST',
							cache : false
						},
						parameterMap : function(params) {
							var obj = {};
							obj.history = true;
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
				height : reference.GRID_HEIGHT,
				pageable : {
					refresh : true,
					pageSizes : true,
					numeric : true
				},
				selectable : 'multiple',
				columns : [ {
					field : 'areaName',
					title : '地区'
				}, {
					field : 'startDate',
					title : '开始日期',
					template : function(item) {
						if (!item.startDate) {
							return '';
						}
						return dateFormat(new Date(item.startDate));
					}
				}, {
					field : 'endDate',
					title : '截止日期',
					template : function(item) {
						if (!item.endDate) {
							return '';
						}
						return dateFormat(new Date(item.endDate));
					}
				}, {
					field : 'applyStartDate',
					title : '指令开始时间',
					template : function(item) {
						if (!item.applyStartDate) {
							return '';
						}
						return dateTimeFormat(new Date(item.applyStartDate));
					}
				}, {
					field : 'applyEndDate',
					title : '指令截止时间',
					template : function(item) {
						if (!item.applyEndDate) {
							return '';
						}
						return dateTimeFormat(new Date(item.applyEndDate));
					}
				}, {
					field : 'percent',
					title : '负荷控制目标（%）'
				}, {
					field : 'insertTime',
					title : '指令下发时间',
					width : 180,
					template : function(item) {
						if (item.insertTime) {
							return dateTimeFormat(new Date(item.insertTime));
						} else {
							return '';
						}
					}
				}, {
					command : {
						text : '详细信息',
						click : function(e) {
							var item = this.dataItem($(e.currentTarget).closest('tr'));
							window.open('system/loadresponse/detail/' + item.guid + '?_=' + new Date().getTime());
						}
					},
					width : 110,
					title : ' '
				} ]
			}).data('kendoGrid');
		}

	};
});