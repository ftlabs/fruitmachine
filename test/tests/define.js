
buster.testCase('fruitmachine.define()', {
	setUp: function() {},

	"Should store the module in fruitmachine.store under module type": function() {
		fruitmachine.define({ module: 'my-module-1' });
		assert.defined(fruitmachine.modules['my-module-1']);
	},

	"Should return an instantiable constructor": function() {
		var View = fruitmachine.define({ module: 'new-module-1' });
		var view = new View();

		assert.defined(view._fmid);
		assert.equals('new-module-1', view.module());
	},

	"Should find module from internal module store if a `module` parameter is passed": function() {
		var apple = new fruitmachine({ module: 'apple' });

		assert.equals('apple', apple.module());
		assert.defined(apple.template);
	},

	"Not defining reserved methods should not rewrite keys with prefixed with '_'": function() {
		var setup = this.spy();
		var View = fruitmachine.define({
			module: 'foobar'
		});

		refute.defined(View.prototype._setup);
	},

	"Should be able to accept a View class, so that a View can be defined from extended views": function() {
		var initialize1 = this.spy();
		var initialize2 = this.spy();
		var setup1 = this.spy();
		var setup2 = this.spy();

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

		assert.equals(View1.prototype._module, 'new-module-1');
		assert.equals(View2.prototype._module, 'new-module-2');
		assert.equals(View2.prototype.random, 'different');
		assert.isTrue(initialize1.calledOnce);
		assert.isTrue(initialize2.calledOnce);
		assert.isTrue(setup1.calledOnce);
		assert.isTrue(setup2.calledOnce);
	},

	tearDown: function() {
		delete fruitmachine.modules['my-module-1'];
		delete fruitmachine.modules['my-module-2'];
	}
});