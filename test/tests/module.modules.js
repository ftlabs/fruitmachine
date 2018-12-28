
describe('View#modules()', function() {
  var viewToTest;

  beforeEach(function() {
    var layout = new Layout({});
    var apple = new Apple({ id: 'slot_1' });
    var orange = new Orange({ id: 'slot_2' });
    var pear = new Pear({ id: 'slot_3' });

    layout
      .add(apple)
      .add(orange)
      .add(pear);

    viewToTest = layout;
  });

  test("Should return all descendant views matching the given module type", function() {
    var oranges = viewToTest.modules('orange');
    var pears = viewToTest.modules('pear');

    expect(oranges.length).toBe(1);
    expect(pears.length).toBe(1);
  });

  test("Should return multiple views if they exist", function() {
    viewToTest
      .add({ module: 'pear' });

    var pears = viewToTest.modules('pear');

    expect(pears.length).toBe(2);
  });

  afterEach(function() {
    helpers.destroyView(viewToTest);
    viewToTest = null;
  });
});
