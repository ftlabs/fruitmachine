var FruitMachine = require('../../../../lib/fruitmachine');
var apple = require('../module-apple');
var template = require('./template');


module.exports = FruitMachine.module('layout-a', {
	template: template
});