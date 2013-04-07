
buster.testCase('View#module()', {
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

	"Should return module type if no arguments given": function() {
    assert.equals(this.view.module(), 'layout');
  },

  "Should return the first child module with the specified type.": function() {
    var child = this.view.module('pear');

    assert.equals(child.id(), 'slot_3');
  },

  "If there is more than one child of this module type, only the first is returned.": function() {

    this.view
      .add({ module: 'apple' });

    var child = this.view.module('apple');
    var firstChild = this.view.children[0];
    var lastChild = this.view.children[this.view.children.length-1];

    assert.equals(child, firstChild);
    refute.equals(child, lastChild);
  }
});