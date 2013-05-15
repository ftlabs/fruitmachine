var config = require('./config');
function Store() {
  this.modules = {};
  this.config = config;
}

module.exports = Store;