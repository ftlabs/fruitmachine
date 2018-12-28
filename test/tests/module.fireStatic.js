describe('View#fireStatic()', function() {
	var viewToTest;

	beforeEach(function() {
		viewToTest = helpers.createView();
	});

	test("Should run on callbacks registered on the view", function() {
		var spy = jest.fn();

		viewToTest.on('testevent', spy);
		viewToTest.fireStatic('testevent');
		expect(spy).toHaveBeenCalledTimes(1);
	});

	test("Events should not bubble up to parent views", function() {
		var spy = jest.fn();
		var child = viewToTest.module('orange');

		viewToTest.on('childtestevent', spy);
		child.fireStatic('childtestevent');
		expect(spy).not.toHaveBeenCalled();
	});

	test("Should pass arguments to the callback", function() {
		var spy = jest.fn();
		var arg1 = 'arg1';
		var arg2 = 'arg2';
		var arg3 = 'arg3';

		viewToTest.on('childtestevent', spy);
		viewToTest.fireStatic('childtestevent', arg1, arg2, arg3);

		expect(spy).toHaveBeenCalledWith(arg1, arg2, arg3);
	});

	afterEach(function() {
		helpers.destroyView();
		viewToTest = null;
	});
});
