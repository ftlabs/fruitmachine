
buster.testCase('View#on()', {
	setUp: helpers.createView,

	"Should recieve the callback when fire is called directly on a view": function() {
		var spy = this.spy();

		this.view.on('testevent', spy);
		this.view.fire('testevent');
	  assert(spy.called);
	},

	"Should recieve the callback when event is fired on a sub view": function() {
		var spy = this.spy();
		var apple = this.view.module('apple');

		this.view.on('testevent', spy);
		apple.fire('testevent');
	  assert(spy.called);
	},

	"Should *not* recieve the callback when event is fired on a sub view that *doesn't* match the target": function() {
		var spy = this.spy();
		var apple = this.view.module('apple');

		this.view.on('testevent', 'orange', spy);
		apple.fire('testevent');
	  refute(spy.called);
	},

	"Should receive the callback when event is fired on a sub view that *does* match the target": function() {
		var spy = this.spy();
		var apple = this.view.module('apple');

		this.view.on('testevent', 'apple', spy);
		apple.fire('testevent');
	  assert(spy.called);
	},

	tearDown: helpers.destroyView
});