
var myHelper = function(module) {

  // Add functionality
  module.on('before setup', function() { /* 1 */
    module.sayName = function() {
      alert ('My name is ' + module.name);
    };
  });

  // Tidy up
  module.on('teardown', function() {
    delete module.sayName;
  });
};

var Apple = fruitmachine.define({
  name: 'apple',
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