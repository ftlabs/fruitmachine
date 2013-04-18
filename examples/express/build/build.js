;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0](function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function(global){global.Hogan = require('hogan.js/lib/template').Template;
global.app = {};

var FruitMachine = require('../../../../lib/');
var routes = require('../routes');

app.view = new FruitMachine(window.layout).setup();
})(window)
},{"../../../../lib/":2,"../routes":3,"hogan.js/lib/template":4}],4:[function(require,module,exports){
/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = {};

(function (Hogan, useArrayBuffer) {
  Hogan.Template = function (renderFunc, text, compiler, options) {
    this.r = renderFunc || this.r;
    this.c = compiler;
    this.options = options;
    this.text = text || '';
    this.buf = (useArrayBuffer) ? [] : '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // tries to find a partial in the curent scope and render it
    rp: function(name, context, partials, indent) {
      var partial = partials[name];

      if (!partial) {
        return '';
      }

      if (this.c && typeof partial == 'string') {
        partial = this.c.compile(partial, this.options);
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ls(val, ctx, partials, inverted, start, end, tags);
      }

      pass = (val === '') || !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        return ctx[ctx.length - 1];
      }

      for (var i = 1; i < names.length; i++) {
        if (val && typeof val == 'object' && names[i] in val) {
          cx = val;
          val = val[names[i]];
        } else {
          val = '';
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.lv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        if (v && typeof v == 'object' && key in v) {
          val = v[key];
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.lv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ho: function(val, cx, partials, text, tags) {
      var compiler = this.c;
      var options = this.options;
      options.delimiters = tags;
      var text = val.call(cx, text);
      text = (text == null) ? String(text) : text.toString();
      this.b(compiler.compile(text, options).render(cx, partials));
      return false;
    },

    // template result buffering
    b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
                          function(s) { this.buf += s; },
    fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
                           function() { var r = this.buf; this.buf = ''; return r; },

    // lambda replace section
    ls: function(val, ctx, partials, inverted, start, end, tags) {
      var cx = ctx[ctx.length - 1],
          t = null;

      if (!inverted && this.c && val.length > 0) {
        return this.ho(val, cx, partials, this.text.substring(start, end), tags);
      }

      t = val.call(cx);

      if (typeof t == 'function') {
        if (inverted) {
          return true;
        } else if (this.c) {
          return this.ho(t, cx, partials, this.text.substring(start, end), tags);
        }
      }

      return t;
    },

    // lambda replace variable
    lv: function(val, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = val.call(cx);

      if (typeof result == 'function') {
        result = coerceToString(result.call(cx));
        if (this.c && ~result.indexOf("{\u007B")) {
          return this.c.compile(result, this.options).render(cx, partials);
        }
      }

      return coerceToString(result);
    }

  };

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos =/\'/g,
      rQuot = /\"/g,
      hChars =/[&<>\"\']/;


  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp,'&amp;')
        .replace(rLt,'&lt;')
        .replace(rGt,'&gt;')
        .replace(rApos,'&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);


},{}],5:[function(require,module,exports){

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
},{}],6:[function(require,module,exports){

module.exports = {
  modules: {}
};
},{}],2:[function(require,module,exports){

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
},{"./view":7,"./model":8,"./define":9,"./util":5,"./store":6,"./config":10,"event":11}],9:[function(require,module,exports){

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

  // If an existing FruitMachine.View
  // has been passed in, use that.
  // If just an object literal has
  // been passed in then we extend the
  // default FruitMachine.View prototype
  // with the properties passed in.
  var view = (props.__super__)
    ? props
    : View.extend(props);

  // Make sure there are no
  // keys conflicting with
  // the core View prototype.
  protect(keys, view.prototype);

  // Store the module by module type
  // so that module can be referred to
  // by just a string in layout definitions
  return store.modules[view.prototype._module] = view;
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
},{"./view":7,"./store":6,"./util":5}],10:[function(require,module,exports){

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
},{"./store":6,"./util":5}],12:[function(require,module,exports){
var content = document.querySelector('.js-app_content');
var View = require('./view');

var database = {
	title: 'This is the Home page'
};

module.exports = function() {
	app.view = View(database);

	app.view
		.render()
		.inject(content);
};
},{"./view":13}],14:[function(require,module,exports){
var content = document.querySelector('.js-app_content');
var View = require('./view');

var database = {
	title: 'This is the About page'
};

module.exports = function() {
	app.view = View(database);

	app.view
		.render()
		.inject(content);
};
},{"./view":15}],16:[function(require,module,exports){
var content = document.querySelector('.js-app_content');
var View = require('./view');

var database = {
	title: 'This is the Links page'
};

module.exports = function() {
	app.view = View(database);

	app.view
		.render()
		.inject(content);
};
},{"./view":17}],11:[function(require,module,exports){

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

	while (l--) cbs[l].apply(null, args);
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
},{}],3:[function(require,module,exports){
var page = require('page');
var home = require('../page-home/client');
var about = require('../page-about/client');
var links = require('../page-links/client');

page('/', home);
page('/about', about);
page('/links', links);

page({ dispatch: false });
},{"../page-home/client":12,"../page-about/client":14,"../page-links/client":16,"page":18}],19:[function(require,module,exports){
/*jshint browser:true, node:true*/

'use strict';

/**
 * Module Dependencies
 */

var mixin = require('./util').mixin;

/**
 * Exports
 */

module.exports = function(proto) {
  var parent = this;
  var child = function(){ return parent.apply(this, arguments); };

  // Mixin static properties
  // eg. View.extend.
  mixin(child, parent);

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
},{"./util":5}],7:[function(require,module,exports){

/*jshint browser:true, node:true*/

'use strict';

/**
 * Module Dependencies
 */

var config = require('./config');
var extend = require('./extend');
var events = require('event');
var Model = require('./model');
var util = require('./util');
var store = require('./store');
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
  this.fire('initialize', [options], { propagate: false });
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

  // Use cache if populated
  if (this.html) return this.html;

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
  return this.html = this._wrapHTML(html);
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
  this.fire('render', { propagate: false });

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
 * Your custom `onSetup()` method is called
 * and a `setup` event is fired on the view.
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
  this.fire('before setup', { propagate: false });
  if (this._setup) this._setup();
  this.fire('setup', { propagate: false });

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
 * Your custom `onTeardown` method is
 * called and a `teardown` event is fired.
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

    this.fire('before teardown', { propagate: false });

    if (this._teardown) this._teardown();

    this.fire('teardown', { propagate: false });

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
 * Your custom `onDestroy` method is
 * called and a `destroy` event is fired.
 *
 * @api public
 */
View.prototype.destroy = function(options) {
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
    this.children[l].destroy({ el: false });
  }

  // Don't continue if this view
  // has already been destroyed.
  if (this.destroyed) return this;

  // Detach this view from its
  // parent and unless otherwise
  // stated, from the DOM.
  this.remove(options);

  // Run teardown so custom
  // views can bind logic to it
  this.teardown(options, { shallow: true });


  this.fire('before destroy', { propagate: false });

  if (this._destroy) this._destroy();

  // Trigger a `destroy` event
  // for custom Views to bind to.
  this.fire('destroy', { propagate: false });

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
 * Removes the View's element
 * from the DOM.
 *
 * @return {FruitMachine}
 * @api public
 */
View.prototype.remove = function(options) {
  options = options || {};
  var el = this.el;
  var index;

  // Unless stated otherwise,
  // remove the view element
  // from the its parent node.
  if (options.el !== false) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // If there is no parent view
  // reference, return here.
  if (!this.parent) return this;

  // Remove reference from views array
  index = this.parent.children.indexOf(this);
  this.parent.children.splice(index, 1);

  // Remove references from the lookup
  this.parent._removeLookup(this);

  return this;
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
View.prototype.on = events.prototype.on;
View.prototype.off = events.prototype.off;

/**
 * Proxies the standard Event.fire
 * method so that we can add bubble
 * functionality.
 *
 * Options:
 *
 *  - `propagate` States whether the event should bubble through parent views.
 *
 * @param  {String} key
 * @param  {Array} args
 * @param  {Object} options
 * @return {View}
 * @api public
 */
View.prototype.fire = function(key, args, event) {
  var propagate;

  // event can be passed as
  // the second or third argument
  if (!util.isArray(args)) {
    event = args;
    args = [];
  }

  // Use the event object passed
  // in, or make a fresh one
  event = event || {
    target: this,
    stopPropagation: function() { this.propagate = false; }
  };

  // Trigger event
  events.prototype.fire.apply(this, [key, event].concat(args));

  // Propagate by default
  propagate = (event.propagate !== false);

  // Trigger the same
  // event on the parent view
  if (propagate && this.parent) this.parent.fire(key, args, event);

  // Allow chaining
  return this;
};

/**
 * Allow Views to be extended
 */

View.extend = extend;
},{"./config":10,"./extend":19,"./model":8,"./util":5,"./store":6,"event":11}],8:[function(require,module,exports){

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
  return this._data[key];
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
},{"./util":5,"event":11}],18:[function(require,module,exports){

;(function(){

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' == typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' == typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    // show <path> with [state]
    } else if ('string' == typeof path) {
      page.show(path, fn);
    // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path){
    if (0 == arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options){
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) window.addEventListener('click', onclick, false);
    if (!dispatch) return;
    page.replace(location.pathname + location.search, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function(){
    running = false;
    removeEventListener('click', onclick, false);
    removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @param {Boolean} dispatch
   * @return {Context}
   * @api public
   */

  page.show = function(path, state, dispatch){
    var ctx = new Context(path, state);
    if (false !== dispatch) page.dispatch(ctx);
    if (!ctx.unhandled) ctx.pushState();
    return ctx;
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */

  page.replace = function(path, state, init, dispatch){
    var ctx = new Context(path, state);
    ctx.init = init;
    if (null == dispatch) dispatch = true;
    if (dispatch) page.dispatch(ctx);
    ctx.save();
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx){
    var i = 0;

    function next() {
      var fn = page.callbacks[i++];
      if (!fn) return unhandled(ctx);
      fn(ctx, next);
    }

    next();
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    if (window.location.pathname + window.location.search == ctx.canonicalPath) return;
    page.stop();
    ctx.unhandled = true;
    window.location = ctx.canonicalPath;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' == path[0] && 0 != path.indexOf(base)) path = base + path;
    var i = path.indexOf('?');
    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? path.slice(i + 1) : '';
    this.pathname = ~i ? path.slice(0, i) : path;
    this.params = [];
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function(){
    history.pushState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function(){
    history.replaceState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn){
    var self = this;
    return function(ctx, next){
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    }
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Array} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params){
    var keys = this.keys
      , qsIndex = path.indexOf('?')
      , pathname = ~qsIndex ? path.slice(0, qsIndex) : path
      , m = this.regexp.exec(pathname);

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' == typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = undefined !== params[key.name]
          ? params[key.name]
          : val;
      } else {
        params.push(val);
      }
    }

    return true;
  };

  /**
   * Normalize the given path string,
   * returning a regular expression.
   *
   * An empty array should be passed,
   * which will contain the placeholder
   * key names. For example "/user/:id" will
   * then contain ["id"].
   *
   * @param  {String|RegExp|Array} path
   * @param  {Array} keys
   * @param  {Boolean} sensitive
   * @param  {Boolean} strict
   * @return {RegExp}
   * @api private
   */

  function pathtoRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  };

  /**
   * Handle "populate" events.
   */

  function onpopstate(e) {
    if (e.state) {
      var path = e.state.path;
      page.replace(path, e.state);
    }
  }

  /**
   * Handle "click" events.
   */

  function onclick(e) {
    if (1 != which(e)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (e.defaultPrevented) return;

    // ensure link
    var el = e.target;
    while (el && 'A' != el.nodeName) el = el.parentNode;
    if (!el || 'A' != el.nodeName) return;

    // ensure non-hash
    var href = el.href;
    var path = el.pathname + el.search;
    if (el.hash || '#' == el.getAttribute('href')) return;

    // check target
    if (el.target) return;

    // x-origin
    if (!sameOrigin(href)) return;

    // same page
    var orig = path;
    path = path.replace(base, '');
    if (base && orig == path) return;

    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null == e.which
      ? e.button
      : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return 0 == href.indexOf(origin);
  }

  /**
   * Expose `page`.
   */

  if ('undefined' == typeof module) {
    window.page = page;
  } else {
    module.exports = page;
  }

})();

},{}],13:[function(require,module,exports){
var FruitMachine = require('../../../../lib/');

// Require these views so that
// FruitMachine registers them
var LayoutA = require('../layout-a');
var ModuleApple = require('../module-apple');
var ModuleOrange = require('../module-orange');
var ModuleBanana = require('../module-banana');

module.exports = function(data) {
	var layout = {
		module: 'layout-a',
		children: [
			{
				id: 'slot_1',
				module: 'apple',
				data: {
					title: data.title
				}
			},
			{
				id: 'slot_2',
				module: 'orange'
			},
			{
				id: 'slot_3',
				module: 'banana'
			}
		]
	};

	return new FruitMachine(layout);
};
},{"../../../../lib/":2,"../layout-a":20,"../module-apple":21,"../module-orange":22,"../module-banana":23}],15:[function(require,module,exports){
var FruitMachine = require('../../../../lib/');

// Require these views so that
// FruitMachine registers them
var LayoutA = require('../layout-a');
var ModuleApple = require('../module-apple');
var ModuleOrange = require('../module-orange');
var ModuleBanana = require('../module-banana');

module.exports = function(data) {
	var layout = {
		module: 'layout-a',
		children: [
			{
				id: 'slot_1',
				module: 'apple',
				data: {
					title: data.title
				}
			},
			{
				id: 'slot_2',
				module: 'banana'
			},
			{
				id: 'slot_3',
				module: 'orange'
			}
		]
	};

	return new FruitMachine(layout);
};
},{"../../../../lib/":2,"../layout-a":20,"../module-apple":21,"../module-orange":22,"../module-banana":23}],17:[function(require,module,exports){
var FruitMachine = require('../../../../lib/');

// Require these views so that
// FruitMachine registers them
var LayoutA = require('../layout-a');
var ModuleApple = require('../module-apple');
var ModuleOrange = require('../module-orange');
var ModuleBanana = require('../module-banana');

module.exports = function(data) {
	var layout = {
		module: 'layout-a',
		children: [
			{
				id: 'slot_1',
				module: 'orange'
			},
			{
				id: 'slot_2',
				module: 'apple',
				data: {
					title: data.title
				}
			},
			{
				id: 'slot_3',
				module: 'banana'
			}
		]
	};

	return new FruitMachine(layout);
};
},{"../../../../lib/":2,"../layout-a":20,"../module-apple":21,"../module-orange":22,"../module-banana":23}],20:[function(require,module,exports){

/**
 * Module Dependencies
 */

var fm = require('../../../../lib/');
var template = require('./template');

/**
 * Exports
 */

module.exports = fm.define({
	module: 'layout-a',
	template: template
});
},{"./template":24,"../../../../lib/":2}],21:[function(require,module,exports){

/**
 * Module Dependencies
 */

var fm = require('../../../../lib/');
var template = require('./template');

/**
 * Exports
 */

module.exports = fm.define({
	module: 'apple',
	template: template
});
},{"./template":25,"../../../../lib/":2}],22:[function(require,module,exports){

/**
 * Module Dependencies
 */

var fm = require('../../../../lib/');
var template = require('./template');

/**
 * Exports
 */

module.exports = fm.define({
	module: 'orange',
	template: template
});
},{"./template":26,"../../../../lib/":2}],23:[function(require,module,exports){

/**
 * Module Dependencies
 */

var fm = require('../../../../lib/');
var template = require('./template');

/**
 * Exports
 */

module.exports = fm.define({
	module: 'banana',
	template: template
});
},{"./template":27,"../../../../lib/":2}],24:[function(require,module,exports){
module.exports = new Hogan(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class='layout-a' ");_.b(_.t(_.f("fm_attrs",c,p,0)));_.b(">");_.b("\n" + i);_.b("	<div class='layout-a_slot-1'>");_.b(_.t(_.f("slot_1",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("	<div class='layout-a_region-1'>");_.b("\n" + i);_.b("		<div class='layout-a_slot-2'>");_.b(_.t(_.f("slot_2",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("		<div class='layout-a_slot-3'>");_.b(_.t(_.f("slot_3",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("	</div>");_.b("\n" + i);_.b("</div>");return _.fl();;});
},{}],25:[function(require,module,exports){
module.exports = new Hogan(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"module-apple\" ");_.b(_.t(_.f("fm_attrs",c,p,0)));_.b(">");_.b("\n" + i);_.b("	<div class=\"module-apple_title\">");_.b(_.v(_.f("title",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("</div>");return _.fl();;});
},{}],26:[function(require,module,exports){
module.exports = new Hogan(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class='module-orange' ");_.b(_.t(_.f("fm_attrs",c,p,0)));_.b(">Module Orange</div>");return _.fl();;});
},{}],27:[function(require,module,exports){
module.exports = new Hogan(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class='module-banana' ");_.b(_.t(_.f("fm_attrs",c,p,0)));_.b(">Module Banana</div>");return _.fl();;});
},{}]},{},[1])
;