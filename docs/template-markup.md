## Markup

When FruitMachine renders your modules by calling the template function, it passes some important data, in addition to any that you have explicitly declared yourself. This data includes the rendered markup from each of the module's child modules. It's up to your template function to put it in the right place.

It gives you the following data:

- An array of child modules in the form of `children`.
- A variable for each child View in the form of the child's `slot`.

This gives you the ability to print child HTML exactly where you want it, or to loop and print all children of the current View. If you don't print a module's child module's into the markup then they will not appear in the final HTML markup.

### Place child modules by `slot`

The following example demonstrates how you can place child modules by `slot`.

##### Template markup

*layout.mustache*

```html
{{{1}}}
```

In `Layout`'s template we print slots by name. In this case we have named our slot '1' so we have printed `{{{1}}}` into our template.

*apple.mustache*

```html
I am Apple
```

**Remember:** FruitMachine creates the module's root element for you, so your templates need only contain the markup for the module's contents.

##### Define modules

```js
var Layout = fruitmachine.define({
	name: 'layout',
	template: layoutTemplate
});

var Apple = fruitmachine.define({
	name: 'apple',
	template: appleTemplate
});
```

##### Create assemble modules

```js
var apple = new Apple();
var layout = new Layout();

// Add a child view
layout.add(apple, { slot: 1 });
```

We created an instance of our `Layout` module, then an instance of our `Apple` module. We then added the `apple` module as a child of the `layout` module. In the options object we defined which slot we wanted the `apple` module to sit in.

##### Render

```js
layout.render();
layout.el.outerHTML;
//=> <div class="layout">
//     <div class="apple">I am Apple</div>
//   </div>
```

### Loop and place all child modules

In some cases the number of child modules is not known, and we just want to render them all. The list.mustache template uses the special `children` (Array) and `child` (HTML string) keys to iterate and print each module's HTML. In this example we are using dummy `List` and `Item` module constructors.

##### Create the module

```js
var list = new List();
var item1 = new Item({ model: { name: 'Wilson' } });
var item2 = new Item({ model: { name: 'Matt' } });
var item3 = new Item({ model: { name: 'Jim' } });

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

**Note:** It's worth noting that within the scope of the loop, the current child's `model` is accessible. So `{{name}}`  within the `{{#children}}` loop would work.

*item.mustache*

```html
My name is {{name}}
```

##### Render

```js
layout.render();
layout.el.outerHTML;
//=> <div class="list">
//      <div class="item">My name is Wilson</div>
//      <div class="item">My name is Matt</div>
//      <div class="item">My name is Jim</div>
//   </div>
```

*NB: id attributes have been omitted from markup examples for clarity*
