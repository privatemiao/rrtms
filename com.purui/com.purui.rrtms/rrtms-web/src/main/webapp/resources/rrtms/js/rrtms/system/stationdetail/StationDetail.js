window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.StationDetail = function() {
	this.code = $.cookie('code');
	if (!this.code) {
		bootbox.alert('请提供站点代码！');
		return;
	}
	this.moduleIndex = {};
	this.init();
};

com.rrtms.system.StationDetail.prototype = {
	destroy : function() {
		console.log('destroy StationDetail...');
	},
	init : function() {
		var reference = this;
		this.prepareData();
		$('head>title').html(this.station.name);
		$('#station-tab .tab-content').height($(window).height() - $('#station-tab .widget-header').offset().top - $('#station-tab .widget-header').height() - 60);
		this.initComponent();
		this.eventComponent();

		$('a[tab-id=Portal]').trigger('click');
	},
	initComponent : function() {
		var reference = this;
		this.tab = new com.component.CloseableTab({
			id : 'station-tab',
			close : function(id) {
				reference.moduleIndex[id].destroy();
				reference.moduleIndex[id] = null;
				delete reference.moduleIndex[id];
				this.remove(id);
			}
		});
	},
	eventComponent : function() {
		var reference = this;

		this.eventNavbar();

		$(document).off('shown.bs.tab', 'a[data-toggle="tab"]').on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
			var id = $(e.target).attr('href').substring(1);

			$.each(reference.moduleIndex, function(key, obj) {
				if (key == id) {
					if (obj.active) {
						obj.active();
					}
				} else {
					if (obj.deactive) {
						obj.deactive();
					}
				}
			});
		});

		$(document).off('click', '.right-panel>div:first-child').on('click', '.right-panel>div:first-child', function() {
			if ($(this).next().css('display') == 'none') {
				$(this).parent().width(300);
				$(this).next().show();
			} else {
				$(this).parent().width(47);
				$(this).next().hide();
			}
		});

		this.eventRelogin();
	},
	eventRelogin : function() {

		$('#login-modal-form').on('hide.bs.modal', function() {
			$(this).find('input[name="loginId"]').val('');
			$(this).find('input[name="password"]').val('');
		});

		$('#login-modal-form .btn-login').click(function() {
			var loginId = $('#login-modal-form input[name="loginId"]').val();
			var password = $('#login-modal-form input[name="password"]').val();
			if (loginId == '' || password == '') {
				bootbox.alert('请输入用户名和密码！');
				return;
			}

			$.ajax({
				url : '../../../login',
				data : {
					loginId : loginId,
					password : password
				},
				error : function(e) {
					bootbox.alert(e.status + " - " + e.statusText);
				},
				success : function(response) {
					if (response.status == "SUCCESS") {
						message.success("登录成功！");
						$('#login-modal-form').modal('hide');
					} else {
						bootbox.alert(response.message);
					}
				}
			});
		});
	},
	eventNavbar : function() {
		var reference = this;
		$('.navbar-nav a').click(function() {
			var id = $(this).attr('tab-id');
			if (!id) {
				return;
			}
			if (reference.moduleIndex.hasOwnProperty(id)) {
				reference.tab.active(id);
				return;
			}

			if (!com.rrtms.system.hasOwnProperty(id)) {
				bootbox.alert('无法实例化 [com.rrtms.system.' + id + '].');
				return;
			}
			var obj = new com.rrtms.system[id](reference.station);
			reference.moduleIndex[id] = obj;
			reference.tab.add(id, obj.NAME, (id != 'Portal'));
			$($('#template>div.' + id).html()).appendTo($('#station-tab .tab-content #' + id));
			obj.init();
			$('#station-tab .tab-content #' + id).find('[data-rel="tooltip"]').tooltip();
		});
	},
	prepareData : function() {
		var reference = this;

		$.ajax({
			url : '../../../system/current',
			error : handleError,
			success : function(user) {
				if (user.userType != 'ENTERPRISE' && user.userType != 'INTERNAL' && user.userType != 'PROVIDER') {
					$('a[tab-id="Warning"]').parent().remove();
				}
			}
		});

		$.ajax({
			url : '../../../system/station/' + this.code + '/datapointhierarchy',
			async : false,
			cache : false,
			error : function(e) {
				handleError(e);
			},
			success : function(station) {
				reference.station = station;

				// prepare addtion data
				if (!station.points || station.points.length == 0) {
					return;
				}

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

			}
		});
	},

	//
	//
	//
	//
	//
	getOriginalTab : function() {
		return this.tab;
	}
};