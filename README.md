![fm logo](artwork/logo.jpg)

A modular view layout manager for client and server.

---

## Usage

#### Define your modules

Every module must have a module name, and a template function.

```js
var Layout = FruitMachine.define({
  module: 'layout',
  template: <template-function>
});

var Orange = FruitMachine.define({
  module: 'orange',
  template: <template-function>
});

var Apple = FruitMachine.define({
  module: 'apple',
  template: <template-function>,

  // Bind interactions
  onSetup: function() {
    this.el.addEventListener('click', function() {
      alert('apple clicked!');
    });
  }
});
```

#### Arrange your modules into a layout...

```js
var layout = {
  module: 'layout-a',
  children: [
    {
      id: 'child_1',
      module: 'apple',
      data: {
        title: 'Apple Title'
      }
    },
    {
      id: 'child_2',
      module: 'orange'
    }
  ]
};

var view = new FruitMachine.View(layout);
```

#### ...or instantiate them directly

```js
var view = new Apple();
```

#### Render your view

```js
view.render();
```

#### Inject it into the DOM

```js
view.inject(document.body);
```

#### Then set up any interactions

```js
view.setup();
```

### Or all at once

```js
view
  .setup()
  .inject(document.body)
  .render();
```

## Why not use Backbone?

- No deps
- Can be retrofitted into a parts of a legacy system, it's not a religion
- Serverside has been considered from the start
- It doesn't care how you manage your data
- Modules are designed to be reused in multiple contexts, you create layouts, not fixed views
- A little more structured than Backbone

## API



### Model();

Model constructor.



### Model#get();

Gets a value by key

If no key is given, the
whole model is returned.

### Model#set();

Sets data on the model.

Accepts either a key and
value, or an object literal.

### Model#clear();

CLears the data store.



### Model#destroy();

Deletes the data store.



### Model#toJSON();

Returns a shallow
clone of the data store.




## License
Copyright (c) 2012 Wilson Page
Licensed under the MIT license.