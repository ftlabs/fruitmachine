
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
  },

  "Should setup an event listener to purge html cache when model changes": function() {
    var spy = this.spy(FruitMachine.View.prototype, 'purgeHtmlCache');
    var view = new FruitMachine.View({ module: 'orange' });

    view.model.set('foo', 'bar');

    assert.called(spy);
    spy.restore();
  }
});