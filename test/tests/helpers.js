
describe('fruitmachine#helpers()', function() {
  var testHelper;

  beforeEach(function() {
    testHelper = function(view) {
      view.on('before initialize', testHelper.beforeInitialize);
      view.on('initialize', testHelper.initialize);
      view.on('setup', testHelper.setup);
      view.on('teardown', testHelper.teardown);
      view.on('destroy', testHelper.destroy);
    };

    testHelper.beforeInitialize = jest.fn();
    testHelper.initialize = jest.fn();
    testHelper.setup = jest.fn();
    testHelper.teardown = jest.fn();
    testHelper.destroy = jest.fn();
  });

  test("helpers `before initialize` and `initialize` should have been called, in that order", function() {
    var view = fruitmachine({
      module: 'apple',
      helpers: [testHelper]
    });

    expect(testHelper.initialize).toHaveBeenCalled();
    expect(testHelper.beforeInitialize).toHaveBeenCalled();
    expect(testHelper.initialize.mock.invocationCallOrder).toEqual([2]);
    expect(testHelper.beforeInitialize.mock.invocationCallOrder).toEqual([1]);
    expect(testHelper.setup).toHaveBeenCalledTimes(0);
    expect(testHelper.teardown).toHaveBeenCalledTimes(0);
    expect(testHelper.destroy).toHaveBeenCalledTimes(0);
  });

  test("helper `setup` should have been called", function() {
    var view = fruitmachine({
      module: 'apple',
      helpers: [testHelper]
    });

    expect(testHelper.setup).toHaveBeenCalledTimes(0);

    view
      .render()
      .inject(sandbox)
      .setup();

    expect(testHelper.setup).toHaveBeenCalledTimes(1);
  });

  test("helper `teardown` and `destroy` should have been called", function() {
    var view = fruitmachine({
      module: 'apple',
      helpers: [testHelper]
    });

    view
      .render()
      .inject(sandbox)
      .setup()
      .teardown()
      .destroy();

    expect(testHelper.teardown).toHaveBeenCalled();
    expect(testHelper.destroy).toHaveBeenCalled();
  });
});
