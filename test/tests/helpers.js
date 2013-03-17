buster.testCase('FruitMachine#helpers()', {
  setUp: function() {

    // Register helper
    FruitMachine.helper('example', function(view) {

      view.on('initialize', function() {
        view.exampleHelper = {};
        view.exampleHelper.initialize = true;
      });

      view.on('setup', function() {
        view.exampleHelper.setup = true;
      });

      view.on('teardown', function() {
        view.exampleHelper.teardown = true;
      });

      view.on('destroy', function() {
        view.exampleHelper.destroy = true;
      });
    });

    // Define module
    FruitMachine.module('apple', {
      helpers: ['example']
    });

    // Create view
    this.view = new FruitMachine({
      module: 'apple'
    });
  },

  "helper should be present on the view": function() {
    assert.defined(this.view.exampleHelper);
  },

  "helper `initialize` should have been called": function() {
    assert.isTrue(this.view.exampleHelper.initialize);
  },

  "helper `setup` should have been called": function() {
    this.view
      .render()
      .inject(sandbox)
      .setup();

    assert.isTrue(this.view.exampleHelper.setup);
  },

  "helper `teardown` and `destroy` should have been called": function() {
    this.view
      .render()
      .inject(sandbox)
      .setup()
      .teardown()
      .destroy();

    assert.isTrue(this.view.exampleHelper.teardown);
    assert.isTrue(this.view.exampleHelper.destroy);
  },

  tearDown: function() {
    this.view.destroy();
    FruitMachine.helper.remove('example');
    FruitMachine.module.clear('apple');
  }
});