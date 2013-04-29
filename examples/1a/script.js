
/**
 * Layout
 */

var layout = {
	module: 'layout-a',
	children: [
		{
			id: 'child_1',
			module: 'masthead',
			model: {
				title: 'Article viewer'
			}
		},
		{
			id: 'child_2',
			module: 'apple'
		},
		{
			id: 'child_3',
			module: 'orange'
		}
	]
};

/**
 * Usage
 */

// Create the FruitMachine View
var view = new FruitMachine.View(layout);
var apple = view.module('apple');

// Get some data from our database.
var articles = database.getSync();

// Set some data
// on module apple.
apple.model.set({ items: articles });

// Render the view,
// inject it into the
// DOM and call setup.
view
	.render()
	.inject(document.getElementById('app'))
	.setup();

// Make an async call for the first article data
setArticle(articles[0].articleId);

// Setup a listener on the 'apple' view.
apple.on('itemclick', setArticle);

/**
 * Methods
 */

function setArticle(id) {
	database.getAsync(id, function(article) {
		var orange = view.module('orange');

		orange.model.set(article);

		orange
			.render()
			.setup();
	});
}