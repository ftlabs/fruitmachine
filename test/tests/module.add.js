
describe('View#add()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = new helpers.Views.List();
  });

  test("Should throw when adding undefined module", function() {
    var thrown;
    try {
      viewToTest.add({module: 'invalidFruit'});
    } catch(e) {
      expect(e.message).toMatch('invalidFruit');
      thrown = true;
    }
    expect(thrown).toBe(true);
  });

  test("Should accept a View instance", function() {
    var pear = new helpers.Views.Pear();
    viewToTest.add(pear);
    expect(viewToTest.children.length).toBe(1);
  });

  test("Should store a reference to the child via slot if the view added has a slot", function() {
    var apple = new Apple({ slot: 1 });
    var layout = new Layout();

    layout.add(apple);

    expect(layout.slots[1]).toBe(apple);
  });

  test("Should aceept JSON", function() {
    viewToTest.add({ module: 'pear' });
    expect(viewToTest.children.length).toBe(1);
  });

  test("Should allow the second parameter to define the slot", function() {
    var apple = new Apple();
    var layout = new Layout();

    layout.add(apple, 1);
    expect(layout.slots[1]).toBe(apple);
  });

  test("Should be able to define the slot in the options object", function() {
    var apple = new Apple();
    var layout = new Layout();

    layout.add(apple, { slot: 1 });
    expect(layout.slots[1]).toBe(apple);
  });

  test("Should remove a module if it already occupies this slot", function() {
    var apple = new Apple();
    var orange = new Orange();
    var layout = new Layout();

    layout.add(apple, 1);

    expect(layout.slots[1]).toBe(apple);

    layout.add(orange, 1);

    expect(layout.slots[1]).toBe(orange);
    expect(layout.module('apple')).toBeUndefined();
  });

  test("Should remove the module if it already has parent before being added", function() {
    var apple = new Apple();
    var layout = new Layout();
    var spy = jest.spyOn(apple, 'remove');

    layout.add(apple, 1);

    expect(spy).toHaveBeenCalledTimes(0);
    expect(layout.slots[1]).toBe(apple);

    layout.add(apple, 2);

    expect(layout.slots[1]).not.toEqual(apple);
    expect(layout.slots[2]).toBe(apple);
    expect(spy).toHaveBeenCalled();
  });

  afterEach(function() {
    helpers.destroyView(viewToTest);
    viewToTest = null;
  });
});
