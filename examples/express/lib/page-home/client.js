var content = document.querySelector('.js-app_content');
var View = require('./view');

var database = {
	title: 'This is the Home page'
};

module.exports = function() {
	var view = View(database);
	view.render();
	view.inject(content);
};