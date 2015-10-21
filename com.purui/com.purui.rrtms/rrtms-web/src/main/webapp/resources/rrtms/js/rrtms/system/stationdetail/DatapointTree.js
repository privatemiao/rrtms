window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

window.com.rrtms.system.DatapointTree = function(params) {
	var tree = new dhtmlXTreeObject(params.id, '100%', '100%', '-1');
	tree.setImagePath("../../../resources/dhtmlx/tree/imgs/csh_dhx_skyblue/");

	if (params.hasOwnProperty('checkbox')) {
		if (params.checkbox) {
			tree.enableCheckBoxes(1);
		}
		if (params.hasOwnProperty('cascade')) {
			if (params.cascade) {
				tree.enableThreeStateCheckboxes(true);
			}
		}
	}

	console.log(params);

	// prepare data
	var points = JSON.parse(JSON.stringify(params.station.points));
	(function _convert(points) {
		points.forEach(function(point) {
			if (point.type) {
				if (point.type == 'POINT') {
					point.im0 = 'point.png';
					point.im1 = 'point.png';
					point.im2 = 'point.png';
				}
			}

			point.text = point.name;
			delete point.name;

			point.item = point.children;
			delete point.children;

			if (point.item && point.item.length > 0) {
				_convert(point.item);
			}
		});
	})(points);

	points.forEach(function(point) {
		point.nocheckbox = true;
	});

	tree.loadJSONObject({
		id : '-1',
		text : '^',
		item : [ {
			id : '0',
			im0 : 'station.png',
			im1 : 'station.png',
			im2 : 'station.png',
			nocheckbox : true,
			text : params.station.name,
			item : points
		} ]
	});

	tree.openItem(0);

	// bind data
	(function _bind(points) {
		points.forEach(function(point) {
			var userData = JSON.parse(JSON.stringify(point));
			delete userData.children;
			tree.setUserData(userData.id, 'obj', userData);
			if (point.children && point.children.length > 0) {
				_bind(point.children);
			}
		});
	})(params.station.points);

	if (params.hasOwnProperty('click')) {
		tree.attachEvent('onClick', function(id) {
			params.click(id);
		});
	}
	if (params.checkHandler) {
		tree.setOnCheckHandler(params.checkHandler);
	}

	return {
		destroy : function() {
			console.log('DatapointTree destroy...');
			if (tree && tree.destructor) {
				console.log('destroy tree');
				tree.destructor();
				tree = null;
			}
		},
		getSelectedItemText : function() {
			return tree.getSelectedItemText();
		},
		getSelectedItem : function() {
			var id = tree.getSelectedItemId();
			if (!id){
				return null;
			}
			
			return {
				id : id,
				text : tree.getSelectedItemText(),
				userData : tree.getUserData(id, 'obj')
			};
		},
		getUserData : function(id) {
			if (id == -1 || id == 0) {
				return null;
			}
			return tree.getUserData(id, 'obj');
		},
		getOriginalTree : function() {
			return tree;
		},
		getAllCheckedItems : function() {
			var item = [];

			var ids = tree.getAllChecked();
			if (!ids) {
				return null;
			}

			ids = ids.split(',');

			ids.forEach(function(id) {
				item.push({
					id : id,
					text : tree.getItemText(id),
					obj : tree.getUserData(id, 'obj')
				});
			});

			return item;

		}
	};
};