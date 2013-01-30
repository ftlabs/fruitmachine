
FruitMachine.helper('breakpoint', function(fm) {

	/**
	 * Setup
	 */

	var Events = {};

	function onWindowResize() {
		Events.trigger('resize');
	}

	// Merge event emitter into Breakpoints
	fm.util.mixin(Events, fm.Events);
	if (window) window.addEventListener('resize', onWindowResize);

	/**
	 * Instance
	 */

	var Breakpoint = function(view) {
		this.view = view;
	};

	Breakpoint.prototype.onSetup = function() {
		var self = this;

		this.onResizeBound = function() {
			self.onResize.call(self);
		};

		Events.on('resize', this.onResizeBound);
		this.name = this.get();
	};

	Breakpoint.prototype.onResize = function() {
		var previous = this.name;
		var current = this.get();

		if (previous === current) return;

		this.name = current;
		this.view.trigger('breakpoint:' + current);
		this.view.trigger('breakpointchange', current, previous);
	};

	Breakpoint.prototype.callback = function() {
		Events.off('resize', this.onResizeBound);
		return this.onResizeBound;
	};

	Breakpoint.prototype.get = function() {
		var el = !this.view.el();
		if (el) return;
		return getComputedStyle(el, ':after').content;
	};

	Breakpoint.prototype.onTeardown = function() {
		Events.off('resize', this.onResizeBound);
	};

	return Breakpoint;
});