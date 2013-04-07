
/*jshint browser:true, node:true*/

'use strict';

var events = require('event');
var util = require('./util');
var mixin = util.mixin;

/**
 * Exports
 */

module.exports = Model;



function Model(options) {
  this.fmid = util.uniqueId('model');
  this._data = mixin({}, options);
}

/**
 * Gets a value by key
 *
 * If no key is given, the
 * whole model is returned.
 *
 * @param  {String} key
 * @return {*}
 * @api public
 */
Model.prototype.get = function(key) {
  return key
    ? this._data[key]
    : this._data;
};

Model.prototype.set = function(key, value) {
  var _key;

  // If a string key is passed
  // convert it to an object ready
  // for the next step.
  if ('string' === typeof key && value) {
    _key = {};
    _key[key] = value;
    key = _key;
  }

  // Merge the object into the data store
  if ('object' === typeof key) {
    mixin(this._data, key);
    this.trigger('change');
    for (var prop in key) {
      this.trigger('change:' + prop, key[prop]);
    }
  }

  return this;
};

Model.prototype.clear = function() {
  this._data = {};
  return this;
};

Model.prototype.destroy = function() {
  this._data = null;
};

Model.prototype.toJSON = function() {
  return mixin({}, this._data);
};

// Mixin events functionality
events(Model.prototype);