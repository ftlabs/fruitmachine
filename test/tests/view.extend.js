
buster.testCase('Extend', {
	"Defining reserved methods should rewrite keys with prefixed with '_'": function() {
		var setup = this.spy();
		var View = fruitmachine.View.extend({
			module: 'foobar',
			setup: setup
		});

		assert.equals(View.prototype._module, 'foobar');
		assert.equals(View.prototype._setup, setup);
	}
});
