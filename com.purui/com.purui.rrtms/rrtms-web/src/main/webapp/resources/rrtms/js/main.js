var com = {};
com.rrtms = {};
com.rrtms.system = {};
// 用户个人信息
var user = null;

bootbox.setDefaults({
	locale : 'zh_CN'
});

$.ajax({
	url : 'system/current',
	cache : false,
	async : false,
	error : function(e) {
		handleError(e);
	},
	success : function(response) {
		handleResult(response, true);
		user = response;

		var stationCache = {};
		if (user.stations) {
			user.stations.forEach(function(station) {
				stationCache[station.code] = station;
			});
		}
		user.stationCache = stationCache;
	}
});
// 设置用户信息
$('.user-info').html('<small>Welcome,</small>' + user.name);
$('.nav-user-photo').attr('alt', user.name + '\'s photo');

if (!user.stations || user.stations.length <= 1) {
	$('.nav.nav-list>li:first-child').remove();
}

sideMenu.eventSideNav();

$('.nav.nav-list>li:first-child>a').trigger('click');

$('.link-logout').click(function(e) {
	e.preventDefault();
	window.location.href = 'logout?' + new Date().getTime();
});

$('#warning-configure-modal-form .btn-cancel').click(function() {
	$('#warning-configure-modal-form form')[0].reset();

	$('#warning-configure-modal-form input[type="hidden"]').val('');
});

$('#warning-configure-modal-form .btn-okay').click(function() {
	var obj = $('#warning-configure-modal-form form').serializeObject();

	if (!$.trim(obj.note)) {
		bootbox.alert('请输入备注！');
		return;
	}

	if (obj.date) {
		obj.date = new Date(parseInt(obj.date));
	} else {
		delete obj.date;
	}

	obj.note += ' @' + user.name;

	$.ajax({
		url : 'system/warning/configwarning',
		cache : false,
		type : 'POST',
		data : obj,
		error : handleError,
		success : function(response) {
			handleResult(response);

			if (response.hasOwnProperty('status') && response.status == "SUCCESS") {
				if ($.stationDist) {
					$.stationDist.removeWarning(obj.code);
				}

				$('#warning-configure-modal-form').modal('hide');

				$('#warning-configure-modal-form form')[0].reset();
				$('#warning-configure-modal-form input[type="hidden"]').val('');
			}
		}
	});
});

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
		url : 'login',
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

$(document).off('click', '.right-panel>div:first-child').on('click', '.right-panel>div:first-child', function() {
	if ($(this).next().css('display') == 'none') {
		$(this).parent().width(300);
		$(this).next().show();
	} else {
		$(this).parent().width(51);
		$(this).next().hide();
	}
});