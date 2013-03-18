
buster.testCase('FruitMachine.templates()', {
	setUp: function() {
		this.oldTemplates = FruitMachine.store.templates;
		FruitMachine.store.templates = {};
	},

	"Should be able to register templates by passing an object": function() {
		FruitMachine.templates({
			'testmodule': '<div></div>'
		});

		assert.defined(FruitMachine.store.templates['testmodule']);
	},

	"Should keep mixinn in templates to template store": function() {
		FruitMachine.templates({
			'testmodule': '<div></div>'
		});

		FruitMachine.templates({
			'testmodule2': '<div></div>'
		});

		assert.defined(FruitMachine.store.templates['testmodule']);
		assert.defined(FruitMachine.store.templates['testmodule2']);
	},

	"Should accept a function that can return template": function() {
		FruitMachine.templates(function(module) {
			return helpers.templates[module];
		});

		var view = new helpers.Apple();

		assert.defined(view.template);
		assert.equals('function', typeof view.template);
	},

	tearDown: function() {
		FruitMachine.templates.clear();
		FruitMachine.store.templates = this.oldTemplates;
	}
});