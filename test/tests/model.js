
buster.testCase('FruitMachine#Model()', {

	"Should be able to accept plain objects as models": function() {
		var apple = new Apple({ model: { text: 'foo bar' }});

		assert(apple.model instanceof FruitMachine.Model);
	},

	"Should be able to accept FruitMachine.Models as models": function() {
		var model = new FruitMachine.Model({ text: 'foo bar' });
		var apple = new Apple({ model: model });

		assert(apple.model instanceof FruitMachine.Model);
	},

	"Should be able to accept custom Models as a model": function() {
		function MyModel(data) { this.data = data; }
		var model = new MyModel({ text: 'foo bar' });
		var apple = new Apple({ model: model });

		assert(apple.model instanceof MyModel);
	}

});