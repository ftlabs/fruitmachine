
/*jshint browser:true, node:true*/

'use strict';

/**
 * Module Dependencies
 */

var util = require('utils');
var events = require('./events');
var extend = require('extend');
var mixin = util.mixin;

/**
 * Exports
 */

module.exports = function(fm) {

  // Alias prototype for optimum
  // compression via uglifyjs
  var proto = Module.prototype;

  /**
   * Module constructor
   *
   * Options:
   *
   *  - `id {String}` a unique id to query by
   *  - `model {Object|Model}` the data with which to associate this module
   *  - `tag {String}` tagName to use for the root element
   *  - `classes {Array}` list of classes to add to the root element
   *  - `template {Function}` a template to use for rendering
   *  - `helpers {Array}`a list of helper function to use on this module
   *  - `children {Object|Array}` list of child modules
   *
   * @constructor
   * @param {Object} options
   * @api public
   */
  function Module(options) {

    // Shallow clone the options
    options = mixin({}, options);

    // Various config steps
    this._configure(options);
    this._add(options.children);

    // Run initialize hooks
    if (this.initialize) this.initialize(options);

    // Fire initialize event hook
    this.fireStatic('initialize', options);
  }

  /**
   * Configures the new Module
   * with the options passed
   * to the constructor.
   *
   * @param  {Object} options
   * @api private
   */
  proto._configure = function(options) {

    // Setup static properties
    this._id = options.id || util.uniqueId();
    this._fmid = options.fmid || util.uniqueId('fmid');
    this.tag = options.tag || this.tag || 'div';
    this.classes = options.classes || this.classes || [];
    this.helpers = options.helpers || this.helpers || [];
    this.template = this._setTemplate(options.template || this.template);
    this.slot = options.slot;

    // Create id and module
    // lookup objects
    this.children = [];
    this._ids = {};
    this._modules = {};
    this.slots = {};

    // Use the model passed in,
    // or create a model from
    // the data passed in.
    var model = options.model || options.data || {};
    this.model = util.isPlainObject(model)
      ? new this.Model(model)
      : model;

    // Attach helpers
    // TODO: Fix this for non-ES5 environments
    this.helpers.forEach(this.attachHelper, this);

    // We fire and 'inflation' event here
    // so that helpers can make some changes
    // to the view before instantiation.
    if (options.fmid) {
      fm.fire('inflation', this, options);
      this.fireStatic('inflation', options);
    }
  };

  /**
   * A private add method
   * that accepts a list of
   * children.
   *
   * @param {Object|Array} children
   * @api private
   */
  proto._add = function(children) {
    if (!children) return;

    var isArray = util.isArray(children);
    var child;

    for (var key in children) {
      child = children[key];
      if (!isArray) child.slot = key;
      this.add(child);
    }
  },

  /**
   * Instantiates the given
   * helper on the Module.
   *
   * @param  {Function} helper
   * @return {Module}
   * @api private
   */
  proto.attachHelper = function(helper) {
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
  proto._setTemplate = function(fn) {
    return fn && fn.render
      ? util.bind(fn.render, fn)
      : fn;
  };

  /**
   * Adds a child view(s) to another Module.
   *
   * Options:
   *
   *  - `at` The child index at which to insert
   *  - `inject` Injects the child's view element into the parent's
   *  - `slot` The slot at which to insert the child
   *
   * @param {Module|Object} children
   * @param {Object|String|Number} options|slot
   */
  proto.add = function(child, options) {
    if (!child) return this;

    // Options
    var at = options && options.at;
    var inject = options && options.inject;
    var slot = ('object' === typeof options)
      ? options.slot
      : options;

    // Remove this view first if it already has a parent
    if (child.parent) child.remove({ fromDOM: false });

    // Assign a slot (prefering defined option)
    slot = child.slot = slot || child.slot;

    // Remove any module that already occupies this slot
    var resident = this.slots[slot];
    if (resident) resident.remove({ fromDOM: false });

    // If it's not a Module, make it one.
    if (!(child instanceof Module)) child = fm(child);

    util.insert(child, this.children, at);
    this._addLookup(child);

    // We append the child to the parent view if there is a view
    // element and the users hasn't flagged `append` false.
    if (inject) this._injectEl(child.el, options);

    // Allow chaining
    return this;
  };

  /**
   * Removes a child view from
   * its current Module contexts
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
  proto.remove = function(param1, param2) {

    // Don't do anything if the first arg is undefined
    if (arguments.length === 1 && !param1) return this;

    // Allow view.remove(child[, options])
    // and view.remove([options]);
    if (param1 instanceof Module) {
      param1.remove(param2 || {});
      return this;
    }

    // Options and aliases
    var options = param1 || {};
    var fromDOM = options.fromDOM !== false;
    var parent = this.parent;
    var el = this.el;
    var parentNode = el && el.parentNode;
    var index;

    // Unless stated otherwise,
    // remove the view element
    // from its parent node.
    if (fromDOM && parentNode) {
      parentNode.removeChild(el);
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
   * @param {Module} child
   * @api private
   */
  proto._addLookup = function(child) {
    var module = child.module();

    // Add a lookup for module
    (this._modules[module] = this._modules[module] || []).push(child);

    // Add a lookup for id
    this._ids[child.id()] = child;

    // Store a reference by slot
    if (child.slot) this.slots[child.slot] = child;

    child.parent = this;
  };

  /**
   * Removes the lookup for the
   * the child view passed.
   *
   * @param {Module} child
   * @api private
   */
  proto._removeLookup = function(child) {
    var module = child.module();

    // Remove the module lookup
    var index = this._modules[module].indexOf(child);
    this._modules[module].splice(index, 1);

    // Remove the id and slot lookup
    delete this._ids[child._id];
    delete this.slots[child.slot];
    delete child.parent;
  };

  /**
   * Injects an element into the
   * Module's root element.
   *
   * By default the element is appended.
   *
   * Options:
   *
   *  - `at` The index at which to insert.
   *
   * @param  {Element} el
   * @param  {Object} options
   * @api private
   */
  proto._injectEl = function(el, options) {
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
   *   myModule.id();
   *   //=> 'my_view_id'
   *
   *   myModule.id('my_other_views_id');
   *   //=> Module
   *
   * @param  {String|undefined} id
   * @return {Module|String}
   * @api public
   */
  proto.id = function(id) {
    if (!arguments.length) return this._id;

    var child = this._ids[id];
    if (child) return child;

    return this.each(function(view) {
      return view.id(id);
    });
  };

  /**
   * Returns the first descendent
   * Module with the passed module type.
   * If called with no arguments the
   * Module's own module type is returned.
   *
   * Example:
   *
   *   // Assuming 'myModule' has 3 descendent
   *   // views with the module type 'apple'
   *
   *   myModule.modules('apple');
   *   //=> Module
   *
   * @param  {String} key
   * @return {Module}
   */
  proto.module = function(key) {
    if (!arguments.length) return this._module || this.name;

    var view = this._modules[key];
    if (view) return view[0];

    return this.each(function(view) {
      return view.module(key);
    });
  };

  /**
   * Returns a list of descendent
   * Modules that match the module
   * type given (Similar to
   * Element.querySelectorAll();).
   *
   * Example:
   *
   *   // Assuming 'myModule' has 3 descendent
   *   // views with the module type 'apple'
   *
   *   myModule.modules('apple');
   *   //=> [ Module, Module, Module ]
   *
   * @param  {String} key
   * @return {Array}
   * @api public
   */
  proto.modules = function(key) {
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
   *   myModule.each(function(child) {
   *     // Do stuff with each child view...
   *   });
   *
   * @param  {Function} fn
   * @return {[type]}
   */
  proto.each = function(fn) {
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
   *   <div class="slot-1">{{{<slot>}}}</div>
   *   <div class="slot-2">{{{<slot>}}}</div>
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
  proto.toHTML = function() {
    var data = {};
    var html;
    var tmp;

    // Create an array for view
    // children data needed in template.
    data[fm.config.templateIterator] = [];

    // Loop each child
    this.each(function(child) {
      tmp = {};
      html = child.toHTML();
      data[child.slot || child.id()] = html;
      tmp[fm.config.templateInstance] = html;
      data.children.push(mixin(tmp, child.model.toJSON()));
    });

    // Run the template render method
    // passing children data (for looping
    // or child views) mixed with the
    // view's model data.
    html = this.template
      ? this.template(mixin(data, this.model.toJSON()))
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
  proto._wrapHTML = function(html) {
    return '<' + this.tag + ' class="' + this.module() + ' ' + this.classes.join(' ') + '" id="' + this._fmid + '">' + html + '</' + this.tag + '>';
  };

  /**
   * Renders the view and replaces
   * the `view.el` with a freshly
   * rendered node.
   *
   * Fires a `render` event on the view.
   *
   * @return {Module}
   */
  proto.render = function() {
    var html = this.toHTML();
    var el = util.toNode(html);

    // Sets a new element as a view's
    // root element (purging descendent
    // element caches).
    this._setEl(el);

    // Fetch all child module elements
    this._fetchEls(this.el);

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
   * @return {Module}
   */
  proto.setup = function(options) {
    var shallow = options && options.shallow;

    // Attempt to fetch the view's
    // root element. Don't continue
    // if no route element is found.
    if (!this._getEl()) return this;

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
   * @return {Module}
   */
  proto.teardown = function(options) {
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
  proto.destroy = function(options) {
    options = options || {};

    var remove = options.remove !== false;
    var l = this.children.length;

    // Destroy each child view.
    // We don't waste time removing
    // the child elements as they will
    // get removed when the parent
    // element is removed.
    //
    // We can't use the standard Module#each()
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
    // for custom Modules to bind to.
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
    this.el = this.model = this.parent = this._modules = this._ids = this._id = null;
  };

  /**
   * Destroys all children.
   *
   * Is this needed?
   *
   * @return {Module}
   * @api public
   */
  proto.empty = function() {
    var l = this.children.length;
    while (l--) this.children[l].destroy();
    return this;
  };

  /**
   * Fetches all descendant elements
   * from the given root element.
   *
   * @param  {Element} root
   * @return {undefined}
   * @api private
   */
  proto._fetchEls = function(root) {
    if (!root) return;
    this.each(function(child) {
      child.el = util.byId(child._fmid, root);
      child._fetchEls(child.el || root);
    });
  };

  /**
   * Returns the Module's root element.
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
  proto._getEl = function() {
    if (!util.hasDom()) return;
    return this.el = this.el || document.getElementById(this._fmid);
  };

  /**
   * Sets a root element on a view.
   * If the view already has a root
   * element, it is replaced.
   *
   * IMPORTANT: All descendent root
   * element caches are purged so that
   * the new correct elements are retrieved
   * next time Module#getElement is called.
   *
   * @param {Element} el
   * @return {Module}
   * @api private
   */
  proto._setEl = function(el) {
    var existing = this.el;
    var parentNode = existing && existing.parentNode;

    // If the existing element has a context, replace it
    if (parentNode) parentNode.replaceChild(el, existing);

    // Update cache
    this.el = el;

    return this;
  };

  /**
   * Empties the destination element
   * and appends the view into it.
   *
   * @param  {Element} dest
   * @return {Module}
   * @api public
   */
  proto.inject = function(dest) {
    if (dest) {
      dest.innerHTML = '';
      this.appendTo(dest);
      this.fireStatic('inject');
    }

    return this;
  };

  /**
   * Appends the view element into
   * the destination element.
   *
   * @param  {Element} dest
   * @return {Module}
   * @api public
   */
  proto.appendTo = function(dest) {
    if (this.el && dest && dest.appendChild) {
      dest.appendChild(this.el);
      this.fireStatic('appendto');
    }

    return this;
  };

  /**
   * Returns a JSON represention of
   * a FruitMachine Module. This can
   * be generated serverside and
   * passed into new FruitMachine(json)
   * to inflate serverside rendered
   * views.
   *
   * @return {Object}
   * @api public
   */
  proto.toJSON = function() {
    var json = {};
    json.children = [];

    // Recurse
    this.each(function(child) {
      json.children.push(child.toJSON());
    });

    json.id = this.id();
    json.fmid = this._fmid;
    json.module = this.module();
    json.model = this.model.toJSON();
    json.slot = this.slot;

    // Fire a hook to allow third
    // parties to alter the json output
    this.fireStatic('tojson', json);

    return json;
  };

  // Events
  proto.on = events.on;
  proto.off = events.off;
  proto.fire = events.fire;
  proto.fireStatic = events.fireStatic;

  // Allow Modules to be extended
  Module.extend = extend(util.keys(proto));

  // Adding proto.Model after
  // Module.extend means this
  // key can be overwritten.
  proto.Model = fm.Model;

  return Module;
};
