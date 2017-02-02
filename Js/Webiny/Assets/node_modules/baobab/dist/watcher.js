/**
 * Baobab Watchers
 * ================
 *
 * Abstraction used to listen and retrieve data from multiple parts of a
 * Baobab tree at once.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _emmett = require('emmett');

var _emmett2 = _interopRequireDefault(_emmett);

var _cursor = require('./cursor');

var _cursor2 = _interopRequireDefault(_cursor);

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _helpers = require('./helpers');

/**
 * Watcher class.
 *
 * @constructor
 * @param {Baobab} tree     - The watched tree.
 * @param {object} mapping  - A mapping of the paths to watch in the tree.
 */

var Watcher = (function (_Emitter) {
  _inherits(Watcher, _Emitter);

  function Watcher(tree, mapping) {
    var _this = this;

    _classCallCheck(this, Watcher);

    _get(Object.getPrototypeOf(Watcher.prototype), 'constructor', this).call(this);

    // Properties
    this.tree = tree;
    this.mapping = null;

    this.state = {
      killed: false
    };

    // Initializing
    this.refresh(mapping);

    // Listening
    this.handler = function (e) {
      if (_this.state.killed) return;

      var watchedPaths = _this.getWatchedPaths();

      if ((0, _helpers.solveUpdate)(e.data.paths, watchedPaths)) return _this.emit('update');
    };

    this.tree.on('update', this.handler);
  }

  /**
   * Method used to get the current watched paths.
   *
   * @return {array} - The array of watched paths.
   */

  _createClass(Watcher, [{
    key: 'getWatchedPaths',
    value: function getWatchedPaths() {
      var _this2 = this;

      var rawPaths = Object.keys(this.mapping).map(function (k) {
        var v = _this2.mapping[k];

        // Watcher mappings can accept a cursor
        if (v instanceof _cursor2['default']) return v.solvedPath;

        return _this2.mapping[k];
      });

      return rawPaths.reduce(function (cp, p) {

        // Handling path polymorphisms
        p = [].concat(p);

        // Dynamic path?
        if (_type2['default'].dynamicPath(p)) p = (0, _helpers.getIn)(_this2.tree._data, p).solvedPath;

        if (!p) return cp;

        // Facet path?
        var monkeyPath = _type2['default'].monkeyPath(_this2.tree._monkeys, p);

        if (monkeyPath) return cp.concat((0, _helpers.getIn)(_this2.tree._monkeys, monkeyPath).data.relatedPaths());

        return cp.concat([p]);
      }, []);
    }

    /**
     * Method used to return a map of the watcher's cursors.
     *
     * @return {object} - TMap of relevant cursors.
     */
  }, {
    key: 'getCursors',
    value: function getCursors() {
      var _this3 = this;

      var cursors = {};

      Object.keys(this.mapping).forEach(function (k) {
        var path = _this3.mapping[k];

        if (path instanceof _cursor2['default']) cursors[k] = path;else cursors[k] = _this3.tree.select(path);
      });

      return cursors;
    }

    /**
     * Method used to refresh the watcher's mapping.
     *
     * @param  {object}  mapping  - The new mapping to apply.
     * @return {Watcher}          - Itself for chaining purposes.
     */
  }, {
    key: 'refresh',
    value: function refresh(mapping) {

      if (!_type2['default'].watcherMapping(mapping)) throw (0, _helpers.makeError)('Baobab.watch: invalid mapping.', { mapping: mapping });

      this.mapping = mapping;

      // Creating the get method
      var projection = {};

      for (var k in mapping) {
        projection[k] = mapping[k] instanceof _cursor2['default'] ? mapping[k].path : mapping[k];
      }this.get = this.tree.project.bind(this.tree, projection);
    }

    /**
     * Methods releasing the watcher from memory.
     */
  }, {
    key: 'release',
    value: function release() {

      this.tree.off('update', this.handler);
      this.state.killed = true;
      this.kill();
    }
  }]);

  return Watcher;
})(_emmett2['default']);

exports['default'] = Watcher;
module.exports = exports['default'];