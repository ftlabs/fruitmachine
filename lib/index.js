
/*jslint browser:true, node:true*/

/**
 * FruitMachine
 *
 * Renders layouts/modules from a basic layout definition.
 * If views require custom interactions devs can extend
 * the basic functionality.
 *
 * @version 0.2.5
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @author Wilson Page <wilson.page@ft.com>
 */

'use strict';

/**
 * Module Dependencies
 */

var util = require('./util');
var events = require('./events');
var View = require('./view');
var Model =  require('./model');
var define =  require('./define');

/**
 * Exports
 */

FruitMachine.Events = events;
FruitMachine.View = View;
FruitMachine.Model = Model;
FruitMachine.define = FruitMachine.module = define;
FruitMachine.util = util;


// Version
FruitMachine.VERSION = '0.2.5';

/**
 * The main library namespace doubling
 * as a convenient alias for creating
 * new views.
 *
 * @param {Object} options
 */
function FruitMachine(options) {
  return new View(options);
}

/**
 * Expose 'FruitMachine'
 */

module.exports = FruitMachine;