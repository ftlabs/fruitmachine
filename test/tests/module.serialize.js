
buster.testCase('View#serialize()', {

  setUp: helpers.createView,

  "Should return an object": function() {
    var apple = new Apple();
    var json = apple.serialize();

    assert(json instanceof Object);
  },

  "Should call serialize of child": function() {
    var apple = new Apple();
    var orange = new Orange();
    var spy = this.spy(orange, 'serialize');

    apple.add(orange);

    apple.serialize();
    assert(spy.called);
  },

  "Should add the id": function() {
    var apple = new Apple();
    var json = apple.serialize();

    assert(json.id);
  },

  "Should add the fmid by default": function() {
    var apple = new Apple();
    var json = apple.serialize();

    assert(json.fmid);
  },

  "Should omit the fmid if inflatable is false": function() {
    var apple = new Apple();
    var json = apple.serialize({inflatable: false});

    refute.defined(json.fmid);
  },

  "Should add the module name": function() {
    var apple = new Apple();
    var json = apple.serialize();

    assert.equals(json.module, 'apple');
  },

  "Should add the slot": function() {
    var json = this.view.serialize();

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

    apple.serialize();
    assert(spy.called);
  },

  "Should fire `serialize` event": function() {
    var apple = new Apple();
    var spy = this.spy();

    apple.on('serialize', spy);
    apple.serialize();

    assert(spy.called);
  },

  "Should be able to manipulate json output via `serialize` event": function() {
    var apple = new Apple();

    apple.on('serialize', function(json) {
      json.test = 'data';
    });

    var json = apple.serialize();

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
    var json = layout.serialize();
    var inflated = fruitmachine(json);

    inflated.setup();

    var layoutElInflated = inflated.el;
    var appleElInflated = inflated.module('apple').el;

    assert.equals(layoutEl, layoutElInflated);
    assert.equals(appleEl, appleElInflated);
  }
});