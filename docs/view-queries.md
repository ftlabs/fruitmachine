## Finding modules

When working with a nested (DOM like) view structure, you need a way get to child view instances. FruitMachine has three APIs for this:

#### View#module();

Returns a single descendent View instance by module type. Similar to `Element.prototype.querySelector`.

```js
apple.module('orange');
//=> orange
```

#### View#modules();

Returns a list of descendent View instance by module type. Similar to `Element.prototype.querySelectorAll`.

```js
apple.modules('orange');
//=> [orange, orange, ...]
```

#### View#id();

Returns a single descendent View instance by id. Similar to `document.getElementById`.

```js
apple.id('my_orange_1');
//=> orange
```
