
buster.testCase('View#render()', {
  "setUp": helpers.createView,

  "The master view should have an element post render.": function() {
    this.view.render();
    assert.defined(this.view.el);
  },

  "Data should be present in the generated markup.": function() {
    var orange = this.view.child('orange');

    this.view
      .render()
      .inject(sandbox)
      .setup();

    assert.equals(orange.el.innerText, orangeConfig.data.text);
  },

  "Child html should be present in the parent.": function() {
    var firtChild;

    this.view.render();
    firstChild = this.view.el.firstElementChild;
    assert.isTrue(firstChild.classList.contains('orange'));
  },

  "tearDown": helpers.destroyView
});