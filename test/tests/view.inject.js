
buster.testCase('View#inject()', {
  setUp: helpers.createView,

  "Should inject the view element into the given element.": function() {

    this.view
      .render()
      .inject(sandbox);

    assert.equals(this.view.el, helpers.sandbox.firstElementChild);
  },

  tearDown: function() {
    helpers.emptySandbox();
    helpers.destroyView.call(this);
  }
});