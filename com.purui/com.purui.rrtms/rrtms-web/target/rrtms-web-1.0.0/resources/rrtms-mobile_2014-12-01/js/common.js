Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for (var i = 0, len = this.length; i < len; i++) {
		if (this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}

window.generic = window.generic || {};
generic.variables = generic.variables || {};
generic.variables.HOST = '222.92.76.46';
generic.variables.HOST_URL = 'http://' + generic.variables.HOST;
generic.variables.url = generic.variables.url || {
	LOGIN : generic.variables.HOST_URL + '/login',
	CURRENT_USER : generic.variables.HOST_URL + '/system/current',
	AREA_LOAD : generic.variables.HOST_URL + '/system/loadresponse/areaload',
	MESSAGE_LIST : generic.variables.HOST_URL + '/system/message/list',
	WARNING_HISTORY : generic.variables.HOST_URL + '/system/warning/history',
	LINE_STOP : generic.variables.HOST_URL + '/system/powerstopinfo/queryline',
	PLATFORM_STATUS : generic.variables.HOST_URL + '/system/platformstatus',
	STATION_COUNT : generic.variables.HOST_URL + '/system/stationcount',
	STATION_STATUS : generic.variables.HOST_URL + '/system/station/{code}/run',
	POINTS : generic.variables.HOST_URL + '/system/station/{code}/points',
	STATION_HIERARCHY : generic.variables.HOST_URL + '/system/station/{code}/datapointhierarchy',
	GET_REDIS_DATA : generic.variables.HOST_URL + '/getredisdata',
	COMPARE_ENERGY : generic.variables.HOST_URL + '/system/analysis/energy/compare',
	COMPARE_LOAD : generic.variables.HOST_URL + '/system/analysis/load/compare'
};

generic.ajax = function(obj) {
	var option = {
		beforeSend : function() {
			generic.waiting.show();
		},
		error : function(e) {
			generic.waiting.hide();
			generic.message.error(e.status + " - " + (e.statusText || e.message));
		},
		type : 'POST',
		dataType : 'json',
		success : function(response) {
			if (response.hasOwnProperty('status')) {
				if (response.status == 'ERROR' || response.status == 'FAILURE') {
					generic.message.failure(response.message);

					if (response.message == '没有登录或者超时！' || response.message == '您已在其它地方登录！') {
						mui.openWindow({
							url : 'login.html'
						});
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
			if (plus) {
				plus.nativeUI.closeWaiting();
			}
		}
	};
	if (window.jQuery) {
		$.ajax($.extend(option, obj));
	} else {
		mui.ajax(mui.extend(option, obj));
	}
};

generic.message = generic.message || {
	error : function(msg) {
		mui.toast(msg, '错误');
	},
	failure : function(msg) {
		mui.toast(msg, '失败');
	},
	alert : function(msg) {
		mui.toast(msg, '提示');
	},
	success : function(msg) {
		mui.toast(msg, '成功');
	}
};

generic.showWaiting = function() {
	if (plus) {
		plus.nativeUI.showWaiting();
	}
};

generic.openWindow = function(href) {
	generic.waiting.show();
	mui.openWindow({
		url : href,
		show : {
			autoShow : false
		}
	});
};

generic.waiting = generic.waiting || {
	show : function() {
		if (plus) {
			plus.nativeUI.showWaiting();
		}
	},
	hide : function() {
		if (plus) {
			plus.nativeUI.closeWaiting();
		}
	}
};

generic.showPage = function() {
	// plus.webview.currentWebview()
	if (plus && plus.webview) {
		generic.waiting.hide();
		plus.webview.currentWebview().show();
	}else{
		console.log('plus not ready');
	}
}

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
