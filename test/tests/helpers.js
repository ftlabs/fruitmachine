buster.testCase('FruitMachine#helpers()', {
  setUp: function() {
    this.spys = {
      initialize: this.spy(helpers.helpers.example, 'initialize'),
      setup: this.spy(helpers.helpers.example, 'setup'),
      teardown: this.spy(helpers.helpers.example, 'teardown'),
      destroy: this.spy(helpers.helpers.example, 'destroy')
    };

    // Register helper
    FruitMachine.helper('example', helpers.helpers.example.main);

    this.view = new FruitMachine({
      module: 'apple',
      helpers: ['example']
    });
  },

  "helper `initialize` should have been called": function() {
    assert.called(this.spys.initialize);
  },

  "helper `setup` should have been called": function() {

    this.view
      .render()
      .inject(sandbox)
      .setup();

    assert.called(this.spys.setup);
  },

  "helper `teardown` and `destroy` should have been called": function() {

    this.view
      .render()
      .inject(sandbox)
      .setup()
      .teardown()
      .destroy();

    assert.called(this.spys.teardown);
    assert.called(this.spys.destroy);
  },

  "Should be able to pass functions into `helpers` array if helper hasn't been defined": function() {
    var spy = this.spy();
    var view = new helpers.Apple({
      helpers: [
        function(view) {
          view.on('initialize', spy);
        }
      ]
    });

    assert.called(spy);
  },

  tearDown: function() {
    this.view.destroy();

    this.spys.initialize.restore();
    this.spys.setup.restore();
    this.spys.teardown.restore();
    this.spys.destroy.restore();

    FruitMachine.helper.clear('example');
    FruitMachine.module.clear('apple');
  }
});