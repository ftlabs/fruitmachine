
describe('View#_getEl()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Should return undefined if not rendered", function() {
    var el = viewToTest._getEl();
    expect(el).toBeUndefined();
  });

  test("Should return an element if rendered directly", function() {
    var el;
    viewToTest.render();
    el = viewToTest._getEl();
    expect(el).toBeDefined();
  });

  test("Should return the view element if the view was rendered indirectly", function() {
    var spy = jest.spyOn(fruitmachine.util, 'byId');
    var el;

    viewToTest.render();
    el = viewToTest.module('orange')._getEl();

    expect(el).toBeDefined();
    expect(spy).toHaveBeenCalled();

    fruitmachine.util.byId.mockRestore();
  });

  test("Should return a different element if parent is re-rendered in DOM", function() {
    var el1, el2;

    viewToTest
      .render()
      .inject(sandbox);

    el1 = viewToTest.module('orange')._getEl();
    viewToTest.render();
    el2 = viewToTest.module('orange')._getEl();

    expect(el1).not.toBe(el2);
  });

  test("Should return a different element if parent is re-rendered in memory", function() {
    var el1, el2;

    viewToTest.render();

    el1 = viewToTest.module('orange')._getEl();
    viewToTest.render();
    el2 = viewToTest.module('orange')._getEl();

    expect(el1).not.toBe(el2);
  });

  afterEach(function() {
    helpers.destroyView();
    viewToTest = null;
  });
});
