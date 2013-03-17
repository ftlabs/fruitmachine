
buster.testCase('View#data()', {
  "setUp": helpers.createView,

  "View#data() should return all data.": function() {
    var view = new FruitMachine({ data: { a: 1, b: 2, c: 3 }});
    var data = view.data();
    var length = 0;

    for (var key in data) length++;
    assert.equals(length, 3);
  },

  "Setting data by property.": function() {
    var data = this.view.data();

    this.view.data('someProp', 'some data');
    assert.equals(data.someProp, 'some data');
  },

  "Merging object into View data.": function() {
    var data = this.view.data();

    this.view.data({ prop1: 1, prop2: 2 });
    assert.equals(data.prop2, 2);
  },

  "Changing the data source shouldn't impact the View's data store.": function() {
    var source = { x: 1 };
    var view = new FruitMachine({ module: 'apple', data: source });

    source.x = 2;
    refute.equals(view.data('x'), source.x);
    assert.equals(view.data('x'), 1);
  },

  "A `datachange` event should be fired.": function() {
    var spy = this.spy();

    this.view.model.on('change', spy);
    this.view.data('foo', 'bar');
    assert.called(spy);
  },

  "A `datachange:&lt;property&gt;` event should be fired.": function() {
    var spy = this.spy();

    this.view.model.on('change:foo', spy);
    this.view.data('foo', 'bar');
    assert.called(spy);
  },

  "A `datachange:&lt;property&gt;` for each key in object mixin.": function() {
    var spy1 = this.spy();
    var spy2 = this.spy();
    var newData = { foo: 'foo', bar: 'bar' };

    this.view.model.on('change:foo', spy1);
    this.view.model.on('change:bar', spy2);
    this.view.data(newData);
    assert.called(spy1);
    assert.called(spy2);
  },

  "tearDown": helpers.destroyView
});
