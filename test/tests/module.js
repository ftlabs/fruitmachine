var assert = buster.referee.assert;

buster.testCase('View', {
  "Should add any children passed into the constructor": function() {
    var children = [
      {
        module: 'pear'
      },
      {
        module: 'orange'
      }
    ];

    var view = new fruitmachine({
      module: 'apple',
      children: children
    });

    assert.equals(view.children.length, 2);
  },

  "Should store a reference to the slot if passed": function() {
    var view = new fruitmachine({
      module: 'apple',
      children: [
        {
          module: 'pear',
          slot: 1
        },
        {
          module: 'orange',
          slot: 2
        }
      ]
    });

    assert(view.slots[1]);
    assert(view.slots[2]);
  },

  "Should store a reference to the slot if slot is passed as key of children object": function() {
    var view = new fruitmachine({
      module: 'apple',
      children: {
        1: { module: 'pear' },
        2: { module: 'orange' }
      }
    });

    assert(view.slots[1]);
    assert(view.slots[2]);
  },

  "Should store a reference to the slot if the view is instantiated with a slot": function() {
    var apple = new Apple({ slot: 1 });

    assert.equals(apple.slot, 1);
  },

  "Should prefer the slot on the children object in case of conflict": function() {
    var apple = new Apple({ slot: 1 });
    var layout = new Layout({
      children: {
        2: apple
      }
    });

    assert.equals(layout.module('apple').slot, '2');
  },

  "Should create a model": function() {
    var view = new fruitmachine({ module: 'apple' });
    assert.isTrue(view.model instanceof fruitmachine.Model);
  },

  "Should adopt the fmid if passed": function() {
    var view = new fruitmachine({ fmid: '1234', module: 'apple' });
    assert.equals(view._fmid, '1234');
  },

  "Should fire an 'inflation' event on fm instance if instantiated with an fmid": function() {
    var spy = this.spy();

    fruitmachine.on('inflation', spy);

    var layout = new fruitmachine({
      fmid: '1',
      module: 'layout',
      children: {
        1: {
          fmid: '2',
          module: 'apple'
        }
      }
    });

    assert(spy.calledTwice);
  },

  "Should fire an 'inflation' event on fm instance with the view as the first arg": function() {
    var spy = this.spy();

    fruitmachine.on('inflation', spy);

    var layout = new fruitmachine({
      fmid: '1',
      module: 'layout',
      children: {
        1: {
          fmid: '2',
          module: 'apple'
        }
      }
    });

    assert.equals(spy.args[0][0], layout);
    assert.equals(spy.args[1][0], layout.module('apple'));
  },

  "Should fire an 'inflation' event on fm instance with the options as the second arg": function() {
    var spy = this.spy();
    var options = {
      fmid: '1',
      module: 'layout'
    };

    fruitmachine.on('inflation', spy);

    var layout = new fruitmachine(options);
    assert.equals(spy.args[0][1], options);
  },

  "Should be able to use Backbone models": function() {
    var orange = new Orange({
      model: new Backbone.Model({ text: 'orange text' })
    });

    orange.render();
    assert(~orange.el.innerHTML.indexOf('orange text'));
  },

  "Should define a global default model": function() {
    var previous = fruitmachine.Module.prototype.Model;

    fruitmachine.Module.prototype.Model = Backbone.Model;

    var orange = new Orange({
      model: { text: 'orange text' }
    });

    orange.render();
    assert(orange.model instanceof Backbone.Model);
    assert(~orange.el.innerHTML.indexOf('orange text'));

    // Restore
    fruitmachine.Module.prototype.Model = previous;
  },

  "Should define a module default model": function() {
    var Berry = fruitmachine.define({
      name: 'berry',
      Model: Backbone.Model
    });

    var berry = new Berry({ model: { foo: 'bar' }});

    assert(berry.model instanceof Backbone.Model);
  },

  "// Should not modify the options object": function() {
    var options = {
      classes: ['my class']
    };

    var orange = new Orange(options);
    orange.classes.push('added');

    assert.equals(['my class'], options.classes);
  }
});
