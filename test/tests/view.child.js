
buster.testCase('View#child()', {
  "Should return the first child module with the specified type.": function() {
    var view = new FruitMachine(helpers.configs.orange);
    var child;

    view.add(pearConfig);
    child = view.child('pear');

    assert.equals(child.module, 'pear');
  },

  "If there is more than one child of this module type, only the first is returned.": function() {
    var view = new FruitMachine(helpers.configs.orange);
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

    view.add(helpers.configs.orange);
    child = view.child('my_child_module');
    firstChild = view.children()[0];
    assert.equals(child, firstChild);
  }
});