## Slots

*FruitMachine* uses the concept of 'slots' to place child modules inside a parent module.

#### Defining slots

Slots are defined in a view module's template and can be named what ever you like.

**my-view.mustache**

```html
<div class="slot-1">{{{1}}}</div>
<div class="slot-foo">{{{foo}}}</div>
```

In the template above we have defined two slots: '1' and 'foo'.

#### Placing child modules into slots

For flexibility there are several way to define which slot a child view should sit in. All the following examples are equivalent.

**Example 1:**

```js
var myView = new MyView();
var apple = new Apple();
var orange = new Orange();

myView
  .add(apple, { slot: 1 })
  .add(orange, { slot: 'foo' });
```

**Example 2:**

```js
var myView = new MyView();
var apple = new Apple();
var orange = new Orange();

myView
  .add(apple, 1)
  .add(orange, 'foo');
```

**Example 3:**

```js
var myView = new MyView({
  children: {
    1: {
      module: 'apple'
    },
    foo: {
      module: 'orange'
    }
  }
});
```

**Example 4:**

```js
var myView = new MyView();
var apple = new Apple({ slot: 1 });
var orange = new Orange({ slot: 'foo' });

myView
  .add(apple)
  .add(orange);
```

**Example 5:**

```js
var myView = new MyView({
  children: [
    {
      slot: 1,
      module: 'apple'
    },
    {
      slot: 'foo',
      module: 'orange'
    }
  ]
});
```

#### The resulting output

```html
<div class="slot-1"><div class="apple">...</div></div>
<div class="slot-foo"><div class="orange">...</div></div>
```