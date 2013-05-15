
/*jslint browser:true, node:true*/

/**
 * FruitMachine
 *
 * Renders layouts/modules from a basic layout definition.
 * If views require custom interactions devs can extend
 * the basic functionality.
 *
 * @version 0.3.3
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @author Wilson Page <wilson.page@ft.com>
 */

'use strict';

// Version
var VERSION = '0.3.3';

// External dependencies
var view = require('./view');
var define = require('./define');
var Store = require('./store');
var utils = require('utils');

/**
 * Express-style function for
 * creating FruitMachines.
 *
 * @param {Object} options
 */
function fruitMachine(options) {
  var store = new Store();
  var Model = options.Model;
  var View = view(store, Model);

  return {
    Model: Model,
    View: View,
    define: define(store, View),
    store: store,
    util: utils,
  };
}

fruitMachine.VERSION = VERSION;
module.exports = fruitMachine;