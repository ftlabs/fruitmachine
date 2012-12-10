/*globals console*/

(function() {
	'use strict';

	// Attach all public methods to the window obect else try commonjs node exports.
	var FruitMachine = typeof exports !== 'undefined' ? exports : {};
	if (window) window['FruitMachine'] = FruitMachine;

	// Current Version
	FruitMachine.VERSION = '0.0.1';


	/**
	 * Turn on for debug messages.
	 *
	 * @constant
	 * @type {Boolean}
	 */
	var debug = 1;


	/**
	 * SETTINGS
	 */

	var SETTINGS = {
		breakpointDebounce: 50,
		slotClass: 'js-module',
		moduleIdAttr: 'data-module-id',
		moduleTypeAttr: 'data-module-type',
		moduleDataAttr: 'data-model-data',
		moduleParentAttr: 'data-parent',
		mustacheSlotVarPrefix: 'module_',
		mustacheSlotArrayName: 'modules'
	};

	var templates = {};

	// User must define their templates before creating any Models or Views.
	var setTemplates = FruitMachine.templates = function(params) {
		util.extend(templates, params);
	};

	FruitMachine.set= function(key, val) {
		if (typeof key === 'object') {
			util.extend(SETTINGS, key);
		} else {
			SETTINGS[key] = val;
		}

		// Return for chaining.
		return FruitMachine;
	};

	FruitMachine.get = function(key) {
		return key ? SETTINGS[key] : SETTINGS;
	};

	/**
	 * Messages
	 */

	var msgs = {
		noTemplate: 'This module has no template'
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

		debounce: function(ms, func) {
			var timer;
			return function() {
				clearTimeout(timer);
				timer = setTimeout(func, ms);
			};
		},


		error: function(msg, type) {
			if (!console) return;
			console.error('FruitMachine: ' + msg);
		},

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


		pick: function(original, props) {
			var filtered = {};

			for (var prop in original) {
				if (original.hasOwnProperty(prop) && props.indexOf(prop) > -1) {
					filtered[prop] = original[prop];
				}
			}

			return filtered;
		},


		replaceNode: function(current, replacement) {

			// NOTE: We may be able to use Element.replaceChild(), but need to check support.
			current.parentNode.insertBefore(replacement, current);
			current.parentNode.removeChild(current);

			return replacement;
		},


		toNode: function(string) {
			if (typeof string !== 'string') return string;
			var el = document.createElement('div');
			el.innerHTML = string;
			return el.firstChild;
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
	 * SHARED
	 */

	var Shared  = {

		child: function(query) {
			var result = this._children[query];
			return result[0] || result;
		},

		children: function(query) {
			return query ? (this._children[query] || []) : this._children;
		},

		id: function(id) {
			return this._globals.id[id];
		}
	};


	/**
	 * MODEL
	 */

	var modelOptions = ['module', '_id', 'render', 'parent'];


	var Model = FruitMachine.Model = function(data) {
		util.extend(this, util.pick(data, modelOptions));

		this.models = [];
		this._locals = data.data || {};
		this._globals = data.parent && data.parent._globals || { id: {} };

		// If this model was instantiated without an _id attribute
		// we make the assumption that it is 'dynamic'. We mark it as
		// such and give it a unique id prefixed with 'dynamic'.
		if (!this._id) {
			this.dynamic = true;
			this._id = util.uniqueId('dynamic');
		}

		// Save a reference to this model in the globals.
		this._globals.id[this._id] = this;

		// Don't loop over children if there aren't any.
		if (!data.children) return;

		// Loop over any children and create child models.
		data.children.forEach(this.addModel, this);

		delete this.children;
	};


	util.extend(Model.prototype, Events, Shared, {

		addModel: function(data) {
			var model;

			data.parent = this;
			data.parent._children = data.parent._children || {};

			// Create the model instance.
			model = new Model(data);

			// Save some references
			this.models.push(model);
			data.parent._children[model._id] = model;

			// Store module name reeference in an array as it is possible
			// to have more than one child with the same module type.
			data.parent._children[model.module] = data.parent._children[model.module] || [];
			data.parent._children[model.module].push(model);

			return model;
		},

		removeModel: function(_id) {
			//TODO: Remove the child model with the _id passed from the 'models' array.
		},

		getAttrs: function(options) {
			var attrs = {},
				embedData = options && options.embedData,
				parentAttr = options && options.parentAttr;

			// Setup module attributes
			attrs[SETTINGS.moduleIdAttr] = this._id;
			attrs[SETTINGS.moduleTypeAttr] = this.module;

			if (embedData) {
				attrs[SETTINGS.moduleDataAttr] = util.escape(JSON.stringify(this._locals));
			}

			// We only want to add the 'data-parent' attribute if the module is
			// dynamic and we have not stated otherwise. We use this attribute
			// to identify orphan modules.
			//
			// If the dynamic module has been rendered on the client then
			// we will already have a reference to its parent. Adding this
			// attribute on the client could cause duplicate View/Models
			// to be created.
			if (this.dynamic && options.parentAttr) {
				attrs[SETTINGS.moduleParentAttr] = this.parent._id;
			}

			return util.attributes(attrs);
		},

		_toHTML: function(options) {
			var template = this.template || templates[this.module],
				renderData = {};

			// Don't template models that are flagged with render: false;
			if (this.render === false) return;

			// Check we have a template and that it has a 'render' method.
			if (!template || !template.render) return; //util.error(this.module + ' has no template or the template has no render method');

			// Create an array to store child html in.
			renderData[SETTINGS.mustacheSlotArrayName] = [];

			(this.models || []).forEach(function(model) {
				var html = model._toHTML(options);

				// If no html was generated we don't want to add a slot
				// to the parent's render data, so return here.
				if (!html) return;

				// Make the sub view html available to the parent model. So that when the
				// parent model is rendered it can print the sub view html into the correct slot.
				renderData[SETTINGS.mustacheSlotArrayName].push(util.extend({ module: html }, model._locals));
				renderData[SETTINGS.mustacheSlotVarPrefix + model._id] = html;
			});

			// Prepare the render data.
			renderData['fm_classes'] = 'js-module';
			renderData['fm_attrs'] = this.getAttrs(options);

			// Call render template.
			return template.render(util.extend(renderData, this._locals));
		},

		toHTML: function(options) {
			options = util.extend({ parentAttr: true }, options);
			return this._toHTML(options);
		},

		get: function(key) {
			return key ? (this[key] || this._locals[key]) : this._locals;
		},

		set: function(data, val) {
			if (typeof data === 'string') {
				this._locals[data] = val;
			} else {
				util.extend(this._locals, data);
			}

			return this;
		}
	});


	/**
	 * VIEW
	 */


	var viewOptions = ['el', 'model'];


	var View = FruitMachine.View = function(options) {
		if (debug) console.log('Creating new view instance');
		util.extend(this, util.pick(options, viewOptions));

		// Setup some static properties.
		this._id = this.model._id;
		this.views = [];
		this._children = {};

		// It's important that all views and sub views point to
		// the same globals object.
		this._globals = options._globals || { id: {} };

		// Store a reference to this view instance in the view global data store.
		this._globals.id[this._id] = this;

		// Check for and extract any data embedded on the view element.
		this.manageEmbeddedData();

		// Run the initialize method on this instance
		this.initialize.apply(this, arguments);

		// When views are instantiated on the client an element is not
		// passed in. In this case we do not want to proceed with any of
		// the child module discovery or instantiation.
		if (!this.el) return;

		// If the we have not checked for module nodes yet, do it.
		if (!this._globals.moduleNodesChecked) {
			this.getModuleNodes(this.el);
			this._globals.moduleNodesChecked = true;
		}

		// See if any server generated dynamic children have been
		// assigned to this view, if they have, then we must add a
		// model for it to this parent.
		this.allocateOrphanModules();

		// Create views from each of this models sub-models.
		this.model.models.forEach(this._addView, this);
	};


	util.extend(View.prototype, Events, Shared, {

		// Fired when a View is instantiated, overwrite this yourself.
		initialize: function() {},


		setup: function() {
			if (debug) console.log('Setting up view...');

			// Call 'setup' on all subviews first. This leads to
			// bottom up recursion.
			this.views.forEach(function(view) {
				view.setup();
			});

			// We trigger a 'setup' event that you can bind to
			// inside you custom Views to perform any setup logic.
			this.trigger('setup');
		},


		teardown: function() {
			if (debug) console.log('Tearing down view...');

			// Call 'teardown' on all subviews first. This leads to
			// bottom up recursion. This means we can dismantle the
			// small parts before we take out the foundations. Like
			// taking down a stage :)
			this.views.forEach(function(view) {
				view.teardown();
			});

			// We trigger the 'teardown' event that you can bind to
			// inside your custom views to perform any clean up logic.
			this.trigger('teardown');

			// TODO: Unset all vars for garbage colection.
		},


		_addView: function(model) {
			if (model.render === false) return;
			this.addView(model);
		},


		addView: function(model) {
			if (debug) console.log('Adding view...');
			var Constructor,
				view,
				el;

			// Get the slot node from the slot node object that
			// matches the id for this model.
			el = this._globals.moduleNodes[model._id];

			// Don't create a view instance if we have not
			// found a module in the view.
			if (!el) return;

			// Use a custom extended class if it exists for this module type
			// else use the default base view class.
			Constructor = FruitMachine.Views[model.module] || View;

			// Create a new view instance.
			view = new Constructor({
				model: model,
				el: el,
				_globals: this._globals
			});

			// Create a new view instance and store a reference to it in the
			// parents 'views' array.
			this.views.push(view);
			this._children[view._id] = view;

			// Create a reference for views by module type. There could be
			// more than one view instance with the same module type so
			// we use an array for storage.
			this._children[view.model.module] = this._children[view.model.module] || [];
			this._children[view.model.module].push(view);

			return view;
		},


		allocateOrphanModules: function() {
			var els = this._globals.orphanModules[this._id];
			if (!els) return;

			els.forEach(this.integrateOrphanModule, this);

			// Delete the reference to these orphans once they have been
			// upgrades to models and allocated parents.
			delete this._globals.orphanModules[this._id];
		},


		integrateOrphanModule: function(el) {
			if (debug) console.log('Integrating orphan module...');
			var module = el.getAttribute(SETTINGS.moduleTypeAttr),
				id = el.getAttribute(SETTINGS.moduleIdAttr);

			// Create a new model using the data extracted from the
			// element's attributes. Now the model has been added to the
			// parent, it will get rendered with all the others.
			var model = this.model.addModel({
				_id: id,
				module: module
			});
		},


		manageEmbeddedData: function() {
			// Check for any data that may be stored on the data attribute.
			var data = this.el.getAttribute(SETTINGS.moduleDataAttr);

			// If data is found, parse it, add it to the model, then remove
			// the attribute from the element.
			if (data) {
				data = JSON.parse(util.unescape(data));
				this.model.set(data);
				this.el.removeAttribute(SETTINGS.moduleDataAttr);
			}
		},


		// REFACTOR: We could possibly do the render without the overhead
		// of reseting the view. All we need to do is perform the discovery
		// of child views, and instantiating them if any are found.
		render: function(options) {
			if (debug) console.log('Rendering view instance...');

			var html = this.model._toHTML();
			var el = util.toNode(html);

			if (this.el) util.replaceNode(this.el, el);

			// We set this to false so that when we reset the view, it will
			// search for child module and then initialize them too.
			this._globals.moduleNodesChecked = false;

			// Reset this view instance with the newly rendered element.
			this.reset({ el: el });

			// We trigger the render event for you to bind to if you so wish.
			this.trigger('render');

			// Return this for chaining.
			return this;
		},


		inject: function(el) {
			if (!el) return this;
			el.innerHTML = '';
			el.appendChild(this.el);
			return this;
		},


		reset: function(options) {
			this.constructor.call(this, options);
			return this;
		},


		getModuleNodes: function(el) {
			if (debug) console.log('Searching for module elements...');

			var moduleNodes = {},
				els,
				moduleId,
				parentId;

			if (!el || !el.getElementsByClassName) return this;

			// Create some storage containers
			this._globals.moduleNodes = this._globals.moduleNodes || {};
			this._globals.orphanModules = this._globals.orphanModules || {};

			// Fetch the module nodes from the element.
			els = el.getElementsByClassName(SETTINGS.slotClass);

			// Loop over each module node found.
			forEach.call(els, function(el) {

				// Attempt to get an id from the DOM node 'data-slot' attribute,
				// if that is undefined then assign generate a unique id for it.
				moduleId = el.getAttribute(SETTINGS.moduleIdAttr) || util.uniqueId('unknown');
				parentId = el.getAttribute(SETTINGS.moduleParentAttr);

				// Save a reference to every 'js-module' node found under its id.
				this._globals.moduleNodes[moduleId] = el;

				// If the module has referenced its parent then store it
				// in an array under the parent's id. Later when we are building
				// the view we can look to see if a module has any children
				// in this orphan storage.
				if (parentId) {
					this._globals.orphanModules[parentId] = this._globals.orphanModules[parentId] || [];
					this._globals.orphanModules[parentId].push(el);
				}
			}, this);

			return this;
		}
	});


	// We add the 'extend' static method to the FruitMachine base
	// class. This allows you to extend the default View class
	// to add custom insteractions and logic to more complex modules.
	// Redefining any of the View.prototype methods will overwrite them.
	View.extend = Model.extend = util.inherits;
})();