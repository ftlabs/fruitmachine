
buster.testCase('Model#set()', {

  "Should be able to set data by key.": function() {
    var model = new FruitMachine.Model();
    var key = 'myKey';
    var value = 'myValue';

    model.set(key, value);

    assert.equals(model.get(key), value);
  },

  "Should be able to set using object literal": function() {
    var model = new FruitMachine.Model();
    var data = {
      myKey1: 'myValue1',
      myKey2: 'myValue2'
    };

    model.set(data);

    assert.equals(model.get('myKey1'), data.myKey1);
    assert.equals(model.get('myKey2'), data.myKey2);
  },

  "Should fire a `change` event when data is set": function() {
    var model = new FruitMachine.Model();
    var callback = this.spy();

    model.on('change', callback);
    model.set('foo', 'bar');

    assert.called(callback);
  },

  "Should fire a `datachange:&lt;property&gt;` event": function() {
    var model = new FruitMachine.Model();
    var callback = this.spy();

    model.on('change:foo', callback);
    model.set('foo', 'bar');

    assert.called(callback);
  },

  "Should fire a `datachange:&lt;property&gt;` for each key in object mixin": function() {
    var model = new FruitMachine.Model();
    var callback1 = this.spy();
    var callback2 = this.spy();
    var data = { foo: 'foo', bar: 'bar' };

    model.on('change:foo', callback1);
    model.on('change:bar', callback2);
    model.set(data);

    assert.called(callback1);
    assert.called(callback2);
  }
});
