# The View Element

Each View module has a 'root' element. This is the single element that wraps the contents of a View module. It is your only handle on the View once it has been [injected](view-injection.md) into the DOM.

You may be familiar with the `.el` concept from [Backbone](http://backbonejs.org/). In *FruitMachine* it is similar, but due to the 'DOM free' nested rendering techniques used, the `view.el` is not always accessible.

The `.el` property of a view module is populated when `view.setup()` is called. We suggest you only call `.setup()` after your view is in the DOM, this way we can guarantee your `view.el` property will be set.

**NOTE:** As a safetly measure we do not setup views when a view element could not be found. This means that `view.el` related setup logic wont error when `view.el` is `undefined`.

## Some examples

1.1. With DOM context all View elements can be found

```js
var apple = new Apple({ children: [{ module: 'orange' }] });

apple
  .render()
  .inject(document.body)
  .setup();
  
apple.el
//=> "[object HTMLDivElement]"

apple.module('orange').el
//=> "[object HTMLDivElement]"
```

1.2. Without calling `.render()` no view elements are set.

```js
var apple = new Apple({ children: [{ module: 'orange' }] });

apple.el
//=> undefined

apple.module('orange').el
//=> undefined
```

1.3. Only the view rendered directly has a `view.el`

```js
var apple = new Apple({ children: [{ module: 'orange' }] });

apple.render();
  
apple.el
//=> "[object HTMLDivElement]"

apple.module('orange').el
//=> undefined
```

## FAQ

#### When can I rely on view.el being set?

As a rule of thumb, you can access view.el *after* `.render()`, `.inject()` and `view.setup()` have been run.

#### Why is my .el property undefined after .setup()

1. The child view markup has failed to template into the parent view corrently. Check your child ids and parent markup to check they match up. See [template markup](view-template-markup.md).
2. You are trying to access a `.el` property before the markup has been put in the DOM

#### How are view root elements found?

Internally each view has a private unique id (`view._fmid`). When the root element is templated, the html `id` attribute value is set to the `view._fmid`. When `.setup()` is called, we get the root element from the DOM using `document.getElementById(view._fmid)` (super fast).
