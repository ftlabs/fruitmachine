## Interactions

Not all modules need interaction or logic, but when they do FruitMachine has everything you need.

#### Setting up

```js
var Apple = fruitmachine.define({
  name: 'apple',
  template: function(){ return '<button>Click Me</button>'; },
  setup: function() {
    var self = this;
    this.button = this.el.querySelector('tear me down');
    this.onButtonClick = function() {
      alert('clicked');
    };

    this.button.addEventListener('click', this.onButtonClick);
  }
});

var apple = new Apple();

apple
  .render()
  .inject(document.body)
  .setup(); /* 1 */
```

1. *The button is now active*

#### Tearing down ([example](http://ftlabs.github.io/fruitmachine/example/interactions))

```js
var Apple = fruitmachine.define({
  name: 'apple',
  template: function(){ return '<button>Click Me</button>'; },
  setup: function() {
    var self = this;
    this.button = this.el.querySelector('tear me down');
    this.onButtonClick = function() {
      alert('tearing down');
      self.teardown(); /* 1 */
    };

    this.button.addEventListener('click', this.onButtonClick);
  },
  teardown: function() {
    this.button.removeEventListener('click', this.onButtonClick);
  }
});

var apple = new Apple();

apple
  .render()
  .inject(document.body)
  .setup(); /* 1 */
```

1. *Teardown is called when the button is clicked, removing the event listener*