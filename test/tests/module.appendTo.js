
describe('View#appendTo()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Should return the view for a fluent interface.", function() {
    var sandbox = document.createElement('div'),
        sandbox2 = document.createElement('div'),
        existing = document.createElement('div');

    sandbox2.appendChild(existing);

    expect(viewToTest.render().appendTo(sandbox)).toBe(viewToTest);
    expect(viewToTest.render().insertBefore(sandbox2, existing)).toBe(viewToTest);
  });

  test("Should append the view element as a child of the given element.", function() {
    var sandbox = document.createElement('div');

    viewToTest
      .render()
      .appendTo(sandbox);

    expect(viewToTest.el).toBe(sandbox.firstElementChild);
  });

  test("Should not destroy existing element contents.", function() {
    var sandbox = document.createElement('div'),
        existing = document.createElement('div');

    sandbox.appendChild(existing);

    viewToTest
      .render()
      .appendTo(sandbox);

    expect(existing).toBe(sandbox.firstElementChild);
    expect(viewToTest.el).toBe(sandbox.lastElementChild);
  });

  test("Should insert before specified element.", function() {
    var sandbox = document.createElement('div'),
        existing1 = document.createElement('div'),
        existing2 = document.createElement('div');

    sandbox.appendChild(existing1);
    sandbox.appendChild(existing2);

    viewToTest
      .render()
      .insertBefore(sandbox, existing2);

    expect(existing1).toBe(sandbox.firstElementChild);
    expect(viewToTest.el).toBe(existing1.nextSibling);
    expect(existing2).toBe(viewToTest.el.nextSibling);
  });

  afterEach(function() {
    helpers.emptySandbox();
    helpers.destroyView();
    viewToTest = null;
  });
});
