var DraftJsConverters =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var exportHtml = __webpack_require__(1).stateToHTML;
	var exportMarkdown = __webpack_require__(15).stateToMarkdown;
	var importHtml = __webpack_require__(17).stateFromHTML;
	var importMarkdown = __webpack_require__(24).stateFromMarkdown;

	module.exports = {
	    toHtml: exportHtml,
	    toMarkdown: exportMarkdown,
	    fromHtml: importHtml,
	    fromMarkdown: importMarkdown
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stateToHTML = __webpack_require__(2);

	Object.defineProperty(exports, 'stateToHTML', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_stateToHTML).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _DEFAULT_STYLE_MAP, _ENTITY_ATTR_MAP, _DATA_TO_ATTR;

	exports.default = stateToHTML;

	var _combineOrderedStyles3 = __webpack_require__(3);

	var _combineOrderedStyles4 = _interopRequireDefault(_combineOrderedStyles3);

	var _normalizeAttributes = __webpack_require__(4);

	var _normalizeAttributes2 = _interopRequireDefault(_normalizeAttributes);

	var _styleToCSS = __webpack_require__(5);

	var _styleToCSS2 = _interopRequireDefault(_styleToCSS);

	var _draftJs = __webpack_require__(7);

	var _draftJsUtils = __webpack_require__(8);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var BOLD = _draftJsUtils.INLINE_STYLE.BOLD;
	var CODE = _draftJsUtils.INLINE_STYLE.CODE;
	var ITALIC = _draftJsUtils.INLINE_STYLE.ITALIC;
	var STRIKETHROUGH = _draftJsUtils.INLINE_STYLE.STRIKETHROUGH;
	var UNDERLINE = _draftJsUtils.INLINE_STYLE.UNDERLINE;


	var INDENT = '  ';
	var BREAK = '<br>';
	var DATA_ATTRIBUTE = /^data-([a-z0-9-]+)$/;

	var DEFAULT_STYLE_MAP = (_DEFAULT_STYLE_MAP = {}, _defineProperty(_DEFAULT_STYLE_MAP, BOLD, { element: 'strong' }), _defineProperty(_DEFAULT_STYLE_MAP, CODE, { element: 'code' }), _defineProperty(_DEFAULT_STYLE_MAP, ITALIC, { element: 'em' }), _defineProperty(_DEFAULT_STYLE_MAP, STRIKETHROUGH, { element: 'del' }), _defineProperty(_DEFAULT_STYLE_MAP, UNDERLINE, { element: 'ins' }), _DEFAULT_STYLE_MAP);

	// Order: inner-most style to outer-most.
	// Examle: <em><strong>foo</strong></em>
	var DEFAULT_STYLE_ORDER = [BOLD, ITALIC, UNDERLINE, STRIKETHROUGH, CODE];

	// Map entity data to element attributes.
	var ENTITY_ATTR_MAP = (_ENTITY_ATTR_MAP = {}, _defineProperty(_ENTITY_ATTR_MAP, _draftJsUtils.ENTITY_TYPE.LINK, { url: 'href', rel: 'rel', target: 'target', title: 'title', className: 'class' }), _defineProperty(_ENTITY_ATTR_MAP, _draftJsUtils.ENTITY_TYPE.IMAGE, { src: 'src', height: 'height', width: 'width', alt: 'alt', className: 'class' }), _ENTITY_ATTR_MAP);

	// Map entity data to element attributes.
	var DATA_TO_ATTR = (_DATA_TO_ATTR = {}, _defineProperty(_DATA_TO_ATTR, _draftJsUtils.ENTITY_TYPE.LINK, function (entityType, entity) {
	  var attrMap = ENTITY_ATTR_MAP.hasOwnProperty(entityType) ? ENTITY_ATTR_MAP[entityType] : {};
	  var data = entity.getData();
	  var attrs = {};
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = Object.keys(data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var dataKey = _step.value;

	      var dataValue = data[dataKey];
	      if (attrMap.hasOwnProperty(dataKey)) {
	        var attrKey = attrMap[dataKey];
	        attrs[attrKey] = dataValue;
	      } else if (DATA_ATTRIBUTE.test(dataKey)) {
	        attrs[dataKey] = dataValue;
	      }
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

	  return attrs;
	}), _defineProperty(_DATA_TO_ATTR, _draftJsUtils.ENTITY_TYPE.IMAGE, function (entityType, entity) {
	  var attrMap = ENTITY_ATTR_MAP.hasOwnProperty(entityType) ? ENTITY_ATTR_MAP[entityType] : {};
	  var data = entity.getData();
	  var attrs = {};
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = Object.keys(data)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var dataKey = _step2.value;

	      var dataValue = data[dataKey];
	      if (attrMap.hasOwnProperty(dataKey)) {
	        var attrKey = attrMap[dataKey];
	        attrs[attrKey] = dataValue;
	      } else if (DATA_ATTRIBUTE.test(dataKey)) {
	        attrs[dataKey] = dataValue;
	      }
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

	  return attrs;
	}), _DATA_TO_ATTR);

	// The reason this returns an array is because a single block might get wrapped
	// in two tags.
	function getTags(blockType) {
	  switch (blockType) {
	    case _draftJsUtils.BLOCK_TYPE.HEADER_ONE:
	      return ['h1'];
	    case _draftJsUtils.BLOCK_TYPE.HEADER_TWO:
	      return ['h2'];
	    case _draftJsUtils.BLOCK_TYPE.HEADER_THREE:
	      return ['h3'];
	    case _draftJsUtils.BLOCK_TYPE.HEADER_FOUR:
	      return ['h4'];
	    case _draftJsUtils.BLOCK_TYPE.HEADER_FIVE:
	      return ['h5'];
	    case _draftJsUtils.BLOCK_TYPE.HEADER_SIX:
	      return ['h6'];
	    case _draftJsUtils.BLOCK_TYPE.UNORDERED_LIST_ITEM:
	    case _draftJsUtils.BLOCK_TYPE.ORDERED_LIST_ITEM:
	      return ['li'];
	    case _draftJsUtils.BLOCK_TYPE.BLOCKQUOTE:
	      return ['blockquote'];
	    case _draftJsUtils.BLOCK_TYPE.CODE:
	      return ['pre', 'code'];
	    case _draftJsUtils.BLOCK_TYPE.ATOMIC:
	      return ['figure'];
	    default:
	      return ['p'];
	  }
	}

	function getWrapperTag(blockType) {
	  switch (blockType) {
	    case _draftJsUtils.BLOCK_TYPE.UNORDERED_LIST_ITEM:
	      return 'ul';
	    case _draftJsUtils.BLOCK_TYPE.ORDERED_LIST_ITEM:
	      return 'ol';
	    default:
	      return null;
	  }
	}

	var MarkupGenerator = function () {
	  // These are related to state.
	  function MarkupGenerator(contentState, options) {
	    _classCallCheck(this, MarkupGenerator);

	    if (options == null) {
	      options = {};
	    }
	    this.contentState = contentState;
	    this.options = options;

	    var _combineOrderedStyles = (0, _combineOrderedStyles4.default)(options.inlineStyles, [DEFAULT_STYLE_MAP, DEFAULT_STYLE_ORDER]);

	    var _combineOrderedStyles2 = _slicedToArray(_combineOrderedStyles, 2);

	    var inlineStyles = _combineOrderedStyles2[0];
	    var styleOrder = _combineOrderedStyles2[1];

	    this.inlineStyles = inlineStyles;
	    this.styleOrder = styleOrder;
	  }
	  // These are related to user-defined options.


	  _createClass(MarkupGenerator, [{
	    key: 'generate',
	    value: function generate() {
	      this.output = [];
	      this.blocks = this.contentState.getBlocksAsArray();
	      this.totalBlocks = this.blocks.length;
	      this.currentBlock = 0;
	      this.indentLevel = 0;
	      this.wrapperTag = null;
	      while (this.currentBlock < this.totalBlocks) {
	        this.processBlock();
	      }
	      this.closeWrapperTag();
	      return this.output.join('').trim();
	    }
	  }, {
	    key: 'processBlock',
	    value: function processBlock() {
	      var blockRenderers = this.options.blockRenderers;

	      var block = this.blocks[this.currentBlock];
	      var blockType = block.getType();
	      var newWrapperTag = getWrapperTag(blockType);
	      if (this.wrapperTag !== newWrapperTag) {
	        if (this.wrapperTag) {
	          this.closeWrapperTag();
	        }
	        if (newWrapperTag) {
	          this.openWrapperTag(newWrapperTag);
	        }
	      }
	      this.indent();
	      // Allow blocks to be rendered using a custom renderer.
	      var customRenderer = blockRenderers != null && blockRenderers.hasOwnProperty(blockType) ? blockRenderers[blockType] : null;
	      var customRendererOutput = customRenderer ? customRenderer(block) : null;
	      // Renderer can return null, which will cause processing to continue as normal.
	      if (customRendererOutput != null) {
	        this.output.push(customRendererOutput);
	        this.output.push('\n');
	        this.currentBlock += 1;
	        return;
	      }
	      this.writeStartTag(block);
	      this.output.push(this.renderBlockContent(block));
	      // Look ahead and see if we will nest list.
	      var nextBlock = this.getNextBlock();
	      if (canHaveDepth(blockType) && nextBlock && nextBlock.getDepth() === block.getDepth() + 1) {
	        this.output.push('\n');
	        // This is a litle hacky: temporarily stash our current wrapperTag and
	        // render child list(s).
	        var thisWrapperTag = this.wrapperTag;
	        this.wrapperTag = null;
	        this.indentLevel += 1;
	        this.currentBlock += 1;
	        this.processBlocksAtDepth(nextBlock.getDepth());
	        this.wrapperTag = thisWrapperTag;
	        this.indentLevel -= 1;
	        this.indent();
	      } else {
	        this.currentBlock += 1;
	      }
	      this.writeEndTag(block);
	    }
	  }, {
	    key: 'processBlocksAtDepth',
	    value: function processBlocksAtDepth(depth) {
	      var block = this.blocks[this.currentBlock];
	      while (block && block.getDepth() === depth) {
	        this.processBlock();
	        block = this.blocks[this.currentBlock];
	      }
	      this.closeWrapperTag();
	    }
	  }, {
	    key: 'getNextBlock',
	    value: function getNextBlock() {
	      return this.blocks[this.currentBlock + 1];
	    }
	  }, {
	    key: 'writeStartTag',
	    value: function writeStartTag(block) {
	      var tags = getTags(block.getType());

	      var attrString = void 0;
	      if (this.options.blockStyleFn) {
	        var _ref = this.options.blockStyleFn(block) || {};

	        var _attributes = _ref.attributes;
	        var _style = _ref.style;
	        // Normalize `className` -> `class`, etc.

	        _attributes = (0, _normalizeAttributes2.default)(_attributes);
	        if (_style != null) {
	          var styleAttr = (0, _styleToCSS2.default)(_style);
	          _attributes = _attributes == null ? { style: styleAttr } : _extends({}, _attributes, { style: styleAttr });
	        }
	        attrString = stringifyAttrs(_attributes);
	      } else {
	        attrString = '';
	      }

	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;

	      try {
	        for (var _iterator3 = tags[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var tag = _step3.value;

	          this.output.push('<' + tag + attrString + '>');
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'writeEndTag',
	    value: function writeEndTag(block) {
	      var tags = getTags(block.getType());
	      if (tags.length === 1) {
	        this.output.push('</' + tags[0] + '>\n');
	      } else {
	        var output = [];
	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;

	        try {
	          for (var _iterator4 = tags[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	            var tag = _step4.value;

	            output.unshift('</' + tag + '>');
	          }
	        } catch (err) {
	          _didIteratorError4 = true;
	          _iteratorError4 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	              _iterator4.return();
	            }
	          } finally {
	            if (_didIteratorError4) {
	              throw _iteratorError4;
	            }
	          }
	        }

	        this.output.push(output.join('') + '\n');
	      }
	    }
	  }, {
	    key: 'openWrapperTag',
	    value: function openWrapperTag(wrapperTag) {
	      this.wrapperTag = wrapperTag;
	      this.indent();
	      this.output.push('<' + wrapperTag + '>\n');
	      this.indentLevel += 1;
	    }
	  }, {
	    key: 'closeWrapperTag',
	    value: function closeWrapperTag() {
	      var wrapperTag = this.wrapperTag;

	      if (wrapperTag) {
	        this.indentLevel -= 1;
	        this.indent();
	        this.output.push('</' + wrapperTag + '>\n');
	        this.wrapperTag = null;
	      }
	    }
	  }, {
	    key: 'indent',
	    value: function indent() {
	      this.output.push(INDENT.repeat(this.indentLevel));
	    }
	  }, {
	    key: 'renderBlockContent',
	    value: function renderBlockContent(block) {
	      var _this = this;

	      var blockType = block.getType();
	      var text = block.getText();
	      if (text === '') {
	        // Prevent element collapse if completely empty.
	        return BREAK;
	      }
	      text = this.preserveWhitespace(text);
	      var charMetaList = block.getCharacterList();
	      var entityPieces = (0, _draftJsUtils.getEntityRanges)(text, charMetaList);
	      return entityPieces.map(function (_ref2) {
	        var _ref3 = _slicedToArray(_ref2, 2);

	        var entityKey = _ref3[0];
	        var stylePieces = _ref3[1];

	        var content = stylePieces.map(function (_ref4) {
	          var _ref5 = _slicedToArray(_ref4, 2);

	          var text = _ref5[0];
	          var styleSet = _ref5[1];

	          var content = encodeContent(text);
	          var _iteratorNormalCompletion5 = true;
	          var _didIteratorError5 = false;
	          var _iteratorError5 = undefined;

	          try {
	            for (var _iterator5 = _this.styleOrder[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	              var _styleName = _step5.value;

	              // If our block type is CODE then don't wrap inline code elements.
	              if (_styleName === CODE && blockType === _draftJsUtils.BLOCK_TYPE.CODE) {
	                continue;
	              }
	              if (styleSet.has(_styleName)) {
	                var _inlineStyles$_styleN = _this.inlineStyles[_styleName];
	                var _element = _inlineStyles$_styleN.element;
	                var _attributes2 = _inlineStyles$_styleN.attributes;
	                var _style2 = _inlineStyles$_styleN.style;

	                if (_element == null) {
	                  _element = 'span';
	                }
	                // Normalize `className` -> `class`, etc.
	                _attributes2 = (0, _normalizeAttributes2.default)(_attributes2);
	                if (_style2 != null) {
	                  var styleAttr = (0, _styleToCSS2.default)(_style2);
	                  _attributes2 = _attributes2 == null ? { style: styleAttr } : _extends({}, _attributes2, { style: styleAttr });
	                }
	                var attrString = stringifyAttrs(_attributes2);
	                content = '<' + _element + attrString + '>' + content + '</' + _element + '>';
	              }
	            }
	          } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                _iterator5.return();
	              }
	            } finally {
	              if (_didIteratorError5) {
	                throw _iteratorError5;
	              }
	            }
	          }

	          return content;
	        }).join('');
	        var entity = entityKey ? _draftJs.Entity.get(entityKey) : null;
	        // Note: The `toUpperCase` below is for compatability with some libraries that use lower-case for image blocks.
	        var entityType = entity == null ? null : entity.getType().toUpperCase();
	        if (entityType != null && entityType === _draftJsUtils.ENTITY_TYPE.LINK) {
	          var attrs = DATA_TO_ATTR.hasOwnProperty(entityType) ? DATA_TO_ATTR[entityType](entityType, entity) : null;
	          var attrString = stringifyAttrs(attrs);
	          return '<a' + attrString + '>' + content + '</a>';
	        } else if (entityType != null && entityType === _draftJsUtils.ENTITY_TYPE.IMAGE) {
	          var _attrs = DATA_TO_ATTR.hasOwnProperty(entityType) ? DATA_TO_ATTR[entityType](entityType, entity) : null;
	          var _attrString = stringifyAttrs(_attrs);
	          return '<img' + _attrString + '/>';
	        } else {
	          return content;
	        }
	      }).join('');
	    }
	  }, {
	    key: 'preserveWhitespace',
	    value: function preserveWhitespace(text) {
	      var length = text.length;
	      // Prevent leading/trailing/consecutive whitespace collapse.
	      var newText = new Array(length);
	      for (var i = 0; i < length; i++) {
	        if (text[i] === ' ' && (i === 0 || i === length - 1 || text[i - 1] === ' ')) {
	          newText[i] = '\xA0';
	        } else {
	          newText[i] = text[i];
	        }
	      }
	      return newText.join('');
	    }
	  }]);

	  return MarkupGenerator;
	}();

	function stringifyAttrs(attrs) {
	  if (attrs == null) {
	    return '';
	  }
	  var parts = [];
	  var _iteratorNormalCompletion6 = true;
	  var _didIteratorError6 = false;
	  var _iteratorError6 = undefined;

	  try {
	    for (var _iterator6 = Object.keys(attrs)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	      var name = _step6.value;

	      var value = attrs[name];
	      if (value != null) {
	        parts.push(' ' + name + '="' + encodeAttr(value + '') + '"');
	      }
	    }
	  } catch (err) {
	    _didIteratorError6 = true;
	    _iteratorError6 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion6 && _iterator6.return) {
	        _iterator6.return();
	      }
	    } finally {
	      if (_didIteratorError6) {
	        throw _iteratorError6;
	      }
	    }
	  }

	  return parts.join('');
	}

	function canHaveDepth(blockType) {
	  switch (blockType) {
	    case _draftJsUtils.BLOCK_TYPE.UNORDERED_LIST_ITEM:
	    case _draftJsUtils.BLOCK_TYPE.ORDERED_LIST_ITEM:
	      return true;
	    default:
	      return false;
	  }
	}

	function encodeContent(text) {
	  return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join(BREAK + '\n');
	}

	function encodeAttr(text) {
	  return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
	}

	function stateToHTML(content, options) {
	  return new MarkupGenerator(content, options).generate();
	}

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function combineOrderedStyles(customMap, defaults) {
	  if (customMap == null) {
	    return defaults;
	  }

	  var _defaults = _slicedToArray(defaults, 2);

	  var defaultStyleMap = _defaults[0];
	  var defaultStyleOrder = _defaults[1];

	  var styleMap = _extends({}, defaultStyleMap);
	  var styleOrder = [].concat(_toConsumableArray(defaultStyleOrder));
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = Object.keys(customMap)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var _styleName = _step.value;

	      if (defaultStyleMap.hasOwnProperty(_styleName)) {
	        var defaultStyles = defaultStyleMap[_styleName];
	        styleMap[_styleName] = _extends({}, defaultStyles, customMap[_styleName]);
	      } else {
	        styleMap[_styleName] = customMap[_styleName];
	        styleOrder.push(_styleName);
	      }
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

	  return [styleMap, styleOrder];
	}

	exports.default = combineOrderedStyles;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});


	// Lifted from: https://github.com/facebook/react/blob/master/src/renderers/dom/shared/HTMLDOMPropertyConfig.js
	var ATTR_NAME_MAP = {
	  acceptCharset: 'accept-charset',
	  className: 'class',
	  htmlFor: 'for',
	  httpEquiv: 'http-equiv'
	};

	function normalizeAttributes(attributes) {
	  if (attributes == null) {
	    return attributes;
	  }
	  var normalized = {};
	  var didNormalize = false;
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = Object.keys(attributes)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var name = _step.value;

	      var newName = name;
	      if (ATTR_NAME_MAP.hasOwnProperty(name)) {
	        newName = ATTR_NAME_MAP[name];
	        didNormalize = true;
	      }
	      normalized[newName] = attributes[name];
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

	  return didNormalize ? normalized : attributes;
	}

	exports.default = normalizeAttributes;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _CSSProperty = __webpack_require__(6);

	var VENDOR_PREFIX = /^(moz|ms|o|webkit)-/;

	var NUMERIC_STRING = /^\d+$/;
	var UPPERCASE_PATTERN = /([A-Z])/g;

	// Lifted from: https://github.com/facebook/react/blob/master/src/renderers/dom/shared/CSSPropertyOperations.js
	function processStyleName(name) {
	  return name.replace(UPPERCASE_PATTERN, '-$1').toLowerCase().replace(VENDOR_PREFIX, '-$1-');
	}

	// Lifted from: https://github.com/facebook/react/blob/master/src/renderers/dom/shared/dangerousStyleValue.js
	function processStyleValue(name, value) {
	  var isNumeric = void 0;
	  if (typeof value === 'string') {
	    isNumeric = NUMERIC_STRING.test(value);
	  } else {
	    isNumeric = true;
	    value = String(value);
	  }
	  if (!isNumeric || value === '0' || _CSSProperty.isUnitlessNumber[name] === true) {
	    return value;
	  } else {
	    return value + 'px';
	  }
	}

	function styleToCSS(styleDescr) {
	  return Object.keys(styleDescr).map(function (name) {
	    var styleValue = processStyleValue(name, styleDescr[name]);
	    var styleName = processStyleName(name);
	    return styleName + ': ' + styleValue;
	  }).join('; ');
	}

	exports.default = styleToCSS;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-present, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule CSSProperty
	 */

	'use strict';

	/**
	 * CSS properties which accept numbers but are not in units of "px".
	 */

	var isUnitlessNumber = {
	  animationIterationCount: true,
	  borderImageOutset: true,
	  borderImageSlice: true,
	  borderImageWidth: true,
	  boxFlex: true,
	  boxFlexGroup: true,
	  boxOrdinalGroup: true,
	  columnCount: true,
	  flex: true,
	  flexGrow: true,
	  flexPositive: true,
	  flexShrink: true,
	  flexNegative: true,
	  flexOrder: true,
	  gridRow: true,
	  gridColumn: true,
	  fontWeight: true,
	  lineClamp: true,
	  lineHeight: true,
	  opacity: true,
	  order: true,
	  orphans: true,
	  tabSize: true,
	  widows: true,
	  zIndex: true,
	  zoom: true,

	  // SVG-related properties
	  fillOpacity: true,
	  floodOpacity: true,
	  stopOpacity: true,
	  strokeDasharray: true,
	  strokeDashoffset: true,
	  strokeMiterlimit: true,
	  strokeOpacity: true,
	  strokeWidth: true
	};

	/**
	 * @param {string} prefix vendor-specific prefix, eg: Webkit
	 * @param {string} key style name, eg: transitionDuration
	 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
	 * WebkitTransitionDuration
	 */
	function prefixKey(prefix, key) {
	  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
	}

	/**
	 * Support style names that may come passed in prefixed by adding permutations
	 * of vendor prefixes.
	 */
	var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

	// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
	// infinite loop, because it iterates over the newly added props too.
	Object.keys(isUnitlessNumber).forEach(function (prop) {
	  prefixes.forEach(function (prefix) {
	    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
	  });
	});

	/**
	 * Most style properties can be unset by doing .style[prop] = '' but IE8
	 * doesn't like doing that with shorthand properties so for the properties that
	 * IE8 breaks on, which are listed here, we instead unset each of the
	 * individual properties. See http://bugs.jquery.com/ticket/12385.
	 * The 4-value 'clock' properties like margin, padding, border-width seem to
	 * behave without any problems. Curiously, list-style works too without any
	 * special prodding.
	 */
	var shorthandPropertyExpansions = {
	  background: {
	    backgroundAttachment: true,
	    backgroundColor: true,
	    backgroundImage: true,
	    backgroundPositionX: true,
	    backgroundPositionY: true,
	    backgroundRepeat: true
	  },
	  backgroundPosition: {
	    backgroundPositionX: true,
	    backgroundPositionY: true
	  },
	  border: {
	    borderWidth: true,
	    borderStyle: true,
	    borderColor: true
	  },
	  borderBottom: {
	    borderBottomWidth: true,
	    borderBottomStyle: true,
	    borderBottomColor: true
	  },
	  borderLeft: {
	    borderLeftWidth: true,
	    borderLeftStyle: true,
	    borderLeftColor: true
	  },
	  borderRight: {
	    borderRightWidth: true,
	    borderRightStyle: true,
	    borderRightColor: true
	  },
	  borderTop: {
	    borderTopWidth: true,
	    borderTopStyle: true,
	    borderTopColor: true
	  },
	  font: {
	    fontStyle: true,
	    fontVariant: true,
	    fontWeight: true,
	    fontSize: true,
	    lineHeight: true,
	    fontFamily: true
	  },
	  outline: {
	    outlineWidth: true,
	    outlineStyle: true,
	    outlineColor: true
	  }
	};

	var CSSProperty = {
	  isUnitlessNumber: isUnitlessNumber,
	  shorthandPropertyExpansions: shorthandPropertyExpansions
	};

	module.exports = CSSProperty;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = Draft;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Constants = __webpack_require__(9);

	Object.keys(_Constants).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _Constants[key];
	    }
	  });
	});
	Object.defineProperty(exports, 'Constants', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Constants).default;
	  }
	});

	var _getEntityRanges = __webpack_require__(10);

	Object.defineProperty(exports, 'getEntityRanges', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_getEntityRanges).default;
	  }
	});

	var _getSelectedBlocks = __webpack_require__(12);

	Object.defineProperty(exports, 'getSelectedBlocks', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_getSelectedBlocks).default;
	  }
	});

	var _selectionContainsEntity = __webpack_require__(13);

	Object.defineProperty(exports, 'selectionContainsEntity', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_selectionContainsEntity).default;
	  }
	});

	var _callModifierForSelectedBlocks = __webpack_require__(14);

	Object.defineProperty(exports, 'callModifierForSelectedBlocks', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_callModifierForSelectedBlocks).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var BLOCK_TYPE = exports.BLOCK_TYPE = {
	  // This is used to represent a normal text block (paragraph).
	  UNSTYLED: 'unstyled',
	  HEADER_ONE: 'header-one',
	  HEADER_TWO: 'header-two',
	  HEADER_THREE: 'header-three',
	  HEADER_FOUR: 'header-four',
	  HEADER_FIVE: 'header-five',
	  HEADER_SIX: 'header-six',
	  UNORDERED_LIST_ITEM: 'unordered-list-item',
	  ORDERED_LIST_ITEM: 'ordered-list-item',
	  BLOCKQUOTE: 'blockquote',
	  PULLQUOTE: 'pullquote',
	  CODE: 'code-block',
	  ATOMIC: 'atomic'
	};

	var ENTITY_TYPE = exports.ENTITY_TYPE = {
	  LINK: 'LINK',
	  IMAGE: 'IMAGE'
	};

	var INLINE_STYLE = exports.INLINE_STYLE = {
	  BOLD: 'BOLD',
	  CODE: 'CODE',
	  ITALIC: 'ITALIC',
	  STRIKETHROUGH: 'STRIKETHROUGH',
	  UNDERLINE: 'UNDERLINE'
	};

	exports.default = {
	  BLOCK_TYPE: BLOCK_TYPE,
	  ENTITY_TYPE: ENTITY_TYPE,
	  INLINE_STYLE: INLINE_STYLE
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EMPTY_SET = undefined;
	exports.default = getEntityRanges;

	var _immutable = __webpack_require__(11);

	var EMPTY_SET = exports.EMPTY_SET = new _immutable.OrderedSet();
	function getEntityRanges(text, charMetaList) {
	  var charEntity = null;
	  var prevCharEntity = null;
	  var ranges = [];
	  var rangeStart = 0;
	  for (var i = 0, len = text.length; i < len; i++) {
	    prevCharEntity = charEntity;
	    var meta = charMetaList.get(i);
	    charEntity = meta ? meta.getEntity() : null;
	    if (i > 0 && charEntity !== prevCharEntity) {
	      ranges.push([prevCharEntity, getStyleRanges(text.slice(rangeStart, i), charMetaList.slice(rangeStart, i))]);
	      rangeStart = i;
	    }
	  }
	  ranges.push([charEntity, getStyleRanges(text.slice(rangeStart), charMetaList.slice(rangeStart))]);
	  return ranges;
	}

	function getStyleRanges(text, charMetaList) {
	  var charStyle = EMPTY_SET;
	  var prevCharStyle = EMPTY_SET;
	  var ranges = [];
	  var rangeStart = 0;
	  for (var i = 0, len = text.length; i < len; i++) {
	    prevCharStyle = charStyle;
	    var meta = charMetaList.get(i);
	    charStyle = meta ? meta.getStyle() : EMPTY_SET;
	    if (i > 0 && !(0, _immutable.is)(charStyle, prevCharStyle)) {
	      ranges.push([text.slice(rangeStart, i), prevCharStyle]);
	      rangeStart = i;
	    }
	  }
	  ranges.push([text.slice(rangeStart), charStyle]);
	  return ranges;
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = Immutable;

/***/ },
/* 12 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	/**
	 * Returns an array of all `ContentBlock` instances within two block keys
	 *
	 * @param  {object} contentState A draft.js `ContentState` instance
	 * @param  {string} anchorKey    The block key to start searching from
	 * @param  {string} focusKey     The block key until which to search
	 *
	 * @return {array} An array containing the found content blocks
	 */
	exports.default = function (contentState, anchorKey, focusKey) {
	  var isSameBlock = anchorKey === focusKey;
	  var startingBlock = contentState.getBlockForKey(anchorKey);

	  if (!startingBlock) {
	    return [];
	  }

	  var selectedBlocks = [startingBlock];

	  if (!isSameBlock) {
	    var blockKey = anchorKey;

	    while (blockKey !== focusKey) {
	      var nextBlock = contentState.getBlockAfter(blockKey);

	      if (!nextBlock) {
	        selectedBlocks = [];
	        break;
	      }

	      selectedBlocks.push(nextBlock);
	      blockKey = nextBlock.getKey();
	    }
	  }

	  return selectedBlocks;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getSelectedBlocks = __webpack_require__(12);

	var _getSelectedBlocks2 = _interopRequireDefault(_getSelectedBlocks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (strategy) {
	  return function (editorState, selection) {
	    var contentState = editorState.getCurrentContent();
	    var currentSelection = selection || editorState.getSelection();
	    var startKey = currentSelection.getStartKey();
	    var endKey = currentSelection.getEndKey();
	    var startOffset = currentSelection.getStartOffset();
	    var endOffset = currentSelection.getEndOffset();

	    var isSameBlock = startKey === endKey;
	    var selectedBlocks = (0, _getSelectedBlocks2.default)(contentState, startKey, endKey);
	    var entityFound = false;

	    // We have to shift the offset to not get false positives when selecting
	    // a character just before or after an entity
	    var finalStartOffset = startOffset + 1;
	    var finalEndOffset = endOffset - 1;

	    selectedBlocks.forEach(function (block) {
	      strategy(block, function (start, end) {
	        if (entityFound) {
	          return;
	        }

	        var blockKey = block.getKey();

	        if (isSameBlock && (end < finalStartOffset || start > finalEndOffset)) {
	          return;
	        } else if (blockKey === startKey && end < finalStartOffset) {
	          return;
	        } else if (blockKey === endKey && start > finalEndOffset) {
	          return;
	        }

	        entityFound = true;
	      });
	    });

	    return entityFound;
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _draftJs = __webpack_require__(7);

	var _getSelectedBlocks = __webpack_require__(12);

	var _getSelectedBlocks2 = _interopRequireDefault(_getSelectedBlocks);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Calls a provided `modifier` function with a selection for each
	 * selected block in the current editor selection. Passes through additional
	 * arguments to the modifier.
	 *
	 * Note: At the moment it will retain the original selection and override
	 * possible selection changes from modifiers
	 *
	 * @param  {object} editorState The current draft.js editor state object
	 *
	 * @param  {function} modifier  A modifier function to be executed.
	 *                              Must have the signature (editorState, selection, ...)
	 *
	 * @param  {mixed} ...args      Additional arguments to be passed through to the modifier
	 *
	 * @return {object} The new editor state
	 */
	exports.default = function (editorState, modifier) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  var contentState = editorState.getCurrentContent();
	  var currentSelection = editorState.getSelection();

	  var startKey = currentSelection.getStartKey();
	  var endKey = currentSelection.getEndKey();
	  var startOffset = currentSelection.getStartOffset();
	  var endOffset = currentSelection.getEndOffset();

	  var isSameBlock = startKey === endKey;
	  var selectedBlocks = (0, _getSelectedBlocks2.default)(contentState, startKey, endKey);

	  var finalEditorState = editorState;
	  selectedBlocks.forEach(function (block) {
	    var currentBlockKey = block.getKey();
	    var selectionStart = startOffset;
	    var selectionEnd = endOffset;

	    if (currentBlockKey === startKey) {
	      selectionStart = startOffset;
	      selectionEnd = isSameBlock ? endOffset : block.getText().length;
	    } else if (currentBlockKey === endKey) {
	      selectionStart = isSameBlock ? startOffset : 0;
	      selectionEnd = endOffset;
	    } else {
	      selectionStart = 0;
	      selectionEnd = block.getText().length;
	    }

	    var selection = new _draftJs.SelectionState({
	      anchorKey: currentBlockKey,
	      anchorOffset: selectionStart,
	      focusKey: currentBlockKey,
	      focusOffset: selectionEnd
	    });

	    finalEditorState = modifier.apply(undefined, [finalEditorState, selection].concat(args));
	  });

	  return _draftJs.EditorState.forceSelection(finalEditorState, currentSelection);
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stateToMarkdown = __webpack_require__(16);

	Object.defineProperty(exports, 'stateToMarkdown', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_stateToMarkdown).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = stateToMarkdown;

	var _draftJsUtils = __webpack_require__(8);

	var _draftJs = __webpack_require__(7);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BOLD = _draftJsUtils.INLINE_STYLE.BOLD;
	var CODE = _draftJsUtils.INLINE_STYLE.CODE;
	var ITALIC = _draftJsUtils.INLINE_STYLE.ITALIC;
	var STRIKETHROUGH = _draftJsUtils.INLINE_STYLE.STRIKETHROUGH;
	var UNDERLINE = _draftJsUtils.INLINE_STYLE.UNDERLINE;


	var CODE_INDENT = '    ';

	var MarkupGenerator = function () {
	  function MarkupGenerator(contentState) {
	    _classCallCheck(this, MarkupGenerator);

	    this.contentState = contentState;
	  }

	  _createClass(MarkupGenerator, [{
	    key: 'generate',
	    value: function generate() {
	      this.output = [];
	      this.blocks = this.contentState.getBlockMap().toArray();
	      this.totalBlocks = this.blocks.length;
	      this.currentBlock = 0;
	      this.listItemCounts = {};
	      while (this.currentBlock < this.totalBlocks) {
	        this.processBlock();
	      }
	      return this.output.join('');
	    }
	  }, {
	    key: 'processBlock',
	    value: function processBlock() {
	      var block = this.blocks[this.currentBlock];
	      var blockType = block.getType();
	      switch (blockType) {
	        case _draftJsUtils.BLOCK_TYPE.HEADER_ONE:
	          {
	            this.insertLineBreaks(1);
	            this.output.push('# ' + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        case _draftJsUtils.BLOCK_TYPE.HEADER_TWO:
	          {
	            this.insertLineBreaks(1);
	            this.output.push('## ' + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        case _draftJsUtils.BLOCK_TYPE.HEADER_THREE:
	          {
	            this.insertLineBreaks(1);
	            this.output.push('### ' + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        case _draftJsUtils.BLOCK_TYPE.HEADER_FOUR:
	          {
	            this.insertLineBreaks(1);
	            this.output.push('#### ' + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        case _draftJsUtils.BLOCK_TYPE.HEADER_FIVE:
	          {
	            this.insertLineBreaks(1);
	            this.output.push('##### ' + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        case _draftJsUtils.BLOCK_TYPE.HEADER_SIX:
	          {
	            this.insertLineBreaks(1);
	            this.output.push('###### ' + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        case _draftJsUtils.BLOCK_TYPE.UNORDERED_LIST_ITEM:
	          {
	            var blockDepth = block.getDepth();
	            var lastBlock = this.getLastBlock();
	            var lastBlockType = lastBlock ? lastBlock.getType() : null;
	            var lastBlockDepth = lastBlock && canHaveDepth(lastBlockType) ? lastBlock.getDepth() : null;
	            if (lastBlockType !== blockType && lastBlockDepth !== blockDepth - 1) {
	              this.insertLineBreaks(1);
	              // Insert an additional line break if following opposite list type.
	              if (lastBlockType === _draftJsUtils.BLOCK_TYPE.ORDERED_LIST_ITEM) {
	                this.insertLineBreaks(1);
	              }
	            }
	            var indent = ' '.repeat(block.depth * 2);
	            this.output.push(indent + '- ' + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        case _draftJsUtils.BLOCK_TYPE.ORDERED_LIST_ITEM:
	          {
	            var _blockDepth = block.getDepth();
	            var _lastBlock = this.getLastBlock();
	            var _lastBlockType = _lastBlock ? _lastBlock.getType() : null;
	            var _lastBlockDepth = _lastBlock && canHaveDepth(_lastBlockType) ? _lastBlock.getDepth() : null;
	            if (_lastBlockType !== blockType && _lastBlockDepth !== _blockDepth - 1) {
	              this.insertLineBreaks(1);
	              // Insert an additional line break if following opposite list type.
	              if (_lastBlockType === _draftJsUtils.BLOCK_TYPE.UNORDERED_LIST_ITEM) {
	                this.insertLineBreaks(1);
	              }
	            }
	            var _indent = ' '.repeat(_blockDepth * 2);
	            // TODO: figure out what to do with two-digit numbers
	            var count = this.getListItemCount(block) % 10;
	            this.output.push(_indent + (count + '. ') + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        case _draftJsUtils.BLOCK_TYPE.BLOCKQUOTE:
	          {
	            this.insertLineBreaks(1);
	            this.output.push(' > ' + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        case _draftJsUtils.BLOCK_TYPE.CODE:
	          {
	            this.insertLineBreaks(1);
	            this.output.push(CODE_INDENT + this.renderBlockContent(block) + '\n');
	            break;
	          }
	        default:
	          {
	            this.insertLineBreaks(1);
	            this.output.push(this.renderBlockContent(block) + '\n');
	            break;
	          }
	      }
	      this.currentBlock += 1;
	    }
	  }, {
	    key: 'getLastBlock',
	    value: function getLastBlock() {
	      return this.blocks[this.currentBlock - 1];
	    }
	  }, {
	    key: 'getNextBlock',
	    value: function getNextBlock() {
	      return this.blocks[this.currentBlock + 1];
	    }
	  }, {
	    key: 'getListItemCount',
	    value: function getListItemCount(block) {
	      var blockType = block.getType();
	      var blockDepth = block.getDepth();
	      // To decide if we need to start over we need to backtrack (skipping list
	      // items that are of greater depth)
	      var index = this.currentBlock - 1;
	      var prevBlock = this.blocks[index];
	      while (prevBlock && canHaveDepth(prevBlock.getType()) && prevBlock.getDepth() > blockDepth) {
	        index -= 1;
	        prevBlock = this.blocks[index];
	      }
	      if (!prevBlock || prevBlock.getType() !== blockType || prevBlock.getDepth() !== blockDepth) {
	        this.listItemCounts[blockDepth] = 0;
	      }
	      return this.listItemCounts[blockDepth] = this.listItemCounts[blockDepth] + 1;
	    }
	  }, {
	    key: 'insertLineBreaks',
	    value: function insertLineBreaks() {
	      if (this.currentBlock > 0) {
	        this.output.push('\n');
	      }
	    }
	  }, {
	    key: 'renderBlockContent',
	    value: function renderBlockContent(block) {
	      var blockType = block.getType();
	      var text = block.getText();
	      if (text === '') {
	        // Prevent element collapse if completely empty.
	        // TODO: Replace with constant.
	        return '\u200B';
	      }
	      var charMetaList = block.getCharacterList();
	      var entityPieces = (0, _draftJsUtils.getEntityRanges)(text, charMetaList);
	      return entityPieces.map(function (_ref) {
	        var _ref2 = _slicedToArray(_ref, 2);

	        var entityKey = _ref2[0];
	        var stylePieces = _ref2[1];

	        var content = stylePieces.map(function (_ref3) {
	          var _ref4 = _slicedToArray(_ref3, 2);

	          var text = _ref4[0];
	          var style = _ref4[1];

	          // Don't allow empty inline elements.
	          if (!text) {
	            return '';
	          }
	          var content = encodeContent(text);
	          if (style.has(BOLD)) {
	            content = '**' + content + '**';
	          }
	          if (style.has(UNDERLINE)) {
	            // TODO: encode `+`?
	            content = '++' + content + '++';
	          }
	          if (style.has(ITALIC)) {
	            content = '_' + content + '_';
	          }
	          if (style.has(STRIKETHROUGH)) {
	            // TODO: encode `~`?
	            content = '~~' + content + '~~';
	          }
	          if (style.has(CODE)) {
	            content = blockType === _draftJsUtils.BLOCK_TYPE.CODE ? content : '`' + content + '`';
	          }
	          return content;
	        }).join('');
	        var entity = entityKey ? _draftJs.Entity.get(entityKey) : null;
	        if (entity != null && entity.getType() === _draftJsUtils.ENTITY_TYPE.LINK) {
	          var data = entity.getData();
	          var url = data.url || '';
	          var title = data.title ? ' "' + escapeTitle(data.title) + '"' : '';
	          return '[' + content + '](' + encodeURL(url) + title + ')';
	        } else if (entity != null && entity.getType() === _draftJsUtils.ENTITY_TYPE.IMAGE) {
	          var _data = entity.getData();
	          var src = _data.src || '';
	          var alt = _data.alt ? ' "' + escapeTitle(_data.alt) + '"' : '';
	          return '![' + alt + '](' + encodeURL(src) + ')';
	        } else {
	          return content;
	        }
	      }).join('');
	    }
	  }]);

	  return MarkupGenerator;
	}();

	function canHaveDepth(blockType) {
	  switch (blockType) {
	    case _draftJsUtils.BLOCK_TYPE.UNORDERED_LIST_ITEM:
	    case _draftJsUtils.BLOCK_TYPE.ORDERED_LIST_ITEM:
	      return true;
	    default:
	      return false;
	  }
	}

	function encodeContent(text) {
	  return text.replace(/[*_`]/g, '\\$&');
	}

	// Encode chars that would normally be allowed in a URL but would conflict with
	// our markdown syntax: `[foo](http://foo/)`
	function encodeURL(url) {
	  return url.replace(/\)/g, '%29');
	}

	// Escape quotes using backslash.
	function escapeTitle(text) {
	  return text.replace(/"/g, '\\"');
	}

	function stateToMarkdown(content) {
	  return new MarkupGenerator(content).generate();
	}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stateFromHTML = __webpack_require__(18);

	Object.defineProperty(exports, 'stateFromHTML', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_stateFromHTML).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = stateFromHTML;

	var _draftJsImportElement = __webpack_require__(19);

	var _parseHTML = __webpack_require__(23);

	var _parseHTML2 = _interopRequireDefault(_parseHTML);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function stateFromHTML(html, options) {
	  var parser = options == null || options.parser == null ? _parseHTML2.default : options.parser;
	  var element = parser(html);
	  return (0, _draftJsImportElement.stateFromElement)(element, options);
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stateFromElement = __webpack_require__(20);

	Object.defineProperty(exports, 'stateFromElement', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_stateFromElement).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.default = stateFromElement;

	var _replaceTextWithMeta3 = __webpack_require__(21);

	var _replaceTextWithMeta4 = _interopRequireDefault(_replaceTextWithMeta3);

	var _draftJs = __webpack_require__(7);

	var _immutable = __webpack_require__(11);

	var _draftJsUtils = __webpack_require__(8);

	var _syntheticDom = __webpack_require__(22);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// A ParsedBlock has two purposes:
	//   1) to keep data about the block (textFragments, type)
	//   2) to act as some context for storing parser state as we parse its contents
	var NO_STYLE = (0, _immutable.OrderedSet)();
	var NO_ENTITY = null;

	var EMPTY_BLOCK = new _draftJs.ContentBlock({
	  key: (0, _draftJs.genKey)(),
	  text: '',
	  type: _draftJsUtils.BLOCK_TYPE.UNSTYLED,
	  characterList: (0, _immutable.List)(),
	  depth: 0
	});

	var LINE_BREAKS = /(\r\n|\r|\n)/g;
	// We use `\r` because that character is always stripped from source (normalized
	// to `\n`), so it's safe to assume it will only appear in the text content when
	// we put it there as a placeholder.
	var SOFT_BREAK_PLACEHOLDER = '\r';
	var ZERO_WIDTH_SPACE = '\u200B';
	var DATA_ATTRIBUTE = /^data-([a-z0-9-]+)$/;

	// Map element attributes to entity data.
	var ELEM_ATTR_MAP = {
	  a: { href: 'url', rel: 'rel', target: 'target', title: 'title' },
	  img: { src: 'src', alt: 'alt' }
	};

	var getEntityData = function getEntityData(tagName, element) {
	  var data = {};
	  if (ELEM_ATTR_MAP.hasOwnProperty(tagName)) {
	    var attrMap = ELEM_ATTR_MAP[tagName];
	    for (var i = 0; i < element.attributes.length; i++) {
	      var _element$attributes$i = element.attributes[i];
	      var name = _element$attributes$i.name;
	      var value = _element$attributes$i.value;

	      if (value != null) {
	        if (attrMap.hasOwnProperty(name)) {
	          var newName = attrMap[name];
	          data[newName] = value;
	        } else if (DATA_ATTRIBUTE.test(name)) {
	          data[name] = value;
	        }
	      }
	    }
	  }
	  return data;
	};

	// Functions to convert elements to entities.
	var ELEM_TO_ENTITY = {
	  a: function a(tagName, element) {
	    var data = getEntityData(tagName, element);
	    // Don't add `<a>` elements with no href.
	    if (data.url != null) {
	      return _draftJs.Entity.create(_draftJsUtils.ENTITY_TYPE.LINK, 'MUTABLE', data);
	    }
	  },
	  img: function img(tagName, element) {
	    var data = getEntityData(tagName, element);
	    // Don't add `<img>` elements with no src.
	    if (data.src != null) {
	      return _draftJs.Entity.create(_draftJsUtils.ENTITY_TYPE.IMAGE, 'MUTABLE', data);
	    }
	  }
	};

	// TODO: Move this out to a module.
	var INLINE_ELEMENTS = {
	  a: 1, abbr: 1, area: 1, audio: 1, b: 1, bdi: 1, bdo: 1, br: 1, button: 1,
	  canvas: 1, cite: 1, code: 1, command: 1, datalist: 1, del: 1, dfn: 1, em: 1,
	  embed: 1, i: 1, iframe: 1, img: 1, input: 1, ins: 1, kbd: 1, keygen: 1,
	  label: 1, map: 1, mark: 1, meter: 1, noscript: 1, object: 1, output: 1,
	  progress: 1, q: 1, ruby: 1, s: 1, samp: 1, script: 1, select: 1, small: 1,
	  span: 1, strong: 1, sub: 1, sup: 1, textarea: 1, time: 1, u: 1, var: 1,
	  video: 1, wbr: 1, acronym: 1, applet: 1, basefont: 1, big: 1, font: 1,
	  isindex: 1, strike: 1, style: 1, tt: 1
	};

	// These elements are special because they cannot contain text as a direct
	// child (some cannot contain childNodes at all).
	var SPECIAL_ELEMENTS = {
	  area: 1, base: 1, br: 1, col: 1, colgroup: 1, command: 1, dl: 1, embed: 1,
	  head: 1, hgroup: 1, hr: 1, iframe: 1, img: 1, input: 1, keygen: 1, link: 1,
	  meta: 1, ol: 1, optgroup: 1, option: 1, param: 1, script: 1, select: 1,
	  source: 1, style: 1, table: 1, tbody: 1, textarea: 1, tfoot: 1, thead: 1,
	  title: 1, tr: 1, track: 1, ul: 1, wbr: 1, basefont: 1, dialog: 1, dir: 1,
	  isindex: 1
	};

	// These elements are special because they cannot contain childNodes.
	var SELF_CLOSING_ELEMENTS = { img: 1 };

	var BlockGenerator = function () {
	  function BlockGenerator() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, BlockGenerator);

	    this.options = options;
	    // This represents the hierarchy as we traverse nested elements; for
	    // example [body, ul, li] where we must know li's parent type (ul or ol).
	    this.blockStack = [];
	    // This is a linear list of blocks that will form the output; for example
	    // [p, li, li, blockquote].
	    this.blockList = [];
	    this.depth = 0;
	  }

	  _createClass(BlockGenerator, [{
	    key: 'process',
	    value: function process(element) {
	      this.processBlockElement(element);
	      var contentBlocks = [];
	      this.blockList.forEach(function (block) {
	        var _concatFragments = concatFragments(block.textFragments);

	        var text = _concatFragments.text;
	        var characterMeta = _concatFragments.characterMeta;

	        var includeEmptyBlock = false;
	        // If the block contains only a soft break then don't discard the block,
	        // but discard the soft break.
	        if (text === SOFT_BREAK_PLACEHOLDER) {
	          includeEmptyBlock = true;
	          text = '';
	        }
	        if (block.tagName === 'pre') {
	          var _trimLeadingNewline = trimLeadingNewline(text, characterMeta);

	          text = _trimLeadingNewline.text;
	          characterMeta = _trimLeadingNewline.characterMeta;
	        } else {
	          var _collapseWhiteSpace = collapseWhiteSpace(text, characterMeta);

	          text = _collapseWhiteSpace.text;
	          characterMeta = _collapseWhiteSpace.characterMeta;
	        }
	        // Previously we were using a placeholder for soft breaks. Now that we
	        // have collapsed whitespace we can change it back to normal line breaks.
	        text = text.split(SOFT_BREAK_PLACEHOLDER).join('\n');
	        // Discard empty blocks (unless otherwise specified).
	        if (text.length || includeEmptyBlock) {
	          contentBlocks.push(new _draftJs.ContentBlock({
	            key: (0, _draftJs.genKey)(),
	            text: text,
	            type: block.type,
	            characterList: characterMeta.toList(),
	            depth: block.depth
	          }));
	        }
	      });
	      if (contentBlocks.length) {
	        return contentBlocks;
	      } else {
	        return [EMPTY_BLOCK];
	      }
	    }
	  }, {
	    key: 'getBlockTypeFromTagName',
	    value: function getBlockTypeFromTagName(tagName) {
	      var blockTypes = this.options.blockTypes;

	      if (blockTypes && blockTypes[tagName]) {
	        return blockTypes[tagName];
	      }

	      switch (tagName) {
	        case 'li':
	          {
	            var parent = this.blockStack.slice(-1)[0];
	            return parent.tagName === 'ol' ? _draftJsUtils.BLOCK_TYPE.ORDERED_LIST_ITEM : _draftJsUtils.BLOCK_TYPE.UNORDERED_LIST_ITEM;
	          }
	        case 'blockquote':
	          {
	            return _draftJsUtils.BLOCK_TYPE.BLOCKQUOTE;
	          }
	        case 'h1':
	          {
	            return _draftJsUtils.BLOCK_TYPE.HEADER_ONE;
	          }
	        case 'h2':
	          {
	            return _draftJsUtils.BLOCK_TYPE.HEADER_TWO;
	          }
	        case 'h3':
	          {
	            return _draftJsUtils.BLOCK_TYPE.HEADER_THREE;
	          }
	        case 'h4':
	          {
	            return _draftJsUtils.BLOCK_TYPE.HEADER_FOUR;
	          }
	        case 'h5':
	          {
	            return _draftJsUtils.BLOCK_TYPE.HEADER_FIVE;
	          }
	        case 'h6':
	          {
	            return _draftJsUtils.BLOCK_TYPE.HEADER_SIX;
	          }
	        case 'pre':
	          {
	            return _draftJsUtils.BLOCK_TYPE.CODE;
	          }
	        case 'figure':
	          {
	            return _draftJsUtils.BLOCK_TYPE.ATOMIC;
	          }
	        default:
	          {
	            return _draftJsUtils.BLOCK_TYPE.UNSTYLED;
	          }
	      }
	    }
	  }, {
	    key: 'processBlockElement',
	    value: function processBlockElement(element) {
	      if (!element) {
	        return;
	      }
	      var tagName = element.nodeName.toLowerCase();
	      var type = this.getBlockTypeFromTagName(tagName);
	      var hasDepth = canHaveDepth(type);
	      var allowRender = !SPECIAL_ELEMENTS.hasOwnProperty(tagName);
	      var block = {
	        tagName: tagName,
	        textFragments: [],
	        type: type,
	        styleStack: [NO_STYLE],
	        entityStack: [NO_ENTITY],
	        depth: hasDepth ? this.depth : 0
	      };
	      if (allowRender) {
	        this.blockList.push(block);
	        if (hasDepth) {
	          this.depth += 1;
	        }
	      }
	      this.blockStack.push(block);
	      if (element.childNodes != null) {
	        Array.from(element.childNodes).forEach(this.processNode, this);
	      }
	      this.blockStack.pop();
	      if (allowRender && hasDepth) {
	        this.depth -= 1;
	      }
	    }
	  }, {
	    key: 'processInlineElement',
	    value: function processInlineElement(element) {
	      var tagName = element.nodeName.toLowerCase();
	      if (tagName === 'br') {
	        this.processText(SOFT_BREAK_PLACEHOLDER);
	        return;
	      }
	      var block = this.blockStack.slice(-1)[0];
	      var style = block.styleStack.slice(-1)[0];
	      var entityKey = block.entityStack.slice(-1)[0];
	      style = addStyleFromTagName(style, tagName, this.options.elementStyles);
	      if (ELEM_TO_ENTITY.hasOwnProperty(tagName)) {
	        // If the to-entity function returns nothing, use the existing entity.
	        entityKey = ELEM_TO_ENTITY[tagName](tagName, element) || entityKey;
	      }
	      block.styleStack.push(style);
	      block.entityStack.push(entityKey);
	      if (element.childNodes != null) {
	        Array.from(element.childNodes).forEach(this.processNode, this);
	      }
	      if (SELF_CLOSING_ELEMENTS.hasOwnProperty(tagName)) {
	        this.processText('\xA0');
	      }
	      block.entityStack.pop();
	      block.styleStack.pop();
	    }
	  }, {
	    key: 'processTextNode',
	    value: function processTextNode(node) {
	      var text = node.nodeValue;
	      // This is important because we will use \r as a placeholder for a soft break.
	      text = text.replace(LINE_BREAKS, '\n');
	      // Replace zero-width space (we use it as a placeholder in markdown) with a
	      // soft break.
	      // TODO: The import-markdown package should correctly turn breaks into <br>
	      // elements so we don't need to include this hack.
	      text = text.split(ZERO_WIDTH_SPACE).join(SOFT_BREAK_PLACEHOLDER);
	      this.processText(text);
	    }
	  }, {
	    key: 'processText',
	    value: function processText(text) {
	      var block = this.blockStack.slice(-1)[0];
	      var style = block.styleStack.slice(-1)[0];
	      var entity = block.entityStack.slice(-1)[0];
	      var charMetadata = _draftJs.CharacterMetadata.create({
	        style: style,
	        entity: entity
	      });
	      var seq = (0, _immutable.Repeat)(charMetadata, text.length);
	      block.textFragments.push({
	        text: text,
	        characterMeta: seq
	      });
	    }
	  }, {
	    key: 'processNode',
	    value: function processNode(node) {
	      if (node.nodeType === _syntheticDom.NODE_TYPE_ELEMENT) {
	        var element = node;
	        var _tagName = element.nodeName.toLowerCase();
	        if (INLINE_ELEMENTS.hasOwnProperty(_tagName)) {
	          this.processInlineElement(element);
	        } else {
	          this.processBlockElement(element);
	        }
	      } else if (node.nodeType === _syntheticDom.NODE_TYPE_TEXT) {
	        this.processTextNode(node);
	      }
	    }
	  }]);

	  return BlockGenerator;
	}();

	function trimLeadingNewline(text, characterMeta) {
	  if (text.charAt(0) === '\n') {
	    text = text.slice(1);
	    characterMeta = characterMeta.slice(1);
	  }
	  return { text: text, characterMeta: characterMeta };
	}

	function trimLeadingSpace(text, characterMeta) {
	  while (text.charAt(0) === ' ') {
	    text = text.slice(1);
	    characterMeta = characterMeta.slice(1);
	  }
	  return { text: text, characterMeta: characterMeta };
	}

	function trimTrailingSpace(text, characterMeta) {
	  while (text.slice(-1) === ' ') {
	    text = text.slice(0, -1);
	    characterMeta = characterMeta.slice(0, -1);
	  }
	  return { text: text, characterMeta: characterMeta };
	}

	function collapseWhiteSpace(text, characterMeta) {
	  text = text.replace(/[ \t\n]/g, ' ');

	  var _trimLeadingSpace = trimLeadingSpace(text, characterMeta);

	  text = _trimLeadingSpace.text;
	  characterMeta = _trimLeadingSpace.characterMeta;

	  var _trimTrailingSpace = trimTrailingSpace(text, characterMeta);

	  text = _trimTrailingSpace.text;
	  characterMeta = _trimTrailingSpace.characterMeta;

	  var i = text.length;
	  while (i--) {
	    if (text.charAt(i) === ' ' && text.charAt(i - 1) === ' ') {
	      text = text.slice(0, i) + text.slice(i + 1);
	      characterMeta = characterMeta.slice(0, i).concat(characterMeta.slice(i + 1));
	    }
	  }
	  // There could still be one space on either side of a softbreak.

	  var _replaceTextWithMeta = (0, _replaceTextWithMeta4.default)({ text: text, characterMeta: characterMeta }, SOFT_BREAK_PLACEHOLDER + ' ', SOFT_BREAK_PLACEHOLDER);

	  text = _replaceTextWithMeta.text;
	  characterMeta = _replaceTextWithMeta.characterMeta;

	  var _replaceTextWithMeta2 = (0, _replaceTextWithMeta4.default)({ text: text, characterMeta: characterMeta }, ' ' + SOFT_BREAK_PLACEHOLDER, SOFT_BREAK_PLACEHOLDER);

	  text = _replaceTextWithMeta2.text;
	  characterMeta = _replaceTextWithMeta2.characterMeta;

	  return { text: text, characterMeta: characterMeta };
	}

	function canHaveDepth(blockType) {
	  switch (blockType) {
	    case _draftJsUtils.BLOCK_TYPE.UNORDERED_LIST_ITEM:
	    case _draftJsUtils.BLOCK_TYPE.ORDERED_LIST_ITEM:
	      {
	        return true;
	      }
	    default:
	      {
	        return false;
	      }
	  }
	}

	function concatFragments(fragments) {
	  var text = '';
	  var characterMeta = (0, _immutable.Seq)();
	  fragments.forEach(function (textFragment) {
	    text = text + textFragment.text;
	    characterMeta = characterMeta.concat(textFragment.characterMeta);
	  });
	  return { text: text, characterMeta: characterMeta };
	}

	function addStyleFromTagName(styleSet, tagName, elementStyles) {
	  switch (tagName) {
	    case 'b':
	    case 'strong':
	      {
	        return styleSet.add(_draftJsUtils.INLINE_STYLE.BOLD);
	      }
	    case 'i':
	    case 'em':
	      {
	        return styleSet.add(_draftJsUtils.INLINE_STYLE.ITALIC);
	      }
	    case 'ins':
	      {
	        return styleSet.add(_draftJsUtils.INLINE_STYLE.UNDERLINE);
	      }
	    case 'code':
	      {
	        return styleSet.add(_draftJsUtils.INLINE_STYLE.CODE);
	      }
	    case 'del':
	      {
	        return styleSet.add(_draftJsUtils.INLINE_STYLE.STRIKETHROUGH);
	      }
	    default:
	      {
	        // Allow custom styles to be provided.
	        if (elementStyles && elementStyles[tagName]) {
	          return styleSet.add(elementStyles[tagName]);
	        }

	        return styleSet;
	      }
	  }
	}

	function stateFromElement(element, options) {
	  var blocks = new BlockGenerator(options).process(element);
	  return _draftJs.ContentState.createFromBlockArray(blocks);
	}

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = replaceTextWithMeta;
	function replaceTextWithMeta(subject, searchText, replaceText) {
	  var text = subject.text;
	  var characterMeta = subject.characterMeta;

	  var searchTextLength = searchText.length;
	  var replaceTextLength = replaceText.length;
	  var resultTextParts = [];
	  // Get empty set of same kind as characterMeta.
	  var resultCharMeta = characterMeta.slice(0, 0);
	  var lastEndIndex = 0;
	  var index = text.indexOf(searchText);
	  while (index !== -1) {
	    resultTextParts.push(text.slice(lastEndIndex, index) + replaceText);
	    resultCharMeta = resultCharMeta.concat(characterMeta.slice(lastEndIndex, index),
	    // Use the metadata of the first char we are replacing.
	    repeatSeq(characterMeta.slice(index, index + 1), replaceTextLength));
	    lastEndIndex = index + searchTextLength;
	    index = text.indexOf(searchText, lastEndIndex);
	  }
	  resultTextParts.push(text.slice(lastEndIndex));
	  resultCharMeta = resultCharMeta.concat(characterMeta.slice(lastEndIndex));
	  return { text: resultTextParts.join(''), characterMeta: resultCharMeta };
	}

	function repeatSeq(seq, count) {
	  var result = seq.slice(0, 0);
	  while (count-- > 0) {
	    result = result.concat(seq);
	  }
	  return result;
	}

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EMPTY_ATTR_LIST = [];

	var NODE_TYPE_ELEMENT = exports.NODE_TYPE_ELEMENT = 1;
	var NODE_TYPE_TEXT = exports.NODE_TYPE_TEXT = 3;
	var NODE_TYPE_FRAGMENT = exports.NODE_TYPE_FRAGMENT = 11;
	var SELF_CLOSING = exports.SELF_CLOSING = {
	  area: true, base: true, br: true, col: true, embed: true, hr: true, img: true,
	  input: true, keygen: true, link: true, meta: true, param: true, source: true,
	  track: true, wbr: true
	};

	var Node = exports.Node = function Node() {
	  _classCallCheck(this, Node);
	};

	var TextNode = exports.TextNode = function (_Node) {
	  _inherits(TextNode, _Node);

	  function TextNode(value) {
	    _classCallCheck(this, TextNode);

	    var _this = _possibleConstructorReturn(this, (TextNode.__proto__ || Object.getPrototypeOf(TextNode)).apply(this, arguments));

	    _this.nodeType = NODE_TYPE_TEXT;
	    _this.nodeName = '#text';
	    _this.nodeValue = value;
	    return _this;
	  }

	  _createClass(TextNode, [{
	    key: 'toString',
	    value: function toString() {
	      return escape(this.nodeValue);
	    }
	  }]);

	  return TextNode;
	}(Node);

	var ElementNode = exports.ElementNode = function (_Node2) {
	  _inherits(ElementNode, _Node2);

	  function ElementNode(name, attributes, childNodes) {
	    _classCallCheck(this, ElementNode);

	    var _this2 = _possibleConstructorReturn(this, (ElementNode.__proto__ || Object.getPrototypeOf(ElementNode)).apply(this, arguments));

	    if (attributes == null) {
	      attributes = EMPTY_ATTR_LIST;
	    }
	    var isSelfClosing = SELF_CLOSING[name] === true;
	    _this2.nodeType = NODE_TYPE_ELEMENT;
	    _this2.nodeName = name;
	    _this2.attributes = attributes;
	    _this2.attrMap = new Map(attributes.map(function (attr) {
	      return [attr.name, attr];
	    }));
	    _this2.childNodes = [];
	    _this2.isSelfClosing = isSelfClosing;
	    if (!isSelfClosing && childNodes) {
	      childNodes.forEach(_this2.appendChild, _this2);
	    }
	    return _this2;
	  }

	  _createClass(ElementNode, [{
	    key: 'appendChild',
	    value: function appendChild(node) {
	      if (node.nodeType === NODE_TYPE_FRAGMENT) {
	        if (node.childNodes != null) {
	          var _childNodes;

	          // $FlowIssue - Flow doesn't realize that node is a FragmentNode.
	          var childNodes = node.childNodes;
	          (_childNodes = this.childNodes).push.apply(_childNodes, _toConsumableArray(childNodes));
	        }
	      } else {
	        this.childNodes.push(node);
	      }
	    }
	  }, {
	    key: 'getAttribute',
	    value: function getAttribute(name) {
	      var attr = this.attrMap.get(name);
	      if (attr) {
	        return attr.value;
	      }
	    }
	  }, {
	    key: 'toString',
	    value: function toString(isXHTML) {
	      var attributes = [];
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var _step$value = _step.value;
	          var _name = _step$value.name;
	          var _value = _step$value.value;

	          attributes.push(_name + (_value ? '="' + escapeAttr(_value) + '"' : ''));
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

	      var attrString = attributes.length ? ' ' + attributes.join(' ') : '';
	      if (this.isSelfClosing) {
	        return '<' + this.nodeName + attrString + (isXHTML ? '/>' : '>');
	      }
	      var childNodes = this.childNodes.map(function (node) {
	        return node.toString(isXHTML);
	      }).join('');
	      return '<' + this.nodeName + attrString + '>' + childNodes + '</' + this.nodeName + '>';
	    }
	  }]);

	  return ElementNode;
	}(Node);

	var FragmentNode = exports.FragmentNode = function (_Node3) {
	  _inherits(FragmentNode, _Node3);

	  function FragmentNode(childNodes) {
	    _classCallCheck(this, FragmentNode);

	    var _this3 = _possibleConstructorReturn(this, (FragmentNode.__proto__ || Object.getPrototypeOf(FragmentNode)).apply(this, arguments));

	    _this3.nodeType = NODE_TYPE_FRAGMENT;
	    _this3.childNodes = [];
	    if (childNodes) {
	      childNodes.forEach(_this3.appendChild, _this3);
	    }
	    return _this3;
	  }

	  _createClass(FragmentNode, [{
	    key: 'appendChild',
	    value: function appendChild(node) {
	      if (node.nodeType === NODE_TYPE_FRAGMENT) {
	        if (node.childNodes != null) {
	          var _childNodes2;

	          // $FlowIssue - Flow doesn't realize that node is a FragmentNode.
	          var childNodes = node.childNodes;
	          (_childNodes2 = this.childNodes).push.apply(_childNodes2, _toConsumableArray(childNodes));
	        }
	      } else {
	        this.childNodes.push(node);
	      }
	    }
	  }, {
	    key: 'toString',
	    value: function toString(isXHTML) {
	      return this.childNodes.map(function (node) {
	        return node.toString(isXHTML);
	      }).join('');
	    }
	  }]);

	  return FragmentNode;
	}(Node);

	function escape(html) {
	  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function escapeAttr(html) {
	  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = parseHTML;
	function parseHTML(html) {
	  var doc = void 0;
	  if (typeof DOMParser !== 'undefined') {
	    var parser = new DOMParser();
	    doc = parser.parseFromString(html, 'text/html');
	  } else {
	    doc = document.implementation.createHTMLDocument('');
	    doc.documentElement.innerHTML = html;
	  }
	  return doc.body;
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stateFromMarkdown = __webpack_require__(25);

	Object.defineProperty(exports, 'stateFromMarkdown', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_stateFromMarkdown).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = stateFromMarkdown;

	var _MarkdownParser = __webpack_require__(26);

	var _MarkdownParser2 = _interopRequireDefault(_MarkdownParser);

	var _draftJsImportElement = __webpack_require__(19);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function stateFromMarkdown(markdown) {
	  var element = _MarkdownParser2.default.parse(markdown, { getAST: true });
	  return (0, _draftJsImportElement.stateFromElement)(element);
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _syntheticDom = __webpack_require__(22);

	var hasOwnProperty = Object.prototype.hasOwnProperty; /**
	                                                       * Ported from:
	                                                       *   https://github.com/chjj/marked/blob/49b7eaca/lib/marked.js
	                                                       * TODO:
	                                                       *   Use ES6 classes
	                                                       *   Add flow annotations
	                                                       */
	/* eslint-disable no-spaced-func */

	var assign = Object.assign || function (obj) {
	  var i = 1;
	  for (; i < arguments.length; i++) {
	    var target = arguments[i];
	    for (var key in target) {
	      if (hasOwnProperty.call(target, key)) {
	        obj[key] = target[key];
	      }
	    }
	  }
	  return obj;
	};

	var noop = function noop() {};
	noop.exec = noop;

	var defaults = {
	  gfm: true,
	  breaks: false,
	  pedantic: false,
	  smartLists: false,
	  silent: false,
	  langPrefix: 'lang-',
	  renderer: new Renderer(),
	  xhtml: false
	};

	/**
	 * Block-Level Grammar
	 */

	var block = {
	  newline: /^\n+/,
	  code: /^( {4}[^\n]+\n*)+/,
	  fences: noop,
	  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
	  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
	  nptable: noop,
	  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
	  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
	  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
	  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
	  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|def))+)\n*/,
	  text: /^[^\n]+/
	};

	block.bullet = /(?:[*+-]|\d+\.)/;
	block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
	block.item = replace(block.item, 'gm')(/bull/g, block.bullet)();

	block.list = replace(block.list)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')();

	block.blockquote = replace(block.blockquote)('def', block.def)();

	block.paragraph = replace(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('blockquote', block.blockquote)('def', block.def)();

	/**
	 * Normal Block Grammar
	 */

	block.normal = assign({}, block);

	/**
	 * GFM Block Grammar
	 */

	block.gfm = assign({}, block.normal, {
	  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
	  paragraph: /^/,
	  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
	});

	block.gfm.paragraph = replace(block.paragraph)('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|')();

	/**
	 * Block Lexer
	 */

	function Lexer(options) {
	  this.tokens = [];
	  this.tokens.links = {};
	  this.options = assign({}, options || defaults);
	  this.rules = block.normal;

	  if (this.options.gfm) {
	    this.rules = block.gfm;
	  }
	}

	/**
	 * Expose Block Rules
	 */

	Lexer.rules = block;

	/**
	 * Static Lex Method
	 */

	Lexer.parse = function (src, options) {
	  var lexer = new Lexer(options);
	  return lexer.parse(src);
	};

	/**
	 * Preprocessing
	 */

	Lexer.prototype.parse = function (src) {
	  src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');

	  return this.token(src, true);
	};

	/**
	 * Lexing
	 */

	Lexer.prototype.token = function (src, top, bq) {
	  var next;
	  var loose;
	  var cap;
	  var bull;
	  var b;
	  var item;
	  var space;
	  var i;
	  var l;

	  src = src.replace(/^ +$/gm, '');

	  while (src) {
	    // newline
	    if (cap = this.rules.newline.exec(src)) {
	      src = src.substring(cap[0].length);
	      if (cap[0].length > 1) {
	        this.tokens.push({
	          type: 'space'
	        });
	      }
	    }

	    // code
	    if (cap = this.rules.code.exec(src)) {
	      src = src.substring(cap[0].length);
	      cap = cap[0].replace(/^ {4}/gm, '');
	      this.tokens.push({
	        type: 'code',
	        text: !this.options.pedantic ? cap.replace(/\n+$/, '') : cap
	      });
	      continue;
	    }

	    // fences (gfm)
	    if (cap = this.rules.fences.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'code',
	        lang: cap[2],
	        text: cap[3]
	      });
	      continue;
	    }

	    // heading
	    if (cap = this.rules.heading.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'heading',
	        depth: cap[1].length,
	        text: cap[2]
	      });
	      continue;
	    }

	    // lheading
	    if (cap = this.rules.lheading.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'heading',
	        depth: cap[2] === '=' ? 1 : 2,
	        text: cap[1]
	      });
	      continue;
	    }

	    // hr
	    if (cap = this.rules.hr.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'hr'
	      });
	      continue;
	    }

	    // blockquote
	    if (cap = this.rules.blockquote.exec(src)) {
	      src = src.substring(cap[0].length);

	      this.tokens.push({
	        type: 'blockquote_start'
	      });

	      cap = cap[0].replace(/^ *> ?/gm, '');

	      // Pass `top` to keep the current
	      // "toplevel" state. This is exactly
	      // how markdown.pl works.
	      this.token(cap, top, true);

	      this.tokens.push({
	        type: 'blockquote_end'
	      });

	      continue;
	    }

	    // list
	    if (cap = this.rules.list.exec(src)) {
	      src = src.substring(cap[0].length);
	      bull = cap[2];

	      this.tokens.push({
	        type: 'list_start',
	        ordered: bull.length > 1
	      });

	      // Get each top-level item.
	      cap = cap[0].match(this.rules.item);

	      next = false;
	      l = cap.length;
	      i = 0;

	      for (; i < l; i++) {
	        item = cap[i];

	        // Remove the list item's bullet
	        // so it is seen as the next token.
	        space = item.length;
	        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

	        // Outdent whatever the
	        // list item contains. Hacky.
	        if (~item.indexOf('\n ')) {
	          space -= item.length;
	          item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
	        }

	        // Determine whether the next list item belongs here.
	        // Backpedal if it does not belong in this list.
	        if (this.options.smartLists && i !== l - 1) {
	          b = block.bullet.exec(cap[i + 1])[0];
	          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
	            src = cap.slice(i + 1).join('\n') + src;
	            i = l - 1;
	          }
	        }

	        // Determine whether item is loose or not.
	        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
	        // for discount behavior.
	        loose = next || /\n\n(?!\s*$)/.test(item);
	        if (i !== l - 1) {
	          next = item.charAt(item.length - 1) === '\n';
	          if (!loose) {
	            loose = next;
	          }
	        }

	        this.tokens.push({
	          type: loose ? 'loose_item_start' : 'list_item_start'
	        });

	        // Recurse.
	        this.token(item, false, bq);

	        this.tokens.push({
	          type: 'list_item_end'
	        });
	      }

	      this.tokens.push({
	        type: 'list_end'
	      });

	      continue;
	    }

	    // def
	    if (!bq && top && (cap = this.rules.def.exec(src))) {
	      src = src.substring(cap[0].length);
	      this.tokens.links[cap[1].toLowerCase()] = {
	        href: cap[2],
	        title: cap[3]
	      };
	      continue;
	    }

	    // top-level paragraph
	    if (top && (cap = this.rules.paragraph.exec(src))) {
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'paragraph',
	        text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
	      });
	      continue;
	    }

	    // text
	    if (cap = this.rules.text.exec(src)) {
	      // Top-level should never reach here.
	      src = src.substring(cap[0].length);
	      this.tokens.push({
	        type: 'text',
	        text: cap[0]
	      });
	      continue;
	    }

	    if (src) {
	      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
	    }
	  }

	  return this.tokens;
	};

	/**
	 * Inline-Level Grammar
	 */

	var inline = {
	  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
	  link: /^!?\[(inside)\]\(href\)/,
	  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
	  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
	  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
	  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
	  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
	  br: /^ {2,}\n(?!\s*$)/,
	  del: noop,
	  ins: noop,
	  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
	};

	inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
	inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

	inline.link = replace(inline.link)('inside', inline._inside)('href', inline._href)();

	inline.reflink = replace(inline.reflink)('inside', inline._inside)();

	/**
	 * Normal Inline Grammar
	 */

	inline.normal = assign({}, inline);

	/**
	 * Pedantic Inline Grammar
	 */

	inline.pedantic = assign({}, inline.normal, {
	  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
	  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
	});

	/**
	 * GFM Inline Grammar
	 */

	inline.gfm = assign({}, inline.normal, {
	  escape: replace(inline.escape)('])', '~|])')(),
	  del: /^~~(?=\S)([\s\S]*?\S)~~/,
	  ins: /^\+\+(?=\S)([\s\S]*?\S)\+\+/,
	  text: replace(inline.text)(']|', '~+]|')()
	});

	/**
	 * GFM + Line Breaks Inline Grammar
	 */

	inline.breaks = assign({}, inline.gfm, {
	  br: replace(inline.br)('{2,}', '*')(),
	  text: replace(inline.gfm.text)('{2,}', '*')()
	});

	/**
	 * Inline Lexer & Compiler
	 */

	function InlineLexer(links, options) {
	  this.options = assign({}, options || defaults);
	  this.links = links;
	  this.rules = inline.normal;
	  this.renderer = this.options.renderer || new Renderer();
	  this.renderer.options = this.options;

	  if (!this.links) {
	    throw new Error('Tokens array requires a `links` property.');
	  }

	  if (this.options.gfm) {
	    if (this.options.breaks) {
	      this.rules = inline.breaks;
	    } else {
	      this.rules = inline.gfm;
	    }
	  } else if (this.options.pedantic) {
	    this.rules = inline.pedantic;
	  }
	}

	/**
	 * Expose Inline Rules
	 */

	InlineLexer.rules = inline;

	/**
	 * Static Lexing/Compiling Method
	 */

	InlineLexer.parse = function (src, links, options) {
	  var inline = new InlineLexer(links, options);
	  return inline.parse(src);
	};

	/**
	 * Lexing/Compiling
	 */

	InlineLexer.prototype.parse = function (src) {
	  var out = new _syntheticDom.FragmentNode();
	  var link;
	  var cap;

	  while (src) {
	    // escape
	    if (cap = this.rules.escape.exec(src)) {
	      src = src.substring(cap[0].length);
	      out.appendChild(new _syntheticDom.TextNode(cap[1]));
	      continue;
	    }

	    // link
	    if (cap = this.rules.link.exec(src)) {
	      src = src.substring(cap[0].length);
	      this.inLink = true;
	      out.appendChild(this.outputLink(cap, { href: cap[2], title: cap[3] }));
	      this.inLink = false;
	      continue;
	    }

	    // reflink, nolink
	    if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
	      src = src.substring(cap[0].length);
	      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
	      link = this.links[link.toLowerCase()];
	      if (!link || !link.href) {
	        out.appendChild(new _syntheticDom.TextNode(cap[0].charAt(0)));
	        src = cap[0].substring(1) + src;
	        continue;
	      }
	      this.inLink = true;
	      out.appendChild(this.outputLink(cap, link));
	      this.inLink = false;
	      continue;
	    }

	    // strong
	    if (cap = this.rules.strong.exec(src)) {
	      src = src.substring(cap[0].length);
	      out.appendChild(this.renderer.strong(this.parse(cap[2] || cap[1])));
	      continue;
	    }

	    // em
	    if (cap = this.rules.em.exec(src)) {
	      src = src.substring(cap[0].length);
	      out.appendChild(this.renderer.em(this.parse(cap[2] || cap[1])));
	      continue;
	    }

	    // code
	    if (cap = this.rules.code.exec(src)) {
	      src = src.substring(cap[0].length);
	      out.appendChild(this.renderer.codespan(cap[2]));
	      continue;
	    }

	    // br
	    if (cap = this.rules.br.exec(src)) {
	      src = src.substring(cap[0].length);
	      out.appendChild(this.renderer.br());
	      continue;
	    }

	    // del (gfm)
	    if (cap = this.rules.del.exec(src)) {
	      src = src.substring(cap[0].length);
	      out.appendChild(this.renderer.del(this.parse(cap[1])));
	      continue;
	    }

	    // ins (gfm extended)
	    if (cap = this.rules.ins.exec(src)) {
	      src = src.substring(cap[0].length);
	      out.appendChild(this.renderer.ins(this.parse(cap[1])));
	      continue;
	    }

	    // text
	    if (cap = this.rules.text.exec(src)) {
	      src = src.substring(cap[0].length);
	      out.appendChild(this.renderer.text(new _syntheticDom.TextNode(cap[0])));
	      continue;
	    }

	    if (src) {
	      throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
	    }
	  }

	  return out;
	};

	/**
	 * Compile Link
	 */

	InlineLexer.prototype.outputLink = function (cap, link) {
	  var href = link.href;
	  var title = link.title;

	  return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.parse(cap[1])) : this.renderer.image(href, title, cap[1]);
	};

	/**
	 * Renderer
	 */

	function Renderer(options) {
	  this.options = options || {};
	}

	Renderer.prototype.code = function (childNode, lang) {
	  var attributes = [];
	  if (lang) {
	    attributes.push(['class', this.options.langPrefix + lang]);
	  }
	  var codeNode = new _syntheticDom.ElementNode('code', attributes, [childNode]);
	  return new _syntheticDom.ElementNode('pre', [], [codeNode]);
	};

	Renderer.prototype.blockquote = function (childNode) {
	  return new _syntheticDom.ElementNode('blockquote', [], [childNode]);
	};

	Renderer.prototype.heading = function (childNode, level) {
	  return new _syntheticDom.ElementNode('h' + level, [], [childNode]);
	};

	Renderer.prototype.hr = function () {
	  return new _syntheticDom.ElementNode('hr', [], _syntheticDom.SELF_CLOSING);
	};

	Renderer.prototype.list = function (childNode, isOrdered) {
	  return new _syntheticDom.ElementNode(isOrdered ? 'ol' : 'ul', [], [childNode]);
	};

	Renderer.prototype.listitem = function (childNode) {
	  return new _syntheticDom.ElementNode('li', [], [childNode]);
	};

	Renderer.prototype.paragraph = function (childNode) {
	  return new _syntheticDom.ElementNode('p', [], [childNode]);
	};

	// span level renderer
	Renderer.prototype.strong = function (childNode) {
	  return new _syntheticDom.ElementNode('strong', [], [childNode]);
	};

	Renderer.prototype.em = function (childNode) {
	  return new _syntheticDom.ElementNode('em', [], [childNode]);
	};

	Renderer.prototype.codespan = function (text) {
	  return new _syntheticDom.ElementNode('code', [], [new _syntheticDom.TextNode(text)]);
	};

	Renderer.prototype.br = function () {
	  return new _syntheticDom.ElementNode('br', [], _syntheticDom.SELF_CLOSING);
	};

	Renderer.prototype.del = function (childNode) {
	  return new _syntheticDom.ElementNode('del', [], [childNode]);
	};

	Renderer.prototype.ins = function (childNode) {
	  return new _syntheticDom.ElementNode('ins', [], [childNode]);
	};

	Renderer.prototype.link = function (href, title, childNode) {
	  var attributes = [['href', href]];
	  if (title) {
	    attributes.push(['title', title]);
	  }
	  return new _syntheticDom.ElementNode('a', attributes, [childNode]);
	};

	Renderer.prototype.image = function (href, title, alt) {
	  var attributes = [['src', href]];
	  if (title) {
	    attributes.push(['title', title]);
	  }
	  if (alt) {
	    attributes.push(['alt', alt]);
	  }
	  return new _syntheticDom.ElementNode('img', attributes, _syntheticDom.SELF_CLOSING);
	};

	Renderer.prototype.text = function (childNode) {
	  return childNode;
	};

	/**
	 * Parsing & Compiling
	 */

	function Parser(options) {
	  this.tokens = [];
	  this.token = null;
	  this.options = assign({}, options || defaults);
	  this.options.renderer = this.options.renderer || new Renderer();
	  this.renderer = this.options.renderer;
	  this.renderer.options = this.options;
	}

	/**
	 * Static Parse Method
	 */

	Parser.parse = function (src, options, renderer) {
	  var parser = new Parser(options, renderer);
	  return parser.parse(src);
	};

	/**
	 * Parse Loop
	 */

	Parser.prototype.parse = function (src) {
	  this.inline = new InlineLexer(src.links, this.options, this.renderer);
	  this.tokens = src.slice().reverse();

	  var out = new _syntheticDom.FragmentNode();
	  while (this.next()) {
	    out.appendChild(this.tok());
	  }

	  return out;
	};

	/**
	 * Next Token
	 */

	Parser.prototype.next = function () {
	  return this.token = this.tokens.pop();
	};

	/**
	 * Preview Next Token
	 */

	Parser.prototype.peek = function () {
	  return this.tokens[this.tokens.length - 1] || 0;
	};

	/**
	 * Parse Text Tokens
	 */

	Parser.prototype.parseText = function () {
	  var body = this.token.text;

	  while (this.peek().type === 'text') {
	    body += '\n' + this.next().text;
	  }

	  return this.inline.parse(body);
	};

	/**
	 * Parse Current Token
	 */

	Parser.prototype.tok = function () {
	  switch (this.token.type) {
	    case 'space':
	      {
	        return new _syntheticDom.TextNode('');
	      }
	    case 'hr':
	      {
	        return this.renderer.hr();
	      }
	    case 'heading':
	      {
	        return this.renderer.heading(this.inline.parse(this.token.text), this.token.depth);
	      }
	    case 'code':
	      {
	        return this.renderer.code(this.token.text, this.token.lang);
	      }
	    case 'blockquote_start':
	      {
	        var body = new _syntheticDom.FragmentNode();

	        while (this.next().type !== 'blockquote_end') {
	          body.appendChild(this.tok());
	        }

	        return this.renderer.blockquote(body);
	      }
	    case 'list_start':
	      {
	        var _body = new _syntheticDom.FragmentNode();
	        var ordered = this.token.ordered;

	        while (this.next().type !== 'list_end') {
	          _body.appendChild(this.tok());
	        }

	        return this.renderer.list(_body, ordered);
	      }
	    case 'list_item_start':
	      {
	        var _body2 = new _syntheticDom.FragmentNode();

	        while (this.next().type !== 'list_item_end') {
	          _body2.appendChild(this.token.type === 'text' ? this.parseText() : this.tok());
	        }

	        return this.renderer.listitem(_body2);
	      }
	    case 'loose_item_start':
	      {
	        var _body3 = new _syntheticDom.FragmentNode();

	        while (this.next().type !== 'list_item_end') {
	          _body3.appendChild(this.tok());
	        }

	        return this.renderer.listitem(_body3);
	      }
	    case 'paragraph':
	      {
	        return this.renderer.paragraph(this.inline.parse(this.token.text));
	      }
	    case 'text':
	      {
	        return this.renderer.paragraph(this.parseText());
	      }
	  }
	};

	/**
	 * Helpers
	 */

	function replace(regex, options) {
	  regex = regex.source;
	  options = options || '';
	  return function self(name, val) {
	    if (!name) {
	      return new RegExp(regex, options);
	    }
	    val = val.source || val;
	    val = val.replace(/(^|[^\[])\^/g, '$1');
	    regex = regex.replace(name, val);
	    return self;
	  };
	}

	var MarkdownParser = {
	  parse: function parse(src, options) {
	    options = assign({}, defaults, options);
	    try {
	      var fragment = Parser.parse(Lexer.parse(src, options), options);
	    } catch (e) {
	      if (options.silent) {
	        fragment = new _syntheticDom.FragmentNode([new _syntheticDom.ElementNode('p', [], [new _syntheticDom.TextNode('An error occured:')]), new _syntheticDom.ElementNode('pre', [], [new _syntheticDom.TextNode(e.message)])]);
	      } else {
	        throw e;
	      }
	    }
	    if (options.getAST) {
	      return new _syntheticDom.ElementNode('body', [], [fragment]);
	    } else {
	      return fragment.toString(this.options.xhtml);
	    }
	  }
	};

	exports.default = MarkdownParser;

/***/ }
/******/ ]);