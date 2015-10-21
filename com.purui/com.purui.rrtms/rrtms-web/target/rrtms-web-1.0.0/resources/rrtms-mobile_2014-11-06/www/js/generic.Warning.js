window.generic = window.generic || {};

generic.Warning = function(obj) {
	$.extend(this, obj);
	this.init();
};
generic.Warning.prototype = {
	destroy : function() {
		console.log("destroy ", this.title);

		$(document).off('click', '#btn-warn-more');
		$(document).off('pageshow', '#page-warning');
	},
	init : function() {
		console.log("init ", this.title);
		this.$filterContext = $('#page-warning-filter-dialog');
		this.$startDate = this.$filterContext.find('#start-date');
		this.$endDate = this.$filterContext.find('#end-date');
		this.$warnType = this.$filterContext.find('#warn-type');
		this.$frm = this.$filterContext.find('#frm-query-message');
		this.$listWarn = this.$context.find('#list-warn');

		this.initWarnType();
		this.eventComponent();
		
		this.$frm.trigger('submit');

		(function(reference) {
			$(document).off('pageshow', reference.href).on('pageshow', reference.href, function() {
				reference.$context.find('div[data-role=navbar]').find('a[href=' + reference.href + ']').removeClass('ui-btn-active').addClass('ui-btn-active');
			});
		})(this);
	},
	active : function() {
		console.log("active ", this.title);
		this.$startDate.val('');
		this.$endDate.val('');
		this.$listWarn.empty();
	},
	stop : function() {
		console.log("stop ", this.title);
		this.destroy();
	},
	initWarnType : function() {
		var reference = this;
		generic.ajax({
			url : generic.variables.url.WARNING_TYPES,
			final : function(response) {
				console.log('warnType - ', response);
				console.log(reference.$warnType);
				if (!response.push) {
					return;
				}
				var buffer = [ '<option value="">报警类型</option>', '<option value="">全部</option>' ];
				response.forEach(function(e) {
					buffer.push('<option value="' + e.name + '">' + e.name + '</option>');
				});
				if (buffer.length > 2) {
					reference.$warnType.empty().append(buffer.join(''));
					reference.$warnType.selectmenu();
					reference.$warnType.selectmenu('refresh');
				}
			}
		});
	},
	eventComponent : function() {
		this.eventQueryWarn();
		this.eventMoreButton();
	},
	eventQueryWarn : function() {
		(function(reference) {
			reference.$frm.unbind('submit').submit(function(e) {
				e.preventDefault();

				console.log('submit warning query.');

				reference.$listWarn.empty();
				reference.queryData = {
					count : 10,
					skip : 0
				};
				reference.queryWarnHistory();
				$.mobile.changePage(reference.href, {
					transition : 'flip'
				});
			});
		})(this);
	},
	queryWarnHistory : function() {
		var startDate, endDate, reference = this;
		startDate = this.$startDate.val();
		endDate = this.$endDate.val();

		startDate = startDate ? new Date(startDate) : new Date(dateFormat(new Date(new Date().getTime() - 86400000)));
		endDate = endDate ? new Date(endDate) : new Date(dateFormat(new Date()));

		console.log('startDate', dateFormat(startDate));
		console.log('endDate', dateFormat(endDate));

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

		this.$startDate.val(dateFormat(startDate));
		this.$endDate.val(dateFormat(endDate));

		this.queryData.code = generic.variables.currentCode;
		this.queryData.orderBy = 'atTime';
		this.queryData.sortBy = 'desc';
		this.queryData.warnType = this.$warnType.val();
		this.queryData.startDate = startDate;
		this.queryData.endDate = endDate;

		generic.ajax({
			url : generic.variables.url.WARNING_HISTORY,
			data : this.queryData,
			final : function(response) {
				if (response.data.length == 0) {
					return;
				}

				var buffer = [], count = 1;
				response.data.forEach(function(warning) {
					buffer.push('<li class="ui-li-static ui-body-inherit">' + (reference.queryData.skip + count++) + '、' + dateTimeFormat(new Date(warning.atTime)) + '<br>' + warning.eventName
							+ ' - ' + warning.name + ' <br> ' + warning.warnContent.replace(/,/g, '<br>') + ' <br> ' + (warning.note ? warning.note : '没有备注') + '</li>');
				});
				if (buffer.length == 0) {
					return;
				}
				reference.$listWarn.append(buffer.join(''));
				delete response.data;
				reference.queryData = response;

				if (reference.queryData.count + reference.queryData.skip < reference.queryData.maxCount) {
					reference.$listWarn.append('<li  class="ui-li-static ui-body-inherit" style="text-align:center;"><a id="btn-warn-more">更多（'
							+ (reference.queryData.maxCount - reference.queryData.count - reference.queryData.skip) + '/' + reference.queryData.maxCount + '）...</a></li>');
				}
			}
		});
	},
	eventMoreButton : function() {
		(function(reference) {
			$(document).off('click', '#btn-warn-more').on('click', '#btn-warn-more', function() {
				reference.queryData.skip += reference.queryData.count;
				reference.queryWarnHistory();
				$(this).animate({
					height : 0
				}, 500, "linear", function() {
					$(this).parent().remove();
				})
			});
		})(this);
	}
};