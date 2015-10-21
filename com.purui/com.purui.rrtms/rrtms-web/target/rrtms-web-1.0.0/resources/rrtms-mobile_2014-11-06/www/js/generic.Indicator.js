window.generic = window.generic || {};

generic.Indicator = function(obj) {
	$.extend(this, obj);
	
	this.title = '电力指标';
	this.$filterContext = $('#page-indicator-filter-dialog');
	this.$startDate = this.$filterContext.find('#indicator-start-date');
	this.$endDate = this.$filterContext.find('#indicator-end-date');
	this.$btnQuery = this.$filterContext.find('.btn-query');
	this.$btnCancel = this.$filterContext.find('.btn-cancel');
	this.$controlgroup = this.$filterContext.find('#my-controlgroup');
	
	this.init();
};

generic.Indicator.prototype = {
	destroy : function() {
		console.log('destroy ' + this.title);

		if (this.chart && this.chart.destroy) {
			console.log('destroy chart');
			this.chart.destroy();
			this.chart = null;
		}
	},
	init : function() {
		console.log('init ' + this.title);
		this.clearFilter();

		(function(reference) {
			$(document).off('pageshow', reference.href).on('pageshow', reference.href, function() {
				console.log('pageshow event');
				reference.$context.find('div[data-role=navbar]').find('a[href=' + reference.href + ']').removeClass('ui-btn-active').addClass('ui-btn-active');
				reference.resizeChart();
			});
		})(this);

		this.eventComponent();
	},
	active : function() {
		console.log('active ' + this.title);
		this.resizeChart();
	},
	stop : function() {
		console.log('stop ' + this.title);
	},
	clearFilter : function() {
		this.$startDate.val('');
		this.$endDate.val('');

		var checkboxes = this.$controlgroup.find('[type=checkbox]');
		if (checkboxes.length > 0) {
			$.each(checkboxes, function(index, item) {
				$(item).parent().remove();
			});

			this.$controlgroup.controlgroup("refresh");
		}
	},
	eventComponent : function() {
		(function(reference) {
			reference.$filterContext.find('.ui-icon-plus').unbind('click').click(function() {
				generic.pointSelector.show({
					backUrl : '#page-indicator-filter-dialog',
					type : 'DATAPOINT',
					callBack : function(data) {
						console.log(data);
						data.forEach(function(e) {
							if (reference.$controlgroup.find('input[value=' + e.guid + ']').length === 1) {
								console.log('已经有了，退出。');
								return;
							}

							var $el = $('<label><input type="checkbox" name="chk-point" value="' + e.guid + '">' + e.text + '</label>');
							console.log('add ', e.text);
							reference.$controlgroup.controlgroup("container").append($el);
							console.log('apply checkbox');
							$el.find('[type=checkbox]').checkboxradio();
						});
						console.log('controlgroup refresh');
						reference.$controlgroup.controlgroup("refresh");
						return true;
					}
				});
			});
		})(this);

		(function(reference) {
			reference.$filterContext.find('.ui-icon-minus').unbind('click').click(function() {
				$.each(reference.$controlgroup.find('[type=checkbox]:checked'), function(index, item) {
					$(item).parent().remove();
				});
				reference.$controlgroup.controlgroup("refresh");
			});
		})(this);

		(function(reference) {
			reference.$btnCancel.unbind('click').click(function() {
				$.mobile.changePage(reference.href, {
					transition : 'flip'
				});
			});
		})(this);

		(function(reference) {
			reference.$btnQuery.unbind('click').click(function(e) {
				e.preventDefault();

				var startDate = reference.$startDate.val(), endDate = reference.$endDate.val();

				startDate = startDate ? new Date(startDate) : new Date(dateFormat(new Date()));
				endDate = endDate ? new Date(endDate) : new Date(dateFormat(new Date()));

				if (endDate.getTime() < startDate.getTime()) {
					generic.message.alert('结束时间不能小于开始时间');
					return;
				}

				if (startDate.getFullYear() != endDate.getFullYear()) {
					generic.message.alert('不能跨年搜索');
					return;
				}

				if (endDate.getTime() > new Date().getTime()) {
					generic.message.alert("结束时间超出最大时间");
					return;
				}

				reference.$startDate.val(dateFormat(startDate));
				reference.$endDate.val(dateFormat(endDate));

				var points = (function() {
					var _data = [];
					$.each(reference.$controlgroup.find('[type=checkbox]'), function(index, item) {
						_data.push({
							name : $(item).prev().text(),
							val : $(item).val()
						});
					});
					return _data;
				})();

				if (points.length === 0) {
					generic.message.alert('请选择监测点！');
					return;
				}

				$.mobile.changePage(reference.href, {
					transition : 'flip'
				});

				reference.loadChart({
					startDate : startDate,
					endDate : endDate,
					points : points
				});
			});
		})(this);
	},
	initChart : function() {
		var reference = this;
		this.chart = new Highcharts.StockChart({
			chart : {
				renderTo : 'chart-indicator',
				animation : false,
				height : function() {
					return 200;
				}()
			},
			rangeSelector : {
				selected : 4,
				buttons : [],
				inputEnabled : false
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
	clearChart : function() {
		if (this.chart && this.chart.destroy) {
			console.log('destroy chart');
			this.chart = null;
		}

		this.initChart();
		this.resizeChart();
	},
	loadChart : function(data) {
		this.timestamp = new Date().getTime();
		var _timestamp = this.timestamp;

		var points = data.points;
		delete data.points;

		this.clearChart();

		var url = 'http://' + generic.variables.SERVER_IP + '/system/station/' + generic.variables.currentCode + '/datapoint/history';
		(function(reference) {
			points.some(function(e) {
				data.guid = e.val;

				if (_timestamp !== reference.timestamp) {
					console.log('已过时，退出！');
					return true;
				}

				generic.ajax({
					url : url,
					data : data,
					final : function(response) {
						if (_timestamp !== reference.timestamp) {
							console.log('已过时，退出！');
							return;
						}

						if (!response.push) {
							return;
						}

						reference.chart.addSeries({
							name : e.name,
							data : (function() {
								var _data = [];
								response.forEach(function(r) {
									_data.push([ new Date(r.atTime).getTime(), parseFloat(r.tagValue) ]);
								});
								return _data;
							})()
						});
					}
				});
			});
		})(this);

	},
	resizeChart : function() {
		if (this.chart) {
			var height = $(window).height() - this.$context.find('[data-role=header]').outerHeight() - this.$context.find('[data-role=footer]').outerHeight();
			this.chart.setSize(this.$context.find('#chart-indicator').parent().width(), height, doAnimation = true);
		}
	}

};
