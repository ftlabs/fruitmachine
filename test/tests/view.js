
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

  "Should create a model": function() {
    var view = new FruitMachine.View({ module: 'apple' });
    assert.isTrue(view.model instanceof FruitMachine.Model);
  }
});