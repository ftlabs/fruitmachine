
buster.testCase('View#toJSON()', {

  "Should return an fmid": function() {
    var apple = new Apple();
    var json = apple.toJSON();

    assert(json.fmid);
  },

  "Should fire `tojson` event": function() {
    var apple = new Apple();
    var spy = this.spy();

    apple.on('tojson', spy);
    apple.toJSON();

    assert(spy.called);
  },

  "Should be able to manipulate json output via `tojson` event": function() {
    var apple = new Apple();

    apple.on('tojson', function(json) {
      json.test = 'data';
    });

    var json = apple.toJSON();

    assert.equals(json.test, 'data');
  }
});