
var Apple = FruitMachine.define({
	module: 'apple',
	template: templates.apple,

	initialize: function() {
		var self = this;

		// Bind the view context to this function.
		this.onItemClickBound = function() {
			self.onItemClick.apply(self, arguments);
		};
	},

	setup: function() {
		var self = this;

		this.delegate = new Delegate(this.el);
		this.delegate.on('click', '.apple-item', function(event, target) {
			self.fire('itemclick', target.getAttribute('data-id'));
		});
	},

	teardown: function() {
		this.delegate = new Delegate(this.el);
		this.delegate.off(this.onItemClickBound);
	}
});