## DOM injection

Once you have [assembled](layout-assembly.md) and [rendered](rendering.md) your View you'll want to inject it into the DOM at some point. *FruitMachine* has multiple ways of doing this:

- `.inject(<Element>)` Empties the contents of the given element, then appends `view.el`.
- `.appendTo(<Element>)` Appends `view.el` to the given Element.
- `.insertBefore(<Element>, <Element>)` Appends `view.el` to the given Element as a previous sibling of the second Element parameter.

### `View#inject()`

```js
var container = document.querySelector('.container');
var apple = new Apple();

apple.render();
apple.inject(container);
```

### `View#appendTo()`

```js
var list = document.querySelector('.list');
var apple = new Apple();

apple.render();
apple.appendTo(list);
```