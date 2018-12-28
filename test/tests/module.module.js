
describe('View#module()', function() {
  var viewToTest;

  beforeEach(function() {
    var layout = new Layout({});
    var apple = new Apple({ slot: 1 });
    var orange = new Orange({ slot: 2 });
    var pear = new Pear({ slot: 3 });

    layout
      .add(apple)
      .add(orange)
      .add(pear);

    viewToTest = layout;
  });

  test("Should return module type if no arguments given", function() {
    expect(viewToTest.module()).toBe('layout');
  });

  test("Should return the first child module with the specified type.", function() {
    var child = viewToTest.module('pear');

    expect(child).toBe(viewToTest.children[2]);
  });

  test("If there is more than one child of this module type, only the first is returned.", function() {
    viewToTest
      .add({ module: 'apple' });

    var child = viewToTest.module('apple');
    var firstChild = viewToTest.children[0];
    var lastChild = viewToTest.children[viewToTest.children.length-1];

    expect(child).toBe(firstChild);
    expect(child).not.toEqual(lastChild);
  });

  test("Should return the module name if defined with the name key", function() {
    var Henry = fruitmachine.define({ name: 'henry' });
    var henry = new Henry();

    expect(henry.module()).toBe('henry');
    expect(henry.name).toBe('henry');
  });

  test("Should walk down the fruitmachine tree, recursively", function() {
    var Elizabeth = fruitmachine.define({ name: 'elizabeth' });
    var elizabeth = new Elizabeth();
    viewToTest.module('apple').add(elizabeth);

    var elizabethInstance = viewToTest.module('elizabeth');
    expect(elizabethInstance.module()).toBe('elizabeth');
    expect(elizabethInstance.name).toBe('elizabeth');
  });

  test("Regression Test: Should still recurse even if the root view used to have a module of the same type", function() {
    var pear = viewToTest.module('pear').remove();
    viewToTest.module('apple').add(pear);

    var pearInstance = viewToTest.module('pear');
    expect(pearInstance.module()).toBe('pear');
    expect(pearInstance.name).toBe('pear');
  });
});
