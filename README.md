![fm logo](artwork/logo.jpg)

A lightweight modular layout engine for client and server.

A lightweight modular layout engine for client and server. Currently powering the award winning FT Web App.

```js
var Apple = FruitMachine.define({
  module: 'apple',
  template: function() { return 'hello' }
});

var apple = new Apple();

apple
  .render()
  .inject(document.body);

apple.el.outerHTML;
//=> <div class="apple">hello</div>
```

## Why not Backbone?

- No deps
- Can be retrofitted into a parts of a legacy system, it's not a religion
- Serverside has been considered from the start
- It doesn't care how you manage your data
- Modules are designed to be reused in multiple contexts, you create layouts, not fixed views
- A little more structured than Backbone

## Author

- **Wilson Page** &lt;wilsonpage@me.com&gt;

## Contributors

- **Wilson Page** [@wilsonpage](http://github.com/wilsonpage)
- **Matt Andrews** [@matthew-andrews](http://github.com/matthew-andrews)


## License
Copyright (c) 2012 Wilson Page
Licensed under the MIT license.