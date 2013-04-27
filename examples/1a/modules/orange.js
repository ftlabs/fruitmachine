
var Orange = FruitMachine.define({
	module: 'orange',
	template: templates.orange,

	setup: function() {
		this.delegate = new Delegate(this.el);
		this.delegate.on('click', '.module-orange_body', function() {
			alert('article body click');
		});
	},

	teardown: function() {
		this.delegate = new Delegate(this.el);
		this.delegate.off(this.onItemClickBound);
	}
});