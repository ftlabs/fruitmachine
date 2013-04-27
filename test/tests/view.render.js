
buster.testCase('View#render()', {
  setUp: helpers.createView,

  "The master view should have an element post render.": function() {
    this.view.render();
    assert.defined(this.view.el);
  },

  "Data should be present in the generated markup.": function() {
    var text = 'some orange text';
    var orange = new helpers.Views.Orange({
      model: {
        text: text
      }
    });

    orange
      .render()
      .inject(sandbox);

    assert.equals(orange.el.innerText, text);
  },

  "Child html should be present in the parent.": function() {
    var layout = new helpers.Views.Layout();
    var apple = new helpers.Views.Apple({ id: 'slot_1' });

    layout
      .add(apple)
      .render();

    firstChild = layout.el.firstElementChild;

    assert.isTrue(firstChild.classList.contains('apple'));
  },

  "Should be of the tag specified": function() {
    var apple = new helpers.Views.Apple({ tag: 'ul' });

    apple.render();
    assert.equals('UL', apple.el.tagName);
  },

  "Should have classes on the element": function() {
    var apple = new helpers.Views.Apple({
      classes: ['foo', 'bar']
    });

    apple.render();
    assert.equals('apple foo bar', apple.el.className);
  },

  "Should have an id attribute with the value of `fmid`": function() {
    var apple = new helpers.Views.Apple({
      classes: ['foo', 'bar']
    });

    apple.render();

    assert.equals(apple._fmid, apple.el.id);
  },

  "tearDown": helpers.destroyView
});