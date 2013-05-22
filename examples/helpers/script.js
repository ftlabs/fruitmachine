
var myHelper = function(view) {

  // Add functionality
  view.on('before setup', function() { /* 1 */
    view.sayName = function() {
      alert ('My name is ' + view.module());
    };
  });

  // Tidy up
  view.on('teardown', function() {
    delete view.sayName;
  });
};

var Apple = fruitmachine.define({
  module: 'apple',
  template: function(){ return ''; },
  helpers: [
    myHelper
  ]
});

var apple = new Apple()
  .render()
  .inject(document.body)
  .setup();

apple.sayName();