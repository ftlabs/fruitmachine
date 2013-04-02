
var template = Hogan.compile(document.getElementById('template-apple').innerHTML);

var Apple = FruitMachine.module({
	module: 'apple',
	template: template,

	onInitialize: function() {
		var self = this;

		// Bind the view context to this function.
		this.onItemClickBound = function() {
			self.onItemClick.apply(self, arguments);
		};
	},

	onSetup: function() {
		this.delegate = new Delegate(this.el);
		this.delegate.on('click', '.module-apple-item', this.onItemClickBound);
	},

	onTeardown: function() {
		this.delegate = new Delegate(this.el);
		this.delegate.off(this.onItemClickBound);
	},

	onItemClick: function(event, target) {
		this.trigger('itemclick', target.getAttribute('data-id'));
	}
});