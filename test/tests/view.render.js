
buster.testCase('View#render()', {
  "setUp": helpers.createView,

  "The master view should have an element post render.": function() {
    this.view.render();
    assert.defined(this.view.el);
  },

  "Data should be present in the generated markup.": function() {
    var orange = this.view.child('orange');

    this.view
      .render()
      .inject(sandbox)
      .setup();

    assert.equals(orange.el.innerText, helpers.configs.orange.data.text);
  },

  "Child html should be present in the parent.": function() {
    var firtChild;

    this.view.render();
    firstChild = this.view.el.firstElementChild;
    assert.isTrue(firstChild.classList.contains('orange'));
  },

  "Should be of the tag specified": function() {
    var View = FruitMachine.module({
      module: 'orange',
      tag: 'ul'
    });

    var view = new View();
    view.render();

    assert.equals('UL', view.el.tagName);
  },

  "Should have classes on the element": function() {
    var View = FruitMachine.module({
      module: 'orange',
      tag: 'ul',
      classes: ['foo', 'bar']
    });

    var view = new View();
    view.render();

    assert.equals('orange foo bar', view.el.className);
  },

  "Should have and id attribute with the value of `fmid`": function() {
    var View = FruitMachine.module({
      module: 'orange'
    });

    var view = new View();
    view.render();

    assert.equals(view._fmid, view.el.id);
  },

  "tearDown": helpers.destroyView
});