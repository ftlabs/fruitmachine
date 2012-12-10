(function(root) {
	'use strict';
	var FruitMachine = typeof exports === 'object' ? exports : root['FruitMachine'] = {};

	// Current Version
	FruitMachine.VERSION = '0.0.1';

	/**
	 * Turn on for debug messages.
	 *
	 * @constant
	 * @type {Boolean|Number}
	 */
	var debug = 0;

	/**
	 * SETTINGS
	 */

	var SETTINGS = FruitMachine.SETTINGS = {
		breakpointDebounce: 50,
		slotClass: 'js-module',
		moduleIdAttr: 'data-module-id',
		moduleTypeAttr: 'data-module-type',
		moduleDataAttr: 'data-model-data',
		moduleParentAttr: 'data-parent',
		mustacheSlotVarPrefix: 'module',
		mustacheSlotArrayName: 'modules'
	};

	var templates = {};

	// User must define their templates before creating any Models or Views.
	var setTemplates = FruitMachine['templates'] = function(params) {
		util.extend(templates, params);
	};

	// Create local references to some native methods.
	var slice = Array.prototype.slice;
	var splice = Array.prototype.splice;
	var forEach = Array.prototype.forEach;

	// An object that you can store your extended View classes in under module type.
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

	// Backbone.Events
	// -----------------

	// Regular expression used to split event strings
	var eventSplitter = /\s+/;

	// A module that can be mixed in to *any object* in order to provide it with
	// custom events. You may bind with `on` or remove with `off` callback functions
	// to an event; trigger`-ing an event fires all callbacks in succession.
	//
	//     var object = {};
	//     _.extend(object, Backbone.Events);
	//     object.on('expand', function(){ alert('expanded'); });
	//     object.trigger('expand');
	//
	var Events = {

		// Bind one or more space separated events, `events`, to a `callback`
		// function. Passing `"all"` will bind the callback to all events fired.
		on: function(events, callback, context) {

			var calls, event, node, tail, list;
			if (!callback) return this;
			events = events.split(eventSplitter);
			calls = this._callbacks || (this._callbacks = {});

			// Create an immutable callback list, allowing traversal during
			// modification.  The tail is an empty object that will always be used
			// as the next node.
			while (event = events.shift()) {
				list = calls[event];
				node = list ? list.tail : {};
				node.next = tail = {};
				node.context = context;
				node.callback = callback;
				calls[event] = {tail: tail, next: list ? list.next : node};
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
			events = events ? events.split(eventSplitter) : Object.keys(calls);
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
			events = events.split(eventSplitter);
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

	var viewOptions = ['module', 'el', 'parent', '_globals'];

	var View = FruitMachine['View'] = function(options) {
		// Use a custom extended class if it exists for this module type
		// else use the default base view class.
		var Constructor = FruitMachine.Views[options.module] || DefaultView;
		return new Constructor(options);
	};

	var DefaultView = function(options) {
		if (debug) console.log('Creating new view instance...');
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

		// Fired when a View is instantiated, overwrite this yourself.
		initialize: function() {},

		_add: function(options) {
			var hasChild = !!this._childHash[options._id || options.id];
			if (hasChild) return;
			options._globals = this._globals;
			options.skipFindModuleNodes = true;
			this.add(new View(options), { append: false });
		},

		add: function(view, options) {
			var at = options && options.at;
			var append = options && options.append;
			if (debug) console.log('Adding view...');

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

			if (append !== false && view.el) {
				util.insertChild(view.el, this.el, at);
			}

			// Return the newly created view.
			return this;
		},

		remove: function(view, options) {

		},

		render: function(options) {
			var html = this._toHTML(options);
			var el, domChildren;

			if (options && options.asString) return html;

			// Replace the contents of the current element with the
			// newly rendered element. We do this so that the original
			// view element is not replaced, and we don't loose any delegate
			// event listeners.
			el = util.toNode(html);
			if (this.el) util.replaceContent(el, this.el);
			this.el = el;

			// Update the View.els for each child View.
			this.updateChildEls();
			this.trigger('render');
			if (debug) console.log('View instance rendered.');

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

		get: function(key) {
			return key ? (this[key] || this._data[key]) : this._data;
		},

		set: function(data, val) {
			if (typeof data === 'string') {
				this._data[data] = val;
			} else {
				util.extend(this._data, data);
			}

			return this;
		},

		child: function(query) {
			var result = this._childHash[query];
			return result[0] || result;
		},

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
			if (debug) console.log('Setting up view...');

			// Call 'setup' on all subviews first (bottom up recursion).
			for (var i = 0, l = this._children.length; i < l; i++) {
				this._children[i].setup();
			}

			// We don't want to run setup on a module more than once, right?
			if (this.isSetup) return this;

			// We trigger a 'setup' event that you can bind to
			// inside you custom Views to perform any setup logic.
			this.trigger('setup');

			// Flag as setup
			this.isSetup = true;
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

		destroy: function(options) {
			var detach = options && options.detach;

			// Recursively run on children first (bottom up). We don't run
			// view#_detach() on children as their references are cleared anyway.
			for (var i = 0, l = this._children.length; i < l; i++) {
				this._children[i].destroy({ skipEl: true });
			}

			// Detach this view from its parent and unless otherwise
			// stated, from the DOM.
			this._detach(options);

			// Trigger a destroy event for custom Views to bind to.
			this.trigger('destroy');

			// Clear references.
			this.el = this.module = this._id = this._globals = this._childHash = this._data = null;
		},

		/**
		 * Private Methods
		 */

		_toHTML: function(options) {
			var template = this.template || templates[this.module];
			var renderData = {};

			// Don't template models that are flagged with render: false;
			if (this.render === false) return;

			// Check we have a template and that it has a 'render' method.
			if (!template || !template.render) return; //util.error(this.module + ' has no template or the template has no render method');

			// Create an array to store child html in.
			renderData[SETTINGS.mustacheSlotArrayName] = [];

			if (this._children) {
				for (var i = 0, l = this._children.length; i < l; i++) {
					var child = this._children[i];
					var html = child._toHTML(options);

					// If no html was generated we don't want to add a slot
					// to the parent's render data, so return here.
					if (!html) return;

					// Make the sub view html available to the parent model. So that when the
					// parent model is rendered it can print the sub view html into the correct slot.
					renderData[SETTINGS.mustacheSlotArrayName].push(util.extend({ module: html }, child._data));
					renderData[SETTINGS.mustacheSlotVarPrefix + child._id] = html;
				}
			}

			// Prepare the render data.
			renderData['fm_classes'] = 'js-module';
			renderData['fm_attrs'] = this._makeAttrs(options);

			// Call render template.
			return template.render(util.extend(renderData, this._data));
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
			if (debug) console.log('Searching for module elements...');
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

	View['extend'] = function(module, options) {
		FruitMachine.Views[module] = DefaultView.extend(options);
	};

	// We add the 'extend' static method to the FruitMachine base
	// class. This allows you to extend the default View class
	// to add custom insteractions and logic to more complex modules.
	// Redefining any of the View.prototype methods will overwrite them.
	DefaultView.extend = util.inherits;

	return FruitMachine;
}(this));