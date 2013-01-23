var config = module.exports;

config["FruitMachineTests"] = {
	rootPath: '../',
	environment: "browser",
	sources: [
		'lib/fruitmachine.js',
		'examples/libs/hogan.js'
	],
	tests: [
		'test/fruitmachine_test.js'
	]
};
