$(function() {
	window.com = window.com || {};
	window.com.rrtms = window.com.rrtms || {};
	window.com.rrtms.system = window.com.rrtms.system || {};
	window.com.rrtms.system.analysis = window.com.rrtms.system.analysis || {};

	com.rrtms.system.analysis.LoadCompare = function() {
		this.COMPARE_BY = {
			AREA : 'area',
			INDUSTRY : 'industry'
		};
		this.TYPE = {
			DAY : 'day',
			MONTH : 'month',
			YEAR : 'year'
		};
		this.init();
	};
	com.rrtms.system.analysis.LoadCompare.prototype = {
		destroy : function() {
			console.log('destroy LoadCompare...');

			if (this.tree && this.tree.destructor) {
				console.log('destroy tree');
				this.tree.destructor();
				this.tree = null;
			}

			this.destroyCalendar();

			if (this.chart && this.chart.destroy) {
				console.log('destroy chart');
				this.chart.destroy();
				this.chart = null;
			}

		},
		destroyCalendar : function() {
			if (this.startDate && this.startDate.destroy) {
				console.log('destroy startDate');
				this.startDate.destroy();
				this.startDate = null;
			}

			if (this.endDate && this.endDate.destroy) {
				console.log('destroy endDate');
				this.endDate.destroy();
				this.endDate = null;
			}
		},
		init : function() {
			this.layout = (function() {
				$('#compare-tree').height($.TREE_HEIGHT);
			})();
			this.prepare();
		},
		prepare : function() {
			this.loadArea();
		},
		loadArea : function() {
			var reference = this;

			$.ajax({
				url : '../../system/loadresponse/areaload',
				cache : false,
				error : handleError,
				success : function(response) {
					reference.areaLoad = response;
					reference.loadIndustry();
				}
			});
		},
		loadIndustry : function() {
			var reference = this;

			$.ajax({
				url : '../../system/industries',
				cache : false,
				error : handleError,
				success : function(response) {
					reference.industries = response;
					reference.initComponent();
					reference.eventComponent();
				}
			});
		},
		initComponent : function() {
			this.initTree(this.COMPARE_BY.AREA);

			this.startDate = $('#startDate').kendoDatePicker({
				format : "yyyy-MM-dd"
			}).data("kendoDatePicker");
			this.endDate = $('#endDate').kendoDatePicker({
				format : "yyyy-MM-dd"
			}).data("kendoDatePicker");

			this.initChart();

		},
		initChart : function() {
			this.chart = new Highcharts.Chart({
				chart : {
					renderTo : 'compare-chart',
					animation : false
				},
				title : {
					text : '负荷对比'
				},
				xAxis : {
					categories : []
				},
				yAxis : {
					title : {
						text : 'KW'
					},
					plotLines : [ {
						value : 0,
						width : 1,
						color : '#808080'
					} ]
				},
				tooltip : {
					formatter : function() {
						return '<b>' + this.series.name + '</b><br/>' + this.x
								+ '<br/>' + Highcharts.numberFormat(this.y, 2);
					}
				},
				legend : {
					enabled : true
				},
				exporting : {
					enabled : false
				},
				series : []
			});
		},
		initTree : function(kind) {
			var reference = this;

			if (this.tree && this.tree.destructor) {
				console.log('destroy tree');
				this.tree.destructor();
				this.tree = null;
			}

			this.tree = new dhtmlXTreeObject('compare-tree', '100%', '100%',
					'-1');
			this.tree
					.setImagePath("../../resources/dhtmlx/tree/imgs/csh_dhx_skyblue/");
			this.tree.enableCheckBoxes(1);

			var data = [];
			var count = 1;

			if (kind == this.COMPARE_BY.AREA) {
				this.areaLoad.forEach(function(e) {
					if (!e.areaName) {
						return;
					}
					data.push({
						id : count++,
						text : e.areaName
					});
				});
			} else {
				this.industries.forEach(function(e) {
					data.push({
						id : e.code,
						text : e.name
					});
				});
			}

			this.tree.loadJSONObject({
				id : '-1',
				text : '^',
				item : [ {
					id : '0',
					text : '总平台',
					item : data
				} ]
			});

			this.tree.openItem(0);

			this.tree.attachEvent('onCheck', function(id) {
				var checked = reference.tree.isItemChecked(id);

				if (id == 0) {
					var ids = reference.tree.getSubItems(id).split(',');
					ids.forEach(function(id) {
						reference.tree.disableCheckbox(id, checked);
					});
				}

				if (reference.tree.getAllChecked().split(',').length > 1) {
					$('#endDate').closest('.input-group').hide();
					$('#type').trigger('change');
				} else {
					$('#endDate').closest('.input-group').show();
					$('#type').trigger('change');
				}

			});

		},
		eventComponent : function() {
			var reference = this;

			$('#compare-group>label').click(function() {
				reference.initTree($(this).find('input').val());
				$('#endDate').closest('.input-group').show();
				$('#type').trigger('change');
			});

			$('#type')
					.change(
							function(e) {
								var val = $(this).val();
								var hide = $('#endDate').is(':hidden');

								reference.destroyCalendar();

								switch (val) {
								case reference.TYPE.DAY:
									$('#startDate').attr('title',
											hide ? '日期' : '开始日期');
									$('#startDate').attr('data-original-title',
											hide ? '日期' : '开始日期');

									$('#endDate').attr('title', '结束日期');
									$('#endDate').attr('data-original-title',
											'结束日期');

									console.log('create date picker', val);
									reference.startDate = $('#startDate')
											.kendoDatePicker({
												format : "yyyy-MM-dd"
											}).data('kendoDatePicker');
									if (!$('#endDate').is(':hidden')) {
										reference.endDate = $('#endDate')
												.kendoDatePicker({
													format : "yyyy-MM-dd"
												}).data('kendoDatePicker');
									}
									break;
								case reference.TYPE.MONTH:
									$('#startDate').attr('title',
											hide ? '月份' : '开始月份');
									$('#startDate').attr('data-original-title',
											hide ? '月份' : '开始月份');

									$('#endDate').attr('title', '结束月份');
									$('#endDate').attr('data-original-title',
											'结束月份');

									console.log('create date picker', val);
									reference.startDate = $('#startDate')
											.kendoDatePicker({
												start : "year",
												depth : "year",
												format : "yyyy-MM"
											}).data('kendoDatePicker');
									if (!$('#endDate').is(':hidden')) {
										reference.endDate = $('#endDate')
												.kendoDatePicker({
													start : "year",
													depth : "year",
													format : "yyyy-MM"
												}).data('kendoDatePicker');
									}
									break;
								case reference.TYPE.YEAR:
									$('#startDate').attr('title',
											hide ? '年份' : '开始年份');
									$('#startDate').attr('data-original-title',
											hide ? '年份' : '开始年份');

									$('#endDate').attr('title', '结束年份');
									$('#endDate').attr('data-original-title',
											'结束年份');

									console.log('create date picker', val);
									reference.startDate = $('#startDate')
											.kendoDatePicker({
												start : "decade",
												depth : "decade",
												format : "yyyy"
											}).data('kendoDatePicker');
									if (!$('#endDate').is(':hidden')) {
										reference.endDate = $('#endDate')
												.kendoDatePicker({
													start : "decade",
													depth : "decade",
													format : "yyyy"
												}).data('kendoDatePicker');
									}
									break;
								default:
									bootbox.alert('未知类型！');
									break;
								}
							});

			$('.btn-okay')
					.click(
							function() {
								var timestamp = new Date().getTime();
								reference.compare_timestamp = timestamp;

								if (reference.startDate
										&& !reference.startDate.value()) {
									reference.startDate.value(new Date());
								}

								if (reference.endDate
										&& !reference.endDate.value()) {
									reference.endDate.value(new Date());
								}

								var data = $('#compare-form').serializeObject();
								data.compareBy = reference.getCompareBy();
								data.compareByValue = reference
										.getCompareByVal();

								if (data.startDate) {
									data.startDate = parseDate(data.startDate);
								} else {
									delete data.startDate;
								}

								if (data.endDate) {
									data.endDate = parseDate(data.endDate);
								} else {
									delete data.endDate;
								}

								console.log(data);
								reference.clearContent();

								$
										.ajax({
											url : '../../system/analysis/load/compare',
											data : data,
											error : handleError,
											traditional : true,
											success : function(response) {
												if (reference.compare_timestamp != timestamp) {
													console.log('操作已过时，退出！');
													return;
												}
												handleResult(response, true);
												if (response
														.hasOwnProperty('status')) {
													return;
												}

												if (data.compareBy == 'area') {
													reference.chart.setTitle({
														text : '负荷对比'
													});
												} else {
													reference.chart.setTitle({
														text : '行业对比'
													});
												}

												if (!response.push) {
													message.warning('没有数据');
													return;
												}
												response
														.forEach(function(e) {
															reference.chart
																	.addSeries({
																		name : (function() {
																			var name = e.name;

																			if (data.compareBy == 'industry') {
																				var _name = reference.tree
																						.getItemText(name);
																				name = _name == '0' ? name
																						: _name;
																			}

																			if (!data.compareByValue
																					|| data.compareByValue.length == 1) {
																				switch (data.type) {
																				case "day":
																					return name
																							+ '-'
																							+ dateFormat(new Date(
																									e.date));
																				case "month":
																					return name
																							+ '-'
																							+ dateFormat(
																									new Date(
																											e.date))
																									.substring(
																											0,
																											7);
																				case "year":
																					return name
																							+ '-'
																							+ dateFormat(
																									new Date(
																											e.date))
																									.substring(
																											0,
																											4);
																				}
																			} else {
																				return name;
																			}
																		})(),
																		data : (function() {
																			var d = [];
																			var count = 0;
																			e.totalLoads
																					.forEach(function(
																							load) {
																						d
																								.push([
																										++count,
																										load.totalValue ]);
																					});
																			return d;
																		})()
																	});
														});
											}
										});
							});

		},
		clearContent : function() {
			(function _removeSeries(reference) {
				if (!reference.chart) {
					return;
				}
				reference.chart.series.forEach(function(s) {
					s.remove();
				});
				if (reference.chart.series.length > 0) {
					_removeSeries(reference);
				}
			})(this);

			this.chart.redraw();
		},
		getCompareBy : function() {
			return $('#compare-group>label.active>input').val();
		},
		getCompareByVal : function() {
			var reference = this;

			var checked = this.tree.getAllChecked();
			checked = checked.length == 0 ? [] : checked.split(',');

			if (checked.length == 0
					|| (checked.length == 1 && checked[0] == '0')) {
				return null;
			}

			var compareBy = this.getCompareBy();
			switch (compareBy) {
			case this.COMPARE_BY.AREA:
				var data = [];
				checked.forEach(function(id) {
					data.push(reference.tree.getItemText(id));
				});
				return data;
				break;
			case this.COMPARE_BY.INDUSTRY:
				var data = [];
				checked.forEach(function(id) {
					data.push(id);
				});
				return data;
				break;

			}
		}
	};

});