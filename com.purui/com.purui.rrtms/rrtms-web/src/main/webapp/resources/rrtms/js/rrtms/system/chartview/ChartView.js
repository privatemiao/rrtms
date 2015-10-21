if (!window.com) {
	var com = {};
}
if (!com.rrtms) {
	com.rrtms = {};
}
if (!com.rrtms.system) {
	com.rrtms.system = {};
}
com.rrtms.system.ChartView = function() {
	this.SIDEBAR_WIDTH = 250;
	this.code = $.cookie('code');
	if (!this.code) {
		bootbox.alert('请提供站点代码！');
		return;
	}
	this.init();
};
com.rrtms.system.ChartView.prototype = {
	destroy : function() {
		console.log('destroy ChartView...');
		if (this.tree && this.tree.destroy) {
			console.log('destroy tree');
			this.tree.destroy();
			this.tree = null;
		}

		if (this.ws && this.ws.destroy) {
			console.log('destroy ws');
			this.ws.destroy();
			this.ws = null;
		}
	},
	init : function() {
		this.layout();
		this.prepareData();
		this.initComponent();
		this.eventComponent();
	},
	eventComponent : function() {
		var reference = this;

		$('div.btn-group>button:first-child').click(function() {
			reference.canvas.zoomIn();
		});
		$('div.btn-group>button:nth-child(2)').click(function() {
			reference.canvas.zoomOut();
		});
		$('div.btn-group>button:nth-child(3)').click(function() {
			reference.canvas.setZoom(1);
		});
	},
	layout : function() {
		$('#canvas-wrapper').height($(window).innerHeight() - 10);
		$('div.btn-group').offset({
			top : $('#canvas-wrapper').offset().top,
			left : $('.main-container-inner').width() - $('div.btn-group').width() + 9
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
			url : '../../../system/station/stationbycode/' + this.code,
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
		this.initWS();
		this.initTree();
		this.initCanvas();

		$('#switch-trigger-modal-form .btn-okay').click(function() {
			var obj = $('#switch-trigger-modal-form form').serializeObject();
			console.log(obj);
			
			if (!$.trim(obj.password)) {
				bootbox.alert('请输入口令！');
				return;
			}

			if (!$.trim(obj.note)) {
				bootbox.alert('请输入备注！');
				return;
			}
			
			$.ajax({
				url : '../../../system/station/' + obj.code + '/' + obj.tagId + '/triggerswitch/' + obj.operate,
				cache : false,
				error : handleError,
				data : {note : obj.note, password : obj.password},
				success : function(response) {
					handleResult(response, true);
					if (response.hasOwnProperty('status') && response.status == 'SUCCESS') {
						var result = JSON.parse(response.result);
						$('#switch-trigger-modal-form').modal('hide');
						message.success(result.MSG);
					}
				}
			});
		});
	},
	initCanvas : function() {
		this.canvas = new com.component.Canvas({
			id : 'canvas',
			onDblClick : function() {
				var userData = this.userData, operate = (this.status == 'on' ? '0' : '1');

				if (!userData) {
					bootbox.alert('该开关没有关联任何设备！');
					return;
				}
				var tagId = userData.guid, code = userData.code;

				$('#switch-trigger-modal-form form')[0].reset();
				$('#switch-trigger-modal-form input[type="hidden"]').val('');

				$('#switch-trigger-modal-form').find('#status').html(this.status == 'on' ? '合' : '分');
				
				$('#switch-trigger-modal-form').find('input[name="code"]').val(code);
				$('#switch-trigger-modal-form').find('input[name="tagId"]').val(tagId);
				$('#switch-trigger-modal-form').find('select[name="operate"]').val(operate);
				$('#switch-trigger-modal-form').find('.modal-header h4').html(operate == '1' ? '合闸-备注' : '分闸-备注');

				$('#switch-trigger-modal-form').modal('show');
				
				$('#switch-trigger-modal-form input[name="password"]').focus();
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

				reference.unsubscribe();

				reference.canvas.clear();
				reference.canvas.setZoom(1);
				reference.canvas.fromJson(JSON.parse(this.getUserData(id, 'obj').data));
				reference.canvas.readOnly({
					'draw2d.shape.basic.Switch' : true
				});

				$('#canvas-wrapper').animate({
					scrollTop : 0
				}, 800);

				reference.subscribeFromCanvas();
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
	unsubscribe : function() {
		this.ws.unsubscribe([ '*' ]);
	},
	subscribeFromCanvas : function() {
		var figures = this.canvas.getFigures();
		console.log('figures size >> ' + figures.size);
		if (figures.size == 0) {
			return;
		}
		var channels = [];
		for ( var i = 0; i < figures.size; i++) {
			var figure = figures.get(i);
			var userData = figure.getUserData();
			if (!userData) {
				continue;
			}
			if (figure.NAME == 'draw2d.shape.note.PostIt' || figure.NAME == 'draw2d.shape.basic.Switch') {
				channels.push(this.code + '.rt.' + (userData.point ? userData.point.currentId.split('_')[1] : userData.currentId.split('_')[1]) + '.' + userData.guid);
			}
		}
		this.ws.subscribe(channels);
	},
	initWS : function() {
		var reference = this;
		this.ws = new com.component.WebSocket({
			onmessage : function(event) {
				var data = JSON.parse(event.data);
				if (!data.hasOwnProperty("TagID")) {
					return;
				}

				var canvas = reference.canvas;
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
	}
};