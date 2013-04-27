
buster.testCase('Model#toJSON()', {

  "Should return a shallow clone of the data store": function() {
    var model = new FruitMachine.Model({ foo: 'bar' });
    var json = model.toJSON();


    assert.equals(json.foo, 'bar');

    json.foo = 'baz';

    assert.equals(model.get('foo'), 'bar');
  }
});
