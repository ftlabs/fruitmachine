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
apple.render().inject(document.body);

apple.el.outerHTML;
//=> <div class="apple">hello</div>
```

## Examples

- [Article viewer](http://wilsonpage.github.io/fruitmachine/examples/1a/)
- [TODO](http://wilsonpage.github.io/fruitmachine/examples/todo/)

## Documentation

- [Introduction](https://github.com/wilsonpage/fruitmachine/tree/master/docs/introduction.md)
- [Getting started](https://github.com/wilsonpage/fruitmachine/tree/master/docs/getting-started.md)
- [Defining modules](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-defining-modules.md)
- [View assembly](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-assembly.md)
- [Instantiation](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-instantiation.md)
- [Queries](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-queries.md)
- [Templates](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-templates.md)
- [Template markup](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-template-markup.md)
- [Rendering](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-rendering.md)
- [El](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-el.md)
- [Helpers](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-helpers.md)
- [DOM injection](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-injection.md)
- [Removing & destroying](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-removing-and-destroying.md)
- [Extending](https://github.com/wilsonpage/fruitmachine/tree/master/docs/view-extending.md)

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