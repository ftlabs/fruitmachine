
buster.testCase('View#modules()', {
  setUp: function() {
    var layout = new Layout({});
    var apple = new Apple({ id: 'slot_1' });
    var orange = new Orange({ id: 'slot_2' });
    var pear = new Pear({ id: 'slot_3' });

    layout
      .add(apple)
      .add(orange)
      .add(pear);

    this.view = layout;
  },

  "Should return all descendant views matching the given module type": function() {
    var oranges = this.view.modules('orange');
    var pears = this.view.modules('pear');

    assert.equals(oranges.length, 1);
    assert.equals(pears.length, 1);
  },

  "Should return multiple views if they exist": function() {
    this.view
      .add({ module: 'pear' });

    var pears = this.view.modules('pear');

    assert.equals(pears.length, 2);
  },

  tearDown: helpers.destroyView
});