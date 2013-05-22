
/**
 * Module Dependencies
 */

var Model = fruitmachine.Model;
var items = database.getSync();
var collection = new Collection(items);

/**
 * Locals
 */

var app = document.getElementById('app');
var button = document.getElementById('button');
var list1 = new List({ collection: collection });
var list2 = new List({ collection: collection });

list1
  .render()
  .appendTo(app)
  .setup()
  .on('closebuttonclick', onCloseButtonClick);

list2
  .render()
  .appendTo(app)
  .setup()
  .on('closebuttonclick', onCloseButtonClick);

function onCloseButtonClick() {
  var view = this.event.target;
  collection.remove(view.model);
}

// Button to add new items
button.addEventListener('click', function() {
  var l = collection.length + 1;
  collection.add({ id: l, title: "I'm item " + l });

  list1
    .render()
    .setup();

  list2
    .render()
    .setup();
});