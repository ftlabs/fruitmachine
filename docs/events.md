## Events

Events are at the core of fruitmachine. They allows us to decouple View interactions from one another. By default *FruitMachine* fires the following events on View module instances:

- `initialize` On instantiation
- `setup` When `.setup()` is called (remember 'setup' is recursive)
- `teardown` When `.teardown()` or `.destroy()` are called (remember 'destroy' calls 'teardown' which recurses)
- `destroy` When `.setup()` is called (remember 'teardown' recurses)
- `render` When `.render()` is called

#### Bubbling

FruitMachine events are interesting as they propagate (or bubble) up the view chain. This means that parent Views way up the view chain can still listen to events that happen in deeply nested View modules.

This is useful because it means your app's controllers can listen and decide what to do when specific things happen within your views. The response logic doesn't have to be in the view module itself, meaning modules are decoupled from your app, and easily reused elsewhere.

```js
var layout = new Layout();
var apple = new Apple();

layout.add(apple);

layout.on('shout', function() {
  alert('layout heard apple shout');
});

apple.fire('shout');
//=> alert 'layout heard apple shout'
```

#### Passing parameters

```js
var layout = new Layout();
var apple = new Apple();

layout.add(apple);

layout.on('shout', function(param) {
  alert('layout heard apple shout ' + param);
});

apple.fire('shout', 'hello');
// alert - 'layout heard apple shout hello'
```

#### Listening only for specific modules

```js
var layout = new Layout();
var apple = new Apple();
var orange = new Orange();

layout
	.add(apple)
	.add(orange);

layout.on('shout', 'apple', function() {
  alert('layout heard apple shout');
});

apple.fire('shout');
//=> alert 'layout heard apple shout'

orange.fire('shout');
//=> nothing
```

#### Utilising the event object

The event object can be found on under `this.event`. It holds a reference to the target view, where the event originated.

```js
var layout = new Layout();
var apple = new Apple();
var orange = new Orange();

layout
	.add(apple)
	.add(orange);

layout.on('shout', function() {
	var module = this.event.target.module();
  alert('layout heard ' + module + ' shout');
});

apple.fire('shout');
//=> alert 'layout heard apple shout'

orange.fire('shout');
//=> alert 'layout heard orange shout'
```

It also allows you to stop the event propagating (bubbling) up the view by calling `this.event.stopPropagation()`, just like DOM events!

```js
var layout = new Layout();
var apple = new Apple();
var orange = new Orange();

layout
	.add(apple)
	.add(orange);

layout.on('shout', function() {
  alert('layout heard apple shout');
});

apple.on('shout', function() {
	this.event.stopPropagation(); /* 1 */
});

apple.fire('shout');
//=> nothing
```

1. *By stopping propagation here, we stop the event from ever reaching the parent view `layout`, and thus the alert is never fired.*

