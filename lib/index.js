
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

// Module dependencies
var Store = require('./store');
var define = require('./define');
var View = require('./view');
var util = require('utils');
var extend = require('./extend');

/**
 * The main library namespace doubling
 * as a convenient alias for creating
 * new views.
 *
 * TODO:MA Would be just grand to be
 * able to pass in the model within
 * an options parameter.
 *
 * @param {Object} options
 */
function FruitMachine() {
  var self = this;
  self._store = new Store();

  function FruitMachineView(options) {
    return new View(self._store, options);
  }

  // HACK:MA I'm now doing this in
  // two places, it'd be nicer if this
  // were nicer.
  FruitMachineView.prototype = View.prototype;
  FruitMachineView.extend = View.extend;
  this.View = FruitMachineView;
}

FruitMachine.prototype.define = function(props) {
	return define(this._store, props);
};

/**
 * Expose an instance of 'FruitMachine'
 */

var fruitMachineInst = new FruitMachine();

fruitMachineInst.util = require('utils');
fruitMachineInst.Model = require('model');
fruitMachineInst.Events = require('event');
fruitMachineInst.config = require('./config').set;

module.exports = fruitMachineInst;