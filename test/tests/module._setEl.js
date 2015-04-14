var assert = buster.assertions.assert;

buster.testCase('View#_setEl()', {

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
  }

});
