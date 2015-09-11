var assert = buster.assertions.assert;

buster.testCase('View#mount()', {
  setUp: helpers.createView,

  "Should give a view an element": function() {
    var el = document.createElement('div');
    this.view.mount(el);

    assert.equals(this.view.el, el);
  },

  "Should be called when the view is rendered": function() {
    var mount = this.spy(this.view, 'mount');
    this.view.render();
    assert.called(mount);
  },

  "Should be called on a child when its parent is rendered": function() {
    var mount = this.spy(this.view.module('apple'), 'mount');
    this.view.render();
    assert.called(mount);
  },

  "Should be called on a child when its parent is rerendered": function() {
    var mount = this.spy(this.view.module('apple'), 'mount');
    this.view.render();
    this.view.render();
    assert.calledTwice(mount);
  },

  "Should call custom mount logic": function() {
    var mount = this.spy();

    var Module = fruitmachine.define({
      name: 'module',
      template: function() {
        return 'hello';
      },

      mount: mount
    });

    var m = new Module();
    m.render();

    assert.called(mount);
  },


  "Should be a good place to attach event handlers that don't get trashed on parent rerender": function() {
    var handler = this.spy();

    var Module = fruitmachine.define({
      name: 'module',
      tag: 'button',
      template: function() {
        return 'hello';
      },

      mount: function() {
        this.el.addEventListener('click', handler);
      }
    });

    var m = new Module();
    
    var layout = new Layout({
      children: {
        1: m
      }
    });

    layout.render();
    m.el.click();

    assert.called(handler);

    layout.render();
    m.el.click();

    assert.calledTwice(handler);
  },

  "before mount and mount events should be fired": function() {
    var beforeMountSpy = this.spy();
    var mountSpy = this.spy();
    this.view.on('before mount', beforeMountSpy);
    this.view.on('mount', mountSpy);

    this.view.render();
    assert.callOrder(beforeMountSpy, mountSpy);
  }, 

  "Should only fire events if the element is new": function() {
    var mountSpy = this.spy();
    this.view.on('mount', mountSpy);

    this.view.render();
    this.view._getEl();
    assert.calledOnce(mountSpy);
  }, 

  tearDown: helpers.destroyView
});
