
describe('View#render()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("The master view should have an element post render.", function() {
    viewToTest.render();
    expect(viewToTest.el).toBeDefined();
  });

  test("before render and render events should be fired", function() {
    var beforeRenderSpy = jest.fn();
    var renderSpy = jest.fn();
    viewToTest.on('before render', beforeRenderSpy);
    viewToTest.on('render', renderSpy);

    viewToTest.render();
    expect(beforeRenderSpy.mock.invocationCallOrder[0]).toBeLessThan(renderSpy.mock.invocationCallOrder[0]);
  });

  test("Data should be present in the generated markup.", function() {
    var text = 'some orange text';
    var orange = new Orange({
      model: {
        text: text
      }
    });

    orange
      .render()
      .inject(sandbox);

    expect(orange.el.innerHTML).toEqual(text);
  });

  test("Should be able to use Backbone models", function() {
    var orange = new Orange({
      model: {
        text: 'orange text'
      }
    });

    orange.render();
    expect(orange.el.innerHTML).toEqual('orange text');
  });

  test("Child html should be present in the parent.", function() {
    var layout = new Layout();
    var apple = new Apple();

    layout
      .add(apple, 1)
      .render();

    firstChild = layout.el.firstElementChild;
    expect(firstChild.classList.contains('apple')).toBe(true);
  });

  test("Should be of the tag specified", function() {
    var apple = new Apple({ tag: 'ul' });

    apple.render();
    expect('UL').toEqual(apple.el.tagName);
  });

  test("Should have classes on the element", function() {
    var apple = new Apple({
      classes: ['foo', 'bar']
    });

    apple.render();
    expect('apple foo bar').toEqual(apple.el.className);
  });

  test("Should have an id attribute with the value of `fmid`", function() {
    var apple = new Apple({
      classes: ['foo', 'bar']
    });

    apple.render();

    expect(apple._fmid).toEqual(apple.el.id);
  });

  test("Should have populated all child module.el properties", function() {
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

    expect(apple1.el).toBeTruthy();
    expect(apple2.el).toBeTruthy();
    expect(apple3.el).toBeTruthy();
  });

  test("The outer DOM node should be recycled between #renders", function() {
    var layout = new Layout({
      children: {
        1: { module: 'apple' }
      }
    });
    layout.render();
    layout.el.setAttribute('data-test', 'should-not-be-blown-away');
    layout.module('apple').el.setAttribute('data-test', 'should-be-blown-away');

    layout.render();

    // The DOM node of the FM module that render is called on should be recycled
    expect(layout.el.getAttribute('data-test')).toEqual('should-not-be-blown-away');

    // The DOM node of a child FM module to the one render is called on should not be recycled
    expect(layout.module('apple').el.getAttribute('data-test')).not.toEqual('should-be-blown-away');
  });

  test("Classes should be updated on render", function() {
    var layout = new Layout();
    layout.render();
    layout.classes = ['should-be-added'];
    layout.render();
    expect(layout.el.className).toEqual('layout should-be-added');
  });

  test("Classes added through the DOM should persist between renders", function() {
    var layout = new Layout();
    layout.render();
    layout.el.classList.add('should-persist');
    layout.render();
    expect(layout.el.className).toEqual('layout should-persist');
  });

  test("Should fire unmount on children when rerendering", function() {
    var appleSpy = jest.fn();
    var orangeSpy = jest.fn();
    var pearSpy = jest.fn();

    viewToTest.module('apple').on('unmount', appleSpy);
    viewToTest.module('orange').on('unmount', orangeSpy);
    viewToTest.module('pear').on('unmount', pearSpy);

    viewToTest.render();
    expect(appleSpy).not.toHaveBeenCalled();
    expect(orangeSpy).not.toHaveBeenCalled();
    expect(pearSpy).not.toHaveBeenCalled();

    viewToTest.render();
    expect(appleSpy).toHaveBeenCalled();
    expect(orangeSpy).toHaveBeenCalled();
    expect(pearSpy).toHaveBeenCalled();
  });

  afterEach(function() {
    helpers.destroyView();
    viewToTest = null;
  });
});
