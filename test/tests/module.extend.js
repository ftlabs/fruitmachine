
describe('Extend', function() {
	test("Defining reserved methods should rewrite keys with prefixed with '_'", function() {
		var setup = jest.fn();
		var Module = fruitmachine.Module.extend({
			module: 'foobar',
			setup: setup
		});

		expect(Module.prototype._module).toBe('foobar');
		expect(Module.prototype._setup).toBe(setup);
	});
});
