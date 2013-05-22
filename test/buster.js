var config = module.exports;

config["fruitmachine"] = {
	rootPath: '../',
	environment: "browser",
	sources: [
		'build/fruitmachine.min.js',
		'node_modules/hogan.js/lib/template.js',
		'node_modules/hogan.js/lib/compiler.js',
		'node_modules/backbone/node_modules/underscore/underscore.js',
		'node_modules/backbone/backbone.js',
		'test/helpers/*.js'
	],
	tests: [
		'test/tests/*.js'
	]
};
