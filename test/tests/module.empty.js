
describe('View#empty()', function() {
  test("Should run destroy on each child", function() {
    var Apple = helpers.Views.Apple;
    var list = new helpers.Views.List();
    var apple1 = new Apple();
    var apple2 = new Apple();
    var destroy1 = jest.spyOn(apple1, 'destroy');
    var destroy2 = jest.spyOn(apple2, 'destroy');

    list
      .add(apple1)
      .add(apple2)
      .render()
      .setup();

    list.empty();

    expect(destroy1).toHaveBeenCalledTimes(1);
    expect(destroy2).toHaveBeenCalledTimes(1);
  });

  test("Should remove elements from the DOM", function() {
    var Apple = helpers.Views.Apple;
    var list = new helpers.Views.List();
    var apple1 = new Apple();
    var apple2 = new Apple();

    list
      .add(apple1)
      .add(apple2)
      .render()
      .inject(helpers.sandbox)
      .setup();

    list.empty();

    expect(list.el.querySelector('apple')).toBeNull();
  });
});
