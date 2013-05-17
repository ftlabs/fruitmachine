
buster.testCase('Model#destroy()', {

  "Should clear all keys on the data store": function() {
    var model = new fruitmachine.Model({ foo: 'bar', baz: 'bop' });
    var ref = model._data;

    model.destroy();

    assert.equals(ref.foo, null);
    assert.equals(ref.baz, null);
  },

  "Should fire a `destroy` event": function() {
    var model = new fruitmachine.Model();
    var callback = this.spy();

    model.on('destroy', callback);
    model.destroy();

    assert.called(callback);
  }
});
