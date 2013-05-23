
/*jslint browser:true, node:true, laxbreak:true*/

'use strict';

module.exports = function(fm) {

  /**
   * Defines a module.
   *
   * Options:
   *
   *  - `name {String}` the name of the module
   *  - `tag {String}` the tagName to use for the root element
   *  - `classes {Array}` a list of classes to add to the root element
   *  - `template {Function}` the template function to use when rendering
   *  - `helpers {Array}` a list of helpers to apply to the module
   *  - `initialize {Function}` custom logic to run when module instance created
   *  - `setup {Function}` custom logic to run when `.setup()` is called (directly or indirectly)
   *  - `teardown {Function}` custom logic to unbind/undo anything setup introduced (called on `.destroy()` and sometimes on `.setup()` to avoid double binding events)
   *  - `destroy {Function}` logic to permanently destroy all references
   *
   * @param  {Object|View} props
   * @return {View}
   * @public true
   */
  return function(props) {
    var Module = ('object' === typeof props)
      ? fm.Module.extend(props)
      : props;

    // Allow modules to be named
    // via 'name:' or 'module:'
    var proto = Module.prototype;
    var name = proto.name || proto._module;

    // Store the module by module type
    // so that module can be referred to
    // by just a string in layout definitions
    if (name) fm.modules[name] = Module;

    return Module;
  };
};
