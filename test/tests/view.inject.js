
buster.testCase('View#inject()', {
  "Should inject the view element into the given element.": function() {
    var view = new FruitMachine(helpers.configs.apple);

    view
      .render()
      .inject(sandbox);

    assert.equals(view.el, sandbox.firstElementChild);
  },

  "tearDown": function() {
    helpers.sandbox.empty();
  }
});