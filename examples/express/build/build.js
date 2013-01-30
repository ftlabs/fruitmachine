(function(){var require = function (file, cwd) {
    var resolved = require.resolve(file, cwd || '/');
    var mod = require.modules[resolved];
    if (!mod) throw new Error(
        'Failed to resolve module ' + file + ', tried ' + resolved
    );
    var cached = require.cache[resolved];
    var res = cached? cached.exports : mod();
    return res;
};

require.paths = [];
require.modules = {};
require.cache = {};
require.extensions = [".js",".coffee",".json"];

require._core = {
    'assert': true,
    'events': true,
    'fs': true,
    'path': true,
    'vm': true
};

require.resolve = (function () {
    return function (x, cwd) {
        if (!cwd) cwd = '/';
        
        if (require._core[x]) return x;
        var path = require.modules.path();
        cwd = path.resolve('/', cwd);
        var y = cwd || '/';
        
        if (x.match(/^(?:\.\.?\/|\/)/)) {
            var m = loadAsFileSync(path.resolve(y, x))
                || loadAsDirectorySync(path.resolve(y, x));
            if (m) return m;
        }
        
        var n = loadNodeModulesSync(x, y);
        if (n) return n;
        
        throw new Error("Cannot find module '" + x + "'");
        
        function loadAsFileSync (x) {
            x = path.normalize(x);
            if (require.modules[x]) {
                return x;
            }
            
            for (var i = 0; i < require.extensions.length; i++) {
                var ext = require.extensions[i];
                if (require.modules[x + ext]) return x + ext;
            }
        }
        
        function loadAsDirectorySync (x) {
            x = x.replace(/\/+$/, '');
            var pkgfile = path.normalize(x + '/package.json');
            if (require.modules[pkgfile]) {
                var pkg = require.modules[pkgfile]();
                var b = pkg.browserify;
                if (typeof b === 'object' && b.main) {
                    var m = loadAsFileSync(path.resolve(x, b.main));
                    if (m) return m;
                }
                else if (typeof b === 'string') {
                    var m = loadAsFileSync(path.resolve(x, b));
                    if (m) return m;
                }
                else if (pkg.main) {
                    var m = loadAsFileSync(path.resolve(x, pkg.main));
                    if (m) return m;
                }
            }
            
            return loadAsFileSync(x + '/index');
        }
        
        function loadNodeModulesSync (x, start) {
            var dirs = nodeModulesPathsSync(start);
            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                var m = loadAsFileSync(dir + '/' + x);
                if (m) return m;
                var n = loadAsDirectorySync(dir + '/' + x);
                if (n) return n;
            }
            
            var m = loadAsFileSync(x);
            if (m) return m;
        }
        
        function nodeModulesPathsSync (start) {
            var parts;
            if (start === '/') parts = [ '' ];
            else parts = path.normalize(start).split('/');
            
            var dirs = [];
            for (var i = parts.length - 1; i >= 0; i--) {
                if (parts[i] === 'node_modules') continue;
                var dir = parts.slice(0, i + 1).join('/') + '/node_modules';
                dirs.push(dir);
            }
            
            return dirs;
        }
    };
})();

require.alias = function (from, to) {
    var path = require.modules.path();
    var res = null;
    try {
        res = require.resolve(from + '/package.json', '/');
    }
    catch (err) {
        res = require.resolve(from, '/');
    }
    var basedir = path.dirname(res);
    
    var keys = (Object.keys || function (obj) {
        var res = [];
        for (var key in obj) res.push(key);
        return res;
    })(require.modules);
    
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key.slice(0, basedir.length + 1) === basedir + '/') {
            var f = key.slice(basedir.length);
            require.modules[to + f] = require.modules[basedir + f];
        }
        else if (key === basedir) {
            require.modules[to] = require.modules[basedir];
        }
    }
};

(function () {
    var process = {};
    var global = typeof window !== 'undefined' ? window : {};
    var definedProcess = false;
    
    require.define = function (filename, fn) {
        if (!definedProcess && require.modules.__browserify_process) {
            process = require.modules.__browserify_process();
            definedProcess = true;
        }
        
        var dirname = require._core[filename]
            ? ''
            : require.modules.path().dirname(filename)
        ;
        
        var require_ = function (file) {
            var requiredModule = require(file, dirname);
            var cached = require.cache[require.resolve(file, dirname)];

            if (cached && cached.parent === null) {
                cached.parent = module_;
            }

            return requiredModule;
        };
        require_.resolve = function (name) {
            return require.resolve(name, dirname);
        };
        require_.modules = require.modules;
        require_.define = require.define;
        require_.cache = require.cache;
        var module_ = {
            id : filename,
            filename: filename,
            exports : {},
            loaded : false,
            parent: null
        };
        
        require.modules[filename] = function () {
            require.cache[filename] = module_;
            fn.call(
                module_.exports,
                require_,
                module_,
                module_.exports,
                dirname,
                filename,
                process,
                global
            );
            module_.loaded = true;
            return module_.exports;
        };
    };
})();


require.define("path",function(require,module,exports,__dirname,__filename,process,global){function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

});

require.define("__browserify_process",function(require,module,exports,__dirname,__filename,process,global){var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
        && window.setImmediate;
    var canPost = typeof window !== 'undefined'
        && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'browserify-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('browserify-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    if (name === 'evals') return (require)('vm')
    else throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    process.cwd = function () { return cwd };
    process.chdir = function (dir) {
        if (!path) path = require('path');
        cwd = path.resolve(dir, cwd);
    };
})();

});

require.define("/examples/express/node_modules/hogan.js/lib/template.js",function(require,module,exports,__dirname,__filename,process,global){/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = {};

(function (Hogan, useArrayBuffer) {
  Hogan.Template = function (renderFunc, text, compiler, options) {
    this.r = renderFunc || this.r;
    this.c = compiler;
    this.options = options;
    this.text = text || '';
    this.buf = (useArrayBuffer) ? [] : '';
  }

  Hogan.Template.prototype = {
    // render: replaced by generated code.
    r: function (context, partials, indent) { return ''; },

    // variable escaping
    v: hoganEscape,

    // triple stache
    t: coerceToString,

    render: function render(context, partials, indent) {
      return this.ri([context], partials || {}, indent);
    },

    // render internal -- a hook for overrides that catches partials too
    ri: function (context, partials, indent) {
      return this.r(context, partials, indent);
    },

    // tries to find a partial in the curent scope and render it
    rp: function(name, context, partials, indent) {
      var partial = partials[name];

      if (!partial) {
        return '';
      }

      if (this.c && typeof partial == 'string') {
        partial = this.c.compile(partial, this.options);
      }

      return partial.ri(context, partials, indent);
    },

    // render a section
    rs: function(context, partials, section) {
      var tail = context[context.length - 1];

      if (!isArray(tail)) {
        section(context, partials, this);
        return;
      }

      for (var i = 0; i < tail.length; i++) {
        context.push(tail[i]);
        section(context, partials, this);
        context.pop();
      }
    },

    // maybe start a section
    s: function(val, ctx, partials, inverted, start, end, tags) {
      var pass;

      if (isArray(val) && val.length === 0) {
        return false;
      }

      if (typeof val == 'function') {
        val = this.ls(val, ctx, partials, inverted, start, end, tags);
      }

      pass = (val === '') || !!val;

      if (!inverted && pass && ctx) {
        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
      }

      return pass;
    },

    // find values with dotted names
    d: function(key, ctx, partials, returnFound) {
      var names = key.split('.'),
          val = this.f(names[0], ctx, partials, returnFound),
          cx = null;

      if (key === '.' && isArray(ctx[ctx.length - 2])) {
        return ctx[ctx.length - 1];
      }

      for (var i = 1; i < names.length; i++) {
        if (val && typeof val == 'object' && names[i] in val) {
          cx = val;
          val = val[names[i]];
        } else {
          val = '';
        }
      }

      if (returnFound && !val) {
        return false;
      }

      if (!returnFound && typeof val == 'function') {
        ctx.push(cx);
        val = this.lv(val, ctx, partials);
        ctx.pop();
      }

      return val;
    },

    // find values with normal names
    f: function(key, ctx, partials, returnFound) {
      var val = false,
          v = null,
          found = false;

      for (var i = ctx.length - 1; i >= 0; i--) {
        v = ctx[i];
        if (v && typeof v == 'object' && key in v) {
          val = v[key];
          found = true;
          break;
        }
      }

      if (!found) {
        return (returnFound) ? false : "";
      }

      if (!returnFound && typeof val == 'function') {
        val = this.lv(val, ctx, partials);
      }

      return val;
    },

    // higher order templates
    ho: function(val, cx, partials, text, tags) {
      var compiler = this.c;
      var options = this.options;
      options.delimiters = tags;
      var text = val.call(cx, text);
      text = (text == null) ? String(text) : text.toString();
      this.b(compiler.compile(text, options).render(cx, partials));
      return false;
    },

    // template result buffering
    b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
                          function(s) { this.buf += s; },
    fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
                           function() { var r = this.buf; this.buf = ''; return r; },

    // lambda replace section
    ls: function(val, ctx, partials, inverted, start, end, tags) {
      var cx = ctx[ctx.length - 1],
          t = null;

      if (!inverted && this.c && val.length > 0) {
        return this.ho(val, cx, partials, this.text.substring(start, end), tags);
      }

      t = val.call(cx);

      if (typeof t == 'function') {
        if (inverted) {
          return true;
        } else if (this.c) {
          return this.ho(t, cx, partials, this.text.substring(start, end), tags);
        }
      }

      return t;
    },

    // lambda replace variable
    lv: function(val, ctx, partials) {
      var cx = ctx[ctx.length - 1];
      var result = val.call(cx);

      if (typeof result == 'function') {
        result = coerceToString(result.call(cx));
        if (this.c && ~result.indexOf("{\u007B")) {
          return this.c.compile(result, this.options).render(cx, partials);
        }
      }

      return coerceToString(result);
    }

  };

  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos =/\'/g,
      rQuot = /\"/g,
      hChars =/[&<>\"\']/;


  function coerceToString(val) {
    return String((val === null || val === undefined) ? '' : val);
  }

  function hoganEscape(str) {
    str = coerceToString(str);
    return hChars.test(str) ?
      str
        .replace(rAmp,'&amp;')
        .replace(rLt,'&lt;')
        .replace(rGt,'&gt;')
        .replace(rApos,'&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }

  var isArray = Array.isArray || function(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };

})(typeof exports !== 'undefined' ? exports : Hogan);


});

require.define("/lib/fruitmachine.js",function(require,module,exports,__dirname,__filename,process,global){/**
 * FruitMachine
 *
 * Renders layouts/modules from a basic layout definition.
 * If views require custom interactions devs can extend
 * the basic functionality.
 *
 * Example:
 *
 *   var definition = {
 *     module: 'orange',
 *     data: {
 *       title: 'A title',
 *       body: 'Some body copy'
 *     }
 *   };
 *
 *   var view = new FruitMachine.View(definition);
 *
 *   view
 *     .render()
 *     .inject(document.body)
 *     .setup();
 *
 * @version 0.1.0
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @author Wilson Page <wilson.page@ft.com>
 */

/*jslint browser:true, node:true*/
(function() {
  'use strict';

  /**
   * VIEW
   */

  var FruitMachine = function(options) {
    options = options || {};
    if (options.module) return create(options);
    this._configure(options);
    this.add(options.views || this.views);
    this.onInitialize(options);
  };

  // Current Version
  FruitMachine.VERSION = '0.0.1';

  // Global data store
  var store = {
    modules: {},
    templates: {},
    helpers: {}
  };

  // Utilities
  var util = FruitMachine.util = {

    bind: function(method, context) {
      return function() { return method.apply(context, arguments); };
    },

    bindAll: function(ob, context) {
      for (var key in ob) {
        if ('function' === typeof ob[key]) {
          ob[key] = util.bind(ob[key], context);
        }
      }
    },

    mixin: function(original) {
      // Loop over every argument after the first.
      slice.call(arguments, 1).forEach(function(source) {
        for (var prop in source) {
          original[prop] = source[prop];
        }
      });
      return original;
    },

    /**
     * Inserts a child element into the
     * stated parent element. The child is
     * appended unless an index is stated.
     *
     * @param  {Element} child
     * @param  {Element} parent
     * @param  {Number} index
     * @return void
     */

    insertChild: function(child, parent, index) {
      if (!parent) return;
      if (typeof index !== 'undefined') {
        parent.insertBefore(child, parent.children[index]);
      } else {
        parent.appendChild(child);
      }
    },

    /**
     * Inserts an item into an array.
     * Has the option to state an index.
     *
     * @param  {*} item
     * @param  {Array} array
     * @param  {Number} index
     * @return void
     */

    insert: function(item, array, index) {
      if (typeof index !== 'undefined') {
        array.splice(index, 0, item);
      } else {
        array.push(item);
      }
    },

    uniqueId: (function() {
      var i = 0;
      return function(prefix, suffix) {
        prefix = prefix || 'id';
        suffix = suffix || 'a';
        return [prefix, (++i) * Math.round(Math.random() * 100000), suffix].join('-');
      };
    }())
  };

  // Create local references to some methods
  var slice = Array.prototype.slice;
  var concat = Array.prototype.concat;
  var has = Object.prototype.hasOwnProperty;
  var mixin = util.mixin;

  var splitter = /\s+/;
  var Events = FruitMachine.Events = {

    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) return this;
      events = events.split(splitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      event = events.shift();
      while (event) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
        event = events.shift();
      }

      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) return;
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(splitter) : Object.keys(calls);
      while (event = events.shift()) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) continue;
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        while ((node = node.next) !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls.all;
      events = events.split(splitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        if (node = calls[event]) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }

        if (node = all) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
      }

      return this;
    }
  };


  FruitMachine.helper = function(name, helper) {
    store.helpers[name] = helper(FruitMachine);
  };


  var getTemplate = function(module) {
    return store.templates[module];
  };

  /**
   * Registers templates, or overwrites
   * the `getTemplate` method with a
   * custom template getter function.
   *
   * @param  {Object|Function} templates
   * @return void
   */
  FruitMachine.templates = function(templates) {
    var type = typeof templates;
    if ('object' === type) mixin(store.templates, templates);
    else if ('function' === type) getTemplate = templates;
  };

  // Manages helpers
  var helper = {
    attach: function(helper) {
      var Helper = store.helpers[helper];
      if (!Helper) return;
      if ('function' === typeof Helper) {
        return this[helper] = new Helper(this);
      } else {
        return mixin(this, Helper);
      }
    },

    setup: function(helper) {
      if (!helper.onSetup) return;
      helper.onSetup();
    },

    teardown: function(helper) {
      if (!helper.onTeardown) return;
      helper.onTeardown();
    }
  };

  // Factory method
  function create(options) {
    var Module = store.modules[options.module] || FruitMachine;
    options._module = options.module;
    delete options.module;
    return new Module(options);
  }

  // Extend the prototype
  mixin(FruitMachine.prototype, Events, {

    _configure: function(options) {
      this._id = options.id || util.uniqueId('auto_');
      this._fmid = options.fmid || util.uniqueId('fmid');
      this.module = this.module || options._module;
      this._lookup = {};
      this._children = [];
      this._data = options.data || {};

      // Use the template defined on
      // the custom view, or use the
      // template getter.
      this.template = this.template || getTemplate(this.module);

      // Upgrade helpers
      this.helpers = (this.helpers || []).map(helper.attach, this);
    },

    onInitialize: function() {},
    onSetup: function() {},
    onTeardown: function() {},
    onDestroy: function() {},

    add: function(views, options) {
      var at = options && options.at;
      var insert = options && options.insert;
      var view;

      if (!views) return;

      // Make sure it's an array
      views = [].concat(views);

      for (var i = 0, l = views.length; i < l; i++) {
        view = views[i];
        if (!(view instanceof FruitMachine)) view = new FruitMachine(view);

        util.insert(view, this._children, at);
        this.addLookup(view);
        view.parent = this;

        // We append the child to the parent view if there is a view
        // element and the users hasn't flagged `append` false.
        if (insert) this.insertChildEl(view.el(), options);
      }

      return this;
    },

    insertChildEl: function(el, options) {
      var at = options && options.at;
      var parent = this.el();

      if (!el || !parent) return;

      if (typeof at !== 'undefined') {
        parent.insertBefore(el, parent.children[at]);
      } else {
        parent.appendChild(el);
      }
    },

    addLookup: function(child) {
      this._lookup[child.id()] = child;
      this._lookup[child.module] = this._lookup[child.module] || [];
      this._lookup[child.module].push(child);
    },

    id: function(id) {
      return id ? this._lookup[id] : this._id;
    },

    child: function(name) {
      return this._lookup[name][0];
    },

    children: function(name) {
      return name ? this._lookup[name] : this._children;
    },

    fmid: function() {
      return this._fmid;
    },

    toHTML: function() {
      var data = {};
      var children = this.children();
      var child, html;
      data.children = [];

      if (!this.template) return console.log('FM - No template for %s', this.module);

      for (var i = 0, l = children.length; i < l; i++) {
        child = children[i];
        html = child.toHTML();
        data[child.id()] = html;
        data.children.push({ child: html });
      }

      data.fm_attrs = 'id="' + this.fmid() + '"';
      return this._html = this.template.render(mixin(data, this.data()));
    },

    render: function() {
      return this.update();
    },

    setup: function(options) {
      var shallow = options && options.shallow;
      var children = this.children();

      // Call 'setup' on all subviews
      // first (bottom up recursion).
      if (!shallow) {
        for (var i = 0, l = children.length; i < l; i++) {
          children[i].setup();
        }
      }

      // If this is already setup, call
      // `teardown` first so that we don't
      // duplicate event bindings and shizzle.
      if (this.isSetup) this.teardown({ shallow: true });

      // Setup any helpers
      this.helpers.forEach(helper.setup, this);

      this.onSetup();
      this.trigger('setup');
      this.isSetup = true;

      // For chaining
      return this;
    },

    teardown: function(options) {
      var shallow = options && options.shallow;
      var children = this.children();

      // Call 'setup' on all subviews
      // first (bottom up recursion).
      if (!shallow) {
        for (var i = 0, l = children.length; i < l; i++) {
          children[i].teardown();
        }
      }

      // Teardown any helpers
      this.helpers.forEach(helper.teardown, this);

      this.trigger('teardown');
      this.onTeardown();
      this.isSetup = false;

      // For chaining
      return this;
    },

    destroy: function(options) {

      // Recursively run on children
      // first (bottom up).
      //
      // We don't waste time removing
      // the child elements as they will
      // get removed when the parent
      // element is removed.
      while (this._children.length) {
        this._children[0].destroy({ remove: false });
      }

      // Run teardown so custom
      // views can bind logic to it
      this.teardown(options);

      // Detach this view from its
      // parent and unless otherwise
      // stated, from the DOM.
      this._detach(options);

      // Trigger a destroy event
      // for custom Views to bind to.
      this.trigger('destroy');
      this.onDestroy();

      // Set a flag to say this view
      // has been destroyed. This is
      // useful to check for after a
      // slow ajax call that might come
      // back after a view has been detroyed.
      this.destroyed = true;

      // Clear references
      this._el = this.module = this._id = this._lookup = null;
    },

    remove: function() {
      var el = this.el();
      if (el && el.parentNode) el.parentNode.removeChild(el);
    },

    _detach: function(options) {
      var remove = options && options.skipEl;
      var i;

      // Remove the view el from the DOM
      if (remove !== false) this.remove();

      // If there is no parent view reference, return here.
      if (!this.parent) return this;

      // Remove reference from children array
      i = this.parent._children.indexOf(this);
      this.parent._children.splice(i, 1);

      // Remove references from the lookup
      i = this.parent._lookup[this.module].indexOf(this);
      this.parent._lookup[this.module].splice(i, 1);
      delete this.parent._lookup[this._id];

      // Return the detached view instance.
      return this;
    },

    parentEl: function() {
      var view = this.parent;
      while (view && !view._el && view.parent) view = view.parent;
      return view._el;
    },

    el: function() {
      if (typeof document === 'undefined') return;
      //var parentEl = this.parentEl();
      //if (parentEl) parentEl.querySelector(this.fmid());
      return this._el = (this._el || document.getElementById(this.fmid()));
    },

    /**
     * A single method for getting
     * and setting view data.
     *
     * Example:
     *
     *   // Getters
     *   var all = view.data();
     *   var one = view.data('myKey');
     *
     *   // Setters
     *   view.data('myKey', 'my value');
     *   view.data({
     *     myKey: 'my value',
     *     anotherKey: 10
     *   });
     *
     * @param  {String|Object|null} key
     * @param  {*} value
     * @return {*}
     */

    data: function(key, value) {

      // If no key and no value have
      // been passed then return the
      // entire data store.
      if (!key && !value) {
        return this._data;
      }

      // If a string key has been
      // passed, but no value
      if (typeof key === 'string' && !value) {
        return this._data[key];
      }

      // If the user has stated a key
      // and a value. Set the value on
      // the key.
      if (key && value) {
        this._data[key] = value;
        this.trigger('datachange', key, value);
        this.trigger('datachange:' + key, value);
        return this;
      }

      // If the key is an object literal
      // then we extend the data store with it.
      if ('object' === typeof key) {
        mixin(this._data, key);
        this.trigger('datachange');
        for (var prop in key) this.trigger('datachange:' + prop, key[prop]);
        return this;
      }
    },

    update: function() {
      var current = this.el();
      var replacement = this.toNode();

      if (!current) {
        this._el = replacement;
        return this;
      }

      current.parentNode.replaceChild(replacement, current);
      this._el = replacement;
      return this;
    },

    toNode: function() {
      var el = document.createElement('div');
      el.innerHTML = this.toHTML();
      return el.firstElementChild;
    },

    inject: function(dest) {
      var el = this.el();
      if (!el) return;
      dest.innerHTML = '';
      dest.appendChild(el);
      return this;
    },

    toJSON: function() {
      var json = {};
      var views = this.children();
      json.views = [];

      // Recurse
      for (var i = 0, l = views.length; i < l; i++) {
        json.views.push(views[i].toJSON());
      }

      json.id = this.id();
      json.fmid = this.fmid();
      json.module = this.module;
      json.data = this.data();
      return json;
    }
  });

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  FruitMachine.inherit = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && has.call(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    mixin(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) mixin(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // We add the 'extend' static method to the FruitMachine base
  // class. This allows you to extend the default View class
  // to add custom insteractions and logic to more complex modules.
  // Redefining any of the View.prototype methods will overwrite them.
  FruitMachine.module = function(type, props) {
    if ('string' === typeof type) {
      props.module = type;
      return store.modules[type] = FruitMachine.inherit(props);
    } else if ('object' === typeof type) {
      return FruitMachine.inherit(type);
    }
  };

  // Expose the library
  if (typeof exports === "object") {
    module.exports = FruitMachine;
  } else if (typeof define === "function" && define.amd) {
    define(FruitMachine);
  } else {
    window['FruitMachine'] = FruitMachine;
  }
}());
});

require.define("/examples/express/lib/routes/index.js",function(require,module,exports,__dirname,__filename,process,global){var page = require('../pagejs');
var home = require('../page-home/client');
var about = require('../page-about/client');
var links = require('../page-links/client');

page('/', home);
page('/about', about);
page('/links', links);

page({ dispatch: false });
});

require.define("/examples/express/lib/pagejs/index.js",function(require,module,exports,__dirname,__filename,process,global){;(function(){

  /**
   * Perform initial dispatch.
   */

  var dispatch = true;

  /**
   * Base path.
   */

  var base = '';

  /**
   * Running flag.
   */

  var running;

  /**
   * Register `path` with callback `fn()`,
   * or route `path`, or `page.start()`.
   *
   *   page(fn);
   *   page('*', fn);
   *   page('/user/:id', load, user);
   *   page('/user/' + user.id, { some: 'thing' });
   *   page('/user/' + user.id);
   *   page();
   *
   * @param {String|Function} path
   * @param {Function} fn...
   * @api public
   */

  function page(path, fn) {
    // <callback>
    if ('function' == typeof path) {
      return page('*', path);
    }

    // route <path> to <callback ...>
    if ('function' == typeof fn) {
      var route = new Route(path);
      for (var i = 1; i < arguments.length; ++i) {
        page.callbacks.push(route.middleware(arguments[i]));
      }
    // show <path> with [state]
    } else if ('string' == typeof path) {
      page.show(path, fn);
    // start [options]
    } else {
      page.start(path);
    }
  }

  /**
   * Callback functions.
   */

  page.callbacks = [];

  /**
   * Get or set basepath to `path`.
   *
   * @param {String} path
   * @api public
   */

  page.base = function(path){
    if (0 == arguments.length) return base;
    base = path;
  };

  /**
   * Bind with the given `options`.
   *
   * Options:
   *
   *    - `click` bind to click events [true]
   *    - `popstate` bind to popstate [true]
   *    - `dispatch` perform initial dispatch [true]
   *
   * @param {Object} options
   * @api public
   */

  page.start = function(options){
    options = options || {};
    if (running) return;
    running = true;
    if (false === options.dispatch) dispatch = false;
    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
    if (false !== options.click) window.addEventListener('click', onclick, false);
    if (!dispatch) return;
    page.replace(location.pathname + location.search, null, true, dispatch);
  };

  /**
   * Unbind click and popstate event handlers.
   *
   * @api public
   */

  page.stop = function(){
    running = false;
    removeEventListener('click', onclick, false);
    removeEventListener('popstate', onpopstate, false);
  };

  /**
   * Show `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */

  page.show = function(path, state){
    var ctx = new Context(path, state);
    page.dispatch(ctx);
    if (!ctx.unhandled) ctx.pushState();
    return ctx;
  };

  /**
   * Replace `path` with optional `state` object.
   *
   * @param {String} path
   * @param {Object} state
   * @return {Context}
   * @api public
   */

  page.replace = function(path, state, init, dispatch){
    var ctx = new Context(path, state);
    ctx.init = init;
    if (null == dispatch) dispatch = true;
    if (dispatch) page.dispatch(ctx);
    ctx.save();
    return ctx;
  };

  /**
   * Dispatch the given `ctx`.
   *
   * @param {Object} ctx
   * @api private
   */

  page.dispatch = function(ctx){
    var i = 0;

    function next() {
      var fn = page.callbacks[i++];
      if (!fn) return unhandled(ctx);
      fn(ctx, next);
    }

    next();
  };

  /**
   * Unhandled `ctx`. When it's not the initial
   * popstate then redirect. If you wish to handle
   * 404s on your own use `page('*', callback)`.
   *
   * @param {Context} ctx
   * @api private
   */

  function unhandled(ctx) {
    if (window.location.pathname + window.location.search == ctx.canonicalPath) return;
    page.stop();
    ctx.unhandled = true;
    window.location = ctx.canonicalPath;
  }

  /**
   * Initialize a new "request" `Context`
   * with the given `path` and optional initial `state`.
   *
   * @param {String} path
   * @param {Object} state
   * @api public
   */

  function Context(path, state) {
    if ('/' == path[0] && 0 != path.indexOf(base)) path = base + path;
    var i = path.indexOf('?');
    this.canonicalPath = path;
    this.path = path.replace(base, '') || '/';
    this.title = document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? path.slice(i + 1) : '';
    this.pathname = ~i ? path.slice(0, i) : path;
    this.params = [];
  }

  /**
   * Expose `Context`.
   */

  page.Context = Context;

  /**
   * Push state.
   *
   * @api private
   */

  Context.prototype.pushState = function(){
    history.pushState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Save the context state.
   *
   * @api public
   */

  Context.prototype.save = function(){
    history.replaceState(this.state, this.title, this.canonicalPath);
  };

  /**
   * Initialize `Route` with the given HTTP `path`,
   * and an array of `callbacks` and `options`.
   *
   * Options:
   *
   *   - `sensitive`    enable case-sensitive routes
   *   - `strict`       enable strict matching for trailing slashes
   *
   * @param {String} path
   * @param {Object} options.
   * @api private
   */

  function Route(path, options) {
    options = options || {};
    this.path = path;
    this.method = 'GET';
    this.regexp = pathtoRegexp(path
      , this.keys = []
      , options.sensitive
      , options.strict);
  }

  /**
   * Expose `Route`.
   */

  page.Route = Route;

  /**
   * Return route middleware with
   * the given callback `fn()`.
   *
   * @param {Function} fn
   * @return {Function}
   * @api public
   */

  Route.prototype.middleware = function(fn){
    var self = this;
    return function(ctx, next){
      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
      next();
    }
  };

  /**
   * Check if this route matches `path`, if so
   * populate `params`.
   *
   * @param {String} path
   * @param {Array} params
   * @return {Boolean}
   * @api private
   */

  Route.prototype.match = function(path, params){
    var keys = this.keys
      , qsIndex = path.indexOf('?')
      , pathname = ~qsIndex ? path.slice(0, qsIndex) : path
      , m = this.regexp.exec(pathname);

    if (!m) return false;

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = keys[i - 1];

      var val = 'string' == typeof m[i]
        ? decodeURIComponent(m[i])
        : m[i];

      if (key) {
        params[key.name] = undefined !== params[key.name]
          ? params[key.name]
          : val;
      } else {
        params.push(val);
      }
    }

    return true;
  };

  /**
   * Normalize the given path string,
   * returning a regular expression.
   *
   * An empty array should be passed,
   * which will contain the placeholder
   * key names. For example "/user/:id" will
   * then contain ["id"].
   *
   * @param  {String|RegExp|Array} path
   * @param  {Array} keys
   * @param  {Boolean} sensitive
   * @param  {Boolean} strict
   * @return {RegExp}
   * @api private
   */

  function pathtoRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  };

  /**
   * Handle "populate" events.
   */

  function onpopstate(e) {
    if (e.state) {
      var path = e.state.path;
      page.replace(path, e.state);
    }
  }

  /**
   * Handle "click" events.
   */

  function onclick(e) {
    if (1 != which(e)) return;
    if (e.defaultPrevented) return;
    var el = e.target;
    while (el && 'A' != el.nodeName) el = el.parentNode;
    if (!el || 'A' != el.nodeName) return;
    var href = el.href;
    var path = el.pathname + el.search;
    if (el.hash || '#' == el.getAttribute('href')) return;
    if (!sameOrigin(href)) return;
    var orig = path;
    path = path.replace(base, '');
    if (base && orig == path) return;
    e.preventDefault();
    page.show(orig);
  }

  /**
   * Event button.
   */

  function which(e) {
    e = e || window.event;
    return null == e.which
      ? e.button
      : e.which;
  }

  /**
   * Check if `href` is the same origin.
   */

  function sameOrigin(href) {
    var origin = location.protocol + '//' + location.hostname;
    if (location.port) origin += ':' + location.port;
    return 0 == href.indexOf(origin);
  }

  /**
   * Expose `page`.
   */

  if ('undefined' == typeof module) {
    window.page = page;
  } else {
    module.exports = page;
  }

})();
});

require.define("/examples/express/lib/page-home/client.js",function(require,module,exports,__dirname,__filename,process,global){var content = document.querySelector('.js-app_content');
var View = require('./view');

var database = {
	title: 'This is the Home page'
};

module.exports = function() {
	var view = View(database);
	view.render();
	view.inject(content);
};
});

require.define("/examples/express/lib/page-home/view.js",function(require,module,exports,__dirname,__filename,process,global){var FruitMachine = require('../../../../lib/fruitmachine');

// Require these views so that
// FruitMachine registers them
var LayoutA = require('../layout-a');
var ModuleApple = require('../module-apple');
var ModuleOrange = require('../module-orange');
var ModuleBanana = require('../module-banana');

module.exports = function(data) {
	var layout = {
		module: 'layout-a',
		views: [
			{
				id: 'slot_1',
				module: 'apple',
				data: {
					title: data.title
				}
			},
			{
				id: 'slot_2',
				module: 'orange'
			},
			{
				id: 'slot_3',
				module: 'banana'
			}
		]
	};

	return new FruitMachine(layout);
};
});

require.define("/examples/express/lib/layout-a/index.js",function(require,module,exports,__dirname,__filename,process,global){var FruitMachine = require('../../../../lib/fruitmachine');
var apple = require('../module-apple');
var template = require('./template');


module.exports = FruitMachine.module('layout-a', {
	template: template
});
});

require.define("/examples/express/lib/module-apple/index.js",function(require,module,exports,__dirname,__filename,process,global){var FruitMachine = require('../../../../lib/fruitmachine.js');
var template = require('./template');
FruitMachine.templates({ apple: template });
});

require.define("/examples/express/lib/module-apple/template.js",function(require,module,exports,__dirname,__filename,process,global){module.exports = new Hogan(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"module-apple\" ");_.b(_.t(_.f("fm_attrs",c,p,0)));_.b(">");_.b("\n" + i);_.b("	<div class=\"module-apple_title\">");_.b(_.v(_.f("title",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("</div>");return _.fl();;});
});

require.define("/examples/express/lib/layout-a/template.js",function(require,module,exports,__dirname,__filename,process,global){module.exports = new Hogan(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class='layout-a' ");_.b(_.t(_.f("fm_attrs",c,p,0)));_.b(">");_.b("\n" + i);_.b("	<div class='layout-a_slot-1'>");_.b(_.t(_.f("slot_1",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("	<div class='layout-a_region-1'>");_.b("\n" + i);_.b("		<div class='layout-a_slot-2'>");_.b(_.t(_.f("slot_2",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("		<div class='layout-a_slot-3'>");_.b(_.t(_.f("slot_3",c,p,0)));_.b("</div>");_.b("\n" + i);_.b("	</div>");_.b("\n" + i);_.b("</div>");return _.fl();;});
});

require.define("/examples/express/lib/module-orange/index.js",function(require,module,exports,__dirname,__filename,process,global){var FruitMachine = require('../../../../lib/fruitmachine.js');
var template = require('./template');

FruitMachine.templates({ orange: template });
});

require.define("/examples/express/lib/module-orange/template.js",function(require,module,exports,__dirname,__filename,process,global){module.exports = new Hogan(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class='module-orange' ");_.b(_.t(_.f("fm_attrs",c,p,0)));_.b(">Module Orange</div>");return _.fl();;});
});

require.define("/examples/express/lib/module-banana/index.js",function(require,module,exports,__dirname,__filename,process,global){var FruitMachine = require('../../../../lib/fruitmachine.js');
var template = require('./template');

FruitMachine.templates({ banana: template });
});

require.define("/examples/express/lib/module-banana/template.js",function(require,module,exports,__dirname,__filename,process,global){module.exports = new Hogan(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class='module-banana' ");_.b(_.t(_.f("fm_attrs",c,p,0)));_.b(">Module Banana</div>");return _.fl();;});
});

require.define("/examples/express/lib/page-about/client.js",function(require,module,exports,__dirname,__filename,process,global){var content = document.querySelector('.js-app_content');
var View = require('./view');

var database = {
	title: 'This is the About page'
};

module.exports = function() {
	var view = View(database);
	view.render();
	view.inject(content);
};
});

require.define("/examples/express/lib/page-about/view.js",function(require,module,exports,__dirname,__filename,process,global){var FruitMachine = require('../../../../lib/fruitmachine');

// Require these views so that
// FruitMachine registers them
var LayoutA = require('../layout-a');
var ModuleApple = require('../module-apple');
var ModuleOrange = require('../module-orange');
var ModuleBanana = require('../module-banana');

module.exports = function(data) {
	var layout = {
		module: 'layout-a',
		views: [
			{
				id: 'slot_1',
				module: 'apple',
				data: {
					title: data.title
				}
			},
			{
				id: 'slot_2',
				module: 'banana'
			},
			{
				id: 'slot_3',
				module: 'orange'
			}
		]
	};

	return new FruitMachine(layout);
};
});

require.define("/examples/express/lib/page-links/client.js",function(require,module,exports,__dirname,__filename,process,global){var content = document.querySelector('.js-app_content');
var View = require('./view');

var database = {
	title: 'This is the Links page'
};

module.exports = function() {
	var view = View(database);
	view.render();
	view.inject(content);
};
});

require.define("/examples/express/lib/page-links/view.js",function(require,module,exports,__dirname,__filename,process,global){var FruitMachine = require('../../../../lib/fruitmachine');

// Require these views so that
// FruitMachine registers them
var LayoutA = require('../layout-a');
var ModuleApple = require('../module-apple');
var ModuleOrange = require('../module-orange');
var ModuleBanana = require('../module-banana');

module.exports = function(data) {
	var layout = {
		module: 'layout-a',
		views: [
			{
				id: 'slot_1',
				module: 'orange'
			},
			{
				id: 'slot_2',
				module: 'apple',
				data: {
					title: data.title
				}
			},
			{
				id: 'slot_3',
				module: 'banana'
			}
		]
	};

	return new FruitMachine(layout);
};
});

require.define("/examples/express/lib/boot/index.js",function(require,module,exports,__dirname,__filename,process,global){global.Hogan = require('hogan.js/lib/template').Template;
global.app = {};

var FruitMachine = require('../../../lib/fruitmachine');
var routes = require('../routes');

app.view = new FruitMachine(window.layout);
});
require("/examples/express/lib/boot/index.js");
})();
