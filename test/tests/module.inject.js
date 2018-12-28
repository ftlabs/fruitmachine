
describe('View#inject()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Should inject the view element into the given element.", function() {
    var sandbox = document.createElement('div');

    viewToTest
      .render()
      .inject(sandbox);

    expect(viewToTest.el).toBe(sandbox.firstElementChild);
  });

  afterEach(function() {
    helpers.emptySandbox();
    helpers.destroyView();
    viewToTest = null;
  });
});
