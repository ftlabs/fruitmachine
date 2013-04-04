
# Events

Events are at the core of FruitMachine. They allows us to decouple View interactions from one another. FruitMachine events are interesting as they propagate (or bubble) up the view chain. This means that parents Views way up the view chain can still listen to events that happen in deeply nested View modules.

### Example

```js
var Apple = FruitMachine.define({
  module: 'apple',
  template: template,
  
  onSetup: function() {
    self.trigger('appleshouting');
  }
}):

var Layout = FruitMachine.define({...});
var Orange = FruitMachine.define({...});

var layout = new Layout();
var orange = new Orange();
var apple = new Apple();

orange.add(apple);
layout.add(orange);

layout.on('appleshouting', function() {
  alert('layout heard apple shout');
});

layout
  .render()
  .inject(document.body)
  .setup();
```

