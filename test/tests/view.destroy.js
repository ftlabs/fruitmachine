
buster.testCase('View#destroy()', {
  setUp: function() {
    helpers.createView.call(this);
  },

  "Should recurse.": function() {
    var destroy = this.spy(this.view, 'destroy');
    var destroy2 = this.spy(this.view.module('orange'), 'destroy');

    this.view
      .render()
      .inject(sandbox)
      .setup();

    this.view.destroy();

    assert.called(destroy2);
  },

  "Should call teardown once per view.": function() {
    var teardown1 = this.spy(this.view, 'teardown');
    var teardown2 = this.spy(this.view.module('orange'), 'teardown');

    this.view
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    assert(teardown1.calledOnce);
    assert(teardown2.calledOnce);
  },

  "Should remove only the first view element from the DOM.": function() {
    var layout = this.view;
    var orange = this.view.module('orange');

    layout
      .render()
      .inject(sandbox)
      .setup();

    var layoutRemoveChild = this.spy(layout.el.parentNode, 'removeChild');
    var orangeRemoveChild = this.spy(orange.el.parentNode, 'removeChild');

    this.view.destroy();

    assert(layoutRemoveChild.called);
    refute(orangeRemoveChild.called);

    layoutRemoveChild.restore();
    orangeRemoveChild.restore();
  },

  "Should fire `destroy` event.": function() {
    var spy = this.spy();

    this.view.on('destroy', spy);

    this.view
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    assert(spy.called);
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