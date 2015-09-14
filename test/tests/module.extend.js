var assert = buster.referee.assert;

buster.testCase('Extend', {
	"Defining reserved methods should rewrite keys with prefixed with '_'": function() {
		var setup = this.spy();
		var Module = fruitmachine.Module.extend({
			module: 'foobar',
			setup: setup
		});

		assert.equals(Module.prototype._module, 'foobar');
		assert.equals(Module.prototype._setup, setup);
	}
});
