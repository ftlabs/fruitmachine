var Backbone = require('backbone');

describe('View', function() {

  test("Should add any children passed into the constructor", function() {
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

    expect(view.children.length).toBe(2);
  });

  test("Should store a reference to the slot if passed", function() {
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

    expect(view.slots[1]).toBeTruthy();
    expect(view.slots[2]).toBeTruthy();
  });

  test("Should store a reference to the slot if slot is passed as key of children object", function() {
    var view = new fruitmachine({
      module: 'apple',
      children: {
        1: { module: 'pear' },
        2: { module: 'orange' }
      }
    });

    expect(view.slots[1]).toBeTruthy();
    expect(view.slots[2]).toBeTruthy();
  });

  test("Should store a reference to the slot if the view is instantiated with a slot", function() {
    var apple = new Apple({ slot: 1 });

    expect(apple.slot).toBe(1);
  });

  test("Should prefer the slot on the children object in case of conflict", function() {
    var apple = new Apple({ slot: 1 });
    var layout = new Layout({
      children: {
        2: apple
      }
    });

    expect(layout.module('apple').slot).toBe('2');
  });

  test("Should create a model", function() {
    var view = new fruitmachine({ module: 'apple' });
    expect(view.model instanceof fruitmachine.Model).toBe(true);
  });

  test("Should adopt the fmid if passed", function() {
    var view = new fruitmachine({ fmid: '1234', module: 'apple' });
    expect(view._fmid).toBe('1234');
  });

  test("Should fire an 'inflation' event on fm instance if instantiated with an fmid", function() {
    var spy = jest.fn();

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

    expect(spy).toHaveBeenCalledTimes(2);
  });

  test("Should fire an 'inflation' event on fm instance with the view as the first arg", function() {
    var spy = jest.fn();

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

    expect(spy.mock.calls[0][0]).toBe(layout);
    expect(spy.mock.calls[1][0]).toBe(layout.module('apple'));
  });

  test("Should fire an 'inflation' event on fm instance with the options as the second arg", function() {
    var spy = jest.fn();
    var options = {
      fmid: '1',
      module: 'layout'
    };

    fruitmachine.on('inflation', spy);

    var layout = new fruitmachine(options);
    expect(spy.mock.calls[0][1]).toEqual(options);
  });

  test("Should be able to use Backbone models", function() {
    var orange = new Orange({
      model: new Backbone.Model({ text: 'orange text' })
    });

    orange.render();
    expect(orange.el.innerHTML.indexOf('orange text')).toBe(0);
  });

  test("Should define a global default model", function() {
    var previous = fruitmachine.Module.prototype.Model;

    fruitmachine.Module.prototype.Model = Backbone.Model;

    var orange = new Orange({
      model: { text: 'orange text' }
    });

    orange.render();
    expect(orange.model instanceof Backbone.Model).toBe(true);
    expect(orange.el.innerHTML.indexOf('orange text')).toBe(0);

    // Restore
    fruitmachine.Module.prototype.Model = previous;
  });

  test("Should define a module default model", function() {
    var Berry = fruitmachine.define({
      name: 'berry',
      Model: Backbone.Model
    });

    var berry = new Berry({ model: { foo: 'bar' }});

    expect(berry.model instanceof Backbone.Model).toBe(true);
  });

  test.skip("Should not modify the options object", function() {
    var options = {
      classes: ['my class']
    };

    var orange = new Orange(options);
    orange.classes.push('added');

    expect(['my class']).toBe(options.classes);
  });
});
