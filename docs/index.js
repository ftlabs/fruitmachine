
/**
 * Module Dependencies
 */

var dox = require('dox');
var fs = require('fs');
var hogan = require('hogan.js');
var pkg = require('../package');

/**
 * Locals
 */

var js = fs.readFileSync(__dirname + '/../lib/fruitmachine.js', 'utf8');
var json = dox.parseComments(js);
var templates = {};

templates.docs = hogan.compile(fs.readFileSync(__dirname + '/template.hogan', 'utf8'));
templates.readme = hogan.compile(fs.readFileSync(__dirname + '/readme.hogan', 'utf8'));

json = json.filter(function(item) {
	return item.ctx && item.isPrivate === false;
});

var docs = templates.docs.render({ items: json });
var readme = templates.readme.render({ pkg: pkg, docs: docs });

fs.writeFile(__dirname + '/../README.md', readme);