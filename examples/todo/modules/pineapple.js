FruitMachine.View.extend('pineapple', {

	initialize: function() {
		var self = this;
		this.els = {};

		// Bind the view context to this function.
		this.onFormSubmitBound = function() { self.onFormSubmit.apply(self, arguments); };
		this.on('setup', this.onSetup, this);
	},

	onSetup: function() {
		this.els.form = this.el.querySelector('.module-pineapple_form');
		this.els.input = this.el.querySelector('.module-pineapple_input');
		this.els.form.addEventListener('submit', this.onFormSubmitBound);
	},

	onTeardown: function() {
		this.els.form.removeEventListener('submit', this.onFormSubmitBound);
		this.els = null;
	},

	onFormSubmit: function(event, target) {
		event.preventDefault();
		this.trigger('formsubmit', this.els.input.value);
	}
});