![fm logo](artwork/logo.jpg)

A lightweight modular layout engine for client and server. Currently powering the award winning FT Web App.

FruitMachine was designed to construct nested view layouts from strictly modular components. We wanted it to be as light and unopinionated as possible so that it could be applied to almost any layout problem.

```js
// Define a module
var Apple = FruitMachine.define({
  module: 'apple',
  template: function(){ return 'hello' }
});

// Create an instance
var apple = new Apple();

// Render & inject into DOM
apple
  .render()
  .inject(document.body);

apple.el.outerHTML;
//=> <div class="apple">hello</div>
```

## Examples

- [Article viewer](http://wilsonpage.github.io/fruitmachine/examples/1a/)
- [TODO](http://wilsonpage.github.io/fruitmachine/examples/todo/)

## Documentation

- [Introduction](tree/master/docs/introduction.md)
- [Getting started](tree/master/docs/getting-started.md)
- [Defining modules](tree/master/docs/view-defining-modules.md)
- [View assembly](tree/master/docs/view-assembly.md)
- [Instantiation](tree/master/docs/view-instantiation.md)
- [Queries](tree/master/docs/view-queries.md)
- [Templates](tree/master/docs/view-templates.md)
- [Template markup](tree/master/docs/view-template-markup.md)
- [Rendering](tree/master/docs/view-rendering.md)
- [El](tree/master/docs/view-el.md)
- [Helpers](tree/master/docs/view-helpers.md)
- [DOM injection](tree/master/docs/view-injection.md)
- [Removing & destroying](tree/master/docs/view-removing-and-destroying.md)
- [Extending](tree/master/docs/view-extending.md)

## Why not Backbone?

- No deps
- Can be retrofitted into a parts of a legacy system, it's not a religion
- Serverside has been considered from the start
- It doesn't care how you manage your data
- Modules are designed to be reused in multiple contexts, you create layouts, not fixed views
- A little more structured than Backbone

## Author

- **Wilson Page** - [@wilsonpage](http://github.com/wilsonpage)

## Contributors

- **Wilson Page** - [@wilsonpage](http://github.com/wilsonpage)
- **Matt Andrews** - [@matthew-andrews](http://github.com/matthew-andrews)


## License
Copyright (c) 2012 Wilson Page
Licensed under the MIT license.