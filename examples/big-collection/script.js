
/**
 * Module Dependencies
 */

var Model = FruitMachine.Model;
var len = 1000;
var items = [];

for (var i = 1; i <= len; i++) {
  items.push({ id: i, title: 'Item ' + i });
}

var collection = new Collection(items);

/**
 * Locals
 */

var app = document.getElementById('app');
var button = document.getElementById('button');
var layout = new LayoutB({
  children: {
    1: {
      module: 'masthead',
      data: {
        title: 'Big Collection'
      }
    },
    2: {
      module: 'list-2',
      collection: collection
    }
  }
});

layout
  .render()
  .inject(app)
  .setup();