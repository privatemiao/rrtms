window.generic = window.generic || {};
generic.dataPointHistory = function() {
	this.dataPoint = JSON.parse(plus.storage.getItem('dataPoint'));
	var point = JSON.parse(plus.storage.getItem('currentPoint'));
	this.code = point.currentId.split('_')[0];
	this.$chart = document.querySelector('#chart');
	this.init();
};
generic.dataPointHistory.prototype = {
	init : function() {
		console.log('init dataPointHistory...');
		this.loadHistory();
		this.eventComponent();
	},
	loadHistory : function(startDate, endDate) {
		if (endDate == null) {
			endDate = new Date();
		}

		if (startDate == null) {
			startDate = new Date(endDate.getTime() - 86400000);
		}

		var data = {
			startDate : startDate,
			endDate : endDate,
			guid : this.dataPoint.guid
		}, url = generic.variables.url.DATAPOINT_HISTORY.replace('{code}', this.code);

		console.log('prepare ajax>>' + url + '>>' + JSON.stringify(data));

		(function(reference) {
			generic.waiting.show();
			generic.ajax({
				url : url,
				data : data,
				final : function(response) {
					console.log('response>>' + JSON.stringify(response));
					var labels = [], vals = [], count = 1;
					response.forEach(function(e) {
						labels.push(dateTimeFormat(new Date(e.atTime)));
						// labels.push(count++);
						vals.push(parseFloat(e.tagValue.toFixed(2)));
					});

					if (reference.chart && reference.chart.destroy) {
						console.log('destroy chart...');
						reference.chart.destroy();
						reference.chart == null;
					}

					reference.$chart.setAttribute('width', labels.length * 20);
					reference.$chart.setAttribute('height', plus.display.resolutionHeight - 60);

					reference.chart = new Chart(reference.$chart.getContext('2d')).Line({
						labels : labels,
						datasets : [ {
							label : "My First dataset",
							fillColor : "rgba(220,220,220,0.2)",
							strokeColor : "rgba(220,220,220,1)",
							pointColor : "rgba(220,220,220,1)",
							pointStrokeColor : "#fff",
							pointHighlightFill : "#fff",
							pointHighlightStroke : "rgba(151,187,205,1)",
							data : vals
						} ]
					}, {
						animation : false
					});
					generic.waiting.hide();
				}
			});
		})(this);
	},
	eventComponent : function() {
		document.querySelector('#startDate').addEventListener('click', function() {
			(function(reference) {
				plus.nativeUI.pickDate(function(e) {
					var d = e.date;
					reference.value = dateFormat(d);
				}, function(e) {
				});
			})(this);
		});

		document.querySelector('#endDate').addEventListener('click', function() {
			(function(reference) {
				plus.nativeUI.pickDate(function(e) {
					var d = e.date;
					reference.value = dateFormat(d);
				}, function(e) {
				});
			})(this);
		});

		(function(reference) {
			document.querySelector('#btn-okay').addEventListener('click', function() {
				var startDate = document.querySelector('#startDate').value;
				var endDate = document.querySelector('#endDate').value;

				if (endDate.trim() === '' && startDate.trim() === '') {
					startDate = null;
					endDate = null;
				} else {
					if (endDate.trim() === '') {
						endDate = new Date();
					} else {
						endDate = parseDate(endDate.trim());
					}

					if (startDate.trim() === '') {
						startDate = new Date(endDate.getTime() - 86400000);
					} else {
						startDate = parseDate(startDate.trim());
					}

					if (endDate.getTime() > parseDate(dateFormat(new Date())).getTime()) {
						generic.message.alert('结束日期不能大于当前日期！');
						return;
					}

					if (startDate.getTime() > endDate.getTime()) {
						generic.message.alert('开始日期不能大于结束日期！');
						return;
					}
					if (startDate.getFullYear() + startDate.getMonth() != endDate.getFullYear() + endDate.getMonth()) {
						generic.message.alert('不能跨越搜索！');
						return;
					}
				}
				mui('#mui-popover').popover('toggle');
				reference.loadHistory(startDate, endDate);
			});
		})(this);

		//plus.screen.unlockOrientation();
		document.querySelector('a.mui-icon-left-nav').addEventListener('click', function(){
			console.log('解除锁屏');
			plus.screen.unlockOrientation();
			mui.back();
		});
	}
};