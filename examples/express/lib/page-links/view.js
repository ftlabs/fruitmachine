var LayoutA = require('../layout-a');

module.exports = function(data) {
	var view = new LayoutA();

	view.child('apple')
		.data({ title: data.title });

	return view;
};