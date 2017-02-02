/**
 * Baobab Cursors
 * ===============
 *
 * Cursors created by selecting some data within a Baobab tree.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _emmett = require('emmett');

var _emmett2 = _interopRequireDefault(_emmett);

var _monkey = require('./monkey');

var _type = require('./type');

var _type2 = _interopRequireDefault(_type);

var _helpers = require('./helpers');

/**
 * Traversal helper function for dynamic cursors. Will throw a legible error
 * if traversal is not possible.
 *
 * @param {string} method     - The method name, to create a correct error msg.
 * @param {array}  solvedPath - The cursor's solved path.
 */
function checkPossibilityOfDynamicTraversal(method, solvedPath) {
  if (!solvedPath) throw (0, _helpers.makeError)('Baobab.Cursor.' + method + ': ' + ('cannot use ' + method + ' on an unresolved dynamic path.'), { path: solvedPath });
}

/**
 * Cursor class
 *
 * @constructor
 * @param {Baobab} tree   - The cursor's root.
 * @param {array}  path   - The cursor's path in the tree.
 * @param {string} hash   - The path's hash computed ahead by the tree.
 */

var Cursor = (function (_Emitter) {
  _inherits(Cursor, _Emitter);

  function Cursor(tree, path, hash) {
    var _this = this;

    _classCallCheck(this, Cursor);

    _get(Object.getPrototypeOf(Cursor.prototype), 'constructor', this).call(this);

    // If no path were to be provided, we fallback to an empty path (root)
    path = path || [];

    // Privates
    this._identity = '[object Cursor]';
    this._archive = null;

    // Properties
    this.tree = tree;
    this.path = path;
    this.hash = hash;

    // State
    this.state = {
      killed: false,
      recording: false,
      undoing: false
    };

    // Checking whether the given path is dynamic or not
    this._dynamicPath = _type2['default'].dynamicPath(this.path);

    // Checking whether the given path will meet a monkey
    this._monkeyPath = _type2['default'].monkeyPath(this.tree._monkeys, this.path);

    if (!this._dynamicPath) this.solvedPath = this.path;else this.solvedPath = (0, _helpers.getIn)(this.tree._data, this.path).solvedPath;

    /**
     * Listener bound to the tree's writes so that cursors with dynamic paths
     * may update their solved path correctly.
     *
     * @param {object} event - The event fired by the tree.
     */
    this._writeHandler = function (_ref) {
      var data = _ref.data;

      if (_this.state.killed || !(0, _helpers.solveUpdate)([data.path], _this._getComparedPaths())) return;

      _this.solvedPath = (0, _helpers.getIn)(_this.tree._data, _this.path).solvedPath;
    };

    /**
     * Function in charge of actually trigger the cursor's updates and
     * deal with the archived records.
     *
     * @note: probably should wrap the current solvedPath in closure to avoid
     * for tricky cases where it would fail.
     *
     * @param {mixed} previousData - the tree's previous data.
     */
    var fireUpdate = function fireUpdate(previousData) {
      var self = _this;

      var eventData = Object.defineProperties({}, {
        previousData: {
          get: function get() {
            return (0, _helpers.getIn)(previousData, self.solvedPath).data;
          },
          configurable: true,
          enumerable: true
        },
        currentData: {
          get: function get() {
            return self.get();
          },
          configurable: true,
          enumerable: true
        }
      });

      if (_this.state.recording && !_this.state.undoing) _this.archive.add(eventData.previousData);

      _this.state.undoing = false;

      return _this.emit('update', eventData);
    };

    /**
     * Listener bound to the tree's updates and determining whether the
     * cursor is affected and should react accordingly.
     *
     * Note that this listener is lazily bound to the tree to be sure
     * one wouldn't leak listeners when only creating cursors for convenience
     * and not to listen to updates specifically.
     *
     * @param {object} event - The event fired by the tree.
     */
    this._updateHandler = function (event) {
      if (_this.state.killed) return;

      var _event$data = event.data;
      var paths = _event$data.paths;
      var previousData = _event$data.previousData;
      var update = fireUpdate.bind(_this, previousData);
      var comparedPaths = _this._getComparedPaths();

      if ((0, _helpers.solveUpdate)(paths, comparedPaths)) return update();
    };

    // Lazy binding
    var bound = false;
    this._lazyBind = function () {
      if (bound) return;

      bound = true;

      if (_this._dynamicPath) _this.tree.on('write', _this._writeHandler);

      return _this.tree.on('update', _this._updateHandler);
    };

    // If the path is dynamic, we actually need to listen to the tree
    if (this._dynamicPath) {
      this._lazyBind();
    } else {

      // Overriding the emitter `on` and `once` methods
      this.on = (0, _helpers.before)(this._lazyBind, this.on.bind(this));
      this.once = (0, _helpers.before)(this._lazyBind, this.once.bind(this));
    }
  }

  /**
   * Method used to allow iterating over cursors containing list-type data.
   *
   * e.g. for(let i of cursor) { ... }
   *
   * @returns {object} -  Each item sequentially.
   */

  /**
   * Internal helpers
   * -----------------
   */

  /**
   * Method returning the paths of the tree watched over by the cursor and that
   * should be taken into account when solving a potential update.
   *
   * @return {array} - Array of paths to compare with a given update.
   */

  _createClass(Cursor, [{
    key: '_getComparedPaths',
    value: function _getComparedPaths() {

      // Checking whether we should keep track of some dependencies
      var additionalPaths = this._monkeyPath ? (0, _helpers.getIn)(this.tree._monkeys, this._monkeyPath).data.relatedPaths() : [];

      return [this.solvedPath].concat(additionalPaths);
    }

    /**
     * Predicates
     * -----------
     */

    /**
     * Method returning whether the cursor is at root level.
     *
     * @return {boolean} - Is the cursor the root?
     */
  }, {
    key: 'isRoot',
    value: function isRoot() {
      return !this.path.length;
    }

    /**
     * Method returning whether the cursor is at leaf level.
     *
     * @return {boolean} - Is the cursor a leaf?
     */
  }, {
    key: 'isLeaf',
    value: function isLeaf() {
      return _type2['default'].primitive(this._get().data);
    }

    /**
     * Method returning whether the cursor is at branch level.
     *
     * @return {boolean} - Is the cursor a branch?
     */
  }, {
    key: 'isBranch',
    value: function isBranch() {
      return !this.isRoot() && !this.isLeaf();
    }

    /**
     * Traversal Methods
     * ------------------
     */

    /**
     * Method returning the root cursor.
     *
     * @return {Baobab} - The root cursor.
     */
  }, {
    key: 'root',
    value: function root() {
      return this.tree.select();
    }

    /**
     * Method selecting a subpath as a new cursor.
     *
     * Arity (1):
     * @param  {path} path    - The path to select.
     *
     * Arity (*):
     * @param  {...step} path - The path to select.
     *
     * @return {Cursor}       - The created cursor.
     */
  }, {
    key: 'select',
    value: function select(path) {
      if (arguments.length > 1) path = (0, _helpers.arrayFrom)(arguments);

      return this.tree.select(this.path.concat(path));
    }

    /**
     * Method returning the parent node of the cursor or else `null` if the
     * cursor is already at root level.
     *
     * @return {Baobab} - The parent cursor.
     */
  }, {
    key: 'up',
    value: function up() {
      if (!this.isRoot()) return this.tree.select(this.path.slice(0, -1));

      return null;
    }

    /**
     * Method returning the child node of the cursor.
     *
     * @return {Baobab} - The child cursor.
     */
  }, {
    key: 'down',
    value: function down() {
      checkPossibilityOfDynamicTraversal('down', this.solvedPath);

      if (!(this._get().data instanceof Array)) throw Error('Baobab.Cursor.down: cannot go down on a non-list type.');

      return this.tree.select(this.solvedPath.concat(0));
    }

    /**
     * Method returning the left sibling node of the cursor if this one is
     * pointing at a list. Returns `null` if this cursor is already leftmost.
     *
     * @return {Baobab} - The left sibling cursor.
     */
  }, {
    key: 'left',
    value: function left() {
      checkPossibilityOfDynamicTraversal('left', this.solvedPath);

      var last = +this.solvedPath[this.solvedPath.length - 1];

      if (isNaN(last)) throw Error('Baobab.Cursor.left: cannot go left on a non-list type.');

      return last ? this.tree.select(this.solvedPath.slice(0, -1).concat(last - 1)) : null;
    }

    /**
     * Method returning the right sibling node of the cursor if this one is
     * pointing at a list. Returns `null` if this cursor is already rightmost.
     *
     * @return {Baobab} - The right sibling cursor.
     */
  }, {
    key: 'right',
    value: function right() {
      checkPossibilityOfDynamicTraversal('right', this.solvedPath);

      var last = +this.solvedPath[this.solvedPath.length - 1];

      if (isNaN(last)) throw Error('Baobab.Cursor.right: cannot go right on a non-list type.');

      if (last + 1 === this.up()._get().data.length) return null;

      return this.tree.select(this.solvedPath.slice(0, -1).concat(last + 1));
    }

    /**
     * Method returning the leftmost sibling node of the cursor if this one is
     * pointing at a list.
     *
     * @return {Baobab} - The leftmost sibling cursor.
     */
  }, {
    key: 'leftmost',
    value: function leftmost() {
      checkPossibilityOfDynamicTraversal('leftmost', this.solvedPath);

      var last = +this.solvedPath[this.solvedPath.length - 1];

      if (isNaN(last)) throw Error('Baobab.Cursor.leftmost: cannot go left on a non-list type.');

      return this.tree.select(this.solvedPath.slice(0, -1).concat(0));
    }

    /**
     * Method returning the rightmost sibling node of the cursor if this one is
     * pointing at a list.
     *
     * @return {Baobab} - The rightmost sibling cursor.
     */
  }, {
    key: 'rightmost',
    value: function rightmost() {
      checkPossibilityOfDynamicTraversal('rightmost', this.solvedPath);

      var last = +this.solvedPath[this.solvedPath.length - 1];

      if (isNaN(last)) throw Error('Baobab.Cursor.rightmost: cannot go right on a non-list type.');

      var list = this.up()._get().data;

      return this.tree.select(this.solvedPath.slice(0, -1).concat(list.length - 1));
    }

    /**
     * Method mapping the children nodes of the cursor.
     *
     * @param  {function} fn      - The function to map.
     * @param  {object}   [scope] - An optional scope.
     * @return {array}            - The resultant array.
     */
  }, {
    key: 'map',
    value: function map(fn, scope) {
      checkPossibilityOfDynamicTraversal('map', this.solvedPath);

      var array = this._get().data,
          l = arguments.length;

      if (!_type2['default'].array(array)) throw Error('baobab.Cursor.map: cannot map a non-list type.');

      return array.map(function (item, i) {
        return fn.call(l > 1 ? scope : this, this.select(i), i, array);
      }, this);
    }

    /**
     * Getter Methods
     * ---------------
     */

    /**
     * Internal get method. Basically contains the main body of the `get` method
     * without the event emitting. This is sometimes needed not to fire useless
     * events.
     *
     * @param  {path}   [path=[]]       - Path to get in the tree.
     * @return {object} info            - The resultant information.
     * @return {mixed}  info.data       - Data at path.
     * @return {array}  info.solvedPath - The path solved when getting.
     */
  }, {
    key: '_get',
    value: function _get() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      if (!_type2['default'].path(path)) throw (0, _helpers.makeError)('Baobab.Cursor.getters: invalid path.', { path: path });

      if (!this.solvedPath) return { data: undefined, solvedPath: null, exists: false };

      return (0, _helpers.getIn)(this.tree._data, this.solvedPath.concat(path));
    }

    /**
     * Method used to check whether a certain path exists in the tree starting
     * from the current cursor.
     *
     * Arity (1):
     * @param  {path}   path           - Path to check in the tree.
     *
     * Arity (2):
     * @param {..step}  path           - Path to check in the tree.
     *
     * @return {boolean}               - Does the given path exists?
     */
  }, {
    key: 'exists',
    value: function exists(path) {
      path = (0, _helpers.coercePath)(path);

      if (arguments.length > 1) path = (0, _helpers.arrayFrom)(arguments);

      return this._get(path).exists;
    }

    /**
     * Method used to get data from the tree. Will fire a `get` event from the
     * tree so that the user may sometimes react upon it to fetch data, for
     * instance.
     *
     * Arity (1):
     * @param  {path}   path           - Path to get in the tree.
     *
     * Arity (2):
     * @param  {..step} path           - Path to get in the tree.
     *
     * @return {mixed}                 - Data at path.
     */
  }, {
    key: 'get',
    value: function get(path) {
      path = (0, _helpers.coercePath)(path);

      if (arguments.length > 1) path = (0, _helpers.arrayFrom)(arguments);

      var _get2 = this._get(path);

      var data = _get2.data;
      var solvedPath = _get2.solvedPath;

      // Emitting the event
      this.tree.emit('get', { data: data, solvedPath: solvedPath, path: this.path.concat(path) });

      return data;
    }

    /**
     * Method used to shallow clone data from the tree.
     *
     * Arity (1):
     * @param  {path}   path           - Path to get in the tree.
     *
     * Arity (2):
     * @param  {..step} path           - Path to get in the tree.
     *
     * @return {mixed}                 - Cloned data at path.
     */
  }, {
    key: 'clone',
    value: function clone() {
      var data = this.get.apply(this, arguments);

      return (0, _helpers.shallowClone)(data);
    }

    /**
     * Method used to deep clone data from the tree.
     *
     * Arity (1):
     * @param  {path}   path           - Path to get in the tree.
     *
     * Arity (2):
     * @param  {..step} path           - Path to get in the tree.
     *
     * @return {mixed}                 - Cloned data at path.
     */
  }, {
    key: 'deepClone',
    value: function deepClone() {
      var data = this.get.apply(this, arguments);

      return (0, _helpers.deepClone)(data);
    }

    /**
     * Method used to return raw data from the tree, by carefully avoiding
     * computed one.
     *
     * @todo: should be more performant as the cloning should happen as well as
     * when dropping computed data.
     *
     * Arity (1):
     * @param  {path}   path           - Path to serialize in the tree.
     *
     * Arity (2):
     * @param  {..step} path           - Path to serialize in the tree.
     *
     * @return {mixed}                 - The retrieved raw data.
     */
  }, {
    key: 'serialize',
    value: function serialize(path) {
      path = (0, _helpers.coercePath)(path);

      if (arguments.length > 1) path = (0, _helpers.arrayFrom)(arguments);

      if (!_type2['default'].path(path)) throw (0, _helpers.makeError)('Baobab.Cursor.getters: invalid path.', { path: path });

      if (!this.solvedPath) return undefined;

      var fullPath = this.solvedPath.concat(path);

      var data = (0, _helpers.deepClone)((0, _helpers.getIn)(this.tree._data, fullPath).data),
          monkeys = (0, _helpers.getIn)(this.tree._monkeys, fullPath).data;

      var dropComputedData = function dropComputedData(d, m) {
        if (!_type2['default'].object(m) || !_type2['default'].object(d)) return;

        for (var k in m) {
          if (m[k] instanceof _monkey.Monkey) delete d[k];else dropComputedData(d[k], m[k]);
        }
      };

      dropComputedData(data, monkeys);
      return data;
    }

    /**
     * Method used to project some of the data at cursor onto a map or a list.
     *
     * @param  {object|array} projection - The projection's formal definition.
     * @return {object|array}            - The resultant map/list.
     */
  }, {
    key: 'project',
    value: function project(projection) {
      if (_type2['default'].object(projection)) {
        var data = {};

        for (var k in projection) {
          data[k] = this.get(projection[k]);
        }return data;
      } else if (_type2['default'].array(projection)) {
        var data = [];

        for (var i = 0, l = projection.length; i < l; i++) {
          data.push(this.get(projection[i]));
        }return data;
      }

      throw (0, _helpers.makeError)('Baobab.Cursor.project: wrong projection.', { projection: projection });
    }

    /**
     * History Methods
     * ----------------
     */

    /**
     * Methods starting to record the cursor's successive states.
     *
     * @param  {integer} [maxRecords] - Maximum records to keep in memory. Note
     *                                  that if no number is provided, the cursor
     *                                  will keep everything.
     * @return {Cursor}               - The cursor instance for chaining purposes.
     */
  }, {
    key: 'startRecording',
    value: function startRecording(maxRecords) {
      maxRecords = maxRecords || Infinity;

      if (maxRecords < 1) throw (0, _helpers.makeError)('Baobab.Cursor.startRecording: invalid max records.', {
        value: maxRecords
      });

      this.state.recording = true;

      if (this.archive) return this;

      // Lazy binding
      this._lazyBind();

      this.archive = new _helpers.Archive(maxRecords);
      return this;
    }

    /**
     * Methods stopping to record the cursor's successive states.
     *
     * @return {Cursor} - The cursor instance for chaining purposes.
     */
  }, {
    key: 'stopRecording',
    value: function stopRecording() {
      this.state.recording = false;
      return this;
    }

    /**
     * Methods undoing n steps of the cursor's recorded states.
     *
     * @param  {integer} [steps=1] - The number of steps to rollback.
     * @return {Cursor}            - The cursor instance for chaining purposes.
     */
  }, {
    key: 'undo',
    value: function undo() {
      var steps = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

      if (!this.state.recording) throw new Error('Baobab.Cursor.undo: cursor is not recording.');

      var record = this.archive.back(steps);

      if (!record) throw Error('Baobab.Cursor.undo: cannot find a relevant record.');

      this.state.undoing = true;
      this.set(record);

      return this;
    }

    /**
     * Methods returning whether the cursor has a recorded history.
     *
     * @return {boolean} - `true` if the cursor has a recorded history?
     */
  }, {
    key: 'hasHistory',
    value: function hasHistory() {
      return !!(this.archive && this.archive.get().length);
    }

    /**
     * Methods returning the cursor's history.
     *
     * @return {array} - The cursor's history.
     */
  }, {
    key: 'getHistory',
    value: function getHistory() {
      return this.archive ? this.archive.get() : [];
    }

    /**
     * Methods clearing the cursor's history.
     *
     * @return {Cursor} - The cursor instance for chaining purposes.
     */
  }, {
    key: 'clearHistory',
    value: function clearHistory() {
      if (this.archive) this.archive.clear();
      return this;
    }

    /**
     * Releasing
     * ----------
     */

    /**
     * Methods releasing the cursor from memory.
     */
  }, {
    key: 'release',
    value: function release() {

      // Removing listeners on parent
      if (this._dynamicPath) this.tree.off('write', this._writeHandler);

      this.tree.off('update', this._updateHandler);

      // Unsubscribe from the parent
      if (this.hash) delete this.tree._cursors[this.hash];

      // Dereferencing
      delete this.tree;
      delete this.path;
      delete this.solvedPath;
      delete this.archive;

      // Killing emitter
      this.kill();
      this.state.killed = true;
    }

    /**
     * Output
     * -------
     */

    /**
     * Overriding the `toJSON` method for convenient use with JSON.stringify.
     *
     * @return {mixed} - Data at cursor.
     */
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this.serialize();
    }

    /**
     * Overriding the `toString` method for debugging purposes.
     *
     * @return {string} - The cursor's identity.
     */
  }, {
    key: 'toString',
    value: function toString() {
      return this._identity;
    }
  }]);

  return Cursor;
})(_emmett2['default']);

exports['default'] = Cursor;
if (typeof Symbol === 'function' && typeof Symbol.iterator !== 'undefined') {
  Cursor.prototype[Symbol.iterator] = function () {
    var array = this._get().data;

    if (!_type2['default'].array(array)) throw Error('baobab.Cursor.@@iterate: cannot iterate a non-list type.');

    var i = 0;

    var cursor = this,
        length = array.length;

    return {
      next: function next() {
        if (i < length) {
          return {
            value: cursor.select(i++)
          };
        }

        return {
          done: true
        };
      }
    };
  };
}

/**
 * Setter Methods
 * ---------------
 *
 * Those methods are dynamically assigned to the class for DRY reasons.
 */

// Not using a Set so that ES5 consumers don't pay a bundle size price
var INTRANSITIVE_SETTERS = {
  unset: true,
  pop: true,
  shift: true
};

/**
 * Function creating a setter method for the Cursor class.
 *
 * @param {string}   name          - the method's name.
 * @param {function} [typeChecker] - a function checking that the given value is
 *                                   valid for the given operation.
 */
function makeSetter(name, typeChecker) {

  /**
   * Binding a setter method to the Cursor class and having the following
   * definition.
   *
   * Note: this is not really possible to make those setters variadic because
   * it would create an impossible polymorphism with path.
   *
   * @todo: perform value validation elsewhere so that tree.update can
   * beneficiate from it.
   *
   * Arity (1):
   * @param  {mixed} value - New value to set at cursor's path.
   *
   * Arity (2):
   * @param  {path}  path  - Subpath to update starting from cursor's.
   * @param  {mixed} value - New value to set.
   *
   * @return {mixed}       - Data at path.
   */
  Cursor.prototype[name] = function (path, value) {

    // We should warn the user if he applies to many arguments to the function
    if (arguments.length > 2) throw (0, _helpers.makeError)('Baobab.Cursor.' + name + ': too many arguments.');

    // Handling arities
    if (arguments.length === 1 && !INTRANSITIVE_SETTERS[name]) {
      value = path;
      path = [];
    }

    // Coerce path
    path = (0, _helpers.coercePath)(path);

    // Checking the path's validity
    if (!_type2['default'].path(path)) throw (0, _helpers.makeError)('Baobab.Cursor.' + name + ': invalid path.', { path: path });

    // Checking the value's validity
    if (typeChecker && !typeChecker(value)) throw (0, _helpers.makeError)('Baobab.Cursor.' + name + ': invalid value.', { path: path, value: value });

    // Checking the solvability of the cursor's dynamic path
    if (!this.solvedPath) throw (0, _helpers.makeError)('Baobab.Cursor.' + name + ': the dynamic path of the cursor cannot be solved.', { path: this.path });

    var fullPath = this.solvedPath.concat(path);

    // Filing the update to the tree
    return this.tree.update(fullPath, {
      type: name,
      value: value
    });
  };
}

/**
 * Making the necessary setters.
 */
makeSetter('set');
makeSetter('unset');
makeSetter('apply', _type2['default']['function']);
makeSetter('push');
makeSetter('concat', _type2['default'].array);
makeSetter('unshift');
makeSetter('pop');
makeSetter('shift');
makeSetter('splice', _type2['default'].splicer);
makeSetter('merge', _type2['default'].object);
makeSetter('deepMerge', _type2['default'].object);
module.exports = exports['default'];