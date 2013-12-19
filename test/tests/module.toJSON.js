
buster.testCase('View#toJSON()', {

  setUp: helpers.createView,

  "Should return an object": function() {
    var apple = new Apple();
    var json = apple.toJSON();

    assert(json instanceof Object);
  },

  "Should call toJSON of child": function() {
    var apple = new Apple();
    var orange = new Orange();
    var spy = this.spy(orange, 'toJSON');

    apple.add(orange);

    apple.toJSON();
    assert(spy.called);
  },

  "Should add the id": function() {
    var apple = new Apple();
    var json = apple.toJSON();

    assert(json.id);
  },

  "Should add the fmid": function() {
    var apple = new Apple();
    var json = apple.toJSON();

    assert(json.fmid);
  },

  "Should add the module name": function() {
    var apple = new Apple();
    var json = apple.toJSON();

    assert.equals(json.module, 'apple');
  },

  "Should add the slot": function() {
    var json = this.view.toJSON();

    refute.defined(json.slot);
    assert.same(1, json.children[0].slot);
    assert.same(2, json.children[1].slot);
    assert.same(3, json.children[2].slot);
  },

  "Should call toJSON of model": function() {
    var apple = new Apple();
    var model = {
      toJSON: function() {}
    };
    var spy = this.spy(model, 'toJSON');

    apple.model = model;

    apple.toJSON();
    assert(spy.called);
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