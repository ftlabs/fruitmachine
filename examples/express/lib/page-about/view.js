var fruitmachine = require('../../../../lib/');

// Require these views so that
// fruitmachine registers them
var LayoutA = require('../layout-a');
var ModuleApple = require('../module-apple');
var ModuleOrange = require('../module-orange');
var ModuleBanana = require('../module-banana');

module.exports = function(data) {
	var layout = {
		module: 'layout-a',
		children: [
			{
				id: 'slot_1',
				module: 'apple',
				data: {
					title: data.title
				}
			},
			{
				id: 'slot_2',
				module: 'banana'
			},
			{
				id: 'slot_3',
				module: 'orange'
			}
		]
	};

	return fruitmachine(layout);
};