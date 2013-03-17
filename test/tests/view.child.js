
buster.testCase('View#child()', {
  "Should return the first direct child that matches the module type": function() {
    var view = new FruitMachine(helpers.configs.orange);
    var child;

    view.add(helpers.configs.pear);
    child = view.child('pear');

    assert.equals(child.module(), 'pear');
  },

  "If there is more than one child of this module type, only the first is returned.": function() {
    var view = new FruitMachine(helpers.configs.orange);
    var child, firstChild;

    view
      .add(helpers.configs.pear)
      .add(helpers.configs.pear);

    child = view.child('pear');
    firstChild = view.children()[0];

    assert.equals(child, firstChild);
  }

});