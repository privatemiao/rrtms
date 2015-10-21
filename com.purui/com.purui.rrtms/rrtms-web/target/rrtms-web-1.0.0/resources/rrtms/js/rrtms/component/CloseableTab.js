if (!window.com) {
	var com = {};
}
if (!com.component) {
	com.component = {};
}

com.component.CloseableTab = function(params) {
	if (!params.id) {
		alert('没有指定tab\'s id');
		return;
	}

	var tab = $('#' + params.id);

	function deactive() {
		tab.find('.nav>li').removeClass('active');
		tab.find('.tab-content>div').removeClass('active');
	}

	function active(id) {
		deactive();
		var nav, content;
		if (id) {
			nav = tab.find('.nav>li>a[href="#' + id + '"]');
			nav = $(nav).parent();
			content = tab.find('.tab-content #' + id);
		} else {
			nav = tab.find('.nav>li:last-child');
			content = tab.find('.tab-content>div:last-child');
		}

		nav.find('a').trigger('click');
		// nav.addClass('active');
		// content.addClass('active');
		$('.tab-content').animate({
			scrollTop : 0
		});
	}

	function remove(id) {
		var nav = tab.find('.nav>li>a[href="#' + id + '"]');
		nav = $(nav).parent();
		var actived = nav.hasClass('active');
		var content = tab.find('.tab-content #' + id);
		content.remove();
		nav.remove();
		if (actived) {
			active();
		}
	}

	return {
		add : function(id, text, closeable) {
			if (tab.find('.tab-content #' + id).length > 0) {
				this.active(id);
				return;
			}

			if (closeable == null) {
				closeable = true;
			}

			var headhtml = '<li><a data-toggle="tab" href="#' + id + '">' + (closeable ? '<button class="close closeTab">&times;</button>' : '') + text + '</a></li>';

			tab.find('.nav').append(headhtml);
			tab.find('.tab-content').append('<div id="' + id + '" class="tab-pane"></div>');

			active();

			var reference = this;

			if (closeable) {
				tab.find('.nav>li>a[href="#' + id + '"]').find('.close').click(function() {
					if (params.close) {
						params.close.call(reference, id);
					} else {
						reference.remove(id);
					}
				});
			}
		},
		active : function(id) {
			active(id);
		},
		remove : function(id) {
			remove(id);
		},
		getActiveId : function() {
			return tab.find('.tab-content .active').attr('id');
		}
	};
};