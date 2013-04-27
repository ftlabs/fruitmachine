
buster.testCase('View#empty()', {

  "Should run destroy on each child": function() {
    var Apple = helpers.Views.Apple;
    var list = new helpers.Views.List();
    var apple1 = new Apple();
    var apple2 = new Apple();
    var destroy1 = this.spy(apple1, 'destroy');
    var destroy2 = this.spy(apple2, 'destroy');

    list
      .add(apple1)
      .add(apple2)
      .render()
      .setup();

    list.empty();

    assert.isTrue(destroy1.calledOnce);
    assert.isTrue(destroy2.calledOnce);
  },

  "Should remove elements from the DOM": function() {
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

    assert.isFalse(apple1.inDOM());
    assert.isFalse(apple2.inDOM());
  }
});