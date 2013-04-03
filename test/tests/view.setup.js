
buster.testCase('View#setup()', {
  setUp: function() {
    helpers.createView.call(this);

    this.spy1 = this.spy(this.view, 'onSetup');
    this.spy2 = this.spy(this.view.child('orange'), 'onSetup');
  },

  "Setup should recurse.": function() {
    this.view
      .render()
      .setup();

    assert.called(this.spy1);
    assert.called(this.spy2);
  },

  "Should not recurse if used with the `shallow` option.": function() {
    this.view
      .render()
      .setup({ shallow: true });

    assert.called(this.spy1);
    refute.called(this.spy2);
  },

  "Custom `onSetup` should be called over default": function() {
    var spy = this.spy(helpers.Views.Apple.prototype, 'onSetup');
    var apple = new helpers.Views.Apple();

    apple
      .render()
      .setup();

    assert.called(spy);
    spy.restore();
    refute.equals(FruitMachine.View.onSetup, apple.onSetup);
  },

  "Once setup, a View should be flagged as such.": function() {
    this.view
      .render()
      .setup();

    assert.isTrue(this.view.isSetup);
    assert.isTrue(this.view.child('orange').isSetup);
  },

  "View should not be setup if no root element is found.": function() {
    this.view
      .setup();

    // Check `onSetup` was not called
    refute.called(this.spy1);
    refute.called(this.spy2);

    // Check the view hasn't been flagged as setup
    refute.isTrue(this.view.isSetup);
    refute.isTrue(this.view.child('orange').isSetup);
  },

  "onTeardown should be called if `setup()` is called twice.": function() {
    var teardownSpy1 = this.spy(this.view, 'onTeardown');
    var teardownSpy2 = this.spy(this.view.child('orange'), 'onTeardown');

    //debugger;
    this.view
      .render()
      .inject(sandbox)
      .setup()
      .setup();

    assert.called(teardownSpy1);
    assert.called(teardownSpy2);
  },

  tearDown: function() {
    helpers.destroyView.call(this);
  }
});