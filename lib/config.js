
/**
 * Module Dependencies
 */

var mixin = require('utils').mixin;

/**
 * Exports
 */

var defaults = module.exports = {
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