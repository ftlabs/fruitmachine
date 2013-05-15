
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

    var view = new FruitMachine({
      module: 'apple',
      children: children
    });

    assert.equals(view.children.length, 2);
  },

  "Should store a reference to the slot if passed": function() {
    var view = new FruitMachine({
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
    var view = new FruitMachine({
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

    assert.equals(layout.module('apple').slot, 2);
  },

  "Should create a model": function() {
    var view = new FruitMachine({ module: 'apple' });
    assert.isTrue(view.model instanceof FruitMachine.Model);
  },

  "Should adopt the fmid if passed": function() {
    var view = new FruitMachine({ fmid: '1234', module: 'apple' });
    assert.equals(view._fmid, '1234');
  },

  "Should fire an 'inflation' event on fm instance if instantiated with an fmid": function() {
    var spy = this.spy();

    FruitMachine.on('inflation', spy);

    var layout = new FruitMachine({
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

    FruitMachine.on('inflation', spy);

    var layout = new FruitMachine({
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

    FruitMachine.on('inflation', spy);

    var layout = new FruitMachine(options);
    assert.equals(spy.args[0][1], options);
  }
});