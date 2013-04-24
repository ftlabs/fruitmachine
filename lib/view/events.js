
/**
 * Module Dependencies
 */

var events = require('event');

/**
 * Exports
 */

exports.on = function(name, module, cb) {

  // cb can be passed as
  // the second or third argument
  if (typeof module !== 'string') {
    cb = module;
    module = undefined;
  }

  // if a module is provided
  // pass in a special callback
  // function that checks the
  // module
  if (module) {
    events.prototype.on.call(this, name, function() {
      if (this.event.target.module() === module) {
        cb.apply(this, arguments);
      }
    });
  } else {
    events.prototype.on.call(this, name, cb);
  }

  return this;
};


exports.fire = function(name) {
  var parent = this.parent;

  this.event = this.event || {
    target: this,
    propagate: true,
    stopPropagation: function(){ this.propagate = false; }
  };

  // Trigger event
  events.prototype.fire.apply(this, arguments);

  // Trigger the same event on the parent view
  if (this.event.propagate && parent) {
    parent.event = this.event;
    this.fire.apply(parent, arguments);
  }

  // Remove the event reference
  delete this.event;

  // Allow chaining
  return this;
};

exports.fireStatic = events.prototype.fire;
exports.off = events.prototype.off;