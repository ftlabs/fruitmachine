
buster.testCase('View#classes()', {

	"Should be able to define classes on the base class": function() {
		var View = fruitmachine.define({
			classes: ['foo', 'bar']
		});

		var view = new View()
			.render();

		assert.isTrue(!!~view.el.className.indexOf('foo'));
		assert.isTrue(!!~view.el.className.indexOf('bar'));
	},

	"Should be able to manipulate the classes array at any time": function() {
		var apple = new helpers.Views.Apple();

		apple.classes.push('foo');
		apple.render();

		assert.isTrue(!!~apple.el.className.indexOf('foo'));
	},

	"Should be able to define classes at instnatiation": function() {
		var apple = new helpers.Views.Apple({
			classes: ['foo', 'bar']
		});

		apple.render();

		assert.isTrue(!!~apple.el.className.indexOf('foo'));
		assert.isTrue(!!~apple.el.className.indexOf('bar'));
	}
});