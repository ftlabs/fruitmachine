
buster.testCase('View#module()', {
	setUp: helpers.createView,

	"Should return module type if no arguments given": function() {
    assert.equals(this.view.module(), 'apple');
  },

  "Should return the first child module with the specified type.": function() {
    var view = new FruitMachine(helpers.configs.orange);
    var child;

    view.add(helpers.configs.pear);
    child = view.module('pear');

    assert.equals(child.module(), 'pear');
  },

  "If there is more than one child of this module type, only the first is returned.": function() {
    var view = new FruitMachine(helpers.configs.orange);
    var child, firstChild;

    view
      .add(helpers.configs.pear)
      .add(helpers.configs.pear);

    child = view.module('pear');
    firstChild = view.children()[0];

    assert.equals(child, firstChild);
  },

  tearDown: helpers.destroyView
});