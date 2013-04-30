## Helpers

Helpers are small reusable plugins that you can write to add extra features to a View module ([working example](http://wilsonpage.github.io/fruitmachine/examples/helpers)).

### Defining helpers

A helper is simply a function accepting the View module instance as the first argument. The helper can listen to events on the View module and bolt functionality onto the view.

Helpers should clear up after themselves. For example if they create variables or bind to events on `setup`, they should be unset and unbound on `teardown`.

```js
var myHelper = function(view) {

  // Add functionality
  view.on('before setup', function() { /* 1 */
    view.sayName = function() {
      return 'My name is ' + view.module();
    };
  });

  // Tidy up
  view.on('teardown', function() {
    delete view.sayName;
  });
};
```

1. *It is often useful to hook into the `before setup` event so that added functionality is availble inside the module's `setup` function.*

### Attaching helpers

At definition:

```js
var Apple = FruitMachine.define({
  module: 'apple',
  helpers: [ myHelper ]
});
```

...or instantitation:

```js
var apple = new Apple({
  helpers: [ myHelper ]
});
```

### Using features

```js
apple.sayName();
//=> 'My name is apple'
```
