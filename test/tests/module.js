
buster.testCase('FruitMachine.module()', {
	setUp: function() {},

	"Should store the module in FruitMachine.store under module type": function() {
		FruitMachine.module({ module: 'my-module' });
		assert.defined(FruitMachine.store.modules['my-module']);
	},

	"Should return an instantiable constructor": function() {
		var View = FruitMachine.module({ module: 'apple' });
		var view = new View();

		assert.defined(view._fmid);
		assert.equals('apple', view.module());
	},

	tearDown: function() {
		FruitMachine.module.clear();
	}
});