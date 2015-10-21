com.rrtms.system.Role = function() {
	this.init();
};
com.rrtms.system.Role.prototype = {
	destroy : function() {
		console.log('destroy Role...');
		if (this.roleGrid != null) {
			console.log('destroy roleGrid');
			this.roleGrid.destroy();
			this.roleGrid = null;
		}
		if (this.rightTree != null) {
			console.log('destroy rightTree');
			this.rightTree.destructor();
			this.rightTree = null;
		}

		$(document).off('click', '#toolbar>button');
	},
	init : function() {
		this.initComponent();
		this.eventComponent();
	},
	initComponent : function() {
		this.initRoleGrid();
		this.initRightTree();
	},
	initRoleGrid : function() {
		this.roleGrid = $('#role-grid').kendoGrid({
			dataSource : {
				pageSize : 10,
				type : 'json',
				serverPaging : true,
				serverSorting : true,
				transport : {
					read : {
						url : 'system/role/roles',
						type : 'POST',
						cache : false
					},
					parameterMap : function(params) {
						var obj = {};
						obj.curPage = params.curPage;
						obj.count = params.pageSize;
						obj.orderBy = getOrderBy(params.sort);
						obj.sortBy = getSortBy(params.sort);
						obj.skip = params.skip;
						return obj;
					}
				},
				schema : {
					data : function(response) {
						return response.data;
					},
					page : function(response) {
						return response.curPage;
					},
					total : function(response) {
						return response.maxCount;
					}
				}
			},
			sortable : true,
			resizable : true,
			height : $.GRID_HEIGHT,
			pageable : {
				refresh : true,
				pageSizes : true,
				numeric : true
			},
			selectable : 'multiple',
			columns : [ {
				field : 'name',
				title : '名称'
			}, {
				field : 'desc',
				title : '描述'
			} ]
		}).data('kendoGrid');

		var reference = this;
		$('#role-grid').delegate('tbody>tr', 'dblclick', function(ev, a) {
			var item = $('#role-grid').data('kendoGrid').dataItem($(this));
			if (item) {
				reference.viewRole(item);
			}
		});
	},
	initRightTree : function() {
		this.rightTree = new dhtmlXTreeObject('right-tree', '100%', '100%', '-1');
		this.rightTree.setImagePath("resources/dhtmlx/tree/imgs/csh_dhx_skyblue/");
		this.rightTree.enableCheckBoxes(1);
		this.rightTree.enableThreeStateCheckboxes(true);
		var tree = this.rightTree;
		$.get('system/allmenus', function(data) {
			var originalData = JSON.parse(JSON.stringify(data));
			(function _convert(nodes) {
				for ( var i = nodes.length - 1; i >= 0; i--) {
					var node = nodes[i];

					node.item = [];
					if (node.nodes) {
						node.item = node.nodes;
						delete node.nodes;
					}

					if (node.item.length == 0) {
						if (node.except) {
							nodes.splice(i, 1);
						}
					} else {
						_convert(node.item);
					}
				}

			})(data.nodes);

			tree.loadJSONObject({
				id : '-1',
				text : '^',
				item : [ {
					id : '0',
					text : '全部',
					item : data.nodes
				} ]
			});

			(function _bindData(nodes) {
				nodes.forEach(function(node) {
					if (node.except) {
						// 例外的 无需授权
						return;
					}
					var obj = JSON.parse(JSON.stringify(node));
					if (obj.nodes) {
						delete obj.nodes;
					}
					tree.setUserData(node.id, 'obj', obj);
					if (node.nodes) {
						_bindData(node.nodes);
					}
				});
			})(originalData.nodes);

			tree.openItem(0);
		});
	},
	eventComponent : function() {
		this.eventRightTree();
		this.eventToolbar();
		this.eventRoleForm();
	},
	eventRightTree : function() {
		var tree = this.rightTree;
		this.rightTree.attachEvent('onClick', function(id) {
			var node = tree.getUserData(id, 'obj');
			console.log(node);
		});
		$('#role-form .btn-expand').click(function() {
			var selectedItemId = tree.getSelectedItemId();
			if (!selectedItemId) {
				selectedItemId = 0;
			}
			tree.openAllItems(selectedItemId);
		});
		$('#role-form .btn-collapse').click(function() {
			var selectedItemId = tree.getSelectedItemId();
			if (!selectedItemId) {
				selectedItemId = 0;
			}
			tree.closeAllItems(selectedItemId);
		});
	},
	eventToolbar : function() {
		var reference = this;
		$(document).on('click', '#toolbar>button', function(e) {
			e.preventDefault();
			var id = $(this).attr('id');
			var node = sideMenu.getNode(id);
			if (reference[node.method]) {
				reference[node.method].call(reference, node.url);
			} else {
				console.log('can not find method called', node.method);
			}
		});
	},
	eventRoleForm : function() {
		var tree = this.rightTree;
		var reference = this;
		$('#role-form-modal .btn-save').click(function() {
			var role = $('#role-form').serializeObject();
			var _ids = tree.getAllChecked();
			if (_ids != '') {
				var ids = _ids.split(',');
				var index = 0;
				ids.forEach(function(id) {
					var obj = tree.getUserData(id, 'obj');
					if (!obj) {
						return;
					}
					if (obj.type == 'ACCORDION' || obj.except) {
						return;
					}
					role['rights[' + (index++) + '].aid'] = obj.id;
				});
			}

			$.ajax({
				url : $('#role-form').attr('action'),
				cache : false,
				async : false,
				type : 'post',
				data : role,
				beforeSend : function() {
					var validator = $('#role-form').kendoValidator({
						messages : {
							required : function() {
								return '必填项';
							}
						}
					}).data('kendoValidator');

					if (validator.validate() === false) {
						var errorMessages = $('.k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg');
						for ( var i = 0; i < errorMessages.length; i++) {
							var msg = errorMessages[i];
							$(msg).appendTo($(msg).closest('.form-group'));
						}
						return false;
					}

					return true;
				},
				error : function(e) {
					handleError(e);
				},
				success : function(response) {
					handleResult(response);
					if (response.status == 'SUCCESS') {
						$('#role-form-modal').modal('hide');
						reference.roleGrid.dataSource.read();
					}
				}
			});
		});
	},
	// method
	newRole : function(url) {
		this.resetRoleForm('NEW');
		this.writable(true);
		$('#role-form').attr('action', url);
		$('#role-form-modal').modal('show');
		$('#role-form-modal').animate({
			scrollTop : 0
		}, 800, function() {
			$(this).find('input[name=\'name\']').focus();
		});

	},
	modifyRole : function(url) {
		this.resetRoleForm('MODIFY');
		this.writable(true);

		var roles = getSelectedItem(this.roleGrid);
		if (roles.length == 0) {
			bootbox.alert('请选择一条记录！');
			return;
		}
		if (roles.length > 1) {
			bootbox.alert('只能选择一条记录！');
			return;
		}
		this.fillForm(roles[0]);

		$('#role-form').attr('action', url);
		$('#role-form-modal').modal('show');
		$('#role-form-modal').animate({
			scrollTop : 0
		}, 800, function() {
			$(this).find('input[name=\'name\']').focus();
		});

	},
	removeRole : function(url) {
		var roles = getSelectedItem(this.roleGrid);
		if (roles.length == 0) {
			bootbox.alert('至少选择一条记录！');
			return;
		}

		var names = [];
		var ids = [];

		for ( var i = 0; i < roles.length; i++) {
			names.push(roles[i].name);
			ids.push(roles[i].id);
		}

		var reference = this;
		bootbox.dialog({
			title : '确认删除',
			message : '确定要删除 [' + names.join('] [') + '] ？',
			buttons : {
				main : {
					label : '确定',
					className : 'btn-primary',
					callback : function() {
						$.ajax({
							url : url,
							cache : false,
							async : false,
							type : 'post',
							traditional : true,
							data : {
								ids : ids
							},
							error : function(e) {
								handleError(e);
							},
							success : function(response) {
								handleResult(response);
								reference.roleGrid.dataSource.read();
							}
						});
					}
				},
				cancel : {
					label : '取消',
					className : 'btn-cancel'
				}
			}
		});
	},
	viewRole : function(role) {
		this.resetRoleForm('VIEW');
		this.writable(false);
		this.fillForm(role);
		$('#role-form-modal').modal('show');
		$('#role-form-modal').animate({
			scrollTop : 0
		}, 800);
	},
	resetRoleForm : function(status) {
		$('#role-form-modal .modal-footer button').hide();

		var title = '新增角色';
		switch (status) {
		case 'NEW':
			title = '新增角色';
			$('#role-form-modal .modal-footer button.btn-cancel').show();
			$('#role-form-modal .modal-footer button.btn-save').show();
			break;
		case 'MODIFY':
			title = '编辑角色';
			$('#role-form-modal .modal-footer button.btn-cancel').show();
			$('#role-form-modal .modal-footer button.btn-save').show();
			break;
		case 'VIEW':
			title = '查看角色';
			$('#role-form-modal .modal-footer button.btn-okay').show();
			break;
		}

		$('#role-form-modal .modal-header>h4').html(title);

		this.clearForm();
	},
	clearForm : function() {
		$('#role-form')[0].reset();
		$('#role-form input[type="hidden"]').val('');
		$('.k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg').remove();

		var tree = this.rightTree;

		tree.closeAllItems(0);
		tree.openItem(0);

		var i = 1;
		(function _clearSelection() {
			if (i > 2) {
				return;
			}
			var ids = tree.getAllChecked();
			if (ids.length == 0) {
				return;
			} else {
				$($('#role-form #right-tree img')[1]).trigger('click');
				_clearSelection();
			}

		})();
	},
	writable : function(flag) {
		$('#role-form input[type=\'text\']').attr('disabled', !flag);
		$('#role-form textarea').attr('disabled', !flag);
		$('#role-form #right-tree').attr('disabled', !flag);

	},
	fillForm : function(role) {
		this.clearForm();
		if (!role) {
			return;
		}
		$('#role-form input[name=\'id\']').val(role.id);
		$('#role-form input[name=\'name\']').val(role.name);
		$('#role-form textarea[name=\'desc\']').val(role.desc);

		if (!role.rights) {
			return;
		}
		var rights = role.rights;
		var others = [];
		var tree = this.rightTree;
		console.log(rights.length);
		rights.forEach(function(right) {
			var obj = tree.getUserData(right.aid, 'obj');
			if (obj.type == 'TOOLBAR') {
				tree.setCheck(right.aid, true);
			} else {
				others.push(right);
			}
		});
		others.forEach(function(right) {
			var obj = tree.getUserData(right.aid, 'obj');
			if (!tree.hasChildren(right.aid)) {
				tree.setCheck(right.aid, true);
			}
		});
	}
// end method
};