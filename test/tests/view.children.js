

buster.testCase('View#children()', {

  "Should return all children if no arguments given.": function() {
		var view = new FruitMachine(helpers.configs.fruityList);
    var children;

    view
      .add(helpers.configs.pear)
      .add(helpers.configs.pear);

    children = view.children();
    assert.equals(children.length, 2);
  },

  "Should return all children of the given module type.": function() {
		var view = new FruitMachine(helpers.configs.fruityList);
    var children;

    view
      .add(helpers.configs.pear)
      .add(helpers.configs.pear);

    children = view.children('pear');
    assert.equals(children.length, 2);
  }

});