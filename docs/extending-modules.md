## Extending

It is common in an application to have module's that share behavior, but are slightly different. In this case you can extend from modules you have already defined ([working example](http://ftlabs.github.io/fruitmachine/examples/extending)).

```js

var Apple = fruitmachine.define({
  name: 'apple',
  template: function(){ return ''; },
  initialize: function() {
    alert('we are similar');
  },
  setup: function() {
    alert('but i am an apple');
  }
});

var Pear = fruitmachine.define(
  Apple.extend({
    name: 'pear',
    template: function(){ return ''; },
    setup: function() {
      alert('and i am an pear');
    }
  })
);

var apple = new Apple();
//=> alert - 'we are similar'

var pear = new Pear();
//=> alert - 'we are similar'

apple
  .render()
  .appendTo(document.body);

pear
  .render()
  .appendTo(document.body);

apple.setup();
//=> alert - 'but i am an apple'

pear.setup();
//=> alert - 'but i am an pear'
```