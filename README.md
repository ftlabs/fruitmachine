# FruitMachine

A lightweight component layout engine for client and server. Currently powering the [FT Web App](http://apps.ft.com/ftwebapp/).

FruitMachine was designed to construct nested view layouts from strictly modular components. We wanted it to be as light and unopinionated as possible so that it could be applied to almost any layout problem.

```js
// Define a module
var Apple = fruitmachine.define({
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

## Installation

```
$ npm install fruitmachine
```

or

```
$ bower install fruitmachine
```

or

Download the [production version][min] (~3k gzipped) or the [development version][max].

[min]: fruitmachine/raw/master/build/fruitmachine.min.js
[max]: fruitmachine/raw/master/build/fruitmachine.js

## Examples

- [Article viewer](http://wilsonpage.github.io/fruitmachine/examples/1a/)
- [TODO](http://wilsonpage.github.io/fruitmachine/examples/todo/)

## Documentation

- [Introduction](fruitmachine/blob/master/docs/introduction.md)
- [Getting started](fruitmachine/blob/master/docs/getting-started.md)
- [Defining modules](fruitmachine/blob/master/docs/view-defining-modules.md)
- [Slots](fruitmachine/blob/master/docs/slots.md)
- [View assembly](fruitmachine/blob/master/docs/view-assembly.md)
- [Instantiation](fruitmachine/blob/master/docs/view-instantiation.md)
- [Templates](fruitmachine/blob/master/docs/view-templates.md)
- [Template markup](fruitmachine/blob/master/docs/view-template-markup.md)
- [Rendering](fruitmachine/blob/master/docs/view-rendering.md)
- [DOM injection](fruitmachine/blob/master/docs/view-injection.md)
- [El](fruitmachine/blob/master/docs/view-el.md)
- [Queries](fruitmachine/blob/master/docs/view-queries.md)
- [Helpers](fruitmachine/blob/master/docs/view-helpers.md)
- [Removing & destroying](fruitmachine/blob/master/docs/view-removing-and-destroying.md)
- [Extending](fruitmachine/blob/master/docs/view-extending.md)

## Tests

#### With PhantomJS

```
$ npm install
$ npm test
```

#### Without PhantomJS

```
$ node_modules/.bin/buster-static
```

Visit http://localhost:8282/ in browser

## Author

- **Wilson Page** - [@wilsonpage](http://github.com/wilsonpage)

## Contributors

- **Wilson Page** - [@wilsonpage](http://github.com/wilsonpage)
- **Matt Andrews** - [@matthew-andrews](http://github.com/matthew-andrews)

## License
Copyright (c) 2012 The Financial Times Limited
Licensed under the MIT license.

## Credits and collaboration

The lead developer of FTEllipsis is [Wilson Page](http://github.com/wilsonpage) at FT Labs. All open source code released by FT Labs is licenced under the MIT licence. We welcome comments, feedback and suggestions. Please feel free to raise an issue or pull request. Enjoy...