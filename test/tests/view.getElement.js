
buster.testCase('View#getElement()', {
  "setUp": helpers.createView,

  "Should return undefined if not rendered": function() {
    var el = this.view.getElement();
    refute.defined(el);
  },

  "Should return an element if rendered directly": function() {
    var el;
    this.view.render();
    el = this.view.getElement();
    assert.defined(el);
  },

  "Should not run querySelector if the view has no parent view": function() {
    var spy = this.spy(fruitmachine.util, 'querySelectorId');
    var el;

    this.view.render();
    el = this.view.getElement();

    assert.isFalse(spy.called);

    fruitmachine.util.querySelectorId.restore();
  },

  "Should return the view element if the view was rendered indirectly": function() {
    var spy = this.spy(fruitmachine.util, 'querySelectorId');
    var el;

    this.view.render();
    el = this.view.module('orange').getElement();

    assert.defined(el);
    assert.called(spy);

    fruitmachine.util.querySelectorId.restore();
  },

  "Should find element in the DOM if injected": function() {
    var spy1 = this.spy(document, 'getElementById');
    var spy2 = this.spy(fruitmachine.util, 'querySelectorId');
    var el1, el2;

    this.view
      .render()
      .inject(sandbox);

    el1 = this.view.el;
    el2 = this.view.module('orange').getElement();

    // Check both elements are defined
    assert.defined(el1);
    assert.defined(el2);

    // el2 should have been retrieved from the DOM
    assert.isTrue(spy1.calledOnce);

    // querySelector should not have been used
    refute.called(spy2);

    // Restore spys
    document.getElementById.restore();
    fruitmachine.util.querySelectorId.restore();
    helpers.emptySandbox();
  },

  "Should return a different element if parent is re-rendered in DOM": function() {
    var el1, el2;

    this.view
      .render()
      .inject(sandbox);

    el1 = this.view.module('orange').getElement();
    this.view.render();
    el2 = this.view.module('orange').getElement();

    refute.equals(el1, el2);
  },

  "Should return a different element if parent is re-rendered in memory": function() {
    var el1, el2;

    this.view.render();

    el1 = this.view.module('orange').getElement();
    this.view.render();
    el2 = this.view.module('orange').getElement();

    refute.equals(el1, el2);
  },

  "tearDown": helpers.destroyView
});