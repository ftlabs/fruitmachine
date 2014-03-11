
buster.testCase('View#appendTo()', {
  setUp: helpers.createView,

  "Should append the view element as a child of the given element.": function() {
    var sandbox = document.createElement('div');

    this.view
      .render()
      .appendTo(sandbox);

    assert.equals(this.view.el, sandbox.firstElementChild);
  },

  "Should not destroy existing element contents.": function() {
    var sandbox = document.createElement('div'),
        existing = document.createElement('div');

    sandbox.appendChild(existing);

    this.view
      .render()
      .appendTo(sandbox);

    assert.equals(existing, sandbox.firstElementChild);
    assert.equals(this.view.el, sandbox.lastElementChild);
  },

  "Should insert before specified element.": function() {
    var sandbox = document.createElement('div'),
        existing1 = document.createElement('div'),
        existing2 = document.createElement('div');

    sandbox.appendChild(existing1);
    sandbox.appendChild(existing2);

    this.view
      .render()
      .insertBefore(sandbox, existing2);

    assert.equals(existing1, sandbox.firstElementChild);
    assert.equals(this.view.el, existing1.nextSibling);
    assert.equals(existing2, this.view.el.nextSibling);
  },

  tearDown: function() {
    helpers.emptySandbox();
    helpers.destroyView.call(this);
  }
});