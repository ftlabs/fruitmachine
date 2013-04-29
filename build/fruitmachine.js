(function(e){if("function"==typeof bootstrap)bootstrap("fruitmachine",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeFruitMachine=e}else"undefined"!=typeof window?window.FruitMachine=e():global.FruitMachine=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){

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
},{}],2:[function(require,module,exports){

module.exports = {
  modules: {}
};
},{}],3:[function(require,module,exports){

/*jslint browser:true, node:true*/

/**
 * FruitMachine
 *
 * Renders layouts/modules from a basic layout definition.
 * If views require custom interactions devs can extend
 * the basic functionality.
 *
 * @version 0.2.5
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @author Wilson Page <wilson.page@ft.com>
 */

'use strict';

// Version
FruitMachine.VERSION = '0.2.5';

// Public interface
FruitMachine.View = require('./view');
FruitMachine.Model = require('./model');
FruitMachine.Events = require('event');
FruitMachine.define = require('./define');
FruitMachine.util = require('./util');
FruitMachine.store = require('./store');
FruitMachine.config = require('./config').set;

/**
 * The main library namespace doubling
 * as a convenient alias for creating
 * new views.
 *
 * @param {Object} options
 */
function FruitMachine(options) {
  return new FruitMachine.View(options);
}

/**
 * Expose 'FruitMachine'
 */

module.exports = FruitMachine;
},{"./model":4,"./define":5,"./util":1,"./store":2,"./config":6,"./view":7,"event":8}],6:[function(require,module,exports){

/**
 * Module Dependencies
 */

var store = require('./store');
var mixin = require('./util').mixin;

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
},{"./store":2,"./util":1}],5:[function(require,module,exports){

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

},{"./store":2,"./view":7}],8:[function(require,module,exports){

/**
 * Event
 *
 * A super lightweight
 * event emitter library.
 *
 * @version 0.1.4
 * @author Wilson Page <wilson.page@me.com>
 */

/**
 * Creates a new event emitter
 * instance, or if passed an
 * object, mixes the event logic
 * into it.
 *
 * @param  {Object} obj
 * @return {Object}
 */
var Event = module.exports = function(obj) {
	if (!(this instanceof Event)) return new Event(obj);
	if (obj) return mixin(obj, Event.prototype);
};

/**
 * Registers a callback
 * with an event name.
 *
 * @param  {String}   name
 * @param  {Function} cb
 * @return {Event}
 */
Event.prototype.on = function(name, cb) {
	this._cbs = this._cbs || {};
	(this._cbs[name] || (this._cbs[name] = [])).push(cb);
	return this;
};

/**
 * Removes a single callback,
 * or all callbacks associated
 * with the passed event name.
 *
 * @param  {String}   name
 * @param  {Function} cb
 * @return {Event}
 */
Event.prototype.off = function(name, cb) {
	this._cbs = this._cbs || {};

	if (!name) return this._cbs = {};
	if (!cb) return delete this._cbs[name];

	var cbs = this._cbs[name] || [];
	var i;

	while (cbs && ~(i = cbs.indexOf(cb))) cbs.splice(i, 1);
	return this;
};

/**
 * Fires an event. Which triggers
 * all callbacks registered on this
 * event name.
 *
 * @param  {String} name
 * @return {Event}
 */
Event.prototype.fire = function(name) {
	this._cbs = this._cbs || {};

	var cbs = (this._cbs[name] || (this._cbs[name] = []));
	var args = [].slice.call(arguments, 1);
	var l = cbs.length;

	while (l--) cbs[l].apply(this, args);
	return this;
};

/**
 * Util
 */

/**
 * Mixes in the properties
 * of the second object into
 * the first.
 *
 * @param  {Object} a
 * @param  {Object} b
 * @return {Object}
 */
function mixin(a, b) {
  for (var key in b) a[key] = b[key];
  return a;
}
},{}],7:[function(require,module,exports){

/*jshint browser:true, node:true*/

'use strict';

/**
 * Module Dependencies
 */

var config = require('../config');
var events = require('./events');
var extend = require('../extend');
var Model = require('../model');
var util = require('../util');
var store = require('../store');
var mixin = util.mixin;

/**
 * Exports
 */

module.exports = View;

/**
 * View constructor
 *
 * @constructor
 * @param {Object} options
 * @api public
 */
function View(options) {

  // Shallow clone the options
  options = mixin({}, options);

  // If a `module` property is passed
  // we create a view of that module type.
  if (options.module) {
    var LazyView = store.modules[options.module] || View;
    options._module = options.module;
    delete options.module;
    return new LazyView(options);
  }

  // Various config steps
  this._configure(options);

  // Add any children passed
  // in the options object
  this.add(options.children);

  // Run initialize hooks
  if (this.initialize) this.initialize(options);
  this.fireStatic('initialize', options);
}

/**
 * Configures the new View
 * with the options passed
 * to the constructor.
 *
 * @param  {Object} options
 * @api private
 */
View.prototype._configure = function(options) {
  this._module = this._module || options._module;
  this._id = options.id || util.uniqueId('auto_');
  this._fmid = options.fmid || util.uniqueId('fmid');
  this.tag = options.tag || this.tag || 'div';
  this.classes = this.classes || options.classes || [];
  this.helpers = this.helpers || options.helpers || [];
  this.template = this.setTemplate(options.template || this.template);
  this.children = [];

  // Create id and module
  // lookup objects
  this._ids = {};
  this._modules = {};

  // Use the model passed in,
  // or create a model from
  // the data passed in.
  var model = options.model || options.data || {};
  this.model = util.isPlainObject(model)
    ? new Model(model)
    : model;

  // Attach helpers
  this.helpers.forEach(this.attachHelper, this);
};

/**
 * Instantiates the given
 * helper on the View.
 *
 * @param  {Function} helper
 * @return {View}
 * @api private
 */
View.prototype.attachHelper = function(helper) {
  if (helper) helper(this);
},

/**
 * Returns the template function
 * for the view.
 *
 * For template object like Hogan
 * templates with a `render` method
 * we need to bind the context
 * so they can be called without
 * a reciever.
 *
 * @return {Function}
 * @api private
 */
View.prototype.setTemplate = function(fn) {
  return fn && fn.render
    ? util.bind(fn.render, fn)
    : fn;
};

/**
 * Adds a child view(s) to another View.
 *
 * Options:
 *
 *  - `at` The child index at which to insert
 *  - `inject` Injects the child's view element into the parent's
 *
 * @param {View|Object|Array} children
 * @param {Object} options
 */
View.prototype.add = function(children, options) {
  var at = options && options.at;
  var inject = options && options.inject;
  var child;

  if (!children) return this;

  // Make sure it's an array
  children = [].concat(children);

  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];

    // If it's not a View, make it one.
    if (!(child instanceof View)) child = new View(child);

    util.insert(child, this.children, at);
    this._addLookup(child);
    child.parent = this;

    // We append the child to the parent view if there is a view
    // element and the users hasn't flagged `append` false.
    if (inject) this.injectElement(child.el, options);
  }

  // Allow chaining
  return this;
};

/**
 * Removes a child view from
 * its current View contexts
 * and also from the DOM unless
 * otherwise stated.
 *
 * Options:
 *
 *  - `fromDOM` Whether the element should be removed from the DOM (default `true`)
 *
 * Example:
 *
 *   // The following are equal
 *   // apple is removed from the
 *   // the view structure and DOM
 *   layout.remove(apple);
 *   apple.remove();
 *
 *   // Apple is removed from the
 *   // view structure, but not the DOM
 *   layout.remove(apple, { el: false });
 *   apple.remove({ el: false });
 *
 * @return {FruitMachine}
 * @api public
 */
View.prototype.remove = function(param1, param2) {

  // Allow view.remove(child[, options])
  // and view.remove([options]);
  if (param1 instanceof View) {
    param1.remove(param2);
    return this;
  }

  // Options and aliases
  var options = param1 || {};
  var fromDOM = options.fromDOM !== false;
  var parent = this.parent;
  var el = this.el;
  var index;

  // Unless stated otherwise,
  // remove the view element
  // from its parent node.
  if (fromDOM) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  if (parent) {
    // Remove reference from views array
    index = parent.children.indexOf(this);
    parent.children.splice(index, 1);

    // Remove references from the lookup
    parent._removeLookup(this);
  }

  return this;
};

/**
 * Creates a lookup reference for
 * the child view passed.
 *
 * @param {View} child
 * @api private
 */
View.prototype._addLookup = function(child) {

  // Add a lookup for module
  this._modules[child._module] = this._modules[child._module] || [];
  this._modules[child._module].push(child);

  // Add a lookup for id
  this._ids[child.id()] = child;
};

/**
 * Removes the lookup for the
 * the child view passed.
 *
 * @param {View} child
 * @api private
 */
View.prototype._removeLookup = function(child) {

  // Remove the module lookup
  var index = this._modules[child._module].indexOf(child);
  this._modules[child._module].splice(index, 1);

  // Remove the id lookup
  delete this._ids[child._id];
};

/**
 * Injects an element into the
 * View's root element.
 *
 * By default the element is appended
 * but then
 *
 * Options:
 *
 *  - `at` The index at which to insert.
 *
 * @param  {[type]} el
 * @param  {[type]} options
 * @return {[type]}
 * @api private
 */
View.prototype.injectElement = function(el, options) {
  var at = options && options.at;
  var parent = this.el;
  if (!el || !parent) return;

  if (typeof at !== 'undefined') {
    parent.insertBefore(el, parent.children[at]);
  } else {
    parent.appendChild(el);
  }
};

/**
 * Returns a decendent module
 * by id, or if called with no
 * arguments, returns this view's id.
 *
 * Example:
 *
 *   myView.id();
 *   //=> 'my_view_id'
 *
 *   myView.id('my_other_views_id');
 *   //=> View
 *
 * @param  {String|undefined} id
 * @return {View|String}
 * @api public
 */
View.prototype.id = function(id) {
  if (!id) return this._id;

  var child = this._ids[id];
  if (child) return child;

  return this.each(function(view) {
    return view.id(id);
  });
};

/**
 * Returns the first descendent
 * View with the passed module type.
 * If called with no arguments the
 * View's own module type is returned.
 *
 * Example:
 *
 *   // Assuming 'myView' has 3 descendent
 *   // views with the module type 'apple'
 *
 *   myView.modules('apple');
 *   //=> View
 *
 * @param  {String} key
 * @return {View}
 */
View.prototype.module = function(key) {
  if (!key) return this._module;

  var view = this._modules[key];
  if (view) return view[0];

  return this.each(function(view) {
    return view.module(key);
  });
};

/**
 * Returns a list of descendent
 * Views that match the module
 * type given (Similar to
 * Element.querySelectorAll();).
 *
 * Example:
 *
 *   // Assuming 'myView' has 3 descendent
 *   // views with the module type 'apple'
 *
 *   myView.modules('apple');
 *   //=> [ View, View, View ]
 *
 * @param  {String} key
 * @return {Array}
 * @api public
 */
View.prototype.modules = function(key) {
  var list = this._modules[key] || [];

  // Then loop each child and run the
  // same opperation, appending the result
  // onto the list.
  this.each(function(view) {
    list = list.concat(view.modules(key));
  });

  return list;
};

/**
 * Calls the passed function
 * for each of the view's
 * children.
 *
 * Example:
 *
 *   myView.each(function(child) {
 *     // Do stuff with each child view...
 *   });
 *
 * @param  {Function} fn
 * @return {[type]}
 */
View.prototype.each = function(fn) {
  var l = this.children.length;
  var result;

  for (var i = 0; i < l; i++) {
    result = fn(this.children[i]);
    if (result) return result;
  }
};

/**
 * Templates the view, including
 * any descendent views returning
 * an html string. All data in the
 * views model is made accessible
 * to the template.
 *
 * Child views are printed into the
 * parent template by `id`. Alternatively
 * children can be iterated over a a list
 * and printed with `{{{child}}}}`.
 *
 * Example:
 *
 *   <div class="slot-1">{{{id_of_child_1}}}</div>
 *   <div class="slot-2">{{{id_of_child_2}}}</div>
 *
 *   // or
 *
 *   {{#children}}
 *     {{{child}}}
 *   {{/children}}
 *
 * @return {String}
 * @api public
 */
View.prototype.toHTML = function() {
  var toJSON = config.model.toJSON;
  var data = {};
  var html;
  var tmp;

  // Create an array for view
  // children data needed in template.
  data[config.templateIterator] = [];

  // Loop each child
  this.each(function(child) {
    html = child.toHTML();
    data[child.id()] = html;
    tmp = {};
    tmp[config.templateInstance] = html;
    data.children.push(mixin(tmp, toJSON(child.model)));
  });

  // Run the template render method
  // passing children data (for looping
  // or child views) mixed with the
  // view's model data.
  html = this.template
    ? this.template(mixin(data, toJSON(this.model)))
    : '';

  // Wrap the html in a FruitMachine
  // generated root element and return.
  return this._wrapHTML(html);
};

/**
 * Wraps the module html in
 * a root element.
 *
 * @param  {String} html
 * @return {String}
 * @api private
 */
View.prototype._wrapHTML = function(html) {
  return '<' + this.tag + ' class="' + this._module + ' ' + this.classes.join(' ') + '" id="' + this._fmid + '">' + html + '</' + this.tag + '>';
};

/**
 * Renders the view and replaces
 * the `view.el` with a freshly
 * rendered node.
 *
 * Fires a `render` event on the view.
 *
 * @return {View}
 */
View.prototype.render = function() {
  var html = this.toHTML();
  var el = util.toNode(html);

  // Sets a new element as a view's
  // root element (purging descendent
  // element caches).
  this.setElement(el);

  // Handy hook
  this.fireStatic('render');

  return this;
};

/**
 * Sets up a view and all descendent
 * views.
 *
 * Setup will be aborted if no `view.el`
 * is found. If a view is already setup,
 * teardown is run first to prevent a
 * view being setup twice.
 *
 * Your custom `setup()` method is called
 *
 * Options:
 *
 *  - `shallow` Does not recurse when `true` (default `false`)
 *
 * @param  {Object} options
 * @return {View}
 */
View.prototype.setup = function(options) {
  var shallow = options && options.shallow;

  // Attempt to fetch the view's
  // root element. Don't continue
  // if no route element is found.
  if (!this.getElement()) return this;

  // If this is already setup, call
  // `teardown` first so that we don't
  // duplicate event bindings and shizzle.
  if (this.isSetup) this.teardown({ shallow: true });

  // Fire the `setup` event hook
  this.fireStatic('before setup');
  if (this._setup) this._setup();
  this.fireStatic('setup');

  // Flag view as 'setup'
  this.isSetup = true;

  // Call 'setup' on all subviews
  // first (top down recursion)
  if (!shallow) {
    this.each(function(child) {
      child.setup();
    });
  }

  // For chaining
  return this;
};

/**
 * Tearsdown a view and all descendent
 * views that have been setup.
 *
 * Your custom `teardown` method is
 * called and a `teardown` event is fired.
 *
 * Options:
 *
 *  - `shallow` Does not recurse when `true` (default `false`)
 *
 * @param  {Object} options
 * @return {View}
 */
View.prototype.teardown = function(options) {
  var shallow = options && options.shallow;

  // Call 'setup' on all subviews
  // first (bottom up recursion).
  if (!shallow) {
    this.each(function(child) {
      child.teardown();
    });
  }

  // Only teardown if this view
  // has been setup. Teardown
  // is supposed to undo all the
  // work setup does, and therefore
  // will likely run into undefined
  // variables if setup hasn't run.
  if (this.isSetup) {

    this.fireStatic('before teardown');

    if (this._teardown) this._teardown();

    this.fireStatic('teardown');

    this.isSetup = false;
  }

  // For chaining
  return this;
};

/**
 * Completely destroys a view. This means
 * a view is torn down, removed from it's
 * current layout context and removed
 * from the DOM.
 *
 * Your custom `destroy` method is
 * called and a `destroy` event is fired.
 *
 * NOTE: `.remove()` is only run on the view
 * that `.destroy()` is directly called on.
 *
 * Options:
 *
 *  - `fromDOM` Whether the view should be removed from DOM (default `true`)
 *
 * @api public
 */
View.prototype.destroy = function(options) {
  options = options || {};

  var remove = options.remove !== false;
  var l = this.children.length;

  // Destroy each child view.
  // We don't waste time removing
  // the child elements as they will
  // get removed when the parent
  // element is removed.
  //
  // We can't use the standard View#each()
  // as the array length gets altered
  // with each iteration, hense the
  // reverse while loop.
  while (l--) {
    this.children[l].destroy({ remove: false });
  }

  // Don't continue if this view
  // has already been destroyed.
  if (this.destroyed) return this;

  // .remove() is only run on the view that
  // destroy() was called on.
  //
  // It is a waste of time to remove the
  // descendent views as well, as any
  // references to them will get wiped
  // within destroy and they will get
  // removed from the DOM with the main view.
  if (remove) this.remove(options);

  // Run teardown
  this.teardown({ shallow: true });

  // Fire an event hook before the
  // custom destroy logic is run
  this.fireStatic('before destroy');

  // If custom destroy logic has been
  // defined on the prototype then run it.
  if (this._destroy) this._destroy();

  // Trigger a `destroy` event
  // for custom Views to bind to.
  this.fireStatic('destroy');

  // Unbind any old event listeners
  this.off();

  // Set a flag to say this view
  // has been destroyed. This is
  // useful to check for after a
  // slow ajax call that might come
  // back after a view has been detroyed.
  this.destroyed = true;

  // Clear references
  this.el = this.model = this.parent = this._modules = this._module = this._ids = this._id = null;
};

/**
 * Destroys all children.
 *
 * @return {View}
 * @api public
 */
View.prototype.empty = function() {
  var l = this.children.length;
  while (l--) this.children[l].destroy();
  return this;
};

/**
 * Returns the closest root view
 * element, walking up the chain
 * until it finds one.
 *
 * @return {Element}
 * @api private
 */
View.prototype.closestElement = function() {
  var view = this.parent;
  while (view && !view.el && view.parent) view = view.parent;
  return view && view.el;
};

/**
 * Returns the View's root element.
 *
 * If a cache is present it is used,
 * else we search the DOM, else we
 * find the closest element and
 * perform a querySelector using
 * the view._fmid.
 *
 * @return {Element|undefined}
 * @api private
 */
View.prototype.getElement = function() {
  if (!util.hasDom()) return;
  return this.el = this.el
    || document.getElementById(this._fmid)
    || this.parent && util.querySelectorId(this._fmid, this.closestElement());
};

/**
 * Sets a root element on a view.
 * If the view already has a root
 * element, it is replaced.
 *
 * IMPORTANT: All descendent root
 * element caches are purged so that
 * the new correct elements are retrieved
 * next time View#getElement is called.
 *
 * @param {Element} el
 * @return {View}
 * @api private
 */
View.prototype.setElement = function(el) {
  var existing = this.el;

  if (existing && existing.parentNode) {
    existing.parentNode.replaceChild(el, existing);
  }

  // Purge all element caches
  this.purgeElementCaches();

  // Update cache
  this.el = el;

  return this;
};

/**
 * Recursively purges the
 * element cache.
 *
 * @return void
 * @api private
 */
View.prototype.purgeElementCaches = function() {
  this.el = null;
  this.each(function(child) {
    child.purgeElementCaches();
  });
};

/**
 * Detects whether a view is in
 * the DOM (useful for debugging).
 *
 * @return {Boolean}
 * @api private
 */
View.prototype.inDOM = function() {
  if (this.parent) return this.parent.inDOM();
  return !!(this.el && this.el.parentNode);
};

/**
 * Empties the destination element
 * and appends the view into it.
 *
 * @param  {Element} dest
 * @return {View}
 * @api public
 */
View.prototype.inject = function(dest) {
  if (dest) {
    dest.innerHTML = '';
    this.appendTo(dest);
  }

  this.fireStatic('inject');

  return this;
};

/**
 * Appends the view element into
 * the destination element.
 *
 * @param  {Element} dest
 * @return {View}
 * @api public
 */
View.prototype.appendTo = function(dest) {
  if (this.el && dest && dest.appendChild) {
    dest.appendChild(this.el);
  }

  this.fireStatic('appendto');

  return this;
};

/**
 * Returns a JSON represention of
 * a FruitMachine View. This can
 * be generated serverside and
 * passed into new FruitMachine(json)
 * to inflate serverside rendered
 * views.
 *
 * @return {Object}
 * @api public
 */
View.prototype.toJSON = function() {
  var json = {};
  json.children = [];

  // Recurse
  this.each(function(child) {
    json.children.push(child.toJSON());
  });

  json.id = this.id();
  json.fmid = this._fmid;
  json.module = this._module;
  json.model = this.model.get();

  return json;
};

// Events
View.prototype.on = events.on;
View.prototype.off = events.off;
View.prototype.fire = events.fire;
View.prototype.fireStatic = events.fireStatic;

/**
 * Allow Views to be extended
 */

View.extend = extend(util.keys(View.prototype));
},{"../config":6,"./events":9,"../extend":10,"../model":4,"../util":1,"../store":2}],4:[function(require,module,exports){

/*jshint browser:true, node:true*/

'use strict';

/**
 * Module Dependencies
 */

var events = require('event');
var mixin = require('./util').mixin;

/**
 * Exports
 */

module.exports = Model;

/**
 * Model constructor.
 *
 * @constructor
 * @param {Object} data
 * @api public
 */
function Model(data) {
  this._data = mixin({}, data);
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

/**
 * Sets data on the model.
 *
 * Accepts either a key and
 * value, or an object literal.
 *
 * @param {String|Object} key
 * @param {*|undefined} value
 */
Model.prototype.set = function(data, value) {

  // If a string key is passed
  // with a value. Set the value
  // on the key in the data store.
  if ('string' === typeof data && value) {
    this._data[data] = value;
    this.fire('change:' + data, value);
  }

  // Merge the object into the data store
  if ('object' === typeof data) {
    mixin(this._data, data);
    for (var prop in data) this.fire('change:' + prop, data[prop]);
  }

  // Always fire a
  // generic change event
  this.fire('change');

  // Allow chaining
  return this;
};

/**
 * CLears the data store.
 *
 * @return {Model}
 */
Model.prototype.clear = function() {
  this._data = {};
  this.fire('change');

  // Allow chaining
  return this;
};

/**
 * Deletes the data store.
 *
 * @return {undefined}
 */
Model.prototype.destroy = function() {
  for (var key in this._data) this._data[key] = null;
  delete this._data;
  this.fire('destroy');
};

/**
 * Returns a shallow
 * clone of the data store.
 *
 * @return {Object}
 */
Model.prototype.toJSON = function() {
  return mixin({}, this._data);
};

// Mixin events
events(Model.prototype);
},{"./util":1,"event":8}],10:[function(require,module,exports){
/*jshint browser:true, node:true*/

'use strict';

/**
 * Module Dependencies
 */

var mixin = require('./util').mixin;

/**
 * Exports
 */

module.exports = function(keys) {

  return function(proto) {
    var parent = this;
    var child = function(){ return parent.apply(this, arguments); };

    // Mixin static properties
    // eg. View.extend.
    mixin(child, parent);

    // Make sure there are no
    // keys conflicting with
    // the prototype.
    if (keys) protect(keys, proto);

    // Set the prototype chain to
    // inherit from `parent`, without
    // calling `parent`'s constructor function.
    function C() { this.constructor = child; }
    C.prototype = parent.prototype;
    child.prototype = new C();

    // Add prototype properties
    mixin(child.prototype, proto);

    // Set a convenience property
    // in case the parent's prototype
    // is needed later.
    child.__super__ = parent.prototype;

    return child;
  };
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
    if (ob.hasOwnProperty(key) && ~keys.indexOf(key)) {
      ob['_' + key] = ob[key];
      delete ob[key];
    }
  }
}
},{"./util":1}],9:[function(require,module,exports){

/**
 * Module Dependencies
 */

var events = require('event');

/**
 * Exports
 */

exports.on = function(name, module, cb) {

  // cb can be passed as
  // the second or third argument
  if (typeof module !== 'string') {
    cb = module;
    module = undefined;
  }

  // if a module is provided
  // pass in a special callback
  // function that checks the
  // module
  if (module) {
    events.prototype.on.call(this, name, function() {
      if (this.event.target.module() === module) {
        cb.apply(this, arguments);
      }
    });
  } else {
    events.prototype.on.call(this, name, cb);
  }

  return this;
};


exports.fire = function(name) {
  var parent = this.parent;

  this.event = this.event || {
    target: this,
    propagate: true,
    stopPropagation: function(){ this.propagate = false; }
  };

  // Trigger event
  events.prototype.fire.apply(this, arguments);

  // Trigger the same event on the parent view
  if (this.event.propagate && parent) {
    parent.event = this.event;
    this.fire.apply(parent, arguments);
  }

  // Remove the event reference
  delete this.event;

  // Allow chaining
  return this;
};

exports.fireStatic = events.prototype.fire;
exports.off = events.prototype.off;
},{"event":8}]},{},[3])(3)
});
;