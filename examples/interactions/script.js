var Apple = FruitMachine.define({
  module: 'apple',
  template: function(){ return '<button>Click Me</button>'; },
  setup: function() {
    var self = this;
    this.button = this.el.querySelector('button');
    this.onButtonClick = function() {
      alert('tearing down');
      self.teardown();
    };

    this.button.addEventListener('click', this.onButtonClick);
  },
  teardown: function() {
    this.button.removeEventListener('click', this.onButtonClick);
  }
});

var apple = new Apple()
  .render()
  .inject(document.body)
  .setup();