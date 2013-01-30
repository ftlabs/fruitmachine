var LayoutA = require('../layout-a');
var content = document.querySelector('.js-app_content');

var database = {
	title: 'This is the About page'
};

module.exports = function() {
	var view = new LayoutA();

	view.child('apple')
		.data({ title: database.title });

	view.render();
	view.inject(content);
};