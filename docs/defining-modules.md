# Defining Modules

```js
var Apple = FruitMachine.define({
  module: 'apple',
  template: templateFunction,
  tag: 'section',
  classes: [ 'class-1', 'class-2'],
  
  // Event callbacks (optional)
  onIntitalize: function(options){},
  onSetup: function(){},
  onTeardown: function(){},
  onDestroy: function(){}
});
```

Define does two things:

- It registers a View module internally for [Lazy]() View instantiation
- It returns a constructor that can be [Explicitly]() instantiated.

Internally `define` extends the default `FruitMachine.View.prototype` with the parameters you define. Many of these parameters can be overwritten in the options passed to the constructor on a per instance basis. It is important you don't declare any parameters that conflict with `FruitMachine.View.prototype` core API (check the [source]() if you are unsure).

### Options

- `module {String}` Your name for this View module.
- `template {Function}` A function that will return the module's html (we like [Hogan](http://twitter.github.com/hogan.js/)
- `tag {String}` The html tag to use on the root element (defaults to 'div') *(optional)*
- `classes {Array}` A list of classes to add to the root element. *(optional)*
- `onInitialize {Function}` Define a function to run when the VIew is first instantiated (only ever runs once) *(optional)*
- `onSetup {Function}` A function to be run every time `View#setup()` is called. Should be used to bind any DOM event listeners. You can safely assume the presence of `this.el` at this point. *(optional)*
- `onTeardown {Function}` A function to be run when `View#teardown()` or `View#destroy()` is called. `onTeardown` will also run if you attempt to setup an already 'setup' view.
- `onDestroy {Function}` Run when `View#destroy()` is called (will only ever run once) *(optional)*


  
