mui.init();


	
	window.onload =function(){
			
	console.log('main page onload...');
	
	(function($) {
		$.plusReady(function() {
			
			generic.ajax({
				url: generic.variables.url.CURRENT_USER,
				error : function(){
					generic.message.error('加载用户数据...出错!');
				},
				final: function(response) {
					try
					{
					console.log('用户数据>>' + JSON.stringify(response));
					localStorage.user = JSON.stringify(response);
					plus.storage.setItem('user', JSON.stringify(response));
					
					}catch(e)
					{
						alert(e);
					}
					
				
					
				}
			});
			
			generic.showPage();
			
			var anchors = document.querySelectorAll('a');
			console.log('anchors length ' + anchors.length);
			for (var i = 0; i < anchors.length; i ++){
				anchors[i].addEventListener('click', function(e){
					try{
						
						//e.preventDefault();
					var href = this.getAttribute('href');
					
					generic.openWindow(href);
					
					}catch(ex){
						//TODO handle the exception
						generic.message.alert(ex);
					}
					
					
				});
			}
						
			

		}); // mui.plusReady
	})(mui);

};//window
