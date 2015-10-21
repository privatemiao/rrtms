com.rrtms.system.StationDist = function() {
	this.init();
};
com.rrtms.system.StationDist.prototype = {
	destroy : function() {
		console.log('destroy StationDist...');
		if (this.map && this.map.destroy) {
			this.map.destroy();
		}
		if (this.stationGrid && this.stationGrid.destroy) {
			console.log('destroy stationGrid');
			this.stationGrid.destroy();
		}
		$(document).off('click', '.console a.warn');
	},
	init : function() {
		this.layout();
		this.initComponent();
		this.eventComponent();
	},
	layout : function() {
		var mapHeight = $(document).height() - $('.navbar').height() - $('#breadcrumbs').height() - $('.page-header').height();
		if (mapHeight > 80) {
			mapHeight -= 80;
		}
		$('#map').height(mapHeight);

		$('#right-panel').offset({
			top : $('#map').offset().top - $('#right-panel>div:first-child').outerHeight()
		});
		$('#right-panel').height($('#map').height());

		$('#right-panel>div:nth-child(2)').width($('#right-panel').innerWidth() - $('#right-panel>div:first-child').outerWidth() - 6);

		$('#console').offset({
			top : $('#map').offset().top + $('#map').height()
		});
		$('#console').width($('#map').width());

	},
	initComponent : function() {
		this.initStationGrid();
	},
	initMap : function() {
		var initLocation = null;
		var station = this.stationGrid.dataItem('tr:eq(1)');
		if (station && station.lon && station.lat) {
			initLocation = {
				lng : station.lon,
				lat : station.lat
			};
		}

		this.map = new com.rrtms.system.Map({
			initLocation : initLocation,
			onClick : function(e) {
			}
		});
		$('#console').width($('#map').width());
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
						url : 'system/station/stationsbyuser',
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
			height : function() {
				return $('#right-panel').height();
			},
			pageable : {
				refresh : false,
				pageSizes : false,
				numeric : false
			},
			selectable : 'row',
			dataBound : function() {
				if (!reference.map) {
					reference.initMap();
				}
			},
			columns : [ {
				field : 'a.name',
				width : 250,
				title : '站点',
				template : function(item) {
					if (!item) {
						return;
					}

					return item.name;
				}
			} ]
		}).data('kendoGrid');

		$('#station-grid').delegate('tbody>tr', 'click', function(ev, a) {
			var item = $('#station-grid').data('kendoGrid').dataItem($(this));
			console.log(item);
			reference.map.move({
				lng : item.lon,
				lat : item.lat,
				zoom : 14
			});
		});

		$('#station-grid').delegate('tbody>tr', 'mouseover', function(ev, a) {
			var offset = $(this).offset();
			$('#context-menu').show().offset({
				top : offset.top
			}).attr('target', $(this).attr('data-uid'));
		});
	},
	eventComponent : function() {
		var reference = this;

		// station panel
		$('#right-panel>div:first-child').click(function() {
			if ($('#right-panel>div:nth-child(2)').css('display') == 'none') {
				$('#right-panel').width(300);
				$('#right-panel>div:nth-child(2)').show();
			} else {
				$('#right-panel').width(47);
				$('#right-panel>div:nth-child(2)').hide();
				$('#context-menu').hide();
			}
		});

		// global search
		$('.nav-search .form-search').submit(function(e) {
			e.preventDefault();
			reference.stationGrid.dataSource.page(1);
		});

		$('#context-menu').off('click').on('click', function() {
			var target = $(this).attr('target');
			var item = reference.stationGrid.dataItem($('tr[data-uid="' + target + '"]'));
			window.open('system/station/' + item.code + '/detail?_=' + new Date().getTime());
		}).off('mouseover').on('mouseover', function() {
			$(this).find('i').addClass('blue');
		}).off('mouseout').on('mouseout', function() {
			$(this).find('i').removeClass('blue');
		});

		$('#console .widget-toolbar a:first-child').click(function(e) {
			if ($(this).closest('.widget-box').hasClass('collapsed')) {
				$('#console').offset({
					top : $('#map').offset().top + $('#map').height() - 260
				});
			} else {
				setTimeout(function() {
					$('#console').offset({
						top : $('#map').offset().top + $('#map').height()
					});
				}, 300);
			}

		});

		// 处理告警信息
		$(document).off('click', '.console a.warn').on('click', '.console a.warn', function(e) {
			e.preventDefault();

			var param = {
				guid : $(this).attr('guid'),
				code : $(this).attr('code'),
				date : $(this).attr('date')
			};

			$('#warning-configure-modal-form').find('input[name="guid"]').val(param.guid);
			$('#warning-configure-modal-form').find('input[name="code"]').val(param.code);
			$('#warning-configure-modal-form').find('input[name="date"]').val(param.date);

			$('#warning-configure-modal-form').modal('show');
			$('#warning-configure-modal-form').find('textarea[name="note"]').focus();

			if (true) {
				console.log('exit');
				return;
			}

			var reference_a = this;
			$.ajax({
				url : 'system/warning/configwarning',
				cache : false,
				type : 'POST',
				data : param,
				error : handleError,
				success : function(response) {
					handleResult(response);

					if (response.hasOwnProperty('status') && response.status == "SUCCESS") {
						$(reference_a).parent().remove();
						reference.map.removeWarning(param.code);
					}
				}
			});
		});

	},
	removeWarning : function(code) {
		$('.console a[code="' + code + '"]').parent().remove();
		this.map.removeWarning(code);
	}

	// /////////////////////////////////////////////////////
	,
	getBounds : function() {
		return this.map.getBounds();
	},
	hideRightPanel : function() {
		$('#right-panel').width(47);
		$('#right-panel>div:nth-child(2)').hide();
		$('#context-menu').hide();
	}
};