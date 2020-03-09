// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../node_modules/light-trails/dist/light-trails.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valChain = exports.val = exports.trail = exports.text = exports.shouldSkipFrame = exports.setCssValue = exports.set = exports.sequence = exports.pause = exports.parallel = exports.linear = exports.lightTrails = exports.htmlElementRenderer = exports.fromTo = exports.easeOut = exports.easeInOut = exports.easeIn = exports.delay = exports.colorChain = exports.color = exports.cascade = exports.FrameType = void 0;
var FrameType;
exports.FrameType = FrameType;

(function (FrameType) {
  FrameType["Pause"] = "Pause";
  FrameType["Delay"] = "Delay";
  FrameType["Set"] = "Set";
  FrameType["Tween"] = "Tween";
})(FrameType || (exports.FrameType = FrameType = {}));

var totalDuration = frames => Math.max(...frames.map(frame => frame.startAt + frame.duration));

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

var mapValues = (object, mapFunction) => Object.fromEntries(Object.entries(object).map(_ref => {
  var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];

  return [key, mapFunction(value)];
}));

var limit = function limit(value) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return Math.min(Math.max(value, min), max);
};

var shouldSkipFrame = (currentTime, currentTimeIndex, frame) => {
  if (frame.startAt > currentTime) return true;
  if (frame.startAt === currentTime && frame.startIndex > currentTimeIndex) return true;
  return false;
};

exports.shouldSkipFrame = shouldSkipFrame;

var render = (currentTime, currentTimeIndex, frames) => {
  for (var i = frames.length - 1; i >= 0; i--) {
    var frame = frames[i];

    switch (frame.type) {
      case FrameType.Tween:
        frame.renderer(mapValues(frame.values, val => val(0)));
        break;

      case FrameType.Set:
        frame.renderer(mapValues(frame.values, val => val[0]));
        break;
    }
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var frame = _step.value;
      if (shouldSkipFrame(currentTime, currentTimeIndex, frame)) return "continue";

      switch (frame.type) {
        case FrameType.Tween:
          frame.renderer(mapValues(frame.values, val => {
            var n = limit((currentTime - frame.startAt) / frame.duration);
            return val(frame.easing(n));
          }));
          break;

        case FrameType.Set:
          frame.renderer(mapValues(frame.values, val => {
            var _val = _slicedToArray(val, 2),
                off = _val[0],
                on = _val[1];

            return currentTime >= frame.startAt + frame.duration ? on : off;
          }));
          break;
      }
    };

    for (var _iterator = frames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var findTextStepTime = (prevTime, prevTimeIndex, nextTime, total, frames) => {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = frames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var frame = _step.value;

      if (frame.type === FrameType.Pause && frame.startAt >= prevTime && frame.startAt <= nextTime && frame.startIndex > prevTimeIndex) {
        return {
          nextTime: frame.startAt,
          nextTimeIndex: frame.startIndex,
          pause: true,
          end: false
        };
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (nextTime > total) {
    return {
      nextTime: total,
      nextTimeIndex: 0,
      pause: true,
      end: true
    };
  }

  return {
    nextTime,
    nextTimeIndex: 0,
    pause: false,
    end: false
  };
}; // @TODO make this immutable


var prepareFrames = frames => {
  frames.sort((a, b) => a.startAt - b.startAt);

  for (var i = 0; i < frames.length; i++) {
    var frame = frames[i];
    var prevFrame = frames[i - 1];
    var nextFrame = frames[i + 1];

    if (prevFrame && prevFrame.startAt === frame.startAt) {
      frame.startIndex = prevFrame.startIndex + 1;
    } else if (nextFrame && nextFrame.startAt === frame.startAt) {
      frame.startIndex = 1;
    }
  }

  return frames;
};

var lightTrails = function lightTrails(trailFunction) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var currentTime = 0;
  var currentTimeIndex = 0;
  var playing = false;
  var frames = prepareFrames(trailFunction(0));
  var total = totalDuration(frames);

  var prepare = () => {
    render(currentTime, currentTimeIndex, frames);
  };

  var seek = function seek(time) {
    var offsetIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    currentTime = time;
    currentTimeIndex = offsetIndex;
    updateOnCurrent();
  };

  var updateOnCurrent = () => {
    var _options$onUpdate;

    render(currentTime, currentTimeIndex, frames);
    (_options$onUpdate = options.onUpdate) === null || _options$onUpdate === void 0 ? void 0 : _options$onUpdate.call(options);
  };

  var play = () => {
    var _options$onPlay;

    var start = 0;
    playing = true;
    (_options$onPlay = options.onPlay) === null || _options$onPlay === void 0 ? void 0 : _options$onPlay.call(options);

    var step = time => {
      if (!start) {
        start = time; // skip first frame

        requestAnimationFrame(step);
        return;
      }

      var diff = time - start;
      start = time;

      var _findTextStepTime = findTextStepTime(currentTime, currentTimeIndex, currentTime + diff, total, frames),
          nextTime = _findTextStepTime.nextTime,
          nextTimeIndex = _findTextStepTime.nextTimeIndex,
          pause = _findTextStepTime.pause,
          end = _findTextStepTime.end;

      currentTime = nextTime;
      currentTimeIndex = nextTimeIndex;
      updateOnCurrent();

      if (end) {
        var _options$onComplete;

        playing = false;
        (_options$onComplete = options.onComplete) === null || _options$onComplete === void 0 ? void 0 : _options$onComplete.call(options);
        return;
      }

      if (!playing || pause) {
        var _options$onPause;

        playing = false;
        (_options$onPause = options.onPause) === null || _options$onPause === void 0 ? void 0 : _options$onPause.call(options);
        return;
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  var pause = () => {
    playing = false;
  };

  var getStatus = () => ({
    playing,
    ended: currentTime === total,
    started: currentTime > 0,
    currentTime,
    currentTimeIndex,
    total
  });

  return {
    prepare,
    play,
    pause,
    seek,
    total,
    getStatus,
    __dev: {
      options,
      frames
    }
  };
};

exports.lightTrails = lightTrails;

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

var selectElement = selector => {
  if (typeof selector === 'string') {
    var element = document.querySelector(selector);

    if (!element) {
      throw new Error("[lighting] Element (".concat(selector, ") not found"));
    }

    return element;
  }

  return selector;
};

var htmlElementRenderer = selector => {
  var element = selectElement(selector);

  var renderer = values => {
    var text = values.text,
        x = values.x,
        y = values.y,
        scale = values.scale,
        skewX = values.skewX,
        skewY = values.skewY,
        rotate = values.rotate,
        styles = _objectWithoutProperties(values, ["text", "x", "y", "scale", "skewX", "skewY", "rotate"]);

    setCssValue(element, styles);

    if (text !== undefined) {
      element.textContent = text;
    }

    var transform = getTransform({
      x,
      y,
      scale,
      skewX,
      skewY,
      rotate
    });

    if (transform) {
      setCssValue(element, {
        transform
      });
    }
  }; // @ts-ignore


  renderer.__EL = element;
  return renderer;
};

exports.htmlElementRenderer = htmlElementRenderer;

var getTransform = values => {
  var val = [];

  if (values.x !== undefined || values.y !== undefined) {
    var _values$x = values.x,
        x = _values$x === void 0 ? 0 : _values$x,
        _values$y = values.y,
        y = _values$y === void 0 ? 0 : _values$y;
    val.push("translate(".concat(x, ", ").concat(y, ")"));
  }

  if (values.rotate !== undefined) {
    val.push("rotate(".concat(values.rotate, ")"));
  }

  if (values.scale !== undefined) {
    val.push("scale(".concat(values.scale, ")"));
  }

  if (values.skewX !== undefined) {
    val.push("skewX(".concat(values.skewX, ")"));
  }

  if (values.skewY !== undefined) {
    val.push("skewY(".concat(values.skewY, ")"));
  }

  if (!val.length) {
    return undefined;
  }

  return val.join(' ');
};

var setCssValue = (el, values) => {
  for (var _i = 0, _Object$entries = Object.entries(values); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    el.style.setProperty(key, value);
  }
};

exports.setCssValue = setCssValue;

var trail = (target, operators) => {
  var renderer = findRenderer(target);
  return startAt => {
    var offset = startAt;
    var frames = operators.map(operator => {
      var frame = operator(offset);

      if (typeof frame === 'function') {
        frame = frame(renderer);
      }

      offset += Math.max(...frame.map(frame => frame.duration));
      return frame;
    }).flat();
    return frames;
  };
};

exports.trail = trail;

var findRenderer = target => {
  if (typeof target === 'function') {
    return target;
  }

  if (typeof target === 'string' || target instanceof HTMLElement) {
    return htmlElementRenderer(target);
  }

  throw new Error("[lighting:animate] Invalid renderer (".concat(target.toString(), ")"));
};

var cascade = (frames, options) => startAt => frames.flatMap((frameFn, index) => {
  var offset = options.offset(index) + startAt;
  return frameFn(offset);
});

exports.cascade = cascade;

var parallel = frames => startAt => frames.flatMap(frameFn => frameFn(startAt));

exports.parallel = parallel;

var sequence = frames => startAt => {
  var offset = startAt;
  return frames.flatMap(frameFn => {
    var frame = frameFn(offset);
    offset = totalDuration(frame);
    return frame;
  });
};

exports.sequence = sequence;
var pow = Math.pow,
    sin = Math.sin;
var PI = Math.PI;

var easeInOut = n => 0.5 * (sin((n - 0.5) * PI) + 1);

exports.easeInOut = easeInOut;

var easeIn = n => pow(n, 1.675);

exports.easeIn = easeIn;

var easeOut = n => 1 - pow(1 - n, 1.675);

exports.easeOut = easeOut;

var linear = x => x;

exports.linear = linear;

var fromTo = function fromTo(values, duration) {
  var easing = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : easeInOut;
  return startAt => renderer => [{
    type: FrameType.Tween,
    startAt,
    startIndex: 0,
    duration,
    values,
    renderer,
    easing
  }];
};

exports.fromTo = fromTo;

var set = values => startAt => renderer => [{
  type: FrameType.Set,
  startAt,
  startIndex: 0,
  duration: 0,
  values,
  renderer
}];

exports.set = set;

var delay = duration => startAt => [{
  type: FrameType.Delay,
  startAt,
  startIndex: 0,
  duration
}];

exports.delay = delay;

var pause = () => startAt => [{
  type: FrameType.Pause,
  startAt,
  startIndex: 0,
  duration: 0
}];

exports.pause = pause;

var colorToString = color => "rgba(".concat(color.join(', '), ")");

var colorFromHEX = color => {
  var r = parseInt(color.substring(1, 3), 16);
  var g = parseInt(color.substring(3, 5), 16);
  var b = parseInt(color.substring(5, 7), 16);
  return [r, g, b, 1];
};

var colorFromRGB = color => {
  var _color$match$map = color.match(/(\d|\.)+/g).map(Number),
      _color$match$map2 = _slicedToArray(_color$match$map, 4),
      r = _color$match$map2[0],
      g = _color$match$map2[1],
      b = _color$match$map2[2],
      _color$match$map2$ = _color$match$map2[3],
      a = _color$match$map2$ === void 0 ? 1 : _color$match$map2$;

  return [r, g, b, a];
};

var getColor = color => {
  if (color.startsWith('#')) {
    if (color.length === 4) {
      var _color = _slicedToArray(color, 4),
          r = _color[1],
          g = _color[2],
          b = _color[3];

      var longHex = '#' + r + r + g + g + b + b;
      return colorFromHEX(longHex);
    }

    return colorFromHEX(color);
  }

  if (color.startsWith('rgb')) {
    return colorFromRGB(color);
  }

  throw new Error("[lighting:color] Unknown color \"".concat(color, "\", use hex, rgb or rgba"));
};

var color = (a, b) => {
  var c1 = getColor(a);
  var c2 = getColor(b);
  return p => {
    var n = limit(p);
    var c = [];

    for (var i = 0; i < 3; i++) {
      var ce1 = c1[i] * c1[i];
      var ce2 = c2[i] * c2[i];
      c[i] = Math.sqrt(n * (ce2 - ce1) + ce1) >> 0;
    }

    c[3] = (c2[3] - c1[3]) * n + c1[3];
    return colorToString(c);
  };
};

exports.color = color;

var colorChain = a => {
  var pref = a;
  return b => {
    var newVal = color(pref, b);
    pref = b;
    return newVal;
  };
};

exports.colorChain = colorChain;

var text = txt => n => {
  return txt.substr(0, txt.length * n);
};

exports.text = text;

var val = (a, b, suffix) => n => {
  var val = (b - a) * n + a;
  return suffix ? val + suffix : val;
};

exports.val = val;

var valChain = (a, suffix) => {
  var pref = a;
  return b => {
    var newVal = val(pref, b, suffix);
    pref = b;
    return newVal;
  };
};

exports.valChain = valChain;
},{}],"../../../node_modules/light-trails-inspector/dist/light-trails-inspector.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inspector = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var FrameType;

(function (FrameType) {
  FrameType["Pause"] = "Pause";
  FrameType["Delay"] = "Delay";
  FrameType["Set"] = "Set";
  FrameType["Tween"] = "Tween";
})(FrameType || (FrameType = {}));

var shouldSkipFrame = (currentTime, currentTimeIndex, frame) => {
  if (frame.startAt > currentTime) return true;
  if (frame.startAt === currentTime && frame.startIndex > currentTimeIndex) return true;
  return false;
};

var bg = {
  [FrameType.Tween]: '#4d7a16',
  [FrameType.Set]: 'lightgray',
  [FrameType.Delay]: '#666',
  [FrameType.Pause]: 'lightgray'
};

var createBarEl = (frame, options, skipped) => {
  var _frame$renderer;

  var el = document.createElement('div');
  var htmlPayload = 'renderer' in frame && ((_frame$renderer = frame.renderer) === null || _frame$renderer === void 0 ? void 0 : _frame$renderer.__EL) || undefined;

  if (htmlPayload) {
    el.textContent = "[".concat(htmlPayload.tagName, "] ");
  } else {
    el.textContent = "".concat(frame.type);
  }

  el.title = "[".concat(frame.startAt, " - ").concat(frame.startAt + frame.duration, "] ").concat(frame.type);

  if ('values' in frame) {
    var values = " (".concat(Object.keys(frame.values).join(', '), ")");
    el.textContent += values;
    el.title += values;
  }

  el.onclick = () => {
    // eslint-disable-next-line no-console
    console.log(frame);
  };

  if (htmlPayload) {
    el.onmouseover = () => {
      htmlPayload.style.outline = '2px solid red';
      htmlPayload.style.outlineOffset = '2px';
    };

    el.onmouseout = () => {
      htmlPayload.style.outline = '';
      htmlPayload.style.outlineOffset = '';
    };
  }

  el.style.opacity = skipped ? '0.3' : '1';
  el.style.height = '14px';
  el.style.lineHeight = '14px';
  el.style.fontSize = '10px';
  el.style.textIndent = '5px'; // el.style.overflow = 'hidden'

  el.style.whiteSpace = 'nowrap';
  el.style.marginBottom = '1px';
  el.style.color = 'white';
  el.style.marginLeft = frame.startAt / options.scale + 'px';

  switch (frame.type) {
    case FrameType.Pause:
    case FrameType.Set:
      el.style.width = 'auto';
      el.style.color = bg[frame.type];
      el.style.borderLeft = "2px solid ".concat(bg[frame.type]);
      break;

    default:
      el.style.backgroundColor = bg[frame.type];
      el.style.width = frame.duration / options.scale + 'px';
      el.style.borderRadius = '3px';
      break;
  }

  return el;
};

var createLineEl = options => {
  var el = document.createElement('div');
  el.style.position = 'absolute';
  el.style.left = '0px';
  el.style.top = '0';
  el.style.bottom = '0';
  el.style.backgroundColor = 'white';
  el.style.width = '1px';
  el.style.pointerEvents = 'none';
  el.style.opacity = '0.7';

  var update = timeOffset => {
    el.style.left = "".concat(timeOffset / options.scale, "px");
  };

  return {
    el,
    update
  };
};

var createRootEl = options => {
  var el = document.createElement('div');
  el.style.zIndex = '10000';
  el.style.position = 'absolute';
  el.style.fontFamily = 'monospace';
  el.style.overflow = 'auto';
  el.style.left = '10px';
  el.style.bottom = '110px';
  el.style.backgroundColor = 'rgba(0,0,0,.1)';
  el.style.width = options.width + 'px';
  el.style.display = 'grid';
  el.style.gridTemplateRows = '1fr';
  el.style.gridGap = '10px';
  return el;
};

var createSeekEl = (options, onSeek) => {
  var el = document.createElement('div');
  el.style.backgroundColor = 'rgba(0,0,0,.5)';
  el.style.height = '50px';
  el.style.webkitUserSelect = null;
  el.style.cursor = 'col-resize';
  var seeking = false;

  el.onmousedown = event => {
    seeking = true;
    onSeek(event.offsetX * options.scale);
  };

  el.onmouseup = () => {
    seeking = false;
  };

  el.onmousemove = event => {
    if (seeking) {
      onSeek(event.offsetX * options.scale);
    }
  };

  return el;
};

var round = Math.round;

var createStatusEl = () => {
  var el = document.createElement('div');
  el.style.padding = '10px 10px 0';
  el.style.color = 'white';

  var update = status => {
    var textStatus = status.playing ? 'Playing' : status.ended ? 'End' : "Paused (".concat(status.currentTimeIndex, ")");
    el.innerText = "".concat(round(status.currentTime), "/").concat(status.total, " [").concat(textStatus, "]");
  };

  return {
    el,
    update
  };
};

var inspectorOptions = {
  width: window.innerWidth - 20,
  scale: 4
};

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var inspector = anim => {
  var status = anim.getStatus();
  var rootEl = createRootEl(inspectorOptions);
  var barsWrapperEl = document.createElement('div');
  var statusEl = createStatusEl();
  var lineEl = createLineEl(inspectorOptions);
  var seekEl = createSeekEl(inspectorOptions, off => anim.seek(off));

  var userOptions = _objectSpread({}, anim.__dev.options);

  inspectorOptions.scale = anim.total / (inspectorOptions.width - 200);

  anim.__dev.options.onUpdate = () => {
    var _userOptions$onUpdate;

    status = anim.getStatus();
    (_userOptions$onUpdate = userOptions.onUpdate) === null || _userOptions$onUpdate === void 0 ? void 0 : _userOptions$onUpdate.call(userOptions);
    render();
  };

  anim.__dev.options.onPause = () => {
    var _userOptions$onPause;

    status = anim.getStatus();
    (_userOptions$onPause = userOptions.onPause) === null || _userOptions$onPause === void 0 ? void 0 : _userOptions$onPause.call(userOptions);
    render();
  };

  anim.__dev.options.onComplete = () => {
    var _userOptions$onComple;

    status = anim.getStatus();
    (_userOptions$onComple = userOptions.onComplete) === null || _userOptions$onComple === void 0 ? void 0 : _userOptions$onComple.call(userOptions);
    render();
  };

  barsWrapperEl.style.maxHeight = '70vh';
  barsWrapperEl.style.overflow = 'auto';

  var render = () => {
    barsWrapperEl.innerHTML = '';

    anim.__dev.frames.forEach(frame => {
      barsWrapperEl.appendChild(createBarEl(frame, inspectorOptions, shouldSkipFrame(status.currentTime, status.currentTimeIndex, frame)));
    });

    lineEl.update(status.currentTime);
    lineEl.el.scrollIntoView({
      behavior: 'auto',
      inline: 'center',
      block: 'center'
    });
    statusEl.update(status);
  };

  render();
  rootEl.appendChild(statusEl.el);
  rootEl.appendChild(seekEl);
  rootEl.appendChild(barsWrapperEl);
  rootEl.appendChild(lineEl.el);
  document.body.appendChild(rootEl);
};

exports.inspector = inspector;
},{}],"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var light_trails_1 = require("light-trails");

var light_trails_inspector_1 = require("light-trails-inspector");

var nextColor = light_trails_1.colorChain('#FFFFFF');
var titleTrail = light_trails_1.trail('h1', [light_trails_1.fromTo({
  color: nextColor('#FF00F0'),
  opacity: light_trails_1.val(0, 1)
}, 1000), light_trails_1.fromTo({
  color: nextColor('#00F0F0')
}, 1000)]);
var pTrail = light_trails_1.trail('.top p', [light_trails_1.fromTo({
  opacity: light_trails_1.val(0, 1),
  y: light_trails_1.val(-10, 0, 'px')
}, 1000)]);
var mainTrail = light_trails_1.trail('main', [light_trails_1.delay(800), light_trails_1.fromTo({
  opacity: light_trails_1.val(0, 1)
}, 1000)]);
var trailAnimations = [];
var leftVal = light_trails_1.val(0, 100, '%');
var trialsCount = Math.round(window.innerWidth / 20);

for (var i = 0; i < trialsCount; i++) {
  var el = document.createElement('span');
  el.classList.add('trail');
  el.style.left = leftVal(i / (trialsCount + 0.5 - Math.random()));
  var size = Math.max(0.2, Math.random());
  trailAnimations.push(light_trails_1.trail(el, [light_trails_1.fromTo({
    opacity: light_trails_1.val(0, Math.min(size, 0.8)),
    y: light_trails_1.val(0, window.innerHeight * Math.random(), 'px'),
    scale: light_trails_1.val(0, size)
  }, 800)]));
  document.body.appendChild(el);
}

trailAnimations.sort(function () {
  return 0.5 - Math.random();
});
var initAnimation = light_trails_1.lightTrails(light_trails_1.parallel([light_trails_1.cascade(trailAnimations, {
  offset: function offset(i) {
    return i * 30;
  }
}), light_trails_1.sequence([light_trails_1.delay(1300), light_trails_1.cascade([titleTrail, pTrail, mainTrail], {
  offset: function offset(i) {
    return i * 300;
  }
})])]));
initAnimation.play();
var colorVar = light_trails_1.colorChain('#FF00F0');
var bodyColorTrial = light_trails_1.trail('body', [light_trails_1.fromTo({
  '--color': colorVar('#00F0F0')
}, 1000), light_trails_1.fromTo({
  '--color': colorVar('#FF00F0')
}, 1000)]);
var colorAnimation = light_trails_1.lightTrails(bodyColorTrial);
colorAnimation.prepare();
var total = colorAnimation.getStatus().total;
window.addEventListener('scroll', function () {
  var documentElement = document.documentElement,
      body = document.body;
  var percent = (documentElement.scrollTop || body.scrollTop) / ((documentElement.scrollHeight || body.scrollHeight) - documentElement.clientHeight);
  colorAnimation.seek(total * percent);
});
var inspectorButton = document.querySelector('#inspector');

var showInspector = function showInspector() {
  light_trails_inspector_1.inspector(initAnimation);
  inspectorButton.hidden = true;
};

inspectorButton.addEventListener('click', showInspector);
},{"light-trails":"../../../node_modules/light-trails/dist/light-trails.esm.js","light-trails-inspector":"../../../node_modules/light-trails-inspector/dist/light-trails-inspector.esm.js"}],"../../../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33923" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map