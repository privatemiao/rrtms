// variables
window.generic = window.generic || {};
generic.message = generic.message || {};
generic.variables = generic.variables || {};
generic.variables.isDevice = false;
generic.variables.isAndroid = false;

generic.ajax = function(obj) {
	$.ajax($.extend({
		dataType : 'json',
		headers : {
			'X-Requested-With' : 'XMLHttpRequest'
		},
		type : 'POST',
		cache : false,
		crossDomain : true,
		async : true,
		beforeSend : function() {
			$.mobile.loading('show');
		},
		traditional : true,
		error : function(e) {
			generic.message.error(e.status + " - " + (e.statusText || e.message));
		},
		complete : function() {
			$.mobile.loading('hide');
		},
		success : function(response) {
			if (response.hasOwnProperty('status')) {
				if (response.status == 'ERROR' || response.status == 'FAILURE') {
					generic.message.failure(response.message);

					if (response.message == '没有登录或者超时！' || response.message == '您已在其它地方登录！') {
						generic.service.clear();
						$.mobile.changePage('#page-login');
					}

					return;
				} else {
					if (obj.hasOwnProperty('ignoreSuccess') && obj.ignoreSuccess === false) {
						generic.message.success(response.message);
					}
				}
			}

			if (obj.hasOwnProperty('final')) {
				obj.final(response);
			}
		}
	}, obj));
};

generic.message = {
	failure : function(msg) {
		console.log('FAILURE - ' + msg);
		this.alert(msg, null, 'FAILURE');
	},
	error : function(msg) {
		console.log('ERROR - ' + msg);
		this.alert(msg, null, 'ERROR');
	},
	success : function(msg) {
		console.log('SUCCESS - ' + msg);
		this.alert(msg, null, 'SUCCESS');
	},
	alert : function(msg, callback, title, btnName) {
		if (msg === undefined || msg === '') {
			return;
		}

		if (callback === undefined) {
			callback = null;
			title = 'RRTMS-MOBILE';
			btnName = '确定';
		} else if (typeof callback === 'string') {
			title = callback;
			callback = null;
			btnName = '确定';
		} else if (title === undefined) {
			title = 'RRTMS-MOBILE';
			btnName = '确定';
		} else if (btnName === undefined) {
			btnName = '确定';
		}

		if (generic.variables.isDevice) {
			navigator.notification.alert(msg, callback, title, btnName);
		} else {
			window.alert(msg);
		}
	}
};

function init() {
	if (window.device) {
		generic.variables.isDevice = true;
		switch (device.platform) {
		case 'Android':
			generic.variables.isAndroid = true;
			break;
		}
	} else {
		generic.variables.isDevice = false;
	}

	if (generic.variables.isDevice === false) {
		generic.variables.SERVER_IP = window.location.host;
	} else {
		generic.variables.SERVER_IP = '222.92.76.46';
	}

	generic.variables.url = generic.variables.url || {};
	generic.variables.url = {
		LOGIN_URL : 'http://' + generic.variables.SERVER_IP + '/login',
		AREA_LOAD : 'http://' + generic.variables.SERVER_IP + '/system/loadresponse/areaload',
		STATIONS_BY_USER : 'http://' + generic.variables.SERVER_IP + '/system/station/stationsbyuser',
		WEBSOCKET_URL : 'ws://' + generic.variables.SERVER_IP + '/ws',
		WARNING_TYPES : 'http://' + generic.variables.SERVER_IP + '/system/warntypes',
		WARNING_HISTORY : 'http://' + generic.variables.SERVER_IP + '/system/warning/history',
		CURRENT_USER : 'http://' + generic.variables.SERVER_IP + '/system/current',
		COMPARE_ENERGY : 'http://' + generic.variables.SERVER_IP + '/system/analysis/energy/compare',
		COMPARE_LOAD : 'http://' + generic.variables.SERVER_IP + '/system/analysis/load/compare',
		MESSAGE_PUBLISH : 'http://' + generic.variables.SERVER_IP + '/system/message/publish',
		MESSAGE_LIST : 'http://' + generic.variables.SERVER_IP + '/system/message/list'
	};

	if (window.Highcharts) {
		Highcharts.setOptions({
			global : {
				useUTC : false
			}
		});

	}
}
/*
 * ====================================================================
 * ----------------------public method---------------------------------
 * ====================================================================
 */
function dateFormat(date) {
	if (!date) {
		return null;
	}

	var year = date.getFullYear(), month = date.getMonth() + 1, date = date.getDate();

	return year + '-' + (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date);
}

function parseDate(str) {
	var d = new Date(str);
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0);
	return d;
}

function parseTime(str) {
	var a = str.split(':');
	return a[0] * 60 * 60 * 1000 + a[1] * 60 * 1000 + a[2] * 1000;
}
// 2014-12-12 14:12:33
function parseDateTime(str) {
	var a = str.split(' ');
	var d = parseDate(a[0]);
	var s = parseTime(a[1]);

	return new Date(d.getTime() + s);
}

function dateTimeFormat(date) {
	if (!date) {
		return null;
	}

	var year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
	return year + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day) + ' ' + (hours > 9 ? hours : '0' + hours) + ':' + (minutes > 9 ? minutes : '0' + minutes) + ':'
			+ (seconds > 9 ? seconds : '0' + seconds);
}

function showKeyboard() {
	if (generic.variables.isAndroid) {
		cordova.plugins.SoftKeyboard.show();
	}
}

$(function() {
	if ($.datepicker) {

		$.datepicker.setDefaults({
			// Default regional settings
			closeText : "Done", // Display text for close link
			prevText : "上个月", // Display text for previous month link
			nextText : "下个月", // Display text for next month link
			currentText : "今天", // Display text for current month link
			monthNames : [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
			monthNamesShort : [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
			dayNames : [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ],
			dayNamesShort : [ "日", "一", "二", "三", "四", "五", "六" ],
			dayNamesMin : [ "日", "一", "二", "三", "四", "五", "六" ],
			weekHeader : "Wk", // Column header for week of the year
			dateFormat : "yy-mm-dd", // See format options on parseDate
			firstDay : 0, // The first day of the week, Sun = 0, Mon = 1, ...
			isRTL : false, // True if right-to-left language, false if
			// left-to-right
			showMonthAfterYear : false, // True if the year select precedes
			// month, false for month then year
			yearSuffix : "" // Additional text to append to the year in the
		// month headers
		});

	}
});
