var globalWarning = (function() {
	if (!user || !user.stations || user.stations.length == 0) {
		return;
	}

	var ws = new com.component.WebSocket({
		onmessage : function(event) {
			var data = JSON.parse(event.data);

			if (!data.hasOwnProperty('MsgGuid')) {
				return;
			}

			var url = 'system/station/' + data.StationCode + '/detail?_=' + new Date().getTime();

			var buffer = [];
			buffer.push('<li guid="' + data.MsgGuid + '" code="' + data.StationCode + '">');
			buffer.push('<a href="'+url+'" target="_blank">');
			buffer.push('<div class="clearfix">');
			buffer.push('<span class="pull-left">');
			buffer.push('<i class="btn btn-xs no-hover icon-warning-sign bigger-120"></i>');
			buffer.push(codeIndex[data.StationCode] + '|' + data.EventTypeName + '|' + dateTimeFormat(new Date(data.Atime)));
			buffer.push('</span></div></a></li>');

			$('#global-warning').prepend(buffer.join(''));
			$('#global-warning').find('li:nth-child(2)').prependTo($('#global-warning'));
			$('#warnAudio')[0].play();
			checkLength();
		}
	});

	function checkLength() {
		(function _check() {
			var lis = $('#global-warning').find('li');
			if (lis.length > 12) {
				$(lis[lis.length - 2]).remove();
				_check();
			}
		})();
	}

	var channel = [], codeIndex = {};
	user.stations.forEach(function(station) {
		channel.push('warns.' + station.code);
		codeIndex[station.code] = station.name;
	});
	setTimeout(function() {
		ws.subscribe(channel);
	}, 5000);
})();