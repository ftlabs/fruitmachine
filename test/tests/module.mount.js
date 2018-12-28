
describe('View#mount()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Should give a view an element", function() {
    var el = document.createElement('div');
    viewToTest.mount(el);

    expect(viewToTest.el).toBe(el);
  });

  test("Should be called when the view is rendered", function() {
    var mount = jest.spyOn(viewToTest, 'mount');
    viewToTest.render();
    expect(mount).toHaveBeenCalled();
  });

  test("Should be called on a child when its parent is rendered", function() {
    var mount = jest.spyOn(viewToTest.module('apple'), 'mount');
    viewToTest.render();
    expect(mount).toHaveBeenCalled();
  });

  test("Should be called on a child when its parent is rerendered", function() {
    var mount = jest.spyOn(viewToTest.module('apple'), 'mount');
    viewToTest.render();
    viewToTest.render();
    expect(mount).toHaveBeenCalledTimes(2);
  });

  test("Should call custom mount logic", function() {
    var mount = jest.fn();

    var Module = fruitmachine.define({
      name: 'module',
      template: function() {
        return 'hello';
      },

      mount: mount
    });

    var m = new Module();
    m.render();

    expect(mount).toHaveBeenCalled();
  });

  test("Should be a good place to attach event handlers that don't get trashed on parent rerender", function() {
    var handler = jest.fn();

    var Module = fruitmachine.define({
      name: 'module',
      tag: 'button',
      template: function() {
        return 'hello';
      },

      mount: function() {
        this.el.addEventListener('click', handler);
      }
    });

    var m = new Module();

    var layout = new Layout({
      children: {
        1: m
      }
    });

    layout.render();
    m.el.click();

    expect(handler).toHaveBeenCalledTimes(1);

    layout.render();
    m.el.click();

    expect(handler).toHaveBeenCalledTimes(2);
  });

  test("before mount and mount events should be fired", function() {
    var beforeMountSpy = jest.fn();
    var mountSpy = jest.fn();
    viewToTest.on('before mount', beforeMountSpy);
    viewToTest.on('mount', mountSpy);

    viewToTest.render();
    expect(beforeMountSpy.mock.invocationCallOrder[0]).toBeLessThan(mountSpy.mock.invocationCallOrder[0]);
  });

  test("Should only fire events if the element is new", function() {
    var mountSpy = jest.fn();
    viewToTest.on('mount', mountSpy);

    viewToTest.render();
    viewToTest._getEl();
    expect(mountSpy).toHaveBeenCalledTimes(1)
  });

  afterEach(function() {
    helpers.destroyView();
    viewToTest = null;
  });
});
