
buster.testCase('FruitMachine#Model()', {

	"Should be able to accept plain objects as models": function() {
		var view = new FruitMachine.View({ model: { text: 'foo bar' }});

		assert.isTrue(view.model instanceof FruitMachine.Model);
	},

	"Should be able to accept FruitMachine.Models as models": function() {
		var model = new FruitMachine.Model({ text: 'foo bar' });
		var view = new FruitMachine.View({ model: model });

		assert.isTrue(view.model instanceof FruitMachine.Model);
	},

	"Should be able to accept custom Models as a model": function() {
		function MyModel(data) { this.data = data; }
		var model = new MyModel({ text: 'foo bar' });
		var view = new FruitMachine.View({ model: model });

		assert.isTrue(view.model instanceof MyModel);
	}

});