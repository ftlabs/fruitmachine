var config = module.exports;

config["FruitMachineTests"] = {
	rootPath: '../',
	environment: "browser",
	sources: [
		'lib/fruitmachine.js',
		'examples/libs/hogan.js',
		'test/helpers/*.js'
	],
	tests: [
		'test/tests/*.js'
	]
};
