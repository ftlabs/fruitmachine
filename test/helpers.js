var helpers = {};

/**
 * Templates
 */

var templates = helpers.templates = {
  'apple': Hogan.compile('{{{1}}}'),
  'layout': Hogan.compile('{{{1}}}{{{2}}}{{{3}}}'),
  'list': Hogan.compile('{{#children}}{{{child}}}{{/children}}'),
  'orange': Hogan.compile('{{text}}'),
  'pear': Hogan.compile('{{text}}')
};

/**
 * Module Definitions
 */

helpers.Views = {};

var Layout = helpers.Views.Layout = fruitmachine.define({
  name: 'layout',
  template: templates.layout,

  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {}
});

var Apple = helpers.Views.Apple = fruitmachine.define({
  name: 'apple',
  template: templates.apple,

  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {},
  foo: function() {
    this.fire("foo", "from apple");
  }
});

var List = helpers.Views.List = fruitmachine.define({
  name: 'list',
  template: templates.list,

  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {}
});

var Orange = helpers.Views.Orange = fruitmachine.define({
  name: 'orange',
  template: templates.orange,

  initialize: function() {},
  setup: function() {},
  teardown: function() {},
  destroy: function() {},
  foo: function() {
    this.fire("foo", "from orange");
  }
});

var Pear = helpers.Views.Pear = fruitmachine.define({
  name: 'pear',
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
  var layout = new Layout();
  var apple = new Apple({ slot: 1 });
  var orange = new Orange({ slot: 2 });
  var pear = new Pear({ slot: 3 });

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
  var el = document.createElement('div');
  return document.body.appendChild(el);
};

helpers.emptySandbox = function() {
  sandbox.innerHTML = '';
};

var sandbox = helpers.createSandbox();
