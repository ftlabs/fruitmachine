describe('View#id()', function() {
  var viewToTest;

  beforeEach(function() {
    viewToTest = helpers.createView();
  });

  test("Should return a child by id.", function() {
    var layout = new Layout({
      children: {
        1: {
          module: 'apple',
          id: 'some_id'
        }
      }
    });

    var child = layout.id('some_id');
    expect(child).toBeDefined();
  });

  test("Should return the view's own id if no arguments given.", function() {
    var id = 'a_view_id';
    var view = new Apple({ id: id });

    expect(view.id()).toBe(id);
  });

  test("Should not return the view's own id the first argument is undefined", function() {
    var id = 'a_view_id';
    var view = new Apple({ id: id });
    expect(view.id(undefined)).toBeUndefined();
  });

  afterEach(function() {
    helpers.destroyView();
    viewToTest = null;
  });
});
