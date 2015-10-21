window.generic = window.generic || {};

generic.pointSelector = (function() {
	var pageId = '#point-selector', svr = {
		clear : function() {
			this.cache = {};
			this.$list.empty();
		},
		init : function() {
			console.log('generic.pointSelector init.');
			this.cache = {};
			this.$list = $(pageId).find('[data-role=listview]');
			this.$btnOkay = $(pageId).find('#btn-okay');
			this.$btnCancel = $(pageId).find('#btn-cancel');
			this.eventComponent();
		},
		eventComponent : function() {
			console.log('generic.pointSelector event component.');
			var reference = this;

			$(document).off('pageshow', pageId).on('pageshow', pageId, function() {
				console.log('point selector page shown');

				if (!reference.$container) {
					reference.$container = $(pageId).find('.ui-dialog-contain');
				}

				if (!reference.$content) {
					reference.$content = $(pageId).find('.ui-content');
				}

				if (!reference.$header) {
					reference.$header = $(pageId).find('[data-role=header]');
				}

				if (!reference.$footer) {
					reference.$footer = $(pageId).find('[data-role=footer]');
				}

				reference.$content.outerHeight($(window).height() - parseInt(reference.$container.css('margin-top')) * 2 - reference.$header.outerHeight() - reference.$footer.outerHeight());
				console.log($(window).height(), parseInt(reference.$container.css('margin-top')), reference.$header.outerHeight(), reference.$footer.outerHeight());

				// reference.loadStations();
				reference.loadStation(generic.variables.currentCode);
			});

			$(document).off('click', pageId + ' [data-role=listview] a.station').on('click', pageId + ' [data-role=listview] a.station', function() {
				reference.loadStation($(this).attr('data-code'));
			});

			$(document).off('click', pageId + ' [data-role=listview] a.point').on('click', pageId + ' [data-role=listview] a.point', function() {
				console.log('~~~~~~~~');
				reference.loadChild($(this).attr('data-guid'));
			});

			this.$btnOkay.click(function() {
				if (!reference.cache.callBack) {
					$.mobile.changePage(reference.cache.backUrl);
					return;
				}

				var data = [];
				$.each(reference.$list.find('[type=checkbox]:checked'), function(index, item) {
					data.push({
						guid : $(item).val(),
						text : $(item).attr('data-text')
					});
				});

				if (reference.cache.callBack(data)) {
					$.mobile.changePage(reference.cache.backUrl);
				}
			});

			this.$btnCancel.click(function() {
				$.mobile.changePage(reference.cache.backUrl);
			});
		},
		/**
		 * <pre>
		 * obj = {
		 * 	title : title,
		 * 	callback : function
		 * };
		 * </pre>
		 */
		show : function(obj) {
			if (obj === undefined || obj === null) {
				obj = {};
			}

			if (!obj.title) {
				obj.title = '请选择';
			}

			if (!generic.variables.currentCode) {
				generic.message.alert('请进入站点！');
				return;
			}

			if (!obj.backUrl) {
				generic.message.alert('请提供返回地址[backUrl]');
				return;
			}

			if (!obj.type) {
				obj.type = 'POINT';
			}

			this.clear();

			this.cache = obj;

			console.log('show point selector.');

			$.mobile.changePage(pageId);
		},
		loadStations : function() {
			var buffer = [];
			generic.variables.user.stations.forEach(function(station) {
				buffer.push('<li><a href="#" class="station ui-btn ui-btn-icon-right ui-icon-carat-r" data-code="' + station.code + '">' + station.name + '</a></li>');
			});
			if (buffer.length > 0) {
				this.$list.empty().append(buffer.join(''));
			}
		},
		loadStation : function(code) {
			console.log('load station ', code);
			var station = generic.service.getStationHierarchy(code);
			this.cache['station'] = station;

			var buffer = [];
			station.points.forEach(function(point) {
				buffer.push('<li><a class="point ui-btn ui-btn-icon-right ui-icon-carat-r" href="#" data-guid="' + point.guid + '">' + point.name + '</a><li>');
			});

			if (buffer.length > 0) {
				this.$list.empty().append(buffer.join(''));
			}
		},
		loadChild : function(guid) {
			var buffer = [], reference = this;
			(function _find(points) {
				points.some(function(point) {
					if (point.guid === guid) {

						if (reference.cache.type === 'POINT') {
							point.children.forEach(function(child) {
								if (child.children.length > 0) {
									buffer.push('<li style="padding: 0">');
									buffer.push('<a class="point" data-guid="' + child.guid + '" style="padding: 0;" href="#">');
									buffer.push('<label>');
									buffer.push('<input type="checkbox" value="' + child.guid + '" data-text="' + child.name + '" />');
									buffer.push('</label>');
									buffer.push('<div style="float: left; padding: 25px 10px 0 20px;">' + child.name + '</div>');
									buffer.push('</a>');
									buffer.push('</li>');

								} else {
									buffer.push('<li style="padding: 0">');
									buffer.push('<label>');
									buffer.push('<input type="checkbox" value="' + child.guid + '" data-text="' + child.name + '" />');
									buffer.push('</label>');
									buffer.push('<div style="float: left; padding: 25px 10px 0 20px;">' + child.name + '</div>');
									buffer.push('</li>');
								}
							});
						} else {
							point.children.forEach(function(child) {
								if (child.children.length > 0) {
									buffer.push('<li><a class="point ui-btn ui-btn-icon-right ui-icon-carat-r" href="#" data-guid="' + child.guid + '">' + child.name + '</a></i>');
								} else {
									buffer.push('<li><a class="point ui-btn ui-btn-icon-right ui-icon-carat-r" href="#" data-guid="' + child.guid + '">' + child.name + '</a></i>');
								}
							});

							point.dataPoints.forEach(function(dataPoint) {
								buffer.push('<li style="padding: 0">');
								buffer.push('<label>');
								buffer.push('<input type="checkbox" value="' + dataPoint.guid + '" data-text="' + dataPoint.subTagType.name + '（'+dataPoint.name+'）' + '" />');
								buffer.push('</label>');
								buffer.push('<div style="float: left; padding: 25px 10px 0 20px;width:100px;">' + dataPoint.subTagType.name + '（'+dataPoint.name+'）' + '</div>');
								buffer.push('</li>');
							});
						}

						return true;
					} else {
						_find(point.children);
					}
				});
			})(this.cache.station.points);

			if (buffer.length > 0) {
				this.$list.empty().append(buffer.join(''));
				this.$list.trigger('create');
				this.$list.listview('refresh');
			}
		}

	};
	svr.init();

	return {
		show : function(obj) {
			svr.show(obj);
		}
	};
})();