## DOM injection

Once you have [assembled](assembling-views.md) and [rendered](rendering-views.md) your View you'll want to inject it into the DOM at some point. *FruitMachine* has two ways of doing this:

- `.inject(<Element>)` Empties the contents of the given element, then appends `view.el`.
- `.appendTo(<Element>)` Appends `view.el` to the given Element.

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