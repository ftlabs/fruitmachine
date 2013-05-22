
var Model = fruitmachine.Model;

/**
 * Usage
 */

// Create the fruitmachine View
var layout = new LayoutB();
var masthead = new Masthead({ model: { title: 'Todo' }});
var strawberry = new Strawberry();
var list = new List();
var collection = [];

layout
	.add(masthead, 1)
	.add(strawberry, 2)
	.add(list, 3)
	.on('submit', onSubmit)
	.on('closebuttonclick', onCloseButtonClick);

// Render the view,
// inject it into the
// DOM and call setup.
layout
	.render()
	.inject(document.getElementById('app'))
	.setup();


function onSubmit(value) {
	var model = new Model({ title: value });
	var item = new ListItem({ model: model }).render();

	list.add(item, { at: 0, inject: true });
	item.setup();

	collection.unshift(model);
}

function onCloseButtonClick(item) {
	var index = collection.indexOf(item.model);
	collection.splice(index, 1);
	this.event.target.remove();
}




