
/*jslint browser:true, node:true*/

/**
 * FruitMachine Singleton
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

/**
 * Module Dependencies
 */

var fruitMachine = require('./fruitmachine');
var Model = require('model');

/**
 * Exports
 */

module.exports = fruitMachine({ Model: Model });