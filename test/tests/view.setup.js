
buster.testCase('View#setup()', {
  setUp: function() {
    helpers.createView.call(this);


  },

  "Setup should recurse.": function() {
    var setup = this.spy(this.view.module('orange'), 'setup');

    this.view
      .render()
      .setup();

    assert.called(setup);
  },

  "Should not recurse if used with the `shallow` option.": function() {
    var setup = this.spy(this.view.module('orange'), 'setup');

    this.view
      .render()
      .setup({ shallow: true });

    refute.called(setup);
  },

  "Custom `setup` logic should be called": function() {
    var setup = this.spy(helpers.Views.Apple.prototype, 'setup');
    var apple = new helpers.Views.Apple();

    apple
      .render()
      .setup();

    assert.called(setup);
    setup.restore();
  },

  "Once setup, a View should be flagged as such.": function() {
    this.view
      .render()
      .setup();

    assert.isTrue(this.view.isSetup);
    assert.isTrue(this.view.module('orange').isSetup);
  },

  "Custom `setup` logic should not be run if no root element is found.": function() {
    var setup = this.spy(this.view, '_setup');
    var setup2 = this.spy(this.view.module('orange'), '_setup');

    this.view
      .setup();

    // Check `onSetup` was not called
    refute.called(setup);
    refute.called(setup2);

    // Check the view hasn't been flagged as setup
    refute.isTrue(this.view.isSetup);
    refute.isTrue(this.view.module('orange').isSetup);
  },

  "onTeardown should be called if `setup()` is called twice.": function() {
    var teardown = this.spy(this.view, 'teardown');
    var teardown2 = this.spy(this.view.module('orange'), 'teardown');

    //debugger;
    this.view
      .render()
      .inject(sandbox)
      .setup()
      .setup();

    assert.called(teardown);
    assert.called(teardown2);
  },

  tearDown: function() {
    helpers.destroyView.call(this);
  }
});