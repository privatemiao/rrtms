$(function() {
	if (localStorage) {
		$('#loginId').val(localStorage.loginId);
		$('#password').val(localStorage.password);
	}
	$('#frm-login').unbind('submit').submit(function(e) {
		e.preventDefault();
		var $loginPage = $('#page-login'), data = {
			loginId : $loginPage.find('#loginId').val().trim(),
			password : $loginPage.find('#password').val().trim(),
		};

		if (data.loginId === '') {
			$loginPage.find('#loginId').focus();
			return;
		}
		if (data.password === '') {
			$loginPage.find('#password').focus();
			return;
		}

		generic.ajax({
			url : generic.variables.url.LOGIN_URL,
			data : data,
			cache : false,
			final : function(response) {
				console.log(response);
				if (response.status && response.status === 'SUCCESS') {
					if (localStorage) {
						localStorage.loginId = data.loginId;
						localStorage.password = data.password;
					}
					generic.service.clear();
					loadUser();
					// $.mobile.navigate('#page-home');
					generic.service.navigate({
						href : '#page-home',
						id : 'page-home',
						className : 'Home',
						title : '主页'
					});
				}
			}
		});
	});

	function loadUser() {
		generic.ajax({
			url : generic.variables.url.CURRENT_USER,
			final : function(user) {
				generic.variables.user = user;
			}
		});
	}
	;

	$('#template').find('a').unbind('click').click(function(e) {
		e.preventDefault();

		var data = {
			href : $(this).attr('href'),
			id : $(this).attr('href').substring(1),
			className : $(this).attr('data-obj'),
			title : $(this).text(), 
			transition : $(this).attr('data-transition')
		}, dataCache = $(this).attr('data-cache');

		if (dataCache !== undefined && dataCache === 'false') {
			data.cache = false;
		} else {
			data.cache = true;
		}
		console.log('navigate page ', JSON.stringify(data));
		generic.service.navigate(data);
	});

	$('.back-to-station').unbind('click').click(function() {
		$.mobile.navigate('#page-station');
		generic.service.navigate({
			href : '#page-station',
			id : 'page-station',
			className : 'Station',
			transition : 'slideup',
			title : '站点'
		});
	});
	
	$('#btn-logout').unbind('click').click(function(e){
		console.log('退出...');
		e.preventDefault();
		if (generic.service && generic.service.clear){
			generic.service.clear();
		}
		$.mobile.changePage('#page-login');
	});

	$('.datepicker').datepicker({
		dateFormat : 'yy-mm-dd'
	});
	
});