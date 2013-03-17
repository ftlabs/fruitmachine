
buster.testCase('FruitMachine.module.clear()', {
	"Should remove the module from FruitMachine.store ": function() {
		FruitMachine.store['testmodule'] = { test: 'module' };
		FruitMachine.module.clear('testmodule');

		refute.defined(FruitMachine.store.modules['testmodule']);
	}
});