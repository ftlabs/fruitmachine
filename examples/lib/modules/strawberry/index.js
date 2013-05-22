
var Strawberry = fruitmachine.define({
	name: 'strawberry',
	template: templateStrawberry,

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