
buster.testCase('View#id()', {
  setUp: helpers.createView,

  "Should return a child by id.": function() {
    var child = this.view.id('slot_1');
    assert.defined(child);
  },

  "Should return the view's own id if no arguments given.": function() {
    var id = 'a_view_id';
    var view = new FruitMachine.View({ id: id });
    assert.equals(view.id(), id);
  },

  tearDown: helpers.tearDown
});