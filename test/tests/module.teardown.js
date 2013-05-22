
buster.testCase('View#teardown()', {
  setUp: function() {
    helpers.createView.call(this);
  },

  "Teardown should recurse.": function() {
    var teardown1 = this.spy(this.view, 'teardown');
    var teardown2 = this.spy(this.view.module('orange'), 'teardown');

    this.view
      .render()
      .setup()
      .teardown();

    assert.called(teardown1);
    assert.called(teardown2);
  },

  "Should not recurse if used with the `shallow` option.": function() {
    var teardown1 = this.spy(this.view, 'teardown');
    var teardown2 = this.spy(this.view.module('orange'), 'teardown');
    var _teardown2 = this.spy(this.view.module('orange'), '_teardown');

    this.view
      .render()
      .setup()
      .teardown({ shallow: true });

    assert.called(teardown1);
    refute.called(teardown2);
    refute.called(_teardown2);
  },

  "Should not run custom teardown logic if the view has not been setup": function() {
    var teardown = this.spy(this.view, 'teardown');
    var _teardown = this.spy(this.view, '_teardown');

    this.view
      .render()
      .teardown();

    assert.called(teardown);
    refute.called(_teardown);
  },

  tearDown: function() {
    helpers.destroyView.call(this);
  }
});