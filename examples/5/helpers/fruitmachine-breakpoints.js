
FruitMachine.helper('breakpoint', function(Helper) {

	/**
	 * Global
	 */

	var Events = {};

	function onWindowResize() {
		Events.trigger('resize');
	}

	Helper.attach = function onAttach(FM) {
		// Merge event emitter into Breakpoints
		FM.util.mixin(Events, FM.Events);
		window.addEventListener('resize', onWindowResize);
	};

	Helper.detach = function onDetach(FM) {
		window.removeEventListener('resize', onWindowResize);
	};

	/**
	 * Instance
	 */

	var Breakpoint = Helper.exports = function(view) {
		this.view = view;
	};

	Breakpoint.prototype.onSetup = function() {
		var self = this;
		this.el = this.view.el();

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
		if (!this.el) return;
		return getComputedStyle(this.el, ':after').content;
	};

	Breakpoint.prototype.onTeardown = function() {

	};

	return Helper;
}({}));