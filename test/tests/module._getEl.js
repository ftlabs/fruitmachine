var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase('View#_getEl()', {
  "setUp": helpers.createView,

  "Should return undefined if not rendered": function() {
    var el = this.view._getEl();
    refute(el);
  },

  "Should return an element if rendered directly": function() {
    var el;
    this.view.render();
    el = this.view._getEl();
    assert.defined(el);
  },

  "Should return the view element if the view was rendered indirectly": function() {
    var spy = this.spy(fruitmachine.util, 'byId');
    var el;

    this.view.render();
    el = this.view.module('orange')._getEl();

    assert.defined(el);
    assert.called(spy);

    fruitmachine.util.byId.restore();
  },

  "Should return a different element if parent is re-rendered in DOM": function() {
    var el1, el2;

    this.view
      .render()
      .inject(sandbox);

    el1 = this.view.module('orange')._getEl();
    this.view.render();
    el2 = this.view.module('orange')._getEl();

    refute.equals(el1, el2);
  },

  "Should return a different element if parent is re-rendered in memory": function() {
    var el1, el2;

    this.view.render();

    el1 = this.view.module('orange')._getEl();
    this.view.render();
    el2 = this.view.module('orange')._getEl();

    refute.equals(el1, el2);
  },

  "tearDown": helpers.destroyView
});
