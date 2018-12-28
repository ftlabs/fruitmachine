
describe('View#remove()', function() {

  test("Should remove the child passed from the parent's children array", function() {
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple1 = new Apple();
    var apple2 = new Apple();

    list
      .add(apple1)
      .add(apple2);

    list.remove(apple1);

    expect(list.children.indexOf(apple1)).toBe(-1);
  });

  test("Should remove all lookup references", function() {
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ id: 'foo' });

    list.add(apple);

    expect(list._ids.foo).toBeTruthy();
    expect(list._modules.apple[0]).toBe(apple);

    list.remove(apple);

    expect(list._ids.foo).toBeUndefined();
    expect(list._modules.apple[0]).toBeUndefined();
  });

  test("Should remove the child from the DOM by default", function() {
    var sandbox = helpers.createSandbox();
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ slot: 1 });

    list
      .add(apple)
      .render()
      .inject(sandbox)
      .setup();

    expect(sandbox.querySelector('#' + apple._fmid)).toBeTruthy();

    list.remove(apple);

    expect(sandbox.querySelector('#' + apple._fmid)).toBeFalsy();
  });

  test("Should *not* remove the child from the DOM if `fromDOM` option is false", function() {
    var sandbox = document.createElement('div');
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple();

    list
      .add(apple, 1)
      .render()
      .setup()
      .inject(sandbox);

    expect(sandbox.querySelector('#' + apple._fmid)).toBeTruthy();

    list.remove(apple, { fromDOM: false });

    expect(sandbox.querySelector('#' + apple._fmid)).toBeTruthy();
  });

  test("Should unmount the view by default", function() {
    var list = new Layout({
      children: {
        1: new Apple()
      }
    });

    var layoutSpy = jest.fn(); list.on('unmount', layoutSpy);
    var appleSpy = jest.fn(); list.module('apple').on('unmount', appleSpy);

    list.render().inject(sandbox).setup();
    list.remove();

    expect(layoutSpy).toBeCalled();
    expect(appleSpy).toBeCalled();
  });

  test("Should not unmount the view if `fromDOM` option is false", function() {
    var list = new Layout({
      children: {
        1: new Apple()
      }
    });

    var layoutSpy = jest.fn(); list.on('unmount', layoutSpy);
    var appleSpy = jest.fn(); list.module('apple').on('unmount', appleSpy);

    list.render().inject(sandbox).setup();
    list.remove({fromDOM: false});

    expect(layoutSpy).not.toBeCalled();
    expect(appleSpy).not.toBeCalled();
  });

  test("Should remove itself if called with no arguments", function() {
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ id: 'foo' });

    list.add(apple);
    apple.remove();

    expect(list.children.indexOf(apple)).toBe(-1);
    expect(list._ids.foo).toBeUndefined();
  });

  test("Should remove the reference back to the parent view", function() {
    var layout = new Layout();
    var apple = new Apple({ slot: 1 });

    layout.add(apple);

    expect(apple.parent).toBe(layout);

    layout.remove(apple);

    expect(apple.parent).toBeUndefined();
  });

  test("Should remove slot reference", function() {
    var layout = new Layout();
    var apple = new Apple({ slot: 1 });

    layout.add(apple);

    expect(layout.slots[1]).toBe(apple);

    layout.remove(apple);

    expect(layout.slots[1]).toBeUndefined();
  });

  test("Should not remove itself if first argument is undefined", function() {
    var layout = new Layout();
    var apple = new Apple({ slot: 1 });

    layout.add(apple);
    apple.remove(undefined);

    expect(layout.module('apple')).toBeTruthy();
  });
});
