/**
 * Create a circularly-linked list
 *
 * Adapted from original version by James Coglan.
 *
 * @fileOverview
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 */

this.CircularList = (function () {
	'use strict';


	/**
	 * @constructor
	 */
	function CircularList() {


		/**
		 * The length of the linked list
		 *
		 * @type number
		 */
		this.length = 0;


		/**
		 * The first item in the linked list
		 *
		 * @type Object
		 */
		this.first = null;


		/**
		 * The last item in the linked list
		 *
		 * @type Object
		 */
		this.last = null;
	}


	/**
	 * Explicit item object to allow items to belong to more than linked list at a time
	 *
	 * To hold a reference to a CircularList.Item within a completely different CircularList the CircularList.Item should be passed as the data to a new CircularList.Item to be used in the new CircularList.
	 * If you don't wrap the reference in a new Item, then if you append an already existing reference to a different CircularList the behaviour is undefined.
	 *
	 * @example
	 * myList.append(new CircularList.Item(someObject));
	 *
	 * @constructor
	 * @param {Object} data
	 */
	CircularList.Item = function (data) {
		this.prev = null;
		this.next = null;
		this.list = null;
		this.data = data;
	};


	/**
	 * Append an object to the linked list
	 *
	 * @param {Object} item The item to append
	 */
	CircularList.prototype.append = function (item) {
		if (this.first === null) {
			item.prev = item;
			item.next = item;
			this.first = item;
			this.last = item;
		} else {
			item.prev = this.last;
			item.next = this.first;
			this.first.prev = item;
			this.last.next = item;
			this.last = item;
		}

		item.list = this;
		this.length++;
	};


	/**
	 * Remove an item from the linked list
	 *
	 * @param {Object} item The item to remove
	 */
	CircularList.prototype.remove = function (item) {

		// Exit early if the item isn't in the list
		if (!this.length || this !== item.list) {
			return;
		}

		if (this.length > 1) {
			item.prev.next = item.next;
			item.next.prev = item.prev;

			if (item === this.first) {
				this.first = item.next;
			}

			if (item === this.last) {
				this.last = item.prev;
			}
		} else {
			this.first = null;
			this.last = null;
		}

		item.prev = null;
		item.next = null;
		this.length--;
	};


	/**
	 * Convert the linked list to an Array
	 *
	 * The first item in the list is the first item in the array.
	 *
	 * @return {Array}
	 */
	CircularList.prototype.toArray = function () {
		var i, item, array, length = this.length;

		array = new Array(length);
		item = this.first;

		for (i = 0; i < length; i++) {
			array[i] = item;
			item = item.next;
		}

		return array;
	};


	/**
	 * Insert an item after one already in the linked list
	 *
	 * @param {Object} item The reference item
	 * @param {Object} newItem The item to insert
	 */
	CircularList.prototype.insertAfter = function (item, newItem) {
		newItem.prev = item;
		newItem.next = item.next;
		item.next.prev = newItem;
		item.next = newItem;

		if (newItem.prev === this.last) {
			this.last = newItem;
		}

		newItem.list = this;
		this.length++;
	};

	return CircularList;

}());

/**
 * Create a DOM event delegator
 *
 * @fileOverview
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 */

this.Delegate = (function(that) {
	"use strict";

	var


		/**
		 * Event listener separator
		 *
		 * @private
		 * @type string
		 */
		SEPARATOR = ' ',


		/**
		 * Event object property used to signal that event should be ignored by handler
		 *
		 * @private
		 * @type string
		 */
		EVENT_IGNORE = 'ftLabsDelegateIgnore',


		/**
		 * Circular list constructor
		 *
		 * @private
		 * @type function()
		 */
		CircularList = that.CircularList,


		/**
		 * Whether tag names are case sensitive (as in XML or XHTML documents)
		 *
		 * @type boolean
		 */
		tagsCaseSensitive = document.createElement('i').tagName === 'i',


		/**
		 * Check whether an element matches a generic selector
		 *
		 * @private
		 * @type function()
		 * @param {string} selector A CSS selector
		 */
		matches = (function(p) {
			return (p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector);
		}(HTMLElement.prototype)),


		/**
		 * Check whether an element matches a tag selector
		 *
		 * Tags are NOT case-sensitive, except in XML (and XML-based languages such as XHTML).
		 *
		 * @private
		 * @param {string} tagName The tag name to test against
		 * @param {Element} element The element to test with
		 */
		matchesTag = function(tagName, element) {
			return tagName === element.tagName;
		},


		/**
		 * Check whether the ID of the element in 'this' matches the given ID
		 *
		 * IDs are case-sensitive.
		 *
		 * @private
		 * @param {string} id The ID to test against
		 * @param {Element} element The element to test with
		 */
		matchesId = function(id, element) {
			return id === element.id;
		};


	/**
	 * Fire a listener on a target
	 *
	 * @private
	 * @param {Event} event
	 * @param {Node} target
	 * @param {Object} listener
	 */
	function fire(event, target, listener) {
		var returned, oldData;

		if (listener.d !== null) {
			oldData = event.data;
			event.data = listener.d;
			returned = listener.h.call(target, event, target);
			event.data = oldData;
		} else {
			returned = listener.h.call(target, event, target);
		}

		return returned;
	}


	/**
	 * Internal function proxied by Delegate#on
	 *
	 * @private
	 * @param {Object} lisenerList
	 * @param {Node|DOMWindow} root
	 * @param {Event} event
	 */
	function handle(listenerList, root, event) {
		var listener, returned, specificList, target;

		if (event[EVENT_IGNORE] === true) {
			return;
		}

		target = event.target;
		if (target.nodeType === Node.TEXT_NODE) {
			target = target.parentNode;
		}
		specificList = listenerList[event.type];

		// If the fire function actually causes the specific list to be destroyed,
		// Need check that the specific list is still populated
		while (target && specificList.length > 0) {
			listener = specificList.first;
			do {

				// Check for match and fire the event if there's one
				// TODO:MCG:20120117: Need a way to check if event#stopImmediateProgagation was called. If so, break both loops.
				if (listener.m.call(target, listener.p, target)) {
					returned = fire(event, target, listener);
				}

				// Stop propagation to subsequent callbacks if the callback returned false
				if (returned === false) {
					event[EVENT_IGNORE] = true;
					return;
				}

				listener = listener.next;

			// If the fire function actually causes the specific list object to be destroyed,
			// need a way of getting out of here so check listener is set
			} while (listener !== specificList.first && listener);

			// TODO:MCG:20120117: Need a way to check if event#stopProgagation was called. If so, break looping through the DOM.
			// Stop if the delegation root has been reached
			if (target === root) {
				break;
			}

			target = target.parentElement;
		}
	}


	/**
	 * Internal function proxied by Delegate#on
	 *
	 * @private
	 * @param {Delegate} that
	 * @param {Object} listenerList
	 * @param {Node|DOMWindow} root
	 */
	function on(that, listenerList, root, eventType, selector, eventData, handler) {
		var matcher, matcherParam;

		if (!eventType) {
			throw new TypeError('Invalid event type: ' + eventType);
		}

		if (!selector) {
			throw new TypeError('Invalid selector: ' + selector);
		}

		// Support a separated list of event types
		if (eventType.indexOf(SEPARATOR) !== -1) {
			eventType.split(SEPARATOR).forEach(function(eventType) {
				on.call(that, that, listenerList, root, eventType, selector, eventData, handler);
			});

			return;
		}

		if (handler === undefined) {
			handler = eventData;
			eventData = null;

		// Normalise undefined eventData to null
		} else if (eventData === undefined) {
			eventData = null;
		}

		if (typeof handler !== 'function') {
			throw new TypeError("Handler must be a type of Function");
		}

		// Add master handler for type if not created yet
		if (!listenerList[eventType]) {
			root.addEventListener(eventType, that.handle, (eventType === 'error'));
			listenerList[eventType] = new CircularList();
		}

		// Compile a matcher for the given selector
		if (/^[a-z]+$/i.test(selector)) {
			if (!tagsCaseSensitive) {
				matcherParam = selector.toUpperCase();
			} else {
				matcherParam = selector;
			}

			matcher = matchesTag;
		} else if (/^#[a-z0-9\-_]+$/i.test(selector)) {
			matcherParam = selector.slice(1);
			matcher = matchesId;
		} else {
			matcherParam = selector;
			matcher = matches;
		}

		// Add to the list of listeners
		listenerList[eventType].append({
			s: selector,
			d: eventData,
			h: handler,
			m: matcher,
			p: matcherParam
		});
	}


	/**
	 * Internal function proxied by Delegate#off
	 *
	 * @private
	 * @param {Delegate} that
	 * @param {Object} listenerList
	 * @param {Node|DOMWindow} root
	 */
	function off(that, listenerList, root, eventType, selector, handler) {
		var listener, nextListener, firstListener, specificList, singleEventType;

		if (!eventType) {
			for (singleEventType in listenerList) {
				if (listenerList.hasOwnProperty(singleEventType)) {
					off.call(that, that, listenerList, root, singleEventType, selector, handler);
				}
			}
			return;
		}
		specificList = listenerList[eventType];

		if (!specificList) {
			return;
		}

		// Support a separated list of event types
		if (eventType.indexOf(SEPARATOR) !== -1) {
			eventType.split(SEPARATOR).forEach(function(eventType) {
				off.call(that, that, listenerList, root, eventType, selector, handler);
			});
			return;
		}

		// Remove only parameter matches if specified
		listener = firstListener = specificList.first;
		do {
			if ((!selector || selector === listener.s) && (!handler || handler === listener.h)) {

				// listener.next will be undefined after listener is removed, so save a reference here
				nextListener = listener.next;
				specificList.remove(listener);
				listener = nextListener;
			} else {
				listener = listener.next;
			}
		} while (listener && listener !== firstListener);

		// All listeners removed
		if (!specificList.length) {
			delete listenerList[eventType];

			// Remove the main handler
			root.removeEventListener(eventType, that.handle, false);
		}
	}


	/**
	 * DOM event delegator
	 *
	 * The delegator will listen for events that bubble up to the root node.
	 *
	 * @constructor
	 * @param {Node|DOMWindow|string} root The root node, a window object or a selector string
	 */
	function Delegate(root) {
		var


			/**
			 * Keep a reference to the current instance
			 *
			 * @internal
			 * @type Delegate
			 */
			that = this,


			/**
			 * Maintain a list of listeners, indexed by event name
			 *
			 * @internal
			 * @type Object
			 */
			listenerList = {};

		if (typeof root === 'string') {
			root = document.querySelector(root);
		}

		if (!root || !root.addEventListener) {
			throw new TypeError('Root node not specified');
		}


		/**
		 * Attach a handler to one event for all elements that match the selector, now or in the future
		 *
		 * The handler function receives three arguments: the DOM event object, the node that matched the selector while the event was bubbling
		 * and a reference to itself. Within the handler, 'this' is equal to the second argument.
		 * The node that actually received the event can be accessed via 'event.target'.
		 *
		 * @param {string} eventType Listen for these events (in a space-separated list)
		 * @param {string} selector Only handle events on elements matching this selector
		 * @param {Object} [eventData] If this parameter is not specified, the third parameter must be the handler
		 * @param {function()} handler Handler function - event data passed here will be in event.data
		 * @returns {Delegate} This method is chainable
		 */
		this.on = function() {
			Array.prototype.unshift.call(arguments, that, listenerList, root);
			on.apply(that, arguments);
			return this;
		};


		/**
		 * Remove an event handler for elements that match the selector, forever
		 *
		 * @param {string} eventType Remove handlers for events matching this type, considering the other parameters
		 * @param {string} [selector] If this parameter is omitted, only handlers which match the other two will be removed
		 * @param {function()} [handler] If this parameter is omitted, only handlers which match the previous two will be removed
		 * @returns {Delegate} This method is chainable
		 */
		this.off = function() {
			Array.prototype.unshift.call(arguments, that, listenerList, root);
			off.apply(that, arguments);
			return this;
		};


		/**
		 * Handle an arbitrary event
		 *
		 * @private
		 * @param {Event} event
		 */
		this.handle = function(event) {
			handle.call(that, listenerList, root, event);
		};
	}

	return Delegate;

}(this));