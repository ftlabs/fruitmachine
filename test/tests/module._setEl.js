
describe('View#_setEl()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Should replace the element in context if it has a context", function() {
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

    expect(replacement.parentNode).toBe(apple.el);
  });

  test("Should call unmount if replacing the element", function() {
    var layoutSpy = jest.fn();
    var appleSpy = jest.fn();
    var orangeSpy = jest.fn();
    var pearSpy = jest.fn();

    viewToTest.on('unmount', layoutSpy);
    viewToTest.module('apple').on('unmount', appleSpy);
    viewToTest.module('orange').on('unmount', orangeSpy);
    viewToTest.module('pear').on('unmount', pearSpy);

    viewToTest.render().inject(sandbox);
    viewToTest._setEl(document.createElement('div'));

    expect(layoutSpy).toHaveBeenCalled();
    expect(appleSpy).toHaveBeenCalled();
    expect(orangeSpy).toHaveBeenCalled();
    expect(pearSpy).toHaveBeenCalled();
  });

  afterEach(function() {
    helpers.destroyView();
    viewToTest = null;
  });
});
