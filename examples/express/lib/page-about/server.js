var View = require('./view');

var database = {
	title: 'This is the About page'
};

/*
 * GET home page.
 */

module.exports = function(req, res){
	var view = View(database);
	res.expose(view.toJSON(), 'layout');
	res.render('wrapper', {
		title: 'About',
		body: view.toHTML()
	});
};