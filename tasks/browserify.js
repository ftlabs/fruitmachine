
/**
 * Module Dependencies
 */

var browserify = require('browserify');

/**
 * Exports
 */

module.exports = function (grunt) {

	grunt.registerTask('browserify', function() {
		var done = this.async();
		var b = browserify(__dirname + '/../lib/index.js');

		b.bundle({ standalone: 'FruitMachine' }, function(err, string) {
			grunt.file.write('dist/fruitmachine.js', string);
			 grunt.log.writeln('Written dist/fruitmachine.js (' + String(string.length).green + ' bytes)');
			done();
		});
	});
};