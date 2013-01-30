var View = require('./view');

var database = {
	title: 'This is the Home page'
};

/*
 * GET home page.
 */

module.exports = function(req, res){
	var view = View(database);
	res.expose(view.toJSON(), 'layout');
	res.render('wrapper', {
		title: 'Home',
		body: view.toHTML()
	});
};