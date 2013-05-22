## The Module's Element

Each module has a 'root' element (`myModule.el`). This is the single element that wraps the contents of a module. It is your handle on the module once it has been [injected](view-injection.md) into the DOM. You may be familiar with the `.el` concept from [Backbone](http://backbonejs.org/). In *FruitMachine* it is similar, but due to the 'DOM free' nested rendering techniques used, the `myModule.el` is not always accessible.

In FruitMachine the `.el` property of a module is populated when `view.setup()` is called. We suggest you only call `.setup()` after your module is in the DOM, this way we can guarantee your `myModule.el` property will be set.

**NOTE:** As a safety measure we do not setup modules when a module's element could not be found. This means that `myModule.el` related setup logic wont error when `myModule.el` is `undefined`.

#### Some examples

1.1. With DOM context all Module elements can be found

```js
var apple = new Apple();
var orange = new Orange();

apple
  .add(orange)
  .render()
  .inject(document.body)
  .setup();

apple.el
//=> "[object HTMLDivElement]"

apple.module('orange').el
//=> "[object HTMLDivElement]"
```

1.2. Without calling `.render()` no module elements are set.

```js
var apple = new Apple();
var orange = new Orange();

apple
  .add(orange)
  .render();

apple.el
//=> undefined

apple.module('orange').el
//=> undefined
```

1.3. Only the module rendered directly has a `.el` set.

```js
var apple = new Apple();
var orange = new Orange();

apple
  .add(orange)
  .render();

apple.el
//=> "[object HTMLDivElement]"

apple.module('orange').el
//=> undefined

apple.setup();

apple.module('orange').el
//=> "[object HTMLDivElement]"
```

**NOTE:** We are working to make sure all child modules elements are set after render has been called. So hopefully this edge case wont exist.

#### FAQ

#### When can I rely on myModule.el being set?

You can always access `myModule.el` *after* `.render()`, `.inject()` and `myModule.setup()` have been run.

#### Why is my `.el` property undefined after .setup()

1. The child module markup has failed to template into the parent module corrently. Check your child ids and parent markup to check they match up. See [template markup](view-template-markup.md).
2. You are trying to access a `.el` property before the markup has been put in the DOM

#### How are module root elements found?

Internally each module has a private unique id (`myModule._fmid`). When the root element is templated, the html `id` attribute value is set to the `myModule._fmid`. When `.setup()` is called, we get the root element from the DOM using `document.getElementById(myModule._fmid)` (super fast).
