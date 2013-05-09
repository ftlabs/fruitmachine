
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

    var view = new FruitMachine.View({
      module: 'apple',
      children: children
    });

    assert.equals(view.children.length, 2);
  },

  "Should store a reference to the slot if passed": function() {
    var view = new FruitMachine.View({
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

    assert(view._slots[1]);
    assert(view._slots[2]);
  },

  "Should store a reference to the slot if slot is passed as key of children object": function() {
    var view = new FruitMachine.View({
      module: 'apple',
      children: {
        1: { module: 'pear' },
        2: { module: 'orange' }
      }
    });

    assert(view._slots[1]);
    assert(view._slots[2]);
  },

  "Should store a reference to the slot if the view is instantiated with a slot": function() {
    var apple = new Apple({ slot: 1 });

    assert.equals(apple._slot, 1);
  },

  "Should prefer the slot on the children object in case of conflict": function() {
    var apple = new Apple({ slot: 1 });
    var layout = new Layout({
      children: {
        2: apple
      }
    });

    assert.equals(layout.module('apple')._slot, 2);
  },

  "Should create a model": function() {
    var view = new FruitMachine.View({ module: 'apple' });
    assert.isTrue(view.model instanceof FruitMachine.Model);
  }
});