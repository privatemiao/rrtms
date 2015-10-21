window.generic = window.generic || {};

generic.Station = function(obj) {
	$.extend(this, obj);
	this.status = 'VIRGIN';
	this.init();
};

generic.Station.prototype = {
	init : function() {
		console.log('init ' + this.title);
		this.$listStation = this.$context.find('#list-station');
		this.loadStations();
		this.eventStation();
	},
	destroy : function() {
		console.log('destroy ' + this.title);

		$(document).off('click', this.href + ' #list-station a');
	},
	active : function() {
		console.log('active ' + this.title);
		if (this.status === 'VIRGIN') {
			this.status = 'GIRTY';
			return;
		}
		this.checkStationStatus();
	},
	stop : function() {
		console.log('stop ' + this.title);
	},
	loadStations : function() {
		var buffer = [];
		generic.variables.user.stations.forEach(function(station) {
			buffer.push('<li><a class="ui-btn ui-btn-icon-right ui-icon-carat-r" href="#" data-code="' + station.code + '"><i class="fa fa-stop pull-left"></i>' + station.name + '</a></li>');
		});
		if (buffer.length > 0) {
			this.$listStation.empty().append(buffer.join(''));
			this.checkStationStatus();
		}
	},
	eventStation : function() {
		$(document).off('click', this.href + ' #list-station a').on('click', this.href + ' #list-station a', function(e) {
			e.preventDefault();

			generic.variables.currentCode = $(this).attr('data-code');

			generic.service.navigate({
				href : '#page-summary',
				id : 'page-summary',
				className : 'Summary',
				title : '概要',
				cache : false,
				transition : 'slidedown'
			});
		});
	},
	checkStationStatus : function() {
		var reference = this;

		generic.variables.user.stations.forEach(function(station) {
			console.log(station);
			generic.ajax({
				url : 'http://' + generic.variables.SERVER_IP + '/system/station/' + station.code + '/run',
				data : {
					code : station.code
				},
				error : function(e) {
					console.log(e.status + " - " + (e.statusText || e.message));
				},
				final : function(response) {
					if (response) {
						if (response.runStatus === 1) {
							if (new Date().getTime() - response.atTime < 60000) {
								reference.$listStation.find('a[data-code=' + station.code + ']').find('.fa').removeClass('fa-play').removeClass('fa-stop').addClass('fa-play');
								return;
							}
						}
					}

					reference.$listStation.find('a[data-code=' + station.code + ']').find('.fa').removeClass('fa-play').removeClass('fa-stop').addClass('fa-stop');
				}
			});
		});
	}
};