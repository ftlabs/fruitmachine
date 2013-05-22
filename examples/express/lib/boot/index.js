global.Hogan = require('hogan.js/lib/template').Template;
global.app = {};

var fruitmachine = require('../../../../lib/');
var routes = require('../routes');

app.view = fruitmachine(window.layout).setup();