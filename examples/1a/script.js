
/**
 * Layout
 */

var layout = {
	module: 'layout',
	model: {
		title: 'Example 1'
	},
	children: [
		{
			id: 'uniqueId1',
			module: 'apple'
		},
		{
			id: 'uniqueId2',
			module: 'orange'
		}
	]
};

/**
 * Usage
 */

// Create the FruitMachine View
var view = new FruitMachine.View(layout);

// Get some data from our database.
var articles = database.getSync();

// Set some data
// on module apple.
view
	.module('apple')
	.model.set({ items: articles });

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
view.module('apple').on('itemclick', setArticle);

/**
 * Methods
 */

function setArticle(id) {
	getFullArticleAsync(id, function(article) {
		var orange = view.module('orange');

		orange.model.set(article);

		orange
			.render()
			.setup();
	});
}