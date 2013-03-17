
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