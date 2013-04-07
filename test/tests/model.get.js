
buster.testCase('Model#get()', {

  "Should be able to get data by key": function() {
    var model = new FruitMachine.Model();
    var key = 'myKey';
    var value = 'myValue';

    model.set(key, value);

    assert.equals(model.get(key), value);
  },

  "Should return undefined if a key does not exist": function() {
    var model = new FruitMachine.Model({ foo: 'bar' });
    var result = model.get('baz');

    assert.equals(typeof result, 'undefined');
  }
});
