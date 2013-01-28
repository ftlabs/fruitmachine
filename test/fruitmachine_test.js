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
	'apple': Hogan.compile('<div class="module-apple {{{fm_classes}}}" {{{fm_attrs}}}>{{{my_child_module}}}</div>'),
	'orange': Hogan.compile('<div class="module-orange {{{fm_classes}}}" {{{fm_attrs}}}>{{text}}</div>'),
	'pear': Hogan.compile('<div class="module-pear {{{fm_classes}}}" {{{fm_attrs}}}>{{text}}</div>')
};

FruitMachine.set('templates', function(module) {
	return function(data) {
		return templates[module].render(data);
	};
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
	this.view = new FruitMachine.View(layout);
};

helpers.destroyView = function() {
	this.view.destroy();
	this.view = null;
};

helpers.domSandbox = function() {
	document.body.insertAdjacentHTML('beforeend', '<div id="sandbox"></div>');
	return document.getElementById('sandbox');
};


var sandbox = helpers.domSandbox();


buster.testCase('View', {
	"setUp": function() {
		this.view = new FruitMachine.View(layout);
	},

	"Invoking a view should trigger the `beforeinitialize` event.": function() {
		var spy = this.spy();
		var view;

		FruitMachine.on("beforeinitialize", spy, null);
		view = FruitMachine.View({});

		assert.called(spy);
	},

	"tearDown": function() {
		this.view = null;
		FruitMachine.off("beforeinitialize");
	}
});


buster.testCase('View#add()', {
	"setUp": function() {
		this.view = new FruitMachine.View(orangeConfig);
	},

	"Should add a View instance as a child.": function() {
		var pear = new FruitMachine.View(pearConfig);

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


buster.testCase('View#hasChild()', {
	"Should return true for existent module type and id.": function() {
		this.view = new FruitMachine.View(layout);
		assert.isTrue(this.view.hasChild('orange'));
		assert.isTrue(this.view.hasChild('my_child_module'));
	},

	"Should return false when for non-existent module type and id.": function() {
		this.view = new FruitMachine.View(layout);
		assert.isFalse(this.view.hasChild('banana'));
		assert.isFalse(this.view.hasChild('non_existent_id'));
	}
});


buster.testCase('View#render()', {
	"setUp": helpers.createView,

	"The master view should have an element post render.": function() {
		this.view.render();
		assert.defined(this.view.el);
	},

	"The child view should have an element post render.": function() {
		var child = this.view.id('my_child_module');

		this.view.render();
		assert.defined(child.el);
	},

	"The `asString` option should return a string.": function() {
		var result = this.view.render({ asString: true });

		assert.equals(typeof result, 'string');
	},

	"The `forClient` option should include `data-parent` attributes": function() {
		var result = this.view.render({ asString: true, forClient: true });
		var hasParentAttrs = !!~result.indexOf('data-parent');

		assert.isTrue(hasParentAttrs);
	},

	"A `render` event should be fired on the view.": function() {
		var spy = this.spy();

		this.view.on('render', spy);
		this.view.render();
		assert.called(spy);
	},

	"Data should be present in the generated markup.": function() {
		var orange = this.view.child('orange');

		this.view.render();
		assert.equals(orange.el.innerText, orangeConfig.data.text);
	},

	"Child html should be present in the parent.": function() {
		var firtChild;

		this.view.render();
		firstChild = this.view.el.firstElementChild;
		assert.isTrue(firstChild.classList.contains('module-orange'));
	},

	"tearDown": helpers.destroyView
});


buster.testCase('View#data()', {
	"setUp": helpers.createView,

	"View#data() should return all data.": function() {
		var view = new FruitMachine.View({ data: { a: 1, b: 2, c: 3 }});
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
		var view = new FruitMachine.View({ module: 'apple', data: source });

		source.x = 2;
		refute.equals(view.data('x'), source.x);
		assert.equals(view.data('x'), 1);
	},

	"A `datachange` event should be fired.": function() {
		var spy = this.spy();

		this.view.on('datachange', spy);
		this.view.data('foo', 'bar');
		assert.called(spy);
	},

	"A `datachange:&lt;property&gt;` event should be fired.": function() {
		var spy = this.spy();

		this.view.on('datachange:foo', spy);
		this.view.data('foo', 'bar');
		assert.called(spy);
	},

	"A `datachange:&lt;property&gt;` for each key in object mixin.": function() {
		var spy1 = this.spy();
		var spy2 = this.spy();
		var newData = { foo: 'foo', bar: 'bar' };

		this.view.on('datachange:foo', spy1);
		this.view.on('datachange:bar', spy2);
		this.view.data(newData);
		assert.called(spy1);
		assert.called(spy2);
	},

	"tearDown": helpers.destroyView
});


buster.testCase('View#child()', {
	"Should return the first child module with the specified type.": function() {
		var view = new FruitMachine.View(orangeConfig);
		var child;

		view.add(pearConfig);
		child = view.child('pear');

		assert.equals(child.module, 'pear');
	},

	"If there is more than one child of this module type, only the first is returned.": function() {
		var view = new FruitMachine.View(orangeConfig);
		var child, firstChild;

		view
			.add(pearConfig)
			.add(pearConfig);

		child = view.child('pear');
		firstChild = view.children()[0];

		assert.equals(child, firstChild);
	},

	"A child can be fetched by id.": function() {
		var view = new FruitMachine.View(pearConfig);
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
		var view = new FruitMachine.View({ id: id });
		assert.equals(view.id(), id);
	},

	"tearDown": helpers.tearDown
});

buster.testCase('View#inject()', {
	"Should inject the view element into the given element.": function() {
		var view = new FruitMachine.View(layout).render();
		view.inject(sandbox);
		assert.equals(view.el, sandbox.firstElementChild);
	},

	"tearDown": function() {
		sandbox.innerHTML = '';
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
	},

	"Setup should not be run if the view has no element.": function() {
		var spy1 = this.spy(this.view, 'onSetup');
		var spy2 = this.spy(this.view.child('orange'), 'onSetup');

		this.view
			.setup();

		refute.called(spy1);
		refute.called(spy2);
	},

	"Should not recurse if used with the `shallow` option.": function() {
		var spy1 = this.spy(this.view, 'onSetup');
		var spy2 = this.spy(this.view.child('orange'), 'onSetup');

		this.view
			.render()
			.setup({ shallow: true });

		assert.called(spy1);
		refute.called(spy2);
	},

	"The `beforesetup` event should be fired once for each module.": function() {
		var spy = this.spy();
		FruitMachine.on('beforesetup', spy);

		this.view
			.render()
			.setup();

		assert.isTrue(spy.calledTwice);
	},

	"onSetup should be called on a registered custom view.": function() {
		var spy = this.spy(interactions.apple, 'onSetup');
		var view;

		FruitMachine.View.extend('apple', interactions.apple);

		view = new FruitMachine.View(layout);
		view.render();
		view.setup();

		assert.called(spy);
		interactions.apple.onSetup.restore();
	},

	"Once setup, a View should be flagged as such.": function() {
		this.view
			.render()
			.setup();

		assert.isTrue(this.view.isSetup);
		assert.isTrue(this.view.child('orange').isSetup);
	},

	tearDown: function() {
		helpers.destroyView.call(this);
		FruitMachine.off('beforesetup');
	}
});

buster.testCase('View#teardown()', {
	setUp: helpers.createView,

	"Setup should recurse.": function() {
		var spy1 = this.spy(this.view, 'onSetup');
		var spy2 = this.spy(this.view.child('orange'), 'onSetup');

		this.view
			.render()
			.setup();

		assert.called(spy1);
		assert.called(spy2);
	},

	"Setup should not be run if the view has no element.": function() {
		var spy1 = this.spy(this.view, 'onSetup');
		var spy2 = this.spy(this.view.child('orange'), 'onSetup');

		this.view
			.setup();

		refute.called(spy1);
		refute.called(spy2);
	},

	"Should not recurse if used with the `shallow` option.": function() {
		var spy1 = this.spy(this.view, 'onSetup');
		var spy2 = this.spy(this.view.child('orange'), 'onSetup');

		this.view
			.render()
			.setup({ shallow: true });

		assert.called(spy1);
		refute.called(spy2);
	},

	"The `beforesetup` event should be fired once for each module.": function() {
		var spy = this.spy();
		FruitMachine.on('beforesetup', spy);

		this.view
			.render()
			.setup();

		assert.isTrue(spy.calledTwice);
	},

	"onSetup should be called on a registered custom view.": function() {
		var spy = this.spy(interactions.apple, 'onSetup');
		var view;

		FruitMachine.View.extend('apple', interactions.apple);

		view = new FruitMachine.View(layout);
		view.render();
		view.setup();

		assert.called(spy);
		interactions.apple.onSetup.restore();
	},

	"Once setup, a View should be flagged as such.": function() {
		this.view
			.render()
			.setup();

		assert.isTrue(this.view.isSetup);
		assert.isTrue(this.view.child('orange').isSetup);
	},

	tearDown: function() {
		helpers.destroyView.call(this);
		FruitMachine.off('beforesetup');
	}
});