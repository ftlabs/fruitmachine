
buster.testCase('View#modules()', {
  setUp: helpers.createView,

  "Should return module type if no arguments given": function() {
    assert.equals(this.view.module(), 'apple');
  },

  "Should return all descendant views matching the given module type": function() {
    var oranges = this.view.modules('orange');
    var pears = this.view.modules('pear');

    assert.equals(oranges.length, 1);
    assert.equals(pears.length, 1);
  },

  "Should return multiple views if they exist": function() {
    var oranges;

    this.view.add(helpers.config.orange);
    oranges = this.view.modules('orange');

    assert.equals(oranges.length, 2);
  },

  tearDown: helpers.destroyView
});