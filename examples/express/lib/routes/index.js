var page = require('../pagejs');
var home = require('../page-home/client');
var about = require('../page-about/client');
var links = require('../page-links/client');

page('/', home);
page('/about', about);
page('/links', links);

page({ dispatch: false });