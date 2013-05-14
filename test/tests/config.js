


buster.testCase('FruitMachine#config()', {

	"Should be able to pass in a toJSON adaptor for custom models": function() {
		var tmp = FruitMachine._store.config.model;
		var text = 'content from a foreign model';

		// Make a custom model class
		function MyModel(data) { this.data = data; }
		MyModel.prototype.customToJSON = function() { return this.data; };

		// Configure an adaptor
		FruitMachine.config({
			model: {
				toJSON: function(model) {
					return model.customToJSON();
				}
			}
		});

		// Create a new view with this custom model
		var pear = new helpers.Views.Pear({
			model: new MyModel({ text: text })
		});

		pear.render();

		assert.equals(pear.el.innerHTML, text);

		// Reset adaptor
		FruitMachine.config({
			model: tmp
		});
	}
});