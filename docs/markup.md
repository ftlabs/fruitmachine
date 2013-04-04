
# Markup

When FruitMachine templates your modules it passes some important data, on top of any data that you have explicitly declared yourself. You can use this data to place child View markup where you please. FruitMachine creates the module's root element for you, so your templates should only contain the markup for the module's contents.

It gives you:

- An array of child modules in the form of `children`.
- A variable for each child View in the form of the child's `id`.

This gives you the ability to print child html eactly where you want it, or to loop and print all children of the current view. If you don't print a modules child View's into the markup then they will not appear in your final view.

### Printing child modules by `id`

```js
var apple = new Apple({
	id: 'my_apple',
	data: {
		title: 'Apple Title'
	}
});

var layout = new Layout({});

layout.add(apple)
```

**Markup:**

```html
<div class="layout_slot-1">{{{my_apple}}}</div>
```

```html
<div class="apple_title">{{title}}</div>
```

**Render**

```js
layout.render();

layout.el.outerHTML;
//=> <div class='layout'>
//     <div class="layout_slot-1">
//       <div class="apple">
//         <div class="apple_title">Apple Title</div>
//       </div>
//     </div>
//   </div>
```
