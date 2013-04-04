# Markup

When FruitMachine templates your View modules it passes some important data, on top of any data that you have explicitly declared yourself. This data contains any child View markup, and it's up to you to put it n the right place.

It gives you the following data:

- An array of child modules in the form of `children`.
- A variable for each child View in the form of the child's `id`.

This gives you the ability to print child html eactly where you want it, or to loop and print all children of the current View. If you don't print a module's child View's into the markup then they will not appear in your final view.

### Place child modules by `id`

The following example demonstrates how you can place child modules by `id`.

##### Create the view

```js
var apple = new Apple({ id: 'my_apple' });
var layout = new Layout();

// Add a child view
layout.add(apple)
```

##### Template markup

*layout.mustache*

```html
{{{my_apple}}}
```

*apple.mustache*

```html
I am Apple
```

**Remember:** FruitMachine creates the View module's root element for you, so your templates need only contain the markup for the module's contents.

##### Render

```js
layout.render();
layout.el.outerHTML;
//=> <div class="layout">
//     <div class="apple">I am Apple</div>
//   </div>
```

### Loop and place all child modules

In some cases the amount of child View modules is not known, we just want to render them all. The list.mustache template uses the special `children` (Array) and `child` (HTML string) keys to interate and print each View module's html. In this example we are using dummy `List`  and `Item` View constructors  

##### Create the view

```js
var list = new List();
var item1 = new Item({ data: { name: 'Wilson' } });
var item2 = new Item({ data: { name: 'Matt' } });
var item3 = new Item({ data: { name: 'Jim' } });

list
  .add(item1)
  .add(item2)
  .add(item3);
```

##### Template markup

*list.mustache*

```html
{{#children}}
  {{{child}}}
{{#children}}
```

**Note:** It's worth noting that within the scope of the loop, the current child's `data` is accessible. So `{{name}}`  within the `{{#children}}` loop would work.

*item.mustache*

```html
My name is {{name}}
```

##### Render

```js
layout.render();
layout.el.outerHTML;
//=> <div class="list">
//      <div class="item">My name is Wilson</div></div>
//      <div class="item">My name is Matt</div></div>
//      <div class="item">My name is Jim</div></div>
//   </div>
```

*NB: id attributes have been ommitted from markup examples for clarity*
