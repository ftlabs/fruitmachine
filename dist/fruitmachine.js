/*! fruitmachine - v0.2.0 - 2013-01-28
* https://github.com/wilsonpage/fruitmachine
* Copyright (c) 2013 Wilson Page; Licensed MIT */

/*jslint browser:true, node:true*/
var FruitMachine = (function(root) {
  'use strict';

  /**
   * VIEW
   */

  var FruitMachine = function(options) {
    if (options.module) return create(options);
    this._configure(options);
    this.add(options.views);
    this.initialize(options);
  };

  // Current Version
  FruitMachine.VERSION = '0.0.1';


  var uniqueId = (function() {
    var i = 0;
    return function(prefix) {
      prefix = prefix || '';
      return prefix + (++i * Math.round(Math.random() * 10000000));
    };
  }());

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

    mixin: function(original) {
      // Loop over every argument after the first.
      slice.call(arguments, 1).forEach(function(source) {
        for (var prop in source) {
          original[prop] = source[prop];
        }
      });
      return original;
    }
  };

  // Create local references to some native methods.
  var slice = Array.prototype.slice;
  var concat = Array.prototype.concat;
  var has = Object.prototype.hasOwnProperty;
  var mixin = util.mixin;

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


  FruitMachine.helper = function(name, Helper) {
    if (Helper.attach) Helper.attach(FruitMachine);
    store.helpers[name] = Helper;
  };

  var store = {
    modules: {},
    templates: {},
    helpers: {}
  };

  var getTemplate = function(module) {
    return store.templates[module];
  };

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

  // Manages helpers
  var helper = {
    attach: function(helper) {
      var Helper = store.helpers[helper];
      var Exports = Helper && Helper.exports;
      if (!Exports) return;
      if ('function' === typeof Exports) {
        return this[helper] = new Exports(this);
      } else {
        return util.mixin(this, Exports);
      }
    },

    setup: function(helper) {
      if (!helper.onSetup) return;
      helper.onSetup();
    },

    teardown: function(helper) {
      if (!helper.onTeardown) return;
      helper.onTeardown();
    }
  };

  // Factory method
  function create(options) {
    var Module = store.modules[options.module] || FruitMachine;
    options._module = options.module;
    delete options.module;
    return new Module(options);
  }

  // Extend the prototype
  mixin(FruitMachine.prototype, Events, {

    _configure: function(options) {
      this._id = options.id || uniqueId('auto_');
      this._fmid = options.fmid || uniqueId('fmid');
      this.module = options._module;
      this.model = options.model || {};
      this._lookup = {};
      this._views = [];

      // Use the template defined on
      // the custom view, or use the
      // template getter.
      this.template = this.template || getTemplate(this.module);

      // Upgrade helpers
      this.helpers = (this.helpers || []).map(helper.attach, this);
    },

    initialize: function() {},
    onSetup: function() {},
    onTeardown: function() {},
    onDestroy: function() {},

    add: function(views) {
      if (!views) return;
      var view;

      // Make sure it's an array
      views = concat.call([], views);

      for (var i = 0, l = views.length; i < l; i++) {
        view = views[i];
        if (!(view instanceof FruitMachine)) view = new FruitMachine(view);
        this._views.push(view);
        this.addLookup(view);
        view.parent = this;
      }

      return this;
    },

    addLookup: function(view) {
      this._lookup[view.module] = this._lookup[view.module] || [];
      this._lookup[view.id()] = this._lookup[view.module] = view;
    },

    id: function(id) {
      return id ? this._lookup[id] : this._id;
    },

    fmid: function() {
      return this._fmid;
    },

    data: function() {
      if (!this.model) return {};
      if (this.model.toJSON) return this.model.toJSON();
      return this.model;
    },

    views: function() {
      return this._views;
    },

    html: function() {
      var data = {};
      var views = this.views();
      var view, html;
      data.views = [];

      for (var i = 0, l = views.length; i < l; i++) {
        view = views[i];
        html = view.html();
        data[view.id()] = html;
        data.views.push({ view: html });
      }

      data.fm_attrs = 'id="' + this.fmid() + '"';
      return this._html = this.template.render(mixin(data, this.data()));
    },

    render: function() {
      return this.update();
    },

    setup: function(options) {
      var shallow = options && options.shallow;
      var views = this.views();

      // Call 'setup' on all subviews
      // first (bottom up recursion).
      if (!shallow) {
        for (var i = 0, l = views.length; i < l; i++) {
          views[i].setup();
        }
      }

      // Setup any helpers
      this.helpers.forEach(helper.setup, this);

      this.onSetup();
      this.trigger('setup');
      this.isSetup = true;

      // For chaining
      return this;
    },

    teardown: function(options) {
      var shallow = options && options.shallow;
      var views = this.views();

      // Call 'setup' on all subviews
      // first (bottom up recursion).
      if (!shallow) {
        for (var i = 0, l = views.length; i < l; i++) {
          views[i].teardown();
        }
      }

      // Teardown any helpers
      this.helpers.forEach(helper.teardown, this);

      this.trigger('teardown');
      this.onTeardown();
      this.isSetup = false;

      // For chaining
      return this;
    },

    el: function() {
      return this._el || (this._el = document.getElementById(this.fmid()));
    },

    update: function() {
      var current = this.el();
      var replacement = this.toNode();

      if (!current && !current.parentNode) {
        this._el = replacement;
        return this;
      }

      current.parentNode.replaceChild(replacement, current);
      this._el = replacement;
      return this;
    },

    node: function() {
      var el = document.createElement('div');
      el.innerHTML = this.html();
      return el.firstElementChild;
    },

    inject: function(dest) {
      var el = this.el();
      dest.innerHTML = '';
      dest.appendChild(el);
    },

    toJSON: function() {
      var json = {};
      var views = this.views();
      json.views = [];

      // Recurse
      for (var i = 0, l = views.length; i < l; i++) {
        json.views.push(views[i].toJSON());
      }

      json.id = this.id();
      json.fmid = this.fmid();
      json.model = this.data();
      return json;
    }
  });

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  FruitMachine.inherit = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && has.call(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    mixin(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) mixin(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // We add the 'extend' static method to the FruitMachine base
  // class. This allows you to extend the default View class
  // to add custom insteractions and logic to more complex modules.
  // Redefining any of the View.prototype methods will overwrite them.
  FruitMachine.module = function(type, props) {
    if ('string' === typeof type) {
      return store.modules[type] = FruitMachine.inherit(props);
    } else if ('object' === typeof type) {
      return FruitMachine.inherit(type);
    }
  };

  return FruitMachine;
}(this));