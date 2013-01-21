var config = module.exports;

config["FruitMachineTests"] = {
	rootPath: '../',
	environment: "browser",
	sources: [
		'lib/fruitmachine.js'	
	],
	tests: [
		'test/fruitmachine_test.js'
	]
};
