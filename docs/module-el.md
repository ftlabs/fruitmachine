## The Module's Element

Each module has a 'root' element (`myModule.el`). This is the single element that wraps the contents of a module. It is your handle on the module once it has been [injected](view-injection.md) into the DOM. You may be familiar with the `.el` concept from [Backbone](http://backbonejs.org/). In *FruitMachine* it is similar, but due to the 'DOM free' nested rendering techniques used, the `myModule.el` is not always accessible.

In FruitMachine the `.el` property of a module is populated when `view.render()` is called.

**NOTE:** As a safety measure we do not setup modules when a module's element could not be found. This means that `myModule.el` related setup logic wont error when `myModule.el` is `undefined`.

#### Some examples

1.1. After render `module.el` will be defined

```js
var apple = new Apple();
var orange = new Orange();

apple
  .add(orange)
  .render();

apple.el
//=> "[object HTMLDivElement]"

orange.el
//=> "[object HTMLDivElement]"
```

1.2. Without calling `.render()` no module elements are set.

```js
var apple = new Apple();
var orange = new Orange();

apple.add(orange);

apple.el
//=> undefined

orange.el
//=> undefined
```

### FAQ

#### Why is my module.el property undefined after .render()?

The child module markup has failed to template into the parent module correctly. Check your child ids and parent markup to check they match up. See [template markup](view-template-markup.md).

#### How are module root elements found?

Internally each module has a private unique id (`myModule._fmid`). When the root element is templated, the html `id` attribute value is set to the `myModule._fmid`. When `.render()` is called on a module the HTML is templated and turned into a 'real' element in memory. We store this element and then search for descendant elements by id using `querySelector`. Server-side rendered modules being inflated on the client pick up their root element from the DOM when `.setup()` is called using `document.getElementById(module._fmid)` (super fast).
