
describe('View#destroy()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Should recurse.", function() {
    var destroy = jest.spyOn(viewToTest, 'destroy');
    var destroy2 = jest.spyOn(viewToTest.module('orange'), 'destroy');

    viewToTest
      .render()
      .inject(sandbox)
      .setup();

    viewToTest.destroy();

    expect(destroy).toHaveBeenCalled();
    expect(destroy2).toHaveBeenCalled();
  });

  test("Should call teardown once per view.", function() {
    var teardown1 = jest.spyOn(viewToTest, 'teardown');
    var teardown2 = jest.spyOn(viewToTest.module('orange'), 'teardown');

    viewToTest
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    expect(teardown1).toHaveBeenCalledTimes(1)
    expect(teardown2).toHaveBeenCalledTimes(1)
  });

  test("Should remove only the first view element from the DOM.", function() {
    var layout = viewToTest;
    var orange = viewToTest.module('orange');

    layout
      .render()
      .inject(sandbox)
      .setup();

    var layoutRemoveChild = jest.spyOn(layout.el.parentNode, 'removeChild');
    var orangeRemoveChild = jest.spyOn(orange.el.parentNode, 'removeChild');

    viewToTest.destroy();

    expect(layoutRemoveChild).toHaveBeenCalledTimes(1)
    expect(orangeRemoveChild).toHaveBeenCalledTimes(0)

    layoutRemoveChild.mockRestore();
    orangeRemoveChild.mockRestore();
  });

  test("Should fire `destroy` event.", function() {
    var spy = jest.fn();

    viewToTest.on('destroy', spy);

    viewToTest
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    expect(spy).toHaveBeenCalled();
  });

  test("Should unbind all event listeners.", function() {
    var eventSpy = jest.spyOn(viewToTest, 'off');

    viewToTest
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    expect(eventSpy).toHaveBeenCalled();
  });

  test("Should flag the view as 'destroyed'.", function() {
    viewToTest
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    expect(viewToTest.destroyed).toBe(true);
  });

  test("Should unset primary properties.", function() {
    viewToTest
      .render()
      .inject(sandbox)
      .setup()
      .destroy();

    expect(viewToTest.el).toBeNull()
    expect(viewToTest.model).toBeNull()
    expect(viewToTest.parent).toBeNull()
    expect(viewToTest._id).toBeNull()
  });

  afterEach(function() {
    helpers.destroyView();
    viewToTest = null;
  });
});
