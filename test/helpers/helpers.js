var helpers = {
  prototypes: {},
  configs: {},
  helpers: {}
};

/**
 * Templates
 */

var templates = {
  'apple': Hogan.compile('{{{my_child_module}}}'),
  'fruity-list': Hogan.compile('{{#children}}{{{child}}}{{/children}}'),
  'orange': Hogan.compile('{{text}}'),
  'pear': Hogan.compile('{{text}}')
};

FruitMachine.templates(function(module) {
  return templates[module];
});

/**
 * Views
 */

helpers.configs.pear = {
  module: 'pear',
  data: {
    text: 'pear text'
  }
};

helpers.configs.orange = {
  id: 'my_child_module',
  module: 'orange',
  data: {
    text: 'orange text'
  },
  children: [
    helpers.configs.pear
  ]
};

helpers.configs.apple = {
  module: 'apple',
  data: {
    text: 'a title'
  },
  children: [
    helpers.configs.orange
  ]
};

helpers.configs.fruityList = {
  module: 'fruity-list',
  children: []
};


helpers.helpers.example = {
  main: function(view) {
    view.on('initialize', helpers.helpers.example.initialize);
    view.on('setup', helpers.helpers.example.setup);
    view.on('teardown', helpers.helpers.example.teardown);
    view.on('destroy', helpers.helpers.example.destroy);
  },
  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {}
};





var interactions = {
  apple: {
    onInitialize: function() {

    },
    onSetup: function() {

    },
    onTeardown: function() {

    },
    onDestroy: function() {

    }
  }
};

helpers.prototypes.Apple = {
  module: 'apple',
  onInitialize: function() {},
  onSetup: function() {},
  onTeardown: function() {},
  onDestroy: function() {}
};

helpers.Apple = FruitMachine.module(helpers.prototypes.Apple);


helpers.createView = function() {
  this.view = new FruitMachine(helpers.configs.apple);
};

helpers.destroyView = function() {
  this.view.destroy();
  this.view = null;
};

helpers.sandbox = function() {
  document.body.insertAdjacentHTML('beforeend', '<div id="sandbox"></div>');
  return document.getElementById('sandbox');
};

helpers.sandbox.empty = function() {
  sandbox.innerHTML = '';
};


var sandbox = helpers.sandbox();