if (!window.com) {
	var com = {};
}
if (!com.rrtms) {
	com.rrtms = {};
}
if (!com.rrtms.system) {
	com.rrtms.system = {};
}
com.rrtms.system.ChartDesign = function() {
	this.SIDEBAR_WIDTH = 250;
	this.variableCharts = {};
	this.code = $.cookie('code');
	if (!this.code) {
		bootbox.alert('请提供站点代码！');
		return;
	}
	this.destroy();
	this.init();
};
com.rrtms.system.ChartDesign.prototype = {
	destroy : function() {
		console.log('destroy DesignChart...');
		if (this.tree) {
			console.log('destroy tree');
			this.tree.destroy();
		}
	},
	init : function() {
		this.layout();
		this.prepareData();
		this.initComponent();
		this.eventComponent();
	},
	layout : function() {
		$('.tab-content').height($(document).innerHeight() - $('#navbar').outerHeight() - $('.widget-header').outerHeight() - 30);
		$('#datapoint-tree').height($('.tab-content').height() - 120);
		$('div.btn-zoom-group').offset({
			top : $('.tab-content').offset().top,
			left : $('.main-container-inner').width() - $('div.btn-zoom-group').width() + 9
		});		
	},
	prepareData : function() {
		var charts = [];
		var station = {};
		$.ajax({
			url : '../../../system/station/' + this.code + '/charts',
			cache : false,
			async : false,
			error : function(e) {
				handleError(e);
			},
			success : function(response) {
				charts = response;
			}
		});
		this.charts = charts;

		$.ajax({
			// url : '../../../system/station/stationbycode/' + this.code,
			url : '../../../system/station/' + this.code + '/datapointhierarchy',
			cache : false,
			async : false,
			error : function(e) {
				handleError(e);
			},
			success : function(response) {
				station = response;
			}
		});
		this.station = station;
	},
	initComponent : function() {
		var reference = this;
		this.initTree();
		this.tab = new com.component.CloseableTab({
			id : 'chart-tab',
			close : function(id) {
				var tab = this;
				reference.closeTab.call(reference, id);
			}
		});
		this.dataPointTree = new com.component.DataPointTree({
			id : [ 'datapoint-select-modal', 'datapoint-tree' ],
			imagePath : "../../../resources/dhtmlx/tree/imgs/csh_dhx_skyblue/",
			station : this.station,
			onClick : function(id) {
				console.log(reference.dataPointTree.getUserData(id));
			}
		});

		this.ws = new com.component.WebSocket({
			onmessage : function(event) {
				console.log(event.data);
				var data = JSON.parse(event.data);
				if (!data.hasOwnProperty("TagID")) {
					return;
				}

				var canvas = reference.getCurrentCanvas();
				if (!canvas) {
					reference.unsubscribe();
					return;
				}
				var figure = canvas.getFigure(data.TagID);
				if (!figure) {
					console.log('没有找到 figure ', data.TagID);
					return;
				}

				if (figure.NAME == 'draw2d.shape.note.PostIt') {
					figure.setText(figure.getUserData().name + ': ' + new Number(data.TagValue).toFixed(3) + ' ' + figure.getUserData().unit);
				} else if (figure.NAME == 'draw2d.shape.basic.Switch') {
					if (data.TagValue == 0 || data.TagValue.toString().toUpperCase() == 'FALSE') {
						figure.off();
					} else {
						figure.on();
					}
				}
			}
		});
	},
	initTree : function() {
		var reference = this;
		var tree = new com.component.PointTree({
			id : 'tree',
			imagePath : "../../../resources/dhtmlx/tree/imgs/csh_dhx_skyblue/",
			data : [ {
				id : '0',
				text : this.station.name,
				im0 : 'station.png',
				im1 : 'station.png',
				im2 : 'station.png',
				item : [ {
					id : 'HIGH',
					text : '高压',
					item : []
				}, {
					id : 'LOW',
					text : '低压',
					item : []
				} ]
			} ],
			onDblClick : function(id) {
				if (id == '0' || id == 'HIGH' || id == 'LOW') {
					return;
				}
				reference.openCanvas(id);
			}
		});
		tree.open();
		$('#tree').height($('#tree').height() - $('#navbar').height() - $('#sidebar-collapse').height() - 20);

		this.charts.forEach(function(chart) {
			var parentId = 'HIGH';
			if (!chart.heigh) {
				parentId = 'LOW';
			}
			tree.newChild(parentId, chart.id, chart.name, JSON.parse(JSON.stringify(chart)));
		});

		this.tree = tree;
	},
	eventComponent : function() {
		this.eventSidebar();
		this.eventUploadForm();
		this.eventContextMenu();
		
		
		(function(reference){
			$('div.btn-zoom-group>button:first-child').click(function() {
				reference.getCurrentCanvas().zoomIn();
			});
			$('div.btn-zoom-group>button:nth-child(2)').click(function() {
				reference.getCurrentCanvas().zoomOut();
			});
			$('div.btn-zoom-group>button:nth-child(3)').click(function() {
				reference.getCurrentCanvas().setZoom(1);
			});
		})(this);
		
	},
	eventContextMenu : function() {
		var reference = this;
		$('#set-background-image').click(function() {
			if (!reference.tab.getActiveId()) {
				bootbox.alert('没有找到要编辑的图表！');
				return;
			}

			$('#upload-form-modal #background').val('true');
			$('#upload-form-modal').modal('show');
		});

		$('#save-chart').click(function() {
			var id = reference.tab.getActiveId();
			if (!id) {
				bootbox.alert('没有找到要编辑的图表！');
				return;
			}
			if (reference.variableCharts[id].hasChanged()) {
				var response = reference.saveChart(id);
				if (response.status == 'SUCCESS') {
					handleResult(response);
				} else {
					handleError(response);
				}
			}
		});

		$('#save-all-chart').click(function() {
			var count = 0;
			for (id in reference.variableCharts) {
				count++;
				reference.tab.active(id);
				if (reference.variableCharts[id].hasChanged()) {
					var response = reference.saveChart(id);
					if (response.status != 'SUCCESS') {
						handleError(response);
						return;
					}
				}
			}
			if (count != 0) {
				message.success('批量保存成功！');
			}
		});

		$('#refresh-chart').click(function() {
			var id = reference.tab.getActiveId();
			if (!id) {
				bootbox.alert('没有找到要编辑的图表！');
				return;
			}

			var canvas = reference.variableCharts[id];
			canvas.refresh();
		});

		$('#revert-chart').click(function() {
			var id = reference.tab.getActiveId();
			if (!id) {
				bootbox.alert('没有找到要编辑的图表！');
				return;
			}

			var canvas = reference.variableCharts[id];
			canvas.revert();
		});

		$('#close-chart').click(function() {
			var id = reference.tab.getActiveId();
			if (id) {
				reference.closeTab.call(reference, id);
			}
		});

		$('#close-all-chart').click(function() {
			for (id in reference.variableCharts) {
				reference.closeTab.call(reference, id);
			}
		});

		$('#insert-label').click(function() {
			var canvas = reference.getCurrentCanvas();
			if (!canvas) {
				bootbox.alert('没有找到要编辑的图表！');
				return;
			}
			canvas.insertLabel(null, null, {
				x : (10 + $('.tab-content').scrollLeft()),
				y : (10 + $('.tab-content').scrollTop())
			});
		});

		$('#insert-note').click(function() {
			var canvas = reference.getCurrentCanvas();
			if (!canvas) {
				bootbox.alert('没有找到要编辑的图表！');
				return;
			}

			canvas.insertNote({
				x : (10 + $('.tab-content').scrollLeft()),
				y : (10 + $('.tab-content').scrollTop())
			});
		});

		$('#insert-picture').click(function() {
			var canvas = reference.getCurrentCanvas();
			if (!canvas) {
				bootbox.alert('没有找到要编辑的图表！');
				return;
			}

			// make sure current canvas not figure selected
			canvas.refresh();
			$('#upload-form-modal #background').val('false');
			$('#upload-form-modal').modal('show');
		});

		$('#generate-labels').click(function() {
			var canvas = reference.getCurrentCanvas();
			if (!canvas) {
				bootbox.alert('没有找到要编辑的图表！');
				return;
			}

			reference.dataPointTree.show(reference.dataPointTree.treeType.POINTS);
		});

		$('#datapoint-select-modal .btn-ok-point').click(function() {
			var selectedId = reference.dataPointTree.getSelectedId();
			if (!selectedId) {
				bootbox.alert('请选择监测点');
				return;
			}
			var selectedUserData = reference.dataPointTree.getUserData(selectedId);
			if (!selectedUserData || !selectedUserData.type || selectedUserData.type != 'POINT') {
				bootbox.alert('请选择监测点');
				return;
			}
			var dataPoints = reference.dataPointTree.getDataPoinsByPointId(selectedId);
			var count = 0;
			var existCount = 0;
			var canvas = reference.getCurrentCanvas();
			var x = $('.tab-content').scrollLeft();
			var y = $('.tab-content').scrollTop();
			
			dataPoints.forEach(function(dataPoint) {
				var flag = canvas.insertLabel(dataPoint.guid, selectedUserData.name + ' -> ' + dataPoint.name, {
					x : x + 50,
					y : y + (count * 30)
				}, dataPoint);
				if (flag) {
					canvas.setSelectionById(dataPoint.guid);
					count++;
				} else {
					existCount++;
				}
			});
			reference.dataPointTree.hide();
			message.success('共计' + (count + existCount) + '个标签，创建了' + count + '个' + (existCount > 0 ? ', ' + existCount + '个已存在' : ''));
		});

		$('#datapoint-select-modal .btn-ok-datapoint').click(function() {
			var selectedId = reference.dataPointTree.getSelectedId();
			if (selectedId.indexOf('DATAPOINT_') != 0) {
				bootbox.alert('选择数据采集点');
				return;
			}

			var canvas = reference.getCurrentCanvas();
			var figure = canvas.getSelectedFigure();
			var dataPoint = reference.dataPointTree.getUserData(selectedId);
			if (!dataPoint) {
				bootbox.alert('没有找到缓存数据！');
				return;
			}

			// 验证 guid 是否已经存在
			var found = canvas.getFigure(dataPoint.guid);
			if (found) {
				bootbox.alert('该采集点已经存在');
				return;
			}

			figure.setId(dataPoint.guid);

			var parentItem = reference.dataPointTree.getParentItem(dataPoint.id);
			var text = '';
			if (parentItem) {
				text = parentItem.text + " -> ";
			}
			text += dataPoint.name;
			if (figure.setText) {
				figure.setText(text);
			}

			figure.setUserData(dataPoint);
			reference.dataPointTree.hide();
		});

		$('#new-chart').click(function() {
			$('#chart-form-modal .modal-header h4').html('新增图表');
			$('#chart-form')[0].reset();
			$('#chart-form input[type="hidden"]').val('');
			$('#chart-form-modal').modal('show');
		});

		$('#chart-form-modal button.btn-save').click(function() {
			var chart = $('#chart-form').serializeObject();
			if (chart.id != '') {
				reference.tree.getUserData(chart.id).data;
			} else {
				chart.data = '[]';
			}

			console.log('save chart', chart);

			$.ajax({
				url : '../../../system/station/' + reference.code + '/chart/save',
				cache : false,
				async : false,
				type : 'post',
				data : {
					id : chart.id,
					name : chart.name,
					heigh : chart.heigh,
					data : chart.data,
				},
				beforeSend : function() {
					var validator = $('#chart-form').kendoValidator({
						messages : {
							required : function(input) {
								return '必填项';
							}
						}
					}).data('kendoValidator');
					if (validator.validate() === false) {
						var errorMessages = $('.k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg');
						for (var i = 0; i < errorMessages.length; i++) {
							var msg = errorMessages[i];
							$(msg).appendTo($(msg).closest('.form-group'));
						}
						return false;
					}
					return true;
				},
				success : function(response) {
					handleResult(response);
					console.log(response);
					if (response.status == 'SUCCESS') {
						var obj = response.result;
						reference.tree.update(obj);

						// change tab header if it was open
						if (chart.id != '') {
							var header = $('a[href="#' + chart.id + '"]');
							if (header.length != 0) {
								$(header)[0].lastChild.nodeValue = obj.name;
							}
						}

						$('#chart-form-modal').modal('hide');
					}
				},
				error : function(e) {
					handleError(e);
				}
			});
		});

		$('#modify-chart').click(function() {
			$('#chart-form-modal .modal-header h4').html('编辑图表');
			$('#chart-form')[0].reset();
			$('#chart-form input[type="hidden"]').val('');

			var item = reference.tree.getSelectedItem();
			if (!item) {
				bootbox.alert('没有选择图表');
				return;
			}

			var userData = reference.tree.getUserData(item.id);
			if (!userData) {
				bootbox.alert('没有选择图表');
				return;
			}

			$('#chart-form input[name=\'name\']').val(userData.name);
			$('#chart-form input[name=\'id\']').val(userData.id);
			$('#chart-form select[name=\'heigh\']').val(userData.heigh ? 1 : 0);
			$('#chart-form textarea[name=\'summary\']').val(userData.summary);

			$('#chart-form-modal').modal('show');
		});

		$('#edit-chart').click(function() {
			var item = reference.tree.getSelectedItem();
			if (item == null) {
				bootbox.alert('没有选择图表');
				return;
			}

			var userData = reference.tree.getUserData(item.id);
			if (!userData) {
				bootbox.alert('没有选择图表');
				return;
			}

			reference.openCanvas(item.id);
		});

		$('#insert-switch').click(function() {
			var canvas = reference.getCurrentCanvas();
			if (!canvas) {
				bootbox.alert('没有找到要编辑的图表！');
				return;
			}

			canvas.insertSwitch();
		});

		$('#remove-chart').click(function() {
			var item = reference.tree.getSelectedItem();
			if (item == null) {
				bootbox.alert('没有选择图表');
				return;
			}

			var userData = reference.tree.getUserData(item.id);
			if (!userData) {
				bootbox.alert('没有选择图表');
				return;
			}

			bootbox.dialog({
				message : '<span class="bigger-110">确定要删除[' + item.text + ']吗？</span>',
				buttons : {
					"click" : {
						"label" : "确定",
						"className" : "btn-sm btn-primary",
						"callback" : function() {
							$.ajax({
								url : '../../../../system/station/removechart/' + item.id,
								error : handleError,
								success : function(response) {
									handleResult(response);
									if (response.status && response.status == 'SUCCESS') {
										reference.tree.remove(item.id);
									}
								}
							});
						}
					},
					"button" : {
						"label" : "取消",
						"className" : "btn-sm"
					}
				}
			});
		});

		$('#test-start-chart').click(function() {
			reference.unsubscribe();

			var canvas = reference.getCurrentCanvas();
			if (!canvas) {
				bootbox.alert('没有找到可运行的图表！');
				return;
			}

			var figures = canvas.getFigures();
			var channels = [];
			for (var i = 0; i < figures.size; i++) {
				var figure = figures.get(i);
				var userData = figure.getUserData();
				if (!userData) {
					continue;
				}
				if (figure.NAME == 'draw2d.shape.note.PostIt' || figure.NAME == 'draw2d.shape.basic.Switch') {
					channels.push(reference.code + '.rt.' + (userData.point ? userData.point.currentId.split('_')[1] : userData.currentId.split('_')[1]) + '.' + userData.guid);
				}
			}

			reference.ws.subscribe(channels);
		});

		$('#test-stop-chart').click(function() {
			reference.unsubscribe();
		});
	},
	eventSidebar : function() {
		$('#sidebar-collapse').click(function(e) {
			e.stopPropagation();
			$('#sidebar').toggleClass('menu-min');
			var minimized = $('#sidebar').hasClass('menu-min');
			minimized ? $('#sidebar-collapse>i').removeClass().addClass('icon-double-angle-right') : $('#sidebar-collapse>i').removeClass().addClass('icon-double-angle-left');
			minimized ? $('#tree').css({
				'visibility' : 'hidden'
			}) : $('#tree').css({
				'visibility' : ''
			});
		});
		$('#sidebar').click(function(e) {
			var minimized = $('#sidebar').hasClass('menu-min');
			if (minimized) {
				$('#sidebar-collapse').trigger('click');
			}
		});

		$('#sidebar').click(function(e) {
			e.stopPropagation();
		});
		$('#sidebar').dblclick(function(e) {
			e.stopPropagation();
		});
	},
	eventUploadForm : function() {
		var reference = this;
		$('#upload-form-modal .btn-save').click(function() {
			if ($('#upload-form-modal form input[name=\'file\']').val() == '') {
				bootbox.alert('请选择图片！');
				return;
			}
			$(this).attr('disabled', true);
			$.upload({
				url : $('#upload-form-modal form').attr('action'),
				type : 'post',
				form : '#upload-form-modal form',
				success : function(response) {
					// handleResult(response);
				},
				error : function(e) {
					handleError(e);
				},
				done : function(response) {
					// 文件上传 1、设置Canvas的背景图片； 2、双击图片弹出更换图片；
					$('#upload-form-modal .btn-save').attr('disabled', false);
					if (response.status != 'SUCCESS') {
						return;
					}
					$('#upload-form-modal').modal('hide');
					var dimension = {};
					var canvas = reference.getCurrentCanvas();
					$('<img />').attr('src', "data:image/png;base64," + response.result).load(function() {
						dimension.width = this.width;
						dimension.height = this.height;
						var canvas = reference.getCurrentCanvas();
						if ($('#upload-form-modal #background').val() == 'true') {
							// 设置背景
							if (canvas) {
								canvas.setBackground($(this).attr('src'), dimension);
							}
						} else {
							canvas.setImage($(this).attr('src'), dimension);
						}

					});// end load image
				}
			});

		});
	},
	// method
	openCanvas : function(id) {
		var text = this.tree.getText(id);
		this.tab.add(id, text);
		var data = JSON.parse(this.tree.getUserData(id).data);
		if (!data || data == '') {
			data = [];
		}
		var reference = this;
		this.variableCharts[id] = new com.component.Canvas({
			id : id,
			data : data,
			onClick : function() {
				// stopPropagation
				var currentId = reference.tab.getActiveId();
				var canvasId = this.canvas.canvasId;
				if (currentId == canvasId) {
					reference.figureClick.call(reference, this);
				}
			},
			onDblClick : function() {
				// stopPropagation
				var currentId = reference.tab.getActiveId();
				var canvasId = this.canvas.canvasId;
				if (currentId == canvasId) {
					reference.figureDblClick.call(reference, this);
				}
			}
		});
	},
	closeTab : function(id) {
		var canvas = this.variableCharts[id];
		var tab = this.tab;
		var reference = this;
		if (canvas.hasChanged()) {
			bootbox.dialog({
				message : "<span class='bigger-110'>图表已经发生改变，是否需要保存？</span>",
				buttons : {
					"success" : {
						"label" : "保存",
						"className" : "btn-sm btn-primary",
						"callback" : function() {
							reference.unsubscribe();
							var response = reference.saveChart(id);
							if (response.status == 'SUCCESS') {
								handleResult(response);
								tab.remove(id);
								delete reference.variableCharts[id];
							} else {
								handleError(response);
							}
						}
					},
					"danger" : {
						"label" : "不保存",
						"className" : "btn-sm btn-primary",
						"callback" : function() {
							reference.unsubscribe();
							tab.remove(id);
							delete reference.variableCharts[id];
						}
					},
					"click" : {
						"label" : "取消",
						"className" : "btn-sm btn-primary",
						"callback" : function() {
						}
					}
				}
			});
		} else {
			reference.unsubscribe();
			tab.remove(id);
			delete reference.variableCharts[id];
		}
	},
	figureClick : function(figure) {
		var userData = figure.getUserData();
		if (userData) {
			console.log(JSON.stringify(userData));
		}
	},
	figureDblClick : function(figure) {
		console.log(figure.NAME, 'dblclicked', new Date().getTime());
		switch (figure.NAME) {
		case 'draw2d.shape.basic.Image':
			this.imageFigureDblClick(figure);
			break;
		case 'draw2d.shape.note.PostIt':
			this.labelFigureDblClick(figure);
			break;
		case 'draw2d.shape.basic.Switch':
			this.switchFigureDblClick(figure);
			break;
		}
	},
	switchFigureDblClick : function(figure) {
		this.dataPointTree.show(this.dataPointTree.treeType.SWITCHS);
	},
	imageFigureDblClick : function(figure) {
		$('#upload-form-modal #background').val('false');
		$('#upload-form-modal').modal('show');
	},
	labelFigureDblClick : function(figure) {
		this.dataPointTree.show(this.dataPointTree.treeType.DATAPOINTS);
	},
	getCurrentCanvas : function() {
		return this.variableCharts[this.tab.getActiveId()];
	},
	saveChart : function(id) {
		// 1、保存数据到后台；2、更新canvas;3、更新tree
		var treeData = this.tree.getUserData(id);
		var chartData = JSON.stringify(this.variableCharts[id].toJson());
		var reference = this;
		var result = null;
		$.ajax({
			url : '../../../system/station/' + this.code + '/chart/save',
			async : false,
			cache : false,
			type : 'post',
			data : {
				id : treeData.id,
				name : treeData.name,
				heigh : treeData.heigh,
				summary : treeData.summary,
				data : chartData
			},
			success : function(response) {
				// handleResult(response);
				if (response.status == 'SUCCESS') {
					treeData.data = chartData;
					reference.tree.update(treeData);
					reference.variableCharts[id].update();
					result = response;
				}
			},
			error : function(e) {
				// handleError(e);
				result = e;
			}
		});
		return result;
	},
	unsubscribe : function() {
		if (this.ws) {
			this.ws.unsubscribe([ '*' ]);
		}
	}
};