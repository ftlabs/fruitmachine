
buster.testCase('View#render()', {
  setUp: helpers.createView,

  "The master view should have an element post render.": function() {
    this.view.render();
    assert.defined(this.view.el);
  },

  "before render and render events should be fired": function() {
    var beforeRenderSpy = this.spy();
    var renderSpy = this.spy();
    this.view.on('before render', beforeRenderSpy);
    this.view.on('render', renderSpy);

    this.view.render();
    assert.callOrder(beforeRenderSpy, renderSpy);
  },

  "Data should be present in the generated markup.": function() {
    var text = 'some orange text';
    var orange = new Orange({
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
    var layout = new Layout();
    var apple = new Apple();

    layout
      .add(apple, 1)
      .render();

    firstChild = layout.el.firstElementChild;
    assert.isTrue(firstChild.classList.contains('apple'));
  },

  "Should be of the tag specified": function() {
    var apple = new Apple({ tag: 'ul' });

    apple.render();
    assert.equals('UL', apple.el.tagName);
  },

  "Should have classes on the element": function() {
    var apple = new Apple({
      classes: ['foo', 'bar']
    });

    apple.render();
    assert.equals('apple foo bar', apple.el.className);
  },

  "Should have an id attribute with the value of `fmid`": function() {
    var apple = new Apple({
      classes: ['foo', 'bar']
    });

    apple.render();

    assert.equals(apple._fmid, apple.el.id);
  },

  "Should have populated all child module.el properties": function() {
    var layout = new Layout({
      children: {
        1: {
          module: 'apple',
          children: {
            1: {
              module: 'apple',
              children: {
                1: {
                  module: 'apple'
                }
              }
            }
          }
        }
      }
    });

    var apple1 = layout.module('apple');
    var apple2 = apple1.module('apple');
    var apple3 = apple2.module('apple');

    layout.render();

    assert(apple1.el);
    assert(apple2.el);
    assert(apple3.el);
  },

  "tearDown": helpers.destroyView
});
