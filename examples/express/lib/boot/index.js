global.Hogan = require('hogan.js/lib/template').Template;
global.app = {};

var FruitMachine = require('../../../lib/fruitmachine');
var routes = require('../routes');

app.view = new FruitMachine(window.layout);