window.generic = window.generic || {};

generic.Message = function() {
	this.systeminfos = ko.observableArray([]);
	this.warninginfos = ko.observableArray([]);
	this.stopinfos = ko.observableArray([]);

	this.user = JSON.parse(plus.storage.getItem('user'));

	this.init();
};

generic.Message.prototype = {
	init : function() {
		this.initComponent();
	},
	initComponent : function() {
		this.loadSystemInfoData();
		this.loadWarningInfoData();
		this.loadStopinfoData();
	},
	loadStopinfoData : function() {
		(function(reference) {
			var data = {
				orderBy : 'START_DATE',
				sortBy : 'DESC',
				count : 10,
				available : true,
				skip : reference.stopinfos().length
			};
			generic.ajax({
				url : generic.variables.url.LINE_STOP,
				data : data,
				final : function(response) {
					console.log(JSON.stringify(response));
					document.querySelector('.stopinfo-count').firstChild.nodeValue = '（' + response.maxCount + '）';
					response.data.forEach(function(e) {
						e._startDate = dateTimeFormat(new Date(e.startDate));
						e._endDate = dateTimeFormat(new Date(e.endDate));
						var buffer = [];
						e.companys.forEach(function(c) {
							buffer.push(c.companyName);
						});
						e._companys = buffer.join('<br><br>');
						e._companys = '<h5>' + e._companys + '</h5>';
					});
					reference.stopinfos(reference.stopinfos().concat(response.data));
					
					if (mui.currentWebview && !mui.currentWebview.isVisible()){
						mui.currentWebview.show();
					}
					
					// more button
					if (response.skip + response.data.length < response.maxCount) {
						if (!document.querySelector('.btn-more-stopinfo')) {
							var div = document.createElement('div');
							div.innerHTML = '<li><button class="btn-more-stopinfo mui-btn mui-btn-positive mui-btn-block">更多</button></li>';
							document.querySelector('#stopinfo>ul').appendChild(div.firstChild);

							document.querySelector('.btn-more-stopinfo').addEventListener('click', function() {
								reference.loadStopinfoData();
							});
						}
						
						document.querySelector('.btn-more-stopinfo').innerHTML = '更多（' + (response.maxCount - response.skip - response.data.length) + '/' + response.maxCount + '）';
					} else {
						var _btn = document.querySelector('.btn-more-stopinfo');
						if (_btn) {
							_btn.remove();
						}
					}
				}
			});
		})(this);
	},
	loadWarningInfoData : function() {
		(function(reference) {
			var today = new Date();
			var data = {
				code : (function() {
					var codes = [];
					reference.user.stations.forEach(function(station) {
						codes.push(station.code);
					});
					return codes;
				})(),
				startDate : new Date(today.getTime() - 86400000),
				endDate : new Date(today.getTime() + 86400000),
				orderBy : 'atTime',
				sortBy : 'DESC',
				count : 10,
				skip : reference.warninginfos().length
			};
			console.log(JSON.stringify(data));
			generic.ajax({
				url : generic.variables.url.WARNING_HISTORY,
				traditional : true,
				data : data,
				final : function(response) {
					document.querySelector('.warninginfo-count').firstChild.nodeValue = '（' + response.maxCount + '）';
					response.data.forEach(function(warn) {
						warn.warnContent = warn.warnContent.replace(/,/g, '</h5><h5>');
						warn.warnContent = '<h5>' + warn.warnContent + '</h5>';
						if (warn.configTime > 946684800000){
							warn.warnContent += '<h5 style="color : #0f0;">确认时间：' + dateTimeFormat(new Date(warn.configTime)) + '</h5>';
							warn.warnContent += '<h5 style="color : #0f0;">' + warn.note + '</h5>';
						}
						warn.date = dateTimeFormat(new Date(warn.atTime));
					});
					reference.warninginfos(reference.warninginfos().concat(response.data));

					// more button
					if (response.skip + response.data.length < response.maxCount) {
						if (!document.querySelector('.btn-more-warninginfo')) {
							var div = document.createElement('div');
							div.innerHTML = '<li><button class="btn-more-warninginfo mui-btn mui-btn-positive mui-btn-block">更多</button></li>';
							document.querySelector('#warninginfo>ul').appendChild(div.firstChild);

							document.querySelector('.btn-more-warninginfo').addEventListener('click', function() {
								reference.loadWarningInfoData();
							});
						}
						
						document.querySelector('.btn-more-warninginfo').innerHTML = '更多（' + (response.maxCount - response.skip - response.data.length) + '/' + response.maxCount + '）';
					} else {
						var _btn = document.querySelector('.btn-more-warninginfo');
						if (_btn) {
							_btn.remove();
						}
					}

				}
			});
		})(this);
	},
	loadSystemInfoData : function() {
		var data = {
			sortBy : 'insertTime',
			orderBy : 'DESC',
			count : 10,
			skip : this.systeminfos().length
		}, reference = this;

		generic.ajax({
			url : generic.variables.url.MESSAGE_LIST,
			data : data,
			final : function(response) {
				document.querySelector('.systeminfo-count').firstChild.nodeValue = '（' + response.maxCount + '）';
				response.data.forEach(function(e) {
					e.date = dateTimeFormat(new Date(e.insertTime));
				});
				reference.systeminfos(reference.systeminfos().concat(response.data));
				
				// more button
				if (response.skip + response.data.length < response.maxCount) {
					if (!document.querySelector('.btn-more-systeminfo')) {
						var div = document.createElement('div');
						div.innerHTML = '<li><button class="btn-more-systeminfo mui-btn mui-btn-positive mui-btn-block">更多</button></li>';
						document.querySelector('#systeminfo>ul').appendChild(div.firstChild);

						document.querySelector('.btn-more-systeminfo').addEventListener('click', function() {
							reference.loadWarningInfoData();
						});
					}
					
					document.querySelector('.btn-more-systeminfo').innerHTML = '更多（' + (response.maxCount - response.skip - response.data.length) + '/' + response.maxCount + '）';
				} else {
					var _btn = document.querySelector('.btn-more-systeminfo');
					if (_btn) {
						_btn.remove();
					}
				}
			}
		});
	}
};
