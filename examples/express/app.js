
/**
 * Module dependencies.
 */

var express = require('express');
var expose = require('express-expose');
var http = require('http');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

global.Hogan = require('hogan.js').Template;

var app = express();
app = expose(app);

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/lib');
app.set('view engine', 'hjs');
app.use(morgan('dev'));
app.use(bodyParser());
app.use(methodOverride());

if (app.settings.env === 'development') {
  app.use(errorHandler());
}

app.get('/', require('./lib/page-home/server'));
app.get('/about', require('./lib/page-about/server'));
app.get('/links', require('./lib/page-links/server'));

app.use(express['static'](path.join(__dirname, 'build')));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
