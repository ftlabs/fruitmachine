
buster.testCase('View#id()', {
  "setUp": helpers.createView,

  "Should return a child by id.": function() {
    var child = this.view.id('my_child_module');
    assert.defined(child);
  },

  "Should the view's own id if no arguments given.": function() {
    var id = 'a_view_id';
    var view = new FruitMachine({ id: id });
    assert.equals(view.id(), id);
  },

  "tearDown": helpers.tearDown
});