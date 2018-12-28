
describe('View#fire()', function() {
	var viewToTest;

	beforeEach(function() {
		viewToTest = helpers.createView();
	});

	test("Should run on callbacks registered on the view", function() {
		var spy = jest.fn();

		viewToTest.on('testevent', spy);
		viewToTest.fire('testevent');

		expect(spy).toHaveBeenCalledTimes(1);
	});

	test("Events should bubble by default", function() {
		var spy = jest.fn();
		var child = viewToTest.module('orange');

		viewToTest.on('childtestevent', spy);
		child.fire('childtestevent');

		expect(spy).toHaveBeenCalledTimes(1);
	});

	test("Calling event.stopPropagation() should stop bubbling", function() {
		var spy = jest.fn();
		var child = viewToTest.module('orange');

		viewToTest.on('childtestevent', spy);
		child.on('childtestevent', function(){
			this.event.stopPropagation();
		});

		child.fire('childtestevent');
		expect(spy).toHaveBeenCalledTimes(0);
	});

	test("Should pass arguments to the callback", function() {
		var spy = jest.fn();
		var arg1 = 'arg1';
		var arg2 = 'arg2';
		var arg3 = 'arg3';

		viewToTest.on('childtestevent', spy);
		viewToTest.fire('childtestevent', arg1, arg2, arg3);

		expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
	});

	test("Should allow multiple events to be in progress on the same view", function() {
		var layout = viewToTest;
		var apple = layout.module('apple');
		var event;

		apple.on('testevent1', function() {
			event = this.event;
			expect(this.event.target).toBe(apple);
		});

		apple.on('testevent1', function() {
			expect(event).toBe(this.event);
			apple.fire('testevent2');
		});

		apple.on('testevent2', function() {
			expect(event).not.toBe(this.event);
			expect(this.event.target).toBe(apple);
		});

		apple.fire('testevent1');
	});

	afterEach(function() {
		helpers.destroyView();
		viewToTest = null;
	});
});
