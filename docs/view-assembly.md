# View Assembly

When View modules are nested in one another a heiracical view structure is formed. For flexbibily *FruitMachine* allows nested views to be assembled in a variety of different ways.

### Manual

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

### Lazy

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

### Super lazy

```js
var layout = new FruitMachine.View({
  module: 'layout',
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


