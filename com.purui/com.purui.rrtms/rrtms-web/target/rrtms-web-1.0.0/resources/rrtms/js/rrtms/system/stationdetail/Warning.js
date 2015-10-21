window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.Warning = function(station) {
	this.station = station;
	this.NAME = "告警查询";
	this.ID = "Warning";
};

com.rrtms.system.Warning.prototype = {
	destroy : function() {
		console.log('destroy Warning...');

		if (this.grid && this.grid.destroy) {
			console.log('destroy grid');
			this.grid.destroy();
			this.grid = null;
		}

		this.CONTEXT.find('.date-picker').datepicker('remove');
	},
	init : function() {
		this.CONTEXT = $('#station-tab #' + this.ID);
		this.prepareData();
		this.initComponent();
		this.initDatePicker();
		this.eventComponent();
	},
	eventComponent : function() {
		var reference = this;

		this.CONTEXT.find('#warning-form').submit(
				function(e) {
					e.preventDefault();

					var startDate, endDate;
					startDate = reference.CONTEXT.find(
							'input[name="startDate"]').val();
					endDate = reference.CONTEXT.find('input[name="endDate"]')
							.val();

					startDate = startDate ? new Date(startDate) : new Date(
							dateFormat(new Date()));
					endDate = endDate ? new Date(endDate) : new Date(
							dateFormat(new Date()));

					console.log(startDate, endDate);

					if (endDate.getTime() < startDate.getTime()) {
						bootbox.alert('结束时间不能小于开始时间');
						return;
					}

					if (startDate.getFullYear() != endDate.getFullYear()) {
						bootbox.alert('不能跨年搜索');
						return;
					}

					if (endDate.getTime() > new Date().getTime()) {
						bootbox.alert("结束时间超出最大时间");
						return;
					}

					reference.CONTEXT.find('input[name="startDate"]').val(
							dateFormat(startDate));
					reference.CONTEXT.find('input[name="endDate"]').val(
							dateFormat(endDate));

					if (reference.grid) {
						reference.grid.dataSource.page(1);
					}

				});
	},
	prepareData : function() {
		var reference = this;
		$.ajax({
			url : '../../../system/warntypes',
			error : handleError,
			success : function(response) {
				handleResult(response, true);
				console.log(response);
				response.forEach(function(warnType) {
					reference.CONTEXT.find('select[name="warnType"]').append(
							'<option value="' + warnType.name + '">'
									+ warnType.name + '</option>');
				});
			}
		});
	},
	initDatePicker : function() {
		this.CONTEXT.find('.date-picker').datepicker({
			autoclose : true
		}).next().on('click', function() {
			$(this).prev().focus();
		});

		this.CONTEXT.find('.btn-clear-date').click(function() {
			$(this).prev().prev().val('');
		});
	},
	initComponent : function() {
		this.initGrid();
	},
	initGrid : function() {
		var reference = this;
		this.grid = this.CONTEXT.find('#warning-grid').kendoGrid(
				{
					dataSource : {
						pageSize : 10,
						type : "json",
						serverPaging : true,
						serverSorting : true,
						transport : {
							read : {
								type : "post",
								url : "../../../system/warning/history",
								cache : false
							},
							parameterMap : function(params) {
								var obj = {
									warnType : reference.CONTEXT.find(
											'select[name="warnType"]').val(),
									code : reference.station.code
								};

								var startDate = reference.CONTEXT.find(
										'input[name="startDate"]').val();
								var endDate = reference.CONTEXT.find(
										'input[name="endDate"]').val();

								if (startDate) {
									obj.startDate = new Date(startDate);
								}
								if (endDate) {
									obj.endDate = new Date(endDate);
								}
								if (!params.sort) {
									obj.orderBy = 'atTime';
									obj.sortBy = 'desc';
								} else {
									obj.orderBy = getOrderBy(params.sort);
									obj.sortBy = getSortBy(params.sort);
								}
								obj.curPage = params.curPage;
								obj.count = params.pageSize;
								obj.skip = params.skip;
								console.log(obj);
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
						return reference.CONTEXT.find("#warning-grid").parent()
								.parent().height();
					},
					toolbar : kendo.template($("#template-warning").html()),
					pageable : {
						refresh : true,
						pageSizes : true,
						numeric : false
					},
					selectable : "multiple",
					columns : [
							{
								field : "name",
								title : "名称"
							},
							{
								field : "warnLevel",
								title : "报警等级"
							},
							{
								field : "eventName",
								title : "报警类型"
							},
							{
								field : "atTime",
								title : "报警时间",
								template : function(item) {
									if (item.atTime != null) {
										return dateTimeFormat(new Date(
												item.atTime));
									}
									return "";
								}
							},
							{
								field : "logTime",
								title : "记录时间",
								template : function(item) {
									if (item.logTime != null) {
										return dateTimeFormat(new Date(
												item.logTime));
									}
									return "";
								}
							},
							{
								field : "configTime",
								title : "确认时间",
								template : function(item) {
									if (item.configTime != null
											&& item.configTime > 0) {
										return dateTimeFormat(new Date(
												item.configTime));
									}
									return "";
								}
							}, {
								field : "warnContent",
								title : "报警内容"
							}, {
								field : 'note',
								title : '备注'
							} ]
				}).data("kendoGrid");
	},
	resize : function() {
		if (!this.CONTEXT.hasClass('active')) {
			return;
		}
	}
};