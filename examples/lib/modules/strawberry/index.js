
var Strawberry = FruitMachine.define({
	module: 'strawberry',
	template: templates.strawberry,

	setup: function() {
		var self = this;
		this.form = this.el.querySelector('form');
		this.form.addEventListener('submit', function(event) {
			event.preventDefault();
			var field = self.form[0];
			self.fire('submit', field.value);
			field.value = '';
		});
	}
});