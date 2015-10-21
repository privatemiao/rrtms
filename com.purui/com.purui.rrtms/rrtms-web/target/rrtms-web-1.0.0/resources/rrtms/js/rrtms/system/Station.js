com.rrtms.system.Station = function() {
	this.init();
};
com.rrtms.system.Station.prototype = {
	destroy : function() {
		console.log('destory com.rrtms.system.Station ...');
		if (this.stationGrid && this.stationGrid.destroy) {
			console.log('destroy stationGrid');
			this.stationGrid.destroy();
			this.stationGrid = null;
		}

		$(document).off('click', '#toolbar>button');

		if (this.dataPoint && this.dataPoint.destroy) {
			this.dataPoint.destroy();
			this.dataPoint = null;
		}

		$(document).off('click', '#station-grid .station-video, #station-grid .station-picture');

	},
	init : function() {
		this.preparePage();
		this.initComponent();
		this.eventComponent();
	},
	preparePage : function() {
		$('#datapoint-panel').hide();
	},
	initComponent : function() {
		this.initStationGrid();
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
						url : 'system/station/stations',
						type : 'POST',
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
			height : $.GRID_HEIGHT,
			pageable : {
				refresh : true,
				pageSizes : true,
				numeric : true
			},
			selectable : 'multiple',
			columns : [ {
				field : 'name',
				width : 250,
				title : '名称'
			}, {
				field : 'company.name',
				width : 250,
				title : '公司',
				template : function(item) {
					if (item.hasOwnProperty('company')) {
						if (item.company && item.company.hasOwnProperty('name')) {
							return item.company.name;
						} else {
							return '';
						}
					} else {
						return '';
					}
				}
			}, {
				field : 'code',
				width : 80,
				title : '代码'
			}, {
				field : 'level',
				width : 80,
				title : '电压等级'
			}, {
				field : 'completedDate',
				width : 90,
				title : '完成日期'
			}, {
				field : 'designkw',
				width : 80,
				title : '设计容量'
			}, {
				title : '视频',
				template : function(item) {
					return '<a class="station-video" href="#" data-code="' + item.code + '"><i class="icon-film"></i></a>';
				}
			}, {
				title : '图片',
				template : function(item) {
					return '<a class="station-picture" href="#" data-code="' + item.code + '"><i class="icon-picture"></i></a>';
				}
			} ]
		}).data('kendoGrid');
	},
	eventComponent : function() {
		this.eventGlobalSearch();
		this.stationGridDblClick();
		this.eventToolbar();
		this.eventDataPointPanelCloseListener();

		$(document).off('click', '#station-grid .station-video, #station-grid .station-picture').on(
				'click',
				'#station-grid .station-video, #station-grid .station-picture',
				function() {
					var code = $(this).attr('data-code');
					var isVideo = $(this).hasClass('station-video');

					$.get('system/station/' + code + '/videos', function(response) {
						if (response.length == 0) {
							message.warning('资源没有配置！');
							return;
						}

						var buffer = [];
						response.forEach(function(video) {
							buffer.push('<li><i class="icon-circle green"></i> <a href="' + (isVideo ? 'http://' + video.ip : 'system/station/picturepage?ip=' + video.ip) + '" target="_blank">'
									+ video.videoName + '</a> </li>');
						});
						$('#station-video-modal .video-list').html(buffer.join(''))

						$('#station-video-modal').find('.title').html(isVideo ? '选择视频' : '选择图片');
						$('#station-video-modal').find('#station-video-modal-type').val(isVideo ? 'VIDEO' : 'PICTURE');
						$('#station-video-modal').modal('show');
					});
				});
	},
	eventDataPointPanelCloseListener : function() {
		var reference = this;
		$('#datapoint-panel .widget-toolbar .icon-remove').click(function() {
			reference.showMainPanel();
			if (reference.dataPoint && reference.dataPoint.destroy) {
				reference.dataPoint.destroy();
				reference.dataPoint = null;
			}
		});
	},
	eventToolbar : function() {
		var reference = this;
		$(document).on('click', '#toolbar>button', function(e) {
			e.preventDefault();
			var id = $(this).attr('id');
			var node = sideMenu.getNode(id);
			if (reference[node.method]) {
				reference[node.method].call(reference, node.url);
			} else {
				console.log('can not find method called', node.method);
			}
		});
	},
	eventGlobalSearch : function() {
		var reference = this;
		$('.nav-search .form-search').submit(function(e) {
			e.preventDefault();
			reference.stationGrid.dataSource.page(1);
		});
	},
	stationGridDblClick : function() {
		var reference = this;
		$('#station-grid').delegate('tbody>tr', 'dblclick', function(ev, a) {
			var item = $('#station-grid').data('kendoGrid').dataItem($(this));
			reference.fillStationForm(item);
			$('#station-modal').modal('show').animate({
				scrollTop : 0
			}, 800);
		});
	},
	// for method
	clearStationForm : function() {
		var comps = $('#station-modal div[role=\'form\']').find('input, textarea');
		for (var i = 0; i < comps.length; i++) {
			$(comps[i]).val('');
		}
	},
	fillStationForm : function(station) {
		this.clearStationForm();
		if (!station) {
			return;
		}

		$('#station-modal #name').val(station.name);
		$('#station-modal #code').val(station.code);
		$('#station-modal #lon').val(station.lon);
		$('#station-modal #lat').val(station.lat);
		$('#station-modal #address').val(station.address);
		$('#station-modal input[id=\'company.name\']').val(station.company.name);
		$('#station-modal #contact').val(station.contact);
		$('#station-modal #tel').val(station.tel);
		$('#station-modal #level').val(station.level);
		$('#station-modal input[id=\'province.name\']').val(station.province.name);
		$('#station-modal input[id=\'city.name\']').val(station.city.name);
		$('#station-modal input[id=\'dist.name\']').val(station.dist.name);
		$('#station-modal #buildDate').val(station.buildDate);
		$('#station-modal #status').val(station.status);
		$('#station-modal #designkw').val(station.designkw);
		$('#station-modal #access').val(station == 'true' ? '是' : '否');
	},
	showDataPoint : function() {
		var stations = getSelectedItem(this.stationGrid);
		if (stations.length == 0) {
			bootbox.alert('请选择一个站点！');
			return;
		}
		if (stations.length > 1) {
			bootbox.alert('只能选择一个站点！');
			return;
		}

		if (this.dataPoint && this.dataPoint.destroy) {
			this.dataPoint.destroy();
			this.dataPoint = null;
		}

		this.dataPoint = new com.rrtms.system.DataPoint({
			station : stations[0]
		});
		this.showDataPointPanel();

	},
	showChartDesign : function() {
		var stations = getSelectedItem(this.stationGrid);
		if (stations.length == 0) {
			bootbox.alert('请选择一个站点！');
			return;
		}
		if (stations.length > 1) {
			bootbox.alert('只能选择一个站点！');
			return;
		}
		window.open('system/station/' + stations[0].code + '/chartdesign?_=' + new Date().getTime());
	},
	showMainPanel : function() {
		$('#station-grid').parent().parent().show();
		$('#datapoint-panel').hide();
	},
	showDataPointPanel : function() {
		$('#station-grid').parent().parent().hide();
		$('#datapoint-panel').show();
	}
};