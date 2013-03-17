
buster.testCase('FruitMachine.module()', {
	setUp: function() {},

	"Should store the module in FruitMachine.store under module type": function() {
		FruitMachine.module({ module: 'my-module' });
		assert.defined(FruitMachine.store.modules['my-module']);
	},

	tearDown: function() {
		FruitMachine.module.clear();
	}
});