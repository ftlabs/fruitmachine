
/**
 * Module Dependencies
 */

var store = require('./store');
var mixin = require('utils').mixin;

/**
 * Exports
 */

var defaults = store.config = module.exports = {
	templateIterator: 'children',
	templateInstance: 'child',
	model: {
		toJSON: function(model) {
			return model.toJSON();
		}
	}
};

defaults.set = function(options) {
	mixin(defaults, options);
};