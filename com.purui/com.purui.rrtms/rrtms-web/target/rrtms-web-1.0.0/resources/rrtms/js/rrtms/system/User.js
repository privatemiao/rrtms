com.rrtms.system.User = function() {
	this.init();
};
com.rrtms.system.User.prototype = {
	destroy : function() {
		console.log('destroy...');
		if (this.userGrid != null) {
			console.log('destroy userGrid');
			this.userGrid.destroy();
			this.userGrid = null;
		}
		if (this.companyGrid != null) {
			console.log('destroy companyGrid');
			this.companyGrid.destroy();
			this.companyGrid = null;
		}

		$(document).off('click', '#toolbar>button');
		$('.date-picker').datepicker('remove');
		$('.btn-clear-birthday').off();
		$('.btn-clear-hireDate').off();
		$('.btn-clear-company').off();
		$('.btn-pop-company').off();

		if (this.stationGrid && this.stationGrid.destroy) {
			this.stationGrid.destroy();
			this.stationGrid = null;
		}

		if (this.stationChooserGrid && this.stationChooserGrid.destroy) {
			this.stationChooserGrid.destroy();
			this.stationChooserGrid = null;
		}
	},
	init : function() {
		this.initComponent();
		this.eventComponent();
	},
	// init component
	initComponent : function() {
		this.initUserGrid();
		this.initRoleSelector();
		this.initDatePicker();
		this.initCompanyGrid();

		this.initStationGrid();
		this.initChooserGrid();
	},
	initChooserGrid : function() {
		this.stationChooserGrid = $('#station-chooser-grid').kendoGrid({
			dataSource : {
				pageSize : 10,
				type : 'json',
				serverPaging : true,
				serverSorting : true,
				transport : {
					read : {
						url : 'system/station/stations',
						type : 'POST',
						cache : false
					},
					parameterMap : function(params) {
						var obj = {};
						obj.param = $('#station-modal input[name="param"]').val();
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
			height : 300,
			pageable : {
				refresh : true,
				pageSizes : true,
				numeric : true
			},
			selectable : 'multiple',
			columns : [ {
				field : 'id',
				title : '',
				hidden : true
			}, {
				field : 'name',
				width : 250,
				title : '名称',
				template : function(item) {
					if (item.hasOwnProperty('name')) {
						return item.name;
					} else {
						return '';
					}
				}
			}, {
				field : 'company.name',
				width : 250,
				title : '公司',
				template : function(item) {
					if (item.hasOwnProperty('company')) {
						if (item.company && item.company.hasOwnProperty('name')) {
							return item.company.name;
						} else {
							return '';
						}
					} else {
						return '';
					}
				}
			} ]
		}).data('kendoGrid');

		var reference = this;
		$('#station-modal #grid-filter-form').submit(function(e) {
			e.preventDefault();
			reference.stationChooserGrid.dataSource.page(1);
		});
	},
	initStationGrid : function() {
		this.stationGrid = $('#station-grid').kendoGrid({
			// selectable : 'row',
			columns : [ {
				hidden : true,
				field : 'id',
				title : '编号'
			}, {
				field : 'name',
				title : '名称'
			}, {
				command : {
					className : 'grid-command',
					text : 'X',
					click : function(e) {
						var item = this.dataItem($(e.currentTarget).closest("tr"));
						this.dataSource.remove(item);
					}
				},
				width : 50
			} ]
		}).data('kendoGrid');

	},
	initCompanyGrid : function() {
		this.companyGrid = $("#company-grid").kendoGrid({
			dataSource : {
				pageSize : 10,
				type : "json",
				serverPaging : true,
				serverSorting : true,
				transport : {
					read : {
						url : "system/companys",
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
			height : 300,
			dataBound : function() {
				$("#company-grid").height(300);
			},
			pageable : {
				refresh : true,
				pageSizes : true,
				numeric : false
			},
			selectable : "row",
			columns : [ {
				field : "name",
				title : "名称"
			}, {
				field : "industry.name",
				title : "行业",
				template : function(item) {
					if (item.hasOwnProperty('industry')) {
						return item.industry.name;
					}
					return '';
				}
			}, {
				field : "org.name",
				width : 70,
				title : "所在城市",
				template : function(item) {
					if (item.hasOwnProperty('org')) {
						return item.org.name;
					}
					return '';
				}
			}, {
				field : "no",
				width : 70,
				title : "企业编号"
			}, {
				field : "cno",
				width : 80,
				title : "营销号"
			} ]
		}).data("kendoGrid");
		var reference = this;
		$("#company-grid").delegate("tbody>tr", "dblclick", function(ev, a) {
			$('#company-modal .btn-okay').trigger('click');
		});
	},
	initDatePicker : function() {
		$('.date-picker').datepicker({
			autoclose : true
		}).next().on(ace.click_event, function() {
			$(this).prev().focus();
		});
	},
	initRoleSelector : function() {
		var roles = null;
		$.ajax({
			url : 'system/roles',
			cache : true,
			async : false,
			error : function(e) {
				handleError(e);
			},
			success : function(response) {
				roles = response;
			}
		});

		if (roles == null || roles.length == 0) {
			return;
		}

		roles.forEach(function(role) {
			$('#user-form #roles').append('<option value=\'' + role.id + '\'>' + role.name + '</option>');
		});
	},
	initUserGrid : function() {
		this.userGrid = $('#user-grid').kendoGrid({
			dataSource : {
				pageSize : 10,
				type : 'json',
				serverPaging : true,
				serverSorting : true,
				transport : {
					read : {
						url : 'system/user/users',
						type : 'POST',
						cache : false
					},
					parameterMap : function(params) {
						var obj = {};
						obj.param = $('#search-param').val();
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
				width : 120,
				title : '姓名'
			}, {
				field : 'securityUser.loginId',
				width : 100,
				title : '登录名'
			}, {
				field : 'userType',
				width : 100,
				title : '类型',
				template : function(item) {
					switch (item.userType) {
					case 'GOVERNMENT':
						return '政府用户';
					case 'ENTERPRISE':
						return '企业用户';
					case 'INTERNAL':
						return '内部员工';
					case 'POWER':
						return '供电公司';
					case 'PROVIDER':
						return '服务商';
					}
				}
			}, {
				field : 'securityUser.status',
				width : 100,
				title : '状态',
				template : function(item) {
					switch (item.securityUser.status) {
					case 'AUDIT':
						return '审核';
					case 'NORMAL':
						return '正常';
					case 'FORBID':
						return '禁用';
					case 'DEPARTURE':
						return '离职';
					case 'PURGED':
						return '删除';
					}
				}
			}, {
				field : 'gender',
				width : 55,
				title : '性别',
				template : function(item) {
					switch (item.gender) {
					case 'MALE':
						return '男';
					case 'FEMALE':
						return '女';
					default:
						return '';
					}
				}
			}, {
				field : 'email',
				width : 200,
				title : '邮箱'
			}, {
				field : 'mobile',
				width : 150,
				title : '电话'
			}, {
				field : 'company.name',
				title : '公司',
				template : function(item) {
					if (item.company) {
						return item.company.name;
					}
					return '';
				}
			} ]
		}).data('kendoGrid');

		var reference = this;
		$('#user-grid').delegate('tbody>tr', 'dblclick', function(ev, a) {
			var item = $('#user-grid').data('kendoGrid').dataItem($(this));
			if (item) {
				reference.viewUser(item);
			}
		});
	},
	// end init component

	// event component
	eventComponent : function() {
		this.eventToolbar();
		this.eventGlobalSearch();
		this.eventUserForm();
		this.eventUserTypeSelector();
		this.eventCompanySelector();
		this.setPlusButton();
		this.eventPlusButton();
		this.eventChooserGridButton();
	},
	eventChooserGridButton : function() {
		var reference = this;
		$('#station-modal button.btn-okay').click(function() {
			var items = getSelectedItem(reference.stationChooserGrid);
			var dataSource = reference.stationGrid.dataSource;
			items.forEach(function(item) {
				for (var i = 0; i < dataSource.data().length; i++) {
					if (dataSource.data()[i].id == item.id) {
						return;
					}
				}
				dataSource.add(item);
			});
			$('#station-modal').modal('hide');
		});
	},
	eventPlusButton : function() {
		var reference = this;
		$('#btn-pop-stations>button').click(function() {
			$('#station-modal').modal('show');
			reference.stationChooserGrid.refresh();
		});
	},
	setPlusButton : function() {
		var reference = this;
		$('#user-form-modal').on('show.bs.modal', function() {
			setTimeout(function() {
				reference.stationGrid.refresh();
				$('#btn-pop-stations').offset({
					top : $('#btn-pop-stations').prev().offset().top,
					left : $('#btn-pop-stations').prev().offset().left + $('#btn-pop-stations').prev().width() - $('#btn-pop-stations').width()
				});
			}, 2000);
		});
	},
	eventCompanySelector : function() {
		var reference = this;

		$('#company-modal .btn-okay').click(function(e) {
			e.preventDefault();
			var companys = getSelectedItem(reference.companyGrid);
			if (companys.length == 0) {
				bootbox.alert('请选择公司！');
				return;
			}

			$('#user-form input[name=\'company.id\']').val(companys[0].id);
			$('#user-form input[name=\'company.name\']').val(companys[0].name);

			$('#company-modal').modal('hide');
		});
	},
	eventUserTypeSelector : function() {
		var reference = this;
		$('#user-form select[name=\'userType\']').change(function() {
			if ($(this).val() != 'ENTERPRISE') {
				reference.clearCompany();
			}
		});
	},
	eventUserForm : function() {
		var reference = this;
		$('#user-form-modal .btn-save').click(function() {
			var user = $('#user-form').serializeObject();

			// merge roles
			if (user.hasOwnProperty('roles')) {
				if (user.roles != null || user.roles.length > 0) {
					for (var i = 0; i < user.roles.length; i++) {
						user['securityUser.roles[' + i + '].id'] = user.roles[i];
					}
				}
				delete user.roles;
			}

			// merge stations
			var stations = reference.stationGrid.dataSource.data();
			for (var i = 0; i < stations.length; i++) {
				user['stations[' + i + '].id'] = stations[i].id;
			}

			$.ajax({
				url : $('#user-form').attr('action'),
				type : 'post',
				data : user,
				async : false,
				cache : false,
				beforeSend : function() {
					var validator = $('#user-form').kendoValidator({
						rules : {
							repwdchk : function(input) {
								var name = $(input).attr('name');
								if (name == 'repass') {
									var pass = $('#user-form input[name=\'securityUser.password\']').val();
									var repass = $('#user-form input[name=\'repass\']').val();
									if (pass != repass) {
										return false;
									}
								}

								return true;
							},

							emailchk : function(input) {
								var name = $(input).attr('name');
								if (name == 'email') {
									var val = $(input).val();
									if (val) {
										var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
										return re.test(val);
									}
								}
								return true;
							},
							companychk : function(input) {
								var name = $(input).attr('name');
								if (name == 'company.id') {
									if (user.userType == 'ENTERPRISE') {
										if ($(input).val() == '') {
											return false;
										}
									}
								}
								return true;
							}
						},
						messages : {
							required : function(input) {
								return '必填项';
							},
							repwdchk : function(input) {
								return '两次输入的密码必须一致！';
							},
							emailchk : function(input) {
								return '格式错误！';
							},
							companychk : function(input) {
								return '必填项';
							}
						}
					}).data('kendoValidator');
					if (validator.validate() === false) {
						var movedError = $('span[data-for=\'company.id\']');
						$(movedError).appendTo($('#user-form input[name=\'company.name\']').parent());

						var errorMessages = $('.k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg');
						for (var i = 0; i < errorMessages.length; i++) {
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
						reference.userGrid.dataSource.read();
						$('#user-form-modal').modal('hide');
					}
				}
			});
		});
	},
	eventGlobalSearch : function() {
		var reference = this;
		$('.nav-search .form-search').submit(function(e) {
			e.preventDefault();
			reference.userGrid.dataSource.page(1);
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
	// end event component

	// method
	newUser : function(url) {
		this.resetForm('NEW');
		this.writable(true);
		$('#user-form').attr('action', url);
		$('#user-form-modal').modal('show');
		$('#user-form-modal').animate({
			scrollTop : 0
		}, 800, function() {
			$(this).find('input[name=\'securityUser.loginId\']').focus();
		});
	},
	modifyUser : function(url) {
		this.resetForm('MODIFY');
		this.writable(true);

		var users = getSelectedItem(this.userGrid);
		if (users.length == 0) {
			bootbox.alert('请选择一条记录！');
			return;
		}
		if (users.length > 1) {
			bootbox.alert('只能选择一条记录！');
			return;
		}
		this.fillUserForm(users[0]);

		$('#user-form').attr('action', url);
		$('#user-form-modal').modal('show');
		$('#user-form-modal').animate({
			scrollTop : 0
		}, 800, function() {
			$(this).find('input[name=\'securityUser.loginId\']').focus();
		});
	},
	removeUser : function(url) {
		var users = getSelectedItem(this.userGrid);
		if (users.length == 0) {
			bootbox.alert('至少选择一条记录！');
			return;
		}

		var names = [];
		var ids = [];
		for (var i = 0; i < users.length; i++) {
			names.push(users[i].name);
			ids.push(users[i].id);
		}

		var reference = this;
		bootbox.dialog({
			title : '确认删除',
			message : '确定要删除 [' + names.join('] [') + '] ?',
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
								reference.userGrid.dataSource.read();
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
	viewUser : function(user) {
		this.resetForm('VIEW');
		this.writable(false);
		$('#user-form-modal').modal('show');
		$('#user-form-modal').animate({
			scrollTop : 0
		}, 800);
		this.fillUserForm(user);
	},
	resetForm : function(status) {
		$('#user-form-modal .modal-footer button').hide();

		var title = '新增用户';
		switch (status) {
		case 'NEW':
			title = '新增用户';
			$('#user-form-modal .modal-footer button.btn-cancel').show();
			$('#user-form-modal .modal-footer button.btn-save').show();
			break;
		case 'MODIFY':
			title = '编辑用户';
			$('#user-form-modal .modal-footer button.btn-cancel').show();
			$('#user-form-modal .modal-footer button.btn-save').show();
			break;
		case 'VIEW':
			title = '查看用户';
			$('#user-form-modal .modal-footer button.btn-okay').show();
			break;
		}

		$('#user-form-modal .modal-header>h4').html(title);

		this.clearForm();

	},
	clearForm : function() {
		$('#user-form')[0].reset();
		$('#user-form select').val('');
		$('#user-form input[type="hidden"]').val('');

		$('.k-widget.k-tooltip.k-tooltip-validation.k-invalid-msg').remove();
		this.stationGrid.setDataSource(new kendo.data.DataSource({
			data : []
		}));
	},
	fillUserForm : function(user) {
		this.clearForm();
		if (user == null) {
			return;
		}

		$('#user-form input[name=\'securityUser.loginId\']').val(user.securityUser.loginId);

		var roleIds = [];
		user.securityUser.roles.forEach(function(role) {
			roleIds.push(role.id);
		});
		if (roleIds.length > 0) {
			$('#user-form select[name=\'roles\']').val(roleIds);
		}

		$('#user-form select[name=\'securityUser.status\']').val(user.securityUser.status);
		$('#user-form input[name=\'name\']').val(user.name);
		$('#user-form select[name=\'gender\']').val(user.gender);
		$('#user-form input[name=\'birthday\']').val(user.birthday);
		$('#user-form input[name=\'hireDate\']').val(user.hireDate);
		$('#user-form input[name=\'email\']').val(user.email);
		$('#user-form input[name=\'mobile\']').val(user.mobile);
		$('#user-form input[name=\'address\']').val(user.address);
		$('#user-form select[name=\'userType\']').val(user.userType);
		if (user.company) {
			$('#user-form input[name=\'company.name\']').val(user.company.name);
		}

		// set hidden item
		$('#user-form input[name=\'id\']').val(user.id);
		$('#user-form input[name=\'securityUser.id\']').val(user.securityUser.id);
		if (user.company) {
			$('#user-form input[name=\'company.id\']').val(user.company.id);
		}

		this.stationGrid.setDataSource(new kendo.data.DataSource({
			data : user.stations
		}));
	},
	writable : function(flag) {
		$('#user-form input[type=\'text\']').attr('disabled', !flag);
		$('#user-form input[type=\'password\']').attr('disabled', !flag);
		$('#user-form select').attr('disabled', !flag);

		var reference = this;
		if (flag) {
			$('.btn-clear-birthday').off().on('click', this.clearBirthday);
			$('.btn-clear-hireDate').off().on('click', this.clearHireDate);
			$('.btn-clear-company').off().on('click', this.clearCompany);
			$('.btn-pop-company').off().on('click', function() {
				reference.popupCompany.call(reference);
			});

			reference.stationGrid.showColumn(2);
			$('#btn-pop-stations').show();
		} else {
			$('.btn-clear-birthday').off();
			$('.btn-clear-hireDate').off();
			$('.btn-clear-company').off();
			$('.btn-pop-company').off();

			reference.stationGrid.hideColumn(2);
			$('#btn-pop-stations').hide();
		}
	},
	clearBirthday : function() {
		console.log('清空生日');
		$('#user-form input[name=\'birthday\']').val('');
	},
	clearHireDate : function() {
		console.log('清空雇用日期');
		$('#user-form input[name=\'hireDate\']').val('');
	},
	clearCompany : function() {
		console.log('清空公司');
		$('#user-form input[name=\'company.id\']').val('');
		$('#user-form input[name=\'company.name\']').val('');
	},
	popupCompany : function() {
		console.log(this);
		this.companyGrid.dataSource.page(1);
		$('#company-modal').modal('show');
	}
	// end method
	,
	getReference : function() {
		return this;
	}
};