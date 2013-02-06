
/**
 * Dummy Data
 */

var pearConfig = {
	module: 'pear',
	data: {
		text: 'pear text'
	}
};

var orangeConfig = {
	id: 'my_child_module',
	module: 'orange',
	data: {
		text: 'orange text'
	}
};

var layout = {
	module: 'apple',
	data: {
		text: 'a title'
	},
	children: [
		orangeConfig
	]
};

var templates = {
	'apple': Hogan.compile('{{{my_child_module}}}'),
	'orange': Hogan.compile('{{text}}'),
	'pear': Hogan.compile('{{text}}')
};



var exampleHelper = function(fm) {

	var Exports = function(view) {};
	Exports.prototype.onSetup = function() {};
	Exports.prototype.onTeardown = function() {};
  Exports.prototype.method = function() {};

	return Exports;
};


FruitMachine.templates(function(module) {
	return templates[module];
});

var interactions = {
	apple: {
		onInitialize: function() {

		},
		onSetup: function() {

		},
		onTeardown: function() {

		},
		onDestroy: function() {

		}
	}
};

var helpers = {};

helpers.createView = function() {
	this.view = new FruitMachine(layout);
};

helpers.destroyView = function() {
	this.view.destroy();
	this.view = null;
};

helpers.sandbox = function() {
	document.body.insertAdjacentHTML('beforeend', '<div id="sandbox"></div>');
	return document.getElementById('sandbox');
};

helpers.sandbox.empty = function() {
	sandbox.innerHTML = '';
};


var sandbox = helpers.sandbox();


// buster.testCase('View', {
// 	"setUp": function() {
// 		this.view = new FruitMachine(layout);
// 	},

// 	"Invoking a view should trigger the `beforeinitialize` event.": function() {
// 		var spy = this.spy();
// 		var view;

// 		FruitMachine.on("beforeinitialize", spy, null);
// 		view = FruitMachine({});

// 		assert.called(spy);
// 	},

// 	"tearDown": function() {
// 		this.view = null;
// 		FruitMachine.off("beforeinitialize");
// 	}
// });


buster.testCase('View#add()', {
	"setUp": function() {
		this.view = new FruitMachine(orangeConfig);
	},

	"Should add a View instance as a child.": function() {
		var pear = new FruitMachine(pearConfig);

		this.view.add(pear);

		assert.equals(this.view.children().length, 1);
	},

	"Should add a JSON config as a child.": function() {
		this.view.add(pearConfig);
		assert.equals(this.view.children().length, 1);
	},

	"tearDown": function() {
		this.view = null;
	}
});


buster.testCase('View#render()', {
	"setUp": helpers.createView,

	"The master view should have an element post render.": function() {
		this.view.render();
		assert.defined(this.view.el());
	},

	"Data should be present in the generated markup.": function() {
		var orange = this.view.child('orange');

		this.view
			.render()
			.inject(sandbox);

		assert.equals(orange.el().innerText, orangeConfig.data.text);
	},

	"Child html should be present in the parent.": function() {
		var firtChild;

		this.view.render();
		firstChild = this.view.el().firstElementChild;
		assert.isTrue(firstChild.classList.contains('orange'));
	},

	"tearDown": helpers.destroyView
});


buster.testCase('View#toHTML()', {
	"setUp": helpers.createView,

	"Should return a string": function() {
		var html = this.view.toHTML();
		assert.isTrue('string' === typeof html);
	},

	"Should use cache if available": function() {
		var spy = this.spy(this.view.child('orange'), 'toHTML');

		this.view.toHTML();
		this.view.toHTML();

		assert.isTrue(spy.calledOnce);
	},

	"Should purge cache if model is changed": function() {
		var spy = this.spy(this.view.child('orange'), 'toHTML');

		this.view.toHTML();
		this.view.data({ foo: 'bar' });
		this.view.toHTML();

		assert.isTrue(spy.calledTwice);
	},

	"tearDown": helpers.destroyView
});


buster.testCase('View#el()', {
	"setUp": helpers.createView,

	"Should return undefined if not rendered": function() {
		var el = this.view.el();
		refute.defined(el);
	},

	"Should return an element if rendered directly": function() {
		var el;
		this.view.render();
		el = this.view.el();
		assert.defined(el);
	},

	"Should not run querySelector if the view has no parent view": function() {
		var spy = this.spy(FruitMachine.util, 'querySelectorId');
		var el;

		this.view.render();
		el = this.view.el();

		assert.isFalse(spy.called);

		FruitMachine.util.querySelectorId.restore();
	},

	"Should return the view element if the view was rendered indirectly": function() {
		var spy = this.spy(FruitMachine.util, 'querySelectorId');
		var el;

		this.view.render();
		el = this.view.child('orange').el();

		assert.defined(el);
		assert.called(spy);

		FruitMachine.util.querySelectorId.restore();
	},

	"Should find element in the DOM if injected": function() {
		var spy1 = this.spy(document, 'getElementById');
		var spy2 = this.spy(FruitMachine.util, 'querySelectorId');
		var el1, el2;

		this.view
			.render()
			.inject(sandbox);

		el1 = this.view.el();
		el2 = this.view.child('orange').el();

		assert.defined(el1);
		assert.defined(el2);
		assert.isTrue(spy1.calledTwice);
		refute.called(spy2);

		document.getElementById.restore();
		FruitMachine.util.querySelectorId.restore();
		helpers.sandbox.empty();
	},

	"Should return a different element if parent is re-rendered in DOM": function() {
		var el1, el2;

		this.view
			.render()
			.inject(sandbox);

		el1 = this.view.child('orange').el();
		this.view.render();
		el2 = this.view.child('orange').el();

		refute.equals(el1, el2);
	},

	"Should return a different element if parent is re-rendered in memory": function() {
		var el1, el2;

		this.view.render();

		el1 = this.view.child('orange').el();
		this.view.render();
		el2 = this.view.child('orange').el();

		refute.equals(el1, el2);
	},

	"tearDown": helpers.destroyView
});


buster.testCase('View#setElement()', {
	"setUp": helpers.createView,

	"Should clear child element caches on `setElement`": function() {
		var el1, el2;

		this.view
			.render()
			.inject(sandbox);

		el1 = this.view.el();
		el2 = this.view.child('orange').el();
		this.view.render();

		assert.isFalse(!!this.view.child('orange')._el);
	},

	"tearDown": helpers.destroyView
});


buster.testCase('View#data()', {
	"setUp": helpers.createView,

	"View#data() should return all data.": function() {
		var view = new FruitMachine({ data: { a: 1, b: 2, c: 3 }});
		var data = view.data();
		var length = 0;

		for (var key in data) length++;
		assert.equals(length, 3);
	},

	"Setting data by property.": function() {
		var data = this.view.data();

		this.view.data('someProp', 'some data');
		assert.equals(data.someProp, 'some data');
	},

	"Merging object into View data.": function() {
		var data = this.view.data();

		this.view.data({ prop1: 1, prop2: 2 });
		assert.equals(data.prop2, 2);
	},

	"Changing the data source shouldn't impact the View's data store.": function() {
		var source = { x: 1 };
		var view = new FruitMachine({ module: 'apple', data: source });

		source.x = 2;
		refute.equals(view.data('x'), source.x);
		assert.equals(view.data('x'), 1);
	},

	"A `datachange` event should be fired.": function() {
		var spy = this.spy();

		this.view.model.on('change', spy);
		this.view.data('foo', 'bar');
		assert.called(spy);
	},

	"A `datachange:&lt;property&gt;` event should be fired.": function() {
		var spy = this.spy();

		this.view.model.on('change:foo', spy);
		this.view.data('foo', 'bar');
		assert.called(spy);
	},

	"A `datachange:&lt;property&gt;` for each key in object mixin.": function() {
		var spy1 = this.spy();
		var spy2 = this.spy();
		var newData = { foo: 'foo', bar: 'bar' };

		this.view.model.on('change:foo', spy1);
		this.view.model.on('change:bar', spy2);
		this.view.data(newData);
		assert.called(spy1);
		assert.called(spy2);
	},

	"tearDown": helpers.destroyView
});


buster.testCase('View#child()', {
	"Should return the first child module with the specified type.": function() {
		var view = new FruitMachine(orangeConfig);
		var child;

		view.add(pearConfig);
		child = view.child('pear');

		assert.equals(child.module, 'pear');
	},

	"If there is more than one child of this module type, only the first is returned.": function() {
		var view = new FruitMachine(orangeConfig);
		var child, firstChild;

		view
			.add(pearConfig)
			.add(pearConfig);

		child = view.child('pear');
		firstChild = view.children()[0];

		assert.equals(child, firstChild);
	},

	"A child can be fetched by id.": function() {
		var view = new FruitMachine(pearConfig);
		var child, firstChild;

		view.add(orangeConfig);
		child = view.child('my_child_module');
		firstChild = view.children()[0];
		assert.equals(child, firstChild);
	}
});


buster.testCase('View#children()', {
	"setUp": helpers.createView,

	"Should return all children if no arguments given.": function() {
		var children;

		this.view
			.add(pearConfig)
			.add(pearConfig);

		children = this.view.children();
		assert.equals(children.length, 3);
	},

	"Should return all children of the given module type.": function() {
		var children;

		this.view
			.add(pearConfig)
			.add(pearConfig);

		children = this.view.children('pear');
		assert.equals(children.length, 2);
	},

	"tearDown": helpers.tearDown
});


buster.testCase('View#id()', {
	"setUp": helpers.createView,

	"Should return a child by id.": function() {
		var child = this.view.id('my_child_module');
		assert.defined(child);
	},

	"Should the view's own id if no arguments given.": function() {
		var id = 'a_view_id';
		var view = new FruitMachine({ id: id });
		assert.equals(view.id(), id);
	},

	"tearDown": helpers.tearDown
});

buster.testCase('View#inject()', {
	"Should inject the view element into the given element.": function() {
		var view = new FruitMachine(layout);

		view
			.render()
			.inject(sandbox);

		assert.equals(view.el(), sandbox.firstElementChild);
	},

	"tearDown": function() {
		helpers.sandbox.empty();
	}
});


buster.testCase('View#setup()', {
	setUp: helpers.createView,

	"Setup should recurse.": function() {
		var spy1 = this.spy(this.view, 'onSetup');
		var spy2 = this.spy(this.view.child('orange'), 'onSetup');

		this.view
			.render()
			.setup();

		assert.called(spy1);
		assert.called(spy2);

		this.view.onSetup.restore();
		this.view.child('orange').onSetup.restore();
	},

	"Should not recurse if used with the `shallow` option.": function() {
		var spy1 = this.spy(this.view, 'onSetup');
		var spy2 = this.spy(this.view.child('orange'), 'onSetup');

		this.view
			.render()
			.setup({ shallow: true });

		assert.called(spy1);
		refute.called(spy2);

		this.view.onSetup.restore();
		this.view.child('orange').onSetup.restore();
	},

	"onSetup should be called on a registered custom view.": function() {
		var spy = this.spy(interactions.apple, 'onSetup');
		var view;

		FruitMachine.module('apple', interactions.apple);

		view = new FruitMachine(layout);
		view.render();
		view.setup();

		assert.called(spy);
		interactions.apple.onSetup.restore();
		FruitMachine.module.clear('apple');
	},

	"Once setup, a View should be flagged as such.": function() {
		this.view
			.render()
			.setup();

		assert.isTrue(this.view.isSetup);
		assert.isTrue(this.view.child('orange').isSetup);
	},

	tearDown: helpers.destroyView
});

buster.testCase('View#teardown()', {
	setUp: function() {
		helpers.createView.call(this);
		this.spy1 = this.spy(this.view, 'onTeardown');
		this.spy2 = this.spy(this.view.child('orange'), 'onTeardown');
	},

	"Teardown should recurse.": function() {
		this.view
			.render()
			.setup()
			.teardown();

		assert.called(this.spy1);
		assert.called(this.spy2);
	},

	"Should not recurse if used with the `shallow` option.": function() {
		this.view
			.render()
			.setup()
			.teardown({ shallow: true });

		assert.called(this.spy1);
		refute.called(this.spy2);
	},

	"onTeardown should be called if `setup()` is called twice.": function() {
		this.view
			.setup()
			.setup();

		assert.called(this.spy1);
		assert.called(this.spy2);
	},

	tearDown: function() {
		this.spy1 = this.spy(this.view, 'onTeardown');
		this.spy2 = this.spy(this.view.child('orange'), 'onTeardown');
		helpers.destroyView.call(this);
	}
});


buster.testCase('FruitMachine#helpers()', {
  setUp: function() {
    FruitMachine.helper('example', exampleHelper);

    FruitMachine.module('apple', {
      helpers: ['example']
    });

    this.view = new FruitMachine({
      module: 'apple'
    });
  },

  "helper should be present on the view": function() {

    assert.defined(this.view.example);
  },

  tearDown: function() {
    FruitMachine.helper.remove('example');
    FruitMachine.module.clear('apple');
  }
});