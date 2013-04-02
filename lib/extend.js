/*jshint browser:true, node:true*/

'use strict';

/**
 * Module Dependencies
 */

var mixin = require('./util').mixin;


module.exports = function(proto) {
  var parent = this;
  var child;

  child = function(){ return parent.apply(this, arguments); };

  // Set the prototype chain to
  // inherit from `parent`, without
  // calling `parent`'s constructor function.
  function C() { this.constructor = child; }
  C.prototype = parent.prototype;
  child.prototype = new C();

  // Add prototype properties
  // (instance properties) to
  // the subclass, if supplied.
  mixin(child.prototype, proto);

  // Set a convenience property
  // in case the parent's prototype
  // is needed later.
  child.__super__ = parent.prototype;

  return child;
};