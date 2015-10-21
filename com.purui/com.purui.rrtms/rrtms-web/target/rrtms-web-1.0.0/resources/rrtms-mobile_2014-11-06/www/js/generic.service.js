window.generic = window.generic || {};

generic.service = (function() {
	var $navbar = $('#navbar'), pageCache = {}, user, stationCache = {}, svr = {
		/**
		 * params = {<br>
		 * id : $(this).attr('href').substring(1),<br>
		 * href : $(this).attr('href'),<br>
		 * className : $(this).attr('data-obj'),<br>
		 * title : $(this).text()<br> };
		 */
		navigate : function(params) {
			var obj = pageCache[params.className];

			if (!obj) {
				params.$context = $(params.href);
				params.$footer = params.$context.find('div[data-role=footer]');

				if (!generic[params.className]) {
					generic.message.alert('没有找到类[' + params.className + ']');
					return;
				}

				obj = new generic[params.className](params);
				pageCache[params.className] = obj;
			} else {
				if (params.hasOwnProperty('cache') && params.cache === false) {
					if (obj.destroy) {
						obj.destroy();
						obj.init();
					} else {
						console.log('类[generic.' + params.className + ']，没有找到  destroy 方法！')
						generic.message.error('类[generic.' + params.className + ']，没有找到  destroy 方法！');
					}
				}
			}

			console.log('change page>>', params.href);
			$.mobile.changePage(params.href, {
				transition : params.transition ? params.transition : 'none'
			});

			obj.$footer.find('div[data-role=navbar]').find('a[data-obj=' + params.className + ']').removeClass('ui-btn-active').addClass('ui-btn-active');
			obj.active();
			$.each(pageCache, function(key, val) {
				if (key !== params.className) {
					val.stop();
				}
			});
			console.log('~~~~~~~~~~~~~~load page done~~~~~~~~~~~~~~');
		},
		getStationHierarchy : function(code) {
			if (code === undefined) {
				return;
			}

			var station = stationCache[code];
			if (station) {
				return station;
			}

			generic.ajax({
				url : 'http://' + generic.variables.SERVER_IP + '/system/station/' + code + '/datapointhierarchy',
				async : false,
				final : function(response) {
					station = response;

					(function _convert(points) {
						points.forEach(function(point) {
							if (point.dataPoints && point.dataPoints.length > 0) {
								point.dataPoints.forEach(function(dataPoint) {
									dataPoint.parentCurrentId = point.currentId;
									dataPoint.parentGuid = point.guid;
								});
							}

							if (point.children && point.children.length > 0) {
								_convert(point.children);
							}
						});
					})(station.points);

					stationCache[code] = station;
				}
			});
			return station;
		},
		getCurrentUser : function() {
			if (!user) {
				generic.ajax({
					url : generic.variables.url.CURRENT_USER,
					async : false,
					final : function(response) {
						user = response;
					}
				});
			}

			return user;
		}
	};

	return {
		navigate : svr.navigate,
		clear : function() {
			$.each(pageCache, function(key, val) {
				console.log('clear ' + key);
				if (val && val.destroy) {
					val.stop();
					val.destroy();
				}
				val = null;
			});
			pageCache = {};

			$.each(stationCache, function(key, val) {
				val = null;
			});
			stationCache = {};
		},
		getStationHierarchy : svr.getStationHierarchy,
		getCurrentUser : svr.getCurrentUser,
		_pageCache : function() {
			return pageCache;
		}
	};
})();