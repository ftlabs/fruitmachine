
/*jslint browser:true, node:true*/

'use strict';

/**
 * Module Dependencies
 */

var View = require('./view');
var store = require('./store');

/**
 * Creates and registers a
 * FruitMachine view constructor
 * and stores an internal reference.
 *
 * The user is able to pass in an already
 * defined View constructor, or an object
 * representing the View's prototype.
 *
 * @param  {Object|View}
 * @return {View}
 */
module.exports = function(props) {
  var view = ('function' !== typeof props)
    ? View.extend(props)
    : props;

  // Store the module by module type
  // so that module can be referred to
  // by just a string in layout definitions
  return store.modules[view.prototype._module] = view;
};
