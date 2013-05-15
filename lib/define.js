
/*jslint browser:true, node:true, laxbreak:true*/

'use strict';

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
module.exports = function(store, View) {
  return function(props) {
    var view = ('function' !== typeof props)
      ? View.extend(props)
      : props;

    // Store the module by module type
    // so that module can be referred to
    // by just a string in layout definitions
    store.modules[view.prototype._module] = view;
    return store.modules[view.prototype._module];
  };
};
