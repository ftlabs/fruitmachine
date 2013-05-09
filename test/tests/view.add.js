
buster.testCase('View#add()', {
  "setUp": function() {
    this.view = new helpers.Views.List();
  },

  "Should add a View instance as a child.": function() {
    var pear = new helpers.Views.Pear();
    this.view.add(pear);
    assert.equals(this.view.children.length, 1);
  },

  "Should store a reference to the child via slot if the view added has a slot": function() {
    var apple = new Apple({ slot: 1 });
    var layout = new Layout();

    layout.add(apple);

    assert.equals(layout._slots[1], apple);
  },

  "Should add a JSON config as a child.": function() {
    this.view.add({ module: 'pear' });
    assert.equals(this.view.children.length, 1);
  },

  "Should accept an array": function() {
    this.view.add([{ module: 'pear' }, { module: 'pear' }]);
    assert.equals(this.view.children.length, 2);
  },

  "tearDown": function() {
    this.view = null;
  }
});