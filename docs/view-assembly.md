## View Assembly

When View modules are nested in one another a heiracical view structure is formed. For flexbibily *FruitMachine* allows nested views to be assembled in a variety of different ways.

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
    {
      module: 'apple',
      children: [
        {
          module: 'orange'
        }
      ]
    }
  ]
});

layout.children.length; //=> 1
apple.children.length; //=> 1
orange.children.length; //=> 0
```

#### Super lazy

```js
var layout = new FruitMachine.View({
  module: 'layout',
  children: [
    {
      id: 'layoutChild1',
      module: 'apple',
      children: [
        {
          id: 'appleChild1',
          module: 'orange'
        }
      ]
    }
  ]
});

layout.children.length; //=> 1
apple.children.length; //=> 1
orange.children.length; //=> 0
```

#### Removing modules

Sometimes you may wish to add or replace modules before the layout is rendered. This is a good use case for `.remove()`.

```js
var layout = new FruitMachine.View({
  module: 'layout',
  children: [
    {
      id: 'layoutChild1',
      module: 'apple',
      children: [
        {
          id: 'appleChild1',
          module: 'orange'
        }
      ]
    }
  ]
});

var apple = layout.module('apple');
var orange = layout.module('orange');
var banana = new Banana({ id: 'appleChild1' });

apple
  .remove(orange)
  .add(banana);
```