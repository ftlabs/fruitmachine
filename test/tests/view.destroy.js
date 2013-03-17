
buster.testCase('View#destroy()', {
  setUp: function() {
    helpers.createView.call(this);
    this.onTeardownSpy1 = this.spy(this.view, 'onTeardown');
    this.onTeardownSpy2 = this.spy(this.view.child('orange'), 'onTeardown');
    this.onDestroySpy1 = this.spy(this.view, 'onDestroy');
    this.onDestroySpy2 = this.spy(this.view.child('orange'), 'onDestroy');
  },

  "Should recurse.": function() {
    this.view
      .render()
      .inject(sandbox)
      .setup();

    this.view.destroy();

    assert.called(this.onDestroySpy1);
    assert.called(this.onDestroySpy2);
  },

  "Should call teardown.": function() {
    this.view
      .render()
      .inject(sandbox)
      .setup();

    this.view.destroy();

    assert.called(this.onTeardownSpy1);
    assert.called(this.onTeardownSpy2);
  },

  "Should remove only the first view element from the DOM.": function() {
    var apple = this.view;
    var orange = this.view.child('orange');
    var removeChildSpy1, removeChildSpy2;

    this.view
      .render()
      .inject(sandbox)
      .setup();

    removeChildSpy1 = this.spy(apple.el.parentNode, 'removeChild');
    removeChildSpy2 = this.spy(orange.el.parentNode, 'removeChild');

    this.view.destroy();

    assert.isTrue(removeChildSpy1.called);
    assert.isFalse(removeChildSpy2.called);

    removeChildSpy1.restore();
    removeChildSpy2.restore();
  },

  "Should fire `destroy` event.": function() {
    var eventSpy = this.spy(this.view, 'trigger');

    this.view
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    assert.isTrue(eventSpy.calledWith('destroy'));
  },

  "Should unbind all event listeners.": function() {
    var eventSpy = this.spy(this.view, 'off');

    this.view
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    assert.isTrue(eventSpy.called);
  },

  "Should flag the view as 'destroyed'.": function() {
    this.view
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    assert.isTrue(this.view.destroyed);
  },

  "Should unset primary properties.": function() {
    this.view
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    assert.equals(this.view.el, null);
    assert.equals(this.view.model, null);
    assert.equals(this.view.parent, null);
    assert.equals(this.view._module, null);
    assert.equals(this.view._id, null);
  },

  tearDown: function() {
    helpers.destroyView.call(this);
  }
});