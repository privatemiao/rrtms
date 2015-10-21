com.rrtms.system.DataPoint = function(params) {
	this.params = params;
	this.init();
};
com.rrtms.system.DataPoint.prototype = {
	destroy : function() {
		console.log('destroy com.rrtms.system.DataPoint...');
		if (this.dataPointTree && this.dataPointTree.destructor) {
			console.log('destroy dataPointTree');
			this.dataPointTree.destructor();
			this.dataPointTree = null;
		}

		if (this.grid && this.grid.destroy) {
			console.log('destroy datapoint grid');
			this.grid.destroy();
			this.grid = null;
		}

		$('#datapoint-panel button').off();
	},
	init : function() {
		this.preparePage();
		this.initComponent();
		this.eventComponent();
	},
	preparePage : function() {
		$('#datapoint-panel .widget-header h5').html(this.params.station.name + ' - ' + '监测点');
	},
	initComponent : function() {
		this.initDataPointTree();
		this.initGrid();
	},
	initGrid : function() {
		this.grid = $('#datapoint-grid').kendoGrid({
			dataSource : {
				pageSize : 10,
				type : 'json',
				serverPaging : true,
				serverSorting : true,
				transport : {
					read : {
						url : 'about:blank',
						type : 'POST',
						dataType : 'json',
						cache : false
					},
					parameterMap : function(params) {
						var obj = {};
						obj.param = $('#search-param').val();
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
			height : 300,
			pageable : {
				refresh : true,
				pageSizes : true,
				numeric : true
			},
			selectable : 'multiple',
			columns : [ {
				field : "name",
				title : "名称",
			}, {
				field : "tagType",
				title : "一级分类",
				template : function(item) {
					if (item.subTagType && item.subTagType.tagType) {
						return item.subTagType.tagType.name;
					}
					return "";
				}
			}, {
				field : "subTagType",
				title : "二级分类",
				template : function(item) {
					if (item.subTagType) {
						return item.subTagType.name;
					}
					return "";
				}
			}, {
				field : "unit",
				title : "单位",
			}, {
				field : "isDefault",
				title : "    ",
				template : function(item) {
					if (item.isDefault == true) {
						return "默认";
					} else {
						return "";
					}
				}
			} ]
		}).data('kendoGrid');
	},
	initDataPointTree : function() {
		if (this.dataPointTree && this.dataPointTree.destructor) {
			console.log('destroy dataPointTree');
			this.dataPointTree.destructor();
			this.dataPointTree = null;
		}

		this.dataPointTree = new dhtmlXTreeObject('datapoint-tree', '100%', '100%', '-1');
		this.dataPointTree.setImagePath("resources/dhtmlx/tree/imgs/csh_dhx_skyblue/");
		var tree = this.dataPointTree;
		var station = this.params.station;
		$.get('/system/station/station/' + station.id, function(data) {
			console.log(data);
			var original = JSON.parse(JSON.stringify(data));
			(function _convert(points) {
				points.forEach(function(point) {
					point.text = point.name;
					delete point.name;

					if (point.type == 'POINT'){
						point.im0 = 'point.png';
						point.im1 = 'point.png';
						point.im2 = 'point.png';
					}
					
					var item = [];
					if (point.children) {
						item = point.children;
						delete point.children;
					}
					point.item = item;
					if (point.item.length > 0) {
						_convert(point.item);
					}
				});
			})(data.points);

			tree.loadJSONObject({
				id : '-1',
				text : '^',
				item : [ {
					id : '0',
					text : '监测点',
					item : data.points
				} ]
			});

			(function _bind(points) {
				points.forEach(function(point) {
					var obj = JSON.parse(JSON.stringify(point));
					delete obj.children;
					tree.setUserData(point.id, 'obj', obj);

					if (point.children.length > 0) {
						_bind(point.children);
					}
				});
			})(original.points);

		}).fail(function(e) {
			handleError(e);
		});
	},
	eventComponent : function() {
		this.eventTreeClick();
		this.eventDataPointPabelToolbar();
		this.eventToolbar();
	},
	eventToolbar : function() {
		var grid = this.grid;
		$('#datapoint-panel button.btn-set-default').click(function() {
			var dataPoints = getSelectedItem(grid);
			if (dataPoints.length == 0){
				bootbox.alert('请选择一条记录！');
				return;
			}
			if (dataPoints.length > 1){
				bootbox.alert('只能选择一条记录！');
				return;
			}
			
			$.ajax({
				url : 'system/station/point/datapoint/' + dataPoints[0].id +'/todefault',
				cache : false,
				async : true,
				type : 'post',
				error : function(e) {
					handleError(e);
				},
				success : function(response) {
					handleResult(response);
					if (response.status == 'SUCCESS') {
						grid.dataSource.read();
					}
				}
			});
		});
	},
	eventDataPointPabelToolbar : function() {
		var tree = this.dataPointTree;
		$('#datapoint-panel .btn-expand').click(function() {
			var selectedId = tree.getSelectedItemId();
			tree.openAllItems(selectedId == '' ? 0 : selectedId);
		});
		$('#datapoint-panel .btn-collapse').click(function() {
			var selectedId = tree.getSelectedItemId();
			tree.closeAllItems(selectedId == '' ? 0 : selectedId);
		});
	},
	eventTreeClick : function() {
		this.grid.dataSource.data([]);
		this.grid.dataSource.read();
		this.grid.dataSource.transport.options.read.url = 'about:blank';

		var tree = this.dataPointTree;
		var grid = this.grid;
		this.dataPointTree.attachEvent('onClick', function(id) {
			var point = tree.getUserData(id, 'obj');
			if (point == null) {
				return;
			}

			grid.dataSource.transport.options.read.url = 'system/station/point/' + point.id + '/datapoints';
			grid.dataSource.page(1);
			grid.dataSource.read();
		});
	}
};