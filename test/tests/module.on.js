
describe('View#on()', function() {
	var viewToTest;

	beforeEach(function() {
		viewToTest = helpers.createView();
	});

	test("Should recieve the callback when fire is called directly on a view", function() {
		var spy = jest.fn();

		viewToTest.on('testevent', spy);
		viewToTest.fire('testevent');
		expect(spy).toHaveBeenCalled();
	});

	test("Should recieve the callback when event is fired on a sub view", function() {
		var spy = jest.fn();
		var apple = viewToTest.module('apple');

		viewToTest.on('testevent', spy);
		apple.fire('testevent');
		expect(spy).toHaveBeenCalled();
	});

	test("Should *not* recieve the callback when event is fired on a sub view that *doesn't* match the target", function() {
		var spy = jest.fn();
		var apple = viewToTest.module('apple');

		viewToTest.on('testevent', 'orange', spy);
		apple.fire('testevent');
		expect(spy).not.toHaveBeenCalled();
	});

	test("Should receive the callback when event is fired on a sub view that *does* match the target", function() {
		var spy = jest.fn();
		var apple = viewToTest.module('apple');

		viewToTest.on('testevent', 'apple', spy);
		apple.fire('testevent');
		expect(spy).toHaveBeenCalled();
	});

	test("Should pass the correct arguments to delegate event listeners", function() {
		var spy = jest.fn();
		var apple = viewToTest.module('apple');

		viewToTest.on('testevent', 'apple', spy);
		apple.fire('testevent', 'foo', 'bar');
		expect(spy).toHaveBeenCalledWith('foo', 'bar');
	});

	test("Should be able to unbind event listeners if initially bound with module name", function() {
		var spy = jest.fn();
		var apple = viewToTest.module('apple');

		viewToTest.on('testevent', 'apple', spy);
		apple.fire('testevent');
		expect(spy).toHaveBeenCalled();

		spy.mockClear();
		viewToTest.off('testevent', 'apple', spy);
		apple.fire('testevent', 'foo', 'bar');
		expect(spy).not.toHaveBeenCalled();
	});

	test("#off with module will unbind all matching listeners, regardless of how they are bound", function() {
		var spy = jest.fn();
		var spy2 = jest.fn();
		var apple = viewToTest.module('apple');

		viewToTest.on('testevent', 'apple', spy);
		viewToTest.on('testevent', spy2);
		apple.fire('testevent');
		expect(spy).toHaveBeenCalled();
		expect(spy2).toHaveBeenCalled();

		spy.mockClear();
		spy2.mockClear();
		viewToTest.off('testevent', 'apple');
		apple.fire('testevent');
		expect(spy).not.toHaveBeenCalled();
		expect(spy2).toHaveBeenCalled();
	});

	test("#off without a module should also unbind listeners, regardless of how they are bound", function() {
		var spy = jest.fn();
		var apple = viewToTest.module('apple');

		viewToTest.on('testevent', 'apple', spy);
		apple.fire('testevent');
		expect(spy).toHaveBeenCalled();

		spy.mockClear();
		viewToTest.off('testevent', spy);
		apple.fire('testevent');
		expect(spy).not.toHaveBeenCalled();
	});

	afterEach(function() {
		helpers.destroyView();
		viewToTest = null;
	});
});
