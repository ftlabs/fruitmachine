## Helpers

Helpers are small reusable plug-ins that you can write to add extra features to a View module ([working example](http://ftlabs.github.io/fruitmachine/examples/helpers)).

### Defining helpers

A helper is simply a function accepting the View module instance as the first argument. The helper can listen to events on the View module and bolt functionality onto the view.

Helpers should clear up after themselves. For example if they create variables or bind to events on `setup`, they should be unset and unbound on `teardown`.

```js
var myHelper = function(module) {

  // Add functionality
  module.on('before setup', function() { /* 1 */
    module.sayName = function() {
      return 'My name is ' + module.name;
    };
  });

  // Tidy up
  module.on('teardown', function() {
    delete module.sayName;
  });
};
```

1. *It is often useful to hook into the `before setup` event so that added functionality is available inside the module's `setup` function.*

### Attaching helpers

At definition:

```js
var Apple = fruitmachine.define({
  name: 'apple',
  helpers: [ myHelper ]
});
```

...or instantiation:

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

### Community Helpers ("Plugins")

Helpers can be released as plugins, if you would like to submit your helper to this list [please raise an issue](https://github.com/ftlabs/fruitmachine/issues).

- [fruitmachine-ftdomdelegate](https://github.com/ftlabs/fruitmachine-ftdomdelegate) provides [ftdomdelegate](https://github.com/ftlabs/ftdomdelegate) functionality within fruitmachine modules.
