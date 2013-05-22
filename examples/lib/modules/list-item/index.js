
var ListItem = fruitmachine.define({
	name: 'list-item',
	template: templateListItem,

	setup: function() {
		var self = this;
		this.button = this.el.querySelector('.list-item_close-button');
		this.button.addEventListener('click', function() {
			self.fire('closebuttonclick', self);
		});
	}
});