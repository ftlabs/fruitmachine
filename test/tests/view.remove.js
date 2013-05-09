
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
    var sandbox = document.createElement('div');
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ id: 'slot_1' });
    var inDOM;

    list
      .add(apple)
      .render()
      .setup()
      .inject(sandbox);

    assert(!!sandbox.querySelector('#' + apple._fmid));

    list.remove(apple);

    refute(!!sandbox.querySelector('#' + apple._fmid));
  },

  "Should *not* remove the child from the DOM if `fromDOM` option is false": function() {
    var sandbox = document.createElement('div');
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ id: 'slot_1' });
    var inDOM;

    list
      .add(apple)
      .render()
      .setup()
      .inject(sandbox);

    assert(sandbox.querySelector('#' + apple._fmid));

    list.remove(apple, { fromDOM: false });

    assert(sandbox.querySelector('#' + apple._fmid));
  },

  "Should remove itself if called with no arguments": function() {
    var list = new helpers.Views.Layout();
    var Apple = helpers.Views.Apple;
    var apple = new Apple({ id: 'foo' });

    list.add(apple);
    apple.remove();

    refute(~list.children.indexOf(apple));
    refute(list._ids.foo);
  },

  "Should remove slot reference": function() {
    var layout = new Layout();
    var apple = new Apple({ slot: 1 });

    layout.add(apple);

    assert.equals(layout._slots[1], apple);

    layout.remove(apple);

    refute(layout._slots[1]);
  }
});