$(function() {
	window.com = window.com || {};
	window.com.rrtms = window.com.rrtms || {};
	window.com.rrtms.system = window.com.rrtms.system || {};
	window.com.rrtms.system.powerstopinfo = window.com.rrtms.system.powerstopinfo
			|| {};

	com.rrtms.system.powerstopinfo.StopInfo = function() {
		this.AVAILABLE_GRID_HEIGHT = 210;
		this.init();
	};

	com.rrtms.system.powerstopinfo.StopInfo.prototype = {
		destroy : function() {
			console.log('destroy stopinfo...');
			if (this.lineGrid && this.lineGrid.destroy) {
				console.log('destroy line grid');
				this.lineGrid.destroy();
				this.lineGrid = null;
			}

			if (this.cuoFengGrid && this.cuoFengGrid.destroy) {
				console.log('destroy cuo feng grid');
				this.cuoFengGrid.destroy();
				this.cuoFengGrid = null;
			}

			if (this.lineAvailableGrid && this.lineAvailableGrid.destroy) {
				console.log('destroy available line grid');
				this.lineAvailableGrid.destroy();
				this.lineAvailableGrid = null;
			}

			if (this.cuofengAvailableGrid && this.cuofengAvailableGrid.destroy) {
				console.log('destroy available cuofeng grid');
				this.cuofengAvailableGrid.destroy();
				this.cuofengAvailableGrid = null;
			}

			$('.date-picker').datepicker('remove');
		},
		init : function() {
			this.layout();
			this.initComponent();
			this.eventComponent();
		},
		eventComponent : function() {
			var reference = this;

			$('.widget-header a').click(
					function() {
						var href = $(this).attr('href');
						if (!href) {
							return;
						}

						switch (href) {
						case '#available':
							break;
						case '#line':
							setTimeout(function() {
								if (reference.lineGrid
										&& reference.lineGrid.refresh) {
									reference.lineGrid.refresh();
								}
							}, 500);
							break;
						case '#cuofeng':
							setTimeout(function() {
								if (reference.cuoFengGrid
										&& reference.cuoFengGrid.refresh) {
									reference.cuoFengGrid.refresh();
								}
							}, 500);
							break;

						}
					});

			$('#line-stop-detail-modal').on('hide.bs.modal', function() {
				$(this).find('.startDate').html('');
				$(this).find('.endDate').html('');
				$(this).find('.area').val('');
				$(this).find('.line').val('');
				$(this).find('.range').val('');
				$(this).find('.companys').val('');
			});

			$('#cuofeng-stop-detail-modal').on('hide.bs.modal', function() {
				$(this).find('.startDate').html('');
				$(this).find('.endDate').html('');
				$(this).find('.area').val('');
				$(this).find('.line').val('');
				$(this).find('.release').val('');
				$(this).find('.type').html('');
				$(this).find('.capacity').html('');
				$(this).find('.owner').html('');
				$(this).find('.companys').val('');
			});

			$('#line .right-panel .btn-okay').click(function() {
				if (reference.lineGrid) {
					reference.lineGrid.dataSource.page(1);
				}
			});
			$('#cuofeng .right-panel .btn-okay').click(function() {
				if (reference.cuoFengGrid) {
					reference.cuoFengGrid.dataSource.page(1);
				}
			});

		},
		initComponent : function() {
			this.initLineGrid();
			this.initCuofengGrid();

			this.initAvailableGrid();

			$('.date-picker').datepicker({
				autoclose : true
			}).next().on('click', function() {
				$(this).prev().focus();
			}).next().on('click', function() {
				$(this).prev().prev().val('');
			});
		},
		initAvailableGrid : function() {
			var reference = this;

			this.lineAvailableGrid = $('#available-line-grid').kendoGrid({
				dataSource : {
					pageSize : 10,
					type : 'json',
					serverPaging : true,
					serverSorting : true,
					transport : {
						read : {
							url : '../system/powerstopinfo/queryline',
							type : 'POST',
							cache : false
						},
						parameterMap : function(params) {
							var obj = {};
							obj.available = true;
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
				height : reference.AVAILABLE_GRID_HEIGHT,
				pageable : {
					refresh : true,
					pageSizes : true,
					numeric : true
				},
				selectable : 'multiple',
				columns : [ {
					field : 'no',
					title : 'ID',
				}, {
					field : 'startDate',
					title : '停电开始时间',
					template : function(item) {
						if (item.startDate) {
							return dateTimeFormat(new Date(item.startDate));
						} else {
							return '';
						}
					}
				}, {
					field : 'endDate',
					title : '停电结束时间',
					template : function(item) {
						if (item.endDate) {
							return dateTimeFormat(new Date(item.endDate));
						} else {
							return '';
						}
					}
				}, {
					field : 'area',
					title : '停电区域',
					template : function(item) {
						if (item.area) {
							if (item.area.length > 10) {
								return item.area.substring(0, 9) + '...';
							} else {
								return item.area;
							}
						} else {
							return '';
						}
					}
				}, {
					field : 'line',
					title : '停电线路',
					template : function(item) {
						if (item.line) {
							if (item.line.length > 10) {
								return item.line.substring(0, 9) + '...';
							} else {
								return item.line;
							}
						} else {
							return '';
						}
					}
				}, {
					field : 'range',
					title : '停电范围',
					template : function(item) {
						if (item.range) {
							if (item.range.length > 10) {
								return item.range.substring(0, 9) + '...';
							} else {
								return item.range;
							}
						} else {
							return '';
						}
					}
				} ]
			}).data('kendoGrid');

			$('#available-line-grid').delegate(
					'tbody>tr',
					'dblclick',
					function(ev, a) {
						var item = $('#available-line-grid').data('kendoGrid')
								.dataItem($(this));
						if (item) {
							reference.viewLineDetail(item);
						}
					});

			this.cuoFengAvailableGrid = $('#available-cuofeng-grid')
					.kendoGrid(
							{
								dataSource : {
									pageSize : 10,
									type : 'json',
									serverPaging : true,
									serverSorting : true,
									transport : {
										read : {
											url : '../system/powerstopinfo/querycuofeng',
											type : 'POST',
											cache : false
										},
										parameterMap : function(params) {
											var obj = {};
											obj.available = true;
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
								height : reference.AVAILABLE_GRID_HEIGHT,
								pageable : {
									refresh : true,
									pageSizes : true,
									numeric : true
								},
								selectable : 'multiple',
								columns : [
										{
											field : 'no',
											title : 'ID',
										},
										{
											field : 'startDate',
											title : '停电开始时间',
											template : function(item) {
												if (item.startDate) {
													return dateTimeFormat(new Date(
															item.startDate));
												} else {
													return '';
												}
											}
										},
										{
											field : 'endDate',
											title : '停电结束时间',
											template : function(item) {
												if (item.endDate) {
													return dateTimeFormat(new Date(
															item.endDate));
												} else {
													return '';
												}
											}
										},
										{
											field : 'area',
											title : '停电区域',
											template : function(item) {
												if (item.area) {
													if (item.area.length > 10) {
														return item.area
																.substring(0, 9)
																+ '...';
													} else {
														return item.area;
													}
												} else {
													return '';
												}
											}
										},
										{
											field : 'line',
											title : '涉及线路',
											template : function(item) {
												if (item.line) {
													if (item.line.length > 10) {
														return item.line
																.substring(0, 9)
																+ '...';
													} else {
														return item.line;
													}
												} else {
													return '';
												}
											}
										}, {
											field : 'release',
											title : '停电原因'
										}, {
											field : 'type',
											title : '错峰类型'
										}, {
											field : 'capacity',
											title : '错峰容量'
										}, {
											field : 'unitName',
											title : '责任单位'
										} ]
							}).data('kendoGrid');

			$('#available-cuofeng-grid').delegate(
					'tbody>tr',
					'dblclick',
					function(ev, a) {
						var item = $('#available-cuofeng-grid').data(
								'kendoGrid').dataItem($(this));
						if (item) {
							reference.viewCuoFengDetail(item);
						}
					});

		},
		initCuofengGrid : function() {
			var reference = this;

			this.cuoFengGrid = $('#cuofeng-grid')
					.kendoGrid(
							{
								dataSource : {
									pageSize : 10,
									type : 'json',
									serverPaging : true,
									serverSorting : true,
									transport : {
										read : {
											url : '../system/powerstopinfo/querycuofeng',
											type : 'POST',
											cache : false
										},
										parameterMap : function(params) {
											var obj = {};
											var startDate = $(
													'#cuofeng .right-panel')
													.find(
															'input[name="startDate"]')
													.val();
											var endDate = $(
													'#cuofeng .right-panel')
													.find(
															'input[name="endDate"]')
													.val();
											if (startDate) {
												obj.startDate = parseDate(startDate);
											}
											if (endDate) {
												obj.endDate = parseDate(endDate);
											}
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
								columns : [
										{
											field : 'no',
											title : 'ID',
										},
										{
											field : 'startDate',
											title : '停电开始时间',
											template : function(item) {
												if (item.startDate) {
													return dateTimeFormat(new Date(
															item.startDate));
												} else {
													return '';
												}
											}
										},
										{
											field : 'endDate',
											title : '停电结束时间',
											template : function(item) {
												if (item.endDate) {
													return dateTimeFormat(new Date(
															item.endDate));
												} else {
													return '';
												}
											}
										},
										{
											field : 'area',
											title : '停电区域',
											template : function(item) {
												if (item.area) {
													if (item.area.length > 10) {
														return item.area
																.substring(0, 9)
																+ '...';
													} else {
														return item.area;
													}
												} else {
													return '';
												}
											}
										},
										{
											field : 'line',
											title : '涉及线路',
											template : function(item) {
												if (item.line) {
													if (item.line.length > 10) {
														return item.line
																.substring(0, 9)
																+ '...';
													} else {
														return item.line;
													}
												} else {
													return '';
												}
											}
										}, {
											field : 'release',
											title : '停电原因'
										}, {
											field : 'type',
											title : '错峰类型'
										}, {
											field : 'capacity',
											title : '错峰容量'
										}, {
											field : 'unitName',
											title : '责任单位'
										} ]
							}).data('kendoGrid');

			$('#cuofeng-grid').delegate(
					'tbody>tr',
					'dblclick',
					function(ev, a) {
						var item = $('#cuofeng-grid').data('kendoGrid')
								.dataItem($(this));
						if (item) {
							reference.viewCuoFengDetail(item);
						}
					});
		},
		initLineGrid : function() {
			var reference = this;

			this.lineGrid = $('#line-grid').kendoGrid(
					{
						dataSource : {
							pageSize : 10,
							type : 'json',
							serverPaging : true,
							serverSorting : true,
							transport : {
								read : {
									url : '../system/powerstopinfo/queryline',
									type : 'POST',
									cache : false
								},
								parameterMap : function(params) {
									var obj = {};
									var startDate = $('#line .right-panel')
											.find('input[name="startDate"]')
											.val();
									var endDate = $('#line .right-panel').find(
											'input[name="endDate"]').val();
									if (startDate) {
										obj.startDate = parseDate(startDate);
									}
									if (endDate) {
										obj.endDate = parseDate(endDate);
									}
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
						columns : [
								{
									field : 'no',
									title : 'ID',
								},
								{
									field : 'startDate',
									title : '停电开始时间',
									template : function(item) {
										if (item.startDate) {
											return dateTimeFormat(new Date(
													item.startDate));
										} else {
											return '';
										}
									}
								},
								{
									field : 'endDate',
									title : '停电结束时间',
									template : function(item) {
										if (item.endDate) {
											return dateTimeFormat(new Date(
													item.endDate));
										} else {
											return '';
										}
									}
								},
								{
									field : 'area',
									title : '停电区域',
									template : function(item) {
										if (item.area) {
											if (item.area.length > 10) {
												return item.area
														.substring(0, 9)
														+ '...';
											} else {
												return item.area;
											}
										} else {
											return '';
										}
									}
								},
								{
									field : 'line',
									title : '停电线路',
									template : function(item) {
										if (item.line) {
											if (item.line.length > 10) {
												return item.line
														.substring(0, 9)
														+ '...';
											} else {
												return item.line;
											}
										} else {
											return '';
										}
									}
								},
								{
									field : 'range',
									title : '停电范围',
									template : function(item) {
										if (item.range) {
											if (item.range.length > 10) {
												return item.range.substring(0,
														9)
														+ '...';
											} else {
												return item.range;
											}
										} else {
											return '';
										}
									}
								} ]
					}).data('kendoGrid');

			$('#line-grid').delegate('tbody>tr', 'dblclick', function(ev, a) {
				var item = $('#line-grid').data('kendoGrid').dataItem($(this));
				if (item) {
					reference.viewLineDetail(item);
				}
			});
		},
		layout : function() {
//			$('#stop-info-tab .widget-body').height(
//					$.TAB_HEIGHT - $('#stop-info-tab .widget-header').height());
			$('#stop-info-tab .tab-content')
					.height(
							$('#stop-info-tab .tab-content').parent().parent()
									.height() - 44);
			this.GRID_HEIGHT = $('#stop-info-tab .tab-content').height();
		},
		viewLineDetail : function(item) {
			var modal = $('#line-stop-detail-modal');

			if (item.startDate) {
				modal.find('.startDate').html(
						dateTimeFormat(new Date(item.startDate)));
			}
			if (item.endDate) {
				modal.find('.endDate').html(
						dateTimeFormat(new Date(item.endDate)));
			}
			modal.find('.area').val(item.area || '');
			modal.find('.line').val(item.line || '');
			modal.find('.range').val(item.range || '');

			var buffer = [];
			if (item.companys || item.companys.length > 0) {
				item.companys.forEach(function(company) {
					buffer
							.push(company.companyNo + ' - '
									+ company.companyName);
				});
			}
			modal.find('.companys').val(buffer.join('\r\n'));

			modal.modal('show');
			$('#line-stop-detail-modal').animate({
				scrollTop : 0
			}, 500);
		},
		viewCuoFengDetail : function(item) {
			var modal = $('#cuofeng-stop-detail-modal');

			if (item.startDate) {
				modal.find('.startDate').html(
						dateTimeFormat(new Date(item.startDate)));
			}
			if (item.endDate) {
				modal.find('.endDate').html(
						dateTimeFormat(new Date(item.endDate)));
			}
			modal.find('.area').val(item.area || '');
			modal.find('.line').val(item.line || '');
			modal.find('.release').val(item.release || '');

			modal.find('.type').html(item.type || {});
			modal.find('.capacity').html(item.capacity || {});
			modal.find('.owner').html(item.unitName || {});

			var buffer = [];
			if (item.companys || item.companys.length > 0) {
				item.companys.forEach(function(company) {
					buffer
							.push(company.companyNo + ' - '
									+ company.companyName);
				});
			}
			modal.find('.companys').val(buffer.join('\r\n'));

			modal.modal('show');
			$('#cuofeng-stop-detail-modal').animate({
				scrollTop : 0
			}, 500);
		}
	};
});