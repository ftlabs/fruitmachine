var assert = buster.referee.assert;
var refute = buster.referee.refute;

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

	"Should pass the correct arguments to delegate event listeners": function() {
		var spy = this.spy();
		var apple = this.view.module('apple');

		this.view.on('testevent', 'apple', spy);
		apple.fire('testevent', 'foo', 'bar');
		assert(spy.calledWith('foo', 'bar'));
	},

	"Should be able to unbind event listeners if initially bound with module name": function() {
		var spy = this.spy();
		var apple = this.view.module('apple');

		this.view.on('testevent', 'apple', spy);
		apple.fire('testevent');
		assert(spy.called);

		spy.reset();
		this.view.off('testevent', 'apple', spy);
		apple.fire('testevent', 'foo', 'bar');
		refute(spy.called);
	},

	"#off with module will unbind all matching listeners, regardless of how they are bound": function() {
		var spy = this.spy();
		var spy2 = this.spy();
		var apple = this.view.module('apple');

		this.view.on('testevent', 'apple', spy);
		this.view.on('testevent', spy2);
		apple.fire('testevent');
		assert(spy.called);
		assert(spy2.called);

		spy.reset();
		spy2.reset();
		this.view.off('testevent', 'apple');
		apple.fire('testevent');
		refute(spy.called);
		assert(spy2.called);
	},

	"#off without a module should also unbind listeners, regardless of how they are bound": function() {
		var spy = this.spy();
		var apple = this.view.module('apple');

		this.view.on('testevent', 'apple', spy);
		apple.fire('testevent');
		assert(spy.called);

		spy.reset();
		this.view.off('testevent', spy);
		apple.fire('testevent');
		refute(spy.called);
	},

  "#on events should fire the correct number of times when re-fired": function() {
    var orange = this.view.module("orange");
    var apple  = this.view.module("apple");

    var callCount = {
      orange: 0,
      apple:  0
    }

    this.view.on("foo", "apple", function(data) {
      callCount.apple += 1;
      orange.foo();
    });

    this.view.on("foo", "orange", function(data) {
      // This is called twice and should only be called once.
      callCount.orange += 1;
    });

    apple.foo();

    assert.equals(callCount.apple,  1);
    assert.equals(callCount.orange, 1);
  },

  "#on events fire with the correct event object when re-fired": function() {
    var orange = this.view.module("orange");
    var apple  = this.view.module("apple");

    this.view.on("foo", "apple", function(data) {
      assert.equals(data, "from apple");
      orange.foo();
    });

    this.view.on("foo", "orange", function(data) {
      // This is "from apple" rather than "from orange",
      assert.equals(data, "from orange");
    });

    apple.foo();
  },

	tearDown: helpers.destroyView
});
