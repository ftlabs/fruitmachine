
/**
 * Usage
 */

// Create the fruitmachine View
var layout = new LayoutA({ model: { title: 'Example 1b' }});
var masthead = new Masthead();
var apple = new Apple();
var orange = new Orange();
var articles = database.getSync();

layout
	.add(masthead, 1)
	.add(apple, 2)
	.add(orange, 3);

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
setArticle(articles[0].id);

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