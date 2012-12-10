/*globals console*/
(function() {
	'use strict';

	// Attach all public methods to the window obect else try commonjs node exports.
	var FruitMachine = typeof exports !== 'undefined' ? exports : {};
	if (window) window['FruitMachine'] = FruitMachine;

	// Current Version
	FruitMachine.VERSION = '0.0.1';

	/**
	 * Settings
	 */

	var settings = FruitMachine.SETTINGS = {
		breakpointDebounce: 50,
		slotClass: 'js-slot',
		slotIdAttribute: 'data-slot',
		mustacheSlotVarPrefix: 'slot_',
		mustacheSlotArrayName: 'slots'
	};

	/**
	 * Messages
	 */

	var msgs = {
		modelIdError: "Models require an _id attribute"
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

	var util = {

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
			console.error(msg);
		},


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


		toNode: function(string) {
			if (typeof string !== 'string') return string;
			var el = document.createElement('div');
			el.innerHTML = string;
			return el.firstChild;
		}
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
	 * BREAKPOINTS
	 */

	/**
	 *  Example
	 *
	 *    var options = {
	 *        smallscreen: 400,
	 *        mediumscreen: 800,
	 *        largescreen: 1024,
	 *        gutterview: 9999
	 *    }
	 *
	 *    var myBreakpoints = new FruitMachine.Breakpoints(options);
	 *
	 *    myBreakpoints.on('breakpointchange', function(breakpoint) {
	 *        // Do stuff
	 *    });
	 *
	 */
	var Breakpoints = FruitMachine.Breakpoints = function(breakpoints) {
		this.breakpoints = breakpoints;
		this.current = this.getBreakpoint(window.innerWidth);
		this.onWindowResize = util.debounce(settings.breakpointDebounce, this.onWindowResize.bind(this));
		window.addEventListener('resize', this.onWindowResize);
	};


	// Merge the events manager into the breakpoint prototype
	// along with our protoype methods.
	util.extend(Breakpoints.prototype, Events, {

		getBreakpoint: function(width) {
			for (var name in this.breakpoints) {
				if (width < this.breakpoints[name]) {
					return name;
				}
			}
		},

		onWindowResize: function(event) {
			var breakpoint = this.getBreakpoint(window.innerWidth);

			if (breakpoint !== this.current) {
				this.previous = this.current;
				this.current = breakpoint;
				this.trigger('breakpointchange', this.current, this.previous);
			}
		}
	});


	/**
	 * MODEL
	 */


	var modelOptions = ['module', '_id', 'render', 'template', 'parent'];


	var Model = FruitMachine.Model = function(data) {
		util.extend(this, util.pick(data, modelOptions));

		// Models must have an id attribute.
		if (!this._id) return util.error(msgs.modelIdError);

		this.models = [];
		this._locals = data.data || {};
		this._globals = data._globals || { models: {} };

		// Save a re
		if (this._id) {
			this._globals.models[this._id] = this;
		}

		(data.children || []).forEach(this.addModel, this);

		delete this.children;
	};


	util.extend(Model.prototype, Events, {

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
		},

		child: function(query) {
			var result = this.children(query);
			return result[0] || result;
		},

		children: function(query) {
			return query ? (this._children[query] || []) : this._children;
		},

		id: function(id) {
			return this._globals.models[id];
		},

		addModel: function(data) {
			var model;

			data.parent = this;
			data.parent._children = data.parent._children || {};

			data._globals = this._globals;
			model = new Model(data);

			// Save some references
			this.models.push(model);
			data.parent._children[model._id] = model;

			// Store module name reeference in an array as it is possible
			// to have more than one child with the same module type.
			data.parent._children[model.module] = data.parent._children[model.module] || [];
			data.parent._children[model.module].push(model);

			return this;
		},

		removeModel: function(id) {
			//TODO: Remove the child model with the id passed from the 'models' array.
		},

		toHTML: function() {
			var parent = this,
				html;

			// Don't template models that are flagged with render: false;
			if (this.render === false) {
				return;
			}

			// Create an array to store child html in.
			parent.set(settings.mustacheSlotArrayName, []);

			(this.models || []).forEach(function(model) {
				html = model.toHTML();

				// If no html was generated we don't want to add a slot
				// to the parent's render data, so return here.
				if (!html) {
					return;
				}

				// Make the sub view html available to the parent model. So that when the
				// parent model is rendered it can print the sub view html into the correct slot.
				parent.get(settings.mustacheSlotArrayName).push(util.extend({ id: model._id, html: html }, model.get()));
				parent.set(settings.mustacheSlotVarPrefix + model._id, html);
			});

			// Mustache render template
			return this.template.render(this.get());
		}
	});


	/**
	 * VIEW
	 */


	var viewOptions = ['root', 'el', 'model'];


	var View = FruitMachine.View = function(options) {
		util.extend(this, util.pick(options, viewOptions));

		// Use the id from the model
		this._id = this.model._id;

		// It's important that all views and sub views point to
		// the same globals object.
		this._globals = options._globals || this._globals || { views: {} };

		this.views = [];
		this._children = {};

		// Store a reference to this view instance in the view global data store.
		this._globals.views[this._id] = this;

		// Run the initialize method on this instance
		this.initialize.apply(this, arguments);

		// If an element has been passed in we ar able to
		// first search it for root nodes and second create
		if (this.el) {
			this.el = util.toNode(this.el);

			// Search the this view element for slots and store them in
			// the view global slot storage object.
			this._globals.rootNodes = this.getRootNodes(this.el);

			// Create views frrom each of this models sub-models.
			(this.model.models || []).forEach(this._addView, this);
		}
	};


	util.extend(View.prototype, Events, {


		initialize: function() {},


		setup: function() {

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
			if (model.render === false) {
				return;
			}

			this.addView(model);
		},


		addView: function(model) {
			var Constructor, view, root = this._globals.rootNodes[model._id];

			// Don't create a view instance if we have not
			// found a slot for it.
			if (!root) {
				return;
			}

			// Use a custom extended class if it exists for this module type
			// else use the default base view class.
			Constructor = FruitMachine.Views[model.module] || View;

			// Create a new view instance.
			view = new Constructor({
				model: model,
				root: root,
				_globals: this._globals
			});

			// Create a new view instance and store a reference to it in the
			// parents 'views' array.
			this.views.push(view);
			this._children[view._id] = view;

			this._children[view.model.module] = this._children[view.model.module] || [];
			this._children[view.model.module].push(view);

			return view;
		},


		render: function(options) {
			var html;

			this.model.render = true;

			html = this.model.toHTML();

			// Completely reconstruct this view and all sub-views, passing in the
			// newly rendered html to use as this views element.
			this.reset({ el: html });

			// Then inject the new view element into the root node.
			this.inject(this.root);

			// We trigger the render event for you to bind to if you so wish.
			this.trigger('render');

			// Return this for chaining.
			return this;
		},


		id: function(id) {
			return this._globals.views[id];
		},


		index: function(i) {
			return this.views[i];
		},


		child: function(query) {
			var result = this.children(query);
			return result[0] || result;
		},


		children: function(query) {
			return query ? (this._children[query] || []) : this.views;
		},


		set: function() {
			this.model.set.apply(this.model, arguments);
			return this;
		},


		inject: function(el) {

			if (!el) {
				return this;
			}

			el.innerHTML = '';
			el.appendChild(this.el);
			this.root = el;

			return this;
		},


		reset: function(options) {
			this.constructor.call(this, util.extend(this, options));
		},


		getRootNodes: function(el) {
			var rootNodes = {}, els;

			if (!el || !el.getElementsByClassName) {
				return {};
			}

			els = el.getElementsByClassName(settings.slotClass);

			forEach.call(els, function(el) {
				rootNodes[el.getAttribute(settings.slotIdAttribute)] = el;
			});

			return rootNodes;
		}
	});


	// We add the 'extend' static method to the FruitMachine base
	// class. This allows you to extend the default View class
	// to add custom insteractions and logic to more complex modules.
	// Redefining any of the View.prototype methods will overwrite them.
	View.extend = util.inherits;
})();