FruitMachine.View.extend('strawberry', {

	initialize: function() {
		this.on('setup', this.onSetup, this);
		this.on('destroy', this.onDestroy, this);
	},

	onSetup: function() {
		this.delegate = new Delegate(this.el);
		this.onDeleteButtonClick_d = this.onDeleteButtonClick.bind(this);
		this.delegate.on('click', '.js-delete-item', this.onDeleteButtonClick_d);
	},

	onDestroy: function() {
		this.delegate.off();
		this.delegate = null;
	},

	onDeleteButtonClick: function(event, target) {
		if (!confirm('Delete item?')) return;
		this.destroy();
	}
});