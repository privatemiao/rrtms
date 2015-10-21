window.com = window.com || {};
com.rrtms = com.rrtms || {};
com.rrtms.system = com.rrtms.system || {};

com.rrtms.system.Security = function() {
	this.init();
};
com.rrtms.system.Security.prototype = {
	destroy : function() {
		console.log('destroy Security...');
		$(document).off('click', '#toolbar>button');

		if (this.securityGrid && this.securityGrid.destroy) {
			console.log('destroy securityGrid');
			this.securityGrid.destroy();
			this.securityGrid = null;
		}
	},
	init : function() {
		this.initComponent();
		this.eventComponent();
	},
	eventComponent : function() {
		this.eventToolbar();

		var reference = this;

		$('#security-code-modal-form').find('button.btn-save').click(function() {
			var item = $('#security-code-modal-form form').serializeObject();
			console.log(item);
			$.ajax({
				url : $('#security-code-modal-form form').attr('action'),
				data : item,
				traditional : true,
				error : handleError,
				success : function(response) {
					handleResult(response);
					if (response.status && response.status == 'SUCCESS') {
						reference.refreshSecurityGrid();
						$('#security-code-modal-form').modal('hide');
					}
				}
			});
		});
	},
	initComponent : function() {
		this.initSecurityGrid();
	},
	initSecurityGrid : function() {
		var reference = this;

		this.securityGrid = $('#security-grid').kendoGrid({
			sortable : true,
			resizable : true,
			height : $.GRID_HEIGHT,
			selectable : 'multiple',
			columns : [ {
				field : 'type',
				title : '类型',
				template : function(item) {
					switch (item.type) {
					case 'SWITCH':
						return '开关';
					default:
						return '未定义类型';
					}
				}
			}, {
				field : 'password',
				title : '口令'
			} ]
		}).data('kendoGrid');

		reference.refreshSecurityGrid();

		$('#security-grid').delegate('tbody>tr', 'dblclick', function(ev, a) {
			var item = $('#security-grid').data('kendoGrid').dataItem($(this));
			if (item) {
				reference.viewSecurity(item);
			}
		});
	},
	refreshSecurityGrid : function() {
		var reference = this;

		$.ajax({
			url : 'system/security/securitycodes',
			error : handleError,
			async : false,
			cache : false,
			success : function(response) {
				handleResult(response, true);
				reference.securityGrid.setDataSource(new kendo.data.DataSource({
					data : response
				}));
			}
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
	newSecurity : function(url) {
		this.clearForm();
		this.readOnly(false);
		$('#security-code-modal-form form').attr('action', url);
		$('#security-code-modal-form h4').html('新增安全口令');
		$('#security-code-modal-form').modal('show');
	},
	modifySecurity : function(url) {
		var items = getSelectedItem(this.securityGrid);
		if (items.length == 0) {
			bootbox.alert('请选择一条记录！');
			return;
		}

		if (items.length > 1) {
			bootbox.alert('只能选择一条记录！');
			return;
		}

		this.clearForm();
		this.readOnly(false);
		this.fillForm(items[0]);
		$('#security-code-modal-form form').attr('action', url);
		$('#security-code-modal-form h4').html('编辑安全口令');
		$('#security-code-modal-form').modal('show');
	},
	removeSecurity : function(url) {
		var reference = this;

		var items = getSelectedItem(this.securityGrid);

		if (items.length == 0) {
			bootbox.alert('请至少选择一条记录！');
			return;
		}

		var data = [];
		items.forEach(function(item) {
			data.push(item.id);
		});

		bootbox.dialog({
			message : "<span class='bigger-110'>确定要删除吗？</span>",
			buttons : {
				"danger" : {
					"label" : "删除",
					"className" : "btn-sm btn-danger",
					"callback" : function() {
						$.ajax({
							url : url,
							data : {
								id : data
							},
							traditional : true,
							error : handleError,
							success : function(response) {
								handleResult(response);
								if (response.status && response.status == 'SUCCESS') {
									reference.refreshSecurityGrid();
								}
							}
						});
					}
				},
				"click" : {
					"label" : "取消",
					"className" : "btn-sm btn-primary",
				}
			}
		});

	},
	viewSecurity : function(item) {
		this.readOnly(true);
		this.fillForm(item);
		$('#security-code-modal-form').modal('show');
	},
	clearForm : function() {
		$('#security-code-modal-form form')[0].reset();
		$('#security-code-modal-form').find('input[type=hidden]').val('');
	},
	fillForm : function(item) {
		if (!item) {
			return;
		}

		this.clearForm();
		$('#security-code-modal-form').find('input[name=id]').val(item.id);
		$('#security-code-modal-form').find('select[name=type]').val(item.type);
		$('#security-code-modal-form').find('input[name=password]').val(item.password);
	},
	readOnly : function(flag) {
		$('#security-code-modal-form').find('select[name=type]').attr('readOnly', flag);
		$('#security-code-modal-form').find('input[name=password]').attr('readOnly', flag);
		if (flag) {
			$('#security-code-modal-form').find('button.btn-save').hide();
			$('#security-code-modal-form').find('button.btn-okay').show();
		} else {
			$('#security-code-modal-form').find('button.btn-save').show();
			$('#security-code-modal-form').find('button.btn-okay').hide();
		}
	}
};