$(function() {

	window.com = window.com || {};
	window.com.rrtms = window.com.rrtms || {};
	window.com.rrtms.system = window.com.rrtms.system || {};
	window.com.rrtms.system.loadresponse = window.com.rrtms.system.loadresponse || {};

	com.rrtms.system.loadresponse.Detail = function(guid) {
		this.guid = guid;

		if (!guid) {
			alert('缺少参数！');
			return;
		}
		this.init();
	};

	com.rrtms.system.loadresponse.Detail.prototype = {
		destroy : function() {
		},
		init : function() {
			this.prepare();
			this.initBasicInfo();
			this.initChart();
			this.initInstructionResult();
			this.initResponseGrid();
			this.initCompareGrid();
			this.subscribeStep();
		},
		initCompareGrid : function() {
			var reference = this;

			this.compareGrid = $('#compare-grid').kendoGrid({
				sortable : true,
				resizable : true,
				height : 200,
				selectable : 'multiple',
				columns : [ {
					field : 'stationName',
					title : '企业名称'
				}, {
					field : 'cronNo',
					title : '企业用户号'
				}, {
					field : 'baseValue',
					title : '基准值',
					template : function(item) {
						if (item.baseValue) {
							return item.baseValue.toFixed(3);
						} else {
							return '';
						}
					}
				}, {
					field : 'changeValue',
					title : '预降值',
					template : function(item) {
						if (item.baseValue) {
							return (item.baseValue * reference.instruction.percent / 100).toFixed(3);
						} else {
							return '';
						}
					}
				}, {
					field : '',
					title : '实际降值'
				} ]
			}).data('kendoGrid');

			if (reference.instruction && reference.instruction.details) {
				var dataSource = new kendo.data.DataSource({
					data : reference.instruction.details
				});
				this.compareGrid.setDataSource(dataSource);
			}
		},
		initResponseGrid : function() {
			var reference = this;

			this.responseGrid = $('#response-info-grid').kendoGrid({
				sortable : true,
				resizable : true,
				height : 200,
				selectable : 'multiple',
				columns : [ {
					field : 'companyName',
					title : '企业名称'
				}, {
					field : 'job.consNo',
					title : '企业用户号'
				}, {
					field : 'job.startDate',
					title : '开始执行时间',
					template : function(item) {
						if (item.job && item.job.startDate) {
							return dateTimeFormat(new Date(item.job.startDate));
						} else {
							return '';
						}
					}
				}, {
					field : 'job.opTime',
					title : '执行耗时（秒）'
				}, {
					field : 'finished',
					title : '状态',
					template : function(item) {
						if (item.job.finished) {
							return '完成';
						} else {
							return '未完成';
						}
					}
				}, {
					field : '',
					title : '降负荷值（KW）',
					template : function(item) {
						return (item.job.beforeValue - item.job.afterValue).toFixed(3);
					}
				}, {
					field : 'job.completeRate',
					title : '完成率（%）',
					template : function(item) {
						if (item.job.completeRate) {
							return item.job.completeRate.toFixed(2);
						} else {
							return "";
						}
					}
				}, {
					field : 'job.evalNode',
					title : '预演方案说明',
					template : function(item) {
						if (item.job && item.job.evalNode) {
							if (item.job.evalNode.length > 20) {
								return '<span class="btn btn-sm" data-rel="popover" data-placement="bottom" data-content="' + item.job.evalNode + '">查看</span>';
							} else {
								return item.job.evalNode;
							}
						} else {
							return '';
						}
					}
				}, {
					field : '',
					title : '执行方案详细说明',
					template : function(item) {
						var buffer = [];
						buffer.push('执行之前：' + item.job.beforeValue.toFixed(3));
						buffer.push('执行之后：' + item.job.afterValue.toFixed(3));
						buffer.push('执行时间：' + item.job.opTime + ' 秒');
						return '<span class="btn btn-sm" data-rel="popover" data-placement="bottom" data-content="' + buffer.join('<br>') + '">查看</span>';
					}
				} ]
			}).data('kendoGrid');

			$.ajax({
				url : '../../../system/loadresponse/loadResponsesolution/' + reference.instruction.guid,
				error : handleError,
				success : function(response) {

					var dataSource = new kendo.data.DataSource({
						data : response
					});

					if (reference.responseGrid) {
						reference.responseGrid.setDataSource(dataSource);
						// reference.responseGrid.refresh();
					}

					$('[data-rel=popover]').popover({
						html : true
					});

					response.forEach(function(item) {
						var val = (item.job.beforeValue - item.job.afterValue).toFixed(3);
						var compareTr = $('#compare-grid').find('tr:contains("' + item.job.consNo + '")');
						compareTr.find('td:nth-child(5)').text(val);
					});
					console.log('response', response);
					// percent
					var status = reference.calcStatus();
					switch (status.status) {
					case 0:
						// 未开始
						$('#chart-percent').attr('data-percent', 0);
						$('#chart-percent .percent').html(0);
						break;
					case 1:
						// 实施中
						$('#chart-percent-title').text('企业响应率');
						var percent = parseInt(response.length / reference.instruction.details.length * 100);
						$('#chart-percent').attr('data-percent', percent);
						$('#chart-percent .percent').html(percent);
						break;
					case 2:
						// 完成
						var trs = $('#compare-grid .k-grid-content').find('tr');
						var len = trs.length;
						var totalPercent = 0;
						for (var i = 0; i < len; i++) {
							var actualVal = parseFloat($(trs[i]).find('td:nth-child(5)').text());
							var forecaseVal = parseFloat($(trs[i]).find('td:nth-child(4)').text());
							totalPercent += actualVal / forecaseVal;
						}
						var percent = totalPercent / len;

						var responsePercent = response.length / reference.instruction.details.length;

						percent = parseInt((percent + responsePercent) / 2 * 100);
						$('#chart-percent').attr('data-percent', percent);
						$('#chart-percent .percent').html(percent);
						break;
					}
					reference.initEasyChart();
				}
			});
		},
		initInstructionResult : function() {
			var status = this.calcStatus();
			if (status.status == 0) {
				console.log(status.text);
				return;
			}

			$.ajax({
				url : '../../../system/loadresponse/instructionresultinfo/' + this.instruction.guid,
				error : handleError,
				success : function(response) {
					if (response.hasOwnProperty('status')) {
						message.error(response.message);
						return;
					}

					var buffer = [];
					response.forEach(function(e) {
						buffer.push('<li class="item-blue clearfix"><span class="blue" style="margin-right: 10px;">' + e.stationName + '</span><span class="lbl">' + e.content
								+ '</span><span class="pull-right">' + dateTimeFormat(new Date(e.atTime)) + '</span></li>');
					});

					if (buffer.length > 0) {
						$('#tasks').html(buffer.join(''));
					}

					$('#tasks').slimScroll({
						height : '300px'
					});
				}
			});
		},
		initEasyChart : function() {
			$('.easy-pie-chart.percentage').each(function() {
				var $box = $(this).closest('.infobox');
				var barColor = $(this).data('color') || (!$box.hasClass('infobox-dark') ? $box.css('color') : 'rgba(255,255,255,0.95)');
				var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
				var size = parseInt($(this).data('size')) || 50;
				$(this).easyPieChart({
					barColor : barColor,
					trackColor : trackColor,
					scaleColor : false,
					lineCap : 'butt',
					lineWidth : parseInt(size / 10),
					animate : /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
					size : size
				});
			});
		},
		prepare : function() {
			var reference = this;

			$.ajax({
				url : '../../../system/loadresponse/instruction/' + this.guid,
				async : false,
				error : handleError,
				success : function(response) {
					if (!response.guid) {
						alert('没有找到数据！');
						return;
					}
					reference.instruction = response;
					console.log('instruction', response);
				}
			});
		},
		initChart : function() {
			if (this.calcStatus().status == 2) {
				$('#chart').closest('.widget-box').parent().remove();
				return;
			}
			this.chart = new Highcharts.Chart({
				chart : {
					type : 'spline',
					animation : true, // don't animate in old IE
					renderTo : 'chart',
					height : 230,
					zoomType : 'y',
				},
				title : {
					text : ' '
				},
				xAxis : {
					type : 'datetime',
					tickPixelInterval : 150
				},
				yAxis : {
					title : {
						text : 'KW'
					},
					plotLines : [ {
						value : 0,
						width : 1,
						color : '#808080'
					} ]
				},
				tooltip : {
					formatter : function() {
						return '<b>' + this.series.name + '</b><br/>' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' + Highcharts.numberFormat(this.y, 2);
					}
				},
				legend : {
					enabled : false
				},
				exporting : {
					enabled : false
				},
				series : [ {
					name : this.instruction.areaName + '-实时负荷',
				} ]
			});

			var reference = this;

			// TODO 是否需要加参数--tradeEnable
			this.chartLoop = setInterval(function() {
				$.ajax({
					url : '../../../system/loadresponse/areaload',
					type : 'POST',
					data : {
						areaName : reference.instruction.areaName
					},
					error : function(e) {
						handleError(e);
						if (reference.chartLoop) {
							clearInterval(reference.chartLoop);
						}
					},
					success : function(response) {
						if (!response[0].areaName) {
							console.log('出错了！', response);
							if (reference.chartLoop) {
								clearInterval(reference.chartLoop);
							}
							return;
						}

						reference.chart.series[0].addPoint([ (new Date()).getTime(), response[0].loadData.realtimeSumValue ], true, reference.chart.series[0].data.length > 12);
					}
				});
			}, 1000);
		},
		initBasicInfo : function() {
			$('#td-guid').html(this.instruction.guid);
			$('#td-area-name').html(this.instruction.areaName);
			$('#td-base-day').html(dateFormat(parseDate(this.instruction.startDate)) + ' ~ ' + dateFormat(parseDate(this.instruction.endDate)));
			$('#td-percent').html(this.instruction.percent + ' %');
			$('#td-user-name').html(this.instruction.userName);
			$('#td-apply-day').html(dateTimeFormat(new Date(this.instruction.applyStartDate)) + ' ~ ' + dateTimeFormat(new Date(this.instruction.applyEndDate)));
			$('#td-status').html(this.calcStatus().text);
			$('#td-insert-time').html(dateTimeFormat(new Date(this.instruction.insertTime)));
		},
		calcStatus : function() {
			var curTimestamp = new Date().getTime();
			if (curTimestamp > this.instruction.applyEndDate) {
				return {
					status : 2,
					text : '完成'
				};
			} else {
				if (this.instruction.applyStartDate > curTimestamp) {
					return {
						status : 0,
						text : '未开始'
					};
				} else {
					return {
						status : 1,
						text : '实施中'
					};
				}
			}
		},
		subscribeStep : function() {
			if (this.calcStatus().status != 1) {
				return;
			}

			// TODO 解析执行步骤
			this.ws = new com.component.WebSocket({
				onmessage : function(event) {
					console.log(event.data);
				}
			});

			this.ws.subscribe([ 'FuHeExcInfo.' + this.instruction.guid ]);

		}
	};
});
