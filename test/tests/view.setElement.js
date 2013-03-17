
buster.testCase('View#setElement()', {
  "setUp": helpers.createView,

  "Should clear child element caches on `setElement`": function() {
    var el1, el2;

    this.view
      .render()
      .inject(sandbox);

    el1 = this.view.el;
    el2 = this.view.child('orange').getElement();

    // Re-render
    this.view.render();

    // Expect child views to no longer have an element
    assert.isFalse(!!this.view.child('orange').el);
  },

  "tearDown": helpers.destroyView
});