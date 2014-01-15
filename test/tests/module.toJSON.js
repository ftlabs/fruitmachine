var assert = buster.assertions.assert;

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
  },

  "Should be able to inflate the output": function() {
    var sandbox = helpers.createSandbox();
    var layout = new Layout({
      children: {
        1: { module: 'apple' }
      }
    });

    layout
      .render()
      .inject(sandbox)
      .setup();

    var layoutEl = layout.el;
    var appleEl = layout.module('apple').el;
    var json = layout.toJSON();
    var inflated = fruitmachine(json);

    inflated.setup();

    var layoutElInflated = inflated.el;
    var appleElInflated = inflated.module('apple').el;

    assert.equals(layoutEl, layoutElInflated);
    assert.equals(appleEl, appleElInflated);
  }
});
