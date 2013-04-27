
/**
 * Usage
 */

// Create the FruitMachine View
var layout = new Layout({ model: { title: 'Example 1b' }});
var apple = new Apple({ id: 'uniqueId1' });
var orange = new Orange({ id: 'uniqueId2' });
var articles = database.getSync();

layout
	.add(apple)
	.add(orange);

// Set some data
// on module apple.
apple.model.set({ items: articles });

// Render the view,
// inject it into the
// DOM and call setup.
layout
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
		orange.model.set(article);
		orange
			.render()
			.setup();
	});
}