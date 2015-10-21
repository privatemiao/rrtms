var profile = (function() {
	var user = null;
	$.get('system/user/current', function(response) {
		user = response;
	});
	var CONTEXT = $('#user-profile-modal-form');

	CONTEXT.find('[data-rel=tooltip]').tooltip();
	$('.link-user-profile').click(function() {
		console.log(user);
		fillForm();
		$('#user-profile-modal-form').modal('show');
	});

	$('#user-profile-modal-form .btn-save').click(function() {
		var profile = $('#user-profile-modal-form form').serializeObject();
		
		if (!profile.name){
			bootbox.alert('姓名不能为空！');
			return;
		}
		
		if (profile.password != profile.repass){
			bootbox.alert('两次密码比系一致！');
			return;
		}
		
		$.ajax({
			url : 'system/user/profile',
			cache : false,
			type : 'POST',
			data : profile,
			error : handleError,
			success : function(response) {
				handleResult(response);
				if (response.status && response.status == 'SUCCESS'){
					$('#user-profile-modal-form').modal('hide');
				}
			}
		});
	});

	function fillForm() {
		$('#user-profile-modal-form form')[0].reset();
		$('#user-profile-modal-form form input[type="hidden"]').val('');

		var form = $('#user-profile-modal-form form');
		if (user) {
			$(form).find('input[name="id"]').val(user.id);
			$(form).find('input[name="securityUser.loginId"]').val(user.securityUser.loginId);

			var statusDesc = '未知状态';
			switch (user.securityUser.status) {
			case 'AUDIT':
				statusDesc = '审核';
				break;
			case 'NORMAL':
				statusDesc = '正常';
				break;
			case 'FORBID':
				statusDesc = '禁用';
				break;
			case 'DEPARTURE':
				statusDesc = '离职';
				break;
			case 'PURGED':
				statusDesc = '已删除';
				break;

			}
			$(form).find('input[name="securityUser.status"]').val(statusDesc);
			$(form).find('input[name="name"]').val(user.name);
			$(form).find('input[name="email"]').val(user.email);
			$(form).find('input[name="mobile"]').val(user.mobile);
		}

	}

	return {
		reload : function() {
			user = $.get('system/user/current');
		}
	};
})();