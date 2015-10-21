$(function() {
	// variables
	$.GRID_HEIGHT = 400;
	$.TAB_HEIGHT = 400;
	$.TREE_HEIGHT = 400;
	$.STATION_DIST_TIME_OUT = 10 * 1000;
	$.CONSOLE_MAX_COUNT = 500;

	if ($.fn.datepicker && $.fn.datepicker.defaults) {
		$.fn.datepicker.defaults.format = 'yyyy-mm-dd';
		$.fn.datepicker.defaults.language = 'zh-CN';
	}

	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [ o[this.name] ];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	$.upload = function(params) {
		var xhr = new XMLHttpRequest();
		var formData = new FormData($(params.form)[0]);
		$('.progress').attr('data-percent', '0%');
		$('.progress-bar').width('0%');
		$("#status").html("");
		xhr.upload.addEventListener("progress", function(event) {
			var p = Math.round(event.loaded * 100 / event.total) + "%";
			$('.progress').attr('data-percent', p);
			$('.progress-bar').width(p);
		}, false);
		xhr.addEventListener("load", function(data) {
			$('.progress').attr('data-percent', '100%');
			$('.progress-bar').width('100%');
			var rst = JSON.parse(data.target.response);
			var message = rst.message;
			if (rst.status != 'SUCCESS') {
				message = "错误： " + message;
				params.error(rst);
			} else {
				params.success(rst);
			}
			$("#status").html(message);
			if (params.done) {
				params.done(rst);
			}

		}, false);
		xhr.addEventListener("error", function(data) {
			alert(data.response);
		}, false);
		xhr.open(params.type, params.url);
		xhr.send(formData);
	};

	if (window.kendo) {
		kendo.culture('zh-CN');
	}

	if (window.Highcharts) {
		Highcharts.theme = {
			colors : [ '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4' ],
			chart : {
				backgroundColor : {
					linearGradient : {
						x1 : 0,
						y1 : 0,
						x2 : 1,
						y2 : 1
					},
					stops : [ [ 0, 'rgb(255, 255, 255)' ], [ 1, 'rgb(240, 240, 255)' ] ]
				},
				borderWidth : 2,
				plotBackgroundColor : 'rgba(255, 255, 255, .9)',
				plotShadow : true,
				plotBorderWidth : 1
			},
			title : {
				style : {
					color : '#000',
					font : 'bold 16px "Trebuchet MS", Verdana, sans-serif'
				}
			},
			subtitle : {
				style : {
					color : '#666666',
					font : 'bold 12px "Trebuchet MS", Verdana, sans-serif'
				}
			},
			xAxis : {
				gridLineWidth : 1,
				lineColor : '#000',
				tickColor : '#000',
				labels : {
					style : {
						color : '#000',
						font : '11px Trebuchet MS, Verdana, sans-serif'
					}
				},
				title : {
					style : {
						color : '#333',
						fontWeight : 'bold',
						fontSize : '12px',
						fontFamily : 'Trebuchet MS, Verdana, sans-serif'

					}
				}
			},
			yAxis : {
				minorTickInterval : 'auto',
				lineColor : '#000',
				lineWidth : 1,
				tickWidth : 1,
				tickColor : '#000',
				labels : {
					style : {
						color : '#000',
						font : '11px Trebuchet MS, Verdana, sans-serif'
					}
				},
				title : {
					style : {
						color : '#333',
						fontWeight : 'bold',
						fontSize : '12px',
						fontFamily : 'Trebuchet MS, Verdana, sans-serif'
					}
				}
			},
			legend : {
				itemStyle : {
					font : '9pt Trebuchet MS, Verdana, sans-serif',
					color : 'black'

				},
				itemHoverStyle : {
					color : '#039'
				},
				itemHiddenStyle : {
					color : 'gray'
				}
			},
			labels : {
				style : {
					color : '#99b'
				}
			},

			navigation : {
				buttonOptions : {
					theme : {
						stroke : '#CCCCCC'
					}
				}
			}
		};

		// Apply the theme
		Highcharts.setOptions(Highcharts.theme);
		Highcharts.setOptions({
			global : {
				useUTC : false
			},
			lang : {
				weekdays : [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ],
				months : [ '01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月' ],
				shortMonths : [ '01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月' ],
				printChart : '打印',
				downloadJPEG : '下载 JPEG 格式',
				downloadPDF : '下载 PDF 格式',
				downloadPNG : '下载 PNG 格式',
				downloadSVG : '下载 SVG 格式'
			},
			exporting : {
				url : function() {
					return 'http://' + window.location.hostname + ':8080/export/';
				}(),
				buttons : {
					contextButton : {
						align : 'left'
					}
				}
			}
		});
	}

});

function handleError(e) {
	console.error('handleError>>', e);
	bootbox.alert(e.status + " - " + (e.statusText || e.message));
	if (e.message) {
		if (e.message == '没有登录或者超时！') {
			setTimeout(function() {
				window.location.reload();
			}, 1000);
		} else if (e.message == '您已在其它地方登录！') {
			console.log('pop up login page');
			$('#login-modal-form').modal('show');
		}
	}

}
function handleResult(response, ignoreSuccess) {
	var title = null;
	var className = null;
	var icon = null;

	if (response.hasOwnProperty('status')) {
		if (response.status == 'SUCCESS') {
			if (ignoreSuccess) {
				console.log('成功！ 忽略提示');
				return;
			}
			title = '成功';
			className = 'gritter-success';
			icon = 'icon-ok';
		} else if (response.status == 'ERROR') {
			title = '错误';
			className = 'gritter-error';
			icon = 'icon-remove';
		} else if (response.status == 'FAILURE') {
			title = '失败';
			className = 'gritter-warning';
			icon = 'icon-remove';
		} else {
			bootbox.alert('未知状态-' + response.status);
			console.log(response);
			return;
		}

		$.gritter.add({
			title : title,
			text : '<i class=' + icon + '></i>\r\n' + response.message,
			class_name : className + ' gritter-center',
			time : response.status == 'ERROR' ? 2000 : 1000
		});

		if (response.message == '没有登录或者超时！') {
			setTimeout(function() {
				window.location.reload();
			}, 1000);
		} else if (response.message == '您已在其它地方登录！') {
			$('#login-modal-form').modal('show');
			console.log('pop up login page');
		}

	}
}

(function(message) {
	if (message.success) {
		return;
	}
	window.message = {
		success : function(msg) {
			$.gritter.add({
				title : '',
				text : '<i class="icon-ok"></i>\r\n' + msg,
				class_name : 'gritter-success gritter-center',
				time : 1000
			});
		},
		error : function(msg) {
			$.gritter.add({
				title : '',
				text : '<i class="icon-remove"></i>\r\n' + msg,
				class_name : 'gritter-error gritter-center',
				time : 3000
			});
		},
		warning : function(msg) {
			$.gritter.add({
				title : '',
				text : '<i class="icon-remove"></i>\r\n' + msg,
				class_name : 'btn-warning gritter-center',
				time : 2000
			});
		}
	};
})(window.message || {});

function getOrderBy(sort) {
	if (sort) {
		if (sort[0]) {
			return sort[0].field;
		}
	}
}
function getSortBy(sort) {
	if (sort) {
		if (sort[0]) {
			return sort[0].dir;
		}
	}
}
function getSelectedItem(grid) {
	var data = new Array();
	var i = 0;
	grid.select().each(function() {
		data[i] = grid.dataItem(this);
		i++;
	});
	return data;
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

function isAdmin() {
	if (!user || !user.securityUser) {
		return false;
	}

	for (var i = 0; i < user.securityUser.roles.length; i++) {
		if (user.securityUser.roles[i].name == 'administrator') {
			return true;
		}
	}

	return false;
}

function getParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}