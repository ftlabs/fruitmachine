
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

	tearDown: helpers.destroyView
});