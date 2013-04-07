
buster.testCase('View#toHTML()', {
  "setUp": helpers.createView,

  "Should return a string": function() {
    var html = this.view.toHTML();
    assert.isTrue('string' === typeof html);
  },

  "Should use cache if available": function() {
    var spy = this.spy(this.view.module('orange'), 'toHTML');

    this.view.toHTML();
    this.view.toHTML();

    assert.isTrue(spy.calledOnce);
  },

  "tearDown": helpers.destroyView
});