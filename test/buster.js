var config = module.exports;

config["fruitmachine"] = {
	rootPath: '../',
	environment: "browser",
	sources: [
		'build/fruitmachine.js',
		'node_modules/hogan.js/lib/template.js',
		'node_modules/hogan.js/lib/compiler.js',
		'test/helpers/*.js'
	],
	tests: [
		'test/tests/*.js'
	]
};
