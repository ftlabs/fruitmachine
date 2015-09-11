## Interacting with the DOM

Sometimes, modules need to interact with the DOM, for example to register event handlers or set up a non-fruitmachine component. The `mount` lifecycle method is called whenever a module is associated with a new DOM element, allowing you to perform setup that requires the DOM:

```js
var Apple = fruitmachine.define({
  name: 'apple',
  template: function() { return '<button>Click me</button>' },

  mount: function() {
    this.el.addEventListener('click', function() {
      alert('clicked');
    });
  },
});
```
