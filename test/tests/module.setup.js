
describe('View#setup()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Setup should recurse.", function() {
    var setup = jest.spyOn(viewToTest.module('orange'), 'setup');

    viewToTest
      .render()
      .setup();

    expect(setup).toHaveBeenCalled();
  });

  test("Should not recurse if used with the `shallow` option.", function() {
    var setup = jest.spyOn(viewToTest.module('orange'), 'setup');

    viewToTest
      .render()
      .setup({ shallow: true });

    expect(setup).not.toHaveBeenCalled();
  });

  test("Custom `setup` logic should be called", function() {
    var setup = jest.spyOn(helpers.Views.Apple.prototype, 'setup');
    var apple = new helpers.Views.Apple();

    apple
      .render()
      .setup();

    expect(setup).toHaveBeenCalled();
    setup.mockReset();
  });

  test("Once setup, a View should be flagged as such.", function() {
    viewToTest
      .render()
      .setup();

    expect(viewToTest.isSetup).toBe(true);
    expect(viewToTest.module('orange').isSetup).toBe(true);
  });

  test("Custom `setup` logic should not be run if no root element is found.", function() {
    var setup = jest.spyOn(viewToTest, '_setup');
    var setup2 = jest.spyOn(viewToTest.module('orange'), '_setup');

    viewToTest
      .setup();

    // Check `onSetup` was not called
    expect(setup).not.toHaveBeenCalled();
    expect(setup2).not.toHaveBeenCalled();

    // Check the view hasn't been flagged as setup
    expect(viewToTest.isSetup).not.toBe(true);
    expect(viewToTest.module('orange').isSetup).not.toBe(true);
  });

  test("onTeardown should be called if `setup()` is called twice.", function() {
    var teardown = jest.spyOn(viewToTest, 'teardown');
    var teardown2 = jest.spyOn(viewToTest.module('orange'), 'teardown');

    //debugger;
    viewToTest
      .render()
      .inject(sandbox)
      .setup()
      .setup();

    expect(teardown).toHaveBeenCalled();
    expect(teardown2).toHaveBeenCalled();
  });

  afterEach(function() {
    helpers.destroyView();
    viewToTest = null;
  });
});
