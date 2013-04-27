
/*jshint browser:true, node:true*/

'use strict';

exports.bind = function(method, context) {
  return function() { return method.apply(context, arguments); };
};

exports.isArray = function(arg) {
  return arg instanceof Array;
},

exports.mixin = function(original) {
  // Loop over every argument after the first.
  [].slice.call(arguments, 1).forEach(function(source) {
    for (var prop in source) {
      original[prop] = source[prop];
    }
  });
  return original;
},

exports.querySelectorId = function(id, el) {
  if (!el) return;
  return el.querySelector('#' + id);
},

/**
 * Inserts an item into an array.
 * Has the option to state an index.
 *
 * @param  {*} item
 * @param  {Array} array
 * @param  {Number} index
 * @return void
 */
exports.insert = function(item, array, index) {
  if (typeof index !== 'undefined') {
    array.splice(index, 0, item);
  } else {
    array.push(item);
  }
},

exports.toNode = function(html) {
  var el = document.createElement('div');
  el.innerHTML = html;
  return el.removeChild(el.firstElementChild);
},

// Determine if we have a DOM
// in the current environment.
exports.hasDom = function() {
	return typeof document !== 'undefined';
};

var i = 0;
exports.uniqueId = function(prefix, suffix) {
  prefix = prefix || 'id';
  suffix = suffix || 'a';
  return [prefix, (++i) * Math.round(Math.random() * 100000), suffix].join('-');
};

exports.keys = function(object) {
  var keys = [];
  for (var key in object) keys.push(key);
  return keys;
};

exports.isPlainObject = function(ob) {
  if (!ob) return false;
  var c = (ob.constructor || '').toString();
  return !!~c.indexOf('Object');
};