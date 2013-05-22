## Server-side rendering

FruitMachine is able to work in exactly the same way on a Node server as on the client. Our [Express example](../examples/express) demonstrates this very simply. There are two items we must send down from the server: the rendered HTML embedded in the page, and a JSON representation of the module. Once we have those two parts we are able to 'inflate' the view, just as though it was rendered on the client. Here's how I might work with a fruitmachine layout on the server:

#### Define a module

```js
module.exports = fruitmachine.define({
  name: 'apple',
  template: appleTemplateFunction,
  setup: function() {
    alert("I'm alive!");
  }
});
```

#### Server

We create an instance of our Apple view, turn it to HTML and extract a json representation of it. We then send a string as the response that contains both parts.

```js
var Apple = require('./apple');

// Express style route handler
app.get('/', function(req, res) {
  var apple = new Apple();
  var html = apple.toHTML();
  var json = apple.toJSON();

  json = JSON.stringify(json);

  // Imagine this response is also
  // wrapped in usual document boilerplate
  // with FruitMachine on the page :)
  res.send('<script>window.json = ' + json + ';</script>' + html);
});
```

#### Client

Once on the client we can pass the JSON part directly into the `fruitmachine()` method to return a FruitMachine module. Calling setup fetches the module's element from the DOM and runs any custom setup logic (in this case our `alert` message).

```js
var module = fruitmachine(window.json);

module.setup();
//=> alerts "I'm alive!"

module.el;
//=> "[object HTMLDivElement]"
```