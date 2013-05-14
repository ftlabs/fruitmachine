
/*jslint browser:true, node:true, laxbreak:true*/

'use strict';

/**
 * Module Dependencies
 */

var util = require('utils');
var NormalView = require('./view');
var extend = require('./extend');

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
module.exports = function(store, props) {
  var View = ('function' !== typeof props)
    ? NormalView.extend(props)
    : props;

  function DefinedView(options) {
    return new View(store, options);
  }

  DefinedView.prototype = View.prototype;
  DefinedView.extend = extend(util.keys(DefinedView.prototype));

  // Store the module by module type
  // so that module can be referred to
  // by just a string in layout definitions
  store.modules[DefinedView.prototype._module] = View;
  return DefinedView;
};
