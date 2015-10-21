window.generic = window.generic || {};

generic.Message = function(obj) {
	$.extend(this, obj);

	this.$messageDialog = $('#page-message-dialog');
	this.$title = this.$messageDialog.find('#title');
	this.$content = this.$messageDialog.find('#content');
	this.$btnPublish = this.$messageDialog.find('.btn-publish');
	this.$btnCancel = this.$messageDialog.find('.btn-cancel');
	this.$btnOkay = this.$messageDialog.find('.btn-okay');
	this.$btnPopPublish = this.$context.find('#pop-publish');
	this.$listView = this.$context.find('[data-role=listview]');

	this.$btnOkay = this.$messageDialog.find('.btn-okay');
	this.$btnCancel = this.$messageDialog.find('.btn-cancel');

	this.init();
};

generic.Message.prototype = {
	destroy : function() {
		console.log('destroy ' + this.title);

		$(this.$context).off('click', '.message-pop-info');
	},
	init : function() {
		console.log('init ' + this.title);
				
		(function(reference) {
			generic.variables.user.securityUser.roles.forEach(function(e){
				if (e.name === 'administrator'){
					console.log('管理员')
					reference.$btnPopPublish.show();
				}
			});
			
			$(document).off('pageshow', '#page-message-dialog').on('pageshow', '#page-message-dialog', function() {
				reference.$title.focus();
				showKeyboard();
			});
		})(this);

		this.initComponent();
		this.eventComponent();
	},
	active : function() {
		console.log('active ' + this.title);

		this.loadData({
			skip : 0
		});
	},
	stop : function() {
		console.log('stop ' + this.title);
		this.destroy();
	},
	initComponent : function() {
		this.loadData();
	},
	loadData : function(param) {
		var data = {
			sortBy : 'insertTime',
			orderBy : 'DESC'
		};

		$.extend(data, param);

		this.queryData = data;

		if (!this.queryData.hasOwnProperty('skip')) {
			this.queryData.skip = 0;
		}

		if (!this.queryData.hasOwnProperty('count')) {
			this.queryData.count = 10;
		}

		(function(reference) {
			generic.ajax({
				url : generic.variables.url.MESSAGE_LIST,
				data : data,
				final : function(response) {
					var buffer = [];
					response.data.forEach(function(e) {
						buffer.push(reference.genItem(e));
					});

					if (!data.skip || data.skip === 0) {
						reference.$listView.empty();
					}

					if (buffer.length === 0) {
						return;
					}

					if (response.maxCount > response.skip + response.count) {
						buffer.push('<li  class="ui-li-static ui-body-inherit" style="text-align:center;"><a id="btn-message-more">更多（' + (response.maxCount - response.count - response.skip) + '/'
								+ response.maxCount + '）...</a></li>');
					}

					reference.$listView.append(buffer.join(''));
					reference.$listView.listview('refresh');

				}
			});
		})(this);
	},
	eventComponent : function() {
		(function(reference) {
			$(reference.$context).off('click', '.message-pop-info').on('click', '.message-pop-info', function() {
				reference.dialogReadOnly(true);

				var $prev = $(this).prev();
				reference.$title.val($prev.find('h3').text());
				reference.$title.attr('data-clear-btn', 'false');
				reference.$content.val($prev.find('p').text());

				$.mobile.changePage('#page-message-dialog', {
					transition : 'pop'
				});
			});

			reference.$btnPopPublish.unbind('click').click(function() {
				reference.dialogReadOnly(false);

				reference.$title.val('');
				reference.$title.attr('');
				reference.$content.val('');

				$.mobile.changePage('#page-message-dialog', {
					transition : 'pop'
				});
			});

			reference.$btnPublish.unbind('click').click(function() {
				reference.$title.val(reference.$title.val().trim());
				reference.$content.val(reference.$content.val().trim());

				if (reference.$title.val() === '') {
					generic.message.alert('请输入标题！');
					reference.$title.focus();
					return;
				}

				if (reference.$content.val() === '') {
					generic.message.alert('请输入内容！');
					reference.$content.focus();
					return;
				}

				generic.ajax({
					url : generic.variables.url.MESSAGE_PUBLISH,
					data : {
						title : reference.$title.val(),
						content : reference.$content.val()
					},
					final : function(response) {
						if (response.result) {
							$.mobile.changePage(reference.href);

							reference.$listView.prepend(reference.genItem(response.result));
							reference.$listView.listview('refresh');
						}
					}
				});
			});

			$(document).off('click', '#btn-message-more').on('click', '#btn-message-more', function() {
				reference.queryData.skip += reference.queryData.count;
				reference.loadData(reference.queryData);
				$(this).animate({
					height : 0
				}, 500, "linear", function() {
					$(this).parent().remove();
				})
			});

			reference.$btnOkay.unbind('click').click('click', function() {
				$.mobile.changePage(reference.href);
			});

			reference.$btnCancel.unbind('click').click('click', function() {
				$.mobile.changePage(reference.href);
			});
		})(this);

	},
	genItem : function(obj) {
		if (!obj) {
			return '';
		}

		var html = '';
		html += '<li>';
		html += '<a href="#">';
		html += '<h3>' + obj.title + '</h3>';
		html += '<p>' + obj.content + '</p>';
		html += '<p class="ui-li-aside"><strong>' + dateTimeFormat(new Date(obj.insertTime)) + '</strong></p>';
		html += '</a>';
		html += '<a class="message-pop-info">查看</a>';
		html += '</li>';

		return html;
	},
	dialogReadOnly : function(flag) {
		this.$title.attr('readonly', flag);
		this.$content.attr('readonly', flag);

		if (flag === true) {
			this.$btnPublish.hide();
			this.$btnCancel.hide();
			this.$btnOkay.show();
		} else {
			this.$btnPublish.show();
			this.$btnCancel.show();
			this.$btnOkay.hide();
		}
	}
};