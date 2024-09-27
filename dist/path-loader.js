var PathLoader;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 987:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Jeremy Whitlock
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var supportedLoaders = {
  file: __webpack_require__(865),
  http: __webpack_require__(662),
  https: __webpack_require__(662)
};
var defaultLoader = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' || typeof importScripts === 'function' ? supportedLoaders.http : supportedLoaders.file;

// Load promises polyfill if necessary
/* istanbul ignore if */
if (typeof Promise === 'undefined') {
  __webpack_require__(606);
}

function getScheme(location) {
  if (typeof location !== 'undefined') {
    location = location.indexOf('://') === -1 ? '' : location.split('://')[0];
  }

  return location;
}

/**
 * Utility that provides a single API for loading the content of a path/URL.
 *
 * @module path-loader
 */

function getLoader(location) {
  var scheme = getScheme(location);
  var loader = supportedLoaders[scheme];

  if (typeof loader === 'undefined') {
    if (scheme === '') {
      loader = defaultLoader;
    } else {
      throw new Error('Unsupported scheme: ' + scheme);
    }
  }

  return loader;
}

/**
 * Loads a document at the provided location and returns a JavaScript object representation.
 *
 * @param {string} location - The location to the document
 * @param {module:path-loader.LoadOptions} [options] - The loader options
 *
 * @returns {Promise<*>} Always returns a promise even if there is a callback provided
 *
 * @example
 * // Example using Promises
 *
 * PathLoader
 *   .load('./package.json')
 *   .then(JSON.parse)
 *   .then(function (document) {
 *     console.log(document.name + ' (' + document.version + '): ' + document.description);
 *   }, function (err) {
 *     console.error(err.stack);
 *   });
 *
 * @example
 * // Example using options.prepareRequest to provide authentication details for a remotely secure URL
 *
 * PathLoader
 *   .load('https://api.github.com/repos/whitlockjc/path-loader', {
 *     prepareRequest: function (req, callback) {
 *       req.auth('my-username', 'my-password');
 *       callback(undefined, req);
 *     }
 *   })
 *   .then(JSON.parse)
 *   .then(function (document) {
 *     console.log(document.full_name + ': ' + document.description);
 *   }, function (err) {
 *     console.error(err.stack);
 *   });
 *
 * @example
 * // Example loading a YAML file
 *
 * PathLoader
 *   .load('/Users/not-you/projects/path-loader/.travis.yml')
 *   .then(YAML.safeLoad)
 *   .then(function (document) {
 *     console.log('path-loader uses the', document.language, 'language.');
 *   }, function (err) {
 *     console.error(err.stack);
 *   });
 *
 * @example
 * // Example loading a YAML file with options.processContent (Useful if you need information in the raw response)
 *
 * PathLoader
 *   .load('/Users/not-you/projects/path-loader/.travis.yml', {
 *     processContent: function (res, callback) {
 *       callback(YAML.safeLoad(res.text));
 *     }
 *   })
 *   .then(function (document) {
 *     console.log('path-loader uses the', document.language, 'language.');
 *   }, function (err) {
 *     console.error(err.stack);
 *   });
 */
module.exports.load = function (location, options) {
  var allTasks = Promise.resolve();

  // Default options to empty object
  if (typeof options === 'undefined') {
    options = {};
  }

  // Validate arguments
  allTasks = allTasks.then(function () {
    if (typeof location === 'undefined') {
      throw new TypeError('location is required');
    } else if (typeof location !== 'string') {
      throw new TypeError('location must be a string');
    }

    if (typeof options !== 'undefined') {
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
        throw new TypeError('options must be an object');
      } else if (typeof options.processContent !== 'undefined' && typeof options.processContent !== 'function') {
        throw new TypeError('options.processContent must be a function');
      }
    }
  });

  // Load the document from the provided location and process it
  allTasks = allTasks.then(function () {
    return new Promise(function (resolve, reject) {
      var loader = getLoader(location);

      loader.load(location, options || {}, function (err, document) {
        if (err) {
          reject(err);
        } else {
          resolve(document);
        }
      });
    });
  }).then(function (res) {
    if (options.processContent) {
      return new Promise(function (resolve, reject) {
        // For consistency between file and http, always send an object with a 'text' property containing the raw
        // string value being processed.
        if ((typeof res === 'undefined' ? 'undefined' : _typeof(res)) !== 'object') {
          res = { text: res };
        }

        // Pass the path being loaded
        res.location = location;

        options.processContent(res, function (err, processed) {
          if (err) {
            reject(err);
          } else {
            resolve(processed);
          }
        });
      });
    } else {
      // If there was no content processor, we will assume that for all objects that it is a Superagent response
      // and will return its `text` property value.  Otherwise, we will return the raw response.
      return (typeof res === 'undefined' ? 'undefined' : _typeof(res)) === 'object' ? res.text : res;
    }
  });

  return allTasks;
};

/***/ }),

/***/ 865:
/***/ ((module) => {

"use strict";
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Jeremy Whitlock
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



var unsupportedError = new TypeError('The \'file\' scheme is not supported in the browser');

/**
 * The file loader is not supported in the browser.
 *
 * @throws {error} the file loader is not supported in the browser
 */
module.exports.getBase = function () {
  throw unsupportedError;
};

/**
 * The file loader is not supported in the browser.
 */
module.exports.load = function () {
  var fn = arguments[arguments.length - 1];

  if (typeof fn === 'function') {
    fn(unsupportedError);
  } else {
    throw unsupportedError;
  }
};

/***/ }),

/***/ 662:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* eslint-env node, browser */

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Jeremy Whitlock
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */



var request = __webpack_require__(936);

var supportedHttpMethods = ['delete', 'get', 'head', 'patch', 'post', 'put'];

/**
 * Loads a file from an http or https URL.
 *
 * @param {string} location - The document URL (If relative, location is relative to window.location.origin).
 * @param {object} options - The loader options
 * @param {string} [options.method=get] - The HTTP method to use for the request
 * @param {module:PathLoader~PrepareRequestCallback} [options.prepareRequest] - The callback used to prepare a request
 * @param {module:PathLoader~ProcessResponseCallback} [options.processContent] - The callback used to process the
 * response
 * @param {function} callback - The error-first callback
 */
module.exports.load = function (location, options, callback) {
  var realMethod = options.method ? options.method.toLowerCase() : 'get';
  var err;
  var realRequest;

  function makeRequest(err, req) {
    if (err) {
      callback(err);
    } else {
      // buffer() is only available in Node.js
      if (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]' && typeof req.buffer === 'function') {
        req.buffer(true);
      }

      req.end(function (err2, res) {
        if (err2) {
          callback(err2);
        } else {
          callback(undefined, res);
        }
      });
    }
  }

  if (typeof options.method !== 'undefined') {
    if (typeof options.method !== 'string') {
      err = new TypeError('options.method must be a string');
    } else if (supportedHttpMethods.indexOf(options.method) === -1) {
      err = new TypeError('options.method must be one of the following: ' + supportedHttpMethods.slice(0, supportedHttpMethods.length - 1).join(', ') + ' or ' + supportedHttpMethods[supportedHttpMethods.length - 1]);
    }
  } else if (typeof options.prepareRequest !== 'undefined' && typeof options.prepareRequest !== 'function') {
    err = new TypeError('options.prepareRequest must be a function');
  }

  if (!err) {
    realRequest = request[realMethod === 'delete' ? 'del' : realMethod](location);

    if (options.prepareRequest) {
      try {
        options.prepareRequest(realRequest, makeRequest);
      } catch (err2) {
        callback(err2);
      }
    } else {
      makeRequest(undefined, realRequest);
    }
  } else {
    callback(err);
  }
};

/***/ }),

/***/ 857:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(299);

var callBind = __webpack_require__(334);

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

/***/ }),

/***/ 334:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(465);
var GetIntrinsic = __webpack_require__(299);
var setFunctionLength = __webpack_require__(887);

var $TypeError = __webpack_require__(953);
var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $defineProperty = __webpack_require__(49);
var $max = GetIntrinsic('%Math.max%');

module.exports = function callBind(originalFunction) {
	if (typeof originalFunction !== 'function') {
		throw new $TypeError('a function is required');
	}
	var func = $reflectApply(bind, $call, arguments);
	return setFunctionLength(func, 1 + $max(0, originalFunction.length - (arguments.length - 1)), true);
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

/***/ }),

/***/ 57:
/***/ ((module) => {

"use strict";


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function (event, fn) {
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function (event) {
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1),
      callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function (event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function (event) {
  return !!this.listeners(event).length;
};

/***/ }),

/***/ 423:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var $defineProperty = __webpack_require__(49);

var $SyntaxError = __webpack_require__(226);
var $TypeError = __webpack_require__(953);

var gopd = __webpack_require__(581);

/** @type {import('.')} */
module.exports = function defineDataProperty(obj, property, value) {
	if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' && typeof obj !== 'function') {
		throw new $TypeError('`obj` must be an object or a function`');
	}
	if (typeof property !== 'string' && (typeof property === 'undefined' ? 'undefined' : _typeof(property)) !== 'symbol') {
		throw new $TypeError('`property` must be a string or a symbol`');
	}
	if (arguments.length > 3 && typeof arguments[3] !== 'boolean' && arguments[3] !== null) {
		throw new $TypeError('`nonEnumerable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 4 && typeof arguments[4] !== 'boolean' && arguments[4] !== null) {
		throw new $TypeError('`nonWritable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 5 && typeof arguments[5] !== 'boolean' && arguments[5] !== null) {
		throw new $TypeError('`nonConfigurable`, if provided, must be a boolean or null');
	}
	if (arguments.length > 6 && typeof arguments[6] !== 'boolean') {
		throw new $TypeError('`loose`, if provided, must be a boolean');
	}

	var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
	var nonWritable = arguments.length > 4 ? arguments[4] : null;
	var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
	var loose = arguments.length > 6 ? arguments[6] : false;

	/* @type {false | TypedPropertyDescriptor<unknown>} */
	var desc = !!gopd && gopd(obj, property);

	if ($defineProperty) {
		$defineProperty(obj, property, {
			configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
			enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
			value: value,
			writable: nonWritable === null && desc ? desc.writable : !nonWritable
		});
	} else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
		// must fall back to [[Set]], and was not explicitly asked to make non-enumerable, non-writable, or non-configurable
		obj[property] = value; // eslint-disable-line no-param-reassign
	} else {
		throw new $SyntaxError('This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.');
	}
};

/***/ }),

/***/ 49:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(299);

/** @type {import('.')} */
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true) || false;
if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = false;
	}
}

module.exports = $defineProperty;

/***/ }),

/***/ 15:
/***/ ((module) => {

"use strict";


/** @type {import('./eval')} */

module.exports = EvalError;

/***/ }),

/***/ 157:
/***/ ((module) => {

"use strict";


/** @type {import('.')} */

module.exports = Error;

/***/ }),

/***/ 104:
/***/ ((module) => {

"use strict";


/** @type {import('./range')} */

module.exports = RangeError;

/***/ }),

/***/ 76:
/***/ ((module) => {

"use strict";


/** @type {import('./ref')} */

module.exports = ReferenceError;

/***/ }),

/***/ 226:
/***/ ((module) => {

"use strict";


/** @type {import('./syntax')} */

module.exports = SyntaxError;

/***/ }),

/***/ 953:
/***/ ((module) => {

"use strict";


/** @type {import('./type')} */

module.exports = TypeError;

/***/ }),

/***/ 47:
/***/ ((module) => {

"use strict";


/** @type {import('./uri')} */

module.exports = URIError;

/***/ }),

/***/ 665:
/***/ ((module) => {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = stringify;
stringify.default = stringify;
stringify.stable = deterministicStringify;
stringify.stableStringify = deterministicStringify;

var LIMIT_REPLACE_NODE = '[...]';
var CIRCULAR_REPLACE_NODE = '[Circular]';

var arr = [];
var replacerStack = [];

function defaultOptions() {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER
  };
}

// Regular stringify
function stringify(obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions();
  }

  decirc(obj, '', 0, [], undefined, 0, options);
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(obj, replacer, spacer);
    } else {
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]');
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res;
}

function setReplace(replace, val, k, parent) {
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
  if (propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace });
      arr.push([parent, k, val, propertyDescriptor]);
    } else {
      replacerStack.push([val, k, replace]);
    }
  } else {
    parent[k] = replace;
    arr.push([parent, k, val]);
  }
}

function decirc(val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return;
      }
    }

    if (typeof options.depthLimit !== 'undefined' && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }

    if (typeof options.edgesLimit !== 'undefined' && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }

    stack.push(val);
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      var keys = Object.keys(val);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        decirc(val[key], key, i, stack, val, depth, options);
      }
    }
    stack.pop();
  }
}

// Stable-stringify
function compareFunction(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function deterministicStringify(obj, replacer, spacer, options) {
  if (typeof options === 'undefined') {
    options = defaultOptions();
  }

  var tmp = deterministicDecirc(obj, '', 0, [], undefined, 0, options) || obj;
  var res;
  try {
    if (replacerStack.length === 0) {
      res = JSON.stringify(tmp, replacer, spacer);
    } else {
      res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]');
  } finally {
    // Ensure that we restore the object as it was.
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res;
}

function deterministicDecirc(val, k, edgeIndex, stack, parent, depth, options) {
  depth += 1;
  var i;
  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return;
      }
    }
    try {
      if (typeof val.toJSON === 'function') {
        return;
      }
    } catch (_) {
      return;
    }

    if (typeof options.depthLimit !== 'undefined' && depth > options.depthLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }

    if (typeof options.edgesLimit !== 'undefined' && edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }

    stack.push(val);
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        deterministicDecirc(val[i], i, i, stack, val, depth, options);
      }
    } else {
      // Create a temporary object in the required way
      var tmp = {};
      var keys = Object.keys(val).sort(compareFunction);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        deterministicDecirc(val[key], key, i, stack, val, depth, options);
        tmp[key] = val[key];
      }
      if (typeof parent !== 'undefined') {
        arr.push([parent, k, val]);
        parent[k] = tmp;
      } else {
        return tmp;
      }
    }
    stack.pop();
  }
}

// wraps replacer function to handle values we couldn't replace
// and mark them as replaced value
function replaceGetterValues(replacer) {
  replacer = typeof replacer !== 'undefined' ? replacer : function (k, v) {
    return v;
  };
  return function (key, val) {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i];
        if (part[1] === key && part[0] === val) {
          val = part[2];
          replacerStack.splice(i, 1);
          break;
        }
      }
    }
    return replacer.call(this, key, val);
  };
}

/***/ }),

/***/ 703:
/***/ ((module) => {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';

var concatty = function concatty(a, b) {
    var arr = [];

    for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
    }
    for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
    }

    return arr;
};

var slicy = function slicy(arrLike, offset) {
    var arr = [];
    for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
    }
    return arr;
};

var joiny = function joiny(arr, joiner) {
    var str = '';
    for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
            str += joiner;
        }
    }
    return str;
};

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slicy(arguments, 1);

    var bound;
    var binder = function binder() {
        if (this instanceof bound) {
            var result = target.apply(this, concatty(args, arguments));
            if (Object(result) === result) {
                return result;
            }
            return this;
        }
        return target.apply(that, concatty(args, arguments));
    };

    var boundLength = max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
    }

    bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

/***/ }),

/***/ 465:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var implementation = __webpack_require__(703);

module.exports = Function.prototype.bind || implementation;

/***/ }),

/***/ 299:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var undefined;

var $Error = __webpack_require__(157);
var $EvalError = __webpack_require__(15);
var $RangeError = __webpack_require__(104);
var $ReferenceError = __webpack_require__(76);
var $SyntaxError = __webpack_require__(226);
var $TypeError = __webpack_require__(953);
var $URIError = __webpack_require__(47);

var $Function = Function;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function getEvalledConstructor(expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function throwTypeError() {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD ? function () {
	try {
		// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
		arguments.callee; // IE 8 does not throw here
		return throwTypeError;
	} catch (calleeThrows) {
		try {
			// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
			return $gOPD(arguments, 'callee').get;
		} catch (gOPDthrows) {
			return throwTypeError;
		}
	}
}() : throwTypeError;

var hasSymbols = __webpack_require__(377)();
var hasProto = __webpack_require__(486)();

var getProto = Object.getPrototypeOf || (hasProto ? function (x) {
	return x.__proto__;
} // eslint-disable-line no-proto
: null);

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	__proto__: null,
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
	'%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': $Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': $EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': (typeof JSON === 'undefined' ? 'undefined' : _typeof(JSON)) === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': $RangeError,
	'%ReferenceError%': $ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': $URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

if (getProto) {
	try {
		null.error; // eslint-disable-line no-unused-expressions
	} catch (e) {
		// https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
		var errorProto = getProto(getProto(e));
		INTRINSICS['%Error.prototype%'] = errorProto;
	}
}

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen && getProto) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	__proto__: null,
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = __webpack_require__(465);
var hasOwn = __webpack_require__(863);
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);
var $exec = bind.call(Function.call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	if ($exec(/^%?[^%]*%?$/, name) === null) {
		throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
	}
	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && i + 1 >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

/***/ }),

/***/ 581:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(299);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);

if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

/***/ }),

/***/ 698:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var $defineProperty = __webpack_require__(49);

var hasPropertyDescriptors = function hasPropertyDescriptors() {
	return !!$defineProperty;
};

hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
	// node v0.6 has a bug where array lengths can be Set but not Defined
	if (!$defineProperty) {
		return null;
	}
	try {
		return $defineProperty([], 'length', { value: 1 }).length !== 1;
	} catch (e) {
		// In Firefox 4-22, defining length on an array throws an exception.
		return true;
	}
};

module.exports = hasPropertyDescriptors;

/***/ }),

/***/ 486:
/***/ ((module) => {

"use strict";


var test = {
	__proto__: null,
	foo: {}
};

var $Object = Object;

/** @type {import('.')} */
module.exports = function hasProto() {
	// @ts-expect-error: TS errors on an inherited property for some reason
	return { __proto__: test }.foo === test.foo && !(test instanceof $Object);
};

/***/ }),

/***/ 377:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(379);

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') {
		return false;
	}
	if (typeof Symbol !== 'function') {
		return false;
	}
	if (_typeof(origSymbol('foo')) !== 'symbol') {
		return false;
	}
	if (_typeof(Symbol('bar')) !== 'symbol') {
		return false;
	}

	return hasSymbolSham();
};

/***/ }),

/***/ 379:
/***/ ((module) => {

"use strict";


/* eslint complexity: [2, 18], max-statements: [2, 33] */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
		return false;
	}
	if (_typeof(Symbol.iterator) === 'symbol') {
		return true;
	}

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') {
		return false;
	}

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
		return false;
	}
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
		return false;
	}

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) {
		return false;
	} // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
		return false;
	}

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
		return false;
	}

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) {
		return false;
	}

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
		return false;
	}

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) {
			return false;
		}
	}

	return true;
};

/***/ }),

/***/ 863:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = __webpack_require__(465);

/** @type {import('.')} */
module.exports = bind.call(call, $hasOwn);

/***/ }),

/***/ 606:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! Native Promise Only
    v0.8.1 (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/

(function UMD(name, context, definition) {
	// special form of UMD for polyfilling across evironments
	context[name] = context[name] || definition();
	if ( true && module.exports) {
		module.exports = context[name];
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function $AMD$() {
			return context[name];
		}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
})("Promise", typeof __webpack_require__.g != "undefined" ? __webpack_require__.g : undefined, function DEF() {
	/*jshint validthis:true */
	"use strict";

	var builtInProp,
	    cycle,
	    scheduling_queue,
	    ToString = Object.prototype.toString,
	    timer = typeof setImmediate != "undefined" ? function timer(fn) {
		return setImmediate(fn);
	} : setTimeout;

	// dammit, IE8.
	try {
		Object.defineProperty({}, "x", {});
		builtInProp = function builtInProp(obj, name, val, config) {
			return Object.defineProperty(obj, name, {
				value: val,
				writable: true,
				configurable: config !== false
			});
		};
	} catch (err) {
		builtInProp = function builtInProp(obj, name, val) {
			obj[name] = val;
			return obj;
		};
	}

	// Note: using a queue instead of array for efficiency
	scheduling_queue = function Queue() {
		var first, last, item;

		function Item(fn, self) {
			this.fn = fn;
			this.self = self;
			this.next = void 0;
		}

		return {
			add: function add(fn, self) {
				item = new Item(fn, self);
				if (last) {
					last.next = item;
				} else {
					first = item;
				}
				last = item;
				item = void 0;
			},
			drain: function drain() {
				var f = first;
				first = last = cycle = void 0;

				while (f) {
					f.fn.call(f.self);
					f = f.next;
				}
			}
		};
	}();

	function schedule(fn, self) {
		scheduling_queue.add(fn, self);
		if (!cycle) {
			cycle = timer(scheduling_queue.drain);
		}
	}

	// promise duck typing
	function isThenable(o) {
		var _then,
		    o_type = typeof o === "undefined" ? "undefined" : _typeof(o);

		if (o != null && (o_type == "object" || o_type == "function")) {
			_then = o.then;
		}
		return typeof _then == "function" ? _then : false;
	}

	function notify() {
		for (var i = 0; i < this.chain.length; i++) {
			notifyIsolated(this, this.state === 1 ? this.chain[i].success : this.chain[i].failure, this.chain[i]);
		}
		this.chain.length = 0;
	}

	// NOTE: This is a separate function to isolate
	// the `try..catch` so that other code can be
	// optimized better
	function notifyIsolated(self, cb, chain) {
		var ret, _then;
		try {
			if (cb === false) {
				chain.reject(self.msg);
			} else {
				if (cb === true) {
					ret = self.msg;
				} else {
					ret = cb.call(void 0, self.msg);
				}

				if (ret === chain.promise) {
					chain.reject(TypeError("Promise-chain cycle"));
				} else if (_then = isThenable(ret)) {
					_then.call(ret, chain.resolve, chain.reject);
				} else {
					chain.resolve(ret);
				}
			}
		} catch (err) {
			chain.reject(err);
		}
	}

	function resolve(msg) {
		var _then,
		    self = this;

		// already triggered?
		if (self.triggered) {
			return;
		}

		self.triggered = true;

		// unwrap
		if (self.def) {
			self = self.def;
		}

		try {
			if (_then = isThenable(msg)) {
				schedule(function () {
					var def_wrapper = new MakeDefWrapper(self);
					try {
						_then.call(msg, function $resolve$() {
							resolve.apply(def_wrapper, arguments);
						}, function $reject$() {
							reject.apply(def_wrapper, arguments);
						});
					} catch (err) {
						reject.call(def_wrapper, err);
					}
				});
			} else {
				self.msg = msg;
				self.state = 1;
				if (self.chain.length > 0) {
					schedule(notify, self);
				}
			}
		} catch (err) {
			reject.call(new MakeDefWrapper(self), err);
		}
	}

	function reject(msg) {
		var self = this;

		// already triggered?
		if (self.triggered) {
			return;
		}

		self.triggered = true;

		// unwrap
		if (self.def) {
			self = self.def;
		}

		self.msg = msg;
		self.state = 2;
		if (self.chain.length > 0) {
			schedule(notify, self);
		}
	}

	function iteratePromises(Constructor, arr, resolver, rejecter) {
		for (var idx = 0; idx < arr.length; idx++) {
			(function IIFE(idx) {
				Constructor.resolve(arr[idx]).then(function $resolver$(msg) {
					resolver(idx, msg);
				}, rejecter);
			})(idx);
		}
	}

	function MakeDefWrapper(self) {
		this.def = self;
		this.triggered = false;
	}

	function MakeDef(self) {
		this.promise = self;
		this.state = 0;
		this.triggered = false;
		this.chain = [];
		this.msg = void 0;
	}

	function Promise(executor) {
		if (typeof executor != "function") {
			throw TypeError("Not a function");
		}

		if (this.__NPO__ !== 0) {
			throw TypeError("Not a promise");
		}

		// instance shadowing the inherited "brand"
		// to signal an already "initialized" promise
		this.__NPO__ = 1;

		var def = new MakeDef(this);

		this["then"] = function then(success, failure) {
			var o = {
				success: typeof success == "function" ? success : true,
				failure: typeof failure == "function" ? failure : false
			};
			// Note: `then(..)` itself can be borrowed to be used against
			// a different promise constructor for making the chained promise,
			// by substituting a different `this` binding.
			o.promise = new this.constructor(function extractChain(resolve, reject) {
				if (typeof resolve != "function" || typeof reject != "function") {
					throw TypeError("Not a function");
				}

				o.resolve = resolve;
				o.reject = reject;
			});
			def.chain.push(o);

			if (def.state !== 0) {
				schedule(notify, def);
			}

			return o.promise;
		};
		this["catch"] = function $catch$(failure) {
			return this.then(void 0, failure);
		};

		try {
			executor.call(void 0, function publicResolve(msg) {
				resolve.call(def, msg);
			}, function publicReject(msg) {
				reject.call(def, msg);
			});
		} catch (err) {
			reject.call(def, err);
		}
	}

	var PromisePrototype = builtInProp({}, "constructor", Promise,
	/*configurable=*/false);

	// Note: Android 4 cannot use `Object.defineProperty(..)` here
	Promise.prototype = PromisePrototype;

	// built-in "brand" to signal an "uninitialized" promise
	builtInProp(PromisePrototype, "__NPO__", 0,
	/*configurable=*/false);

	builtInProp(Promise, "resolve", function Promise$resolve(msg) {
		var Constructor = this;

		// spec mandated checks
		// note: best "isPromise" check that's practical for now
		if (msg && (typeof msg === "undefined" ? "undefined" : _typeof(msg)) == "object" && msg.__NPO__ === 1) {
			return msg;
		}

		return new Constructor(function executor(resolve, reject) {
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			resolve(msg);
		});
	});

	builtInProp(Promise, "reject", function Promise$reject(msg) {
		return new this(function executor(resolve, reject) {
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			reject(msg);
		});
	});

	builtInProp(Promise, "all", function Promise$all(arr) {
		var Constructor = this;

		// spec mandated checks
		if (ToString.call(arr) != "[object Array]") {
			return Constructor.reject(TypeError("Not an array"));
		}
		if (arr.length === 0) {
			return Constructor.resolve([]);
		}

		return new Constructor(function executor(resolve, reject) {
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			var len = arr.length,
			    msgs = Array(len),
			    count = 0;

			iteratePromises(Constructor, arr, function resolver(idx, msg) {
				msgs[idx] = msg;
				if (++count === len) {
					resolve(msgs);
				}
			}, reject);
		});
	});

	builtInProp(Promise, "race", function Promise$race(arr) {
		var Constructor = this;

		// spec mandated checks
		if (ToString.call(arr) != "[object Array]") {
			return Constructor.reject(TypeError("Not an array"));
		}

		return new Constructor(function executor(resolve, reject) {
			if (typeof resolve != "function" || typeof reject != "function") {
				throw TypeError("Not a function");
			}

			iteratePromises(Constructor, arr, function resolver(idx, msg) {
				resolve(msg);
			}, reject);
		});
	});

	return Promise;
});

/***/ }),

/***/ 657:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (_typeof(Symbol.toStringTag) === hasShammedSymbols ? 'object' : 'symbol') ? Symbol.toStringTag : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype // eslint-disable-line no-proto
? function (O) {
    return O.__proto__; // eslint-disable-line no-proto
} : null);

function addNumericSeparator(num, str) {
    if (num === Infinity || num === -Infinity || num !== num || num && num > -1000 && num < 1000 || $test.call(/e/, str)) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = __webpack_require__(634);
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double') {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number' ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (has(opts, 'indent') && opts.indent !== null && opts.indent !== '\t' && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') {
        depth = 0;
    }
    if (depth >= maxDepth && maxDepth > 0 && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) {
        // in older engines, regexes are callable
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) {
            s += '...';
        }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) {
            return '[]';
        }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) {
            return '[' + String(obj) + ']';
        }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
        }
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
        }
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    // note: in IE 8, sometimes `global !== window` but both are the prototypes of each other
    /* eslint-env browser */
    if (typeof window !== 'undefined' && obj === window) {
        return '{ [object Window] }';
    }
    if (typeof globalThis !== 'undefined' && obj === globalThis || typeof __webpack_require__.g !== 'undefined' && obj === __webpack_require__.g) {
        return '{ [object globalThis] }';
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) {
            return tag + '{}';
        }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) {
    return toStr(obj) === '[object Array]' && (!toStringTag || !((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && toStringTag in obj));
}
function isDate(obj) {
    return toStr(obj) === '[object Date]' && (!toStringTag || !((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && toStringTag in obj));
}
function isRegExp(obj) {
    return toStr(obj) === '[object RegExp]' && (!toStringTag || !((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && toStringTag in obj));
}
function isError(obj) {
    return toStr(obj) === '[object Error]' && (!toStringTag || !((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && toStringTag in obj));
}
function isString(obj) {
    return toStr(obj) === '[object String]' && (!toStringTag || !((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && toStringTag in obj));
}
function isNumber(obj) {
    return toStr(obj) === '[object Number]' && (!toStringTag || !((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && toStringTag in obj));
}
function isBoolean(obj) {
    return toStr(obj) === '[object Boolean]' && (!toStringTag || !((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && toStringTag in obj));
}

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj instanceof Symbol;
    }
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'symbol') {
        return true;
    }
    if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) {
    return key in this;
};
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) {
        return f.name;
    }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) {
        return m[1];
    }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) {
        return xs.indexOf(x);
    }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) {
            return i;
        }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
        return false;
    }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    // eslint-disable-next-line no-control-regex
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) {
        return '\\' + x;
    }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) {
        return '';
    }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) {
        // eslint-disable-line no-restricted-syntax
        if (!has(obj, key)) {
            continue;
        } // eslint-disable-line no-restricted-syntax, no-continue
        if (isArr && String(Number(key)) === key && key < obj.length) {
            continue;
        } // eslint-disable-line no-restricted-syntax, no-continue
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
            continue; // eslint-disable-line no-restricted-syntax, no-continue
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

/***/ }),

/***/ 804:
/***/ ((module) => {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

module.exports = {
    'default': Format.RFC3986,
    formatters: {
        RFC1738: function RFC1738(value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function RFC3986(value) {
            return String(value);
        }
    },
    RFC1738: Format.RFC1738,
    RFC3986: Format.RFC3986
};

/***/ }),

/***/ 995:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var stringify = __webpack_require__(90);
var parse = __webpack_require__(244);
var formats = __webpack_require__(804);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};

/***/ }),

/***/ 244:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(974);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var defaults = {
    allowDots: false,
    allowEmptyArrays: false,
    allowPrototypes: false,
    allowSparse: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decodeDotInKeys: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    duplicates: 'combine',
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictDepth: false,
    strictNullHandling: false
};

var interpretNumericEntities = function interpretNumericEntities(str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

var parseArrayValue = function parseArrayValue(val, options) {
    if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
        return val.split(',');
    }

    return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = { __proto__: null };

    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    cleanStr = cleanStr.replace(/%5B/gi, '[').replace(/%5D/gi, ']');
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
            val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options), function (encodedVal) {
                return options.decoder(encodedVal, defaults.decoder, charset, 'value');
            });
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray(val) ? [val] : val;
        }

        var existing = has.call(obj, key);
        if (existing && options.duplicates === 'combine') {
            obj[key] = utils.combine(obj[key], val);
        } else if (!existing || options.duplicates === 'last') {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function parseObject(chain, val, options, valuesParsed) {
    var leaf = valuesParsed ? val : parseArrayValue(val, options);

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = options.allowEmptyArrays && (leaf === '' || options.strictNullHandling && leaf === null) ? [] : [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, '.') : cleanRoot;
            var index = parseInt(decodedRoot, 10);
            if (!options.parseArrays && decodedRoot === '') {
                obj = { 0: leaf };
            } else if (!isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
                obj = [];
                obj[index] = leaf;
            } else if (decodedRoot !== '__proto__') {
                obj[decodedRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, check strictDepth option for throw, else just add whatever is left

    if (segment) {
        if (options.strictDepth === true) {
            throw new RangeError('Input depth exceeded depth option of ' + options.depth + ' and strictDepth is true');
        }
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options, valuesParsed);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }

    if (typeof opts.decodeDotInKeys !== 'undefined' && typeof opts.decodeDotInKeys !== 'boolean') {
        throw new TypeError('`decodeDotInKeys` option can only be `true` or `false`, when provided');
    }

    if (opts.decoder !== null && typeof opts.decoder !== 'undefined' && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

    var duplicates = typeof opts.duplicates === 'undefined' ? defaults.duplicates : opts.duplicates;

    if (duplicates !== 'combine' && duplicates !== 'first' && duplicates !== 'last') {
        throw new TypeError('The duplicates option must be either combine, first, or last');
    }

    var allowDots = typeof opts.allowDots === 'undefined' ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

    return {
        allowDots: allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === 'boolean' ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: typeof opts.depth === 'number' || opts.depth === false ? +opts.depth : defaults.depth,
        duplicates: duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
        strictDepth: typeof opts.strictDepth === 'boolean' ? !!opts.strictDepth : defaults.strictDepth,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
        obj = utils.merge(obj, newObj, options);
    }

    if (options.allowSparse === true) {
        return obj;
    }

    return utils.compact(obj);
};

/***/ }),

/***/ 90:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var getSideChannel = __webpack_require__(402);
var utils = __webpack_require__(974);
var formats = __webpack_require__(804);
var has = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function pushToArray(arr, valueOrArray) {
    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    allowEmptyArrays: false,
    arrayFormat: 'indices',
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encodeDotInKeys: false,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'symbol' || typeof v === 'bigint';
};

var sentinel = {};

var stringify = function stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
    var obj = object;

    var tmpSc = sideChannel;
    var step = 0;
    var findFlag = false;
    while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
        // Where object last appeared in the ref tree
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                findFlag = true; // Break while
            }
        }
        if (typeof tmpSc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }

    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
        obj = utils.maybeMap(obj, function (value) {
            if (value instanceof Date) {
                return serializeDate(value);
            }
            return value;
        });
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (generateArrayPrefix === 'comma' && isArray(obj)) {
        // we need to join elements in
        if (encodeValuesOnly && encoder) {
            obj = utils.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(',') || null : void undefined }];
    } else if (isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    var encodedPrefix = encodeDotInKeys ? prefix.replace(/\./g, '%2E') : prefix;

    var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + '[]' : encodedPrefix;

    if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
        return adjustedPrefix + '[]';
    }

    for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];

        if (skipNulls && value === null) {
            continue;
        }

        var encodedKey = allowDots && encodeDotInKeys ? key.replace(/\./g, '%2E') : key;
        var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? '.' + encodedKey : '[' + encodedKey + ']');

        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify(value, keyPrefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }

    if (typeof opts.encodeDotInKeys !== 'undefined' && typeof opts.encodeDotInKeys !== 'boolean') {
        throw new TypeError('`encodeDotInKeys` option can only be `true` or `false`, when provided');
    }

    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
        filter = opts.filter;
    }

    var arrayFormat;
    if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if ('indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = defaults.arrayFormat;
    }

    if ('commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }

    var allowDots = typeof opts.allowDots === 'undefined' ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat: arrayFormat,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === 'boolean' ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

module.exports = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) {
        return '';
    }

    var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
    var commaRoundTrip = generateArrayPrefix === 'comma' && options.commaRoundTrip;

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    var sideChannel = getSideChannel();
    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(obj[key], key, generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

/***/ }),

/***/ 974:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var formats = __webpack_require__(804);

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}();

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if ((typeof source === 'undefined' ? 'undefined' : _typeof(source)) !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') {
            if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && (typeof targetItem === 'undefined' ? 'undefined' : _typeof(targetItem)) === 'object' && item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function decode(str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var limit = 1024;

/* eslint operator-linebreak: [2, "before"] */

var encode = function encode(str, defaultEncoder, charset, kind, format) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if ((typeof str === 'undefined' ? 'undefined' : _typeof(str)) === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        var arr = [];

        for (var i = 0; i < segment.length; ++i) {
            var c = segment.charCodeAt(i);
            if (c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || c >= 0x30 && c <= 0x39 // 0-9
            || c >= 0x41 && c <= 0x5A // a-z
            || c >= 0x61 && c <= 0x7A // A-Z
            || format === formats.RFC1738 && (c === 0x28 || c === 0x29) // ( )
            ) {
                    arr[arr.length] = segment.charAt(i);
                    continue;
                }

            if (c < 0x80) {
                arr[arr.length] = hexTable[c];
                continue;
            }

            if (c < 0x800) {
                arr[arr.length] = hexTable[0xC0 | c >> 6] + hexTable[0x80 | c & 0x3F];
                continue;
            }

            if (c < 0xD800 || c >= 0xE000) {
                arr[arr.length] = hexTable[0xE0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
                continue;
            }

            i += 1;
            c = 0x10000 + ((c & 0x3FF) << 10 | segment.charCodeAt(i) & 0x3FF);

            arr[arr.length] = hexTable[0xF0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3F] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
        }

        out += arr.join('');
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var maybeMap = function maybeMap(val, fn) {
    if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
};

module.exports = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    maybeMap: maybeMap,
    merge: merge
};

/***/ }),

/***/ 887:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var GetIntrinsic = __webpack_require__(299);
var define = __webpack_require__(423);
var hasDescriptors = __webpack_require__(698)();
var gOPD = __webpack_require__(581);

var $TypeError = __webpack_require__(953);
var $floor = GetIntrinsic('%Math.floor%');

/** @type {import('.')} */
module.exports = function setFunctionLength(fn, length) {
	if (typeof fn !== 'function') {
		throw new $TypeError('`fn` is not a function');
	}
	if (typeof length !== 'number' || length < 0 || length > 0xFFFFFFFF || $floor(length) !== length) {
		throw new $TypeError('`length` must be a positive 32-bit integer');
	}

	var loose = arguments.length > 2 && !!arguments[2];

	var functionLengthIsConfigurable = true;
	var functionLengthIsWritable = true;
	if ('length' in fn && gOPD) {
		var desc = gOPD(fn, 'length');
		if (desc && !desc.configurable) {
			functionLengthIsConfigurable = false;
		}
		if (desc && !desc.writable) {
			functionLengthIsWritable = false;
		}
	}

	if (functionLengthIsConfigurable || functionLengthIsWritable || !loose) {
		if (hasDescriptors) {
			define( /** @type {Parameters<define>[0]} */fn, 'length', length, true, true);
		} else {
			define( /** @type {Parameters<define>[0]} */fn, 'length', length);
		}
	}
	return fn;
};

/***/ }),

/***/ 402:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var GetIntrinsic = __webpack_require__(299);
var callBound = __webpack_require__(857);
var inspect = __webpack_require__(657);

var $TypeError = __webpack_require__(953);
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
* This function traverses the list returning the node corresponding to the given key.
*
* That node is also moved to the head of the list, so that if it's accessed again we don't need to traverse the whole list. By doing so, all the recently used nodes can be accessed relatively quickly.
*/
/** @type {import('.').listGetNode} */
var listGetNode = function listGetNode(list, key) {
	// eslint-disable-line consistent-return
	/** @type {typeof list | NonNullable<(typeof list)['next']>} */
	var prev = list;
	/** @type {(typeof list)['next']} */
	var curr;
	for (; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			// eslint-disable-next-line no-extra-parens
			curr.next = /** @type {NonNullable<typeof list.next>} */list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

/** @type {import('.').listGet} */
var listGet = function listGet(objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
/** @type {import('.').listSet} */
var listSet = function listSet(objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = /** @type {import('.').ListNode<typeof value>} */{ // eslint-disable-line no-param-reassign, no-extra-parens
			key: key,
			next: objects.next,
			value: value
		};
	}
};
/** @type {import('.').listHas} */
var listHas = function listHas(objects, key) {
	return !!listGetNode(objects, key);
};

/** @type {import('.')} */
module.exports = function getSideChannel() {
	/** @type {WeakMap<object, unknown>} */var $wm;
	/** @type {Map<object, unknown>} */var $m;
	/** @type {import('.').RootNode<unknown>} */var $o;

	/** @type {import('.').Channel} */
	var channel = {
		assert: function assert(key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function get(key) {
			// eslint-disable-line consistent-return
			if ($WeakMap && key && ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) {
					// eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function has(key) {
			if ($WeakMap && key && ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) {
					// eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function set(key, value) {
			if ($WeakMap && key && ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					// Initialize the linked list as an empty node, so that we don't have to special-case handling of the first node: we can always refer to it as (previous node).next, instead of something like (list).head
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};

/***/ }),

/***/ 510:
/***/ ((module) => {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaults = ['use', 'on', 'once', 'set', 'query', 'type', 'accept', 'auth', 'withCredentials', 'sortQuery', 'retry', 'ok', 'redirects', 'timeout', 'buffer', 'serialize', 'parse', 'ca', 'key', 'pfx', 'cert', 'disableTLSCerts'];

var Agent = function () {
  function Agent() {
    _classCallCheck(this, Agent);

    this._defaults = [];
  }

  _createClass(Agent, [{
    key: '_setDefaults',
    value: function _setDefaults(request) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._defaults[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var def = _step.value;

          request[def.fn].apply(request, _toConsumableArray(def.args));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return Agent;
}();

var _iteratorNormalCompletion2 = true;
var _didIteratorError2 = false;
var _iteratorError2 = undefined;

try {
  var _loop = function _loop() {
    var fn = _step2.value;

    // Default setting for all requests from this agent
    Agent.prototype[fn] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      this._defaults.push({
        fn: fn,
        args: args
      });
      return this;
    };
  };

  for (var _iterator2 = defaults[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
    _loop();
  }
} catch (err) {
  _didIteratorError2 = true;
  _iteratorError2 = err;
} finally {
  try {
    if (!_iteratorNormalCompletion2 && _iterator2.return) {
      _iterator2.return();
    }
  } finally {
    if (_didIteratorError2) {
      throw _iteratorError2;
    }
  }
}

module.exports = Agent;

/***/ }),

/***/ 936:
/***/ ((module, exports, __webpack_require__) => {

"use strict";


/**
 * Root reference for iframes.
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var root = void 0;
if (typeof window !== 'undefined') {
  // Browser window
  root = window;
} else if (typeof self === 'undefined') {
  // Other environments
  console.warn('Using browser-only version of superagent in non-browser environment');
  root = void 0;
} else {
  // Web Worker
  root = self;
}
var Emitter = __webpack_require__(57);
var safeStringify = __webpack_require__(665);
var qs = __webpack_require__(995);
var RequestBase = __webpack_require__(6);

var _require = __webpack_require__(322),
    isObject = _require.isObject,
    mixin = _require.mixin,
    hasOwn = _require.hasOwn;

var ResponseBase = __webpack_require__(660);
var Agent = __webpack_require__(510);

/**
 * Noop.
 */

function noop() {}

/**
 * Expose `request`.
 */

module.exports = function (method, url) {
  // callback
  if (typeof url === 'function') {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (arguments.length === 1) {
    return new exports.Request('GET', method);
  }
  return new exports.Request(method, url);
};
exports = module.exports;
var request = exports;
exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest) {
    return new root.XMLHttpRequest();
  }
  throw new Error('Browser-only version of superagent could not find XHR');
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim ? function (s) {
  return s.trim();
} : function (s) {
  return s.replace(/(^\s*|\s*$)/g, '');
};

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(object) {
  if (!isObject(object)) return object;
  var pairs = [];
  for (var key in object) {
    if (hasOwn(object, key)) pushEncodedKeyValuePair(pairs, key, object[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, value) {
  if (value === undefined) return;
  if (value === null) {
    pairs.push(encodeURI(key));
    return;
  }
  if (Array.isArray(value)) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        pushEncodedKeyValuePair(pairs, key, v);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  } else if (isObject(value)) {
    for (var subkey in value) {
      if (hasOwn(value, subkey)) pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', value[subkey]);
    }
  } else {
    pairs.push(encodeURI(key) + '=' + encodeURIComponent(value));
  }
}

/**
 * Expose serialization method.
 */

request.serializeObject = serialize;

/**
 * Parse the given x-www-form-urlencoded `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseString(string_) {
  var object = {};
  var pairs = string_.split('&');
  var pair = void 0;
  var pos = void 0;
  for (var i = 0, length_ = pairs.length; i < length_; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos === -1) {
      object[decodeURIComponent(pair)] = '';
    } else {
      object[decodeURIComponent(pair.slice(0, pos))] = decodeURIComponent(pair.slice(pos + 1));
    }
  }
  return object;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'text/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  form: 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

request.serialize = {
  'application/x-www-form-urlencoded': function applicationXWwwFormUrlencoded(obj) {
    return qs.stringify(obj, {
      indices: false,
      strictNullHandling: true
    });
  },
  'application/json': safeStringify
};

/**
 * Default parsers.
 *
 *     superagent.parse['application/xml'] = function(str){
 *       return { object parsed from str };
 *     };
 *
 */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(string_) {
  var lines = string_.split(/\r?\n/);
  var fields = {};
  var index = void 0;
  var line = void 0;
  var field = void 0;
  var value = void 0;
  for (var i = 0, length_ = lines.length; i < length_; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    if (index === -1) {
      // could be empty line, just skip it
      continue;
    }
    field = line.slice(0, index).toLowerCase();
    value = trim(line.slice(index + 1));
    fields[field] = value;
  }
  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  // should match /json or +json
  // but not /json-seq
  return (/[/+]json($|[^-\w])/i.test(mime)
  );
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(request_) {
  this.req = request_;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = this.req.method !== 'HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text') || typeof this.xhr.responseType === 'undefined' ? this.xhr.responseText : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request

  if (status === 1223) {
    status = 204;
  }
  this._setStatusProperties(status);
  this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  this.header = this.headers;
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);
  if (this.text === null && request_._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method === 'HEAD' ? null : this._parseBody(this.text ? this.text : this.xhr.response);
  }
}
mixin(Response.prototype, ResponseBase.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function (string_) {
  var parse = request.parse[this.type];
  if (this.req._parser) {
    return this.req._parser(this, string_);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && string_ && (string_.length > 0 || string_ instanceof Object) ? parse(string_) : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function () {
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var message = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var error = new Error(message);
  error.status = this.status;
  error.method = method;
  error.url = url;
  return error;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function () {
    var error = null;
    var res = null;
    try {
      res = new Response(self);
    } catch (err) {
      error = new Error('Parser is unable to parse the response');
      error.parse = true;
      error.original = err;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        error.rawResponse = typeof self.xhr.responseType === 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        error.status = self.xhr.status ? self.xhr.status : null;
        error.statusCode = error.status; // backwards-compat only
      } else {
        error.rawResponse = null;
        error.status = null;
      }
      return self.callback(error);
    }
    self.emit('response', res);
    var new_error = void 0;
    try {
      if (!self._isResponseOK(res)) {
        new_error = new Error(res.statusText || res.text || 'Unsuccessful HTTP response');
      }
    } catch (err) {
      new_error = err; // ok() callback can throw
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_error) {
      new_error.original = error;
      new_error.response = res;
      new_error.status = new_error.status || res.status;
      self.callback(new_error, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

// eslint-disable-next-line new-cap
Emitter(Request.prototype);
mixin(Request.prototype, RequestBase.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function (type) {
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function (type) {
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function (user, pass, options) {
  if (arguments.length === 1) pass = '';
  if ((typeof pass === 'undefined' ? 'undefined' : _typeof(pass)) === 'object' && pass !== null) {
    // pass is optional and can be replaced with options
    options = pass;
    pass = '';
  }
  if (!options) {
    options = {
      type: typeof btoa === 'function' ? 'basic' : 'auto'
    };
  }
  var encoder = options.encoder ? options.encoder : function (string) {
    if (typeof btoa === 'function') {
      return btoa(string);
    }
    throw new Error('Cannot use basic auth, btoa is not a function');
  };
  return this._auth(user, pass, options, encoder);
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function (value) {
  if (typeof value !== 'string') value = serialize(value);
  if (value) this._query.push(value);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function (field, file, options) {
  if (file) {
    if (this._data) {
      throw new Error("superagent can't mix .send() and .attach()");
    }
    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};
Request.prototype._getFormData = function () {
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function (error, res) {
  if (this._shouldRetry(error, res)) {
    return this._retry();
  }
  var fn = this._callback;
  this.clearTimeout();
  if (error) {
    if (this._maxRetries) error.retries = this._retries - 1;
    this.emit('error', error);
  }
  fn(error, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function () {
  var error = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  error.crossDomain = true;
  error.status = this.status;
  error.method = this.method;
  error.url = this.url;
  this.callback(error);
};

// This only warns, because the request is still likely to work
Request.prototype.agent = function () {
  console.warn('This is not supported in browser version of superagent');
  return this;
};
Request.prototype.ca = Request.prototype.agent;
Request.prototype.buffer = Request.prototype.ca;

// This throws, because it can't send/receive data as expected
Request.prototype.write = function () {
  throw new Error('Streaming is not supported in browser version of superagent');
};
Request.prototype.pipe = Request.prototype.write;

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj host object
 * @return {Boolean} is a host object
 * @api private
 */
Request.prototype._isHost = function (object) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && !Array.isArray(object) && Object.prototype.toString.call(object) !== '[object Object]';
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function (fn) {
  if (this._endCalled) {
    console.warn('Warning: .end() was called twice. This is not supported in superagent');
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._finalizeQueryString();
  this._end();
};
Request.prototype._setUploadTimeout = function () {
  var self = this;

  // upload timeout it's wokrs only if deadline timeout is off
  if (this._uploadTimeout && !this._uploadTimeoutTimer) {
    this._uploadTimeoutTimer = setTimeout(function () {
      self._timeoutError('Upload timeout of ', self._uploadTimeout, 'ETIMEDOUT');
    }, this._uploadTimeout);
  }
};

// eslint-disable-next-line complexity
Request.prototype._end = function () {
  if (this._aborted) return this.callback(new Error('The request has been aborted even before .end() was called'));
  var self = this;
  this.xhr = request.getXHR();
  var xhr = this.xhr;

  var data = this._formData || this._data;
  this._setTimeouts();

  // state change
  xhr.addEventListener('readystatechange', function () {
    var readyState = xhr.readyState;

    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (readyState !== 4) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status = void 0;
    try {
      status = xhr.status;
    } catch (err) {
      status = 0;
    }
    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  });

  // progress
  var handleProgress = function handleProgress(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
      if (e.percent === 100) {
        clearTimeout(self._uploadTimeoutTimer);
      }
    }
    e.direction = direction;
    self.emit('progress', e);
  };
  if (this.hasListeners('progress')) {
    try {
      xhr.addEventListener('progress', handleProgress.bind(null, 'download'));
      if (xhr.upload) {
        xhr.upload.addEventListener('progress', handleProgress.bind(null, 'upload'));
      }
    } catch (err) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }
  if (xhr.upload) {
    this._setUploadTimeout();
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && this.method !== 'GET' && this.method !== 'HEAD' && typeof data !== 'string' && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var _serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!_serialize && isJSON(contentType)) {
      _serialize = request.serialize['application/json'];
    }
    if (_serialize) data = _serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (this.header[field] === null) continue;
    if (hasOwn(this.header, field)) xhr.setRequestHeader(field, this.header[field]);
  }
  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data === 'undefined' ? null : data);
};
request.agent = function () {
  return new Agent();
};
var _arr = ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'];

var _loop = function _loop() {
  var method = _arr[_i];
  Agent.prototype[method.toLowerCase()] = function (url, fn) {
    var request_ = new request.Request(method, url);
    this._setDefaults(request_);
    if (fn) {
      request_.end(fn);
    }
    return request_;
  };
};

for (var _i = 0; _i < _arr.length; _i++) {
  _loop();
}
Agent.prototype.del = Agent.prototype.delete;

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function (url, data, fn) {
  var request_ = request('GET', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.query(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function (url, data, fn) {
  var request_ = request('HEAD', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.query(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function (url, data, fn) {
  var request_ = request('OPTIONS', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn) {
  var request_ = request('DELETE', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
}
request.del = del;
request.delete = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function (url, data, fn) {
  var request_ = request('PATCH', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function (url, data, fn) {
  var request_ = request('POST', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function (url, data, fn) {
  var request_ = request('PUT', url);
  if (typeof data === 'function') {
    fn = data;
    data = null;
  }
  if (data) request_.send(data);
  if (fn) request_.end(fn);
  return request_;
};

/***/ }),

/***/ 6:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Module of mixed-in functions shared between node and client code
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(322),
    isObject = _require.isObject,
    hasOwn = _require.hasOwn;

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase() {}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function () {
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  clearTimeout(this._uploadTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  delete this._uploadTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function (fn) {
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function (value) {
  this._responseType = value;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function (fn) {
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 * - upload is the time  since last bit of data was sent or received. This timeout works only if deadline timeout is off
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function (options) {
  if (!options || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
    this._timeout = options;
    this._responseTimeout = 0;
    this._uploadTimeout = 0;
    return this;
  }
  for (var option in options) {
    if (hasOwn(options, option)) {
      switch (option) {
        case 'deadline':
          this._timeout = options.deadline;
          break;
        case 'response':
          this._responseTimeout = options.response;
          break;
        case 'upload':
          this._uploadTimeout = options.upload;
          break;
        default:
          console.warn('Unknown timeout option', option);
      }
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @param {Function} [fn]
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function (count, fn) {
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  this._retryCallback = fn;
  return this;
};

//
// NOTE: we do not include ESOCKETTIMEDOUT because that is from `request` package
//       <https://github.com/sindresorhus/got/pull/537>
//
// NOTE: we do not include EADDRINFO because it was removed from libuv in 2014
//       <https://github.com/libuv/libuv/commit/02e1ebd40b807be5af46343ea873331b2ee4e9c1>
//       <https://github.com/request/request/search?q=ESOCKETTIMEDOUT&unscoped_q=ESOCKETTIMEDOUT>
//
//
// TODO: expose these as configurable defaults
//
var ERROR_CODES = new Set(['ETIMEDOUT', 'ECONNRESET', 'EADDRINUSE', 'ECONNREFUSED', 'EPIPE', 'ENOTFOUND', 'ENETUNREACH', 'EAI_AGAIN']);
var STATUS_CODES = new Set([408, 413, 429, 500, 502, 503, 504, 521, 522, 524]);

// TODO: we would need to make this easily configurable before adding it in (e.g. some might want to add POST)
// const METHODS = new Set(['GET', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'TRACE']);

/**
 * Determine if a request should be retried.
 * (Inspired by https://github.com/sindresorhus/got#retry)
 *
 * @param {Error} err an error
 * @param {Response} [res] response
 * @returns {Boolean} if segment should be retried
 */
RequestBase.prototype._shouldRetry = function (error, res) {
  if (!this._maxRetries || this._retries++ >= this._maxRetries) {
    return false;
  }
  if (this._retryCallback) {
    try {
      var override = this._retryCallback(error, res);
      if (override === true) return true;
      if (override === false) return false;
      // undefined falls back to defaults
    } catch (err) {
      console.error(err);
    }
  }

  // TODO: we would need to make this easily configurable before adding it in (e.g. some might want to add POST)
  /*
  if (
    this.req &&
    this.req.method &&
    !METHODS.has(this.req.method.toUpperCase())
  )
    return false;
  */
  if (res && res.status && STATUS_CODES.has(res.status)) return true;
  if (error) {
    if (error.code && ERROR_CODES.has(error.code)) return true;
    // Superagent timeout
    if (error.timeout && error.code === 'ECONNABORTED') return true;
    if (error.crossDomain) return true;
  }
  return false;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function () {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }
  this._aborted = false;
  this.timedout = false;
  this.timedoutError = null;
  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function (resolve, reject) {
  var _this = this;

  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn('Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises');
    }
    this._fullfilledPromise = new Promise(function (resolve, reject) {
      self.on('abort', function () {
        if (_this._maxRetries && _this._maxRetries > _this._retries) {
          return;
        }
        if (_this.timedout && _this.timedoutError) {
          reject(_this.timedoutError);
          return;
        }
        var error = new Error('Aborted');
        error.code = 'ABORTED';
        error.status = _this.status;
        error.method = _this.method;
        error.url = _this.url;
        reject(error);
      });
      self.end(function (error, res) {
        if (error) reject(error);else resolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
};
RequestBase.prototype.catch = function (callback) {
  return this.then(undefined, callback);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function (fn) {
  fn(this);
  return this;
};
RequestBase.prototype.ok = function (callback) {
  if (typeof callback !== 'function') throw new Error('Callback required');
  this._okCallback = callback;
  return this;
};
RequestBase.prototype._isResponseOK = function (res) {
  if (!res) {
    return false;
  }
  if (this._okCallback) {
    return this._okCallback(res);
  }
  return res.status >= 200 && res.status < 300;
};

/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function (field) {
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function (field, value) {
  if (isObject(field)) {
    for (var key in field) {
      if (hasOwn(field, key)) this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = value;
  this.header[field] = value;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field field name
 */
RequestBase.prototype.unset = function (field) {
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name name of field
 * @param {String|Blob|File|Buffer|fs.ReadStream} val value of field
 * @param {String} options extra options, e.g. 'blob'
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function (name, value, options) {
  // name should be either a string or an object.
  if (name === null || undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }
  if (this._data) {
    throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }
  if (isObject(name)) {
    for (var key in name) {
      if (hasOwn(name, key)) this.field(key, name[key]);
    }
    return this;
  }
  if (Array.isArray(value)) {
    for (var i in value) {
      if (hasOwn(value, i)) this.field(name, value[i]);
    }
    return this;
  }

  // val should be defined now
  if (value === null || undefined === value) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if (typeof value === 'boolean') {
    value = String(value);
  }

  // fix https://github.com/ladjs/superagent/issues/1680
  if (options) this._getFormData().append(name, value, options);else this._getFormData().append(name, value);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request} request
 * @api public
 */
RequestBase.prototype.abort = function () {
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  if (this.xhr) this.xhr.abort(); // browser
  if (this.req) {
    this.req.abort(); // node
  }
  this.clearTimeout();
  this.emit('abort');
  return this;
};
RequestBase.prototype._auth = function (user, pass, options, base64Encoder) {
  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + base64Encoder(user + ':' + pass));
      break;
    case 'auto':
      this.username = user;
      this.password = pass;
      break;
    case 'bearer':
      // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
      break;
    default:
      break;
  }
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 * @param {Boolean} [on=true] - Set 'withCredentials' state
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.withCredentials = function (on) {
  // This is browser-only functionality. Node side is no-op.
  if (on === undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does nothing in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function (n) {
  this._maxRedirects = n;
  return this;
};

/**
 * Maximum size of buffered response body, in bytes. Counts uncompressed size.
 * Default 200MB.
 *
 * @param {Number} n number of bytes
 * @return {Request} for chaining
 */
RequestBase.prototype.maxResponseSize = function (n) {
  if (typeof n !== 'number') {
    throw new TypeError('Invalid argument');
  }
  this._maxResponseSize = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function () {
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

// eslint-disable-next-line complexity
RequestBase.prototype.send = function (data) {
  var isObject_ = isObject(data);
  var type = this._header['content-type'];
  if (this._formData) {
    throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }
  if (isObject_ && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw new Error("Can't merge these send calls");
  }

  // merge
  if (isObject_ && isObject(this._data)) {
    for (var key in data) {
      if (typeof data[key] == 'bigint' && !data[key].toJSON) throw new Error('Cannot serialize BigInt value to json');
      if (hasOwn(data, key)) this._data[key] = data[key];
    }
  } else if (typeof data === 'bigint') throw new Error("Cannot send value of type BigInt");else if (typeof data === 'string') {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if (type) type = type.toLowerCase().trim();
    if (type === 'application/x-www-form-urlencoded') {
      this._data = this._data ? this._data + '&' + data : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }
  if (!isObject_ || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};

/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function (sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */
RequestBase.prototype._finalizeQueryString = function () {
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.includes('?') ? '&' : '?') + query;
  }
  this._query.length = 0; // Makes the call idempotent

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArray = this.url.slice(index + 1).split('&');
      if (typeof this._sort === 'function') {
        queryArray.sort(this._sort);
      } else {
        queryArray.sort();
      }
      this.url = this.url.slice(0, index) + '?' + queryArray.join('&');
    }
  }
};

// For backwards compat only
RequestBase.prototype._appendQueryString = function () {
  console.warn('Unsupported');
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function (reason, timeout, errno) {
  if (this._aborted) {
    return;
  }
  var error = new Error(reason + timeout + 'ms exceeded');
  error.timeout = timeout;
  error.code = 'ECONNABORTED';
  error.errno = errno;
  this.timedout = true;
  this.timedoutError = error;
  this.abort();
  this.callback(error);
};
RequestBase.prototype._setTimeouts = function () {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function () {
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }

  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function () {
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
};

/***/ }),

/***/ 660:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/**
 * Module dependencies.
 */

var utils = __webpack_require__(322);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase() {}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function (field) {
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function (header) {
  // TODO: moar!
  // TODO: make this a util

  // content-type
  var ct = header['content-type'] || '';
  this.type = utils.type(ct);

  // params
  var parameters = utils.params(ct);
  for (var key in parameters) {
    if (Object.prototype.hasOwnProperty.call(parameters, key)) this[key] = parameters[key];
  }
  this.links = {};

  // links
  try {
    if (header.link) {
      this.links = utils.parseLinks(header.link);
    }
  } catch (err) {
    // ignore
  }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function (status) {
  var type = Math.trunc(status / 100);

  // status / class
  this.statusCode = status;
  this.status = this.statusCode;
  this.statusType = type;

  // basics
  this.info = type === 1;
  this.ok = type === 2;
  this.redirect = type === 3;
  this.clientError = type === 4;
  this.serverError = type === 5;
  this.error = type === 4 || type === 5 ? this.toError() : false;

  // sugar
  this.created = status === 201;
  this.accepted = status === 202;
  this.noContent = status === 204;
  this.badRequest = status === 400;
  this.unauthorized = status === 401;
  this.notAcceptable = status === 406;
  this.forbidden = status === 403;
  this.notFound = status === 404;
  this.unprocessableEntity = status === 422;
};

/***/ }),

/***/ 322:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.type = function (string_) {
  return string_.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function (value) {
  var object = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = value.split(/ *; */)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var string_ = _step.value;

      var parts = string_.split(/ *= */);
      var key = parts.shift();
      var _value = parts.shift();
      if (key && _value) object[key] = _value;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return object;
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function (value) {
  var object = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = value.split(/ *, */)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var string_ = _step2.value;

      var parts = string_.split(/ *; */);
      var url = parts[0].slice(1, -1);
      var rel = parts[1].split(/ *= */)[1].slice(1, -1);
      object[rel] = url;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return object;
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function (header, changesOrigin) {
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header.host;
  // secuirty
  if (changesOrigin) {
    delete header.authorization;
    delete header.cookie;
  }
  return header;
};

/**
 * Check if `obj` is an object.
 *
 * @param {Object} object
 * @return {Boolean}
 * @api private
 */
exports.isObject = function (object) {
  return object !== null && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object';
};

/**
 * Object.hasOwn fallback/polyfill.
 *
 * @type {(object: object, property: string) => boolean} object
 * @api private
 */
exports.hasOwn = Object.hasOwn || function (object, property) {
  if (object == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  return Object.prototype.hasOwnProperty.call(new Object(object), property);
};
exports.mixin = function (target, source) {
  for (var key in source) {
    if (exports.hasOwn(source, key)) {
      target[key] = source[key];
    }
  }
};

/**
 * Check if the response is compressed using Gzip or Deflate.
 * @param {Object} res
 * @return {Boolean}
 */

exports.isGzipOrDeflateEncoding = function (res) {
  return new RegExp(/^\s*(?:deflate|gzip)\s*$/).test(res.headers['content-encoding']);
};

/**
 * Check if the response is compressed using Brotli.
 * @param {Object} res
 * @return {Boolean}
 */

exports.isBrotliEncoding = function (res) {
  return new RegExp(/^\s*(?:br)\s*$/).test(res.headers['content-encoding']);
};

/***/ }),

/***/ 634:
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(987);
/******/ 	PathLoader = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ckN0aEIsRUFBeUQyRCxRQUF6RDNELENBQVA7QUFDRCxDQVJINUI7QUFVQUEsYUFBQUEsR0FBZ0IsVUFBQ2dLLE1BQUQsRUFBUzZhLE1BQVQsRUFBb0I7QUFDbEMsT0FBSyxJQUFNOWdCLEdBQVgsSUFBa0I4Z0IsTUFBbEIsRUFBMEI7QUFDeEIsUUFBSTdrQixRQUFRNk8sTUFBUjdPLENBQWU2a0IsTUFBZjdrQixFQUF1QitELEdBQXZCL0QsQ0FBSixFQUFpQztBQUMvQmdLLGFBQU9qRyxHQUFQaUcsSUFBYzZhLE9BQU85Z0IsR0FBUDhnQixDQUFkN2E7QUFDRjtBQUNGO0FBQ0QsQ0FORGhLOztBQVFBOzs7Ozs7QUFNQUEsK0JBQUFBLEdBQW1DVyxlQUFRO0FBQ3pDLFNBQU8sSUFBSW1OLE1BQUosQ0FBVywwQkFBWCxFQUF1QzJDLElBQXZDLENBQTRDOVAsSUFBSXdwQixPQUFKeHBCLENBQVksa0JBQVpBLENBQTVDLENBQVA7QUFDRCxDQUZEWDs7QUFJQTs7Ozs7O0FBTUFBLHdCQUFBQSxHQUE0QlcsZUFBUTtBQUNsQyxTQUFPLElBQUltTixNQUFKLENBQVcsZ0JBQVgsRUFBNkIyQyxJQUE3QixDQUFrQzlQLElBQUl3cEIsT0FBSnhwQixDQUFZLGtCQUFaQSxDQUFsQyxDQUFQO0FBQ0QsQ0FGRFg7Ozs7Ozs7QUM3SEE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztVRVBEO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL2luZGV4LmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9saWIvbG9hZGVycy9maWxlLWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL2xpYi9sb2FkZXJzL2h0dHAuanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9jYWxsLWJpbmQvY2FsbEJvdW5kLmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvY2FsbC1iaW5kL2luZGV4LmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvY29tcG9uZW50LWVtaXR0ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9kZWZpbmUtZGF0YS1wcm9wZXJ0eS9pbmRleC5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL2VzLWRlZmluZS1wcm9wZXJ0eS9pbmRleC5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy9ldmFsLmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvZXMtZXJyb3JzL2luZGV4LmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvZXMtZXJyb3JzL3JhbmdlLmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvZXMtZXJyb3JzL3JlZi5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy9zeW50YXguanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9lcy1lcnJvcnMvdHlwZS5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL2VzLWVycm9ycy91cmkuanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9mYXN0LXNhZmUtc3RyaW5naWZ5L2luZGV4LmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvZnVuY3Rpb24tYmluZC9pbXBsZW1lbnRhdGlvbi5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL2Z1bmN0aW9uLWJpbmQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9nZXQtaW50cmluc2ljL2luZGV4LmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvZ29wZC9pbmRleC5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL2hhcy1wcm9wZXJ0eS1kZXNjcmlwdG9ycy9pbmRleC5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL2hhcy1wcm90by9pbmRleC5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL2hhcy1zeW1ib2xzL2luZGV4LmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvaGFzLXN5bWJvbHMvc2hhbXMuanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9oYXNvd24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9uYXRpdmUtcHJvbWlzZS1vbmx5L2xpYi9ucG8uc3JjLmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvb2JqZWN0LWluc3BlY3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9xcy9saWIvZm9ybWF0cy5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL3FzL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL3FzL2xpYi9wYXJzZS5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4vbm9kZV9tb2R1bGVzL3FzL2xpYi9zdHJpbmdpZnkuanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9xcy9saWIvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uL25vZGVfbW9kdWxlcy9zZXQtZnVuY3Rpb24tbGVuZ3RoL2luZGV4LmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi9ub2RlX21vZHVsZXMvc2lkZS1jaGFubmVsL2luZGV4LmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi4vc3JjL2FnZW50LWJhc2UuanMiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci8uLi9zcmMvY2xpZW50LmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi4vc3JjL3JlcXVlc3QtYmFzZS5qcyIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyLy4uL3NyYy9yZXNwb25zZS1iYXNlLmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvLi4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL1BhdGhMb2FkZXIvaWdub3JlZHxEOlxcS2VsbHlcXHZpYW1lcmljYXMtcHJvamVjdHNcXHBhdGgtbG9hZGVyXFxwYXRoLWxvYWRlclxcbm9kZV9tb2R1bGVzXFxvYmplY3QtaW5zcGVjdHwuL3V0aWwuaW5zcGVjdCIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1BhdGhMb2FkZXIvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9QYXRoTG9hZGVyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vUGF0aExvYWRlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNSBKZXJlbXkgV2hpdGxvY2tcclxuICpcclxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuICpcclxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cclxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbiAqXHJcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuICogVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBzdXBwb3J0ZWRMb2FkZXJzID0ge1xyXG4gIGZpbGU6IHJlcXVpcmUoJy4vbGliL2xvYWRlcnMvZmlsZScpLFxyXG4gIGh0dHA6IHJlcXVpcmUoJy4vbGliL2xvYWRlcnMvaHR0cCcpLFxyXG4gIGh0dHBzOiByZXF1aXJlKCcuL2xpYi9sb2FkZXJzL2h0dHAnKVxyXG59O1xyXG52YXIgZGVmYXVsdExvYWRlciA9IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBpbXBvcnRTY3JpcHRzID09PSAnZnVuY3Rpb24nID9cclxuICAgICAgc3VwcG9ydGVkTG9hZGVycy5odHRwIDpcclxuICAgICAgc3VwcG9ydGVkTG9hZGVycy5maWxlO1xyXG5cclxuLy8gTG9hZCBwcm9taXNlcyBwb2x5ZmlsbCBpZiBuZWNlc3NhcnlcclxuLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbmlmICh0eXBlb2YgUHJvbWlzZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICByZXF1aXJlKCduYXRpdmUtcHJvbWlzZS1vbmx5Jyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNjaGVtZSAobG9jYXRpb24pIHtcclxuICBpZiAodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgbG9jYXRpb24gPSBsb2NhdGlvbi5pbmRleE9mKCc6Ly8nKSA9PT0gLTEgPyAnJyA6IGxvY2F0aW9uLnNwbGl0KCc6Ly8nKVswXTtcclxuICB9XHJcblxyXG4gIHJldHVybiBsb2NhdGlvbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFV0aWxpdHkgdGhhdCBwcm92aWRlcyBhIHNpbmdsZSBBUEkgZm9yIGxvYWRpbmcgdGhlIGNvbnRlbnQgb2YgYSBwYXRoL1VSTC5cclxuICpcclxuICogQG1vZHVsZSBwYXRoLWxvYWRlclxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGdldExvYWRlciAobG9jYXRpb24pIHtcclxuICB2YXIgc2NoZW1lID0gZ2V0U2NoZW1lKGxvY2F0aW9uKTtcclxuICB2YXIgbG9hZGVyID0gc3VwcG9ydGVkTG9hZGVyc1tzY2hlbWVdO1xyXG5cclxuICBpZiAodHlwZW9mIGxvYWRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGlmIChzY2hlbWUgPT09ICcnKSB7XHJcbiAgICAgIGxvYWRlciA9IGRlZmF1bHRMb2FkZXI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIHNjaGVtZTogJyArIHNjaGVtZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbG9hZGVyO1xyXG59XHJcblxyXG4vKipcclxuICogTG9hZHMgYSBkb2N1bWVudCBhdCB0aGUgcHJvdmlkZWQgbG9jYXRpb24gYW5kIHJldHVybnMgYSBKYXZhU2NyaXB0IG9iamVjdCByZXByZXNlbnRhdGlvbi5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIC0gVGhlIGxvY2F0aW9uIHRvIHRoZSBkb2N1bWVudFxyXG4gKiBAcGFyYW0ge21vZHVsZTpwYXRoLWxvYWRlci5Mb2FkT3B0aW9uc30gW29wdGlvbnNdIC0gVGhlIGxvYWRlciBvcHRpb25zXHJcbiAqXHJcbiAqIEByZXR1cm5zIHtQcm9taXNlPCo+fSBBbHdheXMgcmV0dXJucyBhIHByb21pc2UgZXZlbiBpZiB0aGVyZSBpcyBhIGNhbGxiYWNrIHByb3ZpZGVkXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIC8vIEV4YW1wbGUgdXNpbmcgUHJvbWlzZXNcclxuICpcclxuICogUGF0aExvYWRlclxyXG4gKiAgIC5sb2FkKCcuL3BhY2thZ2UuanNvbicpXHJcbiAqICAgLnRoZW4oSlNPTi5wYXJzZSlcclxuICogICAudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcclxuICogICAgIGNvbnNvbGUubG9nKGRvY3VtZW50Lm5hbWUgKyAnICgnICsgZG9jdW1lbnQudmVyc2lvbiArICcpOiAnICsgZG9jdW1lbnQuZGVzY3JpcHRpb24pO1xyXG4gKiAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcclxuICogICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcclxuICogICB9KTtcclxuICpcclxuICogQGV4YW1wbGVcclxuICogLy8gRXhhbXBsZSB1c2luZyBvcHRpb25zLnByZXBhcmVSZXF1ZXN0IHRvIHByb3ZpZGUgYXV0aGVudGljYXRpb24gZGV0YWlscyBmb3IgYSByZW1vdGVseSBzZWN1cmUgVVJMXHJcbiAqXHJcbiAqIFBhdGhMb2FkZXJcclxuICogICAubG9hZCgnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy93aGl0bG9ja2pjL3BhdGgtbG9hZGVyJywge1xyXG4gKiAgICAgcHJlcGFyZVJlcXVlc3Q6IGZ1bmN0aW9uIChyZXEsIGNhbGxiYWNrKSB7XHJcbiAqICAgICAgIHJlcS5hdXRoKCdteS11c2VybmFtZScsICdteS1wYXNzd29yZCcpO1xyXG4gKiAgICAgICBjYWxsYmFjayh1bmRlZmluZWQsIHJlcSk7XHJcbiAqICAgICB9XHJcbiAqICAgfSlcclxuICogICAudGhlbihKU09OLnBhcnNlKVxyXG4gKiAgIC50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xyXG4gKiAgICAgY29uc29sZS5sb2coZG9jdW1lbnQuZnVsbF9uYW1lICsgJzogJyArIGRvY3VtZW50LmRlc2NyaXB0aW9uKTtcclxuICogICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAqICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XHJcbiAqICAgfSk7XHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIC8vIEV4YW1wbGUgbG9hZGluZyBhIFlBTUwgZmlsZVxyXG4gKlxyXG4gKiBQYXRoTG9hZGVyXHJcbiAqICAgLmxvYWQoJy9Vc2Vycy9ub3QteW91L3Byb2plY3RzL3BhdGgtbG9hZGVyLy50cmF2aXMueW1sJylcclxuICogICAudGhlbihZQU1MLnNhZmVMb2FkKVxyXG4gKiAgIC50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xyXG4gKiAgICAgY29uc29sZS5sb2coJ3BhdGgtbG9hZGVyIHVzZXMgdGhlJywgZG9jdW1lbnQubGFuZ3VhZ2UsICdsYW5ndWFnZS4nKTtcclxuICogICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAqICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XHJcbiAqICAgfSk7XHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIC8vIEV4YW1wbGUgbG9hZGluZyBhIFlBTUwgZmlsZSB3aXRoIG9wdGlvbnMucHJvY2Vzc0NvbnRlbnQgKFVzZWZ1bCBpZiB5b3UgbmVlZCBpbmZvcm1hdGlvbiBpbiB0aGUgcmF3IHJlc3BvbnNlKVxyXG4gKlxyXG4gKiBQYXRoTG9hZGVyXHJcbiAqICAgLmxvYWQoJy9Vc2Vycy9ub3QteW91L3Byb2plY3RzL3BhdGgtbG9hZGVyLy50cmF2aXMueW1sJywge1xyXG4gKiAgICAgcHJvY2Vzc0NvbnRlbnQ6IGZ1bmN0aW9uIChyZXMsIGNhbGxiYWNrKSB7XHJcbiAqICAgICAgIGNhbGxiYWNrKFlBTUwuc2FmZUxvYWQocmVzLnRleHQpKTtcclxuICogICAgIH1cclxuICogICB9KVxyXG4gKiAgIC50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xyXG4gKiAgICAgY29uc29sZS5sb2coJ3BhdGgtbG9hZGVyIHVzZXMgdGhlJywgZG9jdW1lbnQubGFuZ3VhZ2UsICdsYW5ndWFnZS4nKTtcclxuICogICB9LCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAqICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XHJcbiAqICAgfSk7XHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gZnVuY3Rpb24gKGxvY2F0aW9uLCBvcHRpb25zKSB7XHJcbiAgdmFyIGFsbFRhc2tzID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcblxyXG4gIC8vIERlZmF1bHQgb3B0aW9ucyB0byBlbXB0eSBvYmplY3RcclxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICBvcHRpb25zID0ge307XHJcbiAgfVxyXG5cclxuICAvLyBWYWxpZGF0ZSBhcmd1bWVudHNcclxuICBhbGxUYXNrcyA9IGFsbFRhc2tzLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHR5cGVvZiBsb2NhdGlvbiA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbG9jYXRpb24gaXMgcmVxdWlyZWQnKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGxvY2F0aW9uICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdsb2NhdGlvbiBtdXN0IGJlIGEgc3RyaW5nJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9ucyBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLnByb2Nlc3NDb250ZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0aW9ucy5wcm9jZXNzQ29udGVudCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbnMucHJvY2Vzc0NvbnRlbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gTG9hZCB0aGUgZG9jdW1lbnQgZnJvbSB0aGUgcHJvdmlkZWQgbG9jYXRpb24gYW5kIHByb2Nlc3MgaXRcclxuICBhbGxUYXNrcyA9IGFsbFRhc2tzXHJcbiAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgdmFyIGxvYWRlciA9IGdldExvYWRlcihsb2NhdGlvbik7XHJcblxyXG4gICAgICAgIGxvYWRlci5sb2FkKGxvY2F0aW9uLCBvcHRpb25zIHx8IHt9LCBmdW5jdGlvbiAoZXJyLCBkb2N1bWVudCkge1xyXG4gICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLnByb2Nlc3NDb250ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgIC8vIEZvciBjb25zaXN0ZW5jeSBiZXR3ZWVuIGZpbGUgYW5kIGh0dHAsIGFsd2F5cyBzZW5kIGFuIG9iamVjdCB3aXRoIGEgJ3RleHQnIHByb3BlcnR5IGNvbnRhaW5pbmcgdGhlIHJhd1xyXG4gICAgICAgICAgLy8gc3RyaW5nIHZhbHVlIGJlaW5nIHByb2Nlc3NlZC5cclxuICAgICAgICAgIGlmICh0eXBlb2YgcmVzICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICByZXMgPSB7dGV4dDogcmVzfTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBQYXNzIHRoZSBwYXRoIGJlaW5nIGxvYWRlZFxyXG4gICAgICAgICAgcmVzLmxvY2F0aW9uID0gbG9jYXRpb247XHJcblxyXG4gICAgICAgICAgb3B0aW9ucy5wcm9jZXNzQ29udGVudChyZXMsIGZ1bmN0aW9uIChlcnIsIHByb2Nlc3NlZCkge1xyXG4gICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZShwcm9jZXNzZWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBJZiB0aGVyZSB3YXMgbm8gY29udGVudCBwcm9jZXNzb3IsIHdlIHdpbGwgYXNzdW1lIHRoYXQgZm9yIGFsbCBvYmplY3RzIHRoYXQgaXQgaXMgYSBTdXBlcmFnZW50IHJlc3BvbnNlXHJcbiAgICAgICAgLy8gYW5kIHdpbGwgcmV0dXJuIGl0cyBgdGV4dGAgcHJvcGVydHkgdmFsdWUuICBPdGhlcndpc2UsIHdlIHdpbGwgcmV0dXJuIHRoZSByYXcgcmVzcG9uc2UuXHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiByZXMgPT09ICdvYmplY3QnID8gcmVzLnRleHQgOiByZXM7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICByZXR1cm4gYWxsVGFza3M7XHJcbn07XHJcbiIsIi8qXHJcbiAqIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgSmVyZW15IFdoaXRsb2NrXHJcbiAqXHJcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuICogb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuICogY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4gKlxyXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiAqIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgdW5zdXBwb3J0ZWRFcnJvciA9IG5ldyBUeXBlRXJyb3IoJ1RoZSBcXCdmaWxlXFwnIHNjaGVtZSBpcyBub3Qgc3VwcG9ydGVkIGluIHRoZSBicm93c2VyJyk7XHJcblxyXG4vKipcclxuICogVGhlIGZpbGUgbG9hZGVyIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhlIGJyb3dzZXIuXHJcbiAqXHJcbiAqIEB0aHJvd3Mge2Vycm9yfSB0aGUgZmlsZSBsb2FkZXIgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGUgYnJvd3NlclxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuZ2V0QmFzZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aHJvdyB1bnN1cHBvcnRlZEVycm9yO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRoZSBmaWxlIGxvYWRlciBpcyBub3Qgc3VwcG9ydGVkIGluIHRoZSBicm93c2VyLlxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgZm4gPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xyXG5cclxuICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBmbih1bnN1cHBvcnRlZEVycm9yKTtcclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgdW5zdXBwb3J0ZWRFcnJvcjtcclxuICB9XHJcbn07XHJcbiIsIi8qIGVzbGludC1lbnYgbm9kZSwgYnJvd3NlciAqL1xyXG5cclxuLypcclxuICogVGhlIE1JVCBMaWNlbnNlIChNSVQpXHJcbiAqXHJcbiAqIENvcHlyaWdodCAoYykgMjAxNSBKZXJlbXkgV2hpdGxvY2tcclxuICpcclxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcclxuICogdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuICpcclxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cclxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcbiAqXHJcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuICogVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgnc3VwZXJhZ2VudCcpO1xyXG5cclxudmFyIHN1cHBvcnRlZEh0dHBNZXRob2RzID0gWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAncGF0Y2gnLCAncG9zdCcsICdwdXQnXTtcclxuXHJcbi8qKlxyXG4gKiBMb2FkcyBhIGZpbGUgZnJvbSBhbiBodHRwIG9yIGh0dHBzIFVSTC5cclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uIC0gVGhlIGRvY3VtZW50IFVSTCAoSWYgcmVsYXRpdmUsIGxvY2F0aW9uIGlzIHJlbGF0aXZlIHRvIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pLlxyXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyAtIFRoZSBsb2FkZXIgb3B0aW9uc1xyXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubWV0aG9kPWdldF0gLSBUaGUgSFRUUCBtZXRob2QgdG8gdXNlIGZvciB0aGUgcmVxdWVzdFxyXG4gKiBAcGFyYW0ge21vZHVsZTpQYXRoTG9hZGVyflByZXBhcmVSZXF1ZXN0Q2FsbGJhY2t9IFtvcHRpb25zLnByZXBhcmVSZXF1ZXN0XSAtIFRoZSBjYWxsYmFjayB1c2VkIHRvIHByZXBhcmUgYSByZXF1ZXN0XHJcbiAqIEBwYXJhbSB7bW9kdWxlOlBhdGhMb2FkZXJ+UHJvY2Vzc1Jlc3BvbnNlQ2FsbGJhY2t9IFtvcHRpb25zLnByb2Nlc3NDb250ZW50XSAtIFRoZSBjYWxsYmFjayB1c2VkIHRvIHByb2Nlc3MgdGhlXHJcbiAqIHJlc3BvbnNlXHJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGVycm9yLWZpcnN0IGNhbGxiYWNrXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gZnVuY3Rpb24gKGxvY2F0aW9uLCBvcHRpb25zLCBjYWxsYmFjaykge1xyXG4gIHZhciByZWFsTWV0aG9kID0gb3B0aW9ucy5tZXRob2QgPyBvcHRpb25zLm1ldGhvZC50b0xvd2VyQ2FzZSgpIDogJ2dldCc7XHJcbiAgdmFyIGVycjtcclxuICB2YXIgcmVhbFJlcXVlc3Q7XHJcblxyXG4gIGZ1bmN0aW9uIG1ha2VSZXF1ZXN0IChlcnIsIHJlcSkge1xyXG4gICAgaWYgKGVycikge1xyXG4gICAgICBjYWxsYmFjayhlcnIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gYnVmZmVyKCkgaXMgb25seSBhdmFpbGFibGUgaW4gTm9kZS5qc1xyXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyA/IHByb2Nlc3MgOiAwKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nICYmXHJcbiAgICAgICAgICB0eXBlb2YgcmVxLmJ1ZmZlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJlcS5idWZmZXIodHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlcVxyXG4gICAgICAgIC5lbmQoZnVuY3Rpb24gKGVycjIsIHJlcykge1xyXG4gICAgICAgICAgaWYgKGVycjIpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyMik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayh1bmRlZmluZWQsIHJlcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZW9mIG9wdGlvbnMubWV0aG9kICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLm1ldGhvZCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgZXJyID0gbmV3IFR5cGVFcnJvcignb3B0aW9ucy5tZXRob2QgbXVzdCBiZSBhIHN0cmluZycpO1xyXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0ZWRIdHRwTWV0aG9kcy5pbmRleE9mKG9wdGlvbnMubWV0aG9kKSA9PT0gLTEpIHtcclxuICAgICAgZXJyID0gbmV3IFR5cGVFcnJvcignb3B0aW9ucy5tZXRob2QgbXVzdCBiZSBvbmUgb2YgdGhlIGZvbGxvd2luZzogJyArXHJcbiAgICAgICAgc3VwcG9ydGVkSHR0cE1ldGhvZHMuc2xpY2UoMCwgc3VwcG9ydGVkSHR0cE1ldGhvZHMubGVuZ3RoIC0gMSkuam9pbignLCAnKSArICcgb3IgJyArXHJcbiAgICAgICAgc3VwcG9ydGVkSHR0cE1ldGhvZHNbc3VwcG9ydGVkSHR0cE1ldGhvZHMubGVuZ3RoIC0gMV0pO1xyXG4gICAgfVxyXG4gIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMucHJlcGFyZVJlcXVlc3QgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBvcHRpb25zLnByZXBhcmVSZXF1ZXN0ICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICBlcnIgPSBuZXcgVHlwZUVycm9yKCdvcHRpb25zLnByZXBhcmVSZXF1ZXN0IG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCFlcnIpIHtcclxuICAgIHJlYWxSZXF1ZXN0ID0gcmVxdWVzdFtyZWFsTWV0aG9kID09PSAnZGVsZXRlJyA/ICdkZWwnIDogcmVhbE1ldGhvZF0obG9jYXRpb24pO1xyXG5cclxuICAgIGlmIChvcHRpb25zLnByZXBhcmVSZXF1ZXN0KSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgb3B0aW9ucy5wcmVwYXJlUmVxdWVzdChyZWFsUmVxdWVzdCwgbWFrZVJlcXVlc3QpO1xyXG4gICAgICB9IGNhdGNoIChlcnIyKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyMik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1ha2VSZXF1ZXN0KHVuZGVmaW5lZCwgcmVhbFJlcXVlc3QpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBjYWxsYmFjayhlcnIpO1xyXG4gIH1cclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgR2V0SW50cmluc2ljID0gcmVxdWlyZSgnZ2V0LWludHJpbnNpYycpO1xuXG52YXIgY2FsbEJpbmQgPSByZXF1aXJlKCcuLycpO1xuXG52YXIgJGluZGV4T2YgPSBjYWxsQmluZChHZXRJbnRyaW5zaWMoJ1N0cmluZy5wcm90b3R5cGUuaW5kZXhPZicpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYWxsQm91bmRJbnRyaW5zaWMobmFtZSwgYWxsb3dNaXNzaW5nKSB7XG5cdHZhciBpbnRyaW5zaWMgPSBHZXRJbnRyaW5zaWMobmFtZSwgISFhbGxvd01pc3NpbmcpO1xuXHRpZiAodHlwZW9mIGludHJpbnNpYyA9PT0gJ2Z1bmN0aW9uJyAmJiAkaW5kZXhPZihuYW1lLCAnLnByb3RvdHlwZS4nKSA+IC0xKSB7XG5cdFx0cmV0dXJuIGNhbGxCaW5kKGludHJpbnNpYyk7XG5cdH1cblx0cmV0dXJuIGludHJpbnNpYztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnZnVuY3Rpb24tYmluZCcpO1xudmFyIEdldEludHJpbnNpYyA9IHJlcXVpcmUoJ2dldC1pbnRyaW5zaWMnKTtcbnZhciBzZXRGdW5jdGlvbkxlbmd0aCA9IHJlcXVpcmUoJ3NldC1mdW5jdGlvbi1sZW5ndGgnKTtcblxudmFyICRUeXBlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvdHlwZScpO1xudmFyICRhcHBseSA9IEdldEludHJpbnNpYygnJUZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseSUnKTtcbnZhciAkY2FsbCA9IEdldEludHJpbnNpYygnJUZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsJScpO1xudmFyICRyZWZsZWN0QXBwbHkgPSBHZXRJbnRyaW5zaWMoJyVSZWZsZWN0LmFwcGx5JScsIHRydWUpIHx8IGJpbmQuY2FsbCgkY2FsbCwgJGFwcGx5KTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJ2VzLWRlZmluZS1wcm9wZXJ0eScpO1xudmFyICRtYXggPSBHZXRJbnRyaW5zaWMoJyVNYXRoLm1heCUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjYWxsQmluZChvcmlnaW5hbEZ1bmN0aW9uKSB7XG5cdGlmICh0eXBlb2Ygb3JpZ2luYWxGdW5jdGlvbiAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdhIGZ1bmN0aW9uIGlzIHJlcXVpcmVkJyk7XG5cdH1cblx0dmFyIGZ1bmMgPSAkcmVmbGVjdEFwcGx5KGJpbmQsICRjYWxsLCBhcmd1bWVudHMpO1xuXHRyZXR1cm4gc2V0RnVuY3Rpb25MZW5ndGgoXG5cdFx0ZnVuYyxcblx0XHQxICsgJG1heCgwLCBvcmlnaW5hbEZ1bmN0aW9uLmxlbmd0aCAtIChhcmd1bWVudHMubGVuZ3RoIC0gMSkpLFxuXHRcdHRydWVcblx0KTtcbn07XG5cbnZhciBhcHBseUJpbmQgPSBmdW5jdGlvbiBhcHBseUJpbmQoKSB7XG5cdHJldHVybiAkcmVmbGVjdEFwcGx5KGJpbmQsICRhcHBseSwgYXJndW1lbnRzKTtcbn07XG5cbmlmICgkZGVmaW5lUHJvcGVydHkpIHtcblx0JGRlZmluZVByb3BlcnR5KG1vZHVsZS5leHBvcnRzLCAnYXBwbHknLCB7IHZhbHVlOiBhcHBseUJpbmQgfSk7XG59IGVsc2Uge1xuXHRtb2R1bGUuZXhwb3J0cy5hcHBseSA9IGFwcGx5QmluZDtcbn1cbiIsIlxyXG4vKipcclxuICogRXhwb3NlIGBFbWl0dGVyYC5cclxuICovXHJcblxyXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICBtb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIGEgbmV3IGBFbWl0dGVyYC5cclxuICpcclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xyXG4gIGlmIChvYmopIHJldHVybiBtaXhpbihvYmopO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKiBAYXBpIHByaXZhdGVcclxuICovXHJcblxyXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcclxuICBmb3IgKHZhciBrZXkgaW4gRW1pdHRlci5wcm90b3R5cGUpIHtcclxuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIG9iajtcclxufVxyXG5cclxuLyoqXHJcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLm9uID1cclxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG4gICh0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXSlcclxuICAgIC5wdXNoKGZuKTtcclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBBZGRzIGFuIGBldmVudGAgbGlzdGVuZXIgdGhhdCB3aWxsIGJlIGludm9rZWQgYSBzaW5nbGVcclxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXHJcbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XHJcbiAgZnVuY3Rpb24gb24oKSB7XHJcbiAgICB0aGlzLm9mZihldmVudCwgb24pO1xyXG4gICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcblxyXG4gIG9uLmZuID0gZm47XHJcbiAgdGhpcy5vbihldmVudCwgb24pO1xyXG4gIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2FsbGJhY2sgZm9yIGBldmVudGAgb3IgYWxsXHJcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cclxuICogQHJldHVybiB7RW1pdHRlcn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5FbWl0dGVyLnByb3RvdHlwZS5vZmYgPVxyXG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XHJcbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZm4pe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuXHJcbiAgLy8gYWxsXHJcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHNwZWNpZmljIGV2ZW50XHJcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xyXG5cclxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXHJcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXHJcbiAgdmFyIGNiO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcclxuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XHJcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gUmVtb3ZlIGV2ZW50IHNwZWNpZmljIGFycmF5cyBmb3IgZXZlbnQgdHlwZXMgdGhhdCBub1xyXG4gIC8vIG9uZSBpcyBzdWJzY3JpYmVkIGZvciB0byBhdm9pZCBtZW1vcnkgbGVhay5cclxuICBpZiAoY2FsbGJhY2tzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxyXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xyXG5cclxuICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSlcclxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcclxuXHJcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNhbGxiYWNrcykge1xyXG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcclxuICogQHJldHVybiB7QXJyYXl9XHJcbiAqIEBhcGkgcHVibGljXHJcbiAqL1xyXG5cclxuRW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcclxuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XSB8fCBbXTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGlzIGVtaXR0ZXIgaGFzIGBldmVudGAgaGFuZGxlcnMuXHJcbiAqXHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKiBAYXBpIHB1YmxpY1xyXG4gKi9cclxuXHJcbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnZXMtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbnZhciAkU3ludGF4RXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvc3ludGF4Jyk7XG52YXIgJFR5cGVFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy90eXBlJyk7XG5cbnZhciBnb3BkID0gcmVxdWlyZSgnZ29wZCcpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVEYXRhUHJvcGVydHkoXG5cdG9iaixcblx0cHJvcGVydHksXG5cdHZhbHVlXG4pIHtcblx0aWYgKCFvYmogfHwgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICYmIHR5cGVvZiBvYmogIT09ICdmdW5jdGlvbicpKSB7XG5cdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ2BvYmpgIG11c3QgYmUgYW4gb2JqZWN0IG9yIGEgZnVuY3Rpb25gJyk7XG5cdH1cblx0aWYgKHR5cGVvZiBwcm9wZXJ0eSAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIHByb3BlcnR5ICE9PSAnc3ltYm9sJykge1xuXHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdgcHJvcGVydHlgIG11c3QgYmUgYSBzdHJpbmcgb3IgYSBzeW1ib2xgJyk7XG5cdH1cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIHR5cGVvZiBhcmd1bWVudHNbM10gIT09ICdib29sZWFuJyAmJiBhcmd1bWVudHNbM10gIT09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignYG5vbkVudW1lcmFibGVgLCBpZiBwcm92aWRlZCwgbXVzdCBiZSBhIGJvb2xlYW4gb3IgbnVsbCcpO1xuXHR9XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID4gNCAmJiB0eXBlb2YgYXJndW1lbnRzWzRdICE9PSAnYm9vbGVhbicgJiYgYXJndW1lbnRzWzRdICE9PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ2Bub25Xcml0YWJsZWAsIGlmIHByb3ZpZGVkLCBtdXN0IGJlIGEgYm9vbGVhbiBvciBudWxsJyk7XG5cdH1cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiA1ICYmIHR5cGVvZiBhcmd1bWVudHNbNV0gIT09ICdib29sZWFuJyAmJiBhcmd1bWVudHNbNV0gIT09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignYG5vbkNvbmZpZ3VyYWJsZWAsIGlmIHByb3ZpZGVkLCBtdXN0IGJlIGEgYm9vbGVhbiBvciBudWxsJyk7XG5cdH1cblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiA2ICYmIHR5cGVvZiBhcmd1bWVudHNbNl0gIT09ICdib29sZWFuJykge1xuXHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdgbG9vc2VgLCBpZiBwcm92aWRlZCwgbXVzdCBiZSBhIGJvb2xlYW4nKTtcblx0fVxuXG5cdHZhciBub25FbnVtZXJhYmxlID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgPyBhcmd1bWVudHNbM10gOiBudWxsO1xuXHR2YXIgbm9uV3JpdGFibGUgPSBhcmd1bWVudHMubGVuZ3RoID4gNCA/IGFyZ3VtZW50c1s0XSA6IG51bGw7XG5cdHZhciBub25Db25maWd1cmFibGUgPSBhcmd1bWVudHMubGVuZ3RoID4gNSA/IGFyZ3VtZW50c1s1XSA6IG51bGw7XG5cdHZhciBsb29zZSA9IGFyZ3VtZW50cy5sZW5ndGggPiA2ID8gYXJndW1lbnRzWzZdIDogZmFsc2U7XG5cblx0LyogQHR5cGUge2ZhbHNlIHwgVHlwZWRQcm9wZXJ0eURlc2NyaXB0b3I8dW5rbm93bj59ICovXG5cdHZhciBkZXNjID0gISFnb3BkICYmIGdvcGQob2JqLCBwcm9wZXJ0eSk7XG5cblx0aWYgKCRkZWZpbmVQcm9wZXJ0eSkge1xuXHRcdCRkZWZpbmVQcm9wZXJ0eShvYmosIHByb3BlcnR5LCB7XG5cdFx0XHRjb25maWd1cmFibGU6IG5vbkNvbmZpZ3VyYWJsZSA9PT0gbnVsbCAmJiBkZXNjID8gZGVzYy5jb25maWd1cmFibGUgOiAhbm9uQ29uZmlndXJhYmxlLFxuXHRcdFx0ZW51bWVyYWJsZTogbm9uRW51bWVyYWJsZSA9PT0gbnVsbCAmJiBkZXNjID8gZGVzYy5lbnVtZXJhYmxlIDogIW5vbkVudW1lcmFibGUsXG5cdFx0XHR2YWx1ZTogdmFsdWUsXG5cdFx0XHR3cml0YWJsZTogbm9uV3JpdGFibGUgPT09IG51bGwgJiYgZGVzYyA/IGRlc2Mud3JpdGFibGUgOiAhbm9uV3JpdGFibGVcblx0XHR9KTtcblx0fSBlbHNlIGlmIChsb29zZSB8fCAoIW5vbkVudW1lcmFibGUgJiYgIW5vbldyaXRhYmxlICYmICFub25Db25maWd1cmFibGUpKSB7XG5cdFx0Ly8gbXVzdCBmYWxsIGJhY2sgdG8gW1tTZXRdXSwgYW5kIHdhcyBub3QgZXhwbGljaXRseSBhc2tlZCB0byBtYWtlIG5vbi1lbnVtZXJhYmxlLCBub24td3JpdGFibGUsIG9yIG5vbi1jb25maWd1cmFibGVcblx0XHRvYmpbcHJvcGVydHldID0gdmFsdWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgJFN5bnRheEVycm9yKCdUaGlzIGVudmlyb25tZW50IGRvZXMgbm90IHN1cHBvcnQgZGVmaW5pbmcgYSBwcm9wZXJ0eSBhcyBub24tY29uZmlndXJhYmxlLCBub24td3JpdGFibGUsIG9yIG5vbi1lbnVtZXJhYmxlLicpO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgR2V0SW50cmluc2ljID0gcmVxdWlyZSgnZ2V0LWludHJpbnNpYycpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IEdldEludHJpbnNpYygnJU9iamVjdC5kZWZpbmVQcm9wZXJ0eSUnLCB0cnVlKSB8fCBmYWxzZTtcbmlmICgkZGVmaW5lUHJvcGVydHkpIHtcblx0dHJ5IHtcblx0XHQkZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyB2YWx1ZTogMSB9KTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIElFIDggaGFzIGEgYnJva2VuIGRlZmluZVByb3BlcnR5XG5cdFx0JGRlZmluZVByb3BlcnR5ID0gZmFsc2U7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAkZGVmaW5lUHJvcGVydHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL2V2YWwnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gRXZhbEVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vcmFuZ2UnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gUmFuZ2VFcnJvcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vcmVmJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IFJlZmVyZW5jZUVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi9zeW50YXgnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gU3ludGF4RXJyb3I7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuL3R5cGUnKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gVHlwZUVycm9yO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLi91cmknKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gVVJJRXJyb3I7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHN0cmluZ2lmeVxuc3RyaW5naWZ5LmRlZmF1bHQgPSBzdHJpbmdpZnlcbnN0cmluZ2lmeS5zdGFibGUgPSBkZXRlcm1pbmlzdGljU3RyaW5naWZ5XG5zdHJpbmdpZnkuc3RhYmxlU3RyaW5naWZ5ID0gZGV0ZXJtaW5pc3RpY1N0cmluZ2lmeVxuXG52YXIgTElNSVRfUkVQTEFDRV9OT0RFID0gJ1suLi5dJ1xudmFyIENJUkNVTEFSX1JFUExBQ0VfTk9ERSA9ICdbQ2lyY3VsYXJdJ1xuXG52YXIgYXJyID0gW11cbnZhciByZXBsYWNlclN0YWNrID0gW11cblxuZnVuY3Rpb24gZGVmYXVsdE9wdGlvbnMgKCkge1xuICByZXR1cm4ge1xuICAgIGRlcHRoTGltaXQ6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSLFxuICAgIGVkZ2VzTGltaXQ6IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gIH1cbn1cblxuLy8gUmVndWxhciBzdHJpbmdpZnlcbmZ1bmN0aW9uIHN0cmluZ2lmeSAob2JqLCByZXBsYWNlciwgc3BhY2VyLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnMoKVxuICB9XG5cbiAgZGVjaXJjKG9iaiwgJycsIDAsIFtdLCB1bmRlZmluZWQsIDAsIG9wdGlvbnMpXG4gIHZhciByZXNcbiAgdHJ5IHtcbiAgICBpZiAocmVwbGFjZXJTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgIHJlcyA9IEpTT04uc3RyaW5naWZ5KG9iaiwgcmVwbGFjZXIsIHNwYWNlcilcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzID0gSlNPTi5zdHJpbmdpZnkob2JqLCByZXBsYWNlR2V0dGVyVmFsdWVzKHJlcGxhY2VyKSwgc3BhY2VyKVxuICAgIH1cbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSgnW3VuYWJsZSB0byBzZXJpYWxpemUsIGNpcmN1bGFyIHJlZmVyZW5jZSBpcyB0b28gY29tcGxleCB0byBhbmFseXplXScpXG4gIH0gZmluYWxseSB7XG4gICAgd2hpbGUgKGFyci5sZW5ndGggIT09IDApIHtcbiAgICAgIHZhciBwYXJ0ID0gYXJyLnBvcCgpXG4gICAgICBpZiAocGFydC5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHBhcnRbMF0sIHBhcnRbMV0sIHBhcnRbM10pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0WzBdW3BhcnRbMV1dID0gcGFydFsyXVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIHNldFJlcGxhY2UgKHJlcGxhY2UsIHZhbCwgaywgcGFyZW50KSB7XG4gIHZhciBwcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHBhcmVudCwgaylcbiAgaWYgKHByb3BlcnR5RGVzY3JpcHRvci5nZXQgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChwcm9wZXJ0eURlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocGFyZW50LCBrLCB7IHZhbHVlOiByZXBsYWNlIH0pXG4gICAgICBhcnIucHVzaChbcGFyZW50LCBrLCB2YWwsIHByb3BlcnR5RGVzY3JpcHRvcl0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcGxhY2VyU3RhY2sucHVzaChbdmFsLCBrLCByZXBsYWNlXSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50W2tdID0gcmVwbGFjZVxuICAgIGFyci5wdXNoKFtwYXJlbnQsIGssIHZhbF0pXG4gIH1cbn1cblxuZnVuY3Rpb24gZGVjaXJjICh2YWwsIGssIGVkZ2VJbmRleCwgc3RhY2ssIHBhcmVudCwgZGVwdGgsIG9wdGlvbnMpIHtcbiAgZGVwdGggKz0gMVxuICB2YXIgaVxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgJiYgdmFsICE9PSBudWxsKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc3RhY2tbaV0gPT09IHZhbCkge1xuICAgICAgICBzZXRSZXBsYWNlKENJUkNVTEFSX1JFUExBQ0VfTk9ERSwgdmFsLCBrLCBwYXJlbnQpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHR5cGVvZiBvcHRpb25zLmRlcHRoTGltaXQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICBkZXB0aCA+IG9wdGlvbnMuZGVwdGhMaW1pdFxuICAgICkge1xuICAgICAgc2V0UmVwbGFjZShMSU1JVF9SRVBMQUNFX05PREUsIHZhbCwgaywgcGFyZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdHlwZW9mIG9wdGlvbnMuZWRnZXNMaW1pdCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIGVkZ2VJbmRleCArIDEgPiBvcHRpb25zLmVkZ2VzTGltaXRcbiAgICApIHtcbiAgICAgIHNldFJlcGxhY2UoTElNSVRfUkVQTEFDRV9OT0RFLCB2YWwsIGssIHBhcmVudClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHN0YWNrLnB1c2godmFsKVxuICAgIC8vIE9wdGltaXplIGZvciBBcnJheXMuIEJpZyBhcnJheXMgY291bGQga2lsbCB0aGUgcGVyZm9ybWFuY2Ugb3RoZXJ3aXNlIVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGVjaXJjKHZhbFtpXSwgaSwgaSwgc3RhY2ssIHZhbCwgZGVwdGgsIG9wdGlvbnMpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsKVxuICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbaV1cbiAgICAgICAgZGVjaXJjKHZhbFtrZXldLCBrZXksIGksIHN0YWNrLCB2YWwsIGRlcHRoLCBvcHRpb25zKVxuICAgICAgfVxuICAgIH1cbiAgICBzdGFjay5wb3AoKVxuICB9XG59XG5cbi8vIFN0YWJsZS1zdHJpbmdpZnlcbmZ1bmN0aW9uIGNvbXBhcmVGdW5jdGlvbiAoYSwgYikge1xuICBpZiAoYSA8IGIpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoYSA+IGIpIHtcbiAgICByZXR1cm4gMVxuICB9XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGRldGVybWluaXN0aWNTdHJpbmdpZnkgKG9iaiwgcmVwbGFjZXIsIHNwYWNlciwgb3B0aW9ucykge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgb3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zKClcbiAgfVxuXG4gIHZhciB0bXAgPSBkZXRlcm1pbmlzdGljRGVjaXJjKG9iaiwgJycsIDAsIFtdLCB1bmRlZmluZWQsIDAsIG9wdGlvbnMpIHx8IG9ialxuICB2YXIgcmVzXG4gIHRyeSB7XG4gICAgaWYgKHJlcGxhY2VyU3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICByZXMgPSBKU09OLnN0cmluZ2lmeSh0bXAsIHJlcGxhY2VyLCBzcGFjZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcyA9IEpTT04uc3RyaW5naWZ5KHRtcCwgcmVwbGFjZUdldHRlclZhbHVlcyhyZXBsYWNlciksIHNwYWNlcilcbiAgICB9XG4gIH0gY2F0Y2ggKF8pIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoJ1t1bmFibGUgdG8gc2VyaWFsaXplLCBjaXJjdWxhciByZWZlcmVuY2UgaXMgdG9vIGNvbXBsZXggdG8gYW5hbHl6ZV0nKVxuICB9IGZpbmFsbHkge1xuICAgIC8vIEVuc3VyZSB0aGF0IHdlIHJlc3RvcmUgdGhlIG9iamVjdCBhcyBpdCB3YXMuXG4gICAgd2hpbGUgKGFyci5sZW5ndGggIT09IDApIHtcbiAgICAgIHZhciBwYXJ0ID0gYXJyLnBvcCgpXG4gICAgICBpZiAocGFydC5sZW5ndGggPT09IDQpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHBhcnRbMF0sIHBhcnRbMV0sIHBhcnRbM10pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0WzBdW3BhcnRbMV1dID0gcGFydFsyXVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGRldGVybWluaXN0aWNEZWNpcmMgKHZhbCwgaywgZWRnZUluZGV4LCBzdGFjaywgcGFyZW50LCBkZXB0aCwgb3B0aW9ucykge1xuICBkZXB0aCArPSAxXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiB2YWwgIT09IG51bGwpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzdGFja1tpXSA9PT0gdmFsKSB7XG4gICAgICAgIHNldFJlcGxhY2UoQ0lSQ1VMQVJfUkVQTEFDRV9OT0RFLCB2YWwsIGssIHBhcmVudClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIHZhbC50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfSBjYXRjaCAoXykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdHlwZW9mIG9wdGlvbnMuZGVwdGhMaW1pdCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIGRlcHRoID4gb3B0aW9ucy5kZXB0aExpbWl0XG4gICAgKSB7XG4gICAgICBzZXRSZXBsYWNlKExJTUlUX1JFUExBQ0VfTk9ERSwgdmFsLCBrLCBwYXJlbnQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0eXBlb2Ygb3B0aW9ucy5lZGdlc0xpbWl0ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgZWRnZUluZGV4ICsgMSA+IG9wdGlvbnMuZWRnZXNMaW1pdFxuICAgICkge1xuICAgICAgc2V0UmVwbGFjZShMSU1JVF9SRVBMQUNFX05PREUsIHZhbCwgaywgcGFyZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc3RhY2sucHVzaCh2YWwpXG4gICAgLy8gT3B0aW1pemUgZm9yIEFycmF5cy4gQmlnIGFycmF5cyBjb3VsZCBraWxsIHRoZSBwZXJmb3JtYW5jZSBvdGhlcndpc2UhXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICBkZXRlcm1pbmlzdGljRGVjaXJjKHZhbFtpXSwgaSwgaSwgc3RhY2ssIHZhbCwgZGVwdGgsIG9wdGlvbnMpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENyZWF0ZSBhIHRlbXBvcmFyeSBvYmplY3QgaW4gdGhlIHJlcXVpcmVkIHdheVxuICAgICAgdmFyIHRtcCA9IHt9XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbCkuc29ydChjb21wYXJlRnVuY3Rpb24pXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgICBkZXRlcm1pbmlzdGljRGVjaXJjKHZhbFtrZXldLCBrZXksIGksIHN0YWNrLCB2YWwsIGRlcHRoLCBvcHRpb25zKVxuICAgICAgICB0bXBba2V5XSA9IHZhbFtrZXldXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBhcmVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgYXJyLnB1c2goW3BhcmVudCwgaywgdmFsXSlcbiAgICAgICAgcGFyZW50W2tdID0gdG1wXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdG1wXG4gICAgICB9XG4gICAgfVxuICAgIHN0YWNrLnBvcCgpXG4gIH1cbn1cblxuLy8gd3JhcHMgcmVwbGFjZXIgZnVuY3Rpb24gdG8gaGFuZGxlIHZhbHVlcyB3ZSBjb3VsZG4ndCByZXBsYWNlXG4vLyBhbmQgbWFyayB0aGVtIGFzIHJlcGxhY2VkIHZhbHVlXG5mdW5jdGlvbiByZXBsYWNlR2V0dGVyVmFsdWVzIChyZXBsYWNlcikge1xuICByZXBsYWNlciA9XG4gICAgdHlwZW9mIHJlcGxhY2VyICE9PSAndW5kZWZpbmVkJ1xuICAgICAgPyByZXBsYWNlclxuICAgICAgOiBmdW5jdGlvbiAoaywgdikge1xuICAgICAgICByZXR1cm4gdlxuICAgICAgfVxuICByZXR1cm4gZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgaWYgKHJlcGxhY2VyU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXBsYWNlclN0YWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwYXJ0ID0gcmVwbGFjZXJTdGFja1tpXVxuICAgICAgICBpZiAocGFydFsxXSA9PT0ga2V5ICYmIHBhcnRbMF0gPT09IHZhbCkge1xuICAgICAgICAgIHZhbCA9IHBhcnRbMl1cbiAgICAgICAgICByZXBsYWNlclN0YWNrLnNwbGljZShpLCAxKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWwpXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50IG5vLWludmFsaWQtdGhpczogMSAqL1xuXG52YXIgRVJST1JfTUVTU0FHRSA9ICdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBjYWxsZWQgb24gaW5jb21wYXRpYmxlICc7XG52YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIGZ1bmNUeXBlID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblxudmFyIGNvbmNhdHR5ID0gZnVuY3Rpb24gY29uY2F0dHkoYSwgYikge1xuICAgIHZhciBhcnIgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBhcnJbaV0gPSBhW2ldO1xuICAgIH1cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGIubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgYXJyW2ogKyBhLmxlbmd0aF0gPSBiW2pdO1xuICAgIH1cblxuICAgIHJldHVybiBhcnI7XG59O1xuXG52YXIgc2xpY3kgPSBmdW5jdGlvbiBzbGljeShhcnJMaWtlLCBvZmZzZXQpIHtcbiAgICB2YXIgYXJyID0gW107XG4gICAgZm9yICh2YXIgaSA9IG9mZnNldCB8fCAwLCBqID0gMDsgaSA8IGFyckxpa2UubGVuZ3RoOyBpICs9IDEsIGogKz0gMSkge1xuICAgICAgICBhcnJbal0gPSBhcnJMaWtlW2ldO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xufTtcblxudmFyIGpvaW55ID0gZnVuY3Rpb24gKGFyciwgam9pbmVyKSB7XG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHN0ciArPSBhcnJbaV07XG4gICAgICAgIGlmIChpICsgMSA8IGFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN0ciArPSBqb2luZXI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmluZCh0aGF0KSB7XG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdmdW5jdGlvbicgfHwgdG9TdHIuYXBwbHkodGFyZ2V0KSAhPT0gZnVuY1R5cGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihFUlJPUl9NRVNTQUdFICsgdGFyZ2V0KTtcbiAgICB9XG4gICAgdmFyIGFyZ3MgPSBzbGljeShhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIGJvdW5kO1xuICAgIHZhciBiaW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgYm91bmQpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0YXJnZXQuYXBwbHkoXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICBjb25jYXR0eShhcmdzLCBhcmd1bWVudHMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKE9iamVjdChyZXN1bHQpID09PSByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldC5hcHBseShcbiAgICAgICAgICAgIHRoYXQsXG4gICAgICAgICAgICBjb25jYXR0eShhcmdzLCBhcmd1bWVudHMpXG4gICAgICAgICk7XG5cbiAgICB9O1xuXG4gICAgdmFyIGJvdW5kTGVuZ3RoID0gbWF4KDAsIHRhcmdldC5sZW5ndGggLSBhcmdzLmxlbmd0aCk7XG4gICAgdmFyIGJvdW5kQXJncyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm91bmRMZW5ndGg7IGkrKykge1xuICAgICAgICBib3VuZEFyZ3NbaV0gPSAnJCcgKyBpO1xuICAgIH1cblxuICAgIGJvdW5kID0gRnVuY3Rpb24oJ2JpbmRlcicsICdyZXR1cm4gZnVuY3Rpb24gKCcgKyBqb2lueShib3VuZEFyZ3MsICcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLGFyZ3VtZW50cyk7IH0nKShiaW5kZXIpO1xuXG4gICAgaWYgKHRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgdmFyIEVtcHR5ID0gZnVuY3Rpb24gRW1wdHkoKSB7fTtcbiAgICAgICAgRW1wdHkucHJvdG90eXBlID0gdGFyZ2V0LnByb3RvdHlwZTtcbiAgICAgICAgYm91bmQucHJvdG90eXBlID0gbmV3IEVtcHR5KCk7XG4gICAgICAgIEVtcHR5LnByb3RvdHlwZSA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvdW5kO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGltcGxlbWVudGF0aW9uID0gcmVxdWlyZSgnLi9pbXBsZW1lbnRhdGlvbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kIHx8IGltcGxlbWVudGF0aW9uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdW5kZWZpbmVkO1xuXG52YXIgJEVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzJyk7XG52YXIgJEV2YWxFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy9ldmFsJyk7XG52YXIgJFJhbmdlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvcmFuZ2UnKTtcbnZhciAkUmVmZXJlbmNlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvcmVmJyk7XG52YXIgJFN5bnRheEVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3N5bnRheCcpO1xudmFyICRUeXBlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvdHlwZScpO1xudmFyICRVUklFcnJvciA9IHJlcXVpcmUoJ2VzLWVycm9ycy91cmknKTtcblxudmFyICRGdW5jdGlvbiA9IEZ1bmN0aW9uO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbnZhciBnZXRFdmFsbGVkQ29uc3RydWN0b3IgPSBmdW5jdGlvbiAoZXhwcmVzc2lvblN5bnRheCkge1xuXHR0cnkge1xuXHRcdHJldHVybiAkRnVuY3Rpb24oJ1widXNlIHN0cmljdFwiOyByZXR1cm4gKCcgKyBleHByZXNzaW9uU3ludGF4ICsgJykuY29uc3RydWN0b3I7JykoKTtcblx0fSBjYXRjaCAoZSkge31cbn07XG5cbnZhciAkZ09QRCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5pZiAoJGdPUEQpIHtcblx0dHJ5IHtcblx0XHQkZ09QRCh7fSwgJycpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0JGdPUEQgPSBudWxsOyAvLyB0aGlzIGlzIElFIDgsIHdoaWNoIGhhcyBhIGJyb2tlbiBnT1BEXG5cdH1cbn1cblxudmFyIHRocm93VHlwZUVycm9yID0gZnVuY3Rpb24gKCkge1xuXHR0aHJvdyBuZXcgJFR5cGVFcnJvcigpO1xufTtcbnZhciBUaHJvd1R5cGVFcnJvciA9ICRnT1BEXG5cdD8gKGZ1bmN0aW9uICgpIHtcblx0XHR0cnkge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC1leHByZXNzaW9ucywgbm8tY2FsbGVyLCBuby1yZXN0cmljdGVkLXByb3BlcnRpZXNcblx0XHRcdGFyZ3VtZW50cy5jYWxsZWU7IC8vIElFIDggZG9lcyBub3QgdGhyb3cgaGVyZVxuXHRcdFx0cmV0dXJuIHRocm93VHlwZUVycm9yO1xuXHRcdH0gY2F0Y2ggKGNhbGxlZVRocm93cykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Ly8gSUUgOCB0aHJvd3Mgb24gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihhcmd1bWVudHMsICcnKVxuXHRcdFx0XHRyZXR1cm4gJGdPUEQoYXJndW1lbnRzLCAnY2FsbGVlJykuZ2V0O1xuXHRcdFx0fSBjYXRjaCAoZ09QRHRocm93cykge1xuXHRcdFx0XHRyZXR1cm4gdGhyb3dUeXBlRXJyb3I7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KCkpXG5cdDogdGhyb3dUeXBlRXJyb3I7XG5cbnZhciBoYXNTeW1ib2xzID0gcmVxdWlyZSgnaGFzLXN5bWJvbHMnKSgpO1xudmFyIGhhc1Byb3RvID0gcmVxdWlyZSgnaGFzLXByb3RvJykoKTtcblxudmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IChcblx0aGFzUHJvdG9cblx0XHQ/IGZ1bmN0aW9uICh4KSB7IHJldHVybiB4Ll9fcHJvdG9fXzsgfSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvXG5cdFx0OiBudWxsXG4pO1xuXG52YXIgbmVlZHNFdmFsID0ge307XG5cbnZhciBUeXBlZEFycmF5ID0gdHlwZW9mIFVpbnQ4QXJyYXkgPT09ICd1bmRlZmluZWQnIHx8ICFnZXRQcm90byA/IHVuZGVmaW5lZCA6IGdldFByb3RvKFVpbnQ4QXJyYXkpO1xuXG52YXIgSU5UUklOU0lDUyA9IHtcblx0X19wcm90b19fOiBudWxsLFxuXHQnJUFnZ3JlZ2F0ZUVycm9yJSc6IHR5cGVvZiBBZ2dyZWdhdGVFcnJvciA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBBZ2dyZWdhdGVFcnJvcixcblx0JyVBcnJheSUnOiBBcnJheSxcblx0JyVBcnJheUJ1ZmZlciUnOiB0eXBlb2YgQXJyYXlCdWZmZXIgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogQXJyYXlCdWZmZXIsXG5cdCclQXJyYXlJdGVyYXRvclByb3RvdHlwZSUnOiBoYXNTeW1ib2xzICYmIGdldFByb3RvID8gZ2V0UHJvdG8oW11bU3ltYm9sLml0ZXJhdG9yXSgpKSA6IHVuZGVmaW5lZCxcblx0JyVBc3luY0Zyb21TeW5jSXRlcmF0b3JQcm90b3R5cGUlJzogdW5kZWZpbmVkLFxuXHQnJUFzeW5jRnVuY3Rpb24lJzogbmVlZHNFdmFsLFxuXHQnJUFzeW5jR2VuZXJhdG9yJSc6IG5lZWRzRXZhbCxcblx0JyVBc3luY0dlbmVyYXRvckZ1bmN0aW9uJSc6IG5lZWRzRXZhbCxcblx0JyVBc3luY0l0ZXJhdG9yUHJvdG90eXBlJSc6IG5lZWRzRXZhbCxcblx0JyVBdG9taWNzJSc6IHR5cGVvZiBBdG9taWNzID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEF0b21pY3MsXG5cdCclQmlnSW50JSc6IHR5cGVvZiBCaWdJbnQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogQmlnSW50LFxuXHQnJUJpZ0ludDY0QXJyYXklJzogdHlwZW9mIEJpZ0ludDY0QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogQmlnSW50NjRBcnJheSxcblx0JyVCaWdVaW50NjRBcnJheSUnOiB0eXBlb2YgQmlnVWludDY0QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogQmlnVWludDY0QXJyYXksXG5cdCclQm9vbGVhbiUnOiBCb29sZWFuLFxuXHQnJURhdGFWaWV3JSc6IHR5cGVvZiBEYXRhVmlldyA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBEYXRhVmlldyxcblx0JyVEYXRlJSc6IERhdGUsXG5cdCclZGVjb2RlVVJJJSc6IGRlY29kZVVSSSxcblx0JyVkZWNvZGVVUklDb21wb25lbnQlJzogZGVjb2RlVVJJQ29tcG9uZW50LFxuXHQnJWVuY29kZVVSSSUnOiBlbmNvZGVVUkksXG5cdCclZW5jb2RlVVJJQ29tcG9uZW50JSc6IGVuY29kZVVSSUNvbXBvbmVudCxcblx0JyVFcnJvciUnOiAkRXJyb3IsXG5cdCclZXZhbCUnOiBldmFsLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWV2YWxcblx0JyVFdmFsRXJyb3IlJzogJEV2YWxFcnJvcixcblx0JyVGbG9hdDMyQXJyYXklJzogdHlwZW9mIEZsb2F0MzJBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBGbG9hdDMyQXJyYXksXG5cdCclRmxvYXQ2NEFycmF5JSc6IHR5cGVvZiBGbG9hdDY0QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogRmxvYXQ2NEFycmF5LFxuXHQnJUZpbmFsaXphdGlvblJlZ2lzdHJ5JSc6IHR5cGVvZiBGaW5hbGl6YXRpb25SZWdpc3RyeSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBGaW5hbGl6YXRpb25SZWdpc3RyeSxcblx0JyVGdW5jdGlvbiUnOiAkRnVuY3Rpb24sXG5cdCclR2VuZXJhdG9yRnVuY3Rpb24lJzogbmVlZHNFdmFsLFxuXHQnJUludDhBcnJheSUnOiB0eXBlb2YgSW50OEFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEludDhBcnJheSxcblx0JyVJbnQxNkFycmF5JSc6IHR5cGVvZiBJbnQxNkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IEludDE2QXJyYXksXG5cdCclSW50MzJBcnJheSUnOiB0eXBlb2YgSW50MzJBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBJbnQzMkFycmF5LFxuXHQnJWlzRmluaXRlJSc6IGlzRmluaXRlLFxuXHQnJWlzTmFOJSc6IGlzTmFOLFxuXHQnJUl0ZXJhdG9yUHJvdG90eXBlJSc6IGhhc1N5bWJvbHMgJiYgZ2V0UHJvdG8gPyBnZXRQcm90byhnZXRQcm90byhbXVtTeW1ib2wuaXRlcmF0b3JdKCkpKSA6IHVuZGVmaW5lZCxcblx0JyVKU09OJSc6IHR5cGVvZiBKU09OID09PSAnb2JqZWN0JyA/IEpTT04gOiB1bmRlZmluZWQsXG5cdCclTWFwJSc6IHR5cGVvZiBNYXAgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogTWFwLFxuXHQnJU1hcEl0ZXJhdG9yUHJvdG90eXBlJSc6IHR5cGVvZiBNYXAgPT09ICd1bmRlZmluZWQnIHx8ICFoYXNTeW1ib2xzIHx8ICFnZXRQcm90byA/IHVuZGVmaW5lZCA6IGdldFByb3RvKG5ldyBNYXAoKVtTeW1ib2wuaXRlcmF0b3JdKCkpLFxuXHQnJU1hdGglJzogTWF0aCxcblx0JyVOdW1iZXIlJzogTnVtYmVyLFxuXHQnJU9iamVjdCUnOiBPYmplY3QsXG5cdCclcGFyc2VGbG9hdCUnOiBwYXJzZUZsb2F0LFxuXHQnJXBhcnNlSW50JSc6IHBhcnNlSW50LFxuXHQnJVByb21pc2UlJzogdHlwZW9mIFByb21pc2UgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogUHJvbWlzZSxcblx0JyVQcm94eSUnOiB0eXBlb2YgUHJveHkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogUHJveHksXG5cdCclUmFuZ2VFcnJvciUnOiAkUmFuZ2VFcnJvcixcblx0JyVSZWZlcmVuY2VFcnJvciUnOiAkUmVmZXJlbmNlRXJyb3IsXG5cdCclUmVmbGVjdCUnOiB0eXBlb2YgUmVmbGVjdCA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBSZWZsZWN0LFxuXHQnJVJlZ0V4cCUnOiBSZWdFeHAsXG5cdCclU2V0JSc6IHR5cGVvZiBTZXQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogU2V0LFxuXHQnJVNldEl0ZXJhdG9yUHJvdG90eXBlJSc6IHR5cGVvZiBTZXQgPT09ICd1bmRlZmluZWQnIHx8ICFoYXNTeW1ib2xzIHx8ICFnZXRQcm90byA/IHVuZGVmaW5lZCA6IGdldFByb3RvKG5ldyBTZXQoKVtTeW1ib2wuaXRlcmF0b3JdKCkpLFxuXHQnJVNoYXJlZEFycmF5QnVmZmVyJSc6IHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBTaGFyZWRBcnJheUJ1ZmZlcixcblx0JyVTdHJpbmclJzogU3RyaW5nLFxuXHQnJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJSc6IGhhc1N5bWJvbHMgJiYgZ2V0UHJvdG8gPyBnZXRQcm90bygnJ1tTeW1ib2wuaXRlcmF0b3JdKCkpIDogdW5kZWZpbmVkLFxuXHQnJVN5bWJvbCUnOiBoYXNTeW1ib2xzID8gU3ltYm9sIDogdW5kZWZpbmVkLFxuXHQnJVN5bnRheEVycm9yJSc6ICRTeW50YXhFcnJvcixcblx0JyVUaHJvd1R5cGVFcnJvciUnOiBUaHJvd1R5cGVFcnJvcixcblx0JyVUeXBlZEFycmF5JSc6IFR5cGVkQXJyYXksXG5cdCclVHlwZUVycm9yJSc6ICRUeXBlRXJyb3IsXG5cdCclVWludDhBcnJheSUnOiB0eXBlb2YgVWludDhBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBVaW50OEFycmF5LFxuXHQnJVVpbnQ4Q2xhbXBlZEFycmF5JSc6IHR5cGVvZiBVaW50OENsYW1wZWRBcnJheSA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBVaW50OENsYW1wZWRBcnJheSxcblx0JyVVaW50MTZBcnJheSUnOiB0eXBlb2YgVWludDE2QXJyYXkgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogVWludDE2QXJyYXksXG5cdCclVWludDMyQXJyYXklJzogdHlwZW9mIFVpbnQzMkFycmF5ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFVpbnQzMkFycmF5LFxuXHQnJVVSSUVycm9yJSc6ICRVUklFcnJvcixcblx0JyVXZWFrTWFwJSc6IHR5cGVvZiBXZWFrTWFwID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IFdlYWtNYXAsXG5cdCclV2Vha1JlZiUnOiB0eXBlb2YgV2Vha1JlZiA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWQgOiBXZWFrUmVmLFxuXHQnJVdlYWtTZXQlJzogdHlwZW9mIFdlYWtTZXQgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkIDogV2Vha1NldFxufTtcblxuaWYgKGdldFByb3RvKSB7XG5cdHRyeSB7XG5cdFx0bnVsbC5lcnJvcjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXNoYWRvd3JlYWxtL3B1bGwvMzg0I2lzc3VlY29tbWVudC0xMzY0MjY0MjI5XG5cdFx0dmFyIGVycm9yUHJvdG8gPSBnZXRQcm90byhnZXRQcm90byhlKSk7XG5cdFx0SU5UUklOU0lDU1snJUVycm9yLnByb3RvdHlwZSUnXSA9IGVycm9yUHJvdG87XG5cdH1cbn1cblxudmFyIGRvRXZhbCA9IGZ1bmN0aW9uIGRvRXZhbChuYW1lKSB7XG5cdHZhciB2YWx1ZTtcblx0aWYgKG5hbWUgPT09ICclQXN5bmNGdW5jdGlvbiUnKSB7XG5cdFx0dmFsdWUgPSBnZXRFdmFsbGVkQ29uc3RydWN0b3IoJ2FzeW5jIGZ1bmN0aW9uICgpIHt9Jyk7XG5cdH0gZWxzZSBpZiAobmFtZSA9PT0gJyVHZW5lcmF0b3JGdW5jdGlvbiUnKSB7XG5cdFx0dmFsdWUgPSBnZXRFdmFsbGVkQ29uc3RydWN0b3IoJ2Z1bmN0aW9uKiAoKSB7fScpO1xuXHR9IGVsc2UgaWYgKG5hbWUgPT09ICclQXN5bmNHZW5lcmF0b3JGdW5jdGlvbiUnKSB7XG5cdFx0dmFsdWUgPSBnZXRFdmFsbGVkQ29uc3RydWN0b3IoJ2FzeW5jIGZ1bmN0aW9uKiAoKSB7fScpO1xuXHR9IGVsc2UgaWYgKG5hbWUgPT09ICclQXN5bmNHZW5lcmF0b3IlJykge1xuXHRcdHZhciBmbiA9IGRvRXZhbCgnJUFzeW5jR2VuZXJhdG9yRnVuY3Rpb24lJyk7XG5cdFx0aWYgKGZuKSB7XG5cdFx0XHR2YWx1ZSA9IGZuLnByb3RvdHlwZTtcblx0XHR9XG5cdH0gZWxzZSBpZiAobmFtZSA9PT0gJyVBc3luY0l0ZXJhdG9yUHJvdG90eXBlJScpIHtcblx0XHR2YXIgZ2VuID0gZG9FdmFsKCclQXN5bmNHZW5lcmF0b3IlJyk7XG5cdFx0aWYgKGdlbiAmJiBnZXRQcm90bykge1xuXHRcdFx0dmFsdWUgPSBnZXRQcm90byhnZW4ucHJvdG90eXBlKTtcblx0XHR9XG5cdH1cblxuXHRJTlRSSU5TSUNTW25hbWVdID0gdmFsdWU7XG5cblx0cmV0dXJuIHZhbHVlO1xufTtcblxudmFyIExFR0FDWV9BTElBU0VTID0ge1xuXHRfX3Byb3RvX186IG51bGwsXG5cdCclQXJyYXlCdWZmZXJQcm90b3R5cGUlJzogWydBcnJheUJ1ZmZlcicsICdwcm90b3R5cGUnXSxcblx0JyVBcnJheVByb3RvdHlwZSUnOiBbJ0FycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUFycmF5UHJvdG9fZW50cmllcyUnOiBbJ0FycmF5JywgJ3Byb3RvdHlwZScsICdlbnRyaWVzJ10sXG5cdCclQXJyYXlQcm90b19mb3JFYWNoJSc6IFsnQXJyYXknLCAncHJvdG90eXBlJywgJ2ZvckVhY2gnXSxcblx0JyVBcnJheVByb3RvX2tleXMlJzogWydBcnJheScsICdwcm90b3R5cGUnLCAna2V5cyddLFxuXHQnJUFycmF5UHJvdG9fdmFsdWVzJSc6IFsnQXJyYXknLCAncHJvdG90eXBlJywgJ3ZhbHVlcyddLFxuXHQnJUFzeW5jRnVuY3Rpb25Qcm90b3R5cGUlJzogWydBc3luY0Z1bmN0aW9uJywgJ3Byb3RvdHlwZSddLFxuXHQnJUFzeW5jR2VuZXJhdG9yJSc6IFsnQXN5bmNHZW5lcmF0b3JGdW5jdGlvbicsICdwcm90b3R5cGUnXSxcblx0JyVBc3luY0dlbmVyYXRvclByb3RvdHlwZSUnOiBbJ0FzeW5jR2VuZXJhdG9yRnVuY3Rpb24nLCAncHJvdG90eXBlJywgJ3Byb3RvdHlwZSddLFxuXHQnJUJvb2xlYW5Qcm90b3R5cGUlJzogWydCb29sZWFuJywgJ3Byb3RvdHlwZSddLFxuXHQnJURhdGFWaWV3UHJvdG90eXBlJSc6IFsnRGF0YVZpZXcnLCAncHJvdG90eXBlJ10sXG5cdCclRGF0ZVByb3RvdHlwZSUnOiBbJ0RhdGUnLCAncHJvdG90eXBlJ10sXG5cdCclRXJyb3JQcm90b3R5cGUlJzogWydFcnJvcicsICdwcm90b3R5cGUnXSxcblx0JyVFdmFsRXJyb3JQcm90b3R5cGUlJzogWydFdmFsRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclRmxvYXQzMkFycmF5UHJvdG90eXBlJSc6IFsnRmxvYXQzMkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJUZsb2F0NjRBcnJheVByb3RvdHlwZSUnOiBbJ0Zsb2F0NjRBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVGdW5jdGlvblByb3RvdHlwZSUnOiBbJ0Z1bmN0aW9uJywgJ3Byb3RvdHlwZSddLFxuXHQnJUdlbmVyYXRvciUnOiBbJ0dlbmVyYXRvckZ1bmN0aW9uJywgJ3Byb3RvdHlwZSddLFxuXHQnJUdlbmVyYXRvclByb3RvdHlwZSUnOiBbJ0dlbmVyYXRvckZ1bmN0aW9uJywgJ3Byb3RvdHlwZScsICdwcm90b3R5cGUnXSxcblx0JyVJbnQ4QXJyYXlQcm90b3R5cGUlJzogWydJbnQ4QXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclSW50MTZBcnJheVByb3RvdHlwZSUnOiBbJ0ludDE2QXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclSW50MzJBcnJheVByb3RvdHlwZSUnOiBbJ0ludDMyQXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclSlNPTlBhcnNlJSc6IFsnSlNPTicsICdwYXJzZSddLFxuXHQnJUpTT05TdHJpbmdpZnklJzogWydKU09OJywgJ3N0cmluZ2lmeSddLFxuXHQnJU1hcFByb3RvdHlwZSUnOiBbJ01hcCcsICdwcm90b3R5cGUnXSxcblx0JyVOdW1iZXJQcm90b3R5cGUlJzogWydOdW1iZXInLCAncHJvdG90eXBlJ10sXG5cdCclT2JqZWN0UHJvdG90eXBlJSc6IFsnT2JqZWN0JywgJ3Byb3RvdHlwZSddLFxuXHQnJU9ialByb3RvX3RvU3RyaW5nJSc6IFsnT2JqZWN0JywgJ3Byb3RvdHlwZScsICd0b1N0cmluZyddLFxuXHQnJU9ialByb3RvX3ZhbHVlT2YlJzogWydPYmplY3QnLCAncHJvdG90eXBlJywgJ3ZhbHVlT2YnXSxcblx0JyVQcm9taXNlUHJvdG90eXBlJSc6IFsnUHJvbWlzZScsICdwcm90b3R5cGUnXSxcblx0JyVQcm9taXNlUHJvdG9fdGhlbiUnOiBbJ1Byb21pc2UnLCAncHJvdG90eXBlJywgJ3RoZW4nXSxcblx0JyVQcm9taXNlX2FsbCUnOiBbJ1Byb21pc2UnLCAnYWxsJ10sXG5cdCclUHJvbWlzZV9yZWplY3QlJzogWydQcm9taXNlJywgJ3JlamVjdCddLFxuXHQnJVByb21pc2VfcmVzb2x2ZSUnOiBbJ1Byb21pc2UnLCAncmVzb2x2ZSddLFxuXHQnJVJhbmdlRXJyb3JQcm90b3R5cGUlJzogWydSYW5nZUVycm9yJywgJ3Byb3RvdHlwZSddLFxuXHQnJVJlZmVyZW5jZUVycm9yUHJvdG90eXBlJSc6IFsnUmVmZXJlbmNlRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclUmVnRXhwUHJvdG90eXBlJSc6IFsnUmVnRXhwJywgJ3Byb3RvdHlwZSddLFxuXHQnJVNldFByb3RvdHlwZSUnOiBbJ1NldCcsICdwcm90b3R5cGUnXSxcblx0JyVTaGFyZWRBcnJheUJ1ZmZlclByb3RvdHlwZSUnOiBbJ1NoYXJlZEFycmF5QnVmZmVyJywgJ3Byb3RvdHlwZSddLFxuXHQnJVN0cmluZ1Byb3RvdHlwZSUnOiBbJ1N0cmluZycsICdwcm90b3R5cGUnXSxcblx0JyVTeW1ib2xQcm90b3R5cGUlJzogWydTeW1ib2wnLCAncHJvdG90eXBlJ10sXG5cdCclU3ludGF4RXJyb3JQcm90b3R5cGUlJzogWydTeW50YXhFcnJvcicsICdwcm90b3R5cGUnXSxcblx0JyVUeXBlZEFycmF5UHJvdG90eXBlJSc6IFsnVHlwZWRBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVUeXBlRXJyb3JQcm90b3R5cGUlJzogWydUeXBlRXJyb3InLCAncHJvdG90eXBlJ10sXG5cdCclVWludDhBcnJheVByb3RvdHlwZSUnOiBbJ1VpbnQ4QXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclVWludDhDbGFtcGVkQXJyYXlQcm90b3R5cGUlJzogWydVaW50OENsYW1wZWRBcnJheScsICdwcm90b3R5cGUnXSxcblx0JyVVaW50MTZBcnJheVByb3RvdHlwZSUnOiBbJ1VpbnQxNkFycmF5JywgJ3Byb3RvdHlwZSddLFxuXHQnJVVpbnQzMkFycmF5UHJvdG90eXBlJSc6IFsnVWludDMyQXJyYXknLCAncHJvdG90eXBlJ10sXG5cdCclVVJJRXJyb3JQcm90b3R5cGUlJzogWydVUklFcnJvcicsICdwcm90b3R5cGUnXSxcblx0JyVXZWFrTWFwUHJvdG90eXBlJSc6IFsnV2Vha01hcCcsICdwcm90b3R5cGUnXSxcblx0JyVXZWFrU2V0UHJvdG90eXBlJSc6IFsnV2Vha1NldCcsICdwcm90b3R5cGUnXVxufTtcblxudmFyIGJpbmQgPSByZXF1aXJlKCdmdW5jdGlvbi1iaW5kJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnaGFzb3duJyk7XG52YXIgJGNvbmNhdCA9IGJpbmQuY2FsbChGdW5jdGlvbi5jYWxsLCBBcnJheS5wcm90b3R5cGUuY29uY2F0KTtcbnZhciAkc3BsaWNlQXBwbHkgPSBiaW5kLmNhbGwoRnVuY3Rpb24uYXBwbHksIEFycmF5LnByb3RvdHlwZS5zcGxpY2UpO1xudmFyICRyZXBsYWNlID0gYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZSk7XG52YXIgJHN0clNsaWNlID0gYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIFN0cmluZy5wcm90b3R5cGUuc2xpY2UpO1xudmFyICRleGVjID0gYmluZC5jYWxsKEZ1bmN0aW9uLmNhbGwsIFJlZ0V4cC5wcm90b3R5cGUuZXhlYyk7XG5cbi8qIGFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbG9kYXNoL2xvZGFzaC9ibG9iLzQuMTcuMTUvZGlzdC9sb2Rhc2guanMjTDY3MzUtTDY3NDQgKi9cbnZhciByZVByb3BOYW1lID0gL1teJS5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqPylcXDIpXFxdfCg/PSg/OlxcLnxcXFtcXF0pKD86XFwufFxcW1xcXXwlJCkpL2c7XG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7IC8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHN0cmluZ1RvUGF0aCA9IGZ1bmN0aW9uIHN0cmluZ1RvUGF0aChzdHJpbmcpIHtcblx0dmFyIGZpcnN0ID0gJHN0clNsaWNlKHN0cmluZywgMCwgMSk7XG5cdHZhciBsYXN0ID0gJHN0clNsaWNlKHN0cmluZywgLTEpO1xuXHRpZiAoZmlyc3QgPT09ICclJyAmJiBsYXN0ICE9PSAnJScpIHtcblx0XHR0aHJvdyBuZXcgJFN5bnRheEVycm9yKCdpbnZhbGlkIGludHJpbnNpYyBzeW50YXgsIGV4cGVjdGVkIGNsb3NpbmcgYCVgJyk7XG5cdH0gZWxzZSBpZiAobGFzdCA9PT0gJyUnICYmIGZpcnN0ICE9PSAnJScpIHtcblx0XHR0aHJvdyBuZXcgJFN5bnRheEVycm9yKCdpbnZhbGlkIGludHJpbnNpYyBzeW50YXgsIGV4cGVjdGVkIG9wZW5pbmcgYCVgJyk7XG5cdH1cblx0dmFyIHJlc3VsdCA9IFtdO1xuXHQkcmVwbGFjZShzdHJpbmcsIHJlUHJvcE5hbWUsIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3ViU3RyaW5nKSB7XG5cdFx0cmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gcXVvdGUgPyAkcmVwbGFjZShzdWJTdHJpbmcsIHJlRXNjYXBlQ2hhciwgJyQxJykgOiBudW1iZXIgfHwgbWF0Y2g7XG5cdH0pO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbi8qIGVuZCBhZGFwdGF0aW9uICovXG5cbnZhciBnZXRCYXNlSW50cmluc2ljID0gZnVuY3Rpb24gZ2V0QmFzZUludHJpbnNpYyhuYW1lLCBhbGxvd01pc3NpbmcpIHtcblx0dmFyIGludHJpbnNpY05hbWUgPSBuYW1lO1xuXHR2YXIgYWxpYXM7XG5cdGlmIChoYXNPd24oTEVHQUNZX0FMSUFTRVMsIGludHJpbnNpY05hbWUpKSB7XG5cdFx0YWxpYXMgPSBMRUdBQ1lfQUxJQVNFU1tpbnRyaW5zaWNOYW1lXTtcblx0XHRpbnRyaW5zaWNOYW1lID0gJyUnICsgYWxpYXNbMF0gKyAnJSc7XG5cdH1cblxuXHRpZiAoaGFzT3duKElOVFJJTlNJQ1MsIGludHJpbnNpY05hbWUpKSB7XG5cdFx0dmFyIHZhbHVlID0gSU5UUklOU0lDU1tpbnRyaW5zaWNOYW1lXTtcblx0XHRpZiAodmFsdWUgPT09IG5lZWRzRXZhbCkge1xuXHRcdFx0dmFsdWUgPSBkb0V2YWwoaW50cmluc2ljTmFtZSk7XG5cdFx0fVxuXHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnICYmICFhbGxvd01pc3NpbmcpIHtcblx0XHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdpbnRyaW5zaWMgJyArIG5hbWUgKyAnIGV4aXN0cywgYnV0IGlzIG5vdCBhdmFpbGFibGUuIFBsZWFzZSBmaWxlIGFuIGlzc3VlIScpO1xuXHRcdH1cblxuXHRcdHJldHVybiB7XG5cdFx0XHRhbGlhczogYWxpYXMsXG5cdFx0XHRuYW1lOiBpbnRyaW5zaWNOYW1lLFxuXHRcdFx0dmFsdWU6IHZhbHVlXG5cdFx0fTtcblx0fVxuXG5cdHRocm93IG5ldyAkU3ludGF4RXJyb3IoJ2ludHJpbnNpYyAnICsgbmFtZSArICcgZG9lcyBub3QgZXhpc3QhJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIEdldEludHJpbnNpYyhuYW1lLCBhbGxvd01pc3NpbmcpIHtcblx0aWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJyB8fCBuYW1lLmxlbmd0aCA9PT0gMCkge1xuXHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdpbnRyaW5zaWMgbmFtZSBtdXN0IGJlIGEgbm9uLWVtcHR5IHN0cmluZycpO1xuXHR9XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSAmJiB0eXBlb2YgYWxsb3dNaXNzaW5nICE9PSAnYm9vbGVhbicpIHtcblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignXCJhbGxvd01pc3NpbmdcIiBhcmd1bWVudCBtdXN0IGJlIGEgYm9vbGVhbicpO1xuXHR9XG5cblx0aWYgKCRleGVjKC9eJT9bXiVdKiU/JC8sIG5hbWUpID09PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3ICRTeW50YXhFcnJvcignYCVgIG1heSBub3QgYmUgcHJlc2VudCBhbnl3aGVyZSBidXQgYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIHRoZSBpbnRyaW5zaWMgbmFtZScpO1xuXHR9XG5cdHZhciBwYXJ0cyA9IHN0cmluZ1RvUGF0aChuYW1lKTtcblx0dmFyIGludHJpbnNpY0Jhc2VOYW1lID0gcGFydHMubGVuZ3RoID4gMCA/IHBhcnRzWzBdIDogJyc7XG5cblx0dmFyIGludHJpbnNpYyA9IGdldEJhc2VJbnRyaW5zaWMoJyUnICsgaW50cmluc2ljQmFzZU5hbWUgKyAnJScsIGFsbG93TWlzc2luZyk7XG5cdHZhciBpbnRyaW5zaWNSZWFsTmFtZSA9IGludHJpbnNpYy5uYW1lO1xuXHR2YXIgdmFsdWUgPSBpbnRyaW5zaWMudmFsdWU7XG5cdHZhciBza2lwRnVydGhlckNhY2hpbmcgPSBmYWxzZTtcblxuXHR2YXIgYWxpYXMgPSBpbnRyaW5zaWMuYWxpYXM7XG5cdGlmIChhbGlhcykge1xuXHRcdGludHJpbnNpY0Jhc2VOYW1lID0gYWxpYXNbMF07XG5cdFx0JHNwbGljZUFwcGx5KHBhcnRzLCAkY29uY2F0KFswLCAxXSwgYWxpYXMpKTtcblx0fVxuXG5cdGZvciAodmFyIGkgPSAxLCBpc093biA9IHRydWU7IGkgPCBwYXJ0cy5sZW5ndGg7IGkgKz0gMSkge1xuXHRcdHZhciBwYXJ0ID0gcGFydHNbaV07XG5cdFx0dmFyIGZpcnN0ID0gJHN0clNsaWNlKHBhcnQsIDAsIDEpO1xuXHRcdHZhciBsYXN0ID0gJHN0clNsaWNlKHBhcnQsIC0xKTtcblx0XHRpZiAoXG5cdFx0XHQoXG5cdFx0XHRcdChmaXJzdCA9PT0gJ1wiJyB8fCBmaXJzdCA9PT0gXCInXCIgfHwgZmlyc3QgPT09ICdgJylcblx0XHRcdFx0fHwgKGxhc3QgPT09ICdcIicgfHwgbGFzdCA9PT0gXCInXCIgfHwgbGFzdCA9PT0gJ2AnKVxuXHRcdFx0KVxuXHRcdFx0JiYgZmlyc3QgIT09IGxhc3Rcblx0XHQpIHtcblx0XHRcdHRocm93IG5ldyAkU3ludGF4RXJyb3IoJ3Byb3BlcnR5IG5hbWVzIHdpdGggcXVvdGVzIG11c3QgaGF2ZSBtYXRjaGluZyBxdW90ZXMnKTtcblx0XHR9XG5cdFx0aWYgKHBhcnQgPT09ICdjb25zdHJ1Y3RvcicgfHwgIWlzT3duKSB7XG5cdFx0XHRza2lwRnVydGhlckNhY2hpbmcgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGludHJpbnNpY0Jhc2VOYW1lICs9ICcuJyArIHBhcnQ7XG5cdFx0aW50cmluc2ljUmVhbE5hbWUgPSAnJScgKyBpbnRyaW5zaWNCYXNlTmFtZSArICclJztcblxuXHRcdGlmIChoYXNPd24oSU5UUklOU0lDUywgaW50cmluc2ljUmVhbE5hbWUpKSB7XG5cdFx0XHR2YWx1ZSA9IElOVFJJTlNJQ1NbaW50cmluc2ljUmVhbE5hbWVdO1xuXHRcdH0gZWxzZSBpZiAodmFsdWUgIT0gbnVsbCkge1xuXHRcdFx0aWYgKCEocGFydCBpbiB2YWx1ZSkpIHtcblx0XHRcdFx0aWYgKCFhbGxvd01pc3NpbmcpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignYmFzZSBpbnRyaW5zaWMgZm9yICcgKyBuYW1lICsgJyBleGlzdHMsIGJ1dCB0aGUgcHJvcGVydHkgaXMgbm90IGF2YWlsYWJsZS4nKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gdm9pZCB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0XHRpZiAoJGdPUEQgJiYgKGkgKyAxKSA+PSBwYXJ0cy5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIGRlc2MgPSAkZ09QRCh2YWx1ZSwgcGFydCk7XG5cdFx0XHRcdGlzT3duID0gISFkZXNjO1xuXG5cdFx0XHRcdC8vIEJ5IGNvbnZlbnRpb24sIHdoZW4gYSBkYXRhIHByb3BlcnR5IGlzIGNvbnZlcnRlZCB0byBhbiBhY2Nlc3NvclxuXHRcdFx0XHQvLyBwcm9wZXJ0eSB0byBlbXVsYXRlIGEgZGF0YSBwcm9wZXJ0eSB0aGF0IGRvZXMgbm90IHN1ZmZlciBmcm9tXG5cdFx0XHRcdC8vIHRoZSBvdmVycmlkZSBtaXN0YWtlLCB0aGF0IGFjY2Vzc29yJ3MgZ2V0dGVyIGlzIG1hcmtlZCB3aXRoXG5cdFx0XHRcdC8vIGFuIGBvcmlnaW5hbFZhbHVlYCBwcm9wZXJ0eS4gSGVyZSwgd2hlbiB3ZSBkZXRlY3QgdGhpcywgd2Vcblx0XHRcdFx0Ly8gdXBob2xkIHRoZSBpbGx1c2lvbiBieSBwcmV0ZW5kaW5nIHRvIHNlZSB0aGF0IG9yaWdpbmFsIGRhdGFcblx0XHRcdFx0Ly8gcHJvcGVydHksIGkuZS4sIHJldHVybmluZyB0aGUgdmFsdWUgcmF0aGVyIHRoYW4gdGhlIGdldHRlclxuXHRcdFx0XHQvLyBpdHNlbGYuXG5cdFx0XHRcdGlmIChpc093biAmJiAnZ2V0JyBpbiBkZXNjICYmICEoJ29yaWdpbmFsVmFsdWUnIGluIGRlc2MuZ2V0KSkge1xuXHRcdFx0XHRcdHZhbHVlID0gZGVzYy5nZXQ7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFsdWUgPSB2YWx1ZVtwYXJ0XTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aXNPd24gPSBoYXNPd24odmFsdWUsIHBhcnQpO1xuXHRcdFx0XHR2YWx1ZSA9IHZhbHVlW3BhcnRdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaXNPd24gJiYgIXNraXBGdXJ0aGVyQ2FjaGluZykge1xuXHRcdFx0XHRJTlRSSU5TSUNTW2ludHJpbnNpY1JlYWxOYW1lXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gdmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgR2V0SW50cmluc2ljID0gcmVxdWlyZSgnZ2V0LWludHJpbnNpYycpO1xuXG52YXIgJGdPUEQgPSBHZXRJbnRyaW5zaWMoJyVPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJScsIHRydWUpO1xuXG5pZiAoJGdPUEQpIHtcblx0dHJ5IHtcblx0XHQkZ09QRChbXSwgJ2xlbmd0aCcpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gSUUgOCBoYXMgYSBicm9rZW4gZ09QRFxuXHRcdCRnT1BEID0gbnVsbDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9ICRnT1BEO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnZXMtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbnZhciBoYXNQcm9wZXJ0eURlc2NyaXB0b3JzID0gZnVuY3Rpb24gaGFzUHJvcGVydHlEZXNjcmlwdG9ycygpIHtcblx0cmV0dXJuICEhJGRlZmluZVByb3BlcnR5O1xufTtcblxuaGFzUHJvcGVydHlEZXNjcmlwdG9ycy5oYXNBcnJheUxlbmd0aERlZmluZUJ1ZyA9IGZ1bmN0aW9uIGhhc0FycmF5TGVuZ3RoRGVmaW5lQnVnKCkge1xuXHQvLyBub2RlIHYwLjYgaGFzIGEgYnVnIHdoZXJlIGFycmF5IGxlbmd0aHMgY2FuIGJlIFNldCBidXQgbm90IERlZmluZWRcblx0aWYgKCEkZGVmaW5lUHJvcGVydHkpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHR0cnkge1xuXHRcdHJldHVybiAkZGVmaW5lUHJvcGVydHkoW10sICdsZW5ndGgnLCB7IHZhbHVlOiAxIH0pLmxlbmd0aCAhPT0gMTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdC8vIEluIEZpcmVmb3ggNC0yMiwgZGVmaW5pbmcgbGVuZ3RoIG9uIGFuIGFycmF5IHRocm93cyBhbiBleGNlcHRpb24uXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzUHJvcGVydHlEZXNjcmlwdG9ycztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRlc3QgPSB7XG5cdF9fcHJvdG9fXzogbnVsbCxcblx0Zm9vOiB7fVxufTtcblxudmFyICRPYmplY3QgPSBPYmplY3Q7XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCcuJyl9ICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhc1Byb3RvKCkge1xuXHQvLyBAdHMtZXhwZWN0LWVycm9yOiBUUyBlcnJvcnMgb24gYW4gaW5oZXJpdGVkIHByb3BlcnR5IGZvciBzb21lIHJlYXNvblxuXHRyZXR1cm4geyBfX3Byb3RvX186IHRlc3QgfS5mb28gPT09IHRlc3QuZm9vXG5cdFx0JiYgISh0ZXN0IGluc3RhbmNlb2YgJE9iamVjdCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgb3JpZ1N5bWJvbCA9IHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbDtcbnZhciBoYXNTeW1ib2xTaGFtID0gcmVxdWlyZSgnLi9zaGFtcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGhhc05hdGl2ZVN5bWJvbHMoKSB7XG5cdGlmICh0eXBlb2Ygb3JpZ1N5bWJvbCAhPT0gJ2Z1bmN0aW9uJykgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmICh0eXBlb2Ygb3JpZ1N5bWJvbCgnZm9vJykgIT09ICdzeW1ib2wnKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAodHlwZW9mIFN5bWJvbCgnYmFyJykgIT09ICdzeW1ib2wnKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdHJldHVybiBoYXNTeW1ib2xTaGFtKCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBlc2xpbnQgY29tcGxleGl0eTogWzIsIDE4XSwgbWF4LXN0YXRlbWVudHM6IFsyLCAzM10gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaGFzU3ltYm9scygpIHtcblx0aWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgIT09ICdmdW5jdGlvbicpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdGlmICh0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSAnc3ltYm9sJykgeyByZXR1cm4gdHJ1ZTsgfVxuXG5cdHZhciBvYmogPSB7fTtcblx0dmFyIHN5bSA9IFN5bWJvbCgndGVzdCcpO1xuXHR2YXIgc3ltT2JqID0gT2JqZWN0KHN5bSk7XG5cdGlmICh0eXBlb2Ygc3ltID09PSAnc3RyaW5nJykgeyByZXR1cm4gZmFsc2U7IH1cblxuXHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN5bSkgIT09ICdbb2JqZWN0IFN5bWJvbF0nKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN5bU9iaikgIT09ICdbb2JqZWN0IFN5bWJvbF0nKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdC8vIHRlbXAgZGlzYWJsZWQgcGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9samhhcmIvb2JqZWN0LmFzc2lnbi9pc3N1ZXMvMTdcblx0Ly8gaWYgKHN5bSBpbnN0YW5jZW9mIFN5bWJvbCkgeyByZXR1cm4gZmFsc2U7IH1cblx0Ly8gdGVtcCBkaXNhYmxlZCBwZXIgaHR0cHM6Ly9naXRodWIuY29tL1dlYlJlZmxlY3Rpb24vZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzL2lzc3Vlcy80XG5cdC8vIGlmICghKHN5bU9iaiBpbnN0YW5jZW9mIFN5bWJvbCkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0Ly8gaWYgKHR5cGVvZiBTeW1ib2wucHJvdG90eXBlLnRvU3RyaW5nICE9PSAnZnVuY3Rpb24nKSB7IHJldHVybiBmYWxzZTsgfVxuXHQvLyBpZiAoU3RyaW5nKHN5bSkgIT09IFN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzeW0pKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdHZhciBzeW1WYWwgPSA0Mjtcblx0b2JqW3N5bV0gPSBzeW1WYWw7XG5cdGZvciAoc3ltIGluIG9iaikgeyByZXR1cm4gZmFsc2U7IH0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheCwgbm8tdW5yZWFjaGFibGUtbG9vcFxuXHRpZiAodHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nICYmIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoICE9PSAwKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdGlmICh0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgPT09ICdmdW5jdGlvbicgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5sZW5ndGggIT09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0dmFyIHN5bXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iaik7XG5cdGlmIChzeW1zLmxlbmd0aCAhPT0gMSB8fCBzeW1zWzBdICE9PSBzeW0pIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0aWYgKCFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqLCBzeW0pKSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdGlmICh0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHN5bSk7XG5cdFx0aWYgKGRlc2NyaXB0b3IudmFsdWUgIT09IHN5bVZhbCB8fCBkZXNjcmlwdG9yLmVudW1lcmFibGUgIT09IHRydWUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjYWxsID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGw7XG52YXIgJGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgYmluZCA9IHJlcXVpcmUoJ2Z1bmN0aW9uLWJpbmQnKTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKX0gKi9cbm1vZHVsZS5leHBvcnRzID0gYmluZC5jYWxsKGNhbGwsICRoYXNPd24pO1xuIiwiLyohIE5hdGl2ZSBQcm9taXNlIE9ubHlcbiAgICB2MC44LjEgKGMpIEt5bGUgU2ltcHNvblxuICAgIE1JVCBMaWNlbnNlOiBodHRwOi8vZ2V0aWZ5Lm1pdC1saWNlbnNlLm9yZ1xuKi9cblxuKGZ1bmN0aW9uIFVNRChuYW1lLGNvbnRleHQsZGVmaW5pdGlvbil7XG5cdC8vIHNwZWNpYWwgZm9ybSBvZiBVTUQgZm9yIHBvbHlmaWxsaW5nIGFjcm9zcyBldmlyb25tZW50c1xuXHRjb250ZXh0W25hbWVdID0gY29udGV4dFtuYW1lXSB8fCBkZWZpbml0aW9uKCk7XG5cdGlmICh0eXBlb2YgbW9kdWxlICE9IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHsgbW9kdWxlLmV4cG9ydHMgPSBjb250ZXh0W25hbWVdOyB9XG5cdGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHsgZGVmaW5lKGZ1bmN0aW9uICRBTUQkKCl7IHJldHVybiBjb250ZXh0W25hbWVdOyB9KTsgfVxufSkoXCJQcm9taXNlXCIsdHlwZW9mIGdsb2JhbCAhPSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdGhpcyxmdW5jdGlvbiBERUYoKXtcblx0Lypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIGJ1aWx0SW5Qcm9wLCBjeWNsZSwgc2NoZWR1bGluZ19xdWV1ZSxcblx0XHRUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG5cdFx0dGltZXIgPSAodHlwZW9mIHNldEltbWVkaWF0ZSAhPSBcInVuZGVmaW5lZFwiKSA/XG5cdFx0XHRmdW5jdGlvbiB0aW1lcihmbikgeyByZXR1cm4gc2V0SW1tZWRpYXRlKGZuKTsgfSA6XG5cdFx0XHRzZXRUaW1lb3V0XG5cdDtcblxuXHQvLyBkYW1taXQsIElFOC5cblx0dHJ5IHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sXCJ4XCIse30pO1xuXHRcdGJ1aWx0SW5Qcm9wID0gZnVuY3Rpb24gYnVpbHRJblByb3Aob2JqLG5hbWUsdmFsLGNvbmZpZykge1xuXHRcdFx0cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosbmFtZSx7XG5cdFx0XHRcdHZhbHVlOiB2YWwsXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxuXHRcdFx0XHRjb25maWd1cmFibGU6IGNvbmZpZyAhPT0gZmFsc2Vcblx0XHRcdH0pO1xuXHRcdH07XG5cdH1cblx0Y2F0Y2ggKGVycikge1xuXHRcdGJ1aWx0SW5Qcm9wID0gZnVuY3Rpb24gYnVpbHRJblByb3Aob2JqLG5hbWUsdmFsKSB7XG5cdFx0XHRvYmpbbmFtZV0gPSB2YWw7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH07XG5cdH1cblxuXHQvLyBOb3RlOiB1c2luZyBhIHF1ZXVlIGluc3RlYWQgb2YgYXJyYXkgZm9yIGVmZmljaWVuY3lcblx0c2NoZWR1bGluZ19xdWV1ZSA9IChmdW5jdGlvbiBRdWV1ZSgpIHtcblx0XHR2YXIgZmlyc3QsIGxhc3QsIGl0ZW07XG5cblx0XHRmdW5jdGlvbiBJdGVtKGZuLHNlbGYpIHtcblx0XHRcdHRoaXMuZm4gPSBmbjtcblx0XHRcdHRoaXMuc2VsZiA9IHNlbGY7XG5cdFx0XHR0aGlzLm5leHQgPSB2b2lkIDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGFkZDogZnVuY3Rpb24gYWRkKGZuLHNlbGYpIHtcblx0XHRcdFx0aXRlbSA9IG5ldyBJdGVtKGZuLHNlbGYpO1xuXHRcdFx0XHRpZiAobGFzdCkge1xuXHRcdFx0XHRcdGxhc3QubmV4dCA9IGl0ZW07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Zmlyc3QgPSBpdGVtO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxhc3QgPSBpdGVtO1xuXHRcdFx0XHRpdGVtID0gdm9pZCAwO1xuXHRcdFx0fSxcblx0XHRcdGRyYWluOiBmdW5jdGlvbiBkcmFpbigpIHtcblx0XHRcdFx0dmFyIGYgPSBmaXJzdDtcblx0XHRcdFx0Zmlyc3QgPSBsYXN0ID0gY3ljbGUgPSB2b2lkIDA7XG5cblx0XHRcdFx0d2hpbGUgKGYpIHtcblx0XHRcdFx0XHRmLmZuLmNhbGwoZi5zZWxmKTtcblx0XHRcdFx0XHRmID0gZi5uZXh0O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblx0fSkoKTtcblxuXHRmdW5jdGlvbiBzY2hlZHVsZShmbixzZWxmKSB7XG5cdFx0c2NoZWR1bGluZ19xdWV1ZS5hZGQoZm4sc2VsZik7XG5cdFx0aWYgKCFjeWNsZSkge1xuXHRcdFx0Y3ljbGUgPSB0aW1lcihzY2hlZHVsaW5nX3F1ZXVlLmRyYWluKTtcblx0XHR9XG5cdH1cblxuXHQvLyBwcm9taXNlIGR1Y2sgdHlwaW5nXG5cdGZ1bmN0aW9uIGlzVGhlbmFibGUobykge1xuXHRcdHZhciBfdGhlbiwgb190eXBlID0gdHlwZW9mIG87XG5cblx0XHRpZiAobyAhPSBudWxsICYmXG5cdFx0XHQoXG5cdFx0XHRcdG9fdHlwZSA9PSBcIm9iamVjdFwiIHx8IG9fdHlwZSA9PSBcImZ1bmN0aW9uXCJcblx0XHRcdClcblx0XHQpIHtcblx0XHRcdF90aGVuID0gby50aGVuO1xuXHRcdH1cblx0XHRyZXR1cm4gdHlwZW9mIF90aGVuID09IFwiZnVuY3Rpb25cIiA/IF90aGVuIDogZmFsc2U7XG5cdH1cblxuXHRmdW5jdGlvbiBub3RpZnkoKSB7XG5cdFx0Zm9yICh2YXIgaT0wOyBpPHRoaXMuY2hhaW4ubGVuZ3RoOyBpKyspIHtcblx0XHRcdG5vdGlmeUlzb2xhdGVkKFxuXHRcdFx0XHR0aGlzLFxuXHRcdFx0XHQodGhpcy5zdGF0ZSA9PT0gMSkgPyB0aGlzLmNoYWluW2ldLnN1Y2Nlc3MgOiB0aGlzLmNoYWluW2ldLmZhaWx1cmUsXG5cdFx0XHRcdHRoaXMuY2hhaW5baV1cblx0XHRcdCk7XG5cdFx0fVxuXHRcdHRoaXMuY2hhaW4ubGVuZ3RoID0gMDtcblx0fVxuXG5cdC8vIE5PVEU6IFRoaXMgaXMgYSBzZXBhcmF0ZSBmdW5jdGlvbiB0byBpc29sYXRlXG5cdC8vIHRoZSBgdHJ5Li5jYXRjaGAgc28gdGhhdCBvdGhlciBjb2RlIGNhbiBiZVxuXHQvLyBvcHRpbWl6ZWQgYmV0dGVyXG5cdGZ1bmN0aW9uIG5vdGlmeUlzb2xhdGVkKHNlbGYsY2IsY2hhaW4pIHtcblx0XHR2YXIgcmV0LCBfdGhlbjtcblx0XHR0cnkge1xuXHRcdFx0aWYgKGNiID09PSBmYWxzZSkge1xuXHRcdFx0XHRjaGFpbi5yZWplY3Qoc2VsZi5tc2cpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChjYiA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRcdHJldCA9IHNlbGYubXNnO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHJldCA9IGNiLmNhbGwodm9pZCAwLHNlbGYubXNnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyZXQgPT09IGNoYWluLnByb21pc2UpIHtcblx0XHRcdFx0XHRjaGFpbi5yZWplY3QoVHlwZUVycm9yKFwiUHJvbWlzZS1jaGFpbiBjeWNsZVwiKSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoX3RoZW4gPSBpc1RoZW5hYmxlKHJldCkpIHtcblx0XHRcdFx0XHRfdGhlbi5jYWxsKHJldCxjaGFpbi5yZXNvbHZlLGNoYWluLnJlamVjdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y2hhaW4ucmVzb2x2ZShyZXQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChlcnIpIHtcblx0XHRcdGNoYWluLnJlamVjdChlcnIpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlc29sdmUobXNnKSB7XG5cdFx0dmFyIF90aGVuLCBzZWxmID0gdGhpcztcblxuXHRcdC8vIGFscmVhZHkgdHJpZ2dlcmVkP1xuXHRcdGlmIChzZWxmLnRyaWdnZXJlZCkgeyByZXR1cm47IH1cblxuXHRcdHNlbGYudHJpZ2dlcmVkID0gdHJ1ZTtcblxuXHRcdC8vIHVud3JhcFxuXHRcdGlmIChzZWxmLmRlZikge1xuXHRcdFx0c2VsZiA9IHNlbGYuZGVmO1xuXHRcdH1cblxuXHRcdHRyeSB7XG5cdFx0XHRpZiAoX3RoZW4gPSBpc1RoZW5hYmxlKG1zZykpIHtcblx0XHRcdFx0c2NoZWR1bGUoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgZGVmX3dyYXBwZXIgPSBuZXcgTWFrZURlZldyYXBwZXIoc2VsZik7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdF90aGVuLmNhbGwobXNnLFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAkcmVzb2x2ZSQoKXsgcmVzb2x2ZS5hcHBseShkZWZfd3JhcHBlcixhcmd1bWVudHMpOyB9LFxuXHRcdFx0XHRcdFx0XHRmdW5jdGlvbiAkcmVqZWN0JCgpeyByZWplY3QuYXBwbHkoZGVmX3dyYXBwZXIsYXJndW1lbnRzKTsgfVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdFx0cmVqZWN0LmNhbGwoZGVmX3dyYXBwZXIsZXJyKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2VsZi5tc2cgPSBtc2c7XG5cdFx0XHRcdHNlbGYuc3RhdGUgPSAxO1xuXHRcdFx0XHRpZiAoc2VsZi5jaGFpbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0c2NoZWR1bGUobm90aWZ5LHNlbGYpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGNhdGNoIChlcnIpIHtcblx0XHRcdHJlamVjdC5jYWxsKG5ldyBNYWtlRGVmV3JhcHBlcihzZWxmKSxlcnIpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHJlamVjdChtc2cpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cblx0XHQvLyBhbHJlYWR5IHRyaWdnZXJlZD9cblx0XHRpZiAoc2VsZi50cmlnZ2VyZWQpIHsgcmV0dXJuOyB9XG5cblx0XHRzZWxmLnRyaWdnZXJlZCA9IHRydWU7XG5cblx0XHQvLyB1bndyYXBcblx0XHRpZiAoc2VsZi5kZWYpIHtcblx0XHRcdHNlbGYgPSBzZWxmLmRlZjtcblx0XHR9XG5cblx0XHRzZWxmLm1zZyA9IG1zZztcblx0XHRzZWxmLnN0YXRlID0gMjtcblx0XHRpZiAoc2VsZi5jaGFpbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRzY2hlZHVsZShub3RpZnksc2VsZik7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gaXRlcmF0ZVByb21pc2VzKENvbnN0cnVjdG9yLGFycixyZXNvbHZlcixyZWplY3Rlcikge1xuXHRcdGZvciAodmFyIGlkeD0wOyBpZHg8YXJyLmxlbmd0aDsgaWR4KyspIHtcblx0XHRcdChmdW5jdGlvbiBJSUZFKGlkeCl7XG5cdFx0XHRcdENvbnN0cnVjdG9yLnJlc29sdmUoYXJyW2lkeF0pXG5cdFx0XHRcdC50aGVuKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICRyZXNvbHZlciQobXNnKXtcblx0XHRcdFx0XHRcdHJlc29sdmVyKGlkeCxtc2cpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0cmVqZWN0ZXJcblx0XHRcdFx0KTtcblx0XHRcdH0pKGlkeCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gTWFrZURlZldyYXBwZXIoc2VsZikge1xuXHRcdHRoaXMuZGVmID0gc2VsZjtcblx0XHR0aGlzLnRyaWdnZXJlZCA9IGZhbHNlO1xuXHR9XG5cblx0ZnVuY3Rpb24gTWFrZURlZihzZWxmKSB7XG5cdFx0dGhpcy5wcm9taXNlID0gc2VsZjtcblx0XHR0aGlzLnN0YXRlID0gMDtcblx0XHR0aGlzLnRyaWdnZXJlZCA9IGZhbHNlO1xuXHRcdHRoaXMuY2hhaW4gPSBbXTtcblx0XHR0aGlzLm1zZyA9IHZvaWQgMDtcblx0fVxuXG5cdGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcblx0XHRpZiAodHlwZW9mIGV4ZWN1dG9yICE9IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0dGhyb3cgVHlwZUVycm9yKFwiTm90IGEgZnVuY3Rpb25cIik7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX19OUE9fXyAhPT0gMCkge1xuXHRcdFx0dGhyb3cgVHlwZUVycm9yKFwiTm90IGEgcHJvbWlzZVwiKTtcblx0XHR9XG5cblx0XHQvLyBpbnN0YW5jZSBzaGFkb3dpbmcgdGhlIGluaGVyaXRlZCBcImJyYW5kXCJcblx0XHQvLyB0byBzaWduYWwgYW4gYWxyZWFkeSBcImluaXRpYWxpemVkXCIgcHJvbWlzZVxuXHRcdHRoaXMuX19OUE9fXyA9IDE7XG5cblx0XHR2YXIgZGVmID0gbmV3IE1ha2VEZWYodGhpcyk7XG5cblx0XHR0aGlzW1widGhlblwiXSA9IGZ1bmN0aW9uIHRoZW4oc3VjY2VzcyxmYWlsdXJlKSB7XG5cdFx0XHR2YXIgbyA9IHtcblx0XHRcdFx0c3VjY2VzczogdHlwZW9mIHN1Y2Nlc3MgPT0gXCJmdW5jdGlvblwiID8gc3VjY2VzcyA6IHRydWUsXG5cdFx0XHRcdGZhaWx1cmU6IHR5cGVvZiBmYWlsdXJlID09IFwiZnVuY3Rpb25cIiA/IGZhaWx1cmUgOiBmYWxzZVxuXHRcdFx0fTtcblx0XHRcdC8vIE5vdGU6IGB0aGVuKC4uKWAgaXRzZWxmIGNhbiBiZSBib3Jyb3dlZCB0byBiZSB1c2VkIGFnYWluc3Rcblx0XHRcdC8vIGEgZGlmZmVyZW50IHByb21pc2UgY29uc3RydWN0b3IgZm9yIG1ha2luZyB0aGUgY2hhaW5lZCBwcm9taXNlLFxuXHRcdFx0Ly8gYnkgc3Vic3RpdHV0aW5nIGEgZGlmZmVyZW50IGB0aGlzYCBiaW5kaW5nLlxuXHRcdFx0by5wcm9taXNlID0gbmV3IHRoaXMuY29uc3RydWN0b3IoZnVuY3Rpb24gZXh0cmFjdENoYWluKHJlc29sdmUscmVqZWN0KSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgcmVzb2x2ZSAhPSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHJlamVjdCAhPSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0XHR0aHJvdyBUeXBlRXJyb3IoXCJOb3QgYSBmdW5jdGlvblwiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG8ucmVzb2x2ZSA9IHJlc29sdmU7XG5cdFx0XHRcdG8ucmVqZWN0ID0gcmVqZWN0O1xuXHRcdFx0fSk7XG5cdFx0XHRkZWYuY2hhaW4ucHVzaChvKTtcblxuXHRcdFx0aWYgKGRlZi5zdGF0ZSAhPT0gMCkge1xuXHRcdFx0XHRzY2hlZHVsZShub3RpZnksZGVmKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG8ucHJvbWlzZTtcblx0XHR9O1xuXHRcdHRoaXNbXCJjYXRjaFwiXSA9IGZ1bmN0aW9uICRjYXRjaCQoZmFpbHVyZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMudGhlbih2b2lkIDAsZmFpbHVyZSk7XG5cdFx0fTtcblxuXHRcdHRyeSB7XG5cdFx0XHRleGVjdXRvci5jYWxsKFxuXHRcdFx0XHR2b2lkIDAsXG5cdFx0XHRcdGZ1bmN0aW9uIHB1YmxpY1Jlc29sdmUobXNnKXtcblx0XHRcdFx0XHRyZXNvbHZlLmNhbGwoZGVmLG1zZyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZ1bmN0aW9uIHB1YmxpY1JlamVjdChtc2cpIHtcblx0XHRcdFx0XHRyZWplY3QuY2FsbChkZWYsbXNnKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0Y2F0Y2ggKGVycikge1xuXHRcdFx0cmVqZWN0LmNhbGwoZGVmLGVycik7XG5cdFx0fVxuXHR9XG5cblx0dmFyIFByb21pc2VQcm90b3R5cGUgPSBidWlsdEluUHJvcCh7fSxcImNvbnN0cnVjdG9yXCIsUHJvbWlzZSxcblx0XHQvKmNvbmZpZ3VyYWJsZT0qL2ZhbHNlXG5cdCk7XG5cblx0Ly8gTm90ZTogQW5kcm9pZCA0IGNhbm5vdCB1c2UgYE9iamVjdC5kZWZpbmVQcm9wZXJ0eSguLilgIGhlcmVcblx0UHJvbWlzZS5wcm90b3R5cGUgPSBQcm9taXNlUHJvdG90eXBlO1xuXG5cdC8vIGJ1aWx0LWluIFwiYnJhbmRcIiB0byBzaWduYWwgYW4gXCJ1bmluaXRpYWxpemVkXCIgcHJvbWlzZVxuXHRidWlsdEluUHJvcChQcm9taXNlUHJvdG90eXBlLFwiX19OUE9fX1wiLDAsXG5cdFx0Lypjb25maWd1cmFibGU9Ki9mYWxzZVxuXHQpO1xuXG5cdGJ1aWx0SW5Qcm9wKFByb21pc2UsXCJyZXNvbHZlXCIsZnVuY3Rpb24gUHJvbWlzZSRyZXNvbHZlKG1zZykge1xuXHRcdHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cblx0XHQvLyBzcGVjIG1hbmRhdGVkIGNoZWNrc1xuXHRcdC8vIG5vdGU6IGJlc3QgXCJpc1Byb21pc2VcIiBjaGVjayB0aGF0J3MgcHJhY3RpY2FsIGZvciBub3dcblx0XHRpZiAobXNnICYmIHR5cGVvZiBtc2cgPT0gXCJvYmplY3RcIiAmJiBtc2cuX19OUE9fXyA9PT0gMSkge1xuXHRcdFx0cmV0dXJuIG1zZztcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIGV4ZWN1dG9yKHJlc29sdmUscmVqZWN0KXtcblx0XHRcdGlmICh0eXBlb2YgcmVzb2x2ZSAhPSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHJlamVjdCAhPSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0dGhyb3cgVHlwZUVycm9yKFwiTm90IGEgZnVuY3Rpb25cIik7XG5cdFx0XHR9XG5cblx0XHRcdHJlc29sdmUobXNnKTtcblx0XHR9KTtcblx0fSk7XG5cblx0YnVpbHRJblByb3AoUHJvbWlzZSxcInJlamVjdFwiLGZ1bmN0aW9uIFByb21pc2UkcmVqZWN0KG1zZykge1xuXHRcdHJldHVybiBuZXcgdGhpcyhmdW5jdGlvbiBleGVjdXRvcihyZXNvbHZlLHJlamVjdCl7XG5cdFx0XHRpZiAodHlwZW9mIHJlc29sdmUgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiByZWplY3QgIT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHRocm93IFR5cGVFcnJvcihcIk5vdCBhIGZ1bmN0aW9uXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZWplY3QobXNnKTtcblx0XHR9KTtcblx0fSk7XG5cblx0YnVpbHRJblByb3AoUHJvbWlzZSxcImFsbFwiLGZ1bmN0aW9uIFByb21pc2UkYWxsKGFycikge1xuXHRcdHZhciBDb25zdHJ1Y3RvciA9IHRoaXM7XG5cblx0XHQvLyBzcGVjIG1hbmRhdGVkIGNoZWNrc1xuXHRcdGlmIChUb1N0cmluZy5jYWxsKGFycikgIT0gXCJbb2JqZWN0IEFycmF5XVwiKSB7XG5cdFx0XHRyZXR1cm4gQ29uc3RydWN0b3IucmVqZWN0KFR5cGVFcnJvcihcIk5vdCBhbiBhcnJheVwiKSk7XG5cdFx0fVxuXHRcdGlmIChhcnIubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gQ29uc3RydWN0b3IucmVzb2x2ZShbXSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihmdW5jdGlvbiBleGVjdXRvcihyZXNvbHZlLHJlamVjdCl7XG5cdFx0XHRpZiAodHlwZW9mIHJlc29sdmUgIT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiByZWplY3QgIT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0XHRcdHRocm93IFR5cGVFcnJvcihcIk5vdCBhIGZ1bmN0aW9uXCIpO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbGVuID0gYXJyLmxlbmd0aCwgbXNncyA9IEFycmF5KGxlbiksIGNvdW50ID0gMDtcblxuXHRcdFx0aXRlcmF0ZVByb21pc2VzKENvbnN0cnVjdG9yLGFycixmdW5jdGlvbiByZXNvbHZlcihpZHgsbXNnKSB7XG5cdFx0XHRcdG1zZ3NbaWR4XSA9IG1zZztcblx0XHRcdFx0aWYgKCsrY291bnQgPT09IGxlbikge1xuXHRcdFx0XHRcdHJlc29sdmUobXNncyk7XG5cdFx0XHRcdH1cblx0XHRcdH0scmVqZWN0KTtcblx0XHR9KTtcblx0fSk7XG5cblx0YnVpbHRJblByb3AoUHJvbWlzZSxcInJhY2VcIixmdW5jdGlvbiBQcm9taXNlJHJhY2UoYXJyKSB7XG5cdFx0dmFyIENvbnN0cnVjdG9yID0gdGhpcztcblxuXHRcdC8vIHNwZWMgbWFuZGF0ZWQgY2hlY2tzXG5cdFx0aWYgKFRvU3RyaW5nLmNhbGwoYXJyKSAhPSBcIltvYmplY3QgQXJyYXldXCIpIHtcblx0XHRcdHJldHVybiBDb25zdHJ1Y3Rvci5yZWplY3QoVHlwZUVycm9yKFwiTm90IGFuIGFycmF5XCIpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3IENvbnN0cnVjdG9yKGZ1bmN0aW9uIGV4ZWN1dG9yKHJlc29sdmUscmVqZWN0KXtcblx0XHRcdGlmICh0eXBlb2YgcmVzb2x2ZSAhPSBcImZ1bmN0aW9uXCIgfHwgdHlwZW9mIHJlamVjdCAhPSBcImZ1bmN0aW9uXCIpIHtcblx0XHRcdFx0dGhyb3cgVHlwZUVycm9yKFwiTm90IGEgZnVuY3Rpb25cIik7XG5cdFx0XHR9XG5cblx0XHRcdGl0ZXJhdGVQcm9taXNlcyhDb25zdHJ1Y3RvcixhcnIsZnVuY3Rpb24gcmVzb2x2ZXIoaWR4LG1zZyl7XG5cdFx0XHRcdHJlc29sdmUobXNnKTtcblx0XHRcdH0scmVqZWN0KTtcblx0XHR9KTtcblx0fSk7XG5cblx0cmV0dXJuIFByb21pc2U7XG59KTtcbiIsInZhciBoYXNNYXAgPSB0eXBlb2YgTWFwID09PSAnZnVuY3Rpb24nICYmIE1hcC5wcm90b3R5cGU7XG52YXIgbWFwU2l6ZURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmIGhhc01hcCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTWFwLnByb3RvdHlwZSwgJ3NpemUnKSA6IG51bGw7XG52YXIgbWFwU2l6ZSA9IGhhc01hcCAmJiBtYXBTaXplRGVzY3JpcHRvciAmJiB0eXBlb2YgbWFwU2l6ZURlc2NyaXB0b3IuZ2V0ID09PSAnZnVuY3Rpb24nID8gbWFwU2l6ZURlc2NyaXB0b3IuZ2V0IDogbnVsbDtcbnZhciBtYXBGb3JFYWNoID0gaGFzTWFwICYmIE1hcC5wcm90b3R5cGUuZm9yRWFjaDtcbnZhciBoYXNTZXQgPSB0eXBlb2YgU2V0ID09PSAnZnVuY3Rpb24nICYmIFNldC5wcm90b3R5cGU7XG52YXIgc2V0U2l6ZURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmIGhhc1NldCA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoU2V0LnByb3RvdHlwZSwgJ3NpemUnKSA6IG51bGw7XG52YXIgc2V0U2l6ZSA9IGhhc1NldCAmJiBzZXRTaXplRGVzY3JpcHRvciAmJiB0eXBlb2Ygc2V0U2l6ZURlc2NyaXB0b3IuZ2V0ID09PSAnZnVuY3Rpb24nID8gc2V0U2l6ZURlc2NyaXB0b3IuZ2V0IDogbnVsbDtcbnZhciBzZXRGb3JFYWNoID0gaGFzU2V0ICYmIFNldC5wcm90b3R5cGUuZm9yRWFjaDtcbnZhciBoYXNXZWFrTWFwID0gdHlwZW9mIFdlYWtNYXAgPT09ICdmdW5jdGlvbicgJiYgV2Vha01hcC5wcm90b3R5cGU7XG52YXIgd2Vha01hcEhhcyA9IGhhc1dlYWtNYXAgPyBXZWFrTWFwLnByb3RvdHlwZS5oYXMgOiBudWxsO1xudmFyIGhhc1dlYWtTZXQgPSB0eXBlb2YgV2Vha1NldCA9PT0gJ2Z1bmN0aW9uJyAmJiBXZWFrU2V0LnByb3RvdHlwZTtcbnZhciB3ZWFrU2V0SGFzID0gaGFzV2Vha1NldCA/IFdlYWtTZXQucHJvdG90eXBlLmhhcyA6IG51bGw7XG52YXIgaGFzV2Vha1JlZiA9IHR5cGVvZiBXZWFrUmVmID09PSAnZnVuY3Rpb24nICYmIFdlYWtSZWYucHJvdG90eXBlO1xudmFyIHdlYWtSZWZEZXJlZiA9IGhhc1dlYWtSZWYgPyBXZWFrUmVmLnByb3RvdHlwZS5kZXJlZiA6IG51bGw7XG52YXIgYm9vbGVhblZhbHVlT2YgPSBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mO1xudmFyIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBmdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xudmFyICRtYXRjaCA9IFN0cmluZy5wcm90b3R5cGUubWF0Y2g7XG52YXIgJHNsaWNlID0gU3RyaW5nLnByb3RvdHlwZS5zbGljZTtcbnZhciAkcmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcbnZhciAkdG9VcHBlckNhc2UgPSBTdHJpbmcucHJvdG90eXBlLnRvVXBwZXJDYXNlO1xudmFyICR0b0xvd2VyQ2FzZSA9IFN0cmluZy5wcm90b3R5cGUudG9Mb3dlckNhc2U7XG52YXIgJHRlc3QgPSBSZWdFeHAucHJvdG90eXBlLnRlc3Q7XG52YXIgJGNvbmNhdCA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQ7XG52YXIgJGpvaW4gPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbnZhciAkYXJyU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgJGZsb29yID0gTWF0aC5mbG9vcjtcbnZhciBiaWdJbnRWYWx1ZU9mID0gdHlwZW9mIEJpZ0ludCA9PT0gJ2Z1bmN0aW9uJyA/IEJpZ0ludC5wcm90b3R5cGUudmFsdWVPZiA6IG51bGw7XG52YXIgZ09QUyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgc3ltVG9TdHJpbmcgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09ICdzeW1ib2wnID8gU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyA6IG51bGw7XG52YXIgaGFzU2hhbW1lZFN5bWJvbHMgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09ICdvYmplY3QnO1xuLy8gaWUsIGBoYXMtdG9zdHJpbmd0YWcvc2hhbXNcbnZhciB0b1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLnRvU3RyaW5nVGFnICYmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSBoYXNTaGFtbWVkU3ltYm9scyA/ICdvYmplY3QnIDogJ3N5bWJvbCcpXG4gICAgPyBTeW1ib2wudG9TdHJpbmdUYWdcbiAgICA6IG51bGw7XG52YXIgaXNFbnVtZXJhYmxlID0gT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxudmFyIGdQTyA9ICh0eXBlb2YgUmVmbGVjdCA9PT0gJ2Z1bmN0aW9uJyA/IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YgOiBPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHx8IChcbiAgICBbXS5fX3Byb3RvX18gPT09IEFycmF5LnByb3RvdHlwZSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXByb3RvXG4gICAgICAgID8gZnVuY3Rpb24gKE8pIHtcbiAgICAgICAgICAgIHJldHVybiBPLl9fcHJvdG9fXzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wcm90b1xuICAgICAgICB9XG4gICAgICAgIDogbnVsbFxuKTtcblxuZnVuY3Rpb24gYWRkTnVtZXJpY1NlcGFyYXRvcihudW0sIHN0cikge1xuICAgIGlmIChcbiAgICAgICAgbnVtID09PSBJbmZpbml0eVxuICAgICAgICB8fCBudW0gPT09IC1JbmZpbml0eVxuICAgICAgICB8fCBudW0gIT09IG51bVxuICAgICAgICB8fCAobnVtICYmIG51bSA+IC0xMDAwICYmIG51bSA8IDEwMDApXG4gICAgICAgIHx8ICR0ZXN0LmNhbGwoL2UvLCBzdHIpXG4gICAgKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIHZhciBzZXBSZWdleCA9IC9bMC05XSg/PSg/OlswLTldezN9KSsoPyFbMC05XSkpL2c7XG4gICAgaWYgKHR5cGVvZiBudW0gPT09ICdudW1iZXInKSB7XG4gICAgICAgIHZhciBpbnQgPSBudW0gPCAwID8gLSRmbG9vcigtbnVtKSA6ICRmbG9vcihudW0pOyAvLyB0cnVuYyhudW0pXG4gICAgICAgIGlmIChpbnQgIT09IG51bSkge1xuICAgICAgICAgICAgdmFyIGludFN0ciA9IFN0cmluZyhpbnQpO1xuICAgICAgICAgICAgdmFyIGRlYyA9ICRzbGljZS5jYWxsKHN0ciwgaW50U3RyLmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoaW50U3RyLCBzZXBSZWdleCwgJyQmXycpICsgJy4nICsgJHJlcGxhY2UuY2FsbCgkcmVwbGFjZS5jYWxsKGRlYywgLyhbMC05XXszfSkvZywgJyQmXycpLCAvXyQvLCAnJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoc3RyLCBzZXBSZWdleCwgJyQmXycpO1xufVxuXG52YXIgdXRpbEluc3BlY3QgPSByZXF1aXJlKCcuL3V0aWwuaW5zcGVjdCcpO1xudmFyIGluc3BlY3RDdXN0b20gPSB1dGlsSW5zcGVjdC5jdXN0b207XG52YXIgaW5zcGVjdFN5bWJvbCA9IGlzU3ltYm9sKGluc3BlY3RDdXN0b20pID8gaW5zcGVjdEN1c3RvbSA6IG51bGw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5zcGVjdF8ob2JqLCBvcHRpb25zLCBkZXB0aCwgc2Vlbikge1xuICAgIHZhciBvcHRzID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGlmIChoYXMob3B0cywgJ3F1b3RlU3R5bGUnKSAmJiAob3B0cy5xdW90ZVN0eWxlICE9PSAnc2luZ2xlJyAmJiBvcHRzLnF1b3RlU3R5bGUgIT09ICdkb3VibGUnKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJxdW90ZVN0eWxlXCIgbXVzdCBiZSBcInNpbmdsZVwiIG9yIFwiZG91YmxlXCInKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgICBoYXMob3B0cywgJ21heFN0cmluZ0xlbmd0aCcpICYmICh0eXBlb2Ygb3B0cy5tYXhTdHJpbmdMZW5ndGggPT09ICdudW1iZXInXG4gICAgICAgICAgICA/IG9wdHMubWF4U3RyaW5nTGVuZ3RoIDwgMCAmJiBvcHRzLm1heFN0cmluZ0xlbmd0aCAhPT0gSW5maW5pdHlcbiAgICAgICAgICAgIDogb3B0cy5tYXhTdHJpbmdMZW5ndGggIT09IG51bGxcbiAgICAgICAgKVxuICAgICkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJtYXhTdHJpbmdMZW5ndGhcIiwgaWYgcHJvdmlkZWQsIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLCBJbmZpbml0eSwgb3IgYG51bGxgJyk7XG4gICAgfVxuICAgIHZhciBjdXN0b21JbnNwZWN0ID0gaGFzKG9wdHMsICdjdXN0b21JbnNwZWN0JykgPyBvcHRzLmN1c3RvbUluc3BlY3QgOiB0cnVlO1xuICAgIGlmICh0eXBlb2YgY3VzdG9tSW5zcGVjdCAhPT0gJ2Jvb2xlYW4nICYmIGN1c3RvbUluc3BlY3QgIT09ICdzeW1ib2wnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBcImN1c3RvbUluc3BlY3RcIiwgaWYgcHJvdmlkZWQsIG11c3QgYmUgYHRydWVgLCBgZmFsc2VgLCBvciBgXFwnc3ltYm9sXFwnYCcpO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgICAgaGFzKG9wdHMsICdpbmRlbnQnKVxuICAgICAgICAmJiBvcHRzLmluZGVudCAhPT0gbnVsbFxuICAgICAgICAmJiBvcHRzLmluZGVudCAhPT0gJ1xcdCdcbiAgICAgICAgJiYgIShwYXJzZUludChvcHRzLmluZGVudCwgMTApID09PSBvcHRzLmluZGVudCAmJiBvcHRzLmluZGVudCA+IDApXG4gICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBcImluZGVudFwiIG11c3QgYmUgXCJcXFxcdFwiLCBhbiBpbnRlZ2VyID4gMCwgb3IgYG51bGxgJyk7XG4gICAgfVxuICAgIGlmIChoYXMob3B0cywgJ251bWVyaWNTZXBhcmF0b3InKSAmJiB0eXBlb2Ygb3B0cy5udW1lcmljU2VwYXJhdG9yICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignb3B0aW9uIFwibnVtZXJpY1NlcGFyYXRvclwiLCBpZiBwcm92aWRlZCwgbXVzdCBiZSBgdHJ1ZWAgb3IgYGZhbHNlYCcpO1xuICAgIH1cbiAgICB2YXIgbnVtZXJpY1NlcGFyYXRvciA9IG9wdHMubnVtZXJpY1NlcGFyYXRvcjtcblxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gICAgfVxuICAgIGlmIChvYmogPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuICdudWxsJztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gb2JqID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGluc3BlY3RTdHJpbmcob2JqLCBvcHRzKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdudW1iZXInKSB7XG4gICAgICAgIGlmIChvYmogPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBJbmZpbml0eSAvIG9iaiA+IDAgPyAnMCcgOiAnLTAnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdHIgPSBTdHJpbmcob2JqKTtcbiAgICAgICAgcmV0dXJuIG51bWVyaWNTZXBhcmF0b3IgPyBhZGROdW1lcmljU2VwYXJhdG9yKG9iaiwgc3RyKSA6IHN0cjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdiaWdpbnQnKSB7XG4gICAgICAgIHZhciBiaWdJbnRTdHIgPSBTdHJpbmcob2JqKSArICduJztcbiAgICAgICAgcmV0dXJuIG51bWVyaWNTZXBhcmF0b3IgPyBhZGROdW1lcmljU2VwYXJhdG9yKG9iaiwgYmlnSW50U3RyKSA6IGJpZ0ludFN0cjtcbiAgICB9XG5cbiAgICB2YXIgbWF4RGVwdGggPSB0eXBlb2Ygb3B0cy5kZXB0aCA9PT0gJ3VuZGVmaW5lZCcgPyA1IDogb3B0cy5kZXB0aDtcbiAgICBpZiAodHlwZW9mIGRlcHRoID09PSAndW5kZWZpbmVkJykgeyBkZXB0aCA9IDA7IH1cbiAgICBpZiAoZGVwdGggPj0gbWF4RGVwdGggJiYgbWF4RGVwdGggPiAwICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBpc0FycmF5KG9iaikgPyAnW0FycmF5XScgOiAnW09iamVjdF0nO1xuICAgIH1cblxuICAgIHZhciBpbmRlbnQgPSBnZXRJbmRlbnQob3B0cywgZGVwdGgpO1xuXG4gICAgaWYgKHR5cGVvZiBzZWVuID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZWVuID0gW107XG4gICAgfSBlbHNlIGlmIChpbmRleE9mKHNlZW4sIG9iaikgPj0gMCkge1xuICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3BlY3QodmFsdWUsIGZyb20sIG5vSW5kZW50KSB7XG4gICAgICAgIGlmIChmcm9tKSB7XG4gICAgICAgICAgICBzZWVuID0gJGFyclNsaWNlLmNhbGwoc2Vlbik7XG4gICAgICAgICAgICBzZWVuLnB1c2goZnJvbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vSW5kZW50KSB7XG4gICAgICAgICAgICB2YXIgbmV3T3B0cyA9IHtcbiAgICAgICAgICAgICAgICBkZXB0aDogb3B0cy5kZXB0aFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChoYXMob3B0cywgJ3F1b3RlU3R5bGUnKSkge1xuICAgICAgICAgICAgICAgIG5ld09wdHMucXVvdGVTdHlsZSA9IG9wdHMucXVvdGVTdHlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnNwZWN0Xyh2YWx1ZSwgbmV3T3B0cywgZGVwdGggKyAxLCBzZWVuKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zcGVjdF8odmFsdWUsIG9wdHMsIGRlcHRoICsgMSwgc2Vlbik7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicgJiYgIWlzUmVnRXhwKG9iaikpIHsgLy8gaW4gb2xkZXIgZW5naW5lcywgcmVnZXhlcyBhcmUgY2FsbGFibGVcbiAgICAgICAgdmFyIG5hbWUgPSBuYW1lT2Yob2JqKTtcbiAgICAgICAgdmFyIGtleXMgPSBhcnJPYmpLZXlzKG9iaiwgaW5zcGVjdCk7XG4gICAgICAgIHJldHVybiAnW0Z1bmN0aW9uJyArIChuYW1lID8gJzogJyArIG5hbWUgOiAnIChhbm9ueW1vdXMpJykgKyAnXScgKyAoa2V5cy5sZW5ndGggPiAwID8gJyB7ICcgKyAkam9pbi5jYWxsKGtleXMsICcsICcpICsgJyB9JyA6ICcnKTtcbiAgICB9XG4gICAgaWYgKGlzU3ltYm9sKG9iaikpIHtcbiAgICAgICAgdmFyIHN5bVN0cmluZyA9IGhhc1NoYW1tZWRTeW1ib2xzID8gJHJlcGxhY2UuY2FsbChTdHJpbmcob2JqKSwgL14oU3ltYm9sXFwoLipcXCkpX1teKV0qJC8sICckMScpIDogc3ltVG9TdHJpbmcuY2FsbChvYmopO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgIWhhc1NoYW1tZWRTeW1ib2xzID8gbWFya0JveGVkKHN5bVN0cmluZykgOiBzeW1TdHJpbmc7XG4gICAgfVxuICAgIGlmIChpc0VsZW1lbnQob2JqKSkge1xuICAgICAgICB2YXIgcyA9ICc8JyArICR0b0xvd2VyQ2FzZS5jYWxsKFN0cmluZyhvYmoubm9kZU5hbWUpKTtcbiAgICAgICAgdmFyIGF0dHJzID0gb2JqLmF0dHJpYnV0ZXMgfHwgW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHMgKz0gJyAnICsgYXR0cnNbaV0ubmFtZSArICc9JyArIHdyYXBRdW90ZXMocXVvdGUoYXR0cnNbaV0udmFsdWUpLCAnZG91YmxlJywgb3B0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcyArPSAnPic7XG4gICAgICAgIGlmIChvYmouY2hpbGROb2RlcyAmJiBvYmouY2hpbGROb2Rlcy5sZW5ndGgpIHsgcyArPSAnLi4uJzsgfVxuICAgICAgICBzICs9ICc8LycgKyAkdG9Mb3dlckNhc2UuY2FsbChTdHJpbmcob2JqLm5vZGVOYW1lKSkgKyAnPic7XG4gICAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgIGlmIChvYmoubGVuZ3RoID09PSAwKSB7IHJldHVybiAnW10nOyB9XG4gICAgICAgIHZhciB4cyA9IGFyck9iaktleXMob2JqLCBpbnNwZWN0KTtcbiAgICAgICAgaWYgKGluZGVudCAmJiAhc2luZ2xlTGluZVZhbHVlcyh4cykpIHtcbiAgICAgICAgICAgIHJldHVybiAnWycgKyBpbmRlbnRlZEpvaW4oeHMsIGluZGVudCkgKyAnXSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdbICcgKyAkam9pbi5jYWxsKHhzLCAnLCAnKSArICcgXSc7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKG9iaikpIHtcbiAgICAgICAgdmFyIHBhcnRzID0gYXJyT2JqS2V5cyhvYmosIGluc3BlY3QpO1xuICAgICAgICBpZiAoISgnY2F1c2UnIGluIEVycm9yLnByb3RvdHlwZSkgJiYgJ2NhdXNlJyBpbiBvYmogJiYgIWlzRW51bWVyYWJsZS5jYWxsKG9iaiwgJ2NhdXNlJykpIHtcbiAgICAgICAgICAgIHJldHVybiAneyBbJyArIFN0cmluZyhvYmopICsgJ10gJyArICRqb2luLmNhbGwoJGNvbmNhdC5jYWxsKCdbY2F1c2VdOiAnICsgaW5zcGVjdChvYmouY2F1c2UpLCBwYXJ0cyksICcsICcpICsgJyB9JztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFydHMubGVuZ3RoID09PSAwKSB7IHJldHVybiAnWycgKyBTdHJpbmcob2JqKSArICddJzsgfVxuICAgICAgICByZXR1cm4gJ3sgWycgKyBTdHJpbmcob2JqKSArICddICcgKyAkam9pbi5jYWxsKHBhcnRzLCAnLCAnKSArICcgfSc7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBjdXN0b21JbnNwZWN0KSB7XG4gICAgICAgIGlmIChpbnNwZWN0U3ltYm9sICYmIHR5cGVvZiBvYmpbaW5zcGVjdFN5bWJvbF0gPT09ICdmdW5jdGlvbicgJiYgdXRpbEluc3BlY3QpIHtcbiAgICAgICAgICAgIHJldHVybiB1dGlsSW5zcGVjdChvYmosIHsgZGVwdGg6IG1heERlcHRoIC0gZGVwdGggfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY3VzdG9tSW5zcGVjdCAhPT0gJ3N5bWJvbCcgJiYgdHlwZW9mIG9iai5pbnNwZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqLmluc3BlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNNYXAob2JqKSkge1xuICAgICAgICB2YXIgbWFwUGFydHMgPSBbXTtcbiAgICAgICAgaWYgKG1hcEZvckVhY2gpIHtcbiAgICAgICAgICAgIG1hcEZvckVhY2guY2FsbChvYmosIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgbWFwUGFydHMucHVzaChpbnNwZWN0KGtleSwgb2JqLCB0cnVlKSArICcgPT4gJyArIGluc3BlY3QodmFsdWUsIG9iaikpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25PZignTWFwJywgbWFwU2l6ZS5jYWxsKG9iaiksIG1hcFBhcnRzLCBpbmRlbnQpO1xuICAgIH1cbiAgICBpZiAoaXNTZXQob2JqKSkge1xuICAgICAgICB2YXIgc2V0UGFydHMgPSBbXTtcbiAgICAgICAgaWYgKHNldEZvckVhY2gpIHtcbiAgICAgICAgICAgIHNldEZvckVhY2guY2FsbChvYmosIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHNldFBhcnRzLnB1c2goaW5zcGVjdCh2YWx1ZSwgb2JqKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbk9mKCdTZXQnLCBzZXRTaXplLmNhbGwob2JqKSwgc2V0UGFydHMsIGluZGVudCk7XG4gICAgfVxuICAgIGlmIChpc1dlYWtNYXAob2JqKSkge1xuICAgICAgICByZXR1cm4gd2Vha0NvbGxlY3Rpb25PZignV2Vha01hcCcpO1xuICAgIH1cbiAgICBpZiAoaXNXZWFrU2V0KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHdlYWtDb2xsZWN0aW9uT2YoJ1dlYWtTZXQnKTtcbiAgICB9XG4gICAgaWYgKGlzV2Vha1JlZihvYmopKSB7XG4gICAgICAgIHJldHVybiB3ZWFrQ29sbGVjdGlvbk9mKCdXZWFrUmVmJyk7XG4gICAgfVxuICAgIGlmIChpc051bWJlcihvYmopKSB7XG4gICAgICAgIHJldHVybiBtYXJrQm94ZWQoaW5zcGVjdChOdW1iZXIob2JqKSkpO1xuICAgIH1cbiAgICBpZiAoaXNCaWdJbnQob2JqKSkge1xuICAgICAgICByZXR1cm4gbWFya0JveGVkKGluc3BlY3QoYmlnSW50VmFsdWVPZi5jYWxsKG9iaikpKTtcbiAgICB9XG4gICAgaWYgKGlzQm9vbGVhbihvYmopKSB7XG4gICAgICAgIHJldHVybiBtYXJrQm94ZWQoYm9vbGVhblZhbHVlT2YuY2FsbChvYmopKTtcbiAgICB9XG4gICAgaWYgKGlzU3RyaW5nKG9iaikpIHtcbiAgICAgICAgcmV0dXJuIG1hcmtCb3hlZChpbnNwZWN0KFN0cmluZyhvYmopKSk7XG4gICAgfVxuICAgIC8vIG5vdGU6IGluIElFIDgsIHNvbWV0aW1lcyBgZ2xvYmFsICE9PSB3aW5kb3dgIGJ1dCBib3RoIGFyZSB0aGUgcHJvdG90eXBlcyBvZiBlYWNoIG90aGVyXG4gICAgLyogZXNsaW50LWVudiBicm93c2VyICovXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIG9iaiA9PT0gd2luZG93KSB7XG4gICAgICAgIHJldHVybiAneyBbb2JqZWN0IFdpbmRvd10gfSc7XG4gICAgfVxuICAgIGlmIChcbiAgICAgICAgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyAmJiBvYmogPT09IGdsb2JhbFRoaXMpXG4gICAgICAgIHx8ICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyAmJiBvYmogPT09IGdsb2JhbClcbiAgICApIHtcbiAgICAgICAgcmV0dXJuICd7IFtvYmplY3QgZ2xvYmFsVGhpc10gfSc7XG4gICAgfVxuICAgIGlmICghaXNEYXRlKG9iaikgJiYgIWlzUmVnRXhwKG9iaikpIHtcbiAgICAgICAgdmFyIHlzID0gYXJyT2JqS2V5cyhvYmosIGluc3BlY3QpO1xuICAgICAgICB2YXIgaXNQbGFpbk9iamVjdCA9IGdQTyA/IGdQTyhvYmopID09PSBPYmplY3QucHJvdG90eXBlIDogb2JqIGluc3RhbmNlb2YgT2JqZWN0IHx8IG9iai5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xuICAgICAgICB2YXIgcHJvdG9UYWcgPSBvYmogaW5zdGFuY2VvZiBPYmplY3QgPyAnJyA6ICdudWxsIHByb3RvdHlwZSc7XG4gICAgICAgIHZhciBzdHJpbmdUYWcgPSAhaXNQbGFpbk9iamVjdCAmJiB0b1N0cmluZ1RhZyAmJiBPYmplY3Qob2JqKSA9PT0gb2JqICYmIHRvU3RyaW5nVGFnIGluIG9iaiA/ICRzbGljZS5jYWxsKHRvU3RyKG9iaiksIDgsIC0xKSA6IHByb3RvVGFnID8gJ09iamVjdCcgOiAnJztcbiAgICAgICAgdmFyIGNvbnN0cnVjdG9yVGFnID0gaXNQbGFpbk9iamVjdCB8fCB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yICE9PSAnZnVuY3Rpb24nID8gJycgOiBvYmouY29uc3RydWN0b3IubmFtZSA/IG9iai5jb25zdHJ1Y3Rvci5uYW1lICsgJyAnIDogJyc7XG4gICAgICAgIHZhciB0YWcgPSBjb25zdHJ1Y3RvclRhZyArIChzdHJpbmdUYWcgfHwgcHJvdG9UYWcgPyAnWycgKyAkam9pbi5jYWxsKCRjb25jYXQuY2FsbChbXSwgc3RyaW5nVGFnIHx8IFtdLCBwcm90b1RhZyB8fCBbXSksICc6ICcpICsgJ10gJyA6ICcnKTtcbiAgICAgICAgaWYgKHlzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdGFnICsgJ3t9JzsgfVxuICAgICAgICBpZiAoaW5kZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGFnICsgJ3snICsgaW5kZW50ZWRKb2luKHlzLCBpbmRlbnQpICsgJ30nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWcgKyAneyAnICsgJGpvaW4uY2FsbCh5cywgJywgJykgKyAnIH0nO1xuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nKG9iaik7XG59O1xuXG5mdW5jdGlvbiB3cmFwUXVvdGVzKHMsIGRlZmF1bHRTdHlsZSwgb3B0cykge1xuICAgIHZhciBxdW90ZUNoYXIgPSAob3B0cy5xdW90ZVN0eWxlIHx8IGRlZmF1bHRTdHlsZSkgPT09ICdkb3VibGUnID8gJ1wiJyA6IFwiJ1wiO1xuICAgIHJldHVybiBxdW90ZUNoYXIgKyBzICsgcXVvdGVDaGFyO1xufVxuXG5mdW5jdGlvbiBxdW90ZShzKSB7XG4gICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoU3RyaW5nKHMpLCAvXCIvZywgJyZxdW90OycpO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5KG9iaikgeyByZXR1cm4gdG9TdHIob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJyAmJiAoIXRvU3RyaW5nVGFnIHx8ICEodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdG9TdHJpbmdUYWcgaW4gb2JqKSk7IH1cbmZ1bmN0aW9uIGlzRGF0ZShvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJyAmJiAoIXRvU3RyaW5nVGFnIHx8ICEodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdG9TdHJpbmdUYWcgaW4gb2JqKSk7IH1cbmZ1bmN0aW9uIGlzUmVnRXhwKG9iaikgeyByZXR1cm4gdG9TdHIob2JqKSA9PT0gJ1tvYmplY3QgUmVnRXhwXScgJiYgKCF0b1N0cmluZ1RhZyB8fCAhKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHRvU3RyaW5nVGFnIGluIG9iaikpOyB9XG5mdW5jdGlvbiBpc0Vycm9yKG9iaikgeyByZXR1cm4gdG9TdHIob2JqKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyAmJiAoIXRvU3RyaW5nVGFnIHx8ICEodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdG9TdHJpbmdUYWcgaW4gb2JqKSk7IH1cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikgeyByZXR1cm4gdG9TdHIob2JqKSA9PT0gJ1tvYmplY3QgU3RyaW5nXScgJiYgKCF0b1N0cmluZ1RhZyB8fCAhKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIHRvU3RyaW5nVGFnIGluIG9iaikpOyB9XG5mdW5jdGlvbiBpc051bWJlcihvYmopIHsgcmV0dXJuIHRvU3RyKG9iaikgPT09ICdbb2JqZWN0IE51bWJlcl0nICYmICghdG9TdHJpbmdUYWcgfHwgISh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiB0b1N0cmluZ1RhZyBpbiBvYmopKTsgfVxuZnVuY3Rpb24gaXNCb29sZWFuKG9iaikgeyByZXR1cm4gdG9TdHIob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nICYmICghdG9TdHJpbmdUYWcgfHwgISh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiB0b1N0cmluZ1RhZyBpbiBvYmopKTsgfVxuXG4vLyBTeW1ib2wgYW5kIEJpZ0ludCBkbyBoYXZlIFN5bWJvbC50b1N0cmluZ1RhZyBieSBzcGVjLCBzbyB0aGF0IGNhbid0IGJlIHVzZWQgdG8gZWxpbWluYXRlIGZhbHNlIHBvc2l0aXZlc1xuZnVuY3Rpb24gaXNTeW1ib2wob2JqKSB7XG4gICAgaWYgKGhhc1NoYW1tZWRTeW1ib2xzKSB7XG4gICAgICAgIHJldHVybiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqIGluc3RhbmNlb2YgU3ltYm9sO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8ICFzeW1Ub1N0cmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHN5bVRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzQmlnSW50KG9iaikge1xuICAgIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8ICFiaWdJbnRWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgYmlnSW50VmFsdWVPZi5jYWxsKG9iaik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSB8fCBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBrZXkgaW4gdGhpczsgfTtcbmZ1bmN0aW9uIGhhcyhvYmosIGtleSkge1xuICAgIHJldHVybiBoYXNPd24uY2FsbChvYmosIGtleSk7XG59XG5cbmZ1bmN0aW9uIHRvU3RyKG9iaikge1xuICAgIHJldHVybiBvYmplY3RUb1N0cmluZy5jYWxsKG9iaik7XG59XG5cbmZ1bmN0aW9uIG5hbWVPZihmKSB7XG4gICAgaWYgKGYubmFtZSkgeyByZXR1cm4gZi5uYW1lOyB9XG4gICAgdmFyIG0gPSAkbWF0Y2guY2FsbChmdW5jdGlvblRvU3RyaW5nLmNhbGwoZiksIC9eZnVuY3Rpb25cXHMqKFtcXHckXSspLyk7XG4gICAgaWYgKG0pIHsgcmV0dXJuIG1bMV07IH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gaW5kZXhPZih4cywgeCkge1xuICAgIGlmICh4cy5pbmRleE9mKSB7IHJldHVybiB4cy5pbmRleE9mKHgpOyB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSB4cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKHhzW2ldID09PSB4KSB7IHJldHVybiBpOyB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cblxuZnVuY3Rpb24gaXNNYXAoeCkge1xuICAgIGlmICghbWFwU2l6ZSB8fCAheCB8fCB0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBtYXBTaXplLmNhbGwoeCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRTaXplLmNhbGwoeCk7XG4gICAgICAgIH0gY2F0Y2ggKHMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB4IGluc3RhbmNlb2YgTWFwOyAvLyBjb3JlLWpzIHdvcmthcm91bmQsIHByZS12Mi41LjBcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNXZWFrTWFwKHgpIHtcbiAgICBpZiAoIXdlYWtNYXBIYXMgfHwgIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgd2Vha01hcEhhcy5jYWxsKHgsIHdlYWtNYXBIYXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2Vha1NldEhhcy5jYWxsKHgsIHdlYWtTZXRIYXMpO1xuICAgICAgICB9IGNhdGNoIChzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCBpbnN0YW5jZW9mIFdlYWtNYXA7IC8vIGNvcmUtanMgd29ya2Fyb3VuZCwgcHJlLXYyLjUuMFxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc1dlYWtSZWYoeCkge1xuICAgIGlmICghd2Vha1JlZkRlcmVmIHx8ICF4IHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIHdlYWtSZWZEZXJlZi5jYWxsKHgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNTZXQoeCkge1xuICAgIGlmICghc2V0U2l6ZSB8fCAheCB8fCB0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBzZXRTaXplLmNhbGwoeCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBtYXBTaXplLmNhbGwoeCk7XG4gICAgICAgIH0gY2F0Y2ggKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB4IGluc3RhbmNlb2YgU2V0OyAvLyBjb3JlLWpzIHdvcmthcm91bmQsIHByZS12Mi41LjBcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaXNXZWFrU2V0KHgpIHtcbiAgICBpZiAoIXdlYWtTZXRIYXMgfHwgIXggfHwgdHlwZW9mIHggIT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgd2Vha1NldEhhcy5jYWxsKHgsIHdlYWtTZXRIYXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgd2Vha01hcEhhcy5jYWxsKHgsIHdlYWtNYXBIYXMpO1xuICAgICAgICB9IGNhdGNoIChzKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCBpbnN0YW5jZW9mIFdlYWtTZXQ7IC8vIGNvcmUtanMgd29ya2Fyb3VuZCwgcHJlLXYyLjUuMFxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpc0VsZW1lbnQoeCkge1xuICAgIGlmICgheCB8fCB0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgeCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIHgubm9kZU5hbWUgPT09ICdzdHJpbmcnICYmIHR5cGVvZiB4LmdldEF0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaW5zcGVjdFN0cmluZyhzdHIsIG9wdHMpIHtcbiAgICBpZiAoc3RyLmxlbmd0aCA+IG9wdHMubWF4U3RyaW5nTGVuZ3RoKSB7XG4gICAgICAgIHZhciByZW1haW5pbmcgPSBzdHIubGVuZ3RoIC0gb3B0cy5tYXhTdHJpbmdMZW5ndGg7XG4gICAgICAgIHZhciB0cmFpbGVyID0gJy4uLiAnICsgcmVtYWluaW5nICsgJyBtb3JlIGNoYXJhY3RlcicgKyAocmVtYWluaW5nID4gMSA/ICdzJyA6ICcnKTtcbiAgICAgICAgcmV0dXJuIGluc3BlY3RTdHJpbmcoJHNsaWNlLmNhbGwoc3RyLCAwLCBvcHRzLm1heFN0cmluZ0xlbmd0aCksIG9wdHMpICsgdHJhaWxlcjtcbiAgICB9XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnRyb2wtcmVnZXhcbiAgICB2YXIgcyA9ICRyZXBsYWNlLmNhbGwoJHJlcGxhY2UuY2FsbChzdHIsIC8oWydcXFxcXSkvZywgJ1xcXFwkMScpLCAvW1xceDAwLVxceDFmXS9nLCBsb3dieXRlKTtcbiAgICByZXR1cm4gd3JhcFF1b3RlcyhzLCAnc2luZ2xlJywgb3B0cyk7XG59XG5cbmZ1bmN0aW9uIGxvd2J5dGUoYykge1xuICAgIHZhciBuID0gYy5jaGFyQ29kZUF0KDApO1xuICAgIHZhciB4ID0ge1xuICAgICAgICA4OiAnYicsXG4gICAgICAgIDk6ICd0JyxcbiAgICAgICAgMTA6ICduJyxcbiAgICAgICAgMTI6ICdmJyxcbiAgICAgICAgMTM6ICdyJ1xuICAgIH1bbl07XG4gICAgaWYgKHgpIHsgcmV0dXJuICdcXFxcJyArIHg7IH1cbiAgICByZXR1cm4gJ1xcXFx4JyArIChuIDwgMHgxMCA/ICcwJyA6ICcnKSArICR0b1VwcGVyQ2FzZS5jYWxsKG4udG9TdHJpbmcoMTYpKTtcbn1cblxuZnVuY3Rpb24gbWFya0JveGVkKHN0cikge1xuICAgIHJldHVybiAnT2JqZWN0KCcgKyBzdHIgKyAnKSc7XG59XG5cbmZ1bmN0aW9uIHdlYWtDb2xsZWN0aW9uT2YodHlwZSkge1xuICAgIHJldHVybiB0eXBlICsgJyB7ID8gfSc7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3Rpb25PZih0eXBlLCBzaXplLCBlbnRyaWVzLCBpbmRlbnQpIHtcbiAgICB2YXIgam9pbmVkRW50cmllcyA9IGluZGVudCA/IGluZGVudGVkSm9pbihlbnRyaWVzLCBpbmRlbnQpIDogJGpvaW4uY2FsbChlbnRyaWVzLCAnLCAnKTtcbiAgICByZXR1cm4gdHlwZSArICcgKCcgKyBzaXplICsgJykgeycgKyBqb2luZWRFbnRyaWVzICsgJ30nO1xufVxuXG5mdW5jdGlvbiBzaW5nbGVMaW5lVmFsdWVzKHhzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaW5kZXhPZih4c1tpXSwgJ1xcbicpID49IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZ2V0SW5kZW50KG9wdHMsIGRlcHRoKSB7XG4gICAgdmFyIGJhc2VJbmRlbnQ7XG4gICAgaWYgKG9wdHMuaW5kZW50ID09PSAnXFx0Jykge1xuICAgICAgICBiYXNlSW5kZW50ID0gJ1xcdCc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0cy5pbmRlbnQgPT09ICdudW1iZXInICYmIG9wdHMuaW5kZW50ID4gMCkge1xuICAgICAgICBiYXNlSW5kZW50ID0gJGpvaW4uY2FsbChBcnJheShvcHRzLmluZGVudCArIDEpLCAnICcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBiYXNlOiBiYXNlSW5kZW50LFxuICAgICAgICBwcmV2OiAkam9pbi5jYWxsKEFycmF5KGRlcHRoICsgMSksIGJhc2VJbmRlbnQpXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gaW5kZW50ZWRKb2luKHhzLCBpbmRlbnQpIHtcbiAgICBpZiAoeHMubGVuZ3RoID09PSAwKSB7IHJldHVybiAnJzsgfVxuICAgIHZhciBsaW5lSm9pbmVyID0gJ1xcbicgKyBpbmRlbnQucHJldiArIGluZGVudC5iYXNlO1xuICAgIHJldHVybiBsaW5lSm9pbmVyICsgJGpvaW4uY2FsbCh4cywgJywnICsgbGluZUpvaW5lcikgKyAnXFxuJyArIGluZGVudC5wcmV2O1xufVxuXG5mdW5jdGlvbiBhcnJPYmpLZXlzKG9iaiwgaW5zcGVjdCkge1xuICAgIHZhciBpc0FyciA9IGlzQXJyYXkob2JqKTtcbiAgICB2YXIgeHMgPSBbXTtcbiAgICBpZiAoaXNBcnIpIHtcbiAgICAgICAgeHMubGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHhzW2ldID0gaGFzKG9iaiwgaSkgPyBpbnNwZWN0KG9ialtpXSwgb2JqKSA6ICcnO1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBzeW1zID0gdHlwZW9mIGdPUFMgPT09ICdmdW5jdGlvbicgPyBnT1BTKG9iaikgOiBbXTtcbiAgICB2YXIgc3ltTWFwO1xuICAgIGlmIChoYXNTaGFtbWVkU3ltYm9scykge1xuICAgICAgICBzeW1NYXAgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzeW1zLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBzeW1NYXBbJyQnICsgc3ltc1trXV0gPSBzeW1zW2tdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICAgIGlmICghaGFzKG9iaiwga2V5KSkgeyBjb250aW51ZTsgfSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4LCBuby1jb250aW51ZVxuICAgICAgICBpZiAoaXNBcnIgJiYgU3RyaW5nKE51bWJlcihrZXkpKSA9PT0ga2V5ICYmIGtleSA8IG9iai5sZW5ndGgpIHsgY29udGludWU7IH0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheCwgbm8tY29udGludWVcbiAgICAgICAgaWYgKGhhc1NoYW1tZWRTeW1ib2xzICYmIHN5bU1hcFsnJCcgKyBrZXldIGluc3RhbmNlb2YgU3ltYm9sKSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRvIHByZXZlbnQgc2hhbW1lZCBTeW1ib2xzLCB3aGljaCBhcmUgc3RvcmVkIGFzIHN0cmluZ3MsIGZyb20gYmVpbmcgaW5jbHVkZWQgaW4gdGhlIHN0cmluZyBrZXkgc2VjdGlvblxuICAgICAgICAgICAgY29udGludWU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXgsIG5vLWNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoJHRlc3QuY2FsbCgvW15cXHckXS8sIGtleSkpIHtcbiAgICAgICAgICAgIHhzLnB1c2goaW5zcGVjdChrZXksIG9iaikgKyAnOiAnICsgaW5zcGVjdChvYmpba2V5XSwgb2JqKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4cy5wdXNoKGtleSArICc6ICcgKyBpbnNwZWN0KG9ialtrZXldLCBvYmopKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGdPUFMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzeW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoaXNFbnVtZXJhYmxlLmNhbGwob2JqLCBzeW1zW2pdKSkge1xuICAgICAgICAgICAgICAgIHhzLnB1c2goJ1snICsgaW5zcGVjdChzeW1zW2pdKSArICddOiAnICsgaW5zcGVjdChvYmpbc3ltc1tqXV0sIG9iaikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB4cztcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHJlcGxhY2UgPSBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2U7XG52YXIgcGVyY2VudFR3ZW50aWVzID0gLyUyMC9nO1xuXG52YXIgRm9ybWF0ID0ge1xuICAgIFJGQzE3Mzg6ICdSRkMxNzM4JyxcbiAgICBSRkMzOTg2OiAnUkZDMzk4Nidcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgICdkZWZhdWx0JzogRm9ybWF0LlJGQzM5ODYsXG4gICAgZm9ybWF0dGVyczoge1xuICAgICAgICBSRkMxNzM4OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiByZXBsYWNlLmNhbGwodmFsdWUsIHBlcmNlbnRUd2VudGllcywgJysnKTtcbiAgICAgICAgfSxcbiAgICAgICAgUkZDMzk4NjogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgUkZDMTczODogRm9ybWF0LlJGQzE3MzgsXG4gICAgUkZDMzk4NjogRm9ybWF0LlJGQzM5ODZcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnkgPSByZXF1aXJlKCcuL3N0cmluZ2lmeScpO1xudmFyIHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpO1xudmFyIGZvcm1hdHMgPSByZXF1aXJlKCcuL2Zvcm1hdHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZm9ybWF0czogZm9ybWF0cyxcbiAgICBwYXJzZTogcGFyc2UsXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgICBhbGxvd0RvdHM6IGZhbHNlLFxuICAgIGFsbG93RW1wdHlBcnJheXM6IGZhbHNlLFxuICAgIGFsbG93UHJvdG90eXBlczogZmFsc2UsXG4gICAgYWxsb3dTcGFyc2U6IGZhbHNlLFxuICAgIGFycmF5TGltaXQ6IDIwLFxuICAgIGNoYXJzZXQ6ICd1dGYtOCcsXG4gICAgY2hhcnNldFNlbnRpbmVsOiBmYWxzZSxcbiAgICBjb21tYTogZmFsc2UsXG4gICAgZGVjb2RlRG90SW5LZXlzOiBmYWxzZSxcbiAgICBkZWNvZGVyOiB1dGlscy5kZWNvZGUsXG4gICAgZGVsaW1pdGVyOiAnJicsXG4gICAgZGVwdGg6IDUsXG4gICAgZHVwbGljYXRlczogJ2NvbWJpbmUnLFxuICAgIGlnbm9yZVF1ZXJ5UHJlZml4OiBmYWxzZSxcbiAgICBpbnRlcnByZXROdW1lcmljRW50aXRpZXM6IGZhbHNlLFxuICAgIHBhcmFtZXRlckxpbWl0OiAxMDAwLFxuICAgIHBhcnNlQXJyYXlzOiB0cnVlLFxuICAgIHBsYWluT2JqZWN0czogZmFsc2UsXG4gICAgc3RyaWN0RGVwdGg6IGZhbHNlLFxuICAgIHN0cmljdE51bGxIYW5kbGluZzogZmFsc2Vcbn07XG5cbnZhciBpbnRlcnByZXROdW1lcmljRW50aXRpZXMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8mIyhcXGQrKTsvZywgZnVuY3Rpb24gKCQwLCBudW1iZXJTdHIpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobnVtYmVyU3RyLCAxMCkpO1xuICAgIH0pO1xufTtcblxudmFyIHBhcnNlQXJyYXlWYWx1ZSA9IGZ1bmN0aW9uICh2YWwsIG9wdGlvbnMpIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMuY29tbWEgJiYgdmFsLmluZGV4T2YoJywnKSA+IC0xKSB7XG4gICAgICAgIHJldHVybiB2YWwuc3BsaXQoJywnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsO1xufTtcblxuLy8gVGhpcyBpcyB3aGF0IGJyb3dzZXJzIHdpbGwgc3VibWl0IHdoZW4gdGhlIOKckyBjaGFyYWN0ZXIgb2NjdXJzIGluIGFuXG4vLyBhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQgYm9keSBhbmQgdGhlIGVuY29kaW5nIG9mIHRoZSBwYWdlIGNvbnRhaW5pbmdcbi8vIHRoZSBmb3JtIGlzIGlzby04ODU5LTEsIG9yIHdoZW4gdGhlIHN1Ym1pdHRlZCBmb3JtIGhhcyBhbiBhY2NlcHQtY2hhcnNldFxuLy8gYXR0cmlidXRlIG9mIGlzby04ODU5LTEuIFByZXN1bWFibHkgYWxzbyB3aXRoIG90aGVyIGNoYXJzZXRzIHRoYXQgZG8gbm90IGNvbnRhaW5cbi8vIHRoZSDinJMgY2hhcmFjdGVyLCBzdWNoIGFzIHVzLWFzY2lpLlxudmFyIGlzb1NlbnRpbmVsID0gJ3V0Zjg9JTI2JTIzMTAwMDMlM0InOyAvLyBlbmNvZGVVUklDb21wb25lbnQoJyYjMTAwMDM7JylcblxuLy8gVGhlc2UgYXJlIHRoZSBwZXJjZW50LWVuY29kZWQgdXRmLTggb2N0ZXRzIHJlcHJlc2VudGluZyBhIGNoZWNrbWFyaywgaW5kaWNhdGluZyB0aGF0IHRoZSByZXF1ZXN0IGFjdHVhbGx5IGlzIHV0Zi04IGVuY29kZWQuXG52YXIgY2hhcnNldFNlbnRpbmVsID0gJ3V0Zjg9JUUyJTlDJTkzJzsgLy8gZW5jb2RlVVJJQ29tcG9uZW50KCfinJMnKVxuXG52YXIgcGFyc2VWYWx1ZXMgPSBmdW5jdGlvbiBwYXJzZVF1ZXJ5U3RyaW5nVmFsdWVzKHN0ciwgb3B0aW9ucykge1xuICAgIHZhciBvYmogPSB7IF9fcHJvdG9fXzogbnVsbCB9O1xuXG4gICAgdmFyIGNsZWFuU3RyID0gb3B0aW9ucy5pZ25vcmVRdWVyeVByZWZpeCA/IHN0ci5yZXBsYWNlKC9eXFw/LywgJycpIDogc3RyO1xuICAgIGNsZWFuU3RyID0gY2xlYW5TdHIucmVwbGFjZSgvJTVCL2dpLCAnWycpLnJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbiAgICB2YXIgbGltaXQgPSBvcHRpb25zLnBhcmFtZXRlckxpbWl0ID09PSBJbmZpbml0eSA/IHVuZGVmaW5lZCA6IG9wdGlvbnMucGFyYW1ldGVyTGltaXQ7XG4gICAgdmFyIHBhcnRzID0gY2xlYW5TdHIuc3BsaXQob3B0aW9ucy5kZWxpbWl0ZXIsIGxpbWl0KTtcbiAgICB2YXIgc2tpcEluZGV4ID0gLTE7IC8vIEtlZXAgdHJhY2sgb2Ygd2hlcmUgdGhlIHV0Zjggc2VudGluZWwgd2FzIGZvdW5kXG4gICAgdmFyIGk7XG5cbiAgICB2YXIgY2hhcnNldCA9IG9wdGlvbnMuY2hhcnNldDtcbiAgICBpZiAob3B0aW9ucy5jaGFyc2V0U2VudGluZWwpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAocGFydHNbaV0uaW5kZXhPZigndXRmOD0nKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0c1tpXSA9PT0gY2hhcnNldFNlbnRpbmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJzZXQgPSAndXRmLTgnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGFydHNbaV0gPT09IGlzb1NlbnRpbmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYXJzZXQgPSAnaXNvLTg4NTktMSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNraXBJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgaSA9IHBhcnRzLmxlbmd0aDsgLy8gVGhlIGVzbGludCBzZXR0aW5ncyBkbyBub3QgYWxsb3cgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGkgPT09IHNraXBJbmRleCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXTtcblxuICAgICAgICB2YXIgYnJhY2tldEVxdWFsc1BvcyA9IHBhcnQuaW5kZXhPZignXT0nKTtcbiAgICAgICAgdmFyIHBvcyA9IGJyYWNrZXRFcXVhbHNQb3MgPT09IC0xID8gcGFydC5pbmRleE9mKCc9JykgOiBicmFja2V0RXF1YWxzUG9zICsgMTtcblxuICAgICAgICB2YXIga2V5LCB2YWw7XG4gICAgICAgIGlmIChwb3MgPT09IC0xKSB7XG4gICAgICAgICAgICBrZXkgPSBvcHRpb25zLmRlY29kZXIocGFydCwgZGVmYXVsdHMuZGVjb2RlciwgY2hhcnNldCwgJ2tleScpO1xuICAgICAgICAgICAgdmFsID0gb3B0aW9ucy5zdHJpY3ROdWxsSGFuZGxpbmcgPyBudWxsIDogJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBrZXkgPSBvcHRpb25zLmRlY29kZXIocGFydC5zbGljZSgwLCBwb3MpLCBkZWZhdWx0cy5kZWNvZGVyLCBjaGFyc2V0LCAna2V5Jyk7XG4gICAgICAgICAgICB2YWwgPSB1dGlscy5tYXliZU1hcChcbiAgICAgICAgICAgICAgICBwYXJzZUFycmF5VmFsdWUocGFydC5zbGljZShwb3MgKyAxKSwgb3B0aW9ucyksXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVuY29kZWRWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuZGVjb2RlcihlbmNvZGVkVmFsLCBkZWZhdWx0cy5kZWNvZGVyLCBjaGFyc2V0LCAndmFsdWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbCAmJiBvcHRpb25zLmludGVycHJldE51bWVyaWNFbnRpdGllcyAmJiBjaGFyc2V0ID09PSAnaXNvLTg4NTktMScpIHtcbiAgICAgICAgICAgIHZhbCA9IGludGVycHJldE51bWVyaWNFbnRpdGllcyh2YWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhcnQuaW5kZXhPZignW109JykgPiAtMSkge1xuICAgICAgICAgICAgdmFsID0gaXNBcnJheSh2YWwpID8gW3ZhbF0gOiB2YWw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZXhpc3RpbmcgPSBoYXMuY2FsbChvYmosIGtleSk7XG4gICAgICAgIGlmIChleGlzdGluZyAmJiBvcHRpb25zLmR1cGxpY2F0ZXMgPT09ICdjb21iaW5lJykge1xuICAgICAgICAgICAgb2JqW2tleV0gPSB1dGlscy5jb21iaW5lKG9ialtrZXldLCB2YWwpO1xuICAgICAgICB9IGVsc2UgaWYgKCFleGlzdGluZyB8fCBvcHRpb25zLmR1cGxpY2F0ZXMgPT09ICdsYXN0Jykge1xuICAgICAgICAgICAgb2JqW2tleV0gPSB2YWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxudmFyIHBhcnNlT2JqZWN0ID0gZnVuY3Rpb24gKGNoYWluLCB2YWwsIG9wdGlvbnMsIHZhbHVlc1BhcnNlZCkge1xuICAgIHZhciBsZWFmID0gdmFsdWVzUGFyc2VkID8gdmFsIDogcGFyc2VBcnJheVZhbHVlKHZhbCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBpID0gY2hhaW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIG9iajtcbiAgICAgICAgdmFyIHJvb3QgPSBjaGFpbltpXTtcblxuICAgICAgICBpZiAocm9vdCA9PT0gJ1tdJyAmJiBvcHRpb25zLnBhcnNlQXJyYXlzKSB7XG4gICAgICAgICAgICBvYmogPSBvcHRpb25zLmFsbG93RW1wdHlBcnJheXMgJiYgKGxlYWYgPT09ICcnIHx8IChvcHRpb25zLnN0cmljdE51bGxIYW5kbGluZyAmJiBsZWFmID09PSBudWxsKSlcbiAgICAgICAgICAgICAgICA/IFtdXG4gICAgICAgICAgICAgICAgOiBbXS5jb25jYXQobGVhZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmogPSBvcHRpb25zLnBsYWluT2JqZWN0cyA/IE9iamVjdC5jcmVhdGUobnVsbCkgOiB7fTtcbiAgICAgICAgICAgIHZhciBjbGVhblJvb3QgPSByb290LmNoYXJBdCgwKSA9PT0gJ1snICYmIHJvb3QuY2hhckF0KHJvb3QubGVuZ3RoIC0gMSkgPT09ICddJyA/IHJvb3Quc2xpY2UoMSwgLTEpIDogcm9vdDtcbiAgICAgICAgICAgIHZhciBkZWNvZGVkUm9vdCA9IG9wdGlvbnMuZGVjb2RlRG90SW5LZXlzID8gY2xlYW5Sb290LnJlcGxhY2UoLyUyRS9nLCAnLicpIDogY2xlYW5Sb290O1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFyc2VJbnQoZGVjb2RlZFJvb3QsIDEwKTtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5wYXJzZUFycmF5cyAmJiBkZWNvZGVkUm9vdCA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICBvYmogPSB7IDA6IGxlYWYgfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgIWlzTmFOKGluZGV4KVxuICAgICAgICAgICAgICAgICYmIHJvb3QgIT09IGRlY29kZWRSb290XG4gICAgICAgICAgICAgICAgJiYgU3RyaW5nKGluZGV4KSA9PT0gZGVjb2RlZFJvb3RcbiAgICAgICAgICAgICAgICAmJiBpbmRleCA+PSAwXG4gICAgICAgICAgICAgICAgJiYgKG9wdGlvbnMucGFyc2VBcnJheXMgJiYgaW5kZXggPD0gb3B0aW9ucy5hcnJheUxpbWl0KVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgb2JqID0gW107XG4gICAgICAgICAgICAgICAgb2JqW2luZGV4XSA9IGxlYWY7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlY29kZWRSb290ICE9PSAnX19wcm90b19fJykge1xuICAgICAgICAgICAgICAgIG9ialtkZWNvZGVkUm9vdF0gPSBsZWFmO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGVhZiA9IG9iajtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVhZjtcbn07XG5cbnZhciBwYXJzZUtleXMgPSBmdW5jdGlvbiBwYXJzZVF1ZXJ5U3RyaW5nS2V5cyhnaXZlbktleSwgdmFsLCBvcHRpb25zLCB2YWx1ZXNQYXJzZWQpIHtcbiAgICBpZiAoIWdpdmVuS2V5KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm0gZG90IG5vdGF0aW9uIHRvIGJyYWNrZXQgbm90YXRpb25cbiAgICB2YXIga2V5ID0gb3B0aW9ucy5hbGxvd0RvdHMgPyBnaXZlbktleS5yZXBsYWNlKC9cXC4oW14uW10rKS9nLCAnWyQxXScpIDogZ2l2ZW5LZXk7XG5cbiAgICAvLyBUaGUgcmVnZXggY2h1bmtzXG5cbiAgICB2YXIgYnJhY2tldHMgPSAvKFxcW1teW1xcXV0qXSkvO1xuICAgIHZhciBjaGlsZCA9IC8oXFxbW15bXFxdXSpdKS9nO1xuXG4gICAgLy8gR2V0IHRoZSBwYXJlbnRcblxuICAgIHZhciBzZWdtZW50ID0gb3B0aW9ucy5kZXB0aCA+IDAgJiYgYnJhY2tldHMuZXhlYyhrZXkpO1xuICAgIHZhciBwYXJlbnQgPSBzZWdtZW50ID8ga2V5LnNsaWNlKDAsIHNlZ21lbnQuaW5kZXgpIDoga2V5O1xuXG4gICAgLy8gU3Rhc2ggdGhlIHBhcmVudCBpZiBpdCBleGlzdHNcblxuICAgIHZhciBrZXlzID0gW107XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgICAvLyBJZiB3ZSBhcmVuJ3QgdXNpbmcgcGxhaW4gb2JqZWN0cywgb3B0aW9uYWxseSBwcmVmaXgga2V5cyB0aGF0IHdvdWxkIG92ZXJ3cml0ZSBvYmplY3QgcHJvdG90eXBlIHByb3BlcnRpZXNcbiAgICAgICAgaWYgKCFvcHRpb25zLnBsYWluT2JqZWN0cyAmJiBoYXMuY2FsbChPYmplY3QucHJvdG90eXBlLCBwYXJlbnQpKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dQcm90b3R5cGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAga2V5cy5wdXNoKHBhcmVudCk7XG4gICAgfVxuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGNoaWxkcmVuIGFwcGVuZGluZyB0byB0aGUgYXJyYXkgdW50aWwgd2UgaGl0IGRlcHRoXG5cbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKG9wdGlvbnMuZGVwdGggPiAwICYmIChzZWdtZW50ID0gY2hpbGQuZXhlYyhrZXkpKSAhPT0gbnVsbCAmJiBpIDwgb3B0aW9ucy5kZXB0aCkge1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmICghb3B0aW9ucy5wbGFpbk9iamVjdHMgJiYgaGFzLmNhbGwoT2JqZWN0LnByb3RvdHlwZSwgc2VnbWVudFsxXS5zbGljZSgxLCAtMSkpKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dQcm90b3R5cGVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGtleXMucHVzaChzZWdtZW50WzFdKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSdzIGEgcmVtYWluZGVyLCBjaGVjayBzdHJpY3REZXB0aCBvcHRpb24gZm9yIHRocm93LCBlbHNlIGp1c3QgYWRkIHdoYXRldmVyIGlzIGxlZnRcblxuICAgIGlmIChzZWdtZW50KSB7XG4gICAgICAgIGlmIChvcHRpb25zLnN0cmljdERlcHRoID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5wdXQgZGVwdGggZXhjZWVkZWQgZGVwdGggb3B0aW9uIG9mICcgKyBvcHRpb25zLmRlcHRoICsgJyBhbmQgc3RyaWN0RGVwdGggaXMgdHJ1ZScpO1xuICAgICAgICB9XG4gICAgICAgIGtleXMucHVzaCgnWycgKyBrZXkuc2xpY2Uoc2VnbWVudC5pbmRleCkgKyAnXScpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXJzZU9iamVjdChrZXlzLCB2YWwsIG9wdGlvbnMsIHZhbHVlc1BhcnNlZCk7XG59O1xuXG52YXIgbm9ybWFsaXplUGFyc2VPcHRpb25zID0gZnVuY3Rpb24gbm9ybWFsaXplUGFyc2VPcHRpb25zKG9wdHMpIHtcbiAgICBpZiAoIW9wdHMpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRzO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0cy5hbGxvd0VtcHR5QXJyYXlzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0cy5hbGxvd0VtcHR5QXJyYXlzICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYGFsbG93RW1wdHlBcnJheXNgIG9wdGlvbiBjYW4gb25seSBiZSBgdHJ1ZWAgb3IgYGZhbHNlYCwgd2hlbiBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0cy5kZWNvZGVEb3RJbktleXMgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBvcHRzLmRlY29kZURvdEluS2V5cyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BkZWNvZGVEb3RJbktleXNgIG9wdGlvbiBjYW4gb25seSBiZSBgdHJ1ZWAgb3IgYGZhbHNlYCwgd2hlbiBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGlmIChvcHRzLmRlY29kZXIgIT09IG51bGwgJiYgdHlwZW9mIG9wdHMuZGVjb2RlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdHMuZGVjb2RlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdEZWNvZGVyIGhhcyB0byBiZSBhIGZ1bmN0aW9uLicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0cy5jaGFyc2V0ICE9PSAndW5kZWZpbmVkJyAmJiBvcHRzLmNoYXJzZXQgIT09ICd1dGYtOCcgJiYgb3B0cy5jaGFyc2V0ICE9PSAnaXNvLTg4NTktMScpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGNoYXJzZXQgb3B0aW9uIG11c3QgYmUgZWl0aGVyIHV0Zi04LCBpc28tODg1OS0xLCBvciB1bmRlZmluZWQnKTtcbiAgICB9XG4gICAgdmFyIGNoYXJzZXQgPSB0eXBlb2Ygb3B0cy5jaGFyc2V0ID09PSAndW5kZWZpbmVkJyA/IGRlZmF1bHRzLmNoYXJzZXQgOiBvcHRzLmNoYXJzZXQ7XG5cbiAgICB2YXIgZHVwbGljYXRlcyA9IHR5cGVvZiBvcHRzLmR1cGxpY2F0ZXMgPT09ICd1bmRlZmluZWQnID8gZGVmYXVsdHMuZHVwbGljYXRlcyA6IG9wdHMuZHVwbGljYXRlcztcblxuICAgIGlmIChkdXBsaWNhdGVzICE9PSAnY29tYmluZScgJiYgZHVwbGljYXRlcyAhPT0gJ2ZpcnN0JyAmJiBkdXBsaWNhdGVzICE9PSAnbGFzdCcpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGR1cGxpY2F0ZXMgb3B0aW9uIG11c3QgYmUgZWl0aGVyIGNvbWJpbmUsIGZpcnN0LCBvciBsYXN0Jyk7XG4gICAgfVxuXG4gICAgdmFyIGFsbG93RG90cyA9IHR5cGVvZiBvcHRzLmFsbG93RG90cyA9PT0gJ3VuZGVmaW5lZCcgPyBvcHRzLmRlY29kZURvdEluS2V5cyA9PT0gdHJ1ZSA/IHRydWUgOiBkZWZhdWx0cy5hbGxvd0RvdHMgOiAhIW9wdHMuYWxsb3dEb3RzO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWxsb3dEb3RzOiBhbGxvd0RvdHMsXG4gICAgICAgIGFsbG93RW1wdHlBcnJheXM6IHR5cGVvZiBvcHRzLmFsbG93RW1wdHlBcnJheXMgPT09ICdib29sZWFuJyA/ICEhb3B0cy5hbGxvd0VtcHR5QXJyYXlzIDogZGVmYXVsdHMuYWxsb3dFbXB0eUFycmF5cyxcbiAgICAgICAgYWxsb3dQcm90b3R5cGVzOiB0eXBlb2Ygb3B0cy5hbGxvd1Byb3RvdHlwZXMgPT09ICdib29sZWFuJyA/IG9wdHMuYWxsb3dQcm90b3R5cGVzIDogZGVmYXVsdHMuYWxsb3dQcm90b3R5cGVzLFxuICAgICAgICBhbGxvd1NwYXJzZTogdHlwZW9mIG9wdHMuYWxsb3dTcGFyc2UgPT09ICdib29sZWFuJyA/IG9wdHMuYWxsb3dTcGFyc2UgOiBkZWZhdWx0cy5hbGxvd1NwYXJzZSxcbiAgICAgICAgYXJyYXlMaW1pdDogdHlwZW9mIG9wdHMuYXJyYXlMaW1pdCA9PT0gJ251bWJlcicgPyBvcHRzLmFycmF5TGltaXQgOiBkZWZhdWx0cy5hcnJheUxpbWl0LFxuICAgICAgICBjaGFyc2V0OiBjaGFyc2V0LFxuICAgICAgICBjaGFyc2V0U2VudGluZWw6IHR5cGVvZiBvcHRzLmNoYXJzZXRTZW50aW5lbCA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5jaGFyc2V0U2VudGluZWwgOiBkZWZhdWx0cy5jaGFyc2V0U2VudGluZWwsXG4gICAgICAgIGNvbW1hOiB0eXBlb2Ygb3B0cy5jb21tYSA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5jb21tYSA6IGRlZmF1bHRzLmNvbW1hLFxuICAgICAgICBkZWNvZGVEb3RJbktleXM6IHR5cGVvZiBvcHRzLmRlY29kZURvdEluS2V5cyA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5kZWNvZGVEb3RJbktleXMgOiBkZWZhdWx0cy5kZWNvZGVEb3RJbktleXMsXG4gICAgICAgIGRlY29kZXI6IHR5cGVvZiBvcHRzLmRlY29kZXIgPT09ICdmdW5jdGlvbicgPyBvcHRzLmRlY29kZXIgOiBkZWZhdWx0cy5kZWNvZGVyLFxuICAgICAgICBkZWxpbWl0ZXI6IHR5cGVvZiBvcHRzLmRlbGltaXRlciA9PT0gJ3N0cmluZycgfHwgdXRpbHMuaXNSZWdFeHAob3B0cy5kZWxpbWl0ZXIpID8gb3B0cy5kZWxpbWl0ZXIgOiBkZWZhdWx0cy5kZWxpbWl0ZXIsXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1pbXBsaWNpdC1jb2VyY2lvbiwgbm8tZXh0cmEtcGFyZW5zXG4gICAgICAgIGRlcHRoOiAodHlwZW9mIG9wdHMuZGVwdGggPT09ICdudW1iZXInIHx8IG9wdHMuZGVwdGggPT09IGZhbHNlKSA/ICtvcHRzLmRlcHRoIDogZGVmYXVsdHMuZGVwdGgsXG4gICAgICAgIGR1cGxpY2F0ZXM6IGR1cGxpY2F0ZXMsXG4gICAgICAgIGlnbm9yZVF1ZXJ5UHJlZml4OiBvcHRzLmlnbm9yZVF1ZXJ5UHJlZml4ID09PSB0cnVlLFxuICAgICAgICBpbnRlcnByZXROdW1lcmljRW50aXRpZXM6IHR5cGVvZiBvcHRzLmludGVycHJldE51bWVyaWNFbnRpdGllcyA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5pbnRlcnByZXROdW1lcmljRW50aXRpZXMgOiBkZWZhdWx0cy5pbnRlcnByZXROdW1lcmljRW50aXRpZXMsXG4gICAgICAgIHBhcmFtZXRlckxpbWl0OiB0eXBlb2Ygb3B0cy5wYXJhbWV0ZXJMaW1pdCA9PT0gJ251bWJlcicgPyBvcHRzLnBhcmFtZXRlckxpbWl0IDogZGVmYXVsdHMucGFyYW1ldGVyTGltaXQsXG4gICAgICAgIHBhcnNlQXJyYXlzOiBvcHRzLnBhcnNlQXJyYXlzICE9PSBmYWxzZSxcbiAgICAgICAgcGxhaW5PYmplY3RzOiB0eXBlb2Ygb3B0cy5wbGFpbk9iamVjdHMgPT09ICdib29sZWFuJyA/IG9wdHMucGxhaW5PYmplY3RzIDogZGVmYXVsdHMucGxhaW5PYmplY3RzLFxuICAgICAgICBzdHJpY3REZXB0aDogdHlwZW9mIG9wdHMuc3RyaWN0RGVwdGggPT09ICdib29sZWFuJyA/ICEhb3B0cy5zdHJpY3REZXB0aCA6IGRlZmF1bHRzLnN0cmljdERlcHRoLFxuICAgICAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IHR5cGVvZiBvcHRzLnN0cmljdE51bGxIYW5kbGluZyA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5zdHJpY3ROdWxsSGFuZGxpbmcgOiBkZWZhdWx0cy5zdHJpY3ROdWxsSGFuZGxpbmdcbiAgICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyLCBvcHRzKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBub3JtYWxpemVQYXJzZU9wdGlvbnMob3B0cyk7XG5cbiAgICBpZiAoc3RyID09PSAnJyB8fCBzdHIgPT09IG51bGwgfHwgdHlwZW9mIHN0ciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMucGxhaW5PYmplY3RzID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IHt9O1xuICAgIH1cblxuICAgIHZhciB0ZW1wT2JqID0gdHlwZW9mIHN0ciA9PT0gJ3N0cmluZycgPyBwYXJzZVZhbHVlcyhzdHIsIG9wdGlvbnMpIDogc3RyO1xuICAgIHZhciBvYmogPSBvcHRpb25zLnBsYWluT2JqZWN0cyA/IE9iamVjdC5jcmVhdGUobnVsbCkgOiB7fTtcblxuICAgIC8vIEl0ZXJhdGUgb3ZlciB0aGUga2V5cyBhbmQgc2V0dXAgdGhlIG5ldyBvYmplY3RcblxuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModGVtcE9iaik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICB2YXIgbmV3T2JqID0gcGFyc2VLZXlzKGtleSwgdGVtcE9ialtrZXldLCBvcHRpb25zLCB0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyk7XG4gICAgICAgIG9iaiA9IHV0aWxzLm1lcmdlKG9iaiwgbmV3T2JqLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5hbGxvd1NwYXJzZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHJldHVybiB1dGlscy5jb21wYWN0KG9iaik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZ2V0U2lkZUNoYW5uZWwgPSByZXF1aXJlKCdzaWRlLWNoYW5uZWwnKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBmb3JtYXRzID0gcmVxdWlyZSgnLi9mb3JtYXRzJyk7XG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxudmFyIGFycmF5UHJlZml4R2VuZXJhdG9ycyA9IHtcbiAgICBicmFja2V0czogZnVuY3Rpb24gYnJhY2tldHMocHJlZml4KSB7XG4gICAgICAgIHJldHVybiBwcmVmaXggKyAnW10nO1xuICAgIH0sXG4gICAgY29tbWE6ICdjb21tYScsXG4gICAgaW5kaWNlczogZnVuY3Rpb24gaW5kaWNlcyhwcmVmaXgsIGtleSkge1xuICAgICAgICByZXR1cm4gcHJlZml4ICsgJ1snICsga2V5ICsgJ10nO1xuICAgIH0sXG4gICAgcmVwZWF0OiBmdW5jdGlvbiByZXBlYXQocHJlZml4KSB7XG4gICAgICAgIHJldHVybiBwcmVmaXg7XG4gICAgfVxufTtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xudmFyIHB1c2ggPSBBcnJheS5wcm90b3R5cGUucHVzaDtcbnZhciBwdXNoVG9BcnJheSA9IGZ1bmN0aW9uIChhcnIsIHZhbHVlT3JBcnJheSkge1xuICAgIHB1c2guYXBwbHkoYXJyLCBpc0FycmF5KHZhbHVlT3JBcnJheSkgPyB2YWx1ZU9yQXJyYXkgOiBbdmFsdWVPckFycmF5XSk7XG59O1xuXG52YXIgdG9JU08gPSBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZztcblxudmFyIGRlZmF1bHRGb3JtYXQgPSBmb3JtYXRzWydkZWZhdWx0J107XG52YXIgZGVmYXVsdHMgPSB7XG4gICAgYWRkUXVlcnlQcmVmaXg6IGZhbHNlLFxuICAgIGFsbG93RG90czogZmFsc2UsXG4gICAgYWxsb3dFbXB0eUFycmF5czogZmFsc2UsXG4gICAgYXJyYXlGb3JtYXQ6ICdpbmRpY2VzJyxcbiAgICBjaGFyc2V0OiAndXRmLTgnLFxuICAgIGNoYXJzZXRTZW50aW5lbDogZmFsc2UsXG4gICAgZGVsaW1pdGVyOiAnJicsXG4gICAgZW5jb2RlOiB0cnVlLFxuICAgIGVuY29kZURvdEluS2V5czogZmFsc2UsXG4gICAgZW5jb2RlcjogdXRpbHMuZW5jb2RlLFxuICAgIGVuY29kZVZhbHVlc09ubHk6IGZhbHNlLFxuICAgIGZvcm1hdDogZGVmYXVsdEZvcm1hdCxcbiAgICBmb3JtYXR0ZXI6IGZvcm1hdHMuZm9ybWF0dGVyc1tkZWZhdWx0Rm9ybWF0XSxcbiAgICAvLyBkZXByZWNhdGVkXG4gICAgaW5kaWNlczogZmFsc2UsXG4gICAgc2VyaWFsaXplRGF0ZTogZnVuY3Rpb24gc2VyaWFsaXplRGF0ZShkYXRlKSB7XG4gICAgICAgIHJldHVybiB0b0lTTy5jYWxsKGRhdGUpO1xuICAgIH0sXG4gICAgc2tpcE51bGxzOiBmYWxzZSxcbiAgICBzdHJpY3ROdWxsSGFuZGxpbmc6IGZhbHNlXG59O1xuXG52YXIgaXNOb25OdWxsaXNoUHJpbWl0aXZlID0gZnVuY3Rpb24gaXNOb25OdWxsaXNoUHJpbWl0aXZlKHYpIHtcbiAgICByZXR1cm4gdHlwZW9mIHYgPT09ICdzdHJpbmcnXG4gICAgICAgIHx8IHR5cGVvZiB2ID09PSAnbnVtYmVyJ1xuICAgICAgICB8fCB0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nXG4gICAgICAgIHx8IHR5cGVvZiB2ID09PSAnc3ltYm9sJ1xuICAgICAgICB8fCB0eXBlb2YgdiA9PT0gJ2JpZ2ludCc7XG59O1xuXG52YXIgc2VudGluZWwgPSB7fTtcblxudmFyIHN0cmluZ2lmeSA9IGZ1bmN0aW9uIHN0cmluZ2lmeShcbiAgICBvYmplY3QsXG4gICAgcHJlZml4LFxuICAgIGdlbmVyYXRlQXJyYXlQcmVmaXgsXG4gICAgY29tbWFSb3VuZFRyaXAsXG4gICAgYWxsb3dFbXB0eUFycmF5cyxcbiAgICBzdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgc2tpcE51bGxzLFxuICAgIGVuY29kZURvdEluS2V5cyxcbiAgICBlbmNvZGVyLFxuICAgIGZpbHRlcixcbiAgICBzb3J0LFxuICAgIGFsbG93RG90cyxcbiAgICBzZXJpYWxpemVEYXRlLFxuICAgIGZvcm1hdCxcbiAgICBmb3JtYXR0ZXIsXG4gICAgZW5jb2RlVmFsdWVzT25seSxcbiAgICBjaGFyc2V0LFxuICAgIHNpZGVDaGFubmVsXG4pIHtcbiAgICB2YXIgb2JqID0gb2JqZWN0O1xuXG4gICAgdmFyIHRtcFNjID0gc2lkZUNoYW5uZWw7XG4gICAgdmFyIHN0ZXAgPSAwO1xuICAgIHZhciBmaW5kRmxhZyA9IGZhbHNlO1xuICAgIHdoaWxlICgodG1wU2MgPSB0bXBTYy5nZXQoc2VudGluZWwpKSAhPT0gdm9pZCB1bmRlZmluZWQgJiYgIWZpbmRGbGFnKSB7XG4gICAgICAgIC8vIFdoZXJlIG9iamVjdCBsYXN0IGFwcGVhcmVkIGluIHRoZSByZWYgdHJlZVxuICAgICAgICB2YXIgcG9zID0gdG1wU2MuZ2V0KG9iamVjdCk7XG4gICAgICAgIHN0ZXAgKz0gMTtcbiAgICAgICAgaWYgKHR5cGVvZiBwb3MgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZiAocG9zID09PSBzdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0N5Y2xpYyBvYmplY3QgdmFsdWUnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZmluZEZsYWcgPSB0cnVlOyAvLyBCcmVhayB3aGlsZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdG1wU2MuZ2V0KHNlbnRpbmVsKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHN0ZXAgPSAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgb2JqID0gZmlsdGVyKHByZWZpeCwgb2JqKTtcbiAgICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgb2JqID0gc2VyaWFsaXplRGF0ZShvYmopO1xuICAgIH0gZWxzZSBpZiAoZ2VuZXJhdGVBcnJheVByZWZpeCA9PT0gJ2NvbW1hJyAmJiBpc0FycmF5KG9iaikpIHtcbiAgICAgICAgb2JqID0gdXRpbHMubWF5YmVNYXAob2JqLCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VyaWFsaXplRGF0ZSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChvYmogPT09IG51bGwpIHtcbiAgICAgICAgaWYgKHN0cmljdE51bGxIYW5kbGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGVuY29kZXIgJiYgIWVuY29kZVZhbHVlc09ubHkgPyBlbmNvZGVyKHByZWZpeCwgZGVmYXVsdHMuZW5jb2RlciwgY2hhcnNldCwgJ2tleScsIGZvcm1hdCkgOiBwcmVmaXg7XG4gICAgICAgIH1cblxuICAgICAgICBvYmogPSAnJztcbiAgICB9XG5cbiAgICBpZiAoaXNOb25OdWxsaXNoUHJpbWl0aXZlKG9iaikgfHwgdXRpbHMuaXNCdWZmZXIob2JqKSkge1xuICAgICAgICBpZiAoZW5jb2Rlcikge1xuICAgICAgICAgICAgdmFyIGtleVZhbHVlID0gZW5jb2RlVmFsdWVzT25seSA/IHByZWZpeCA6IGVuY29kZXIocHJlZml4LCBkZWZhdWx0cy5lbmNvZGVyLCBjaGFyc2V0LCAna2V5JywgZm9ybWF0KTtcbiAgICAgICAgICAgIHJldHVybiBbZm9ybWF0dGVyKGtleVZhbHVlKSArICc9JyArIGZvcm1hdHRlcihlbmNvZGVyKG9iaiwgZGVmYXVsdHMuZW5jb2RlciwgY2hhcnNldCwgJ3ZhbHVlJywgZm9ybWF0KSldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbZm9ybWF0dGVyKHByZWZpeCkgKyAnPScgKyBmb3JtYXR0ZXIoU3RyaW5nKG9iaikpXTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG5cbiAgICB2YXIgb2JqS2V5cztcbiAgICBpZiAoZ2VuZXJhdGVBcnJheVByZWZpeCA9PT0gJ2NvbW1hJyAmJiBpc0FycmF5KG9iaikpIHtcbiAgICAgICAgLy8gd2UgbmVlZCB0byBqb2luIGVsZW1lbnRzIGluXG4gICAgICAgIGlmIChlbmNvZGVWYWx1ZXNPbmx5ICYmIGVuY29kZXIpIHtcbiAgICAgICAgICAgIG9iaiA9IHV0aWxzLm1heWJlTWFwKG9iaiwgZW5jb2Rlcik7XG4gICAgICAgIH1cbiAgICAgICAgb2JqS2V5cyA9IFt7IHZhbHVlOiBvYmoubGVuZ3RoID4gMCA/IG9iai5qb2luKCcsJykgfHwgbnVsbCA6IHZvaWQgdW5kZWZpbmVkIH1dO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShmaWx0ZXIpKSB7XG4gICAgICAgIG9iaktleXMgPSBmaWx0ZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICBvYmpLZXlzID0gc29ydCA/IGtleXMuc29ydChzb3J0KSA6IGtleXM7XG4gICAgfVxuXG4gICAgdmFyIGVuY29kZWRQcmVmaXggPSBlbmNvZGVEb3RJbktleXMgPyBwcmVmaXgucmVwbGFjZSgvXFwuL2csICclMkUnKSA6IHByZWZpeDtcblxuICAgIHZhciBhZGp1c3RlZFByZWZpeCA9IGNvbW1hUm91bmRUcmlwICYmIGlzQXJyYXkob2JqKSAmJiBvYmoubGVuZ3RoID09PSAxID8gZW5jb2RlZFByZWZpeCArICdbXScgOiBlbmNvZGVkUHJlZml4O1xuXG4gICAgaWYgKGFsbG93RW1wdHlBcnJheXMgJiYgaXNBcnJheShvYmopICYmIG9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGFkanVzdGVkUHJlZml4ICsgJ1tdJztcbiAgICB9XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG9iaktleXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgdmFyIGtleSA9IG9iaktleXNbal07XG4gICAgICAgIHZhciB2YWx1ZSA9IHR5cGVvZiBrZXkgPT09ICdvYmplY3QnICYmIHR5cGVvZiBrZXkudmFsdWUgIT09ICd1bmRlZmluZWQnID8ga2V5LnZhbHVlIDogb2JqW2tleV07XG5cbiAgICAgICAgaWYgKHNraXBOdWxscyAmJiB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZW5jb2RlZEtleSA9IGFsbG93RG90cyAmJiBlbmNvZGVEb3RJbktleXMgPyBrZXkucmVwbGFjZSgvXFwuL2csICclMkUnKSA6IGtleTtcbiAgICAgICAgdmFyIGtleVByZWZpeCA9IGlzQXJyYXkob2JqKVxuICAgICAgICAgICAgPyB0eXBlb2YgZ2VuZXJhdGVBcnJheVByZWZpeCA9PT0gJ2Z1bmN0aW9uJyA/IGdlbmVyYXRlQXJyYXlQcmVmaXgoYWRqdXN0ZWRQcmVmaXgsIGVuY29kZWRLZXkpIDogYWRqdXN0ZWRQcmVmaXhcbiAgICAgICAgICAgIDogYWRqdXN0ZWRQcmVmaXggKyAoYWxsb3dEb3RzID8gJy4nICsgZW5jb2RlZEtleSA6ICdbJyArIGVuY29kZWRLZXkgKyAnXScpO1xuXG4gICAgICAgIHNpZGVDaGFubmVsLnNldChvYmplY3QsIHN0ZXApO1xuICAgICAgICB2YXIgdmFsdWVTaWRlQ2hhbm5lbCA9IGdldFNpZGVDaGFubmVsKCk7XG4gICAgICAgIHZhbHVlU2lkZUNoYW5uZWwuc2V0KHNlbnRpbmVsLCBzaWRlQ2hhbm5lbCk7XG4gICAgICAgIHB1c2hUb0FycmF5KHZhbHVlcywgc3RyaW5naWZ5KFxuICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICBrZXlQcmVmaXgsXG4gICAgICAgICAgICBnZW5lcmF0ZUFycmF5UHJlZml4LFxuICAgICAgICAgICAgY29tbWFSb3VuZFRyaXAsXG4gICAgICAgICAgICBhbGxvd0VtcHR5QXJyYXlzLFxuICAgICAgICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nLFxuICAgICAgICAgICAgc2tpcE51bGxzLFxuICAgICAgICAgICAgZW5jb2RlRG90SW5LZXlzLFxuICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCA9PT0gJ2NvbW1hJyAmJiBlbmNvZGVWYWx1ZXNPbmx5ICYmIGlzQXJyYXkob2JqKSA/IG51bGwgOiBlbmNvZGVyLFxuICAgICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgICAgc29ydCxcbiAgICAgICAgICAgIGFsbG93RG90cyxcbiAgICAgICAgICAgIHNlcmlhbGl6ZURhdGUsXG4gICAgICAgICAgICBmb3JtYXQsXG4gICAgICAgICAgICBmb3JtYXR0ZXIsXG4gICAgICAgICAgICBlbmNvZGVWYWx1ZXNPbmx5LFxuICAgICAgICAgICAgY2hhcnNldCxcbiAgICAgICAgICAgIHZhbHVlU2lkZUNoYW5uZWxcbiAgICAgICAgKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlcztcbn07XG5cbnZhciBub3JtYWxpemVTdHJpbmdpZnlPcHRpb25zID0gZnVuY3Rpb24gbm9ybWFsaXplU3RyaW5naWZ5T3B0aW9ucyhvcHRzKSB7XG4gICAgaWYgKCFvcHRzKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0cztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMuYWxsb3dFbXB0eUFycmF5cyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG9wdHMuYWxsb3dFbXB0eUFycmF5cyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BhbGxvd0VtcHR5QXJyYXlzYCBvcHRpb24gY2FuIG9ubHkgYmUgYHRydWVgIG9yIGBmYWxzZWAsIHdoZW4gcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdHMuZW5jb2RlRG90SW5LZXlzICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygb3B0cy5lbmNvZGVEb3RJbktleXMgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgZW5jb2RlRG90SW5LZXlzYCBvcHRpb24gY2FuIG9ubHkgYmUgYHRydWVgIG9yIGBmYWxzZWAsIHdoZW4gcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5lbmNvZGVyICE9PSBudWxsICYmIHR5cGVvZiBvcHRzLmVuY29kZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBvcHRzLmVuY29kZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRW5jb2RlciBoYXMgdG8gYmUgYSBmdW5jdGlvbi4nKTtcbiAgICB9XG5cbiAgICB2YXIgY2hhcnNldCA9IG9wdHMuY2hhcnNldCB8fCBkZWZhdWx0cy5jaGFyc2V0O1xuICAgIGlmICh0eXBlb2Ygb3B0cy5jaGFyc2V0ICE9PSAndW5kZWZpbmVkJyAmJiBvcHRzLmNoYXJzZXQgIT09ICd1dGYtOCcgJiYgb3B0cy5jaGFyc2V0ICE9PSAnaXNvLTg4NTktMScpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIGNoYXJzZXQgb3B0aW9uIG11c3QgYmUgZWl0aGVyIHV0Zi04LCBpc28tODg1OS0xLCBvciB1bmRlZmluZWQnKTtcbiAgICB9XG5cbiAgICB2YXIgZm9ybWF0ID0gZm9ybWF0c1snZGVmYXVsdCddO1xuICAgIGlmICh0eXBlb2Ygb3B0cy5mb3JtYXQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmICghaGFzLmNhbGwoZm9ybWF0cy5mb3JtYXR0ZXJzLCBvcHRzLmZvcm1hdCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZm9ybWF0IG9wdGlvbiBwcm92aWRlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBmb3JtYXQgPSBvcHRzLmZvcm1hdDtcbiAgICB9XG4gICAgdmFyIGZvcm1hdHRlciA9IGZvcm1hdHMuZm9ybWF0dGVyc1tmb3JtYXRdO1xuXG4gICAgdmFyIGZpbHRlciA9IGRlZmF1bHRzLmZpbHRlcjtcbiAgICBpZiAodHlwZW9mIG9wdHMuZmlsdGVyID09PSAnZnVuY3Rpb24nIHx8IGlzQXJyYXkob3B0cy5maWx0ZXIpKSB7XG4gICAgICAgIGZpbHRlciA9IG9wdHMuZmlsdGVyO1xuICAgIH1cblxuICAgIHZhciBhcnJheUZvcm1hdDtcbiAgICBpZiAob3B0cy5hcnJheUZvcm1hdCBpbiBhcnJheVByZWZpeEdlbmVyYXRvcnMpIHtcbiAgICAgICAgYXJyYXlGb3JtYXQgPSBvcHRzLmFycmF5Rm9ybWF0O1xuICAgIH0gZWxzZSBpZiAoJ2luZGljZXMnIGluIG9wdHMpIHtcbiAgICAgICAgYXJyYXlGb3JtYXQgPSBvcHRzLmluZGljZXMgPyAnaW5kaWNlcycgOiAncmVwZWF0JztcbiAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheUZvcm1hdCA9IGRlZmF1bHRzLmFycmF5Rm9ybWF0O1xuICAgIH1cblxuICAgIGlmICgnY29tbWFSb3VuZFRyaXAnIGluIG9wdHMgJiYgdHlwZW9mIG9wdHMuY29tbWFSb3VuZFRyaXAgIT09ICdib29sZWFuJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgY29tbWFSb3VuZFRyaXBgIG11c3QgYmUgYSBib29sZWFuLCBvciBhYnNlbnQnKTtcbiAgICB9XG5cbiAgICB2YXIgYWxsb3dEb3RzID0gdHlwZW9mIG9wdHMuYWxsb3dEb3RzID09PSAndW5kZWZpbmVkJyA/IG9wdHMuZW5jb2RlRG90SW5LZXlzID09PSB0cnVlID8gdHJ1ZSA6IGRlZmF1bHRzLmFsbG93RG90cyA6ICEhb3B0cy5hbGxvd0RvdHM7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBhZGRRdWVyeVByZWZpeDogdHlwZW9mIG9wdHMuYWRkUXVlcnlQcmVmaXggPT09ICdib29sZWFuJyA/IG9wdHMuYWRkUXVlcnlQcmVmaXggOiBkZWZhdWx0cy5hZGRRdWVyeVByZWZpeCxcbiAgICAgICAgYWxsb3dEb3RzOiBhbGxvd0RvdHMsXG4gICAgICAgIGFsbG93RW1wdHlBcnJheXM6IHR5cGVvZiBvcHRzLmFsbG93RW1wdHlBcnJheXMgPT09ICdib29sZWFuJyA/ICEhb3B0cy5hbGxvd0VtcHR5QXJyYXlzIDogZGVmYXVsdHMuYWxsb3dFbXB0eUFycmF5cyxcbiAgICAgICAgYXJyYXlGb3JtYXQ6IGFycmF5Rm9ybWF0LFxuICAgICAgICBjaGFyc2V0OiBjaGFyc2V0LFxuICAgICAgICBjaGFyc2V0U2VudGluZWw6IHR5cGVvZiBvcHRzLmNoYXJzZXRTZW50aW5lbCA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5jaGFyc2V0U2VudGluZWwgOiBkZWZhdWx0cy5jaGFyc2V0U2VudGluZWwsXG4gICAgICAgIGNvbW1hUm91bmRUcmlwOiBvcHRzLmNvbW1hUm91bmRUcmlwLFxuICAgICAgICBkZWxpbWl0ZXI6IHR5cGVvZiBvcHRzLmRlbGltaXRlciA9PT0gJ3VuZGVmaW5lZCcgPyBkZWZhdWx0cy5kZWxpbWl0ZXIgOiBvcHRzLmRlbGltaXRlcixcbiAgICAgICAgZW5jb2RlOiB0eXBlb2Ygb3B0cy5lbmNvZGUgPT09ICdib29sZWFuJyA/IG9wdHMuZW5jb2RlIDogZGVmYXVsdHMuZW5jb2RlLFxuICAgICAgICBlbmNvZGVEb3RJbktleXM6IHR5cGVvZiBvcHRzLmVuY29kZURvdEluS2V5cyA9PT0gJ2Jvb2xlYW4nID8gb3B0cy5lbmNvZGVEb3RJbktleXMgOiBkZWZhdWx0cy5lbmNvZGVEb3RJbktleXMsXG4gICAgICAgIGVuY29kZXI6IHR5cGVvZiBvcHRzLmVuY29kZXIgPT09ICdmdW5jdGlvbicgPyBvcHRzLmVuY29kZXIgOiBkZWZhdWx0cy5lbmNvZGVyLFxuICAgICAgICBlbmNvZGVWYWx1ZXNPbmx5OiB0eXBlb2Ygb3B0cy5lbmNvZGVWYWx1ZXNPbmx5ID09PSAnYm9vbGVhbicgPyBvcHRzLmVuY29kZVZhbHVlc09ubHkgOiBkZWZhdWx0cy5lbmNvZGVWYWx1ZXNPbmx5LFxuICAgICAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICAgICAgZm9ybWF0OiBmb3JtYXQsXG4gICAgICAgIGZvcm1hdHRlcjogZm9ybWF0dGVyLFxuICAgICAgICBzZXJpYWxpemVEYXRlOiB0eXBlb2Ygb3B0cy5zZXJpYWxpemVEYXRlID09PSAnZnVuY3Rpb24nID8gb3B0cy5zZXJpYWxpemVEYXRlIDogZGVmYXVsdHMuc2VyaWFsaXplRGF0ZSxcbiAgICAgICAgc2tpcE51bGxzOiB0eXBlb2Ygb3B0cy5za2lwTnVsbHMgPT09ICdib29sZWFuJyA/IG9wdHMuc2tpcE51bGxzIDogZGVmYXVsdHMuc2tpcE51bGxzLFxuICAgICAgICBzb3J0OiB0eXBlb2Ygb3B0cy5zb3J0ID09PSAnZnVuY3Rpb24nID8gb3B0cy5zb3J0IDogbnVsbCxcbiAgICAgICAgc3RyaWN0TnVsbEhhbmRsaW5nOiB0eXBlb2Ygb3B0cy5zdHJpY3ROdWxsSGFuZGxpbmcgPT09ICdib29sZWFuJyA/IG9wdHMuc3RyaWN0TnVsbEhhbmRsaW5nIDogZGVmYXVsdHMuc3RyaWN0TnVsbEhhbmRsaW5nXG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgb3B0cykge1xuICAgIHZhciBvYmogPSBvYmplY3Q7XG4gICAgdmFyIG9wdGlvbnMgPSBub3JtYWxpemVTdHJpbmdpZnlPcHRpb25zKG9wdHMpO1xuXG4gICAgdmFyIG9iaktleXM7XG4gICAgdmFyIGZpbHRlcjtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5maWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZmlsdGVyID0gb3B0aW9ucy5maWx0ZXI7XG4gICAgICAgIG9iaiA9IGZpbHRlcignJywgb2JqKTtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob3B0aW9ucy5maWx0ZXIpKSB7XG4gICAgICAgIGZpbHRlciA9IG9wdGlvbnMuZmlsdGVyO1xuICAgICAgICBvYmpLZXlzID0gZmlsdGVyO1xuICAgIH1cblxuICAgIHZhciBrZXlzID0gW107XG5cbiAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgfHwgb2JqID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICB2YXIgZ2VuZXJhdGVBcnJheVByZWZpeCA9IGFycmF5UHJlZml4R2VuZXJhdG9yc1tvcHRpb25zLmFycmF5Rm9ybWF0XTtcbiAgICB2YXIgY29tbWFSb3VuZFRyaXAgPSBnZW5lcmF0ZUFycmF5UHJlZml4ID09PSAnY29tbWEnICYmIG9wdGlvbnMuY29tbWFSb3VuZFRyaXA7XG5cbiAgICBpZiAoIW9iaktleXMpIHtcbiAgICAgICAgb2JqS2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc29ydCkge1xuICAgICAgICBvYmpLZXlzLnNvcnQob3B0aW9ucy5zb3J0KTtcbiAgICB9XG5cbiAgICB2YXIgc2lkZUNoYW5uZWwgPSBnZXRTaWRlQ2hhbm5lbCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqS2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIga2V5ID0gb2JqS2V5c1tpXTtcblxuICAgICAgICBpZiAob3B0aW9ucy5za2lwTnVsbHMgJiYgb2JqW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHB1c2hUb0FycmF5KGtleXMsIHN0cmluZ2lmeShcbiAgICAgICAgICAgIG9ialtrZXldLFxuICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgZ2VuZXJhdGVBcnJheVByZWZpeCxcbiAgICAgICAgICAgIGNvbW1hUm91bmRUcmlwLFxuICAgICAgICAgICAgb3B0aW9ucy5hbGxvd0VtcHR5QXJyYXlzLFxuICAgICAgICAgICAgb3B0aW9ucy5zdHJpY3ROdWxsSGFuZGxpbmcsXG4gICAgICAgICAgICBvcHRpb25zLnNraXBOdWxscyxcbiAgICAgICAgICAgIG9wdGlvbnMuZW5jb2RlRG90SW5LZXlzLFxuICAgICAgICAgICAgb3B0aW9ucy5lbmNvZGUgPyBvcHRpb25zLmVuY29kZXIgOiBudWxsLFxuICAgICAgICAgICAgb3B0aW9ucy5maWx0ZXIsXG4gICAgICAgICAgICBvcHRpb25zLnNvcnQsXG4gICAgICAgICAgICBvcHRpb25zLmFsbG93RG90cyxcbiAgICAgICAgICAgIG9wdGlvbnMuc2VyaWFsaXplRGF0ZSxcbiAgICAgICAgICAgIG9wdGlvbnMuZm9ybWF0LFxuICAgICAgICAgICAgb3B0aW9ucy5mb3JtYXR0ZXIsXG4gICAgICAgICAgICBvcHRpb25zLmVuY29kZVZhbHVlc09ubHksXG4gICAgICAgICAgICBvcHRpb25zLmNoYXJzZXQsXG4gICAgICAgICAgICBzaWRlQ2hhbm5lbFxuICAgICAgICApKTtcbiAgICB9XG5cbiAgICB2YXIgam9pbmVkID0ga2V5cy5qb2luKG9wdGlvbnMuZGVsaW1pdGVyKTtcbiAgICB2YXIgcHJlZml4ID0gb3B0aW9ucy5hZGRRdWVyeVByZWZpeCA9PT0gdHJ1ZSA/ICc/JyA6ICcnO1xuXG4gICAgaWYgKG9wdGlvbnMuY2hhcnNldFNlbnRpbmVsKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmNoYXJzZXQgPT09ICdpc28tODg1OS0xJykge1xuICAgICAgICAgICAgLy8gZW5jb2RlVVJJQ29tcG9uZW50KCcmIzEwMDAzOycpLCB0aGUgXCJudW1lcmljIGVudGl0eVwiIHJlcHJlc2VudGF0aW9uIG9mIGEgY2hlY2ttYXJrXG4gICAgICAgICAgICBwcmVmaXggKz0gJ3V0Zjg9JTI2JTIzMTAwMDMlM0ImJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVuY29kZVVSSUNvbXBvbmVudCgn4pyTJylcbiAgICAgICAgICAgIHByZWZpeCArPSAndXRmOD0lRTIlOUMlOTMmJztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBqb2luZWQubGVuZ3RoID4gMCA/IHByZWZpeCArIGpvaW5lZCA6ICcnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvcm1hdHMgPSByZXF1aXJlKCcuL2Zvcm1hdHMnKTtcblxudmFyIGhhcyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbnZhciBoZXhUYWJsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFycmF5ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICAgICAgICBhcnJheS5wdXNoKCclJyArICgoaSA8IDE2ID8gJzAnIDogJycpICsgaS50b1N0cmluZygxNikpLnRvVXBwZXJDYXNlKCkpO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn0oKSk7XG5cbnZhciBjb21wYWN0UXVldWUgPSBmdW5jdGlvbiBjb21wYWN0UXVldWUocXVldWUpIHtcbiAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMSkge1xuICAgICAgICB2YXIgaXRlbSA9IHF1ZXVlLnBvcCgpO1xuICAgICAgICB2YXIgb2JqID0gaXRlbS5vYmpbaXRlbS5wcm9wXTtcblxuICAgICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICB2YXIgY29tcGFjdGVkID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb2JqLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmpbal0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBhY3RlZC5wdXNoKG9ialtqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpdGVtLm9ialtpdGVtLnByb3BdID0gY29tcGFjdGVkO1xuICAgICAgICB9XG4gICAgfVxufTtcblxudmFyIGFycmF5VG9PYmplY3QgPSBmdW5jdGlvbiBhcnJheVRvT2JqZWN0KHNvdXJjZSwgb3B0aW9ucykge1xuICAgIHZhciBvYmogPSBvcHRpb25zICYmIG9wdGlvbnMucGxhaW5PYmplY3RzID8gT2JqZWN0LmNyZWF0ZShudWxsKSA6IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlW2ldICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgb2JqW2ldID0gc291cmNlW2ldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbnZhciBtZXJnZSA9IGZ1bmN0aW9uIG1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG4gICAgLyogZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOiAwICovXG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKGlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgICAgdGFyZ2V0LnB1c2goc291cmNlKTtcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmICgob3B0aW9ucyAmJiAob3B0aW9ucy5wbGFpbk9iamVjdHMgfHwgb3B0aW9ucy5hbGxvd1Byb3RvdHlwZXMpKSB8fCAhaGFzLmNhbGwoT2JqZWN0LnByb3RvdHlwZSwgc291cmNlKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtzb3VyY2VdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbdGFyZ2V0LCBzb3VyY2VdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICBpZiAoIXRhcmdldCB8fCB0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gW3RhcmdldF0uY29uY2F0KHNvdXJjZSk7XG4gICAgfVxuXG4gICAgdmFyIG1lcmdlVGFyZ2V0ID0gdGFyZ2V0O1xuICAgIGlmIChpc0FycmF5KHRhcmdldCkgJiYgIWlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICBtZXJnZVRhcmdldCA9IGFycmF5VG9PYmplY3QodGFyZ2V0LCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoaXNBcnJheSh0YXJnZXQpICYmIGlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICBzb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgICAgaWYgKGhhcy5jYWxsKHRhcmdldCwgaSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0SXRlbSA9IHRhcmdldFtpXTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0SXRlbSAmJiB0eXBlb2YgdGFyZ2V0SXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbSAmJiB0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W2ldID0gbWVyZ2UodGFyZ2V0SXRlbSwgaXRlbSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRbaV0gPSBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMoc291cmNlKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHNvdXJjZVtrZXldO1xuXG4gICAgICAgIGlmIChoYXMuY2FsbChhY2MsIGtleSkpIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gbWVyZ2UoYWNjW2tleV0sIHZhbHVlLCBvcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBtZXJnZVRhcmdldCk7XG59O1xuXG52YXIgYXNzaWduID0gZnVuY3Rpb24gYXNzaWduU2luZ2xlU291cmNlKHRhcmdldCwgc291cmNlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHNvdXJjZSkucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGtleSkge1xuICAgICAgICBhY2Nba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHRhcmdldCk7XG59O1xuXG52YXIgZGVjb2RlID0gZnVuY3Rpb24gKHN0ciwgZGVjb2RlciwgY2hhcnNldCkge1xuICAgIHZhciBzdHJXaXRob3V0UGx1cyA9IHN0ci5yZXBsYWNlKC9cXCsvZywgJyAnKTtcbiAgICBpZiAoY2hhcnNldCA9PT0gJ2lzby04ODU5LTEnKSB7XG4gICAgICAgIC8vIHVuZXNjYXBlIG5ldmVyIHRocm93cywgbm8gdHJ5Li4uY2F0Y2ggbmVlZGVkOlxuICAgICAgICByZXR1cm4gc3RyV2l0aG91dFBsdXMucmVwbGFjZSgvJVswLTlhLWZdezJ9L2dpLCB1bmVzY2FwZSk7XG4gICAgfVxuICAgIC8vIHV0Zi04XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHJXaXRob3V0UGx1cyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gc3RyV2l0aG91dFBsdXM7XG4gICAgfVxufTtcblxudmFyIGxpbWl0ID0gMTAyNDtcblxuLyogZXNsaW50IG9wZXJhdG9yLWxpbmVicmVhazogWzIsIFwiYmVmb3JlXCJdICovXG5cbnZhciBlbmNvZGUgPSBmdW5jdGlvbiBlbmNvZGUoc3RyLCBkZWZhdWx0RW5jb2RlciwgY2hhcnNldCwga2luZCwgZm9ybWF0KSB7XG4gICAgLy8gVGhpcyBjb2RlIHdhcyBvcmlnaW5hbGx5IHdyaXR0ZW4gYnkgQnJpYW4gV2hpdGUgKG1zY2RleCkgZm9yIHRoZSBpby5qcyBjb3JlIHF1ZXJ5c3RyaW5nIGxpYnJhcnkuXG4gICAgLy8gSXQgaGFzIGJlZW4gYWRhcHRlZCBoZXJlIGZvciBzdHJpY3RlciBhZGhlcmVuY2UgdG8gUkZDIDM5ODZcbiAgICBpZiAoc3RyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cblxuICAgIHZhciBzdHJpbmcgPSBzdHI7XG4gICAgaWYgKHR5cGVvZiBzdHIgPT09ICdzeW1ib2wnKSB7XG4gICAgICAgIHN0cmluZyA9IFN5bWJvbC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdHIpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3RyaW5nID0gU3RyaW5nKHN0cik7XG4gICAgfVxuXG4gICAgaWYgKGNoYXJzZXQgPT09ICdpc28tODg1OS0xJykge1xuICAgICAgICByZXR1cm4gZXNjYXBlKHN0cmluZykucmVwbGFjZSgvJXVbMC05YS1mXXs0fS9naSwgZnVuY3Rpb24gKCQwKSB7XG4gICAgICAgICAgICByZXR1cm4gJyUyNiUyMycgKyBwYXJzZUludCgkMC5zbGljZSgyKSwgMTYpICsgJyUzQic7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBvdXQgPSAnJztcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0cmluZy5sZW5ndGg7IGogKz0gbGltaXQpIHtcbiAgICAgICAgdmFyIHNlZ21lbnQgPSBzdHJpbmcubGVuZ3RoID49IGxpbWl0ID8gc3RyaW5nLnNsaWNlKGosIGogKyBsaW1pdCkgOiBzdHJpbmc7XG4gICAgICAgIHZhciBhcnIgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlZ21lbnQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBjID0gc2VnbWVudC5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGMgPT09IDB4MkQgLy8gLVxuICAgICAgICAgICAgICAgIHx8IGMgPT09IDB4MkUgLy8gLlxuICAgICAgICAgICAgICAgIHx8IGMgPT09IDB4NUYgLy8gX1xuICAgICAgICAgICAgICAgIHx8IGMgPT09IDB4N0UgLy8gflxuICAgICAgICAgICAgICAgIHx8IChjID49IDB4MzAgJiYgYyA8PSAweDM5KSAvLyAwLTlcbiAgICAgICAgICAgICAgICB8fCAoYyA+PSAweDQxICYmIGMgPD0gMHg1QSkgLy8gYS16XG4gICAgICAgICAgICAgICAgfHwgKGMgPj0gMHg2MSAmJiBjIDw9IDB4N0EpIC8vIEEtWlxuICAgICAgICAgICAgICAgIHx8IChmb3JtYXQgPT09IGZvcm1hdHMuUkZDMTczOCAmJiAoYyA9PT0gMHgyOCB8fCBjID09PSAweDI5KSkgLy8gKCApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBhcnJbYXJyLmxlbmd0aF0gPSBzZWdtZW50LmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGMgPCAweDgwKSB7XG4gICAgICAgICAgICAgICAgYXJyW2Fyci5sZW5ndGhdID0gaGV4VGFibGVbY107XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjIDwgMHg4MDApIHtcbiAgICAgICAgICAgICAgICBhcnJbYXJyLmxlbmd0aF0gPSBoZXhUYWJsZVsweEMwIHwgKGMgPj4gNildXG4gICAgICAgICAgICAgICAgICAgICsgaGV4VGFibGVbMHg4MCB8IChjICYgMHgzRildO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYyA8IDB4RDgwMCB8fCBjID49IDB4RTAwMCkge1xuICAgICAgICAgICAgICAgIGFyclthcnIubGVuZ3RoXSA9IGhleFRhYmxlWzB4RTAgfCAoYyA+PiAxMildXG4gICAgICAgICAgICAgICAgICAgICsgaGV4VGFibGVbMHg4MCB8ICgoYyA+PiA2KSAmIDB4M0YpXVxuICAgICAgICAgICAgICAgICAgICArIGhleFRhYmxlWzB4ODAgfCAoYyAmIDB4M0YpXTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgYyA9IDB4MTAwMDAgKyAoKChjICYgMHgzRkYpIDw8IDEwKSB8IChzZWdtZW50LmNoYXJDb2RlQXQoaSkgJiAweDNGRikpO1xuXG4gICAgICAgICAgICBhcnJbYXJyLmxlbmd0aF0gPSBoZXhUYWJsZVsweEYwIHwgKGMgPj4gMTgpXVxuICAgICAgICAgICAgICAgICsgaGV4VGFibGVbMHg4MCB8ICgoYyA+PiAxMikgJiAweDNGKV1cbiAgICAgICAgICAgICAgICArIGhleFRhYmxlWzB4ODAgfCAoKGMgPj4gNikgJiAweDNGKV1cbiAgICAgICAgICAgICAgICArIGhleFRhYmxlWzB4ODAgfCAoYyAmIDB4M0YpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dCArPSBhcnIuam9pbignJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG91dDtcbn07XG5cbnZhciBjb21wYWN0ID0gZnVuY3Rpb24gY29tcGFjdCh2YWx1ZSkge1xuICAgIHZhciBxdWV1ZSA9IFt7IG9iajogeyBvOiB2YWx1ZSB9LCBwcm9wOiAnbycgfV07XG4gICAgdmFyIHJlZnMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBxdWV1ZVtpXTtcbiAgICAgICAgdmFyIG9iaiA9IGl0ZW0ub2JqW2l0ZW0ucHJvcF07XG5cbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGtleXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2pdO1xuICAgICAgICAgICAgdmFyIHZhbCA9IG9ialtrZXldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmIHZhbCAhPT0gbnVsbCAmJiByZWZzLmluZGV4T2YodmFsKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBxdWV1ZS5wdXNoKHsgb2JqOiBvYmosIHByb3A6IGtleSB9KTtcbiAgICAgICAgICAgICAgICByZWZzLnB1c2godmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbXBhY3RRdWV1ZShxdWV1ZSk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG59O1xuXG52YXIgaXNSZWdFeHAgPSBmdW5jdGlvbiBpc1JlZ0V4cChvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufTtcblxudmFyIGlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIob2JqKSB7XG4gICAgaWYgKCFvYmogfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiAhIShvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopKTtcbn07XG5cbnZhciBjb21iaW5lID0gZnVuY3Rpb24gY29tYmluZShhLCBiKSB7XG4gICAgcmV0dXJuIFtdLmNvbmNhdChhLCBiKTtcbn07XG5cbnZhciBtYXliZU1hcCA9IGZ1bmN0aW9uIG1heWJlTWFwKHZhbCwgZm4pIHtcbiAgICBpZiAoaXNBcnJheSh2YWwpKSB7XG4gICAgICAgIHZhciBtYXBwZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWwubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIG1hcHBlZC5wdXNoKGZuKHZhbFtpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXBwZWQ7XG4gICAgfVxuICAgIHJldHVybiBmbih2YWwpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYXJyYXlUb09iamVjdDogYXJyYXlUb09iamVjdCxcbiAgICBhc3NpZ246IGFzc2lnbixcbiAgICBjb21iaW5lOiBjb21iaW5lLFxuICAgIGNvbXBhY3Q6IGNvbXBhY3QsXG4gICAgZGVjb2RlOiBkZWNvZGUsXG4gICAgZW5jb2RlOiBlbmNvZGUsXG4gICAgaXNCdWZmZXI6IGlzQnVmZmVyLFxuICAgIGlzUmVnRXhwOiBpc1JlZ0V4cCxcbiAgICBtYXliZU1hcDogbWF5YmVNYXAsXG4gICAgbWVyZ2U6IG1lcmdlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgR2V0SW50cmluc2ljID0gcmVxdWlyZSgnZ2V0LWludHJpbnNpYycpO1xudmFyIGRlZmluZSA9IHJlcXVpcmUoJ2RlZmluZS1kYXRhLXByb3BlcnR5Jyk7XG52YXIgaGFzRGVzY3JpcHRvcnMgPSByZXF1aXJlKCdoYXMtcHJvcGVydHktZGVzY3JpcHRvcnMnKSgpO1xudmFyIGdPUEQgPSByZXF1aXJlKCdnb3BkJyk7XG5cbnZhciAkVHlwZUVycm9yID0gcmVxdWlyZSgnZXMtZXJyb3JzL3R5cGUnKTtcbnZhciAkZmxvb3IgPSBHZXRJbnRyaW5zaWMoJyVNYXRoLmZsb29yJScpO1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXRGdW5jdGlvbkxlbmd0aChmbiwgbGVuZ3RoKSB7XG5cdGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcblx0XHR0aHJvdyBuZXcgJFR5cGVFcnJvcignYGZuYCBpcyBub3QgYSBmdW5jdGlvbicpO1xuXHR9XG5cdGlmICh0eXBlb2YgbGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBsZW5ndGggPCAwIHx8IGxlbmd0aCA+IDB4RkZGRkZGRkYgfHwgJGZsb29yKGxlbmd0aCkgIT09IGxlbmd0aCkge1xuXHRcdHRocm93IG5ldyAkVHlwZUVycm9yKCdgbGVuZ3RoYCBtdXN0IGJlIGEgcG9zaXRpdmUgMzItYml0IGludGVnZXInKTtcblx0fVxuXG5cdHZhciBsb29zZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmICEhYXJndW1lbnRzWzJdO1xuXG5cdHZhciBmdW5jdGlvbkxlbmd0aElzQ29uZmlndXJhYmxlID0gdHJ1ZTtcblx0dmFyIGZ1bmN0aW9uTGVuZ3RoSXNXcml0YWJsZSA9IHRydWU7XG5cdGlmICgnbGVuZ3RoJyBpbiBmbiAmJiBnT1BEKSB7XG5cdFx0dmFyIGRlc2MgPSBnT1BEKGZuLCAnbGVuZ3RoJyk7XG5cdFx0aWYgKGRlc2MgJiYgIWRlc2MuY29uZmlndXJhYmxlKSB7XG5cdFx0XHRmdW5jdGlvbkxlbmd0aElzQ29uZmlndXJhYmxlID0gZmFsc2U7XG5cdFx0fVxuXHRcdGlmIChkZXNjICYmICFkZXNjLndyaXRhYmxlKSB7XG5cdFx0XHRmdW5jdGlvbkxlbmd0aElzV3JpdGFibGUgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRpZiAoZnVuY3Rpb25MZW5ndGhJc0NvbmZpZ3VyYWJsZSB8fCBmdW5jdGlvbkxlbmd0aElzV3JpdGFibGUgfHwgIWxvb3NlKSB7XG5cdFx0aWYgKGhhc0Rlc2NyaXB0b3JzKSB7XG5cdFx0XHRkZWZpbmUoLyoqIEB0eXBlIHtQYXJhbWV0ZXJzPGRlZmluZT5bMF19ICovIChmbiksICdsZW5ndGgnLCBsZW5ndGgsIHRydWUsIHRydWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZWZpbmUoLyoqIEB0eXBlIHtQYXJhbWV0ZXJzPGRlZmluZT5bMF19ICovIChmbiksICdsZW5ndGgnLCBsZW5ndGgpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZm47XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgR2V0SW50cmluc2ljID0gcmVxdWlyZSgnZ2V0LWludHJpbnNpYycpO1xudmFyIGNhbGxCb3VuZCA9IHJlcXVpcmUoJ2NhbGwtYmluZC9jYWxsQm91bmQnKTtcbnZhciBpbnNwZWN0ID0gcmVxdWlyZSgnb2JqZWN0LWluc3BlY3QnKTtcblxudmFyICRUeXBlRXJyb3IgPSByZXF1aXJlKCdlcy1lcnJvcnMvdHlwZScpO1xudmFyICRXZWFrTWFwID0gR2V0SW50cmluc2ljKCclV2Vha01hcCUnLCB0cnVlKTtcbnZhciAkTWFwID0gR2V0SW50cmluc2ljKCclTWFwJScsIHRydWUpO1xuXG52YXIgJHdlYWtNYXBHZXQgPSBjYWxsQm91bmQoJ1dlYWtNYXAucHJvdG90eXBlLmdldCcsIHRydWUpO1xudmFyICR3ZWFrTWFwU2V0ID0gY2FsbEJvdW5kKCdXZWFrTWFwLnByb3RvdHlwZS5zZXQnLCB0cnVlKTtcbnZhciAkd2Vha01hcEhhcyA9IGNhbGxCb3VuZCgnV2Vha01hcC5wcm90b3R5cGUuaGFzJywgdHJ1ZSk7XG52YXIgJG1hcEdldCA9IGNhbGxCb3VuZCgnTWFwLnByb3RvdHlwZS5nZXQnLCB0cnVlKTtcbnZhciAkbWFwU2V0ID0gY2FsbEJvdW5kKCdNYXAucHJvdG90eXBlLnNldCcsIHRydWUpO1xudmFyICRtYXBIYXMgPSBjYWxsQm91bmQoJ01hcC5wcm90b3R5cGUuaGFzJywgdHJ1ZSk7XG5cbi8qXG4qIFRoaXMgZnVuY3Rpb24gdHJhdmVyc2VzIHRoZSBsaXN0IHJldHVybmluZyB0aGUgbm9kZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlbiBrZXkuXG4qXG4qIFRoYXQgbm9kZSBpcyBhbHNvIG1vdmVkIHRvIHRoZSBoZWFkIG9mIHRoZSBsaXN0LCBzbyB0aGF0IGlmIGl0J3MgYWNjZXNzZWQgYWdhaW4gd2UgZG9uJ3QgbmVlZCB0byB0cmF2ZXJzZSB0aGUgd2hvbGUgbGlzdC4gQnkgZG9pbmcgc28sIGFsbCB0aGUgcmVjZW50bHkgdXNlZCBub2RlcyBjYW4gYmUgYWNjZXNzZWQgcmVsYXRpdmVseSBxdWlja2x5LlxuKi9cbi8qKiBAdHlwZSB7aW1wb3J0KCcuJykubGlzdEdldE5vZGV9ICovXG52YXIgbGlzdEdldE5vZGUgPSBmdW5jdGlvbiAobGlzdCwga2V5KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cblx0LyoqIEB0eXBlIHt0eXBlb2YgbGlzdCB8IE5vbk51bGxhYmxlPCh0eXBlb2YgbGlzdClbJ25leHQnXT59ICovXG5cdHZhciBwcmV2ID0gbGlzdDtcblx0LyoqIEB0eXBlIHsodHlwZW9mIGxpc3QpWyduZXh0J119ICovXG5cdHZhciBjdXJyO1xuXHRmb3IgKDsgKGN1cnIgPSBwcmV2Lm5leHQpICE9PSBudWxsOyBwcmV2ID0gY3Vycikge1xuXHRcdGlmIChjdXJyLmtleSA9PT0ga2V5KSB7XG5cdFx0XHRwcmV2Lm5leHQgPSBjdXJyLm5leHQ7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtcGFyZW5zXG5cdFx0XHRjdXJyLm5leHQgPSAvKiogQHR5cGUge05vbk51bGxhYmxlPHR5cGVvZiBsaXN0Lm5leHQ+fSAqLyAobGlzdC5uZXh0KTtcblx0XHRcdGxpc3QubmV4dCA9IGN1cnI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cblx0XHRcdHJldHVybiBjdXJyO1xuXHRcdH1cblx0fVxufTtcblxuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKS5saXN0R2V0fSAqL1xudmFyIGxpc3RHZXQgPSBmdW5jdGlvbiAob2JqZWN0cywga2V5KSB7XG5cdHZhciBub2RlID0gbGlzdEdldE5vZGUob2JqZWN0cywga2V5KTtcblx0cmV0dXJuIG5vZGUgJiYgbm9kZS52YWx1ZTtcbn07XG4vKiogQHR5cGUge2ltcG9ydCgnLicpLmxpc3RTZXR9ICovXG52YXIgbGlzdFNldCA9IGZ1bmN0aW9uIChvYmplY3RzLCBrZXksIHZhbHVlKSB7XG5cdHZhciBub2RlID0gbGlzdEdldE5vZGUob2JqZWN0cywga2V5KTtcblx0aWYgKG5vZGUpIHtcblx0XHRub2RlLnZhbHVlID0gdmFsdWU7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gUHJlcGVuZCB0aGUgbmV3IG5vZGUgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgbGlzdFxuXHRcdG9iamVjdHMubmV4dCA9IC8qKiBAdHlwZSB7aW1wb3J0KCcuJykuTGlzdE5vZGU8dHlwZW9mIHZhbHVlPn0gKi8gKHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1wYXJhbS1yZWFzc2lnbiwgbm8tZXh0cmEtcGFyZW5zXG5cdFx0XHRrZXk6IGtleSxcblx0XHRcdG5leHQ6IG9iamVjdHMubmV4dCxcblx0XHRcdHZhbHVlOiB2YWx1ZVxuXHRcdH0pO1xuXHR9XG59O1xuLyoqIEB0eXBlIHtpbXBvcnQoJy4nKS5saXN0SGFzfSAqL1xudmFyIGxpc3RIYXMgPSBmdW5jdGlvbiAob2JqZWN0cywga2V5KSB7XG5cdHJldHVybiAhIWxpc3RHZXROb2RlKG9iamVjdHMsIGtleSk7XG59O1xuXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRTaWRlQ2hhbm5lbCgpIHtcblx0LyoqIEB0eXBlIHtXZWFrTWFwPG9iamVjdCwgdW5rbm93bj59ICovIHZhciAkd207XG5cdC8qKiBAdHlwZSB7TWFwPG9iamVjdCwgdW5rbm93bj59ICovIHZhciAkbTtcblx0LyoqIEB0eXBlIHtpbXBvcnQoJy4nKS5Sb290Tm9kZTx1bmtub3duPn0gKi8gdmFyICRvO1xuXG5cdC8qKiBAdHlwZSB7aW1wb3J0KCcuJykuQ2hhbm5lbH0gKi9cblx0dmFyIGNoYW5uZWwgPSB7XG5cdFx0YXNzZXJ0OiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRpZiAoIWNoYW5uZWwuaGFzKGtleSkpIHtcblx0XHRcdFx0dGhyb3cgbmV3ICRUeXBlRXJyb3IoJ1NpZGUgY2hhbm5lbCBkb2VzIG5vdCBjb250YWluICcgKyBpbnNwZWN0KGtleSkpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Z2V0OiBmdW5jdGlvbiAoa2V5KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cblx0XHRcdGlmICgkV2Vha01hcCAmJiBrZXkgJiYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdGlmICgkd20pIHtcblx0XHRcdFx0XHRyZXR1cm4gJHdlYWtNYXBHZXQoJHdtLCBrZXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCRNYXApIHtcblx0XHRcdFx0aWYgKCRtKSB7XG5cdFx0XHRcdFx0cmV0dXJuICRtYXBHZXQoJG0sIGtleSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICgkbykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmVseS1pZlxuXHRcdFx0XHRcdHJldHVybiBsaXN0R2V0KCRvLCBrZXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRoYXM6IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdGlmICgkV2Vha01hcCAmJiBrZXkgJiYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBrZXkgPT09ICdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdGlmICgkd20pIHtcblx0XHRcdFx0XHRyZXR1cm4gJHdlYWtNYXBIYXMoJHdtLCBrZXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKCRNYXApIHtcblx0XHRcdFx0aWYgKCRtKSB7XG5cdFx0XHRcdFx0cmV0dXJuICRtYXBIYXMoJG0sIGtleSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICgkbykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmVseS1pZlxuXHRcdFx0XHRcdHJldHVybiBsaXN0SGFzKCRvLCBrZXkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblx0XHRzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0XHRpZiAoJFdlYWtNYXAgJiYga2V5ICYmICh0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyB8fCB0eXBlb2Yga2V5ID09PSAnZnVuY3Rpb24nKSkge1xuXHRcdFx0XHRpZiAoISR3bSkge1xuXHRcdFx0XHRcdCR3bSA9IG5ldyAkV2Vha01hcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCR3ZWFrTWFwU2V0KCR3bSwga2V5LCB2YWx1ZSk7XG5cdFx0XHR9IGVsc2UgaWYgKCRNYXApIHtcblx0XHRcdFx0aWYgKCEkbSkge1xuXHRcdFx0XHRcdCRtID0gbmV3ICRNYXAoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQkbWFwU2V0KCRtLCBrZXksIHZhbHVlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghJG8pIHtcblx0XHRcdFx0XHQvLyBJbml0aWFsaXplIHRoZSBsaW5rZWQgbGlzdCBhcyBhbiBlbXB0eSBub2RlLCBzbyB0aGF0IHdlIGRvbid0IGhhdmUgdG8gc3BlY2lhbC1jYXNlIGhhbmRsaW5nIG9mIHRoZSBmaXJzdCBub2RlOiB3ZSBjYW4gYWx3YXlzIHJlZmVyIHRvIGl0IGFzIChwcmV2aW91cyBub2RlKS5uZXh0LCBpbnN0ZWFkIG9mIHNvbWV0aGluZyBsaWtlIChsaXN0KS5oZWFkXG5cdFx0XHRcdFx0JG8gPSB7IGtleToge30sIG5leHQ6IG51bGwgfTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0U2V0KCRvLCBrZXksIHZhbHVlKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBjaGFubmVsO1xufTtcbiIsImNvbnN0IGRlZmF1bHRzID0gW1xuICAndXNlJyxcbiAgJ29uJyxcbiAgJ29uY2UnLFxuICAnc2V0JyxcbiAgJ3F1ZXJ5JyxcbiAgJ3R5cGUnLFxuICAnYWNjZXB0JyxcbiAgJ2F1dGgnLFxuICAnd2l0aENyZWRlbnRpYWxzJyxcbiAgJ3NvcnRRdWVyeScsXG4gICdyZXRyeScsXG4gICdvaycsXG4gICdyZWRpcmVjdHMnLFxuICAndGltZW91dCcsXG4gICdidWZmZXInLFxuICAnc2VyaWFsaXplJyxcbiAgJ3BhcnNlJyxcbiAgJ2NhJyxcbiAgJ2tleScsXG4gICdwZngnLFxuICAnY2VydCcsXG4gICdkaXNhYmxlVExTQ2VydHMnXG5dXG5cbmNsYXNzIEFnZW50IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuX2RlZmF1bHRzID0gW107XG4gIH1cblxuICBfc2V0RGVmYXVsdHMgKHJlcXVlc3QpIHtcbiAgICBmb3IgKGNvbnN0IGRlZiBvZiB0aGlzLl9kZWZhdWx0cykge1xuICAgICAgcmVxdWVzdFtkZWYuZm5dKC4uLmRlZi5hcmdzKTtcbiAgICB9XG4gIH1cbn1cblxuZm9yIChjb25zdCBmbiBvZiBkZWZhdWx0cykge1xuICAvLyBEZWZhdWx0IHNldHRpbmcgZm9yIGFsbCByZXF1ZXN0cyBmcm9tIHRoaXMgYWdlbnRcbiAgQWdlbnQucHJvdG90eXBlW2ZuXSA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgdGhpcy5fZGVmYXVsdHMucHVzaCh7IGZuLCBhcmdzIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gQWdlbnQ7XG4iLCIvKipcbiAqIFJvb3QgcmVmZXJlbmNlIGZvciBpZnJhbWVzLlxuICovXG5cbmxldCByb290O1xuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIC8vIEJyb3dzZXIgd2luZG93XG4gIHJvb3QgPSB3aW5kb3c7XG59IGVsc2UgaWYgKHR5cGVvZiBzZWxmID09PSAndW5kZWZpbmVkJykge1xuICAvLyBPdGhlciBlbnZpcm9ubWVudHNcbiAgY29uc29sZS53YXJuKFxuICAgICdVc2luZyBicm93c2VyLW9ubHkgdmVyc2lvbiBvZiBzdXBlcmFnZW50IGluIG5vbi1icm93c2VyIGVudmlyb25tZW50J1xuICApO1xuICByb290ID0gdGhpcztcbn0gZWxzZSB7XG4gIC8vIFdlYiBXb3JrZXJcbiAgcm9vdCA9IHNlbGY7XG59XG5cbmNvbnN0IEVtaXR0ZXIgPSByZXF1aXJlKCdjb21wb25lbnQtZW1pdHRlcicpO1xuY29uc3Qgc2FmZVN0cmluZ2lmeSA9IHJlcXVpcmUoJ2Zhc3Qtc2FmZS1zdHJpbmdpZnknKTtcbmNvbnN0IHFzID0gcmVxdWlyZSgncXMnKTtcbmNvbnN0IFJlcXVlc3RCYXNlID0gcmVxdWlyZSgnLi9yZXF1ZXN0LWJhc2UnKTtcbmNvbnN0IHsgaXNPYmplY3QsIG1peGluLCBoYXNPd24gfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbmNvbnN0IFJlc3BvbnNlQmFzZSA9IHJlcXVpcmUoJy4vcmVzcG9uc2UtYmFzZScpO1xuY29uc3QgQWdlbnQgPSByZXF1aXJlKCcuL2FnZW50LWJhc2UnKTtcblxuLyoqXG4gKiBOb29wLlxuICovXG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4vKipcbiAqIEV4cG9zZSBgcmVxdWVzdGAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWV0aG9kLCB1cmwpIHtcbiAgLy8gY2FsbGJhY2tcbiAgaWYgKHR5cGVvZiB1cmwgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gbmV3IGV4cG9ydHMuUmVxdWVzdCgnR0VUJywgbWV0aG9kKS5lbmQodXJsKTtcbiAgfVxuXG4gIC8vIHVybCBmaXJzdFxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBuZXcgZXhwb3J0cy5SZXF1ZXN0KCdHRVQnLCBtZXRob2QpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBleHBvcnRzLlJlcXVlc3QobWV0aG9kLCB1cmwpO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzO1xuXG5jb25zdCByZXF1ZXN0ID0gZXhwb3J0cztcblxuZXhwb3J0cy5SZXF1ZXN0ID0gUmVxdWVzdDtcblxuLyoqXG4gKiBEZXRlcm1pbmUgWEhSLlxuICovXG5cbnJlcXVlc3QuZ2V0WEhSID0gKCkgPT4ge1xuICBpZiAocm9vdC5YTUxIdHRwUmVxdWVzdCkge1xuICAgIHJldHVybiBuZXcgcm9vdC5YTUxIdHRwUmVxdWVzdCgpO1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKCdCcm93c2VyLW9ubHkgdmVyc2lvbiBvZiBzdXBlcmFnZW50IGNvdWxkIG5vdCBmaW5kIFhIUicpO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UsIGFkZGVkIHRvIHN1cHBvcnQgSUUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmNvbnN0IHRyaW0gPSAnJy50cmltID8gKHMpID0+IHMudHJpbSgpIDogKHMpID0+IHMucmVwbGFjZSgvKF5cXHMqfFxccyokKS9nLCAnJyk7XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBnaXZlbiBgb2JqYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBzZXJpYWxpemUob2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkgcmV0dXJuIG9iamVjdDtcbiAgY29uc3QgcGFpcnMgPSBbXTtcbiAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKGhhc093bihvYmplY3QsIGtleSkpIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBrZXksIG9iamVjdFtrZXldKTtcbiAgfVxuXG4gIHJldHVybiBwYWlycy5qb2luKCcmJyk7XG59XG5cbi8qKlxuICogSGVscHMgJ3NlcmlhbGl6ZScgd2l0aCBzZXJpYWxpemluZyBhcnJheXMuXG4gKiBNdXRhdGVzIHRoZSBwYWlycyBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBwYWlyc1xuICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKi9cblxuZnVuY3Rpb24gcHVzaEVuY29kZWRLZXlWYWx1ZVBhaXIocGFpcnMsIGtleSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgcGFpcnMucHVzaChlbmNvZGVVUkkoa2V5KSk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgZm9yIChjb25zdCB2IG9mIHZhbHVlKSB7XG4gICAgICBwdXNoRW5jb2RlZEtleVZhbHVlUGFpcihwYWlycywga2V5LCB2KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgZm9yIChjb25zdCBzdWJrZXkgaW4gdmFsdWUpIHtcbiAgICAgIGlmIChoYXNPd24odmFsdWUsIHN1YmtleSkpXG4gICAgICAgIHB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyKHBhaXJzLCBgJHtrZXl9WyR7c3Via2V5fV1gLCB2YWx1ZVtzdWJrZXldKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFpcnMucHVzaChlbmNvZGVVUkkoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuICB9XG59XG5cbi8qKlxuICogRXhwb3NlIHNlcmlhbGl6YXRpb24gbWV0aG9kLlxuICovXG5cbnJlcXVlc3Quc2VyaWFsaXplT2JqZWN0ID0gc2VyaWFsaXplO1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiB4LXd3dy1mb3JtLXVybGVuY29kZWQgYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyaW5nXykge1xuICBjb25zdCBvYmplY3QgPSB7fTtcbiAgY29uc3QgcGFpcnMgPSBzdHJpbmdfLnNwbGl0KCcmJyk7XG4gIGxldCBwYWlyO1xuICBsZXQgcG9zO1xuXG4gIGZvciAobGV0IGkgPSAwLCBsZW5ndGhfID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuZ3RoXzsgKytpKSB7XG4gICAgcGFpciA9IHBhaXJzW2ldO1xuICAgIHBvcyA9IHBhaXIuaW5kZXhPZignPScpO1xuICAgIGlmIChwb3MgPT09IC0xKSB7XG4gICAgICBvYmplY3RbZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIpXSA9ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3RbZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIuc2xpY2UoMCwgcG9zKSldID0gZGVjb2RlVVJJQ29tcG9uZW50KFxuICAgICAgICBwYWlyLnNsaWNlKHBvcyArIDEpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmplY3Q7XG59XG5cbi8qKlxuICogRXhwb3NlIHBhcnNlci5cbiAqL1xuXG5yZXF1ZXN0LnBhcnNlU3RyaW5nID0gcGFyc2VTdHJpbmc7XG5cbi8qKlxuICogRGVmYXVsdCBNSU1FIHR5cGUgbWFwLlxuICpcbiAqICAgICBzdXBlcmFnZW50LnR5cGVzLnhtbCA9ICdhcHBsaWNhdGlvbi94bWwnO1xuICpcbiAqL1xuXG5yZXF1ZXN0LnR5cGVzID0ge1xuICBodG1sOiAndGV4dC9odG1sJyxcbiAganNvbjogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICB4bWw6ICd0ZXh0L3htbCcsXG4gIHVybGVuY29kZWQ6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICBmb3JtOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyxcbiAgJ2Zvcm0tZGF0YSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG4vKipcbiAqIERlZmF1bHQgc2VyaWFsaXphdGlvbiBtYXAuXG4gKlxuICogICAgIHN1cGVyYWdlbnQuc2VyaWFsaXplWydhcHBsaWNhdGlvbi94bWwnXSA9IGZ1bmN0aW9uKG9iail7XG4gKiAgICAgICByZXR1cm4gJ2dlbmVyYXRlZCB4bWwgaGVyZSc7XG4gKiAgICAgfTtcbiAqXG4gKi9cblxucmVxdWVzdC5zZXJpYWxpemUgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiAob2JqKSA9PiB7XG4gICAgcmV0dXJuIHFzLnN0cmluZ2lmeShvYmosIHsgaW5kaWNlczogZmFsc2UsIHN0cmljdE51bGxIYW5kbGluZzogdHJ1ZSB9KTtcbiAgfSxcbiAgJ2FwcGxpY2F0aW9uL2pzb24nOiBzYWZlU3RyaW5naWZ5XG59O1xuXG4vKipcbiAqIERlZmF1bHQgcGFyc2Vycy5cbiAqXG4gKiAgICAgc3VwZXJhZ2VudC5wYXJzZVsnYXBwbGljYXRpb24veG1sJ10gPSBmdW5jdGlvbihzdHIpe1xuICogICAgICAgcmV0dXJuIHsgb2JqZWN0IHBhcnNlZCBmcm9tIHN0ciB9O1xuICogICAgIH07XG4gKlxuICovXG5cbnJlcXVlc3QucGFyc2UgPSB7XG4gICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnOiBwYXJzZVN0cmluZyxcbiAgJ2FwcGxpY2F0aW9uL2pzb24nOiBKU09OLnBhcnNlXG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBoZWFkZXIgYHN0cmAgaW50b1xuICogYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1hcHBlZCBmaWVsZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXIoc3RyaW5nXykge1xuICBjb25zdCBsaW5lcyA9IHN0cmluZ18uc3BsaXQoL1xccj9cXG4vKTtcbiAgY29uc3QgZmllbGRzID0ge307XG4gIGxldCBpbmRleDtcbiAgbGV0IGxpbmU7XG4gIGxldCBmaWVsZDtcbiAgbGV0IHZhbHVlO1xuXG4gIGZvciAobGV0IGkgPSAwLCBsZW5ndGhfID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuZ3RoXzsgKytpKSB7XG4gICAgbGluZSA9IGxpbmVzW2ldO1xuICAgIGluZGV4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgLy8gY291bGQgYmUgZW1wdHkgbGluZSwganVzdCBza2lwIGl0XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBmaWVsZCA9IGxpbmUuc2xpY2UoMCwgaW5kZXgpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFsdWUgPSB0cmltKGxpbmUuc2xpY2UoaW5kZXggKyAxKSk7XG4gICAgZmllbGRzW2ZpZWxkXSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGZpZWxkcztcbn1cblxuLyoqXG4gKiBDaGVjayBpZiBgbWltZWAgaXMganNvbiBvciBoYXMgK2pzb24gc3RydWN0dXJlZCBzeW50YXggc3VmZml4LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtaW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaXNKU09OKG1pbWUpIHtcbiAgLy8gc2hvdWxkIG1hdGNoIC9qc29uIG9yICtqc29uXG4gIC8vIGJ1dCBub3QgL2pzb24tc2VxXG4gIHJldHVybiAvWy8rXWpzb24oJHxbXi1cXHddKS9pLnRlc3QobWltZSk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVzcG9uc2VgIHdpdGggdGhlIGdpdmVuIGB4aHJgLlxuICpcbiAqICAtIHNldCBmbGFncyAoLm9rLCAuZXJyb3IsIGV0YylcbiAqICAtIHBhcnNlIGhlYWRlclxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICBBbGlhc2luZyBgc3VwZXJhZ2VudGAgYXMgYHJlcXVlc3RgIGlzIG5pY2U6XG4gKlxuICogICAgICByZXF1ZXN0ID0gc3VwZXJhZ2VudDtcbiAqXG4gKiAgV2UgY2FuIHVzZSB0aGUgcHJvbWlzZS1saWtlIEFQSSwgb3IgcGFzcyBjYWxsYmFja3M6XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnLycpLmVuZChmdW5jdGlvbihyZXMpe30pO1xuICogICAgICByZXF1ZXN0LmdldCgnLycsIGZ1bmN0aW9uKHJlcyl7fSk7XG4gKlxuICogIFNlbmRpbmcgZGF0YSBjYW4gYmUgY2hhaW5lZDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiAgT3IgcGFzc2VkIHRvIGAuc2VuZCgpYDpcbiAqXG4gKiAgICAgIHJlcXVlc3RcbiAqICAgICAgICAucG9zdCgnL3VzZXInKVxuICogICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqICBPciBwYXNzZWQgdG8gYC5wb3N0KClgOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgIC5lbmQoZnVuY3Rpb24ocmVzKXt9KTtcbiAqXG4gKiBPciBmdXJ0aGVyIHJlZHVjZWQgdG8gYSBzaW5nbGUgY2FsbCBmb3Igc2ltcGxlIGNhc2VzOlxuICpcbiAqICAgICAgcmVxdWVzdFxuICogICAgICAgIC5wb3N0KCcvdXNlcicsIHsgbmFtZTogJ3RqJyB9LCBmdW5jdGlvbihyZXMpe30pO1xuICpcbiAqIEBwYXJhbSB7WE1MSFRUUFJlcXVlc3R9IHhoclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIFJlc3BvbnNlKHJlcXVlc3RfKSB7XG4gIHRoaXMucmVxID0gcmVxdWVzdF87XG4gIHRoaXMueGhyID0gdGhpcy5yZXEueGhyO1xuICAvLyByZXNwb25zZVRleHQgaXMgYWNjZXNzaWJsZSBvbmx5IGlmIHJlc3BvbnNlVHlwZSBpcyAnJyBvciAndGV4dCcgYW5kIG9uIG9sZGVyIGJyb3dzZXJzXG4gIHRoaXMudGV4dCA9XG4gICAgKHRoaXMucmVxLm1ldGhvZCAhPT0gJ0hFQUQnICYmXG4gICAgICAodGhpcy54aHIucmVzcG9uc2VUeXBlID09PSAnJyB8fCB0aGlzLnhoci5yZXNwb25zZVR5cGUgPT09ICd0ZXh0JykpIHx8XG4gICAgdHlwZW9mIHRoaXMueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgID8gdGhpcy54aHIucmVzcG9uc2VUZXh0XG4gICAgICA6IG51bGw7XG4gIHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMucmVxLnhoci5zdGF0dXNUZXh0O1xuICBsZXQgeyBzdGF0dXMgfSA9IHRoaXMueGhyO1xuICAvLyBoYW5kbGUgSUU5IGJ1ZzogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDA0Njk3Mi9tc2llLXJldHVybnMtc3RhdHVzLWNvZGUtb2YtMTIyMy1mb3ItYWpheC1yZXF1ZXN0XG4gIGlmIChzdGF0dXMgPT09IDEyMjMpIHtcbiAgICBzdGF0dXMgPSAyMDQ7XG4gIH1cblxuICB0aGlzLl9zZXRTdGF0dXNQcm9wZXJ0aWVzKHN0YXR1cyk7XG4gIHRoaXMuaGVhZGVycyA9IHBhcnNlSGVhZGVyKHRoaXMueGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgdGhpcy5oZWFkZXIgPSB0aGlzLmhlYWRlcnM7XG4gIC8vIGdldEFsbFJlc3BvbnNlSGVhZGVycyBzb21ldGltZXMgZmFsc2VseSByZXR1cm5zIFwiXCIgZm9yIENPUlMgcmVxdWVzdHMsIGJ1dFxuICAvLyBnZXRSZXNwb25zZUhlYWRlciBzdGlsbCB3b3Jrcy4gc28gd2UgZ2V0IGNvbnRlbnQtdHlwZSBldmVuIGlmIGdldHRpbmdcbiAgLy8gb3RoZXIgaGVhZGVycyBmYWlscy5cbiAgdGhpcy5oZWFkZXJbJ2NvbnRlbnQtdHlwZSddID0gdGhpcy54aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpO1xuICB0aGlzLl9zZXRIZWFkZXJQcm9wZXJ0aWVzKHRoaXMuaGVhZGVyKTtcblxuICBpZiAodGhpcy50ZXh0ID09PSBudWxsICYmIHJlcXVlc3RfLl9yZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLmJvZHkgPSB0aGlzLnhoci5yZXNwb25zZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmJvZHkgPVxuICAgICAgdGhpcy5yZXEubWV0aG9kID09PSAnSEVBRCdcbiAgICAgICAgPyBudWxsXG4gICAgICAgIDogdGhpcy5fcGFyc2VCb2R5KHRoaXMudGV4dCA/IHRoaXMudGV4dCA6IHRoaXMueGhyLnJlc3BvbnNlKTtcbiAgfVxufVxuXG5taXhpbihSZXNwb25zZS5wcm90b3R5cGUsIFJlc3BvbnNlQmFzZS5wcm90b3R5cGUpO1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBib2R5IGBzdHJgLlxuICpcbiAqIFVzZWQgZm9yIGF1dG8tcGFyc2luZyBvZiBib2RpZXMuIFBhcnNlcnNcbiAqIGFyZSBkZWZpbmVkIG9uIHRoZSBgc3VwZXJhZ2VudC5wYXJzZWAgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge01peGVkfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLl9wYXJzZUJvZHkgPSBmdW5jdGlvbiAoc3RyaW5nXykge1xuICBsZXQgcGFyc2UgPSByZXF1ZXN0LnBhcnNlW3RoaXMudHlwZV07XG4gIGlmICh0aGlzLnJlcS5fcGFyc2VyKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxLl9wYXJzZXIodGhpcywgc3RyaW5nXyk7XG4gIH1cblxuICBpZiAoIXBhcnNlICYmIGlzSlNPTih0aGlzLnR5cGUpKSB7XG4gICAgcGFyc2UgPSByZXF1ZXN0LnBhcnNlWydhcHBsaWNhdGlvbi9qc29uJ107XG4gIH1cblxuICByZXR1cm4gcGFyc2UgJiYgc3RyaW5nXyAmJiAoc3RyaW5nXy5sZW5ndGggPiAwIHx8IHN0cmluZ18gaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgPyBwYXJzZShzdHJpbmdfKVxuICAgIDogbnVsbDtcbn07XG5cbi8qKlxuICogUmV0dXJuIGFuIGBFcnJvcmAgcmVwcmVzZW50YXRpdmUgb2YgdGhpcyByZXNwb25zZS5cbiAqXG4gKiBAcmV0dXJuIHtFcnJvcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVzcG9uc2UucHJvdG90eXBlLnRvRXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHsgcmVxIH0gPSB0aGlzO1xuICBjb25zdCB7IG1ldGhvZCB9ID0gcmVxO1xuICBjb25zdCB7IHVybCB9ID0gcmVxO1xuXG4gIGNvbnN0IG1lc3NhZ2UgPSBgY2Fubm90ICR7bWV0aG9kfSAke3VybH0gKCR7dGhpcy5zdGF0dXN9KWA7XG4gIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICBlcnJvci5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgZXJyb3IubWV0aG9kID0gbWV0aG9kO1xuICBlcnJvci51cmwgPSB1cmw7XG5cbiAgcmV0dXJuIGVycm9yO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlc3BvbnNlYC5cbiAqL1xuXG5yZXF1ZXN0LlJlc3BvbnNlID0gUmVzcG9uc2U7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgUmVxdWVzdGAgd2l0aCB0aGUgZ2l2ZW4gYG1ldGhvZGAgYW5kIGB1cmxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVxdWVzdChtZXRob2QsIHVybCkge1xuICBjb25zdCBzZWxmID0gdGhpcztcbiAgdGhpcy5fcXVlcnkgPSB0aGlzLl9xdWVyeSB8fCBbXTtcbiAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gIHRoaXMudXJsID0gdXJsO1xuICB0aGlzLmhlYWRlciA9IHt9OyAvLyBwcmVzZXJ2ZXMgaGVhZGVyIG5hbWUgY2FzZVxuICB0aGlzLl9oZWFkZXIgPSB7fTsgLy8gY29lcmNlcyBoZWFkZXIgbmFtZXMgdG8gbG93ZXJjYXNlXG4gIHRoaXMub24oJ2VuZCcsICgpID0+IHtcbiAgICBsZXQgZXJyb3IgPSBudWxsO1xuICAgIGxldCByZXMgPSBudWxsO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlcyA9IG5ldyBSZXNwb25zZShzZWxmKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKCdQYXJzZXIgaXMgdW5hYmxlIHRvIHBhcnNlIHRoZSByZXNwb25zZScpO1xuICAgICAgZXJyb3IucGFyc2UgPSB0cnVlO1xuICAgICAgZXJyb3Iub3JpZ2luYWwgPSBlcnI7XG4gICAgICAvLyBpc3N1ZSAjNjc1OiByZXR1cm4gdGhlIHJhdyByZXNwb25zZSBpZiB0aGUgcmVzcG9uc2UgcGFyc2luZyBmYWlsc1xuICAgICAgaWYgKHNlbGYueGhyKSB7XG4gICAgICAgIC8vIGllOSBkb2Vzbid0IGhhdmUgJ3Jlc3BvbnNlJyBwcm9wZXJ0eVxuICAgICAgICBlcnJvci5yYXdSZXNwb25zZSA9XG4gICAgICAgICAgdHlwZW9mIHNlbGYueGhyLnJlc3BvbnNlVHlwZSA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgICAgID8gc2VsZi54aHIucmVzcG9uc2VUZXh0XG4gICAgICAgICAgICA6IHNlbGYueGhyLnJlc3BvbnNlO1xuICAgICAgICAvLyBpc3N1ZSAjODc2OiByZXR1cm4gdGhlIGh0dHAgc3RhdHVzIGNvZGUgaWYgdGhlIHJlc3BvbnNlIHBhcnNpbmcgZmFpbHNcbiAgICAgICAgZXJyb3Iuc3RhdHVzID0gc2VsZi54aHIuc3RhdHVzID8gc2VsZi54aHIuc3RhdHVzIDogbnVsbDtcbiAgICAgICAgZXJyb3Iuc3RhdHVzQ29kZSA9IGVycm9yLnN0YXR1czsgLy8gYmFja3dhcmRzLWNvbXBhdCBvbmx5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvci5yYXdSZXNwb25zZSA9IG51bGw7XG4gICAgICAgIGVycm9yLnN0YXR1cyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmLmNhbGxiYWNrKGVycm9yKTtcbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoJ3Jlc3BvbnNlJywgcmVzKTtcblxuICAgIGxldCBuZXdfZXJyb3I7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghc2VsZi5faXNSZXNwb25zZU9LKHJlcykpIHtcbiAgICAgICAgbmV3X2Vycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAgIHJlcy5zdGF0dXNUZXh0IHx8IHJlcy50ZXh0IHx8ICdVbnN1Y2Nlc3NmdWwgSFRUUCByZXNwb25zZSdcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIG5ld19lcnJvciA9IGVycjsgLy8gb2soKSBjYWxsYmFjayBjYW4gdGhyb3dcbiAgICB9XG5cbiAgICAvLyAjMTAwMCBkb24ndCBjYXRjaCBlcnJvcnMgZnJvbSB0aGUgY2FsbGJhY2sgdG8gYXZvaWQgZG91YmxlIGNhbGxpbmcgaXRcbiAgICBpZiAobmV3X2Vycm9yKSB7XG4gICAgICBuZXdfZXJyb3Iub3JpZ2luYWwgPSBlcnJvcjtcbiAgICAgIG5ld19lcnJvci5yZXNwb25zZSA9IHJlcztcbiAgICAgIG5ld19lcnJvci5zdGF0dXMgPSBuZXdfZXJyb3Iuc3RhdHVzIHx8IHJlcy5zdGF0dXM7XG4gICAgICBzZWxmLmNhbGxiYWNrKG5ld19lcnJvciwgcmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZi5jYWxsYmFjayhudWxsLCByZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogTWl4aW4gYEVtaXR0ZXJgIGFuZCBgUmVxdWVzdEJhc2VgLlxuICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuZXctY2FwXG5FbWl0dGVyKFJlcXVlc3QucHJvdG90eXBlKTtcblxubWl4aW4oUmVxdWVzdC5wcm90b3R5cGUsIFJlcXVlc3RCYXNlLnByb3RvdHlwZSk7XG5cbi8qKlxuICogU2V0IENvbnRlbnQtVHlwZSB0byBgdHlwZWAsIG1hcHBpbmcgdmFsdWVzIGZyb20gYHJlcXVlc3QudHlwZXNgLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgc3VwZXJhZ2VudC50eXBlcy54bWwgPSAnYXBwbGljYXRpb24veG1sJztcbiAqXG4gKiAgICAgIHJlcXVlc3QucG9zdCgnLycpXG4gKiAgICAgICAgLnR5cGUoJ3htbCcpXG4gKiAgICAgICAgLnNlbmQoeG1sc3RyaW5nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqICAgICAgcmVxdWVzdC5wb3N0KCcvJylcbiAqICAgICAgICAudHlwZSgnYXBwbGljYXRpb24veG1sJylcbiAqICAgICAgICAuc2VuZCh4bWxzdHJpbmcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgdGhpcy5zZXQoJ0NvbnRlbnQtVHlwZScsIHJlcXVlc3QudHlwZXNbdHlwZV0gfHwgdHlwZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgQWNjZXB0IHRvIGB0eXBlYCwgbWFwcGluZyB2YWx1ZXMgZnJvbSBgcmVxdWVzdC50eXBlc2AuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBzdXBlcmFnZW50LnR5cGVzLmpzb24gPSAnYXBwbGljYXRpb24vanNvbic7XG4gKlxuICogICAgICByZXF1ZXN0LmdldCgnL2FnZW50JylcbiAqICAgICAgICAuYWNjZXB0KCdqc29uJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcXVlc3QuZ2V0KCcvYWdlbnQnKVxuICogICAgICAgIC5hY2NlcHQoJ2FwcGxpY2F0aW9uL2pzb24nKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhY2NlcHRcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hY2NlcHQgPSBmdW5jdGlvbiAodHlwZSkge1xuICB0aGlzLnNldCgnQWNjZXB0JywgcmVxdWVzdC50eXBlc1t0eXBlXSB8fCB0eXBlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBBdXRob3JpemF0aW9uIGZpZWxkIHZhbHVlIHdpdGggYHVzZXJgIGFuZCBgcGFzc2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbcGFzc10gb3B0aW9uYWwgaW4gY2FzZSBvZiB1c2luZyAnYmVhcmVyJyBhcyB0eXBlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyB3aXRoICd0eXBlJyBwcm9wZXJ0eSAnYXV0bycsICdiYXNpYycgb3IgJ2JlYXJlcicgKGRlZmF1bHQgJ2Jhc2ljJylcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5hdXRoID0gZnVuY3Rpb24gKHVzZXIsIHBhc3MsIG9wdGlvbnMpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHBhc3MgPSAnJztcbiAgaWYgKHR5cGVvZiBwYXNzID09PSAnb2JqZWN0JyAmJiBwYXNzICE9PSBudWxsKSB7XG4gICAgLy8gcGFzcyBpcyBvcHRpb25hbCBhbmQgY2FuIGJlIHJlcGxhY2VkIHdpdGggb3B0aW9uc1xuICAgIG9wdGlvbnMgPSBwYXNzO1xuICAgIHBhc3MgPSAnJztcbiAgfVxuXG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICB0eXBlOiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJyA/ICdiYXNpYycgOiAnYXV0bydcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgZW5jb2RlciA9IG9wdGlvbnMuZW5jb2RlclxuICAgID8gb3B0aW9ucy5lbmNvZGVyXG4gICAgOiAoc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBidG9hKHN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgYmFzaWMgYXV0aCwgYnRvYSBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgfTtcblxuICByZXR1cm4gdGhpcy5fYXV0aCh1c2VyLCBwYXNzLCBvcHRpb25zLCBlbmNvZGVyKTtcbn07XG5cbi8qKlxuICogQWRkIHF1ZXJ5LXN0cmluZyBgdmFsYC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgIHJlcXVlc3QuZ2V0KCcvc2hvZXMnKVxuICogICAgIC5xdWVyeSgnc2l6ZT0xMCcpXG4gKiAgICAgLnF1ZXJ5KHsgY29sb3I6ICdibHVlJyB9KVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fFN0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHZhbHVlID0gc2VyaWFsaXplKHZhbHVlKTtcbiAgaWYgKHZhbHVlKSB0aGlzLl9xdWVyeS5wdXNoKHZhbHVlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFF1ZXVlIHRoZSBnaXZlbiBgZmlsZWAgYXMgYW4gYXR0YWNobWVudCB0byB0aGUgc3BlY2lmaWVkIGBmaWVsZGAsXG4gKiB3aXRoIG9wdGlvbmFsIGBvcHRpb25zYCAob3IgZmlsZW5hbWUpLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmF0dGFjaCgnY29udGVudCcsIG5ldyBCbG9iKFsnPGEgaWQ9XCJhXCI+PGIgaWQ9XCJiXCI+aGV5ITwvYj48L2E+J10sIHsgdHlwZTogXCJ0ZXh0L2h0bWxcIn0pKVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHBhcmFtIHtCbG9ifEZpbGV9IGZpbGVcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3QucHJvdG90eXBlLmF0dGFjaCA9IGZ1bmN0aW9uIChmaWVsZCwgZmlsZSwgb3B0aW9ucykge1xuICBpZiAoZmlsZSkge1xuICAgIGlmICh0aGlzLl9kYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzdXBlcmFnZW50IGNhbid0IG1peCAuc2VuZCgpIGFuZCAuYXR0YWNoKClcIik7XG4gICAgfVxuXG4gICAgdGhpcy5fZ2V0Rm9ybURhdGEoKS5hcHBlbmQoZmllbGQsIGZpbGUsIG9wdGlvbnMgfHwgZmlsZS5uYW1lKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuUmVxdWVzdC5wcm90b3R5cGUuX2dldEZvcm1EYXRhID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMuX2Zvcm1EYXRhKSB7XG4gICAgdGhpcy5fZm9ybURhdGEgPSBuZXcgcm9vdC5Gb3JtRGF0YSgpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2Zvcm1EYXRhO1xufTtcblxuLyoqXG4gKiBJbnZva2UgdGhlIGNhbGxiYWNrIHdpdGggYGVycmAgYW5kIGByZXNgXG4gKiBhbmQgaGFuZGxlIGFyaXR5IGNoZWNrLlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYWxsYmFjayA9IGZ1bmN0aW9uIChlcnJvciwgcmVzKSB7XG4gIGlmICh0aGlzLl9zaG91bGRSZXRyeShlcnJvciwgcmVzKSkge1xuICAgIHJldHVybiB0aGlzLl9yZXRyeSgpO1xuICB9XG5cbiAgY29uc3QgZm4gPSB0aGlzLl9jYWxsYmFjaztcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICBpZiAodGhpcy5fbWF4UmV0cmllcykgZXJyb3IucmV0cmllcyA9IHRoaXMuX3JldHJpZXMgLSAxO1xuICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcik7XG4gIH1cblxuICBmbihlcnJvciwgcmVzKTtcbn07XG5cbi8qKlxuICogSW52b2tlIGNhbGxiYWNrIHdpdGggeC1kb21haW4gZXJyb3IuXG4gKlxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdC5wcm90b3R5cGUuY3Jvc3NEb21haW5FcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgJ1JlcXVlc3QgaGFzIGJlZW4gdGVybWluYXRlZFxcblBvc3NpYmxlIGNhdXNlczogdGhlIG5ldHdvcmsgaXMgb2ZmbGluZSwgT3JpZ2luIGlzIG5vdCBhbGxvd2VkIGJ5IEFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiwgdGhlIHBhZ2UgaXMgYmVpbmcgdW5sb2FkZWQsIGV0Yy4nXG4gICk7XG4gIGVycm9yLmNyb3NzRG9tYWluID0gdHJ1ZTtcblxuICBlcnJvci5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgZXJyb3IubWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gIGVycm9yLnVybCA9IHRoaXMudXJsO1xuXG4gIHRoaXMuY2FsbGJhY2soZXJyb3IpO1xufTtcblxuLy8gVGhpcyBvbmx5IHdhcm5zLCBiZWNhdXNlIHRoZSByZXF1ZXN0IGlzIHN0aWxsIGxpa2VseSB0byB3b3JrXG5SZXF1ZXN0LnByb3RvdHlwZS5hZ2VudCA9IGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS53YXJuKCdUaGlzIGlzIG5vdCBzdXBwb3J0ZWQgaW4gYnJvd3NlciB2ZXJzaW9uIG9mIHN1cGVyYWdlbnQnKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5jYSA9IFJlcXVlc3QucHJvdG90eXBlLmFnZW50O1xuUmVxdWVzdC5wcm90b3R5cGUuYnVmZmVyID0gUmVxdWVzdC5wcm90b3R5cGUuY2E7XG5cbi8vIFRoaXMgdGhyb3dzLCBiZWNhdXNlIGl0IGNhbid0IHNlbmQvcmVjZWl2ZSBkYXRhIGFzIGV4cGVjdGVkXG5SZXF1ZXN0LnByb3RvdHlwZS53cml0ZSA9ICgpID0+IHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICdTdHJlYW1pbmcgaXMgbm90IHN1cHBvcnRlZCBpbiBicm93c2VyIHZlcnNpb24gb2Ygc3VwZXJhZ2VudCdcbiAgKTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLnBpcGUgPSBSZXF1ZXN0LnByb3RvdHlwZS53cml0ZTtcblxuLyoqXG4gKiBDaGVjayBpZiBgb2JqYCBpcyBhIGhvc3Qgb2JqZWN0LFxuICogd2UgZG9uJ3Qgd2FudCB0byBzZXJpYWxpemUgdGhlc2UgOilcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIGhvc3Qgb2JqZWN0XG4gKiBAcmV0dXJuIHtCb29sZWFufSBpcyBhIGhvc3Qgb2JqZWN0XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuUmVxdWVzdC5wcm90b3R5cGUuX2lzSG9zdCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgLy8gTmF0aXZlIG9iamVjdHMgc3RyaW5naWZ5IHRvIFtvYmplY3QgRmlsZV0sIFtvYmplY3QgQmxvYl0sIFtvYmplY3QgRm9ybURhdGFdLCBldGMuXG4gIHJldHVybiAoXG4gICAgb2JqZWN0ICYmXG4gICAgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAhQXJyYXkuaXNBcnJheShvYmplY3QpICYmXG4gICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgIT09ICdbb2JqZWN0IE9iamVjdF0nXG4gICk7XG59O1xuXG4vKipcbiAqIEluaXRpYXRlIHJlcXVlc3QsIGludm9raW5nIGNhbGxiYWNrIGBmbihyZXMpYFxuICogd2l0aCBhbiBpbnN0YW5jZW9mIGBSZXNwb25zZWAuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoZm4pIHtcbiAgaWYgKHRoaXMuX2VuZENhbGxlZCkge1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgICdXYXJuaW5nOiAuZW5kKCkgd2FzIGNhbGxlZCB0d2ljZS4gVGhpcyBpcyBub3Qgc3VwcG9ydGVkIGluIHN1cGVyYWdlbnQnXG4gICAgKTtcbiAgfVxuXG4gIHRoaXMuX2VuZENhbGxlZCA9IHRydWU7XG5cbiAgLy8gc3RvcmUgY2FsbGJhY2tcbiAgdGhpcy5fY2FsbGJhY2sgPSBmbiB8fCBub29wO1xuXG4gIC8vIHF1ZXJ5c3RyaW5nXG4gIHRoaXMuX2ZpbmFsaXplUXVlcnlTdHJpbmcoKTtcblxuICB0aGlzLl9lbmQoKTtcbn07XG5cblJlcXVlc3QucHJvdG90eXBlLl9zZXRVcGxvYWRUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICBjb25zdCBzZWxmID0gdGhpcztcblxuICAvLyB1cGxvYWQgdGltZW91dCBpdCdzIHdva3JzIG9ubHkgaWYgZGVhZGxpbmUgdGltZW91dCBpcyBvZmZcbiAgaWYgKHRoaXMuX3VwbG9hZFRpbWVvdXQgJiYgIXRoaXMuX3VwbG9hZFRpbWVvdXRUaW1lcikge1xuICAgIHRoaXMuX3VwbG9hZFRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2VsZi5fdGltZW91dEVycm9yKFxuICAgICAgICAnVXBsb2FkIHRpbWVvdXQgb2YgJyxcbiAgICAgICAgc2VsZi5fdXBsb2FkVGltZW91dCxcbiAgICAgICAgJ0VUSU1FRE9VVCdcbiAgICAgICk7XG4gICAgfSwgdGhpcy5fdXBsb2FkVGltZW91dCk7XG4gIH1cbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjb21wbGV4aXR5XG5SZXF1ZXN0LnByb3RvdHlwZS5fZW5kID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fYWJvcnRlZClcbiAgICByZXR1cm4gdGhpcy5jYWxsYmFjayhcbiAgICAgIG5ldyBFcnJvcignVGhlIHJlcXVlc3QgaGFzIGJlZW4gYWJvcnRlZCBldmVuIGJlZm9yZSAuZW5kKCkgd2FzIGNhbGxlZCcpXG4gICAgKTtcblxuICBjb25zdCBzZWxmID0gdGhpcztcbiAgdGhpcy54aHIgPSByZXF1ZXN0LmdldFhIUigpO1xuICBjb25zdCB7IHhociB9ID0gdGhpcztcbiAgbGV0IGRhdGEgPSB0aGlzLl9mb3JtRGF0YSB8fCB0aGlzLl9kYXRhO1xuXG4gIHRoaXMuX3NldFRpbWVvdXRzKCk7XG5cbiAgLy8gc3RhdGUgY2hhbmdlXG4gIHhoci5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgcmVhZHlTdGF0ZSB9ID0geGhyO1xuICAgIGlmIChyZWFkeVN0YXRlID49IDIgJiYgc2VsZi5fcmVzcG9uc2VUaW1lb3V0VGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dChzZWxmLl9yZXNwb25zZVRpbWVvdXRUaW1lcik7XG4gICAgfVxuXG4gICAgaWYgKHJlYWR5U3RhdGUgIT09IDQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJbiBJRTksIHJlYWRzIHRvIGFueSBwcm9wZXJ0eSAoZS5nLiBzdGF0dXMpIG9mZiBvZiBhbiBhYm9ydGVkIFhIUiB3aWxsXG4gICAgLy8gcmVzdWx0IGluIHRoZSBlcnJvciBcIkNvdWxkIG5vdCBjb21wbGV0ZSB0aGUgb3BlcmF0aW9uIGR1ZSB0byBlcnJvciBjMDBjMDIzZlwiXG4gICAgbGV0IHN0YXR1cztcbiAgICB0cnkge1xuICAgICAgc3RhdHVzID0geGhyLnN0YXR1cztcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN0YXR1cyA9IDA7XG4gICAgfVxuXG4gICAgaWYgKCFzdGF0dXMpIHtcbiAgICAgIGlmIChzZWxmLnRpbWVkb3V0IHx8IHNlbGYuX2Fib3J0ZWQpIHJldHVybjtcbiAgICAgIHJldHVybiBzZWxmLmNyb3NzRG9tYWluRXJyb3IoKTtcbiAgICB9XG5cbiAgICBzZWxmLmVtaXQoJ2VuZCcpO1xuICB9KTtcblxuICAvLyBwcm9ncmVzc1xuICBjb25zdCBoYW5kbGVQcm9ncmVzcyA9IChkaXJlY3Rpb24sIGUpID0+IHtcbiAgICBpZiAoZS50b3RhbCA+IDApIHtcbiAgICAgIGUucGVyY2VudCA9IChlLmxvYWRlZCAvIGUudG90YWwpICogMTAwO1xuXG4gICAgICBpZiAoZS5wZXJjZW50ID09PSAxMDApIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHNlbGYuX3VwbG9hZFRpbWVvdXRUaW1lcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZS5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgc2VsZi5lbWl0KCdwcm9ncmVzcycsIGUpO1xuICB9O1xuXG4gIGlmICh0aGlzLmhhc0xpc3RlbmVycygncHJvZ3Jlc3MnKSkge1xuICAgIHRyeSB7XG4gICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBoYW5kbGVQcm9ncmVzcy5iaW5kKG51bGwsICdkb3dubG9hZCcpKTtcbiAgICAgIGlmICh4aHIudXBsb2FkKSB7XG4gICAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAncHJvZ3Jlc3MnLFxuICAgICAgICAgIGhhbmRsZVByb2dyZXNzLmJpbmQobnVsbCwgJ3VwbG9hZCcpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBBY2Nlc3NpbmcgeGhyLnVwbG9hZCBmYWlscyBpbiBJRSBmcm9tIGEgd2ViIHdvcmtlciwgc28ganVzdCBwcmV0ZW5kIGl0IGRvZXNuJ3QgZXhpc3QuXG4gICAgICAvLyBSZXBvcnRlZCBoZXJlOlxuICAgICAgLy8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2svZGV0YWlscy84MzcyNDUveG1saHR0cHJlcXVlc3QtdXBsb2FkLXRocm93cy1pbnZhbGlkLWFyZ3VtZW50LXdoZW4tdXNlZC1mcm9tLXdlYi13b3JrZXItY29udGV4dFxuICAgIH1cbiAgfVxuXG4gIGlmICh4aHIudXBsb2FkKSB7XG4gICAgdGhpcy5fc2V0VXBsb2FkVGltZW91dCgpO1xuICB9XG5cbiAgLy8gaW5pdGlhdGUgcmVxdWVzdFxuICB0cnkge1xuICAgIGlmICh0aGlzLnVzZXJuYW1lICYmIHRoaXMucGFzc3dvcmQpIHtcbiAgICAgIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSwgdGhpcy51c2VybmFtZSwgdGhpcy5wYXNzd29yZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHhoci5vcGVuKHRoaXMubWV0aG9kLCB0aGlzLnVybCwgdHJ1ZSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICAvLyBzZWUgIzExNDlcbiAgICByZXR1cm4gdGhpcy5jYWxsYmFjayhlcnIpO1xuICB9XG5cbiAgLy8gQ09SU1xuICBpZiAodGhpcy5fd2l0aENyZWRlbnRpYWxzKSB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcblxuICAvLyBib2R5XG4gIGlmIChcbiAgICAhdGhpcy5fZm9ybURhdGEgJiZcbiAgICB0aGlzLm1ldGhvZCAhPT0gJ0dFVCcgJiZcbiAgICB0aGlzLm1ldGhvZCAhPT0gJ0hFQUQnICYmXG4gICAgdHlwZW9mIGRhdGEgIT09ICdzdHJpbmcnICYmXG4gICAgIXRoaXMuX2lzSG9zdChkYXRhKVxuICApIHtcbiAgICAvLyBzZXJpYWxpemUgc3R1ZmZcbiAgICBjb25zdCBjb250ZW50VHlwZSA9IHRoaXMuX2hlYWRlclsnY29udGVudC10eXBlJ107XG4gICAgbGV0IHNlcmlhbGl6ZSA9XG4gICAgICB0aGlzLl9zZXJpYWxpemVyIHx8XG4gICAgICByZXF1ZXN0LnNlcmlhbGl6ZVtjb250ZW50VHlwZSA/IGNvbnRlbnRUeXBlLnNwbGl0KCc7JylbMF0gOiAnJ107XG4gICAgaWYgKCFzZXJpYWxpemUgJiYgaXNKU09OKGNvbnRlbnRUeXBlKSkge1xuICAgICAgc2VyaWFsaXplID0gcmVxdWVzdC5zZXJpYWxpemVbJ2FwcGxpY2F0aW9uL2pzb24nXTtcbiAgICB9XG5cbiAgICBpZiAoc2VyaWFsaXplKSBkYXRhID0gc2VyaWFsaXplKGRhdGEpO1xuICB9XG5cbiAgLy8gc2V0IGhlYWRlciBmaWVsZHNcbiAgZm9yIChjb25zdCBmaWVsZCBpbiB0aGlzLmhlYWRlcikge1xuICAgIGlmICh0aGlzLmhlYWRlcltmaWVsZF0gPT09IG51bGwpIGNvbnRpbnVlO1xuXG4gICAgaWYgKGhhc093bih0aGlzLmhlYWRlciwgZmllbGQpKVxuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoZmllbGQsIHRoaXMuaGVhZGVyW2ZpZWxkXSk7XG4gIH1cblxuICBpZiAodGhpcy5fcmVzcG9uc2VUeXBlKSB7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZTtcbiAgfVxuXG4gIC8vIHNlbmQgc3R1ZmZcbiAgdGhpcy5lbWl0KCdyZXF1ZXN0JywgdGhpcyk7XG5cbiAgLy8gSUUxMSB4aHIuc2VuZCh1bmRlZmluZWQpIHNlbmRzICd1bmRlZmluZWQnIHN0cmluZyBhcyBQT1NUIHBheWxvYWQgKGluc3RlYWQgb2Ygbm90aGluZylcbiAgLy8gV2UgbmVlZCBudWxsIGhlcmUgaWYgZGF0YSBpcyB1bmRlZmluZWRcbiAgeGhyLnNlbmQodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IGRhdGEpO1xufTtcblxucmVxdWVzdC5hZ2VudCA9ICgpID0+IG5ldyBBZ2VudCgpO1xuXG5mb3IgKGNvbnN0IG1ldGhvZCBvZiBbJ0dFVCcsICdQT1NUJywgJ09QVElPTlMnLCAnUEFUQ0gnLCAnUFVUJywgJ0RFTEVURSddKSB7XG4gIEFnZW50LnByb3RvdHlwZVttZXRob2QudG9Mb3dlckNhc2UoKV0gPSBmdW5jdGlvbiAodXJsLCBmbikge1xuICAgIGNvbnN0IHJlcXVlc3RfID0gbmV3IHJlcXVlc3QuUmVxdWVzdChtZXRob2QsIHVybCk7XG4gICAgdGhpcy5fc2V0RGVmYXVsdHMocmVxdWVzdF8pO1xuICAgIGlmIChmbikge1xuICAgICAgcmVxdWVzdF8uZW5kKGZuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVxdWVzdF87XG4gIH07XG59XG5cbkFnZW50LnByb3RvdHlwZS5kZWwgPSBBZ2VudC5wcm90b3R5cGUuZGVsZXRlO1xuXG4vKipcbiAqIEdFVCBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBbZGF0YV0gb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QuZ2V0ID0gKHVybCwgZGF0YSwgZm4pID0+IHtcbiAgY29uc3QgcmVxdWVzdF8gPSByZXF1ZXN0KCdHRVQnLCB1cmwpO1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICBmbiA9IGRhdGE7XG4gICAgZGF0YSA9IG51bGw7XG4gIH1cblxuICBpZiAoZGF0YSkgcmVxdWVzdF8ucXVlcnkoZGF0YSk7XG4gIGlmIChmbikgcmVxdWVzdF8uZW5kKGZuKTtcbiAgcmV0dXJuIHJlcXVlc3RfO1xufTtcblxuLyoqXG4gKiBIRUFEIGB1cmxgIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR8RnVuY3Rpb259IFtkYXRhXSBvciBmblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5oZWFkID0gKHVybCwgZGF0YSwgZm4pID0+IHtcbiAgY29uc3QgcmVxdWVzdF8gPSByZXF1ZXN0KCdIRUFEJywgdXJsKTtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZm4gPSBkYXRhO1xuICAgIGRhdGEgPSBudWxsO1xuICB9XG5cbiAgaWYgKGRhdGEpIHJlcXVlc3RfLnF1ZXJ5KGRhdGEpO1xuICBpZiAoZm4pIHJlcXVlc3RfLmVuZChmbik7XG4gIHJldHVybiByZXF1ZXN0Xztcbn07XG5cbi8qKlxuICogT1BUSU9OUyBxdWVyeSB0byBgdXJsYCB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfEZ1bmN0aW9ufSBbZGF0YV0gb3IgZm5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3Qub3B0aW9ucyA9ICh1cmwsIGRhdGEsIGZuKSA9PiB7XG4gIGNvbnN0IHJlcXVlc3RfID0gcmVxdWVzdCgnT1BUSU9OUycsIHVybCk7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGZuID0gZGF0YTtcbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIGlmIChkYXRhKSByZXF1ZXN0Xy5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcXVlc3RfLmVuZChmbik7XG4gIHJldHVybiByZXF1ZXN0Xztcbn07XG5cbi8qKlxuICogREVMRVRFIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZH0gW2RhdGFdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkZWwodXJsLCBkYXRhLCBmbikge1xuICBjb25zdCByZXF1ZXN0XyA9IHJlcXVlc3QoJ0RFTEVURScsIHVybCk7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGZuID0gZGF0YTtcbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIGlmIChkYXRhKSByZXF1ZXN0Xy5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcXVlc3RfLmVuZChmbik7XG4gIHJldHVybiByZXF1ZXN0Xztcbn1cblxucmVxdWVzdC5kZWwgPSBkZWw7XG5yZXF1ZXN0LmRlbGV0ZSA9IGRlbDtcblxuLyoqXG4gKiBQQVRDSCBgdXJsYCB3aXRoIG9wdGlvbmFsIGBkYXRhYCBhbmQgY2FsbGJhY2sgYGZuKHJlcylgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7TWl4ZWR9IFtkYXRhXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucmVxdWVzdC5wYXRjaCA9ICh1cmwsIGRhdGEsIGZuKSA9PiB7XG4gIGNvbnN0IHJlcXVlc3RfID0gcmVxdWVzdCgnUEFUQ0gnLCB1cmwpO1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdmdW5jdGlvbicpIHtcbiAgICBmbiA9IGRhdGE7XG4gICAgZGF0YSA9IG51bGw7XG4gIH1cblxuICBpZiAoZGF0YSkgcmVxdWVzdF8uc2VuZChkYXRhKTtcbiAgaWYgKGZuKSByZXF1ZXN0Xy5lbmQoZm4pO1xuICByZXR1cm4gcmVxdWVzdF87XG59O1xuXG4vKipcbiAqIFBPU1QgYHVybGAgd2l0aCBvcHRpb25hbCBgZGF0YWAgYW5kIGNhbGxiYWNrIGBmbihyZXMpYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge01peGVkfSBbZGF0YV1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl1cbiAqIEByZXR1cm4ge1JlcXVlc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnJlcXVlc3QucG9zdCA9ICh1cmwsIGRhdGEsIGZuKSA9PiB7XG4gIGNvbnN0IHJlcXVlc3RfID0gcmVxdWVzdCgnUE9TVCcsIHVybCk7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGZuID0gZGF0YTtcbiAgICBkYXRhID0gbnVsbDtcbiAgfVxuXG4gIGlmIChkYXRhKSByZXF1ZXN0Xy5zZW5kKGRhdGEpO1xuICBpZiAoZm4pIHJlcXVlc3RfLmVuZChmbik7XG4gIHJldHVybiByZXF1ZXN0Xztcbn07XG5cbi8qKlxuICogUFVUIGB1cmxgIHdpdGggb3B0aW9uYWwgYGRhdGFgIGFuZCBjYWxsYmFjayBgZm4ocmVzKWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHBhcmFtIHtNaXhlZHxGdW5jdGlvbn0gW2RhdGFdIG9yIGZuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbZm5dXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5yZXF1ZXN0LnB1dCA9ICh1cmwsIGRhdGEsIGZuKSA9PiB7XG4gIGNvbnN0IHJlcXVlc3RfID0gcmVxdWVzdCgnUFVUJywgdXJsKTtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZm4gPSBkYXRhO1xuICAgIGRhdGEgPSBudWxsO1xuICB9XG5cbiAgaWYgKGRhdGEpIHJlcXVlc3RfLnNlbmQoZGF0YSk7XG4gIGlmIChmbikgcmVxdWVzdF8uZW5kKGZuKTtcbiAgcmV0dXJuIHJlcXVlc3RfO1xufTtcbiIsIi8qKlxuICogTW9kdWxlIG9mIG1peGVkLWluIGZ1bmN0aW9ucyBzaGFyZWQgYmV0d2VlbiBub2RlIGFuZCBjbGllbnQgY29kZVxuICovXG5jb25zdCB7IGlzT2JqZWN0LCBoYXNPd24gfSA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuLyoqXG4gKiBFeHBvc2UgYFJlcXVlc3RCYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlcXVlc3RCYXNlO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYFJlcXVlc3RCYXNlYC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIFJlcXVlc3RCYXNlKCkge31cblxuLyoqXG4gKiBDbGVhciBwcmV2aW91cyB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuY2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICBjbGVhclRpbWVvdXQodGhpcy5fcmVzcG9uc2VUaW1lb3V0VGltZXIpO1xuICBjbGVhclRpbWVvdXQodGhpcy5fdXBsb2FkVGltZW91dFRpbWVyKTtcbiAgZGVsZXRlIHRoaXMuX3RpbWVyO1xuICBkZWxldGUgdGhpcy5fcmVzcG9uc2VUaW1lb3V0VGltZXI7XG4gIGRlbGV0ZSB0aGlzLl91cGxvYWRUaW1lb3V0VGltZXI7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBPdmVycmlkZSBkZWZhdWx0IHJlc3BvbnNlIGJvZHkgcGFyc2VyXG4gKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB0byBjb252ZXJ0IGluY29taW5nIGRhdGEgaW50byByZXF1ZXN0LmJvZHlcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdGhpcy5fcGFyc2VyID0gZm47XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgZm9ybWF0IG9mIGJpbmFyeSByZXNwb25zZSBib2R5LlxuICogSW4gYnJvd3NlciB2YWxpZCBmb3JtYXRzIGFyZSAnYmxvYicgYW5kICdhcnJheWJ1ZmZlcicsXG4gKiB3aGljaCByZXR1cm4gQmxvYiBhbmQgQXJyYXlCdWZmZXIsIHJlc3BlY3RpdmVseS5cbiAqXG4gKiBJbiBOb2RlIGFsbCB2YWx1ZXMgcmVzdWx0IGluIEJ1ZmZlci5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5yZXNwb25zZVR5cGUoJ2Jsb2InKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB2YWxcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUucmVzcG9uc2VUeXBlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogT3ZlcnJpZGUgZGVmYXVsdCByZXF1ZXN0IGJvZHkgc2VyaWFsaXplclxuICpcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgdG8gY29udmVydCBkYXRhIHNldCB2aWEgLnNlbmQgb3IgLmF0dGFjaCBpbnRvIHBheWxvYWQgdG8gc2VuZFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5zZXJpYWxpemUgPSBmdW5jdGlvbiAoZm4pIHtcbiAgdGhpcy5fc2VyaWFsaXplciA9IGZuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRpbWVvdXRzLlxuICpcbiAqIC0gcmVzcG9uc2UgdGltZW91dCBpcyB0aW1lIGJldHdlZW4gc2VuZGluZyByZXF1ZXN0IGFuZCByZWNlaXZpbmcgdGhlIGZpcnN0IGJ5dGUgb2YgdGhlIHJlc3BvbnNlLiBJbmNsdWRlcyBETlMgYW5kIGNvbm5lY3Rpb24gdGltZS5cbiAqIC0gZGVhZGxpbmUgaXMgdGhlIHRpbWUgZnJvbSBzdGFydCBvZiB0aGUgcmVxdWVzdCB0byByZWNlaXZpbmcgcmVzcG9uc2UgYm9keSBpbiBmdWxsLiBJZiB0aGUgZGVhZGxpbmUgaXMgdG9vIHNob3J0IGxhcmdlIGZpbGVzIG1heSBub3QgbG9hZCBhdCBhbGwgb24gc2xvdyBjb25uZWN0aW9ucy5cbiAqIC0gdXBsb2FkIGlzIHRoZSB0aW1lICBzaW5jZSBsYXN0IGJpdCBvZiBkYXRhIHdhcyBzZW50IG9yIHJlY2VpdmVkLiBUaGlzIHRpbWVvdXQgd29ya3Mgb25seSBpZiBkZWFkbGluZSB0aW1lb3V0IGlzIG9mZlxuICpcbiAqIFZhbHVlIG9mIDAgb3IgZmFsc2UgbWVhbnMgbm8gdGltZW91dC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcnxPYmplY3R9IG1zIG9yIHtyZXNwb25zZSwgZGVhZGxpbmV9XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnRpbWVvdXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMgfHwgdHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhpcy5fdGltZW91dCA9IG9wdGlvbnM7XG4gICAgdGhpcy5fcmVzcG9uc2VUaW1lb3V0ID0gMDtcbiAgICB0aGlzLl91cGxvYWRUaW1lb3V0ID0gMDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGZvciAoY29uc3Qgb3B0aW9uIGluIG9wdGlvbnMpIHtcbiAgICBpZiAoaGFzT3duKG9wdGlvbnMsIG9wdGlvbikpIHtcbiAgICAgIHN3aXRjaCAob3B0aW9uKSB7XG4gICAgICAgIGNhc2UgJ2RlYWRsaW5lJzpcbiAgICAgICAgICB0aGlzLl90aW1lb3V0ID0gb3B0aW9ucy5kZWFkbGluZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVzcG9uc2UnOlxuICAgICAgICAgIHRoaXMuX3Jlc3BvbnNlVGltZW91dCA9IG9wdGlvbnMucmVzcG9uc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3VwbG9hZCc6XG4gICAgICAgICAgdGhpcy5fdXBsb2FkVGltZW91dCA9IG9wdGlvbnMudXBsb2FkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUud2FybignVW5rbm93biB0aW1lb3V0IG9wdGlvbicsIG9wdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCBudW1iZXIgb2YgcmV0cnkgYXR0ZW1wdHMgb24gZXJyb3IuXG4gKlxuICogRmFpbGVkIHJlcXVlc3RzIHdpbGwgYmUgcmV0cmllZCAnY291bnQnIHRpbWVzIGlmIHRpbWVvdXQgb3IgZXJyLmNvZGUgPj0gNTAwLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBjb3VudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5yZXRyeSA9IGZ1bmN0aW9uIChjb3VudCwgZm4pIHtcbiAgLy8gRGVmYXVsdCB0byAxIGlmIG5vIGNvdW50IHBhc3NlZCBvciB0cnVlXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwIHx8IGNvdW50ID09PSB0cnVlKSBjb3VudCA9IDE7XG4gIGlmIChjb3VudCA8PSAwKSBjb3VudCA9IDA7XG4gIHRoaXMuX21heFJldHJpZXMgPSBjb3VudDtcbiAgdGhpcy5fcmV0cmllcyA9IDA7XG4gIHRoaXMuX3JldHJ5Q2FsbGJhY2sgPSBmbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gTk9URTogd2UgZG8gbm90IGluY2x1ZGUgRVNPQ0tFVFRJTUVET1VUIGJlY2F1c2UgdGhhdCBpcyBmcm9tIGByZXF1ZXN0YCBwYWNrYWdlXG4vLyAgICAgICA8aHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9nb3QvcHVsbC81Mzc+XG4vL1xuLy8gTk9URTogd2UgZG8gbm90IGluY2x1ZGUgRUFERFJJTkZPIGJlY2F1c2UgaXQgd2FzIHJlbW92ZWQgZnJvbSBsaWJ1diBpbiAyMDE0XG4vLyAgICAgICA8aHR0cHM6Ly9naXRodWIuY29tL2xpYnV2L2xpYnV2L2NvbW1pdC8wMmUxZWJkNDBiODA3YmU1YWY0NjM0M2VhODczMzMxYjJlZTRlOWMxPlxuLy8gICAgICAgPGh0dHBzOi8vZ2l0aHViLmNvbS9yZXF1ZXN0L3JlcXVlc3Qvc2VhcmNoP3E9RVNPQ0tFVFRJTUVET1VUJnVuc2NvcGVkX3E9RVNPQ0tFVFRJTUVET1VUPlxuLy9cbi8vXG4vLyBUT0RPOiBleHBvc2UgdGhlc2UgYXMgY29uZmlndXJhYmxlIGRlZmF1bHRzXG4vL1xuY29uc3QgRVJST1JfQ09ERVMgPSBuZXcgU2V0KFtcbiAgJ0VUSU1FRE9VVCcsXG4gICdFQ09OTlJFU0VUJyxcbiAgJ0VBRERSSU5VU0UnLFxuICAnRUNPTk5SRUZVU0VEJyxcbiAgJ0VQSVBFJyxcbiAgJ0VOT1RGT1VORCcsXG4gICdFTkVUVU5SRUFDSCcsXG4gICdFQUlfQUdBSU4nXG5dKTtcblxuY29uc3QgU1RBVFVTX0NPREVTID0gbmV3IFNldChbXG4gIDQwOCwgNDEzLCA0MjksIDUwMCwgNTAyLCA1MDMsIDUwNCwgNTIxLCA1MjIsIDUyNFxuXSk7XG5cbi8vIFRPRE86IHdlIHdvdWxkIG5lZWQgdG8gbWFrZSB0aGlzIGVhc2lseSBjb25maWd1cmFibGUgYmVmb3JlIGFkZGluZyBpdCBpbiAoZS5nLiBzb21lIG1pZ2h0IHdhbnQgdG8gYWRkIFBPU1QpXG4vLyBjb25zdCBNRVRIT0RTID0gbmV3IFNldChbJ0dFVCcsICdQVVQnLCAnSEVBRCcsICdERUxFVEUnLCAnT1BUSU9OUycsICdUUkFDRSddKTtcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSByZXF1ZXN0IHNob3VsZCBiZSByZXRyaWVkLlxuICogKEluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvZ290I3JldHJ5KVxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVyciBhbiBlcnJvclxuICogQHBhcmFtIHtSZXNwb25zZX0gW3Jlc10gcmVzcG9uc2VcbiAqIEByZXR1cm5zIHtCb29sZWFufSBpZiBzZWdtZW50IHNob3VsZCBiZSByZXRyaWVkXG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fc2hvdWxkUmV0cnkgPSBmdW5jdGlvbiAoZXJyb3IsIHJlcykge1xuICBpZiAoIXRoaXMuX21heFJldHJpZXMgfHwgdGhpcy5fcmV0cmllcysrID49IHRoaXMuX21heFJldHJpZXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodGhpcy5fcmV0cnlDYWxsYmFjaykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvdmVycmlkZSA9IHRoaXMuX3JldHJ5Q2FsbGJhY2soZXJyb3IsIHJlcyk7XG4gICAgICBpZiAob3ZlcnJpZGUgPT09IHRydWUpIHJldHVybiB0cnVlO1xuICAgICAgaWYgKG92ZXJyaWRlID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gdW5kZWZpbmVkIGZhbGxzIGJhY2sgdG8gZGVmYXVsdHNcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvLyBUT0RPOiB3ZSB3b3VsZCBuZWVkIHRvIG1ha2UgdGhpcyBlYXNpbHkgY29uZmlndXJhYmxlIGJlZm9yZSBhZGRpbmcgaXQgaW4gKGUuZy4gc29tZSBtaWdodCB3YW50IHRvIGFkZCBQT1NUKVxuICAvKlxuICBpZiAoXG4gICAgdGhpcy5yZXEgJiZcbiAgICB0aGlzLnJlcS5tZXRob2QgJiZcbiAgICAhTUVUSE9EUy5oYXModGhpcy5yZXEubWV0aG9kLnRvVXBwZXJDYXNlKCkpXG4gIClcbiAgICByZXR1cm4gZmFsc2U7XG4gICovXG4gIGlmIChyZXMgJiYgcmVzLnN0YXR1cyAmJiBTVEFUVVNfQ09ERVMuaGFzKHJlcy5zdGF0dXMpKSByZXR1cm4gdHJ1ZTtcbiAgaWYgKGVycm9yKSB7XG4gICAgaWYgKGVycm9yLmNvZGUgJiYgRVJST1JfQ09ERVMuaGFzKGVycm9yLmNvZGUpKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBTdXBlcmFnZW50IHRpbWVvdXRcbiAgICBpZiAoZXJyb3IudGltZW91dCAmJiBlcnJvci5jb2RlID09PSAnRUNPTk5BQk9SVEVEJykgcmV0dXJuIHRydWU7XG4gICAgaWYgKGVycm9yLmNyb3NzRG9tYWluKSByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmV0cnkgcmVxdWVzdFxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9yZXRyeSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcblxuICAvLyBub2RlXG4gIGlmICh0aGlzLnJlcSkge1xuICAgIHRoaXMucmVxID0gbnVsbDtcbiAgICB0aGlzLnJlcSA9IHRoaXMucmVxdWVzdCgpO1xuICB9XG5cbiAgdGhpcy5fYWJvcnRlZCA9IGZhbHNlO1xuICB0aGlzLnRpbWVkb3V0ID0gZmFsc2U7XG4gIHRoaXMudGltZWRvdXRFcnJvciA9IG51bGw7XG5cbiAgcmV0dXJuIHRoaXMuX2VuZCgpO1xufTtcblxuLyoqXG4gKiBQcm9taXNlIHN1cHBvcnRcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNvbHZlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVqZWN0XVxuICogQHJldHVybiB7UmVxdWVzdH1cbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgaWYgKCF0aGlzLl9mdWxsZmlsbGVkUHJvbWlzZSkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGlmICh0aGlzLl9lbmRDYWxsZWQpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgJ1dhcm5pbmc6IHN1cGVyYWdlbnQgcmVxdWVzdCB3YXMgc2VudCB0d2ljZSwgYmVjYXVzZSBib3RoIC5lbmQoKSBhbmQgLnRoZW4oKSB3ZXJlIGNhbGxlZC4gTmV2ZXIgY2FsbCAuZW5kKCkgaWYgeW91IHVzZSBwcm9taXNlcydcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5fZnVsbGZpbGxlZFByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBzZWxmLm9uKCdhYm9ydCcsICgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX21heFJldHJpZXMgJiYgdGhpcy5fbWF4UmV0cmllcyA+IHRoaXMuX3JldHJpZXMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50aW1lZG91dCAmJiB0aGlzLnRpbWVkb3V0RXJyb3IpIHtcbiAgICAgICAgICByZWplY3QodGhpcy50aW1lZG91dEVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignQWJvcnRlZCcpO1xuICAgICAgICBlcnJvci5jb2RlID0gJ0FCT1JURUQnO1xuICAgICAgICBlcnJvci5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgICAgICAgZXJyb3IubWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gICAgICAgIGVycm9yLnVybCA9IHRoaXMudXJsO1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgICBzZWxmLmVuZCgoZXJyb3IsIHJlcykgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHJlamVjdChlcnJvcik7XG4gICAgICAgIGVsc2UgcmVzb2x2ZShyZXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fZnVsbGZpbGxlZFByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpO1xufTtcblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLmNhdGNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIEFsbG93IGZvciBleHRlbnNpb25cbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gKGZuKSB7XG4gIGZuKHRoaXMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5vayA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgRXJyb3IoJ0NhbGxiYWNrIHJlcXVpcmVkJyk7XG4gIHRoaXMuX29rQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX2lzUmVzcG9uc2VPSyA9IGZ1bmN0aW9uIChyZXMpIHtcbiAgaWYgKCFyZXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAodGhpcy5fb2tDYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLl9va0NhbGxiYWNrKHJlcyk7XG4gIH1cblxuICByZXR1cm4gcmVzLnN0YXR1cyA+PSAyMDAgJiYgcmVzLnN0YXR1cyA8IDMwMDtcbn07XG5cbi8qKlxuICogR2V0IHJlcXVlc3QgaGVhZGVyIGBmaWVsZGAuXG4gKiBDYXNlLWluc2Vuc2l0aXZlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGZpZWxkKSB7XG4gIHJldHVybiB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIEdldCBjYXNlLWluc2Vuc2l0aXZlIGhlYWRlciBgZmllbGRgIHZhbHVlLlxuICogVGhpcyBpcyBhIGRlcHJlY2F0ZWQgaW50ZXJuYWwgQVBJLiBVc2UgYC5nZXQoZmllbGQpYCBpbnN0ZWFkLlxuICpcbiAqIChnZXRIZWFkZXIgaXMgbm8gbG9uZ2VyIHVzZWQgaW50ZXJuYWxseSBieSB0aGUgc3VwZXJhZ2VudCBjb2RlIGJhc2UpXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqIEBkZXByZWNhdGVkXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLmdldEhlYWRlciA9IFJlcXVlc3RCYXNlLnByb3RvdHlwZS5nZXQ7XG5cbi8qKlxuICogU2V0IGhlYWRlciBgZmllbGRgIHRvIGB2YWxgLCBvciBtdWx0aXBsZSBmaWVsZHMgd2l0aCBvbmUgb2JqZWN0LlxuICogQ2FzZS1pbnNlbnNpdGl2ZS5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoJ0FjY2VwdCcsICdhcHBsaWNhdGlvbi9qc29uJylcbiAqICAgICAgICAuc2V0KCdYLUFQSS1LZXknLCAnZm9vYmFyJylcbiAqICAgICAgICAuZW5kKGNhbGxiYWNrKTtcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC5zZXQoeyBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJywgJ1gtQVBJLUtleSc6ICdmb29iYXInIH0pXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBmaWVsZFxuICogQHBhcmFtIHtTdHJpbmd9IHZhbFxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoZmllbGQsIHZhbHVlKSB7XG4gIGlmIChpc09iamVjdChmaWVsZCkpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBmaWVsZCkge1xuICAgICAgaWYgKGhhc093bihmaWVsZCwga2V5KSkgdGhpcy5zZXQoa2V5LCBmaWVsZFtrZXldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRoaXMuX2hlYWRlcltmaWVsZC50b0xvd2VyQ2FzZSgpXSA9IHZhbHVlO1xuICB0aGlzLmhlYWRlcltmaWVsZF0gPSB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBoZWFkZXIgYGZpZWxkYC5cbiAqIENhc2UtaW5zZW5zaXRpdmUuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiAgICAgIHJlcS5nZXQoJy8nKVxuICogICAgICAgIC51bnNldCgnVXNlci1BZ2VudCcpXG4gKiAgICAgICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpZWxkIGZpZWxkIG5hbWVcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLnVuc2V0ID0gZnVuY3Rpb24gKGZpZWxkKSB7XG4gIGRlbGV0ZSB0aGlzLl9oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG4gIGRlbGV0ZSB0aGlzLmhlYWRlcltmaWVsZF07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBXcml0ZSB0aGUgZmllbGQgYG5hbWVgIGFuZCBgdmFsYCwgb3IgbXVsdGlwbGUgZmllbGRzIHdpdGggb25lIG9iamVjdFxuICogZm9yIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIHJlcXVlc3QgYm9kaWVzLlxuICpcbiAqIGBgYCBqc1xuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmZpZWxkKCdmb28nLCAnYmFyJylcbiAqICAgLmVuZChjYWxsYmFjayk7XG4gKlxuICogcmVxdWVzdC5wb3N0KCcvdXBsb2FkJylcbiAqICAgLmZpZWxkKHsgZm9vOiAnYmFyJywgYmF6OiAncXV4JyB9KVxuICogICAuZW5kKGNhbGxiYWNrKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE9iamVjdH0gbmFtZSBuYW1lIG9mIGZpZWxkXG4gKiBAcGFyYW0ge1N0cmluZ3xCbG9ifEZpbGV8QnVmZmVyfGZzLlJlYWRTdHJlYW19IHZhbCB2YWx1ZSBvZiBmaWVsZFxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMgZXh0cmEgb3B0aW9ucywgZS5nLiAnYmxvYidcbiAqIEByZXR1cm4ge1JlcXVlc3R9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuUmVxdWVzdEJhc2UucHJvdG90eXBlLmZpZWxkID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlLCBvcHRpb25zKSB7XG4gIC8vIG5hbWUgc2hvdWxkIGJlIGVpdGhlciBhIHN0cmluZyBvciBhbiBvYmplY3QuXG4gIGlmIChuYW1lID09PSBudWxsIHx8IHVuZGVmaW5lZCA9PT0gbmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignLmZpZWxkKG5hbWUsIHZhbCkgbmFtZSBjYW4gbm90IGJlIGVtcHR5Jyk7XG4gIH1cblxuICBpZiAodGhpcy5fZGF0YSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIFwiLmZpZWxkKCkgY2FuJ3QgYmUgdXNlZCBpZiAuc2VuZCgpIGlzIHVzZWQuIFBsZWFzZSB1c2Ugb25seSAuc2VuZCgpIG9yIG9ubHkgLmZpZWxkKCkgJiAuYXR0YWNoKClcIlxuICAgICk7XG4gIH1cblxuICBpZiAoaXNPYmplY3QobmFtZSkpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBuYW1lKSB7XG4gICAgICBpZiAoaGFzT3duKG5hbWUsIGtleSkpIHRoaXMuZmllbGQoa2V5LCBuYW1lW2tleV0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgZm9yIChjb25zdCBpIGluIHZhbHVlKSB7XG4gICAgICBpZiAoaGFzT3duKHZhbHVlLCBpKSkgdGhpcy5maWVsZChuYW1lLCB2YWx1ZVtpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB2YWwgc2hvdWxkIGJlIGRlZmluZWQgbm93XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB1bmRlZmluZWQgPT09IHZhbHVlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCcuZmllbGQobmFtZSwgdmFsKSB2YWwgY2FuIG5vdCBiZSBlbXB0eScpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgLy8gZml4IGh0dHBzOi8vZ2l0aHViLmNvbS9sYWRqcy9zdXBlcmFnZW50L2lzc3Vlcy8xNjgwXG4gIGlmIChvcHRpb25zKSB0aGlzLl9nZXRGb3JtRGF0YSgpLmFwcGVuZChuYW1lLCB2YWx1ZSwgb3B0aW9ucyk7XG4gIGVsc2UgdGhpcy5fZ2V0Rm9ybURhdGEoKS5hcHBlbmQobmFtZSwgdmFsdWUpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBBYm9ydCB0aGUgcmVxdWVzdCwgYW5kIGNsZWFyIHBvdGVudGlhbCB0aW1lb3V0LlxuICpcbiAqIEByZXR1cm4ge1JlcXVlc3R9IHJlcXVlc3RcbiAqIEBhcGkgcHVibGljXG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuX2Fib3J0ZWQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHRoaXMuX2Fib3J0ZWQgPSB0cnVlO1xuICBpZiAodGhpcy54aHIpIHRoaXMueGhyLmFib3J0KCk7IC8vIGJyb3dzZXJcbiAgaWYgKHRoaXMucmVxKSB7XG4gICAgdGhpcy5yZXEuYWJvcnQoKTsgLy8gbm9kZVxuICB9XG5cbiAgdGhpcy5jbGVhclRpbWVvdXQoKTtcbiAgdGhpcy5lbWl0KCdhYm9ydCcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fYXV0aCA9IGZ1bmN0aW9uICh1c2VyLCBwYXNzLCBvcHRpb25zLCBiYXNlNjRFbmNvZGVyKSB7XG4gIHN3aXRjaCAob3B0aW9ucy50eXBlKSB7XG4gICAgY2FzZSAnYmFzaWMnOlxuICAgICAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCBgQmFzaWMgJHtiYXNlNjRFbmNvZGVyKGAke3VzZXJ9OiR7cGFzc31gKX1gKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnYXV0byc6XG4gICAgICB0aGlzLnVzZXJuYW1lID0gdXNlcjtcbiAgICAgIHRoaXMucGFzc3dvcmQgPSBwYXNzO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdiZWFyZXInOiAvLyB1c2FnZSB3b3VsZCBiZSAuYXV0aChhY2Nlc3NUb2tlbiwgeyB0eXBlOiAnYmVhcmVyJyB9KVxuICAgICAgdGhpcy5zZXQoJ0F1dGhvcml6YXRpb24nLCBgQmVhcmVyICR7dXNlcn1gKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbmFibGUgdHJhbnNtaXNzaW9uIG9mIGNvb2tpZXMgd2l0aCB4LWRvbWFpbiByZXF1ZXN0cy5cbiAqXG4gKiBOb3RlIHRoYXQgZm9yIHRoaXMgdG8gd29yayB0aGUgb3JpZ2luIG11c3Qgbm90IGJlXG4gKiB1c2luZyBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiIHdpdGggYSB3aWxkY2FyZCxcbiAqIGFuZCBhbHNvIG11c3Qgc2V0IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIlxuICogdG8gXCJ0cnVlXCIuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvbj10cnVlXSAtIFNldCAnd2l0aENyZWRlbnRpYWxzJyBzdGF0ZVxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS53aXRoQ3JlZGVudGlhbHMgPSBmdW5jdGlvbiAob24pIHtcbiAgLy8gVGhpcyBpcyBicm93c2VyLW9ubHkgZnVuY3Rpb25hbGl0eS4gTm9kZSBzaWRlIGlzIG5vLW9wLlxuICBpZiAob24gPT09IHVuZGVmaW5lZCkgb24gPSB0cnVlO1xuICB0aGlzLl93aXRoQ3JlZGVudGlhbHMgPSBvbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgbWF4IHJlZGlyZWN0cyB0byBgbmAuIERvZXMgbm90aGluZyBpbiBicm93c2VyIFhIUiBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gblxuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5yZWRpcmVjdHMgPSBmdW5jdGlvbiAobikge1xuICB0aGlzLl9tYXhSZWRpcmVjdHMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogTWF4aW11bSBzaXplIG9mIGJ1ZmZlcmVkIHJlc3BvbnNlIGJvZHksIGluIGJ5dGVzLiBDb3VudHMgdW5jb21wcmVzc2VkIHNpemUuXG4gKiBEZWZhdWx0IDIwME1CLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBuIG51bWJlciBvZiBieXRlc1xuICogQHJldHVybiB7UmVxdWVzdH0gZm9yIGNoYWluaW5nXG4gKi9cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5tYXhSZXNwb25zZVNpemUgPSBmdW5jdGlvbiAobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhcmd1bWVudCcpO1xuICB9XG5cbiAgdGhpcy5fbWF4UmVzcG9uc2VTaXplID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIENvbnZlcnQgdG8gYSBwbGFpbiBqYXZhc2NyaXB0IG9iamVjdCAobm90IEpTT04gc3RyaW5nKSBvZiBzY2FsYXIgcHJvcGVydGllcy5cbiAqIE5vdGUgYXMgdGhpcyBtZXRob2QgaXMgZGVzaWduZWQgdG8gcmV0dXJuIGEgdXNlZnVsIG5vbi10aGlzIHZhbHVlLFxuICogaXQgY2Fubm90IGJlIGNoYWluZWQuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBkZXNjcmliaW5nIG1ldGhvZCwgdXJsLCBhbmQgZGF0YSBvZiB0aGlzIHJlcXVlc3RcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICBtZXRob2Q6IHRoaXMubWV0aG9kLFxuICAgIHVybDogdGhpcy51cmwsXG4gICAgZGF0YTogdGhpcy5fZGF0YSxcbiAgICBoZWFkZXJzOiB0aGlzLl9oZWFkZXJcbiAgfTtcbn07XG5cbi8qKlxuICogU2VuZCBgZGF0YWAgYXMgdGhlIHJlcXVlc3QgYm9keSwgZGVmYXVsdGluZyB0aGUgYC50eXBlKClgIHRvIFwianNvblwiIHdoZW5cbiAqIGFuIG9iamVjdCBpcyBnaXZlbi5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgICAvLyBtYW51YWwganNvblxuICogICAgICAgcmVxdWVzdC5wb3N0KCcvdXNlcicpXG4gKiAgICAgICAgIC50eXBlKCdqc29uJylcbiAqICAgICAgICAgLnNlbmQoJ3tcIm5hbWVcIjpcInRqXCJ9JylcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBhdXRvIGpzb25cbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAuc2VuZCh7IG5hbWU6ICd0aicgfSlcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBtYW51YWwgeC13d3ctZm9ybS11cmxlbmNvZGVkXG4gKiAgICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAgLnR5cGUoJ2Zvcm0nKVxuICogICAgICAgICAuc2VuZCgnbmFtZT10aicpXG4gKiAgICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogICAgICAgLy8gYXV0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAqICAgICAgIHJlcXVlc3QucG9zdCgnL3VzZXInKVxuICogICAgICAgICAudHlwZSgnZm9ybScpXG4gKiAgICAgICAgIC5zZW5kKHsgbmFtZTogJ3RqJyB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqICAgICAgIC8vIGRlZmF1bHRzIHRvIHgtd3d3LWZvcm0tdXJsZW5jb2RlZFxuICogICAgICByZXF1ZXN0LnBvc3QoJy91c2VyJylcbiAqICAgICAgICAuc2VuZCgnbmFtZT10b2JpJylcbiAqICAgICAgICAuc2VuZCgnc3BlY2llcz1mZXJyZXQnKVxuICogICAgICAgIC5lbmQoY2FsbGJhY2spXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNvbXBsZXhpdHlcblJlcXVlc3RCYXNlLnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgY29uc3QgaXNPYmplY3RfID0gaXNPYmplY3QoZGF0YSk7XG4gIGxldCB0eXBlID0gdGhpcy5faGVhZGVyWydjb250ZW50LXR5cGUnXTtcblxuICBpZiAodGhpcy5fZm9ybURhdGEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIi5zZW5kKCkgY2FuJ3QgYmUgdXNlZCBpZiAuYXR0YWNoKCkgb3IgLmZpZWxkKCkgaXMgdXNlZC4gUGxlYXNlIHVzZSBvbmx5IC5zZW5kKCkgb3Igb25seSAuZmllbGQoKSAmIC5hdHRhY2goKVwiXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpc09iamVjdF8gJiYgIXRoaXMuX2RhdGEpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgdGhpcy5fZGF0YSA9IFtdO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX2lzSG9zdChkYXRhKSkge1xuICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgIH1cbiAgfSBlbHNlIGlmIChkYXRhICYmIHRoaXMuX2RhdGEgJiYgdGhpcy5faXNIb3N0KHRoaXMuX2RhdGEpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgbWVyZ2UgdGhlc2Ugc2VuZCBjYWxsc1wiKTtcbiAgfVxuXG4gIC8vIG1lcmdlXG4gIGlmIChpc09iamVjdF8gJiYgaXNPYmplY3QodGhpcy5fZGF0YSkpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAodHlwZW9mIGRhdGFba2V5XSA9PSAnYmlnaW50JyAmJiAhZGF0YVtrZXldLnRvSlNPTilcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc2VyaWFsaXplIEJpZ0ludCB2YWx1ZSB0byBqc29uJyk7XG4gICAgICBpZiAoaGFzT3duKGRhdGEsIGtleSkpIHRoaXMuX2RhdGFba2V5XSA9IGRhdGFba2V5XTtcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09ICdiaWdpbnQnKSB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgc2VuZCB2YWx1ZSBvZiB0eXBlIEJpZ0ludFwiKTtcbiAgZWxzZSBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gZGVmYXVsdCB0byB4LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnZm9ybScpO1xuICAgIHR5cGUgPSB0aGlzLl9oZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuICAgIGlmICh0eXBlKSB0eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICBpZiAodHlwZSA9PT0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpIHtcbiAgICAgIHRoaXMuX2RhdGEgPSB0aGlzLl9kYXRhID8gYCR7dGhpcy5fZGF0YX0mJHtkYXRhfWAgOiBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kYXRhID0gKHRoaXMuX2RhdGEgfHwgJycpICsgZGF0YTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZGF0YSA9IGRhdGE7XG4gIH1cblxuICBpZiAoIWlzT2JqZWN0XyB8fCB0aGlzLl9pc0hvc3QoZGF0YSkpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRlZmF1bHQgdG8ganNvblxuICBpZiAoIXR5cGUpIHRoaXMudHlwZSgnanNvbicpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU29ydCBgcXVlcnlzdHJpbmdgIGJ5IHRoZSBzb3J0IGZ1bmN0aW9uXG4gKlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgIC8vIGRlZmF1bHQgb3JkZXJcbiAqICAgICAgIHJlcXVlc3QuZ2V0KCcvdXNlcicpXG4gKiAgICAgICAgIC5xdWVyeSgnbmFtZT1OaWNrJylcbiAqICAgICAgICAgLnF1ZXJ5KCdzZWFyY2g9TWFubnknKVxuICogICAgICAgICAuc29ydFF1ZXJ5KClcbiAqICAgICAgICAgLmVuZChjYWxsYmFjaylcbiAqXG4gKiAgICAgICAvLyBjdXN0b21pemVkIHNvcnQgZnVuY3Rpb25cbiAqICAgICAgIHJlcXVlc3QuZ2V0KCcvdXNlcicpXG4gKiAgICAgICAgIC5xdWVyeSgnbmFtZT1OaWNrJylcbiAqICAgICAgICAgLnF1ZXJ5KCdzZWFyY2g9TWFubnknKVxuICogICAgICAgICAuc29ydFF1ZXJ5KGZ1bmN0aW9uKGEsIGIpe1xuICogICAgICAgICAgIHJldHVybiBhLmxlbmd0aCAtIGIubGVuZ3RoO1xuICogICAgICAgICB9KVxuICogICAgICAgICAuZW5kKGNhbGxiYWNrKVxuICpcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzb3J0XG4gKiBAcmV0dXJuIHtSZXF1ZXN0fSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuUmVxdWVzdEJhc2UucHJvdG90eXBlLnNvcnRRdWVyeSA9IGZ1bmN0aW9uIChzb3J0KSB7XG4gIC8vIF9zb3J0IGRlZmF1bHQgdG8gdHJ1ZSBidXQgb3RoZXJ3aXNlIGNhbiBiZSBhIGZ1bmN0aW9uIG9yIGJvb2xlYW5cbiAgdGhpcy5fc29ydCA9IHR5cGVvZiBzb3J0ID09PSAndW5kZWZpbmVkJyA/IHRydWUgOiBzb3J0O1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ29tcG9zZSBxdWVyeXN0cmluZyB0byBhcHBlbmQgdG8gcmVxLnVybFxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5SZXF1ZXN0QmFzZS5wcm90b3R5cGUuX2ZpbmFsaXplUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHF1ZXJ5ID0gdGhpcy5fcXVlcnkuam9pbignJicpO1xuICBpZiAocXVlcnkpIHtcbiAgICB0aGlzLnVybCArPSAodGhpcy51cmwuaW5jbHVkZXMoJz8nKSA/ICcmJyA6ICc/JykgKyBxdWVyeTtcbiAgfVxuXG4gIHRoaXMuX3F1ZXJ5Lmxlbmd0aCA9IDA7IC8vIE1ha2VzIHRoZSBjYWxsIGlkZW1wb3RlbnRcblxuICBpZiAodGhpcy5fc29ydCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy51cmwuaW5kZXhPZignPycpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBjb25zdCBxdWVyeUFycmF5ID0gdGhpcy51cmwuc2xpY2UoaW5kZXggKyAxKS5zcGxpdCgnJicpO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9zb3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHF1ZXJ5QXJyYXkuc29ydCh0aGlzLl9zb3J0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5QXJyYXkuc29ydCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnVybCA9IHRoaXMudXJsLnNsaWNlKDAsIGluZGV4KSArICc/JyArIHF1ZXJ5QXJyYXkuam9pbignJicpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gRm9yIGJhY2t3YXJkcyBjb21wYXQgb25seVxuUmVxdWVzdEJhc2UucHJvdG90eXBlLl9hcHBlbmRRdWVyeVN0cmluZyA9ICgpID0+IHtcbiAgY29uc29sZS53YXJuKCdVbnN1cHBvcnRlZCcpO1xufTtcblxuLyoqXG4gKiBJbnZva2UgY2FsbGJhY2sgd2l0aCB0aW1lb3V0IGVycm9yLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fdGltZW91dEVycm9yID0gZnVuY3Rpb24gKHJlYXNvbiwgdGltZW91dCwgZXJybm8pIHtcbiAgaWYgKHRoaXMuX2Fib3J0ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihgJHtyZWFzb24gKyB0aW1lb3V0fW1zIGV4Y2VlZGVkYCk7XG4gIGVycm9yLnRpbWVvdXQgPSB0aW1lb3V0O1xuICBlcnJvci5jb2RlID0gJ0VDT05OQUJPUlRFRCc7XG4gIGVycm9yLmVycm5vID0gZXJybm87XG4gIHRoaXMudGltZWRvdXQgPSB0cnVlO1xuICB0aGlzLnRpbWVkb3V0RXJyb3IgPSBlcnJvcjtcbiAgdGhpcy5hYm9ydCgpO1xuICB0aGlzLmNhbGxiYWNrKGVycm9yKTtcbn07XG5cblJlcXVlc3RCYXNlLnByb3RvdHlwZS5fc2V0VGltZW91dHMgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gIC8vIGRlYWRsaW5lXG4gIGlmICh0aGlzLl90aW1lb3V0ICYmICF0aGlzLl90aW1lcikge1xuICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZWxmLl90aW1lb3V0RXJyb3IoJ1RpbWVvdXQgb2YgJywgc2VsZi5fdGltZW91dCwgJ0VUSU1FJyk7XG4gICAgfSwgdGhpcy5fdGltZW91dCk7XG4gIH1cblxuICAvLyByZXNwb25zZSB0aW1lb3V0XG4gIGlmICh0aGlzLl9yZXNwb25zZVRpbWVvdXQgJiYgIXRoaXMuX3Jlc3BvbnNlVGltZW91dFRpbWVyKSB7XG4gICAgdGhpcy5fcmVzcG9uc2VUaW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHNlbGYuX3RpbWVvdXRFcnJvcihcbiAgICAgICAgJ1Jlc3BvbnNlIHRpbWVvdXQgb2YgJyxcbiAgICAgICAgc2VsZi5fcmVzcG9uc2VUaW1lb3V0LFxuICAgICAgICAnRVRJTUVET1VUJ1xuICAgICAgKTtcbiAgICB9LCB0aGlzLl9yZXNwb25zZVRpbWVvdXQpO1xuICB9XG59O1xuIiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbmNvbnN0IHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG4vKipcbiAqIEV4cG9zZSBgUmVzcG9uc2VCYXNlYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3BvbnNlQmFzZTtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBSZXNwb25zZUJhc2VgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gUmVzcG9uc2VCYXNlKCkge31cblxuLyoqXG4gKiBHZXQgY2FzZS1pbnNlbnNpdGl2ZSBgZmllbGRgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaWVsZFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5SZXNwb25zZUJhc2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChmaWVsZCkge1xuICByZXR1cm4gdGhpcy5oZWFkZXJbZmllbGQudG9Mb3dlckNhc2UoKV07XG59O1xuXG4vKipcbiAqIFNldCBoZWFkZXIgcmVsYXRlZCBwcm9wZXJ0aWVzOlxuICpcbiAqICAgLSBgLnR5cGVgIHRoZSBjb250ZW50IHR5cGUgd2l0aG91dCBwYXJhbXNcbiAqXG4gKiBBIHJlc3BvbnNlIG9mIFwiQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluOyBjaGFyc2V0PXV0Zi04XCJcbiAqIHdpbGwgcHJvdmlkZSB5b3Ugd2l0aCBhIGAudHlwZWAgb2YgXCJ0ZXh0L3BsYWluXCIuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGhlYWRlclxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2VCYXNlLnByb3RvdHlwZS5fc2V0SGVhZGVyUHJvcGVydGllcyA9IGZ1bmN0aW9uIChoZWFkZXIpIHtcbiAgLy8gVE9ETzogbW9hciFcbiAgLy8gVE9ETzogbWFrZSB0aGlzIGEgdXRpbFxuXG4gIC8vIGNvbnRlbnQtdHlwZVxuICBjb25zdCBjdCA9IGhlYWRlclsnY29udGVudC10eXBlJ10gfHwgJyc7XG4gIHRoaXMudHlwZSA9IHV0aWxzLnR5cGUoY3QpO1xuXG4gIC8vIHBhcmFtc1xuICBjb25zdCBwYXJhbWV0ZXJzID0gdXRpbHMucGFyYW1zKGN0KTtcbiAgZm9yIChjb25zdCBrZXkgaW4gcGFyYW1ldGVycykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocGFyYW1ldGVycywga2V5KSlcbiAgICAgIHRoaXNba2V5XSA9IHBhcmFtZXRlcnNba2V5XTtcbiAgfVxuXG4gIHRoaXMubGlua3MgPSB7fTtcblxuICAvLyBsaW5rc1xuICB0cnkge1xuICAgIGlmIChoZWFkZXIubGluaykge1xuICAgICAgdGhpcy5saW5rcyA9IHV0aWxzLnBhcnNlTGlua3MoaGVhZGVyLmxpbmspO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgLy8gaWdub3JlXG4gIH1cbn07XG5cbi8qKlxuICogU2V0IGZsYWdzIHN1Y2ggYXMgYC5va2AgYmFzZWQgb24gYHN0YXR1c2AuXG4gKlxuICogRm9yIGV4YW1wbGUgYSAyeHggcmVzcG9uc2Ugd2lsbCBnaXZlIHlvdSBhIGAub2tgIG9mIF9fdHJ1ZV9fXG4gKiB3aGVyZWFzIDV4eCB3aWxsIGJlIF9fZmFsc2VfXyBhbmQgYC5lcnJvcmAgd2lsbCBiZSBfX3RydWVfXy4gVGhlXG4gKiBgLmNsaWVudEVycm9yYCBhbmQgYC5zZXJ2ZXJFcnJvcmAgYXJlIGFsc28gYXZhaWxhYmxlIHRvIGJlIG1vcmVcbiAqIHNwZWNpZmljLCBhbmQgYC5zdGF0dXNUeXBlYCBpcyB0aGUgY2xhc3Mgb2YgZXJyb3IgcmFuZ2luZyBmcm9tIDEuLjVcbiAqIHNvbWV0aW1lcyB1c2VmdWwgZm9yIG1hcHBpbmcgcmVzcG9uZCBjb2xvcnMgZXRjLlxuICpcbiAqIFwic3VnYXJcIiBwcm9wZXJ0aWVzIGFyZSBhbHNvIGRlZmluZWQgZm9yIGNvbW1vbiBjYXNlcy4gQ3VycmVudGx5IHByb3ZpZGluZzpcbiAqXG4gKiAgIC0gLm5vQ29udGVudFxuICogICAtIC5iYWRSZXF1ZXN0XG4gKiAgIC0gLnVuYXV0aG9yaXplZFxuICogICAtIC5ub3RBY2NlcHRhYmxlXG4gKiAgIC0gLm5vdEZvdW5kXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHN0YXR1c1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuUmVzcG9uc2VCYXNlLnByb3RvdHlwZS5fc2V0U3RhdHVzUHJvcGVydGllcyA9IGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgY29uc3QgdHlwZSA9IE1hdGgudHJ1bmMoc3RhdHVzIC8gMTAwKTtcblxuICAvLyBzdGF0dXMgLyBjbGFzc1xuICB0aGlzLnN0YXR1c0NvZGUgPSBzdGF0dXM7XG4gIHRoaXMuc3RhdHVzID0gdGhpcy5zdGF0dXNDb2RlO1xuICB0aGlzLnN0YXR1c1R5cGUgPSB0eXBlO1xuXG4gIC8vIGJhc2ljc1xuICB0aGlzLmluZm8gPSB0eXBlID09PSAxO1xuICB0aGlzLm9rID0gdHlwZSA9PT0gMjtcbiAgdGhpcy5yZWRpcmVjdCA9IHR5cGUgPT09IDM7XG4gIHRoaXMuY2xpZW50RXJyb3IgPSB0eXBlID09PSA0O1xuICB0aGlzLnNlcnZlckVycm9yID0gdHlwZSA9PT0gNTtcbiAgdGhpcy5lcnJvciA9IHR5cGUgPT09IDQgfHwgdHlwZSA9PT0gNSA/IHRoaXMudG9FcnJvcigpIDogZmFsc2U7XG5cbiAgLy8gc3VnYXJcbiAgdGhpcy5jcmVhdGVkID0gc3RhdHVzID09PSAyMDE7XG4gIHRoaXMuYWNjZXB0ZWQgPSBzdGF0dXMgPT09IDIwMjtcbiAgdGhpcy5ub0NvbnRlbnQgPSBzdGF0dXMgPT09IDIwNDtcbiAgdGhpcy5iYWRSZXF1ZXN0ID0gc3RhdHVzID09PSA0MDA7XG4gIHRoaXMudW5hdXRob3JpemVkID0gc3RhdHVzID09PSA0MDE7XG4gIHRoaXMubm90QWNjZXB0YWJsZSA9IHN0YXR1cyA9PT0gNDA2O1xuICB0aGlzLmZvcmJpZGRlbiA9IHN0YXR1cyA9PT0gNDAzO1xuICB0aGlzLm5vdEZvdW5kID0gc3RhdHVzID09PSA0MDQ7XG4gIHRoaXMudW5wcm9jZXNzYWJsZUVudGl0eSA9IHN0YXR1cyA9PT0gNDIyO1xufTtcbiIsIlxuLyoqXG4gKiBSZXR1cm4gdGhlIG1pbWUgdHlwZSBmb3IgdGhlIGdpdmVuIGBzdHJgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMudHlwZSA9IChzdHJpbmdfKSA9PiBzdHJpbmdfLnNwbGl0KC8gKjsgKi8pLnNoaWZ0KCk7XG5cbi8qKlxuICogUmV0dXJuIGhlYWRlciBmaWVsZCBwYXJhbWV0ZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucGFyYW1zID0gKHZhbHVlKSA9PiB7XG4gIGNvbnN0IG9iamVjdCA9IHt9O1xuICBmb3IgKGNvbnN0IHN0cmluZ18gb2YgdmFsdWUuc3BsaXQoLyAqOyAqLykpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHN0cmluZ18uc3BsaXQoLyAqPSAqLyk7XG4gICAgY29uc3Qga2V5ID0gcGFydHMuc2hpZnQoKTtcbiAgICBjb25zdCB2YWx1ZSA9IHBhcnRzLnNoaWZ0KCk7XG5cbiAgICBpZiAoa2V5ICYmIHZhbHVlKSBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIG9iamVjdDtcbn07XG5cbi8qKlxuICogUGFyc2UgTGluayBoZWFkZXIgZmllbGRzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMucGFyc2VMaW5rcyA9ICh2YWx1ZSkgPT4ge1xuICBjb25zdCBvYmplY3QgPSB7fTtcbiAgZm9yIChjb25zdCBzdHJpbmdfIG9mIHZhbHVlLnNwbGl0KC8gKiwgKi8pKSB7XG4gICAgY29uc3QgcGFydHMgPSBzdHJpbmdfLnNwbGl0KC8gKjsgKi8pO1xuICAgIGNvbnN0IHVybCA9IHBhcnRzWzBdLnNsaWNlKDEsIC0xKTtcbiAgICBjb25zdCByZWwgPSBwYXJ0c1sxXS5zcGxpdCgvICo9ICovKVsxXS5zbGljZSgxLCAtMSk7XG4gICAgb2JqZWN0W3JlbF0gPSB1cmw7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufTtcblxuLyoqXG4gKiBTdHJpcCBjb250ZW50IHJlbGF0ZWQgZmllbGRzIGZyb20gYGhlYWRlcmAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGhlYWRlclxuICogQHJldHVybiB7T2JqZWN0fSBoZWFkZXJcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmV4cG9ydHMuY2xlYW5IZWFkZXIgPSAoaGVhZGVyLCBjaGFuZ2VzT3JpZ2luKSA9PiB7XG4gIGRlbGV0ZSBoZWFkZXJbJ2NvbnRlbnQtdHlwZSddO1xuICBkZWxldGUgaGVhZGVyWydjb250ZW50LWxlbmd0aCddO1xuICBkZWxldGUgaGVhZGVyWyd0cmFuc2Zlci1lbmNvZGluZyddO1xuICBkZWxldGUgaGVhZGVyLmhvc3Q7XG4gIC8vIHNlY3VpcnR5XG4gIGlmIChjaGFuZ2VzT3JpZ2luKSB7XG4gICAgZGVsZXRlIGhlYWRlci5hdXRob3JpemF0aW9uO1xuICAgIGRlbGV0ZSBoZWFkZXIuY29va2llO1xuICB9XG5cbiAgcmV0dXJuIGhlYWRlcjtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgYG9iamAgaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuZXhwb3J0cy5pc09iamVjdCA9IChvYmplY3QpID0+IHtcbiAgcmV0dXJuIG9iamVjdCAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0Jztcbn07XG5cbi8qKlxuICogT2JqZWN0Lmhhc093biBmYWxsYmFjay9wb2x5ZmlsbC5cbiAqXG4gKiBAdHlwZSB7KG9iamVjdDogb2JqZWN0LCBwcm9wZXJ0eTogc3RyaW5nKSA9PiBib29sZWFufSBvYmplY3RcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5leHBvcnRzLmhhc093biA9XG4gIE9iamVjdC5oYXNPd24gfHxcbiAgZnVuY3Rpb24gKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobmV3IE9iamVjdChvYmplY3QpLCBwcm9wZXJ0eSk7XG4gIH07XG5cbmV4cG9ydHMubWl4aW4gPSAodGFyZ2V0LCBzb3VyY2UpID0+IHtcbiAgZm9yIChjb25zdCBrZXkgaW4gc291cmNlKSB7XG4gICAgaWYgKGV4cG9ydHMuaGFzT3duKHNvdXJjZSwga2V5KSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHJlc3BvbnNlIGlzIGNvbXByZXNzZWQgdXNpbmcgR3ppcCBvciBEZWZsYXRlLlxuICogQHBhcmFtIHtPYmplY3R9IHJlc1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuXG5leHBvcnRzLmlzR3ppcE9yRGVmbGF0ZUVuY29kaW5nID0gKHJlcykgPT4ge1xuICByZXR1cm4gbmV3IFJlZ0V4cCgvXlxccyooPzpkZWZsYXRlfGd6aXApXFxzKiQvKS50ZXN0KHJlcy5oZWFkZXJzWydjb250ZW50LWVuY29kaW5nJ10pO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgcmVzcG9uc2UgaXMgY29tcHJlc3NlZCB1c2luZyBCcm90bGkuXG4gKiBAcGFyYW0ge09iamVjdH0gcmVzXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5cbmV4cG9ydHMuaXNCcm90bGlFbmNvZGluZyA9IChyZXMpID0+IHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoL15cXHMqKD86YnIpXFxzKiQvKS50ZXN0KHJlcy5oZWFkZXJzWydjb250ZW50LWVuY29kaW5nJ10pO1xufTtcbiIsIi8qIChpZ25vcmVkKSAqLyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oOTg3KTtcbiIsIiJdLCJuYW1lcyI6WyJzdXBwb3J0ZWRMb2FkZXJzIiwiZmlsZSIsInJlcXVpcmUiLCJodHRwIiwiaHR0cHMiLCJkZWZhdWx0TG9hZGVyIiwid2luZG93IiwiaW1wb3J0U2NyaXB0cyIsIlByb21pc2UiLCJnZXRTY2hlbWUiLCJsb2NhdGlvbiIsImluZGV4T2YiLCJzcGxpdCIsImdldExvYWRlciIsInNjaGVtZSIsImxvYWRlciIsIkVycm9yIiwibW9kdWxlIiwiZXhwb3J0cyIsImxvYWQiLCJvcHRpb25zIiwiYWxsVGFza3MiLCJyZXNvbHZlIiwidGhlbiIsIlR5cGVFcnJvciIsInByb2Nlc3NDb250ZW50IiwicmVqZWN0IiwiZXJyIiwiZG9jdW1lbnQiLCJyZXMiLCJ0ZXh0IiwicHJvY2Vzc2VkIiwidW5zdXBwb3J0ZWRFcnJvciIsImdldEJhc2UiLCJmbiIsImFyZ3VtZW50cyIsImxlbmd0aCIsInJlcXVlc3QiLCJzdXBwb3J0ZWRIdHRwTWV0aG9kcyIsImNhbGxiYWNrIiwicmVhbE1ldGhvZCIsIm1ldGhvZCIsInRvTG93ZXJDYXNlIiwicmVhbFJlcXVlc3QiLCJtYWtlUmVxdWVzdCIsInJlcSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsInByb2Nlc3MiLCJidWZmZXIiLCJlbmQiLCJlcnIyIiwidW5kZWZpbmVkIiwic2xpY2UiLCJqb2luIiwicHJlcGFyZVJlcXVlc3QiLCJHZXRJbnRyaW5zaWMiLCJjYWxsQmluZCIsIiRpbmRleE9mIiwiY2FsbEJvdW5kSW50cmluc2ljIiwibmFtZSIsImFsbG93TWlzc2luZyIsImludHJpbnNpYyIsImJpbmQiLCJzZXRGdW5jdGlvbkxlbmd0aCIsIiRUeXBlRXJyb3IiLCIkYXBwbHkiLCIkY2FsbCIsIiRyZWZsZWN0QXBwbHkiLCIkZGVmaW5lUHJvcGVydHkiLCIkbWF4Iiwib3JpZ2luYWxGdW5jdGlvbiIsImZ1bmMiLCJhcHBseUJpbmQiLCJ2YWx1ZSIsImFwcGx5IiwiRW1pdHRlciIsIm9iaiIsIm1peGluIiwia2V5Iiwib24iLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJfY2FsbGJhY2tzIiwicHVzaCIsIm9uY2UiLCJvZmYiLCJyZW1vdmVMaXN0ZW5lciIsInJlbW92ZUFsbExpc3RlbmVycyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjYWxsYmFja3MiLCJjYiIsImkiLCJzcGxpY2UiLCJlbWl0IiwiYXJncyIsIkFycmF5IiwibGVuIiwibGlzdGVuZXJzIiwiaGFzTGlzdGVuZXJzIiwiJFN5bnRheEVycm9yIiwiZ29wZCIsImRlZmluZURhdGFQcm9wZXJ0eSIsInByb3BlcnR5Iiwibm9uRW51bWVyYWJsZSIsIm5vbldyaXRhYmxlIiwibm9uQ29uZmlndXJhYmxlIiwibG9vc2UiLCJkZXNjIiwiY29uZmlndXJhYmxlIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiZSIsIkV2YWxFcnJvciIsIlJhbmdlRXJyb3IiLCJSZWZlcmVuY2VFcnJvciIsIlN5bnRheEVycm9yIiwiVVJJRXJyb3IiLCJzdHJpbmdpZnkiLCJkZWZhdWx0Iiwic3RhYmxlIiwiZGV0ZXJtaW5pc3RpY1N0cmluZ2lmeSIsInN0YWJsZVN0cmluZ2lmeSIsIkxJTUlUX1JFUExBQ0VfTk9ERSIsIkNJUkNVTEFSX1JFUExBQ0VfTk9ERSIsImFyciIsInJlcGxhY2VyU3RhY2siLCJkZWZhdWx0T3B0aW9ucyIsImRlcHRoTGltaXQiLCJOdW1iZXIiLCJNQVhfU0FGRV9JTlRFR0VSIiwiZWRnZXNMaW1pdCIsInJlcGxhY2VyIiwic3BhY2VyIiwiZGVjaXJjIiwiSlNPTiIsInJlcGxhY2VHZXR0ZXJWYWx1ZXMiLCJfIiwicGFydCIsInBvcCIsImRlZmluZVByb3BlcnR5Iiwic2V0UmVwbGFjZSIsInJlcGxhY2UiLCJ2YWwiLCJrIiwicGFyZW50IiwicHJvcGVydHlEZXNjcmlwdG9yIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZ2V0IiwiZWRnZUluZGV4Iiwic3RhY2siLCJkZXB0aCIsImlzQXJyYXkiLCJrZXlzIiwiY29tcGFyZUZ1bmN0aW9uIiwiYSIsImIiLCJ0bXAiLCJkZXRlcm1pbmlzdGljRGVjaXJjIiwidG9KU09OIiwic29ydCIsInYiLCJFUlJPUl9NRVNTQUdFIiwidG9TdHIiLCJtYXgiLCJNYXRoIiwiZnVuY1R5cGUiLCJjb25jYXR0eSIsImoiLCJzbGljeSIsImFyckxpa2UiLCJvZmZzZXQiLCJqb2lueSIsImpvaW5lciIsInN0ciIsInRoYXQiLCJ0YXJnZXQiLCJib3VuZCIsImJpbmRlciIsInJlc3VsdCIsImJvdW5kTGVuZ3RoIiwiYm91bmRBcmdzIiwiRnVuY3Rpb24iLCJFbXB0eSIsImltcGxlbWVudGF0aW9uIiwiJEVycm9yIiwiJEV2YWxFcnJvciIsIiRSYW5nZUVycm9yIiwiJFJlZmVyZW5jZUVycm9yIiwiJFVSSUVycm9yIiwiJEZ1bmN0aW9uIiwiZ2V0RXZhbGxlZENvbnN0cnVjdG9yIiwiZXhwcmVzc2lvblN5bnRheCIsIiRnT1BEIiwidGhyb3dUeXBlRXJyb3IiLCJUaHJvd1R5cGVFcnJvciIsImNhbGxlZSIsImNhbGxlZVRocm93cyIsImdPUER0aHJvd3MiLCJoYXNTeW1ib2xzIiwiaGFzUHJvdG8iLCJnZXRQcm90byIsImdldFByb3RvdHlwZU9mIiwieCIsIl9fcHJvdG9fXyIsIm5lZWRzRXZhbCIsIlR5cGVkQXJyYXkiLCJVaW50OEFycmF5IiwiSU5UUklOU0lDUyIsIkFnZ3JlZ2F0ZUVycm9yIiwiQXJyYXlCdWZmZXIiLCJTeW1ib2wiLCJpdGVyYXRvciIsIkF0b21pY3MiLCJCaWdJbnQiLCJCaWdJbnQ2NEFycmF5IiwiQmlnVWludDY0QXJyYXkiLCJCb29sZWFuIiwiRGF0YVZpZXciLCJEYXRlIiwiZGVjb2RlVVJJIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiZW5jb2RlVVJJIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiZXZhbCIsIkZsb2F0MzJBcnJheSIsIkZsb2F0NjRBcnJheSIsIkZpbmFsaXphdGlvblJlZ2lzdHJ5IiwiSW50OEFycmF5IiwiSW50MTZBcnJheSIsIkludDMyQXJyYXkiLCJpc0Zpbml0ZSIsImlzTmFOIiwiTWFwIiwicGFyc2VGbG9hdCIsInBhcnNlSW50IiwiUHJveHkiLCJSZWZsZWN0IiwiUmVnRXhwIiwiU2V0IiwiU2hhcmVkQXJyYXlCdWZmZXIiLCJTdHJpbmciLCJVaW50OENsYW1wZWRBcnJheSIsIlVpbnQxNkFycmF5IiwiVWludDMyQXJyYXkiLCJXZWFrTWFwIiwiV2Vha1JlZiIsIldlYWtTZXQiLCJlcnJvciIsImVycm9yUHJvdG8iLCJkb0V2YWwiLCJnZW4iLCJMRUdBQ1lfQUxJQVNFUyIsImhhc093biIsIiRjb25jYXQiLCJjb25jYXQiLCIkc3BsaWNlQXBwbHkiLCIkcmVwbGFjZSIsIiRzdHJTbGljZSIsIiRleGVjIiwiZXhlYyIsInJlUHJvcE5hbWUiLCJyZUVzY2FwZUNoYXIiLCJzdHJpbmdUb1BhdGgiLCJzdHJpbmciLCJmaXJzdCIsImxhc3QiLCJtYXRjaCIsIm51bWJlciIsInF1b3RlIiwic3ViU3RyaW5nIiwiZ2V0QmFzZUludHJpbnNpYyIsImludHJpbnNpY05hbWUiLCJhbGlhcyIsInBhcnRzIiwiaW50cmluc2ljQmFzZU5hbWUiLCJpbnRyaW5zaWNSZWFsTmFtZSIsInNraXBGdXJ0aGVyQ2FjaGluZyIsImlzT3duIiwiaGFzUHJvcGVydHlEZXNjcmlwdG9ycyIsImhhc0FycmF5TGVuZ3RoRGVmaW5lQnVnIiwidGVzdCIsImZvbyIsIiRPYmplY3QiLCJvcmlnU3ltYm9sIiwiaGFzU3ltYm9sU2hhbSIsImhhc05hdGl2ZVN5bWJvbHMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzeW0iLCJzeW1PYmoiLCJzeW1WYWwiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwic3ltcyIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwiZGVzY3JpcHRvciIsIiRoYXNPd24iLCJoYXNPd25Qcm9wZXJ0eSIsIlVNRCIsImNvbnRleHQiLCJkZWZpbml0aW9uIiwiZGVmaW5lIiwiYW1kIiwiJEFNRCQiLCJnbG9iYWwiLCJERUYiLCJidWlsdEluUHJvcCIsImN5Y2xlIiwic2NoZWR1bGluZ19xdWV1ZSIsIlRvU3RyaW5nIiwidGltZXIiLCJzZXRJbW1lZGlhdGUiLCJzZXRUaW1lb3V0IiwiY29uZmlnIiwiUXVldWUiLCJpdGVtIiwiSXRlbSIsInNlbGYiLCJuZXh0IiwiYWRkIiwiZHJhaW4iLCJmIiwic2NoZWR1bGUiLCJpc1RoZW5hYmxlIiwibyIsIl90aGVuIiwib190eXBlIiwibm90aWZ5IiwiY2hhaW4iLCJub3RpZnlJc29sYXRlZCIsInN0YXRlIiwic3VjY2VzcyIsImZhaWx1cmUiLCJyZXQiLCJtc2ciLCJwcm9taXNlIiwidHJpZ2dlcmVkIiwiZGVmIiwiZGVmX3dyYXBwZXIiLCJNYWtlRGVmV3JhcHBlciIsIiRyZXNvbHZlJCIsIiRyZWplY3QkIiwiaXRlcmF0ZVByb21pc2VzIiwiQ29uc3RydWN0b3IiLCJyZXNvbHZlciIsInJlamVjdGVyIiwiaWR4IiwiSUlGRSIsIiRyZXNvbHZlciQiLCJNYWtlRGVmIiwiZXhlY3V0b3IiLCJfX05QT19fIiwiY29uc3RydWN0b3IiLCJleHRyYWN0Q2hhaW4iLCIkY2F0Y2gkIiwicHVibGljUmVzb2x2ZSIsInB1YmxpY1JlamVjdCIsIlByb21pc2VQcm90b3R5cGUiLCJQcm9taXNlJHJlc29sdmUiLCJQcm9taXNlJHJlamVjdCIsIlByb21pc2UkYWxsIiwibXNncyIsImNvdW50IiwiUHJvbWlzZSRyYWNlIiwiaGFzTWFwIiwibWFwU2l6ZURlc2NyaXB0b3IiLCJtYXBTaXplIiwibWFwRm9yRWFjaCIsImZvckVhY2giLCJoYXNTZXQiLCJzZXRTaXplRGVzY3JpcHRvciIsInNldFNpemUiLCJzZXRGb3JFYWNoIiwiaGFzV2Vha01hcCIsIndlYWtNYXBIYXMiLCJoYXMiLCJoYXNXZWFrU2V0Iiwid2Vha1NldEhhcyIsImhhc1dlYWtSZWYiLCJ3ZWFrUmVmRGVyZWYiLCJkZXJlZiIsImJvb2xlYW5WYWx1ZU9mIiwidmFsdWVPZiIsIm9iamVjdFRvU3RyaW5nIiwiZnVuY3Rpb25Ub1N0cmluZyIsIiRtYXRjaCIsIiRzbGljZSIsIiR0b1VwcGVyQ2FzZSIsInRvVXBwZXJDYXNlIiwiJHRvTG93ZXJDYXNlIiwiJHRlc3QiLCIkam9pbiIsIiRhcnJTbGljZSIsIiRmbG9vciIsImZsb29yIiwiYmlnSW50VmFsdWVPZiIsImdPUFMiLCJzeW1Ub1N0cmluZyIsImhhc1NoYW1tZWRTeW1ib2xzIiwidG9TdHJpbmdUYWciLCJpc0VudW1lcmFibGUiLCJnUE8iLCJPIiwiYWRkTnVtZXJpY1NlcGFyYXRvciIsIm51bSIsIkluZmluaXR5Iiwic2VwUmVnZXgiLCJpbnQiLCJpbnRTdHIiLCJkZWMiLCJ1dGlsSW5zcGVjdCIsImluc3BlY3RDdXN0b20iLCJjdXN0b20iLCJpbnNwZWN0U3ltYm9sIiwiaXNTeW1ib2wiLCJpbnNwZWN0XyIsInNlZW4iLCJvcHRzIiwicXVvdGVTdHlsZSIsIm1heFN0cmluZ0xlbmd0aCIsImN1c3RvbUluc3BlY3QiLCJpbmRlbnQiLCJudW1lcmljU2VwYXJhdG9yIiwiaW5zcGVjdFN0cmluZyIsImJpZ0ludFN0ciIsIm1heERlcHRoIiwiZ2V0SW5kZW50IiwiaW5zcGVjdCIsImZyb20iLCJub0luZGVudCIsIm5ld09wdHMiLCJpc1JlZ0V4cCIsIm5hbWVPZiIsImFyck9iaktleXMiLCJzeW1TdHJpbmciLCJtYXJrQm94ZWQiLCJpc0VsZW1lbnQiLCJzIiwibm9kZU5hbWUiLCJhdHRycyIsImF0dHJpYnV0ZXMiLCJ3cmFwUXVvdGVzIiwiY2hpbGROb2RlcyIsInhzIiwic2luZ2xlTGluZVZhbHVlcyIsImluZGVudGVkSm9pbiIsImlzRXJyb3IiLCJjYXVzZSIsImlzTWFwIiwibWFwUGFydHMiLCJjb2xsZWN0aW9uT2YiLCJpc1NldCIsInNldFBhcnRzIiwiaXNXZWFrTWFwIiwid2Vha0NvbGxlY3Rpb25PZiIsImlzV2Vha1NldCIsImlzV2Vha1JlZiIsImlzTnVtYmVyIiwiaXNCaWdJbnQiLCJpc0Jvb2xlYW4iLCJpc1N0cmluZyIsImdsb2JhbFRoaXMiLCJpc0RhdGUiLCJ5cyIsImlzUGxhaW5PYmplY3QiLCJwcm90b1RhZyIsInN0cmluZ1RhZyIsImNvbnN0cnVjdG9yVGFnIiwidGFnIiwiZGVmYXVsdFN0eWxlIiwicXVvdGVDaGFyIiwibSIsImwiLCJIVE1MRWxlbWVudCIsImdldEF0dHJpYnV0ZSIsInJlbWFpbmluZyIsInRyYWlsZXIiLCJsb3dieXRlIiwiYyIsIm4iLCJjaGFyQ29kZUF0IiwidHlwZSIsInNpemUiLCJlbnRyaWVzIiwiam9pbmVkRW50cmllcyIsImJhc2VJbmRlbnQiLCJiYXNlIiwicHJldiIsImxpbmVKb2luZXIiLCJpc0FyciIsInN5bU1hcCIsInBlcmNlbnRUd2VudGllcyIsIkZvcm1hdCIsIlJGQzE3MzgiLCJSRkMzOTg2IiwiZm9ybWF0dGVycyIsInBhcnNlIiwiZm9ybWF0cyIsInV0aWxzIiwiZGVmYXVsdHMiLCJhbGxvd0RvdHMiLCJhbGxvd0VtcHR5QXJyYXlzIiwiYWxsb3dQcm90b3R5cGVzIiwiYWxsb3dTcGFyc2UiLCJhcnJheUxpbWl0IiwiY2hhcnNldCIsImNoYXJzZXRTZW50aW5lbCIsImNvbW1hIiwiZGVjb2RlRG90SW5LZXlzIiwiZGVjb2RlciIsImRlY29kZSIsImRlbGltaXRlciIsImR1cGxpY2F0ZXMiLCJpZ25vcmVRdWVyeVByZWZpeCIsImludGVycHJldE51bWVyaWNFbnRpdGllcyIsInBhcmFtZXRlckxpbWl0IiwicGFyc2VBcnJheXMiLCJwbGFpbk9iamVjdHMiLCJzdHJpY3REZXB0aCIsInN0cmljdE51bGxIYW5kbGluZyIsIiQwIiwibnVtYmVyU3RyIiwiZnJvbUNoYXJDb2RlIiwicGFyc2VBcnJheVZhbHVlIiwiaXNvU2VudGluZWwiLCJwYXJzZVZhbHVlcyIsInBhcnNlUXVlcnlTdHJpbmdWYWx1ZXMiLCJjbGVhblN0ciIsImxpbWl0Iiwic2tpcEluZGV4IiwiYnJhY2tldEVxdWFsc1BvcyIsInBvcyIsIm1heWJlTWFwIiwiZW5jb2RlZFZhbCIsImV4aXN0aW5nIiwiY29tYmluZSIsInBhcnNlT2JqZWN0IiwidmFsdWVzUGFyc2VkIiwibGVhZiIsInJvb3QiLCJjcmVhdGUiLCJjbGVhblJvb3QiLCJjaGFyQXQiLCJkZWNvZGVkUm9vdCIsImluZGV4IiwicGFyc2VLZXlzIiwicGFyc2VRdWVyeVN0cmluZ0tleXMiLCJnaXZlbktleSIsImJyYWNrZXRzIiwiY2hpbGQiLCJzZWdtZW50Iiwibm9ybWFsaXplUGFyc2VPcHRpb25zIiwidGVtcE9iaiIsIm5ld09iaiIsIm1lcmdlIiwiY29tcGFjdCIsImdldFNpZGVDaGFubmVsIiwiYXJyYXlQcmVmaXhHZW5lcmF0b3JzIiwicHJlZml4IiwiaW5kaWNlcyIsInJlcGVhdCIsInB1c2hUb0FycmF5IiwidmFsdWVPckFycmF5IiwidG9JU08iLCJ0b0lTT1N0cmluZyIsImRlZmF1bHRGb3JtYXQiLCJhZGRRdWVyeVByZWZpeCIsImFycmF5Rm9ybWF0IiwiZW5jb2RlIiwiZW5jb2RlRG90SW5LZXlzIiwiZW5jb2RlciIsImVuY29kZVZhbHVlc09ubHkiLCJmb3JtYXQiLCJmb3JtYXR0ZXIiLCJzZXJpYWxpemVEYXRlIiwiZGF0ZSIsInNraXBOdWxscyIsImlzTm9uTnVsbGlzaFByaW1pdGl2ZSIsInNlbnRpbmVsIiwib2JqZWN0IiwiZ2VuZXJhdGVBcnJheVByZWZpeCIsImNvbW1hUm91bmRUcmlwIiwiZmlsdGVyIiwic2lkZUNoYW5uZWwiLCJ0bXBTYyIsInN0ZXAiLCJmaW5kRmxhZyIsImlzQnVmZmVyIiwia2V5VmFsdWUiLCJ2YWx1ZXMiLCJvYmpLZXlzIiwiZW5jb2RlZFByZWZpeCIsImFkanVzdGVkUHJlZml4IiwiZW5jb2RlZEtleSIsImtleVByZWZpeCIsInNldCIsInZhbHVlU2lkZUNoYW5uZWwiLCJub3JtYWxpemVTdHJpbmdpZnlPcHRpb25zIiwiam9pbmVkIiwiaGV4VGFibGUiLCJhcnJheSIsImNvbXBhY3RRdWV1ZSIsInF1ZXVlIiwicHJvcCIsImNvbXBhY3RlZCIsImFycmF5VG9PYmplY3QiLCJzb3VyY2UiLCJtZXJnZVRhcmdldCIsInRhcmdldEl0ZW0iLCJyZWR1Y2UiLCJhY2MiLCJhc3NpZ24iLCJhc3NpZ25TaW5nbGVTb3VyY2UiLCJzdHJXaXRob3V0UGx1cyIsInVuZXNjYXBlIiwiZGVmYXVsdEVuY29kZXIiLCJraW5kIiwiZXNjYXBlIiwib3V0IiwicmVmcyIsIm1hcHBlZCIsImhhc0Rlc2NyaXB0b3JzIiwiZ09QRCIsImZ1bmN0aW9uTGVuZ3RoSXNDb25maWd1cmFibGUiLCJmdW5jdGlvbkxlbmd0aElzV3JpdGFibGUiLCJjYWxsQm91bmQiLCIkV2Vha01hcCIsIiRNYXAiLCIkd2Vha01hcEdldCIsIiR3ZWFrTWFwU2V0IiwiJHdlYWtNYXBIYXMiLCIkbWFwR2V0IiwiJG1hcFNldCIsIiRtYXBIYXMiLCJsaXN0R2V0Tm9kZSIsImxpc3QiLCJjdXJyIiwibGlzdEdldCIsIm9iamVjdHMiLCJub2RlIiwibGlzdFNldCIsImxpc3RIYXMiLCIkd20iLCIkbSIsIiRvIiwiY2hhbm5lbCIsImFzc2VydCIsIkFnZW50IiwiX2RlZmF1bHRzIiwiY29uc29sZSIsIndhcm4iLCJzYWZlU3RyaW5naWZ5IiwicXMiLCJSZXF1ZXN0QmFzZSIsImlzT2JqZWN0IiwiUmVzcG9uc2VCYXNlIiwibm9vcCIsInVybCIsIlJlcXVlc3QiLCJnZXRYSFIiLCJYTUxIdHRwUmVxdWVzdCIsInRyaW0iLCJzZXJpYWxpemUiLCJwYWlycyIsInB1c2hFbmNvZGVkS2V5VmFsdWVQYWlyIiwic3Via2V5Iiwic2VyaWFsaXplT2JqZWN0IiwicGFyc2VTdHJpbmciLCJzdHJpbmdfIiwicGFpciIsImxlbmd0aF8iLCJ0eXBlcyIsImh0bWwiLCJqc29uIiwieG1sIiwidXJsZW5jb2RlZCIsImZvcm0iLCJwYXJzZUhlYWRlciIsImxpbmVzIiwiZmllbGRzIiwibGluZSIsImZpZWxkIiwiaXNKU09OIiwibWltZSIsIlJlc3BvbnNlIiwicmVxdWVzdF8iLCJ4aHIiLCJyZXNwb25zZVR5cGUiLCJyZXNwb25zZVRleHQiLCJzdGF0dXNUZXh0Iiwic3RhdHVzIiwiX3NldFN0YXR1c1Byb3BlcnRpZXMiLCJoZWFkZXJzIiwiZ2V0QWxsUmVzcG9uc2VIZWFkZXJzIiwiaGVhZGVyIiwiZ2V0UmVzcG9uc2VIZWFkZXIiLCJfc2V0SGVhZGVyUHJvcGVydGllcyIsIl9yZXNwb25zZVR5cGUiLCJib2R5IiwicmVzcG9uc2UiLCJfcGFyc2VCb2R5IiwiX3BhcnNlciIsInRvRXJyb3IiLCJtZXNzYWdlIiwiX3F1ZXJ5IiwiX2hlYWRlciIsIm9yaWdpbmFsIiwicmF3UmVzcG9uc2UiLCJzdGF0dXNDb2RlIiwibmV3X2Vycm9yIiwiX2lzUmVzcG9uc2VPSyIsImFjY2VwdCIsImF1dGgiLCJ1c2VyIiwicGFzcyIsImJ0b2EiLCJfYXV0aCIsInF1ZXJ5IiwiYXR0YWNoIiwiX2RhdGEiLCJfZ2V0Rm9ybURhdGEiLCJhcHBlbmQiLCJfZm9ybURhdGEiLCJGb3JtRGF0YSIsIl9zaG91bGRSZXRyeSIsIl9yZXRyeSIsIl9jYWxsYmFjayIsImNsZWFyVGltZW91dCIsIl9tYXhSZXRyaWVzIiwicmV0cmllcyIsIl9yZXRyaWVzIiwiY3Jvc3NEb21haW5FcnJvciIsImNyb3NzRG9tYWluIiwiYWdlbnQiLCJjYSIsIndyaXRlIiwicGlwZSIsIl9pc0hvc3QiLCJfZW5kQ2FsbGVkIiwiX2ZpbmFsaXplUXVlcnlTdHJpbmciLCJfZW5kIiwiX3NldFVwbG9hZFRpbWVvdXQiLCJfdXBsb2FkVGltZW91dCIsIl91cGxvYWRUaW1lb3V0VGltZXIiLCJfdGltZW91dEVycm9yIiwiX2Fib3J0ZWQiLCJkYXRhIiwiX3NldFRpbWVvdXRzIiwicmVhZHlTdGF0ZSIsIl9yZXNwb25zZVRpbWVvdXRUaW1lciIsInRpbWVkb3V0IiwiaGFuZGxlUHJvZ3Jlc3MiLCJkaXJlY3Rpb24iLCJ0b3RhbCIsInBlcmNlbnQiLCJsb2FkZWQiLCJ1cGxvYWQiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwib3BlbiIsIl93aXRoQ3JlZGVudGlhbHMiLCJ3aXRoQ3JlZGVudGlhbHMiLCJjb250ZW50VHlwZSIsIl9zZXJpYWxpemVyIiwic2V0UmVxdWVzdEhlYWRlciIsInNlbmQiLCJfc2V0RGVmYXVsdHMiLCJkZWwiLCJkZWxldGUiLCJoZWFkIiwicGF0Y2giLCJwb3N0IiwicHV0IiwiX3RpbWVyIiwidGltZW91dCIsIl90aW1lb3V0IiwiX3Jlc3BvbnNlVGltZW91dCIsIm9wdGlvbiIsImRlYWRsaW5lIiwicmV0cnkiLCJfcmV0cnlDYWxsYmFjayIsIkVSUk9SX0NPREVTIiwiU1RBVFVTX0NPREVTIiwib3ZlcnJpZGUiLCJjb2RlIiwidGltZWRvdXRFcnJvciIsIl9mdWxsZmlsbGVkUHJvbWlzZSIsImNhdGNoIiwidXNlIiwib2siLCJfb2tDYWxsYmFjayIsImdldEhlYWRlciIsInVuc2V0IiwiYWJvcnQiLCJiYXNlNjRFbmNvZGVyIiwicmVkaXJlY3RzIiwiX21heFJlZGlyZWN0cyIsIm1heFJlc3BvbnNlU2l6ZSIsIl9tYXhSZXNwb25zZVNpemUiLCJpc09iamVjdF8iLCJzb3J0UXVlcnkiLCJfc29ydCIsImluY2x1ZGVzIiwicXVlcnlBcnJheSIsIl9hcHBlbmRRdWVyeVN0cmluZyIsInJlYXNvbiIsImVycm5vIiwiY3QiLCJwYXJhbWV0ZXJzIiwicGFyYW1zIiwibGlua3MiLCJsaW5rIiwicGFyc2VMaW5rcyIsInRydW5jIiwic3RhdHVzVHlwZSIsImluZm8iLCJyZWRpcmVjdCIsImNsaWVudEVycm9yIiwic2VydmVyRXJyb3IiLCJjcmVhdGVkIiwiYWNjZXB0ZWQiLCJub0NvbnRlbnQiLCJiYWRSZXF1ZXN0IiwidW5hdXRob3JpemVkIiwibm90QWNjZXB0YWJsZSIsImZvcmJpZGRlbiIsIm5vdEZvdW5kIiwidW5wcm9jZXNzYWJsZUVudGl0eSIsInNoaWZ0IiwicmVsIiwiY2xlYW5IZWFkZXIiLCJjaGFuZ2VzT3JpZ2luIiwiaG9zdCIsImF1dGhvcml6YXRpb24iLCJjb29raWUiLCJpc0d6aXBPckRlZmxhdGVFbmNvZGluZyIsImlzQnJvdGxpRW5jb2RpbmciXSwic291cmNlUm9vdCI6IiJ9