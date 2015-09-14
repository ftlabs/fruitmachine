var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase('View#fire()', {
	setUp: helpers.createView,

	"Should run on callbacks registered on the view": function() {
		var spy = this.spy();

		this.view.on('testevent', spy);
		this.view.fire('testevent');
		assert.called(spy);
	},

	"Events should bubble by default": function() {
		var spy = this.spy();
		var child = this.view.module('orange');

		this.view.on('childtestevent', spy);
		child.fire('childtestevent');

		assert.called(spy);
	},

	"Calling event.stopPropagation() should stop bubbling": function() {
		var spy = this.spy();
		var child = this.view.module('orange');

		this.view.on('childtestevent', spy);
		child.on('childtestevent', function(){
			this.event.stopPropagation();
		});

		child.fire('childtestevent');
		refute.called(spy);
	},

	"Should pass arguments to the callback": function() {
		var spy = this.spy();
		var arg1 = 'arg1';
		var arg2 = 'arg2';
		var arg3 = 'arg3';

		this.view.on('childtestevent', spy);
		this.view.fire('childtestevent', arg1, arg2, arg3);

		assert.equals(spy.args[0][0], arg1);
		assert.equals(spy.args[0][1], arg2);
		assert.equals(spy.args[0][2], arg3);
	},

	"Should allow multiple events to be in progress on the same view": function() {
		var layout = this.view;
		var apple = layout.module('apple');
		var event;

		apple.on('testevent1', function() {
			event = this.event;
			assert.equals(this.event.target, apple, "testevent1 match failed");
		});

		apple.on('testevent1', function() {
			assert.equals(event, this.event, "testevent1 listener 2 match failed");
			apple.fire('testevent2');
		});

		apple.on('testevent2', function() {
			refute.equals(event, this.event, "testevent2 match failed");
			assert.equals(this.event.target, apple);
		});

		apple.fire('testevent1');
	},

	tearDown: helpers.destroyView
});
