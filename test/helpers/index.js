var helpers = {};

/**
 * Templates
 */

var templates = helpers.templates = {
  'apple': Hogan.compile('{{{my_child_module}}}'),
  'layout': Hogan.compile('{{{slot_1}}}{{{slot_2}}}{{{slot_3}}}{{{1}}}'),
  'list': Hogan.compile('{{#children}}{{{child}}}{{/children}}'),
  'orange': Hogan.compile('{{text}}'),
  'pear': Hogan.compile('{{text}}')
};

/**
 * Module Definitions
 */

helpers.Views = {};

var Layout = helpers.Views.Layout = FruitMachine.define({
  module: 'layout',
  template: templates.layout,

  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {}
});

var Apple = helpers.Views.Apple = FruitMachine.define({
  module: 'apple',
  template: templates.apple,

  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {}
});

var List = helpers.Views.List = FruitMachine.define({
  module: 'list',
  template: templates.list,

  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {}
});

var Orange = helpers.Views.Orange = FruitMachine.define({
  module: 'orange',
  template: templates.orange,

  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {}
});

var Pear = helpers.Views.Pear = FruitMachine.define({
  module: 'pear',
  template: templates.pear,

  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {}
});

/**
 * Create View
 */

helpers.createView = function() {
  var layout = new Layout({});
  var apple = new Apple({ id: 'slot_1' });
  var orange = new Orange({ id: 'slot_2' });
  var pear = new Pear({ id: 'slot_3' });

  layout
    .add(apple)
    .add(orange)
    .add(pear);

  return this.view = layout;
};

/**
 * Destroy View
 */

helpers.destroyView = function() {
  this.view.destroy();
  this.view = null;
};

/**
 * Sandbox
 */

helpers.createSandbox = function() {
  document.body.insertAdjacentHTML('beforeend', '<div id="sandbox"></div>');
  return document.getElementById('sandbox');
};

helpers.sandbox = helpers.createSandbox();

helpers.emptySandbox = function() {
  helpers.sandbox.innerHTML = '';
};

