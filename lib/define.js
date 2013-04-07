
/*jslint browser:true, node:true*/

'use strict';

/**
 * Module Dependencies
 */

var View = require('./view');
var store = require('./store');
var util = require('./util');

/**
 * Locals
 */

var keys = util.keys(View.prototype);

/**
 * Creates and registers a
 * FruitMachine view constructor.
 *
 * @param  {Object|View}
 * @return {View}
 */
module.exports = function(props) {
  var view;

  protect(keys, props);

  // If an existing FruitMachine.View
  // has been passed in, use that.
  // If just an object literal has
  // been passed in then we extend the
  // default FruitMachine.View prototype
  // with the properties passed in.
  view = (props.__super__)
    ? props
    : View.extend(props);

  // Store the module by module type
  // so that module can be referred to
  // by just a string in layout definitions
  return store.modules[props._module] = view;
};


/**
 * Makes sure no properties
 * or methods can be overwritten
 * on the core View.prototype.
 *
 * If conflicting keys are found,
 * we create a new key prifixed with
 * a '_' and delete the original key.
 *
 * @param  {Array} keys
 * @param  {Object} ob
 * @return {[type]}
 */
function protect(keys, ob) {
  for (var key in ob) {
    if (~keys.indexOf(key)) {
      ob['_' + key] = ob[key];
      delete ob[key];
    }
  }
}