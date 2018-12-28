
describe('fruitmachine.define()', function() {
	test("Should store the module in fruitmachine.store under module type", function() {
		fruitmachine.define({ module: 'my-module-1' });
		expect(fruitmachine.modules['my-module-1']).toBeDefined();
	});

	test("Should return an instantiable constructor", function() {
		var View = fruitmachine.define({ module: 'new-module-1' });
		var view = new View();

		expect(view._fmid).toBeDefined();
		expect(view.module()).toBe('new-module-1');
	});

	test("Should find module from internal module store if a `module` parameter is passed", function() {
		var apple = new fruitmachine({ module: 'apple' });

		expect(apple.module()).toBe('apple');
		expect(apple.template).toBeDefined();
	});

	test("Not defining reserved methods should not rewrite keys with prefixed with '_'", function() {
		var View = fruitmachine.define({
			module: 'foobar',
		});

		expect(View.prototype._setup).toBeUndefined();
	});

	test("Should be able to accept a Module class, so that a Module can be defined from extended modules", function() {
		var initialize1 = jest.fn();
		var initialize2 = jest.fn();
		var setup1 = jest.fn();
		var setup2 = jest.fn();

		var View1 = fruitmachine.define({
			module: 'new-module-1',
			random: 'prop',
			template: helpers.templates.apple,
			initialize: initialize1,
			setup: setup1
		});

		var View2 = fruitmachine.define(View1.extend({
			module: 'new-module-2',
			random: 'different',
			initialize: initialize2,
			setup: setup2
		}));

		var view1 = new View1()
			.render()
			.setup();

		var view2 = new View2()
			.render()
			.setup();


		expect(View1.prototype._module).toBe('new-module-1');
		expect(View2.prototype._module).toBe('new-module-2');
		expect(View2.prototype.random).toBe('different');
		expect(initialize1.mock.calls.length).toBe(1);
		expect(initialize2.mock.calls.length).toBe(1);
		expect(setup1.mock.calls.length).toBe(1);
		expect(setup2.mock.calls.length).toBe(1);
	});
});
