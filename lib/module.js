
var View = require('./view');

/**
 * Creates and registers a
 * FruitMachine view constructor.
 *
 * @param  {Object|View}
 * @return {View}
 */
module.exports = function(props) {
  var module = props.module || 'undefined';
  var _View;

  // Remove the module key
  delete props.module;

  // If an existing FruitMachine.View
  // has been passed in, use that.
  // If just an object literal has
  // been passed in then we extend the
  // default FruitMachine.View prototype
  // with the properties passed in.
  _View = (props.__super__)
    ? props
    : View.extend(props);

  // Make sure we explicity set the
  // `prototype._module` so that
  // `this._module` returns the correct
  // module type and not one further
  // down the prototype chain.
  View.prototype._module = module;

  // Store the module by module type
  // so that module can be referred to
  // by just a string in layout definitions
  return store.modules[module] = View;
}

/**
 * Removes a module
 * from the module store.
 *
 * If no module key is passed
 * the entire store is cleared.
 *
 * @param  {String|undefined} module
 * @api public
 */
module.exports.clear = function(module) {
  if (module) delete store.modules[module];
  else store.modules = {};
};