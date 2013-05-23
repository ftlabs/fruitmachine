## View Assembly

When View modules are nested, a hierarchical view structure is formed. For flexibility, *FruitMachine* allows nested views to be assembled in a variety of ways.

#### Manual

```js
var layout = new Layout();
var apple = new Apple();
var orange = new Orange();

apple.add(orange);
layout.add(apple);

layout.children.length; //=> 1
apple.children.length; //=> 1
orange.children.length; //=> 0
```

#### Lazy

```js
var layout = new Layout({
  children: [
    1: {
      module: 'apple',
      children: {
        1: {
          module: 'orange'
        }
      }
    }
  }
});

layout.children.length; //=> 1
apple.children.length; //=> 1
orange.children.length; //=> 0
```

#### Super lazy

```js
var layout = fruitmachine({
  module: 'layout',
  children: {
    1: {
      module: 'apple',
      children: {
        1: {
          module: 'orange'
        }
      }
    }
  }
});

layout.children.length; //=> 1
apple.children.length; //=> 1
orange.children.length; //=> 0
```

#### Removing modules

Sometimes you may wish to add or replace modules before the layout is rendered. This is a good use case for `.remove()`.

```js
var layout = fruitmachine({
  module: 'layout',
  children: [
    1: {
      module: 'apple',
      children: {
        1: {
          module: 'orange'
        }
      }
    }
  ]
});

var apple = layout.module('apple');
var orange = layout.module('orange');
var banana = new Banana();

apple
  .remove(orange)
  .add(banana, { slot: 1 });
```
