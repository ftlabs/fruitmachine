
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
FruitMachine.VERSION = '0.3.3';

// Public interface
FruitMachine.View = require('./view');
FruitMachine.Model = require('./model');
FruitMachine.Events = require('event');
FruitMachine.define = require('./define');
FruitMachine.util = require('./util');
FruitMachine.store = require('./store');
FruitMachine.config = require('./config').set;

/**
 * The main library namespace doubling
 * as a convenient alias for creating
 * new views.
 *
 * @param {Object} options
 */
function FruitMachine(options) {
  return new FruitMachine.View(options);
}

/**
 * Expose 'FruitMachine'
 */

module.exports = FruitMachine;