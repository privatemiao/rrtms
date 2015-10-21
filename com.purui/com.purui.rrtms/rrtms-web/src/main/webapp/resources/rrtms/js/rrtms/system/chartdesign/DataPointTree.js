if (!window.com) {
	var com = {};
}
if (!com.component) {
	com.component = {};
}

com.component.DataPointTree = function(params) {
	var tree = null;
	var indexedById = {};
	var indexedByParentId = {};// just for dataPoints {pointId : dataPoints}

	if (!params.id && params.id.length != 2) {
		alert('没有指定DOM\'s id');
		return;
	}

	var dataPoints = JSON.parse(JSON.stringify(params.station.points));
	var points = JSON.parse(JSON.stringify(params.station.points));
	var switchs = JSON.parse(JSON.stringify(params.station.points));

	var labelCheck = [ '1', '2', '3', '4' ];
	var switchCheck = '5';

	(function _convert(points) {
		points.forEach(function(point) {
			var item = point.children;
			var dataPoints = null;

			delete point.children;
			point.id = point.type + '_' + point.id;
			if (point.dataPoints) {
				dataPoints = point.dataPoints;
				delete point.dataPoints;
			}

			indexedById[point.id] = JSON.parse(JSON.stringify(point));

			point.text = point.name;
			delete point.name;

			point.im0 = 'folderClosed.gif';
			point.im1 = 'folderOpen.gif';
			point.im2 = 'folderClosed.gif';

			point.item = item;
			_convert(point.item);

			if (dataPoints) {
				var _dataPoints = [];
				dataPoints.forEach(function(dataPoint) {
					var code = dataPoint.subTagType.tagType.code;
					if ($.inArray(code, labelCheck) != -1) {
						dataPoint.point = {
							currentId : point.currentId,
							guid : point.guid
						};

						_dataPoints.push(JSON.parse(JSON.stringify(dataPoint)));
						dataPoint.id = dataPoint.type + '_' + dataPoint.id;
						indexedById[dataPoint.id] = JSON.parse(JSON.stringify(dataPoint));
						dataPoint.text = dataPoint.name;
						delete dataPoint.name;

						// dataPoint.im0 = '';
						// dataPoint.im1 = '';
						// dataPoint.im2 = '';

						point.item.push(dataPoint);
					}
				});
				indexedByParentId[point.id] = _dataPoints;
			}
		});
	})(dataPoints);

	(function _convert(points) {
		points.forEach(function(point) {
			var item = point.children;
			var dataPoints = null;

			delete point.children;
			point.id = point.type + '_' + point.id;
			if (point.dataPoints) {
				dataPoints = point.dataPoints;
				delete point.dataPoints;
			}

			point.text = point.name;
			delete point.name;

			point.im0 = 'folderClosed.gif';
			point.im1 = 'folderOpen.gif';
			point.im2 = 'folderClosed.gif';

			point.item = item;
			_convert(point.item);

			if (dataPoints) {
				var _dataPoints = JSON.parse(JSON.stringify(dataPoints));

				dataPoints.forEach(function(dataPoint) {
					var code = dataPoint.subTagType.tagType.code;
					if (code == switchCheck) {
						dataPoint.point = {
							currentId : point.currentId,
							guid : point.guid
						};

						dataPoint.id = dataPoint.type + '_' + dataPoint.id;
						indexedById[dataPoint.id] = JSON.parse(JSON.stringify(dataPoint));
						dataPoint.text = dataPoint.name;
						delete dataPoint.name;

						// dataPoint.im0 = '';
						// dataPoint.im1 = '';
						// dataPoint.im2 = '';

						point.item.push(dataPoint);
					}
				});
			}
		});
	})(switchs);

	(function _convert(points) {
		points.forEach(function(point) {
			var item = point.children;

			delete point.children;
			point.id = point.type + '_' + point.id;

			point.text = point.name;
			delete point.name;

			point.im0 = 'folderClosed.gif';
			point.im1 = 'folderOpen.gif';
			point.im2 = 'folderClosed.gif';

			point.item = item;
			_convert(point.item);
		});
	})(points);

	function destory() {
		tree.destructor();
		tree = null;
	}

	function generateTre(data) {
		if (tree != null) {
			destory();
			tree = null;
		}
		tree = new dhtmlXTreeObject(params.id[1], "100%", "100%", "-1");
		if (params.imagePath) {
			tree.setImagePath(params.imagePath);
		}
		tree.loadJSONObject({
			id : '-1',
			text : '^',
			item : [ {
				id : params.station.type + '_' + params.station.id,
				text : params.station.name,
				im0 : 'folderClosed.gif',
				im1 : 'folderOpen.gif',
				im2 : 'folderClosed.gif',
				item : data
			} ]
		});

		if (params.onClick) {
			tree.attachEvent('onClick', params.onClick);
		}
		if (params.onDblClick) {
			tree.attachEvent('onDblClick', params.onDblClick);
		}
	}

	return {
		destroy : function() {
			destory();
		},
		treeType : {
			POINTS : 'POINTS',
			DATAPOINTS : 'DATAPOINTS',
			SWITCHS : 'SWITCHS'
		},
		show : function(treeType) {
			var title = '选择数据采集点';
			if (treeType == this.treeType.POINTS) {
				title = '选择监测点';
			} else if (treeType == this.treeType.SWITCHS) {
				title = '选择开关';
			}
			$('#' + params.id[0]).find('.modal-header h4').html(title);

			var footer = $('#' + params.id[0]).find('.modal-footer');
			footer.find('button').hide();
			footer.find('button.btn-cancel').show();
			if (treeType == this.treeType.POINTS) {
				footer.find('button.btn-ok-point').show();
				generateTre(points);
			} else if (treeType == this.treeType.DATAPOINTS) {
				footer.find('button.btn-ok-datapoint').show();
				generateTre(dataPoints);
			} else if (treeType == this.treeType.SWITCHS) {
				footer.find('button.btn-ok-datapoint').show();
				generateTre(switchs);
			}

			$('#' + params.id[0]).modal('show');
			tree.openItem(params.station.type + '_' + params.station.id);
		},
		hide : function() {
			$('#' + params.id[0]).modal('hide');
		},
		getUserData : function(id) {
			return indexedById[id];
		},
		getDataPoinsByPointId : function(id) {
			return indexedByParentId[id];
		},
		getSelectedId : function() {
			return tree.getSelectedItemId();
		},
		getOriginalTree : function() {
			return tree;
		},
		getParentItem : function(id) {
			var parentId = tree.getParentId(id);
			var parentText = tree.getItemText(parentId);
			if (parentId == '') {
				return null;
			}

			return {
				id : parentId,
				text : parentText
			};
		}
	};
};