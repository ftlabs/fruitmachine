
describe('View#teardown()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Teardown should recurse.", function() {
    var teardown1 = jest.spyOn(viewToTest, 'teardown');
    var teardown2 = jest.spyOn(viewToTest.module('orange'), 'teardown');

    viewToTest
      .render()
      .setup()
      .teardown();

    expect(teardown1).toHaveBeenCalled();
    expect(teardown2).toHaveBeenCalled();
  });

  test("Should not recurse if used with the `shallow` option.", function() {
    var teardown1 = jest.spyOn(viewToTest, 'teardown');
    var teardown2 = jest.spyOn(viewToTest.module('orange'), 'teardown');
    var _teardown2 = jest.spyOn(viewToTest.module('orange'), '_teardown');

    viewToTest
      .render()
      .setup()
      .teardown({ shallow: true });

    expect(teardown1).toHaveBeenCalled();
    expect(teardown2).not.toHaveBeenCalled();
    expect(_teardown2).not.toHaveBeenCalled();
  });

  test("Should not run custom teardown logic if the view has not been setup", function() {
    var teardown = jest.spyOn(viewToTest, 'teardown');
    var _teardown = jest.spyOn(viewToTest, '_teardown');

    viewToTest
      .render()
      .teardown();

    expect(teardown).toHaveBeenCalled();
    expect(_teardown).not.toHaveBeenCalled();
  });

  afterEach(function() {
    helpers.destroyView();
    viewToTest = null;
  });
});
