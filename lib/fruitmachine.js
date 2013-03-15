/**
 * FruitMachine
 *
 * Renders layouts/modules from a basic layout definition.
 * If views require custom interactions devs can extend
 * the basic functionality.
 *
 * Example:
 *
 *   var definition = {
 *     module: 'orange',
 *     data: {
 *       title: 'A title',
 *       body: 'Some body copy'
 *     }
 *   };
 *
 *   var view = new FruitMachine.View(definition);
 *
 *   view
 *     .render()
 *     .inject(document.body)
 *     .setup();
 *
 * @version 0.1.0
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @author Wilson Page <wilson.page@ft.com>
 */

/*jslint browser:true, node:true*/
(function() {
  'use strict';

  // Create local references to some methods
  var slice = Array.prototype.slice;
  var has = Object.prototype.hasOwnProperty;

  // Determine if we have a DOM
  // in the current environment.
  var hasDom = (typeof document !== 'undefined');

  // Global data store
  var store = {
    modules: {},
    templates: {},
    helpers: {}
  };

  /**
   * VIEW
   */

  var FruitMachine = function(options) {
    return new View(options);
  };

  // Current Version
  FruitMachine.VERSION = '0.0.1';

  // Utilities
  var util = FruitMachine.util = {

    bind: function(method, context) {
      return function() { return method.apply(context, arguments); };
    },

    bindAll: function(ob, context) {
      for (var key in ob) {
        if ('function' === typeof ob[key]) {
          ob[key] = util.bind(ob[key], context);
        }
      }
    },

    isArray: function(arg) {
      return arg instanceof Array;
    },

    mixin: function(original) {
      // Loop over every argument after the first.
      slice.call(arguments, 1).forEach(function(source) {
        for (var prop in source) {
          original[prop] = source[prop];
        }
      });
      return original;
    },

    querySelectorId: function(id, el) {
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

    insert: function(item, array, index) {
      if (typeof index !== 'undefined') {
        array.splice(index, 0, item);
      } else {
        array.push(item);
      }
    },

    uniqueId: (function() {
      var i = 0;
      return function(prefix, suffix) {
        prefix = prefix || 'id';
        suffix = suffix || 'a';
        return [prefix, (++i) * Math.round(Math.random() * 100000), suffix].join('-');
      };
    }())
  };

  // Alias frequently used utils
  var mixin = util.mixin;

  /**
   * Events
   */

  var splitter = /\s+/;
  var Events = FruitMachine.Events = {

    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) return this;
      events = events.split(splitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      event = events.shift();
      while (event) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
        event = events.shift();
      }

      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) return;
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(splitter) : Object.keys(calls);
      while (event = events.shift()) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) continue;
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        while ((node = node.next) !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls.all;
      events = events.split(splitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        if (node = calls[event]) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }

        if (node = all) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
      }

      return this;
    }
  };

  /**
   * Helpers
   */

  /**
   * Registers a helper
   *
   * @param  {String} name
   * @param  {Function} helper
   * @return void
   */
  FruitMachine.helper = function(name, helper) {
    store.helpers[name] = helper;
  };

  FruitMachine.helper.remove = function(name) {
    delete store.helpers[name];
  };

  /**
   * Templates
   */

  /**
   * Registers templates, or overwrites
   * the `getTemplate` method with a
   * custom template getter function.
   *
   * @param  {Object|Function} templates
   * @return void
   */
  FruitMachine.templates = function(templates) {
    var type = typeof templates;
    if ('object' === type) mixin(store.templates, templates);
    else if ('function' === type) getTemplate = templates;
  };

  /**
   * The default get template method
   * if FruitMachine.template is passed
   * a function, this gets overwritten
   * by that.
   *
   * @param  {String} module
   * @return {Template}
   */
  var getTemplate = function(module) {
    return store.templates[module];
  };

  var View = FruitMachine.View = function(options) {
    options = mixin({}, options);
    if (options.module) return create(options);
    this._configure(options);
    this.add(options.children);
    this.onInitialize(options);
    this.trigger('initialize', options);
  };

  /**
   * Creates a new FruitMachine view
   * using the options passed.
   *
   * If a module parameter is passed
   * we attempt to find a registered
   * module of that name to intantiate,
   * else we use a default view instance.
   *
   * @param  {Object} options
   * @return {FruitMachine}
   */
  function create(options) {
    var Module = store.modules[options.module] || FruitMachine;
    options._module = options.module;
    delete options.module;
    return new Module(options);
  }

  // Mixin Events and extend the prototype
  mixin(View.prototype, {
    on: Events.on,
    off: Events.off,

    /**
     * Proxies the standard Event.trigger
     * method so that we can add bubble
     * functionality.
     *
     * Options:
     *
     *   - `bubble` States whether the event
     *      should bubble through parent views.
     *
     * @param  {String} key
     * @param  {Array} args
     * @param  {Object} options
     * @return {View}
     * @api public
     */
    trigger: function(key, args, options) {
      options = options || {};

      // Allows options to be
      // the second  or third arg
      if (!util.isArray(args)) {
        options = args || {};
        args = [];
      }

      // Trigger event
      Events.trigger.apply(this, [key].concat(args));

      // Trigger the same event on the parent view
      if (options.bubble && this.parent) this.parent.trigger(key, args, options);

      // Allow chaining
      return this;
    },

    // Empty methods you can overwrite
    // in your custom view logic.
    onInitialize: function() {},
    onSetup: function() {},
    onTeardown: function() {},
    onDestroy: function() {},

    /**
     * Configures the new View
     * with the options passed
     * to the constructor.
     *
     * @param  {Object} options
     * @api private
     */
    _configure: function(options) {
      this._id = options.id || util.uniqueId('auto_');
      this._fmid = options.fmid || util.uniqueId('fmid');
      this.tag = this.tag || options.tag || 'div';
      this.classes = this.classes || options.classes || [];
      this.module = this.module || options._module;
      this.template = this.getTemplate();
      this._lookup = {};
      this._children = [];

      // Use the model passed in, or create
      // a model from the data passed in.
      this.model = options.model || new Model(options.data || {});

      // Purge html caches when the model is changed
      this.purgeHtmlCache = util.bind(this.purgeHtmlCache, this);
      this.model.on('change', this.purgeHtmlCache);

      // Init named helpers
      (this.helpers || []).forEach(function(helper) {
        if (store.helpers[helper]) store.helpers[helper](this, FruitMachine);
      }, this);
    },

    getTemplate: function() {
      // Use the template defined on the
      // custom view, or use the template getter.
      this.template = this.template || getTemplate(this.module);

      // Warn if no template found
      if (!this.template) return console.log('FM - No template for %s', this.module);

      // Accomodate for template.render() or template()
      // this.template.render has to be bound to stop
      // a hogan.js error if the context is wrong.
      return this.template.render ? util.bind(this.template.render, this.template) : this.template;
    },

    add: function(children, options) {
      var at = options && options.at;
      var inject = options && options.inject;
      var child;

      if (!children) return;

      // Make sure it's an array
      children = [].concat(children);

      for (var i = 0, l = children.length; i < l; i++) {
        child = children[i];
        if (!(child instanceof View)) child = new View(child);

        util.insert(child, this._children, at);
        this._addLookup(child);
        child.parent = this;

        // We append the child to the parent view if there is a view
        // element and the users hasn't flagged `append` false.
        if (inject) this.injectElement(child.el, options);
      }

      this.purgeHtmlCache();

      return this;
    },

    _addLookup: function(child) {
      this._lookup[child.id()] = child;
      this._lookup[child.module] = this._lookup[child.module] || [];
      this._lookup[child.module].push(child);
    },

    _removeLookup: function(child) {
      var index = this._lookup[child.module].indexOf(child);
      this._lookup[child.module].splice(index, 1);
      delete this._lookup[child._id];
    },

    injectElement: function(el, options) {
      var at = options && options.at;
      var parent = this.el;
      if (!el || !parent) return;

      if (typeof at !== 'undefined') {
        parent.insertBefore(el, parent.children[at]);
      } else {
        parent.appendChild(el);
      }
    },

    id: function(id) {
      return id ? this._lookup[id] : this._id;
    },

    /**
     * Returns the first child
     * view that matches the query.
     *
     * Example:
     *
     *   var child = view.child(<id>);
     *
     *   // or
     *
     *   var child = view.child(<module>);
     *
     * @param  {String} name [id|module]
     * @return {View|undefined}
     */
    child: function(query) {
      var child = this._lookup[query];
      if (child) return child[0] || child;
      return this.each(function(view) {
        return view.child(query);
      });
    },

    /**
     * Allows three ways to return
     * a view's children and direct
     * children, depending on arguments
     * passed.
     *
     * Example:
     *
     *   // Return all direct children
     *   view.children();
     *
     *   // Return all descendant children
     *   // that match query.
     *   view.children('orange');
     *
     *   // Loop direct children like forEach style.
     *   // Not sure if this is neccessary or not?
     *   // Could be depricated.
     *   view.children(function(child) { ... });
     *
     * @param  {undefined|String|Function} query
     * @return {Array}
     */
    children: function(query) {

      // If no argument is passd,
      // return all direct children.
      if (!query) return this._children;

      // If a function is passed, loop the children
      if ('function' === typeof query) return this.each(query);

      // Get the direct children
      // that match this query
      var list = this._lookup[query] || [];

      // Then loop each child and run the
      // same opperation, appending the result
      // onto the list.
      this.each(function(view) {
        list = list.concat(view.children(query));
      });

      return list;
    },

    /**
     * Calls the passed function
     * for each of the view's
     * children.
     *
     * @param  {Function} fn [description]
     * @return {[type]}      [description]
     */
    each: function(fn) {
      var children = this.children();
      var l = children.length;
      var result;

      for (var i = 0; i < l; i++) {
        result = fn(children[i]);
        if (result) return result;
      }
    },

    toHTML: function() {
      var data = {};
      var html;

      // Use cache if populated
      if (this.html) return this.html;

      // Create an array for view
      // children data needed in template.
      data.children = [];

      // Loop each child
      this.each(function(child) {
        html = child.toHTML();
        data[child.id()] = html;
        data.children.push(mixin({ child: html }, child.model.get()));
      });

      // Run the template render method
      // passing children data (for looping
      // or child views) mixed with the
      // view's model data.
      html = this.template(mixin(data, this.model.get()));

      // Wrap the html in a FruitMachine
      // generated root element and return.
      return this.html = this.wrapHTML(html);
    },

    wrapHTML: function(html) {
      return '<' + this.tag + ' class="' + this.module + ' ' + this.classes.join(' ') + '" id="' + this._fmid + '">' + html + '</' + this.tag + '>';
    },

    purgeHtmlCache: function() {

      // Clear html
      this.html = null;

      // Recurse
      if (this.parent) this.parent.purgeHtmlCache();

      return this;
    },

    render: function() {

      // Templates the entire view
      // recursively, returning a
      // node rather than HTML.
      var el = this.toNode();

      // Sets a new element as a view's
      // root element (purging descendent
      // element caches).
      this.setElement(el);

      // Handy hook
      this.trigger('render');

      return this;
    },

    /**
     * Destroys all children.
     *
     * @return {View}
     */
    empty: function() {
      var children = this.children();
      var l = children.length;

      while (l--) children[l].destroy();

      return this;
    },

    setup: function(options) {
      var shallow = options && options.shallow;

      // Call 'setup' on all subviews
      // first (bottom up recursion).
      if (!shallow) {
        this.each(function(child) {
          child.setup();
        });
      }

      // Attempt to fetch the view's
      // root element. Don't continue
      // if no route element is found.
      if (!this.getElement()) return this;

      // If this is already setup, call
      // `teardown` first so that we don't
      // duplicate event bindings and shizzle.
      if (this.isSetup) this.teardown({ shallow: true });

      // Fire the `setup` event hook
      this.trigger('setup');

      // Run onSetup custom function
      this.onSetup();

      // Flag view as 'setup'
      this.isSetup = true;

      // For chaining
      return this;
    },

    teardown: function(options) {
      var shallow = options && options.shallow;

      // Call 'setup' on all subviews
      // first (bottom up recursion).
      if (!shallow) {
        this.each(function(child) {
          child.teardown();
        });
      }

      // Don't teardown if this view
      // hasn't been setup. Teardown
      // is supposed to undo all the
      // work setup does, and therefore
      // will likely run into undefined
      // variables if setup hasn't run.
      if (!this.isSetup) return this;

      this.trigger('teardown');
      this.onTeardown();
      this.isSetup = false;

      // For chaining
      return this;
    },

    destroy: function(options) {
      var children = this._children;
      var l = children.length;

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
        children[l].destroy({ el: false });
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
      this.teardown(options);

      // Trigger a destroy event
      // for custom Views to bind to.
      this.trigger('destroy');
      this.onDestroy();

      // Remove the model 'change' event
      // listener just in case the same
      // model is being shared with other views.
      this.model.off('change', this.purgeHtmlCache);

      // Unbind any old event listeners
      this.off();

      // Set a flag to say this view
      // has been destroyed. This is
      // useful to check for after a
      // slow ajax call that might come
      // back after a view has been detroyed.
      this.destroyed = true;

      // Clear references
      this.el = this.model = this.parent = this._lookup = this.module = this._id = null;
    },

    /**
     * Removes the View's element
     * from the DOM.
     *
     * @return {FruitMachine}
     */
    remove: function(options) {
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
      index = this.parent._children.indexOf(this);
      this.parent._children.splice(index, 1);

      // Remove references from the lookup
      this.parent._removeLookup(this);

      return this;
    },

    /**
     * Returns the closest root view
     * element, walking up the chain
     * until it finds one.
     *
     * @return {Element}
     */
    closestElement: function() {
      var view = this.parent;
      while (view && !view.el && view.parent) view = view.parent;
      return view && view.el;
    },

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
     */
    getElement: function() {
      if (!hasDom) return;
      return this.el = this.el
        || document.getElementById(this._fmid)
        || this.parent && util.querySelectorId(this._fmid, this.closestElement());
    },

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
     */
    setElement: function(el) {
      var existing = this.el;

      if (existing && existing.parentNode) {
        existing.parentNode.replaceChild(el, existing);
      }

      // Purge all element caches
      this.purgeElementCaches();

      // Update cache
      this.el = el;

      return this;
    },

    /**
     * Recursively purges the
     * element cache.
     *
     * @return void
     */
    purgeElementCaches: function() {
      this.each(function(child) {
        child.purgeElementCaches();
      });

      this.el = null;
    },

    /**
     * A single method for getting
     * and setting view data.
     *
     * Example:
     *
     *   // Getters
     *   var all = view.data();
     *   var one = view.data('myKey');
     *
     *   // Setters
     *   view.data('myKey', 'my value');
     *   view.data({
     *     myKey: 'my value',
     *     anotherKey: 10
     *   });
     *
     * @param  {String|Object|null} key
     * @param  {*} value
     * @return {*}
     */
    data: function(key, value) {

      // If no key and no value have
      // been passed then return the
      // entire data store.
      if (!key && !value) {
        return this.model.get();
      }

      // If a string key has been
      // passed, but no value
      if (typeof key === 'string' && !value) {
        return this.model.get(key);
      }

      // If the user has stated a key
      // and a value. Set the value on
      // the key.
      if (key && value) {
        this.model.set(key, value);
        return this;
      }

      // If the key is an object literal
      // then we extend the data store with it.
      if ('object' === typeof key) {
        this.model.set(key);
        return this;
      }
    },

    /**
     * Detects whether a view is in
     * the DOM (useful for debugging).
     *
     * @return {Boolean}
     */
    inDOM: function() {
      if (this.parent) return this.parent.inDOM();
      return !!(this.el && this.el.parentNode);
    },

    /**
     * Templates the whole view and turns
     * it into a real node.
     *
     * @return {Element}
     */
    toNode: function() {
      var el = document.createElement('div');
      el.innerHTML = this.toHTML();
      return el.removeChild(el.firstElementChild);
    },

    /**
     * Empties the destination element
     * and appends the view into it.
     *
     * @param  {Element} dest
     * @return {View}
     */
    inject: function(dest) {
      if (dest) {
        dest.innerHTML = '';
        this.appendTo(dest);
      }

      return this;
    },

    /**
     * Appends the view element into
     * the destination element.
     *
     * @param  {Element} dest
     * @return {View}
     */
    appendTo: function(dest) {
      if (this.el && dest && dest.appendChild) {
        dest.appendChild(this.el);
      }

      return this;
    },

    /**
     * Returns a JSON represention of
     * a FruitMachine View. This can
     * be generated serverside and
     * passed into new FruitMachine(json)
     * to inflate serverside rendered
     * views.
     *
     * @return {Object}
     */
    toJSON: function() {
      var json = {};
      json.children = [];

      // Recurse
      this.each(function(child) {
        json.children.push(child.toJSON());
      });

      json.id = this.id();
      json.fmid = this._fmid;
      json.module = this.module;
      json.data = this.model.get();
      return json;
    }
  });

  /**
   * Model
   */

  var Model = FruitMachine.Model = function(options) {
    this.fmid = util.uniqueId('model');
    this._data = mixin({}, options);
  };

  // Merge in Events and extend with:
  mixin(Model.prototype, Events, {

    get: function(key) {
      return key ? this._data[key] : this._data;
    },

    set: function(key, value) {
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
    },

    clear: function() {
      this._data = {};
      return this;
    },

    destroy: function() {
      this._data = null;
    },

    toJSON: function() {
      return mixin({}, this._data);
    }
  });

  /**
   * Inherit
   */

  // Helper function to correctly
  // set up the prototype chain,
  // for subclasses. Similar to
  // `goog.inherits`, but uses a
  // hash of prototype properties
  // and class properties to be extended.
  View.inherit = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for
    // the new subclass is either
    // defined by you (the "constructor"
    // property in your `extend` definition),
    // or defaulted by us to simply call the
    // parent's constructor.
    if (protoProps && has.call(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the
    // constructor function, if supplied.
    mixin(child, parent, staticProps);

    // Set the prototype chain to
    // inherit from `parent`, without
    // calling `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties
    // (instance properties) to
    // the subclass, if supplied.
    if (protoProps) mixin(child.prototype, protoProps);

    // Set a convenience property
    // in case the parent's prototype
    // is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // We add the 'module' static method to the FruitMachine base
  // class. This allows you to extend the default View class
  // to add custom insteractions and logic to more complex modules.
  // Redefining any of the View.prototype methods will overwrite them.
  FruitMachine.module = function(type, props) {
    if ('string' === typeof type) {
      props.module = type;
      return store.modules[type] = View.inherit(props);
    } else if ('object' === typeof type) {
      return View.inherit(type);
    }
  };

  FruitMachine.module.clear = function(type) {
    delete store.modules[type];
  };

  // Expose the library
  if (typeof exports === "object") {
    module.exports = FruitMachine;
  } else if (typeof define === "function" && define.amd) {
    define(FruitMachine);
  } else {
    window['FruitMachine'] = FruitMachine;
  }
}());
