var assert = buster.assertions.assert;
var refute = buster.assertions.refute;

buster.testCase('View#add()', {
  "setUp": function() {
    this.view = new helpers.Views.List();
  },

  "Should throw when adding undefined module": function() {
    var thrown;
    try {
      this.view.add({module: 'invalidFruit'});
    } catch(e) {
      assert.match(e.message, 'invalidFruit');
      thrown = true;
    }
    assert.isTrue(thrown);
  },

  "Should accept a View instance": function() {
    var pear = new helpers.Views.Pear();
    this.view.add(pear);
    assert.equals(this.view.children.length, 1);
  },

  "Should store a reference to the child via slot if the view added has a slot": function() {
    var apple = new Apple({ slot: 1 });
    var layout = new Layout();

    layout.add(apple);

    assert.equals(layout.slots[1], apple);
  },

  "Should aceept JSON": function() {
    this.view.add({ module: 'pear' });
    assert.equals(this.view.children.length, 1);
  },

  "Should allow the second parameter to define the slot": function() {
    var apple = new Apple();
    var layout = new Layout();

    layout.add(apple, 1);
    assert.equals(layout.slots[1], apple);
  },

  "Should be able to define the slot in the options object": function() {
    var apple = new Apple();
    var layout = new Layout();

    layout.add(apple, { slot: 1 });
    assert.equals(layout.slots[1], apple);
  },

  "Should remove a module if it already occupies this slot": function() {
    var apple = new Apple();
    var orange = new Orange();
    var layout = new Layout();

    layout.add(apple, 1);

    assert.equals(layout.slots[1], apple);

    layout.add(orange, 1);

    assert.equals(layout.slots[1], orange);
    refute(layout.module('apple'));
  },

  "Should remove the module if it already has parent before being added": function() {
    var apple = new Apple();
    var layout = new Layout();
    var spy = this.spy(apple, 'remove');

    layout.add(apple, 1);

    refute(spy.called);
    assert.equals(layout.slots[1], apple);

    layout.add(apple, 2);

    refute.equals(layout.slots[1], apple);
    assert.equals(layout.slots[2], apple);
    assert(spy.called);
  },

  "tearDown": function() {
    this.view = null;
  }
});
