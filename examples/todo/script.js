
var Model = FruitMachine.Model;
// var collection = {
// 	get: function() {
// 		if (collection.cache) return collection.cache;
// 		var items = JSON.parse(localStorage.items || '[]');
// 		items = items.map(function(item) { return new Model(item); });
// 		return collection.cache = items;
// 	},
// 	toJSON: function() {
// 		return collection.get().map(function(model) { return model.toJSON(); });
// 	},
// 	save: function(items) {
// 		collection.cache = items;
// 		localStorage.items = JSON.stringify(collection.toJSON());
// 	},
// 	add: function(item){
// 		var items = collection.get();
// 		items.unshift(new Model(item));
// 		collection.save(items);
// 	},
// 	remove: function(index) {
// 		var items = collection.get();
// 		items.splice(index, 1);
// 		collection.save(items);
// 	}
// };

/**
 * Usage
 */

// Create the FruitMachine View
var layout = new LayoutB();
var masthead = new Masthead({ id: 'child_1', model: { title: 'Example: Todo' }});
var strawberry = new Strawberry({ id: 'child_2' });
var list = new List({ id: 'child_3' });
var collection = [];

layout
	.add(masthead)
	.add(strawberry)
	.add(list)
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
	var model = new Model({ text: value });
	var item = new ListItem({ model: model });

	list
		.add(item)
		.render()
		.setup();

	collection.unshift(model);
}

function onCloseButtonClick(item) {
	var index = collection.indexOf(item.model);
	collection.splice(index, 1);
	this.event.target.remove();
}




