window.com = window.com || {};
window.com.rrtms = window.com.rrtms || {};
window.com.rrtms.system = window.com.rrtms.system || {};

com.rrtms.system.Diagram = function(station) {
	this.station = station;
	this.NAME = "接线图";
	this.ID = "Diagram";
};

com.rrtms.system.Diagram.prototype = {
	destroy : function() {
		console.log('destroy Diagram...');
		var contentWindow = this.CONTEXT.find('iframe')[0].contentWindow;
		if (contentWindow) {
			if (contentWindow.$.chartView && contentWindow.$.chartView.destroy) {
				contentWindow.$.chartView.destroy();
				contentWindow.$.chartView = null;
			}
		}
	},
	init : function() {
		this.CONTEXT = $('#station-tab #' + this.ID);
		this.loadPage();
	},
	loadPage : function() {
		this.CONTEXT.find('iframe').attr('src', '../../../system/station/' + this.station.code + '/chartviewpage?_=' + new Date().getTime());
	},
	active : function() {
		if (!this.CONTEXT){
			return;
		}
		var contentWindow = this.CONTEXT.find('iframe')[0].contentWindow;
		if (contentWindow) {
			if (contentWindow.$.chartView) {
				contentWindow.$.chartView.subscribeFromCanvas();
			}
		}
	},
	deactive : function() {
		var contentWindow = this.CONTEXT.find('iframe')[0].contentWindow;
		if (contentWindow) {
			if (contentWindow.$.chartView) {
				contentWindow.$.chartView.unsubscribe();
			}
		}
	}
};