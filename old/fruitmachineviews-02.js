
FruitMachine.Views['sharon'] = FruitMachine.View.extend({

	initialize: function() {
		//console.log('initializing sharon');

		this.on('setup', this.onSetup.all, this);
		this.on('teardown', this.onTeardown.all, this);
		myBreakpoints.on('breakpointchange', this.onBreakpointChange, this);
	},

	onSetup: {
		all: function() {
			console.log('all setup');
			this.onSetup[myBreakpoints.current]();
		},

		smallscreen: function() {
			console.log('smallscreen setup');
		},

		mediumscreen: function() {
			console.log('mediumscreen setup');
		},

		largescreen: function() {
			console.log('largescreen setup');
		}
	},

	onTeardown: {
		all: function() {
			console.log('all teardown');
			this.onSetup[myBreakpoints.current]();
		},

		smallscreen: function() {
			console.log('smallscreen teardown');
		},

		mediumscreen: function() {
			console.log('mediumscreen teardown');
		},

		largescreen: function() {
			console.log('largescreen teardown');
		}
	},

	onBreakpointChange: function(current, previous) {
		this.onTeardown[previous]();
		this.onSetup[current]();
	}
});