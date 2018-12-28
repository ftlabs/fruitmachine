
describe('View#toHTML()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Should return a string", function() {
    var html = viewToTest.toHTML();
    expect('string' === typeof html).toBe(true);
  });

  test("Should fire `before tohtml event`", function() {
    var spy = jest.fn();
    viewToTest.on('before tohtml', spy);
    var html = viewToTest.toHTML();
    expect('string' === typeof html).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  test("Should print the child html into the corresponding slot", function() {
    var apple = new Apple({ slot: 1 });
    var layout = new Layout({
      children: [apple]
    });

    var appleHtml = apple.toHTML();
    var layoutHtml = layout.toHTML();

    expect(layoutHtml.indexOf(appleHtml)).toBeGreaterThan(-1);
  });

  test("Should print the child html by id if no slot is found (backwards compatable)", function() {
    var apple = new Apple({ id: 1 });
    var layout = new Layout({
      children: [apple]
    });

    var appleHtml = apple.toHTML();
    var layoutHtml = layout.toHTML();

    expect(layoutHtml.indexOf(appleHtml)).toBeGreaterThan(-1);
  });

  test("Should fallback to printing children by id if no slot is present", function() {
    var layout = new Layout({
      children: [
        {
          module: 'apple',
          id: 1
        }
      ]
    });

    layout.render();

    expect(layout.el.innerHTML.indexOf('apple')).toBeGreaterThan(-1);
  });

  afterEach(function() {
    helpers.destroyView();
    viewToTest = null;
  });
});
