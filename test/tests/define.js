
buster.testCase('FruitMachine.define()', {
	setUp: function() {},

	"Should store the module in FruitMachine.store under module type": function() {
		FruitMachine.define({ module: 'my-module' });
		assert.defined(FruitMachine.store.modules['my-module']);
	},

	"Should return an instantiable constructor": function() {
		var View = FruitMachine.define({ module: 'new-module' });
		var view = new View();

		assert.defined(view._fmid);
		assert.equals('new-module', view.module());
	},

	"Should find module from internal module store if a `module` parameter is passed": function() {
		var apple = new FruitMachine.View({ module: 'apple' });

		assert.equals('apple', apple.module());
		assert.defined(apple.template);
	},


	"Defining reserved methods should rewrite keys with prefixed with '_'": function() {
		var setup = this.spy();
		var View = FruitMachine.define({
			module: 'foobar',
			setup: setup
		});

		var view = new View()
			.render()
			.setup();

		assert.called(setup);
	},

	tearDown: function() {
		delete FruitMachine.store['my-module'];
	}
});