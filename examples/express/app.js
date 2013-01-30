
/**
 * Module dependencies.
 */

var express = require('express');
var expose = require('express-expose');
var http = require('http');
var path = require('path');

global.Hogan = require('hogan.js').Template;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/server');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express['static'](path.join(__dirname, 'build')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', require('./server/page-home'));
app.get('/about', require('./server/page-about'));
app.get('/links', require('./server/page-links'));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
