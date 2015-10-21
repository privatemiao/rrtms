//mui.init();

window.onload = function() {
	
	
			
	console.log('main page onload...');
	
	
	(function($) {
		$.plusReady(function() {
			generic.ajax({
				url: generic.variables.url.CURRENT_USER,
				error : function(){
					//generic.message.error('加载用户数据...出错!');
				},
				final: function(response) {
					console.log('用户数据>>' + JSON.stringify(response));
					localStorage.user = JSON.stringify(response);
					if(window.plus)
					plus.storage.setItem('user', JSON.stringify(response));
				}
			});
			
			generic.showPage();
			
			
			/*
			var anchors = document.querySelectorAll('a');
			console.log('anchors length ' + anchors.length);
			for (var i = 0; i < anchors.length; i ++){
				anchors[i].addEventListener('click', function(e){
					e.preventDefault();
					var href = this.getAttribute('href');
					//generic.openWindow(href);
					//generic.message.alert(href);
					generic.openWindowWithPre(href,href);
					
				});
			}
			*/
			$('body').on('tap', 'a', function(e) {
				
						var id = this.getAttribute('href');
						if (id) {
							if (~id.indexOf('.html')) {
								if (window.plus) {
									//侧滑导航涉及Index问题，需要单独处理；
									if (~id.indexOf('offcanvas-')) {
										$.openWindow({
											id: id,
											url: this.href,
											styles: {
												zindex: 9999
											},
											preload: true,
											
											
										});
									} else {
										$.openWindow({
											id: id,
											url: this.href,
											preload: true,
											show:{
												autoShow:true
											},
											waiting:{
                                             autoShow:true,//自动显示等待框，默认为true
                                             title:'loading...',//等待对话框上显示的提示内容
                                             }
										});
									}
								} else {
									document.location.href = this.href;
								}
							} else {
								if (typeof plus !== 'undefined') {
									plus.runtime.openURL(id);
								}
							}
						}
					
				
			});

		}); // mui.plusReady
	})(mui);


}; // window.onLoad