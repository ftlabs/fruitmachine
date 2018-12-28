
describe('View#classes()', function() {
	test("Should be able to define classes on the base class", function() {
		var View = fruitmachine.define({
			classes: ['foo', 'bar']
		});

		var view = new View()
			.render();

		expect(!!~view.el.className.indexOf('foo')).toBe(true)
		expect(!!~view.el.className.indexOf('bar')).toBe(true);
	});

	test("Should be able to manipulate the classes array at any time", function() {
		var apple = new helpers.Views.Apple();

		apple.classes.push('foo');
		apple.render();

		expect(!!~apple.el.className.indexOf('foo')).toBe(true);
	});

	test("Should be able to define classes at instnatiation", function() {
		var apple = new helpers.Views.Apple({
			classes: ['foo', 'bar']
		});

		apple.render();

		expect(!!~apple.el.className.indexOf('foo')).toBe(true);
		expect(!!~apple.el.className.indexOf('bar')).toBe(true);
	});
});
