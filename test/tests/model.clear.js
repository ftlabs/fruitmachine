
buster.testCase('Model#clear()', {

  "Should empty the data store": function() {
    var model = new fruitmachine.Model({ foo: 'bar' });

    assert.equals(model.get('foo'), 'bar');

    model.clear();

    assert.equals(model.get('foo'), undefined);
  },

  "Should fire a `change` event": function() {
    var model = new fruitmachine.Model({ foo: 'bar' });
    var callback = this.spy();

    model.on('change', callback);
    model.clear();

    assert.called(callback);
  }
});
