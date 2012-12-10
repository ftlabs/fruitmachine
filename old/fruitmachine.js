/*globals Mustache*/

var templates = {
	'fruit/layout-i': '<div class="layout-i"><div class="js-slot" data-slot="1">{{{slot_1}}}</div><div class="js-slot" data-slot="2">{{{slot_2}}}</div><div class="js-slot" data-slot="3">{{{slot_3}}}</div></div>',
	'fruit/module-apple': '<div class="module-apple"><h1>{{title}}</h1><div>{{body}}</div></div>',
	'fruit/module-orange': '<div class="module-orange"><h1>This is module orange title</h1><div>This is module orange body</div></div>',
	'fruit/module-tangerine': '<div class="module-tangerine">{{#slots}}<h4>{{title}}</h4><div class="js-slot" data-slot="{{slot}}">{{{html}}}</div>{{/slots}}</div>',
	'fruit/module-sharon': '<div class="module-sharon"><div>{{body}}</div></div>'
};


var FruitMachine = (function() {
	'use strict';

	function extend(original, source) {
		for (var prop in source) { original[prop] = source[prop]; }
		return original;
	}

	function pick(original, props) {
		var filtered = {};

		for (var prop in original) {
			if (original.hasOwnProperty(prop) && props.indexOf(prop) > -1) {
				filtered[prop] = original[prop];
			}
		}

		return filtered;
	}

	function toNode(string) {
		var el = document.createElement('div');
		el.innerHTML = string;
		return el.firstChild;
	}

	var render = (function() {

		var reservedKeys = ['template', 'slot', 'data'];

		function render(template, data) {
			var html;

			template = templates[template];

			// Make all the data available on a single level.
			extend(data, data.data || {});

			// Create a slots array if one hasn't been created already.
			data.slots = [];

			// Render each of the sub views first as this view will
			// depend on rendered html from its sub views.
			(data.subviews || []).forEach(renderSubview(data));

			// Then render this view.
			return Mustache.render(template, data);
		}

		function renderSubview(parentData) {
			return function(subviewData) {

				// Render the sub view.
				var html = render(subviewData.template, subviewData);

				// Push this sub view's data and rendered html into the parent view's
				// slots array so that it can choose to loop over sub views to render
				// them if it wishes.
				parentData.slots.push(extend(subviewData, { html: html }));

				// Store the rendered html on the parent data so that it
				// can insert a sub view's html by the slot number.
				parentData['slot_' + subviewData.slot] = html;
			};
		}

		return render;
	})();

	var View = (function() {

		var viewOptions = ['root', 'slots', 'slot', 'template'];

		var FruitMachineView = function(props) {
			props.slots = props.slots || getSlots(props.root);

			extend(props, props.structure || {});

			// Extend the instance properties with the stated viewOptions
			extend(this, pick(props, viewOptions));

			this.el = this.root.firstElementChild;

			this._data = extend({}, props.structure);

			this.subviews = [];
			this.structure = props.structure;

			this._subviewRef = {};

			// Upgrade every subview
			(this.structure.subviews || []).forEach(this.createSubview, this);
		};

		extend(FruitMachineView.prototype, {

			render: function() {
				this.el = toNode(render(this.template, this.get()));


				this.inject(this.root);
				return this;
			},

			inject: function(target) {
				target.innerHTML = '';
				target.appendChild(this.el);
				return this;
			},

			/**
			 * Returns the key from the instance or from the data store.
			 * If no key is passed, we jsut return the entire data store.
			 *
			 * @param  {String} key
			 * @return {*}
			 */
			get: function(key) {
				return key ? (this[key] || this._data[key]) : this._data;
			},

			set: function(data) {

				// Extend the primary instance properties with any
				// explicitly defined view options. So for example
				// if the user passes in data.subviews, the main sub
				// views property will get updated as well as the _data
				// instance.
				extend(this, pick(data, viewOptions));

				// Extend the datastore with the new object passed in.
				extend(this._data, data);

				// Return this for chaining.
				return this;
			},

			reset: function(structure) {

				var options = {
					structure: structure,
					root: this.root
				};

				var html = render(this.template, structure);
debugger;
				this.constructor.call(this, options);

				return this;
			},

			getSubview: function(query) {
				return this._subviewRef['slot-' + query] ||
					this._subviewRef['module-' + query];
			},

			createSubview: function(subview, i) {
				var root = this.slots[subview.slot];

				// If no root node was found in the DOM
				// then this item must not exist in the markup.
				// In that case, just return and move on.
				if (!root) {
					return;
				}


				this.subviews[i] =
					this._subviewRef['slot-' + subview.slot] =
					this._subviewRef['module-' + subview.module] =
					new FruitMachine.View({ root: root, slots: this.slots, structure: subview });
			}
		});

		function getSlots(node) {
			var nodes = node.getElementsByClassName('js-slot');
			var slots = {};

			Array.prototype.forEach.call(nodes, function(node) {
				slots[node.getAttribute('data-slot')] = node;
			});

			return slots;
		}

		return FruitMachineView;
	})();

	return {
		render: render,
		View: View
	};
})();