var page = require('../page-js');
var home = require('../page-home');
var about = require('../page-about');
var links = require('../page-links');

page('/', home);
page('/about', about);
page('/links', links);

page({ dispatch: false });