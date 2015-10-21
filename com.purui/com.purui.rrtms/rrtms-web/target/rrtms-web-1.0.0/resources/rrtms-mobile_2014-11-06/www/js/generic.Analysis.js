window.generic = window.generic || {};

generic.Analysis = function(obj) {
	$.extend(this, obj);
	this.init();
};
generic.Analysis.prototype = {
	destroy : function() {
		console.log('destroy ' + this.title);

		$(document).off('pageshow', this.href);
	},
	init : function() {
		console.log('init ' + this.title);

//		var reference = this;
//		$(document).off('pageshow', this.href).on('pageshow', this.href, function() {
//			reference.$context.find('div[data-role=navbar]').find('a[href=' + reference.href + ']').removeClass('ui-btn-active').addClass('ui-btn-active');
//		});
	},
	active : function() {
		console.log('active' + this.title);
	},
	stop : function() {
		console.log('stop ' + this.title);
		this.destroy();
	}

};