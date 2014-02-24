# FruitMachine [![Build Status](https://travis-ci.org/ftlabs/fruitmachine.png?branch=master)](https://travis-ci.org/ftlabs/fruitmachine)

A lightweight component layout engine for client and server.

FruitMachine is designed to build rich interactive layouts from modular, reusable components. It's light and unopinionated so that it can be applied to almost any layout problem. FruitMachine is currently powering the [FT Web App](http://apps.ft.com/ftwebapp/).

```js
// Define a module
var Apple = fruitmachine.define({
  name: 'apple',
  template: function(){ return 'hello' }
});

// Create a module
var apple = new Apple();

// Render it
apple.render();

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

Download the [production version][min] (~2k gzipped) or the [development version][max].

[min]: http://github.com/ftlabs/fruitmachine/raw/master/build/fruitmachine.min.js
[max]: http://github.com/ftlabs/fruitmachine/raw/master/build/fruitmachine.js

## Examples

- [Article viewer](http://ftlabs.github.io/fruitmachine/examples/article-viewer/)
- [TODO](http://ftlabs.github.io/fruitmachine/examples/todo/)

## Documentation

- [Introduction](docs/introduction.md)
- [Getting started](docs/getting-started.md)
- [Defining modules](docs/defining-modules.md)
- [Slots](docs/slots.md)
- [View assembly](docs/layout-assembly.md)
- [Instantiation](docs/module-instantiation.md)
- [Templates](docs/templates.md)
- [Template markup](docs/template-markup.md)
- [Rendering](docs/rendering.md)
- [DOM injection](docs/injection.md)
- [The module element](docs/module-el.md)
- [Queries](docs/queries.md)
- [Helpers](docs/module-helpers.md)
- [Removing & destroying](docs/removing-and-destroying.md)
- [Extending](docs/extending-modules.md)
- [Server-side rendering](docs/server-side-rendering.md)
- [API](docs/api.md)
- [Events](docs/events.md)

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

...then visit http://localhost:8282/ in browser

## Author

- **Wilson Page** - [@wilsonpage](http://github.com/wilsonpage)

## Contributors

- **Wilson Page** - [@wilsonpage](http://github.com/wilsonpage)
- **Matt Andrews** - [@matthew-andrews](http://github.com/matthew-andrews)

## License
Copyright (c) 2012 The Financial Times Limited
Licensed under the MIT license.

## Credits and collaboration

The lead developer of FruitMachine is [Wilson Page](http://github.com/wilsonpage) at FT Labs. All open source code released by FT Labs is licenced under the MIT licence. We welcome comments, feedback and suggestions. Please feel free to raise an issue or pull request. Enjoy...