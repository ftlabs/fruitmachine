
buster.testCase('View#teardown()', {
  setUp: function() {
    helpers.createView.call(this);
    this.spy1 = this.spy(this.view, 'onTeardown');
    this.spy2 = this.spy(this.view.child('orange'), 'onTeardown');
  },

  "Teardown should recurse.": function() {
    this.view
      .render()
      .setup()
      .teardown();

    assert.called(this.spy1);
    assert.called(this.spy2);
  },

  "Should not recurse if used with the `shallow` option.": function() {
    this.view
      .render()
      .setup()
      .teardown({ shallow: true });

    assert.called(this.spy1);
    refute.called(this.spy2);
  },

  "Should not run if the view has not been setup": function() {
    this.view
      .render()
      .teardown();

    refute.called(this.spy1);
    refute.called(this.spy2);
  },

  tearDown: function() {
    helpers.destroyView.call(this);
  }
});