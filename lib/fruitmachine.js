
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

/**
 * Module Dependencies
 */

var view = require('./view');
var define = require('./define');
var utils = require('utils');
var events = require('event');

/**
 * Creates a fruitmachine
 *
 * Options:
 *
 *  - `Model` A model constructor to use (must have `.toJSON()`)
 *
 * @param {Object} options
 */
module.exports = function(options) {

  /**
   * Shortcut method for
   * creating lazy views.
   *
   * @param  {Object} options
   * @return {View}
   */
  function fm(options) {
    var Module = fm.modules[options.module];
    if (Module) return new Module(options);
  }

  fm.Model = options.Model;
  fm.View = view(fm);
  fm.define = define(fm);
  fm.util = utils;
  fm.modules = {};
  fm.config = {
    templateIterator: 'children',
    templateInstance: 'child'
  };

  // Mixin events and return
  return events(fm);
};