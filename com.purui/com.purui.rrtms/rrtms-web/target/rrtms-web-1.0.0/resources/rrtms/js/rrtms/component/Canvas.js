if (!window.com) {
	var com = {};
}
if (!com.component) {
	com.component = {};
}

com.component.Canvas = function(params) {
	if (!params.id) {
		alert('没有指定canvas\'s id');
		return;
	}
	var original = [];
	var canvas = new draw2d.Canvas(params.id);

	if (params.data) {
		unmarshal(params.data);
		original = JSON.parse(JSON.stringify(params.data));
	}

	function unmarshal(json) {
		canvas.clear();
		new draw2d.io.json.Reader().unmarshal(canvas, json);

		var figures = canvas.getFigures();
		for (var i = 0; i < figures.size; i++) {
			var figure = figures.get(i);

			if (figure.NAME == 'draw2d.shape.basic.Image') {
				var userData = figure.getUserData();
				if ((typeof userData == 'string')
						&& userData.toUpperCase() == 'BACKGROUND') {
					figure.setSelectable(false).setDraggable(false);
					figure.onClick = function() {
						// holder to make sure image can not resize
					};
					figure.onDoubleClick = function() {
						// holder to make sure image can not resize
					};
					continue;
				}
			}

			if (params.onClick) {
				figure.onClick = params.onClick;
			}
			if (params.onDblClick) {
				figure.onDoubleClick = params.onDblClick;
			}

		}
	}

	function marshal() {
		return new draw2d.io.json.Writer().marshal(canvas);
	}

	function getBackgroundFigure() {
		var figures = canvas.getFigures();
		for (var i = 0; i < figures.size; i++) {
			var figure = figures.get(i);
			if (figure.NAME == 'draw2d.shape.basic.Image') {
				var userData = figure.getUserData();
				if ((typeof userData == 'string')
						&& userData.toUpperCase() == 'BACKGROUND') {
					return figure;
				}
			}
		}
	}

	return {
		fromJson : function(json) {
			unmarshal(json || []);
		},
		toJson : function() {
			return marshal();
		},
		toBottom : function(id) {
			var _figure = canvas.getFigure(id);
			if (!_figure) {
				bootbox.alert('没有找到图形');
				return;
			}

			var figures = marshal(canvas);
			console.log(figures.length);
			for (var i = 0; i < figures.length; i++) {
				var figure = figures[i];
				if (figure.id == id) {
					figures.unshift(figures.splice(i, 1)[0]);
					break;
				}
			}
			unmarshal(figures);
		},
		getSelectedFigure : function() {
			var primary = canvas.getSelection().primary;
			if (primary == null) {
				return null;
			}
			var id = primary.id;
			return figure = canvas.getFigure(id);
		},
		getFigure : function(id) {
			return canvas.getFigure(id);
		},
		getFigures : function() {
			return canvas.getFigures();
		},
		setBackground : function(src, dimension) {
			var figure = getBackgroundFigure();
			if (figure) {
				figure.setPath(src);
				figure.width = dimension.width;
				figure.height = dimension.height;
				figure.repaint();
			} else {
				figure = new draw2d.shape.basic.Image(src, dimension.width,
						dimension.height);
				figure.setUserData('BACKGROUND');
				canvas.addFigure(figure, 0, 0);
				this.toBottom(figure.id);
			}
		},
		setImage : function(src, dimension) {
			var figure = this.getSelectedFigure();
			if (!figure || figure.NAME != 'draw2d.shape.basic.Image') {
				figure = null;
				figure = new draw2d.shape.basic.Image(src, dimension.width,
						dimension.height);
				canvas.addFigure(figure, $('#' + params.id).parent()
						.scrollLeft() + 10, $('#' + params.id).parent()
						.scrollTop() + 10);
				if (params.onClick) {
					figure.onClick = params.onClick;
				}
				if (params.onDblClick) {
					figure.onDoubleClick = params.onDblClick;
				}
			} else {
				figure.setPath(src);
				figure.width = dimension.width;
				figure.height = dimension.height;
				figure.repaint();
			}

		},
		getOriginalCanvas : function() {
			return canvas;
		},
		hasChanged : function() {
			return JSON.stringify(original) != JSON.stringify(this.toJson());
		},
		getOriginalJson : function() {
			return original;
		},
		revert : function() {
			this.fromJson(original);
		},
		refresh : function() {
			this.fromJson(this.toJson());
		},
		update : function() {
			original = JSON.parse(JSON.stringify(this.toJson()));
		},
		insertNote : function(position) {
			bootbox.alert('not done yet!');
		},
		insertLabel : function(id, text, position, userData) {
			if (!text) {
				text = '标签';
			}

			// 验证id是否已经存在
			if (canvas.getFigure(id)) {
				return false;
			}

			var figure = new draw2d.shape.note.PostIt(text);
			if (id) {
				figure.id = id;
			}
			if (!position) {
				position = {
					x : 10,
					y : 10
				};
			}
			if (userData) {
				figure.setUserData(userData);
			}
			canvas.addFigure(figure, position.x, position.y);
			if (params.onClick) {
				figure.onClick = params.onClick;
			}
			if (params.onDblClick) {
				figure.onDoubleClick = params.onDblClick;
			}
			return true;
		},
		insertSwitch : function(position) {
			var figure = new draw2d.shape.basic.Switch();
			figure.setBackgroundColor(new draw2d.util.Color('#00ff00'));
			if (!position) {
				position = {
					x : $('#' + params.id).parent().scrollLeft() + 10,
					y : $('#' + params.id).parent().scrollTop() + 10
				};
			}

			// set dimension
			var selectedFigure = this.getSelectedFigure();
			if (selectedFigure) {
				if (selectedFigure.NAME == figure.NAME) {
					figure.width = selectedFigure.width;
					figure.height = selectedFigure.height;
				}
			}

			canvas.addFigure(figure, position.x, position.y);
			if (params.onClick) {
				figure.onClick = params.onClick;
			}
			if (params.onDblClick) {
				figure.onDoubleClick = params.onDblClick;
			}
		},
		clear : function() {
			canvas.clear();
		},
		readOnly : function(except) {
			var figures = canvas.getFigures();
			for (var i = 0; i < figures.size; i++) {
				var figure = figures.get(i);

				figure.setSelectable().setDraggable(false);
				if (figure.NAME == "draw2d.shape.note.PostIt") {
					figure.setBackgroundColor(null);
					figure.setFontColor(new draw2d.util.Color("#000000"));
				}
				if (!except[figure.NAME]) {
					figure.onClick = function() {
					};
					figure.onDoubleClick = function() {
					};
				}
			}
		},
		getZoom : function() {
			return canvas.getZoom();
		},
		setZoom : function(num) {
			if (!num || isNaN(num)) {
				return;
			}

			if (num < 0.1) {
				num = 0.1;
			}

			if (num > 10) {
				num = 10;
			}

			canvas.setZoom(num);
		},
		zoomIn : function() {
			this.setZoom(this.getZoom() - 0.1);
		},
		zoomOut : function() {
			this.setZoom(this.getZoom() + 0.1);
		},
		setSelectionById : function(id) {
			var figure = this.getFigure(id);
			if (figure) {
				canvas.setCurrentSelection(figure);
			}
		},
		setSelectionByFigure : function(figure) {
			if (figure) {
				canvas.setCurrentSelection(figure);
			}
		}
	};
};
