var assert = buster.referee.assert;

buster.testCase('fruitmachine#helpers()', {
  setUp: function() {
    var helper = this.helper = function(view) {
      view.on('before initialize', helper.beforeInitialize);
      view.on('initialize', helper.initialize);
      view.on('setup', helper.setup);
      view.on('teardown', helper.teardown);
      view.on('destroy', helper.destroy);
    };

    helper.beforeInitialize = function() {};
    helper.initialize = function() {};
    helper.setup = function() {};
    helper.teardown = function() {};
    helper.destroy = function() {};

    this.spys = {
      beforeInitialize: this.spy(this.helper, 'beforeInitialize'),
      initialize: this.spy(this.helper, 'initialize'),
      setup: this.spy(this.helper, 'setup'),
      teardown: this.spy(this.helper, 'teardown'),
      destroy: this.spy(this.helper, 'destroy')
    };
  },

  "helpers `before initialize` and `initialize` should have been called, in that order": function() {
    var view = fruitmachine({
      module: 'apple',
      helpers: [this.helper]
    });

    assert.isTrue(this.spys.initialize.called);
    assert.isTrue(this.spys.beforeInitialize.called);
    assert.callOrder(this.spys.beforeInitialize, this.spys.initialize);
  },

  "helper `setup` should have been called": function() {
    var view = fruitmachine({
      module: 'apple',
      helpers: [this.helper]
    });

    view
      .render()
      .inject(sandbox)
      .setup();

    assert.called(this.spys.setup);
  },

  "helper `teardown` and `destroy` should have been called": function() {
    var view = fruitmachine({
      module: 'apple',
      helpers: [this.helper]
    });

    view
      .render()
      .inject(sandbox)
      .setup()
      .teardown()
      .destroy();

    assert.called(this.spys.teardown);
    assert.called(this.spys.destroy);
  },

  tearDown: function() {
    this.spys.initialize.restore();
    this.spys.setup.restore();
    this.spys.teardown.restore();
    this.spys.destroy.restore();
  }
});
