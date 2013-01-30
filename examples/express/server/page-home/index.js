//var FruitMachine = require('../../../lib/fruitmachine');
var LayoutA = require('../../client/layout-a');

var database = {
	title: 'This is the Home page'
};

/*
 * GET home page.
 */

module.exports = function(req, res){
	var view = new LayoutA();


	view.child('apple')
		.data('title', database.title);

	res.expose(view.toJSON(), 'layout');
	res.render('wrapper', { body: view.toHTML() });
};