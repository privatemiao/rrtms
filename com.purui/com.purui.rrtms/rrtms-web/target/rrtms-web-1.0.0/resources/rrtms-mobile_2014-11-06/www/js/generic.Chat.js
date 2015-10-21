window.generic = window.generic || {};

generic.Chat = function(obj) {
	$.extend(this, obj);
	this.init();
};
generic.Chat.prototype = {
	destroy : function() {
		console.log("destroy ", this.title);
		$(document).off('pageshow', '#page-chat');
		if (this.ws && this.ws.destroy) {
			this.ws.destroy();
			this.ws = null;
		}
	},
	init : function() {
		console.log("init ", this.title);
		this.$message = this.$context.find('#message');
		this.$frm = this.$context.find('#frm-message');
		this.$listMessage = this.$context.find('#list-message');

		this.layout();
		this.initWebSocket();
		this.eventComponent();

		(function(reference) {
			$(document).off('pageshow', '#page-chat').on('pageshow', '#page-chat', function() {
				reference.$message.focus();
				showKeyboard();
			});
		})(this);
	},
	active : function() {
		console.log("active ", this.title);
		this.$message.focus();
	},
	stop : function() {
		console.log("stop ", this.title);
	},
	layout : function() {

	},
	initWebSocket : function() {
		var reference = this;

		this.ws = new generic.component.WebSocket({
			onerror : function(event) {
				generic.message.error(event.data);
			},
			onopen : function(event) {
				this.subscribe([ 'chat.public' ]);
			},
			onmessage : function(event) {
				var data = JSON.parse(event.data);
				if (!data.hasOwnProperty('sender')) {
					return;
				}

				if (data.id === generic.service.getCurrentUser().id) {
					reference.$listMessage.append('<li class="owner ui-li-static ui-body-inherit ui-last-child">' + data.message + '<i>我说</i></li>');
				} else {
					reference.$listMessage.append('<li class="publisher ui-li-static ui-body-inherit ui-last-child"><i>' + data.sender + '说</i>' + data.message + '</li>');
				}

				$(document).scrollTop($(document).height());

				reference.$message.val('').focus();
				showKeyboard();
			}
		});
	},
	eventComponent : function() {
		var reference = this;

		this.$frm.submit(function(e) {
			e.preventDefault();
			var msg = reference.$message.val().trim();
			if (msg === '') {
				return;
			}
console.log('发送消息 ' + msg);
			var message = {
				id : generic.service.getCurrentUser().id,
				message : msg,
				sender : generic.service.getCurrentUser().name,
				time : new Date().getTime()
			};
			if (reference.ws) {
				reference.ws.publish([ 'chat.public' ], JSON.stringify(message));
			}

			reference.$message.val('');
			reference.$message.focus();
			showKeyboard();
		});
	}
};