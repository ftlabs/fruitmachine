
var Apple = FruitMachine.define({
	module: 'apple',
	template: templateApple,

	setup: function() {
		var self = this;
		this.delegate = new Delegate(this.el);
		this.delegate.on('click', '.apple-item', function(event, el) {
			var id = el.getAttribute('data-id');
			self.fire('itemclick', id);
		});
	}
});