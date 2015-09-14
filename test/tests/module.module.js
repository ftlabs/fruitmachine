var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase('View#module()', {
  setUp: function() {
    var layout = new Layout({});
    var apple = new Apple({ slot: 1 });
    var orange = new Orange({ slot: 2 });
    var pear = new Pear({ slot: 3 });

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

    assert.equals(child, this.view.children[2]);
  },

  "If there is more than one child of this module type, only the first is returned.": function() {
    this.view
      .add({ module: 'apple' });

    var child = this.view.module('apple');
    var firstChild = this.view.children[0];
    var lastChild = this.view.children[this.view.children.length-1];

    assert.equals(child, firstChild);
    refute.equals(child, lastChild);
  },

  "Should return the module name if defined with the name key": function() {
    var Henry = fruitmachine.define({ name: 'henry' });
    var henry = new Henry();

    assert.equals(henry.module(), 'henry');
    assert.equals(henry.name, 'henry');
  },

  "Should walk down the fruitmachine tree, recursively": function() {
    var Elizabeth = fruitmachine.define({ name: 'elizabeth' });
    var elizabeth = new Elizabeth();
    this.view.module('apple').add(elizabeth);

    var elizabethInstance = this.view.module('elizabeth');
    assert.equals(elizabethInstance.module(), 'elizabeth');
    assert.equals(elizabethInstance.name, 'elizabeth');
  },

  "Regression Test: Should still recurse even if the root view used to have a module of the same type": function() {
    var pear = this.view.module('pear').remove();
    this.view.module('apple').add(pear);

    var pearInstance = this.view.module('pear');
    assert.equals(pearInstance.module(), 'pear');
    assert.equals(pearInstance.name, 'pear');
  }
});
