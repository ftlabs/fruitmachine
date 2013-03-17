
buster.testCase('View#add()', {
  "setUp": function() {
    this.view = new FruitMachine(helpers.configs.fruityList);
  },

  "Should add a View instance as a child.": function() {
    var pear = new FruitMachine(helpers.configs.pear);

    this.view.add(pear);

    assert.equals(this.view.children().length, 1);
  },

  "Should add a JSON config as a child.": function() {
    this.view.add(helpers.configs.pear);
    assert.equals(this.view.children().length, 1);
  },

  "tearDown": function() {
    this.view = null;
  }
});