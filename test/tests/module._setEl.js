var assert = buster.assertions.assert;

buster.testCase('View#_setEl()', {
  setUp: helpers.createView,

  "Should replace the element in context if it has a context": function() {
    var layout = fruitmachine({
      module: 'layout',
      children: {
        1: {
          module: 'apple',
          children: {
            1: {
              module: 'orange'
            }
          }
        }
      }
    });

    layout.render();

    var apple = layout.module('apple');
    var orange = layout.module('orange');
    var replacement = document.createElement('div');

    orange._setEl(replacement);

    assert.equals(replacement.parentNode, apple.el);
  },

  "Should call unmount if replacing the element": function() {
    var layoutSpy = this.spy();
    var appleSpy = this.spy();
    var orangeSpy = this.spy();
    var pearSpy = this.spy();

    this.view.on('unmount', layoutSpy);
    this.view.module('apple').on('unmount', appleSpy);
    this.view.module('orange').on('unmount', orangeSpy);
    this.view.module('pear').on('unmount', pearSpy);

    this.view.render().inject(sandbox);
    this.view._setEl(document.createElement('div'));

    assert.called(layoutSpy);
    assert.called(appleSpy);
    assert.called(orangeSpy);
    assert.called(pearSpy);
  },

  tearDown: helpers.destroyView
});
