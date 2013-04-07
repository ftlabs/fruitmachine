
buster.testCase('View#trigger()', {
	setUp: helpers.createView,

	"Should run on callbacks registered on the view": function() {
		var spy = this.spy();

		this.view.on('testevent', spy);
		this.view.trigger('testevent');
	  assert.called(spy);
	},

	"Events should not bubble up to parent views if passed `{ propagate: false }`": function() {
		var spy = this.spy();
		var child = this.view.module('orange');

		this.view.on('childtestevent', spy);
		child.trigger('childtestevent', { propagate: false });
	  refute.called(spy);
	},

	"Events should bubble by default": function() {
		var spy = this.spy();
		var child = this.view.module('orange');

		this.view.on('childtestevent', spy);
		child.trigger('childtestevent');
	  assert.called(spy);
	},

	"Calling event.stopPropagation() should stop bubbling": function() {
		var spy = this.spy();
		var child = this.view.module('orange');

		this.view.on('childtestevent', spy);
		child.on('childtestevent', function(event) {
			event.stopPropagation();
		});

		child.trigger('childtestevent');
	  refute.called(spy);
	},

	"First callback argument should be the event object": function() {
		var spy = this.spy();

		this.view.on('childtestevent', spy);
		this.view.trigger('childtestevent');

	  assert.defined(spy.args[0][0].stopPropagation);
	},

	"Should pass arguments to the callback": function() {
		var spy = this.spy();
		var arg1 = 'arg1';
		var arg2 = 'arg2';
		var arg3 = 'arg3';

		this.view.on('childtestevent', spy);
		this.view.trigger('childtestevent', [arg1, arg2, arg3]);

	  assert.equals(spy.args[0][1], arg1);
	  assert.equals(spy.args[0][2], arg2);
	  assert.equals(spy.args[0][3], arg3);
	},

	tearDown: helpers.destroyView
});