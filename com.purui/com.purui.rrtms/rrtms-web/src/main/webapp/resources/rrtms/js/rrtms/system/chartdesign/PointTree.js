if (!window.com) {
	var com = {};
}
if (!com.component) {
	com.component = {};
}
/*
 * params : {id : '', data : []}
 */
com.component.PointTree = function(params) {
	var tree = null;
	if (!params.id) {
		alert('没有指定DOM\'s id');
		return;
	}
	tree = new dhtmlXTreeObject(params.id, "100%", "100%", "-1");
	if (params.imagePath) {
		tree.setImagePath(params.imagePath);
	}
	tree.loadJSONObject({
		id : '-1',
		text : '^',
		item : params.data
	});
	if (params.onClick) {
		tree.attachEvent('onClick', params.onClick);
	}
	if (params.onDblClick) {
		tree.attachEvent('onDblClick', params.onDblClick);
	}

	return {
		destroy : function() {
			tree.destructor();
		},
		open : function(id) {
			if (!id) {
				tree.openAllItems('-1');
			}
		},
		newChild : function(parentId, id, text, obj) {
			tree.insertNewChild(parentId, id, text);
			if (obj) {
				tree.setUserData(id, 'obj', obj);
			}
		},
		getUserData : function(id) {
			return tree.getUserData(id, 'obj');
		},
		getText : function(id) {
			return tree.getSelectedItemText();
		},
		update : function(obj) {
			if (!obj) {
				return;
			}

			if (tree.getItemText(obj.id) === 0) {
				// new
				this
						.newChild(obj.heigh ? 'HIGH' : 'LOW', obj.id, obj.name,
								obj);
			} else {
				// modify
				tree.setItemText(obj.id, obj.name);
				tree.setUserData(obj.id, 'obj', obj);
				var parentId = tree.getParentId(obj.id);
				var target = obj.heigh ? 'HIGH' : 'LOW';
				if (parentId == target) {
					return;
				}
				tree.moveItem(obj.id, 'item_child', target);
			}
		},
		getOriginalTree : function() {
			return tree;
		},
		getSelectedItem : function() {
			var selectedId = tree.getSelectedItemId();
			var selectedText = tree.getSelectedItemText();
			if (selectedId == '' && selectedText == '') {
				return null;
			} else {
				return {
					id : selectedId,
					text : selectedText
				};
			}
		},
		remove : function(id) {
			tree.deleteItem(id);
		}
	};
};