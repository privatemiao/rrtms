var sideMenu = (function() {
	var url = 'system/menus';
	var sideMenuTarget = '.nav.nav-list';
	var loadPageTarget = '.page-content';
	var titleTarget = '.breadcrumb';
	var nodes = [];// personal menu
	var menuType = {
		MENU : 'MENU',
		ACCORDION : 'ACCORDION',
		TOOLBAR : 'TOOLBAR',
		OPERATE : 'OPERATE'
	};

	$('#nav-search').hide();

	$.ajax({
		url : url,
		async : false,
		cache : false,
		error : function(response) {
			handleError(response);
		},
		success : function(response) {
			nodes = response.nodes;
		}
	});

	function getNode(id) {
		if (!id) {
			return;
		}
		var data = null;
		(function _find(_nodes) {
			for ( var i = 0; i < _nodes.length; i++) {
				var node = _nodes[i];
				if (node.id == id) {
					data = node;
					return;
				} else {
					if (node.hasOwnProperty("nodes")) {
						_find(node.nodes);
					}
				}
			}
		})(nodes);
		return data;
	}

	var html = [];
	(function _generateSideMenu(_nodes) {
		for ( var i = 0; i < _nodes.length; i++) {
			var node = _nodes[i];
			html.push('<li>');
			if (node.type == menuType.ACCORDION) {
				html.push('<a id="' + node.id + '" href="#" class="dropdown-toggle">');
			} else {
				html.push('<a id="' + node.id + '" href="' + (node.url == null ? '#' : node.url) + '" ' + (node.opener ? 'target="_blank"' : '') + ' >');
			}

			if (node.css != null) {
				html.push('<i class="' + node.css + '"></i>');
			}
			html.push('<span class="menu-text"> ' + node.text + ' </span>');

			if (node.type == menuType.ACCORDION) {
				html.push('<b class="arrow icon-angle-down"></b>');
			}

			html.push('</a>');

			if (node.type == menuType.ACCORDION) {
				if (node.nodes.length > 0 && node.nodes[0].type != menuType.TOOLBAR) {
					html.push('<ul class="submenu">');
					_generateSideMenu(node.nodes);
					html.push('</ul>');
				}
			}

			html.push('</li>');
		}
	})(nodes);

	$(sideMenuTarget).html(html.join(''));
	$(sideMenuTarget).find('.submenu a').prepend('<i class="icon-double-angle-right"></i>');

	$(sideMenuTarget).find('a').click(function(e) {
		e.preventDefault();
	});
	function eventSideNav() {
		$(sideMenuTarget).find('a').click(function(e) {
			e.preventDefault();

			// except accordion and empty URL
			var url = $(this).attr('href');
			if (url == '#' || $(this).attr('href') == '') {
				return;
			}

			if (url.indexOf('?') == -1) {
				url += '?_=' + new Date().getTime();
			} else {
				url += '&_=' + new Date().getTime();
			}

			$('.nav-search .form-search').off();
			// load page
			if ($.clear) {
				// clear current loaded page's memory
				$.clear();
				delete $.clear;
			}
			
			if (Pace && Pace.stop){
				Pace.stop();
			}
			
			$(titleTarget).empty();
			var reference = $(this);

			$('#nav-search #search-param').val('');
			$('#nav-search').hide();

			// 判断是否是弹出页面
			if (reference.attr('target') && reference.attr('target').toString().toUpperCase() == '_BLANK') {
				$(loadPageTarget).empty();
				window.open(url);
				return;
			}

			$(loadPageTarget).empty().load(url, function(response, status, xhr) {
				if (xhr.getAllResponseHeaders().toLowerCase().indexOf('application/json') != -1) {
					var obj = JSON.parse(response)
					handleResult(obj);
					$(loadPageTarget).empty().html(obj.message);
					return;
				}

				// set active menu
				$(sideMenuTarget).find("li.active").removeClass("active");
				reference.closest("li").addClass("active");
				if (reference.closest("ul.submenu")) {
					reference.closest("ul.submenu").closest("li").addClass("active");
				}

				// load toolbar
				var node = getNode(reference.attr("id"));
				var toolbar = null;
				if (node.hasOwnProperty('nodes')) {
					toolbar = node.nodes;
				}
				if (toolbar == null) {
					return;
				}

				var html = [];
				toolbar.forEach(function(e) {
					if (e.type == 'TOOLBAR')
						html.push('<button id="' + e.id + '" class="btn btn-light btn-xs"><i class="' + e.css + '"></i>' + e.text + '</button>');
				});
				$(loadPageTarget).find("#toolbar").html(html.join(''));

				// effective tool tip
				$(loadPageTarget).find('[data-rel=tooltip]').tooltip();
			});
		});
	}

	return {
		getNodes : function() {
			return nodes;
		},
		menuType : menuType,
		setTitle : function(title) {
			var html = [];
			html.push('<li><i class="icon-home home-icon"></i> 首页 </li>');
			title.forEach(function(e) {
				html.push('<li> ' + e + ' </li>');
			});

			$(titleTarget).empty().html(html.join(''));
		},
		getNode : getNode,
		showSearchPanel : function() {
			$('#nav-search').show();
		},
		eventSideNav : function() {
			eventSideNav();
		}
	}

})();

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//