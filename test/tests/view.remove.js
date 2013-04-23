
buster.testCase('View#remove()', {

  "Should remove the child passed from the parent's children array": function() {
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple1 = new Apple();
    var apple2 = new Apple();

    list
      .add(apple1)
      .add(apple2);

    list.remove(apple1);

    assert(!~list.children.indexOf(apple1));
  },

  "Should remove all lookup references": function() {
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ id: 'foo' });

    list.add(apple);

    assert(list._ids.foo);
    assert.equals(list._modules.apple[0], apple);

    list.remove(apple);

    refute(list._ids.foo);
    refute(list._modules.apple[0]);
  },

  "Should remove the child from the DOM by default": function() {
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ id: 'slot_1' });
    var inDOM;

    list
      .add(apple)
      .render()
      .setup()
      .inject(helpers.sandbox);

    assert(!!document.getElementById(apple._fmid));

    list.remove(apple);

    refute(!!document.getElementById(apple._fmid));
  },

  "Should *not* remove the child from the DOM if `fromDOM` option is false": function() {
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ id: 'slot_1' });
    var inDOM;

    list
      .add(apple)
      .render()
      .setup()
      .inject(helpers.sandbox);

    assert(document.getElementById(apple._fmid));

    list.remove(apple, { fromDOM: false });

    assert(document.getElementById(apple._fmid));
  },

  "Should remove itself if called with no arguments": function() {
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ id: 'foo' });

    list.add(apple);
    apple.remove();

    refute(~list.children.indexOf(apple));
    refute(list._ids.foo);
  }
});