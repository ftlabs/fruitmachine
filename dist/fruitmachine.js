/*! fruitmachine - v0.1.0 - 2013-01-02
* https://github.com/wilsonpage/fruitmachine
* Copyright (c) 2013 Wilson Page; Licensed MIT */

/*jslint browser:true, node:true*/
(function(root) {
	'use strict';
	var FruitMachine = typeof exports === 'object' ? exports : root.FruitMachine = {};

	// Current Version
	FruitMachine.VERSION = '0.0.1';

	// Create local references to some native methods.
	var slice = Array.prototype.slice;

	/**
	 * Settings
	 */

	var SETTINGS = {
		slotClass: 'js-module',
		moduleIdAttr: 'data-module-id',
		moduleTypeAttr: 'data-module-type',
		moduleDataAttr: 'data-model-data',
		moduleParentAttr: 'data-parent',
		mustacheSlotArrayName: 'children',
		templates: undefined,
		debug: 0
	};

	/**
	 * Sets a values onto the internal settings.
	 *
	 * @param  {String|Object} key
	 * @param  {*|null} val [description]
	 * @return void
	 */

	FruitMachine.set = function(key, val) {
		if (typeof key === 'string') {
			SETTINGS[key] = val;
		} else {
			util.extend(SETTINGS, val);
		}
	};

	// An object that stores your extended View
	// classes in under module type.
	FruitMachine.Views = {};

	/**
	 * Util
	 */

	var util = FruitMachine.util = {

		attributes: function(attributes) {
			var list = [];
			for (var key in attributes) {
				list.push(key + "='" + attributes[key] + "'");
			}
			return list.join(' ');
		},

		// Shared empty constructor function to aid in prototype-chain creation.
		ctor: function() {},

		// TODO: These wont work on the server, we need better escape methods
		// that work on the client and server that aren't so verbose.
		escape: window.escape,
		unescape: window.unescape,

		extend: function(original) {
			// Loop over every argument after the first.
			slice.call(arguments, 1).forEach(function(source) {
				for (var prop in source) {
					original[prop] = source[prop];
				}
			});

			return original;
		},

		inherits: function(protoProps, staticProps) {
			var parent = this;
			var child;

			// The constructor function for the new subclass is either defined by you
			// (the "constructor" property in your `extend` definition), or defaulted
			// by us to simply call the parent's constructor.
			if (protoProps && protoProps.hasOwnProperty('constructor')) {
				child = protoProps.constructor;
			} else {
				child = function(){ parent.apply(this, arguments); };
			}

			// Inherit class (static) properties from parent.
			util.extend(child, parent);

			// Set the prototype chain to inherit from `parent`, without calling
			// `parent`'s constructor function.
			util.ctor.prototype = parent.prototype;
			child.prototype = new util.ctor();

			// Add prototype properties (instance properties) to the subclass,
			// if supplied.
			if (protoProps) util.extend(child.prototype, protoProps);

			// Add static properties to the constructor function, if supplied.
			if (staticProps) util.extend(child, staticProps);

			// Correctly set child's `prototype.constructor`.
			child.prototype.constructor = child;

			// Set a convenience property in case the parent's prototype is needed later.
			child.__super__ = parent.prototype;

			return child;
		},

		insertChild: function(child, parent, index) {
			if (!parent) return;
			if (typeof index !== 'undefined') {
				parent.insertBefore(child, parent.children[index]);
			} else {
				parent.appendChild(child);
			}
		},

		insert: function(item, array, index) {
			if (typeof index !== 'undefined') {
				array.splice(index, 0, item);
			} else {
				array.push(item);
			}
		},

		isArray: function(a) {
			return (a instanceof Array);
		},

		/**
		 * Replaces the contents of the one node with contents
		 * of another.
		 *
		 * http://jsperf.com/replacing-element-vs-replacing-contents/3
		 *
		 * @param  {Element} replacement
		 * @param  {Element} current
		 * @return {Element}
		 */

		replaceContent: function(replacement, current) {
			current.innerHTML = '';
			var children = replacement.childNodes;
			for (var i = 0, l = children.length; i < l; i++) {
				current.appendChild(children[0]);
			}
			return current;
		},

		toNode: function(string) {
			if (typeof string !== 'string') return string;
			var el = document.createElement('div');
			el.innerHTML = string;
			return el.firstElementChild;
		},

		uniqueId: (function() {
			var counter = 1;
			return function(prefix) {
				return (prefix || '') + (counter++) + '_' + Math.round(Math.random() * 100000);
			};
		})()
	};

	/**
	 * Events
	 */

	var splitter = /\s+/;
	var Events = {

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
	 * VIEW
	 */

	var View = FruitMachine.View = function(options) {
		var Constructor = FruitMachine.Views[options.module] || DefaultView;
		return new Constructor(options);
	};

	var DefaultView = function(options) {
		var domChildren, i, l;
		this._configure(options);

		// Save a reference to this model in the globals.
		this._globals.id[this._id] = this;

		// Don't look for module nodes in the view element if we have flagged not to.
		// When we initiate children we don't want to as the parent will have detected
		// all module nodes already when the master View was instantiated.
		if (!options.skipFindModuleNodes) {
			this._globals.dom = this._getDomChildren();
		}

		// Find any DOM children with this parent
		domChildren = this._globals.dom.byParent && this._globals.dom.byParent[this._id];

		// First we create View instances for each child found in the DOM.
		//
		// This loop is for creating views from children which *have* DOM context.
		if (domChildren) {
			for (i = 0, l = domChildren.length; i < l; i++) {
				this._add(domChildren[i]);
			}
		}

		// ...then we create View instances for each child in the definition.
		// The internal _add method wont add a child if one already exists on
		// the parent with the same _id.
		//
		// This loop is for creating fresh child views with *no* DOM context.
		if (options.children) {
			for (i = 0, l = options.children.length; i < l; i++) {
				this._add(options.children[i]);
			}
		}

		this.initialize.call(this, options);
	};


	util.extend(DefaultView.prototype, Events, {

		_configure: function(options) {
			this.parent = options.parent;
			this.el = options.el;
			this.module = options.module;
			this._id = options._id || options.id || util.uniqueId('dynamic');
			this._children = [];
			this._globals = options._globals || { id: {}, domChildren: {} };
			this._childHash = {};
			this._data = options.data || {};
		},

		/**
		 * Public Methods
		 */

		// Overwrite these yourself.
		initialize: function() {},
		onSetup: function() {},
		onTeardown: function() {},
		onDestroy: function() {},

		_add: function(options) {
			var hasChild = !!this._childHash[options._id || options.id];
			if (hasChild) return;
			options._globals = this._globals;
			options.skipFindModuleNodes = true;
			this.add(new View(options), { append: false });
		},

		add: function(view, options) {
			var children;
			var at = options && options.at;
			var append = options && options.append;

			// Is basic json arrays are passed in, we create view
			// instances from them and add them to the parent view.
			if (util.isArray(view)) {
				children = view;

				for (var i = 0, l = children.length; i < l; i++) {
					this.add(new View(children[i]));
				}

				return this;
			}

			// Merge the global variable stores.
			util.extend(this._globals.id, view._globals.id);

			// Set a refercne back to the parent.
			view.parent = this;
			util.insert(view, this._children, at);

			// Store a reference to this child by id on the parent.
			this._childHash[view._id] = view;

			// Create a reference for views by module type. There could be
			// more than one view instance with the same module type so
			// we use an array for storage.
			this._childHash[view.module] = this._childHash[view.module] || [];
			this._childHash[view.module].push(view);

			// We append the child to the parent view if there is a view
			// element and the users hasn't flagged `append` false.
			if (append !== false && view.el) {
				util.insertChild(view.el, this.el, at);
			}

			// Allow chaining
			return this;
		},

		render: function(options) {
			var html = this._toHTML(options);
			var el;

			if (options && options.asString) return html;

			// Replace the contents of the current element with the
			// newly rendered element. We do this so that the original
			// view element is not replaced, and we don't loose any delegate
			// event listeners.
			el = util.toNode(html);

			if (this.el) {
				util.replaceContent(el, this.el);
			} else {
				this.el = el;
			}

			// Update the View.els for each child View.
			this.updateChildEls();
			this.trigger('render');

			// Return this for chaining.
			return this;
		},

		updateChildEls: function() {
			var domChildren = this._getDomChildren().all;

			for (var i = 0, l = domChildren.length; i < l; i++) {
				var child = domChildren[i];
				this.id(child._id).el = child.el;
			}

			return this;
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
				return this._data;
			}

			// If a string key has been
			// passed, but no value
			if (typeof key === 'string' && !value) {
				return this._data[key];
			}

			// If the user has stated a key
			// and a value. Set the value on
			// the key.
			if (key && value) {
				this._data[key] = value;
				this.trigger('datachange');
				return this;
			}

			// If the key is an object literal
			// then we extend the data store with it.
			if ('object' === typeof key) {
				util.extend(this._data, key);
				this.trigger('datachange');
				return this;
			}
		},

		child: function(query) {
			var result = this._childHash[query];
			return result[0] || result;
		},

		/**
		 * Returns an array of children
		 * that match the query.
		 *
		 * @param  {String} query
		 * @return {Array}
		 */
		children: function(query) {
			return this._childHash[query];
		},

		id: function(id) {
			return id ? this._globals.id[id] : this._id;
		},

		inject: function(el) {
			if (!el) return this;
			el.innerHTML = '';
			el.appendChild(this.el);
			return this;
		},

		setup: function() {

			// Call 'setup' on all subviews
			// first (bottom up recursion).
			for (var i = 0, l = this._children.length; i < l; i++) {
				this._children[i].setup();
			}

			// If this is already setup, call
			// `teardown` first so that we don't
			// duplicate event bindings and shizzle.
			if (this.isSetup) this.teardown();

			// We trigger a `setup` event and
			// call the `onSetup` method. You can
			// listen to the `setup` event, or
			// overwrite the `onSetup` method in
			// your custom views to do setup logic.
			this.trigger('setup');
			this.onSetup();
			this.isSetup = true;

			// For chaining
			return this;
		},

		/**
		 * Teardown calls the `teardown`
		 * event on all children then on itself.
		 *
		 * Teardown allows custom views to listen to
		 * the event and unbind event listeners etc.
		 *
		 * Teardown should be used if the view
		 * itself is not going to be destroyed;
		 * just updated in some way.
		 *
		 * @return {View}
		 */
		teardown: function() {
			for (var i = 0, l = this._children.length; i < l; i++) {
				this._children[i].teardown();
			}

			this.trigger('teardown');
			this.onTeardown();
			this.isSetup = false;

			// For chaining
			return this;
		},

		_detach: function(options) {
			var i;
			var skipEl = options && options.skipEl;

			// Remove the view el from the DOM
			if (!skipEl && this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);

			// If there is no parent view reference, return here.
			if (!this.parent) return this;

			// Remove reference from children array
			i = this.parent._children.indexOf(this);
			this.parent._children.splice(i, 1);

			// Remove references from childHash
			i = this.parent._childHash[this.module].indexOf(this);
			this.parent._childHash[this.module].splice(i, 1);
			delete this.parent._childHash[this._id];
			delete this.parent._globals.id[this._id];

			// Return the detached view instance.
			return this;
		},

		empty: function() {
			while (this._children.length) {
				this._children[0].destroy();
			}

			return this;
		},

		destroy: function(options) {

			// Recursively run on children
			// first (bottom up). We don't run
			// view#_detach() on children as
			// their references are cleared anyway.
			while (this._children.length) {
				this._children[0].destroy({ skipEl: true });
			}

			// Run teardown so custom
			// views can bind logic to it
			this.teardown(options);

			// Detach this view from its
			// parent and unless otherwise
			// stated, from the DOM.
			this._detach(options);

			// Trigger a destroy event
			// for custom Views to bind to.
			this.trigger('destroy');
			this.onDestroy();

			// Set a flag to say this view
			// has been destroyed. This is
			// useful to check for after a
			// slow ajax call that might come
			// back after a view has been detroyed.
			this.destroyed = true;

			// Clear references.
			this.el = this.module = this._id = this._globals = this._childHash = this._data = null;
		},

		/**
		 * Private Methods
		 */

		_toHTML: function(options) {
			var template = SETTINGS.templates(this.module);
			var renderData = {};

			// Don't template models that
			// are flagged with render: false;
			if (this.render === false) return;

			// Check we have a template
			if (!template) return;

			// Create an array to store child html in.
			renderData[SETTINGS.mustacheSlotArrayName] = [];

			if (this._children) {
				for (var i = 0, l = this._children.length; i < l; i++) {
					var child = this._children[i];
					var html = child._toHTML(options);

					// If no html was generated we
					// don't want to add a slot to the
					// parent's render data, so return here.
					if (!html) return;

					// Make the sub view html available
					// to the parent model. So that when the
					// parent model is rendered it can print
					// the sub view html into the correct slot.
					renderData[SETTINGS.mustacheSlotArrayName].push(util.extend({ child: html }, child._data));
					renderData[child._id] = html;
				}
			}

			// Prepare the render data.
			renderData.fm_classes = SETTINGS.slotClass;
			renderData.fm_attrs = this._makeAttrs(options);

			// Call render template.
			return template(util.extend(renderData, this._data));
		},

		_makeAttrs: function(options) {
			var attrs = {};
			var embedData = options && options.embedData;
			var forClient = options && options.forClient;

			// Setup module attributes
			attrs[SETTINGS.moduleIdAttr] = this._id;
			attrs[SETTINGS.moduleTypeAttr] = this.module;

			if (embedData) {
				attrs[SETTINGS.moduleDataAttr] = util.escape(JSON.stringify(this._data));
			}

			if (forClient && this.parent) {
				attrs[SETTINGS.moduleParentAttr] = this.parent._id;
			}

			return util.attributes(attrs);
		},

		_extractEmbeddedData: function(node) {
			var data = node.getAttribute(SETTINGS.moduleDataAttr);
			if (!data) return {};
			data = JSON.parse(util.unescape(data));
			node.removeAttribute(SETTINGS.moduleDataAttr);
			return data;
		},

		_getDomChildren: function() {
			var nodes;
			var domChildren = { all: [], byParent: {} };
			if (!this.el) return domChildren;

			nodes = this.el.getElementsByClassName(SETTINGS.slotClass);

			// Loop over each module node found.
			for (var i = 0, l = nodes.length; i < l; i++) {
				var node = nodes[i];
				var child = {
					el: node,
					_id: node.getAttribute(SETTINGS.moduleIdAttr) || util.uniqueId('unknown'),
					module: node.getAttribute(SETTINGS.moduleTypeAttr) || 'undefined',
					parentId: node.getAttribute(SETTINGS.moduleParentAttr),
					data: this._extractEmbeddedData(node)
				};

				domChildren.all.push(child);

				if (child.parentId) {
					domChildren.byParent[child.parentId] = domChildren.byParent[child.parentId] || [];
					domChildren.byParent[child.parentId].push(child);
				}
			}

			return domChildren;
		}
	});

	View.extend = function(module, protoProps, staticProps) {
		FruitMachine.Views[module] = DefaultView.extend(protoProps, staticProps);
	};

	// We add the 'extend' static method to the FruitMachine base
	// class. This allows you to extend the default View class
	// to add custom insteractions and logic to more complex modules.
	// Redefining any of the View.prototype methods will overwrite them.
	DefaultView.extend = util.inherits;
}(this));