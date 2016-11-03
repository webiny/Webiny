var DraftCodeBlock =
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

	
	module.exports = {
	    getKeyBinding:       __webpack_require__(1),
	    hasSelectionInBlock: __webpack_require__(2),
	    handleKeyCommand:    __webpack_require__(3),
	    handleReturn:        __webpack_require__(17),
	    handleTab:           __webpack_require__(20),
	    insertNewLine:       __webpack_require__(18)
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	
	/**
	 * Return command for a keyboard event
	 *
	 * @param {SyntheticKeyboardEvent} event
	 * @return {String}
	 */
	function getKeyBinding(e) {

	}

	module.exports = getKeyBinding;


/***/ },
/* 2 */
/***/ function(module, exports) {

	
	/**
	 * Return true if selection is inside a code block
	 *
	 * @param {Draft.EditorState} editorState
	 * @return {Boolean}
	 */
	function hasSelectionInBlock(editorState) {
	    var selection    = editorState.getSelection();
	    var contentState = editorState.getCurrentContent();
	    var startKey     = selection.getStartKey();
	    var currentBlock = contentState.getBlockForKey(startKey);

	    return (currentBlock.getType() === 'code-block');
	}

	module.exports = hasSelectionInBlock;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var removeIndent = __webpack_require__(4);

	/**
	 * Handle key command for code blocks
	 *
	 * @param {Draft.EditorState} editorState
	 * @param {String} command
	 * @return {Boolean}
	 */
	function handleKeyCommand(editorState, command) {
	    if (command === 'backspace') {
	        return removeIndent(editorState);
	    }
	}

	module.exports = handleKeyCommand;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Draft = __webpack_require__(5);
	var endsWith = __webpack_require__(6);

	var getNewLine = __webpack_require__(7);
	var getIndentation = __webpack_require__(9);
	var getLines = __webpack_require__(14);
	var getLineAnchorForOffset = __webpack_require__(16);

	/**
	 * Remove last indentation before cursor, return undefined if no modification is done
	 *
	 * @param {Draft.EditorState} editorState
	 * @return {Draft.EditorState|undefined}
	 */
	function removeIndent(editorState) {
	    var contentState = editorState.getCurrentContent();
	    var selection    = editorState.getSelection();

	    if (!selection.isCollapsed()) {
	        return;
	    }

	    var startKey     = selection.getStartKey();
	    var startOffset  = selection.getStartOffset();
	    var currentBlock = contentState.getBlockForKey(startKey);
	    var blockText    = currentBlock.getText();

	    // Detect newline separator and indentation
	    var newLine = getNewLine(blockText);
	    var indent  = getIndentation(blockText);

	    // Get current line
	    var lines      = getLines(blockText, newLine);
	    var lineAnchor = getLineAnchorForOffset(blockText, startOffset, newLine);

	    var currentLine = lines.get(lineAnchor.getLine());
	    var beforeSelection = currentLine.slice(0, lineAnchor.getOffset());

	    // If the line before selection ending with the indentation?
	    if (!endsWith(beforeSelection, indent)) {
	        return;
	    }

	    // Remove indent
	    var beforeIndentOffset = startOffset - indent.length;
	    var rangeToRemove      = selection.merge({
	        focusKey:     startKey,
	        focusOffset:  beforeIndentOffset,
	        anchorKey:    startKey,
	        anchorOffset: startOffset,
	        isBackward:   true
	    });

	    var newContentState = Draft.Modifier.removeRange(contentState, rangeToRemove, 'backward');
	    var newEditorState = Draft.EditorState.push(editorState, newContentState, 'remove-range');

	    return Draft.EditorState.forceSelection(
	      newEditorState,
	      newContentState.getSelectionAfter()
	    );
	}

	module.exports = removeIndent;


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = Draft;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/*!
	 * ends-with <https://github.com/jonschlinkert/ends-with>
	 *
	 * Copyright (c) 2014 Jon Schlinkert, contributors.
	 * Licensed under the MIT license.
	 */

	'use strict';

	module.exports = function (a, b) {
	  if (Array.isArray(a)) {
	    return a[a.length - 1] === b;
	  }

	  a = String(a);
	  b = String(b);

	  var i = b.length;
	  var len = a.length - i;

	  while (i--) {
	    if (b.charAt(i) !== a.charAt(len + i)) {
	      return false;
	    }
	  }
	  return true;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var detectNewline = __webpack_require__(8);

	var DEFAULT = '\n';

	/**
	 * Detect the dominant newline character of a string
	 * @param {String} text
	 * @return {String}
	 */
	function getNewLine(text) {
	    return detectNewline(text) || DEFAULT;
	}

	module.exports = getNewLine;


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}

		var newlines = (str.match(/(?:\r?\n)/g) || []);

		if (newlines.length === 0) {
			return null;
		}

		var crlf = newlines.filter(function (el) {
			return el === '\r\n';
		}).length;

		var lf = newlines.length - crlf;

		return crlf > lf ? '\r\n' : '\n';
	};

	module.exports.graceful = function (str) {
		return module.exports(str) || '\n';
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var detectIndent = __webpack_require__(10);

	var DEFAULT_INDENTATION = '    ';

	/**
	 * Detect indentation in a text
	 * @param {String} text
	 * @return {String}
	 */
	function getIndentation(text) {
	    var result = detectIndent(text);
	    return result.indent || DEFAULT_INDENTATION;
	}

	module.exports = getIndentation;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable guard-for-in */
	'use strict';
	var repeating = __webpack_require__(11);

	// detect either spaces or tabs but not both to properly handle tabs
	// for indentation and spaces for alignment
	var INDENT_RE = /^(?:( )+|\t+)/;

	function getMostUsed(indents) {
		var result = 0;
		var maxUsed = 0;
		var maxWeight = 0;

		for (var n in indents) {
			var indent = indents[n];
			var u = indent[0];
			var w = indent[1];

			if (u > maxUsed || u === maxUsed && w > maxWeight) {
				maxUsed = u;
				maxWeight = w;
				result = Number(n);
			}
		}

		return result;
	}

	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}

		// used to see if tabs or spaces are the most used
		var tabs = 0;
		var spaces = 0;

		// remember the size of previous line's indentation
		var prev = 0;

		// remember how many indents/unindents as occurred for a given size
		// and how much lines follow a given indentation
		//
		// indents = {
		//    3: [1, 0],
		//    4: [1, 5],
		//    5: [1, 0],
		//   12: [1, 0],
		// }
		var indents = {};

		// pointer to the array of last used indent
		var current;

		// whether the last action was an indent (opposed to an unindent)
		var isIndent;

		str.split(/\n/g).forEach(function (line) {
			if (!line) {
				// ignore empty lines
				return;
			}

			var indent;
			var matches = line.match(INDENT_RE);

			if (!matches) {
				indent = 0;
			} else {
				indent = matches[0].length;

				if (matches[1]) {
					spaces++;
				} else {
					tabs++;
				}
			}

			var diff = indent - prev;
			prev = indent;

			if (diff) {
				// an indent or unindent has been detected

				isIndent = diff > 0;

				current = indents[isIndent ? diff : -diff];

				if (current) {
					current[0]++;
				} else {
					current = indents[diff] = [1, 0];
				}
			} else if (current) {
				// if the last action was an indent, increment the weight
				current[1] += Number(isIndent);
			}
		});

		var amount = getMostUsed(indents);

		var type;
		var actual;
		if (!amount) {
			type = null;
			actual = '';
		} else if (spaces >= tabs) {
			type = 'space';
			actual = repeating(' ', amount);
		} else {
			type = 'tab';
			actual = repeating('\t', amount);
		}

		return {
			amount: amount,
			type: type,
			indent: actual
		};
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var isFinite = __webpack_require__(12);

	module.exports = function (str, n) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected `input` to be a string');
		}

		if (n < 0 || !isFinite(n)) {
			throw new TypeError('Expected `count` to be a positive finite number');
		}

		var ret = '';

		do {
			if (n & 1) {
				ret += str;
			}

			str += str;
		} while ((n >>= 1));

		return ret;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var numberIsNan = __webpack_require__(13);

	module.exports = Number.isFinite || function (val) {
		return !(typeof val !== 'number' || numberIsNan(val) || val === Infinity || val === -Infinity);
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	module.exports = Number.isNaN || function (x) {
		return x !== x;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var Immutable = __webpack_require__(15);
	var getNewLine = __webpack_require__(7);

	/**
	 * Return a list of line in this text
	 * @param {String} text
	 * @param {String} sep (optional)
	 * @return {List<String>}
	 */
	function getLines(text, sep) {
	    sep = sep || getNewLine(text);
	    return Immutable.List(text.split(sep));
	}

	module.exports = getLines;


/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = Immutable;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Immutable = __webpack_require__(15);
	var getNewLine = __webpack_require__(7);

	var LineAnchor = Immutable.Record({
	    // Index of the current line
	    line:   Number(0),

	    // Offset in current line
	    offset: Number(0)
	});

	LineAnchor.prototype.getLine = function() {
	    return this.get('line');
	};

	LineAnchor.prototype.getOffset = function() {
	    return this.get('offset');
	};


	/**
	 * Return an anchor of a cursor in a block as a {line,offset} object
	 *
	 * @param {String} text
	 * @param {Number} offset
	 * @param {String} sep (optional)
	 * @return {LineAnchor}
	 */
	function getLineAnchorForOffset(text, offset, sep) {
	    sep = sep || getNewLine(text);

	    var lineIndex = 0;
	    var nextLineIndex = 0;
	    var lastLineIndex = 0;

	    while (nextLineIndex >= 0 && nextLineIndex < offset) {
	        lineIndex++;

	        lastLineIndex = nextLineIndex;
	        nextLineIndex = text.indexOf(sep, nextLineIndex + sep.length);
	    }

	    return new LineAnchor({
	        line:   (lineIndex - 1),
	        offset: (offset - lastLineIndex)
	    });
	}

	module.exports = getLineAnchorForOffset;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Draft = __webpack_require__(5);
	var insertNewLine = __webpack_require__(18);

	/**
	 *  We split code blocks only if user pressed Cmd+Enter
	 *
	 * @param {SyntheticKeyboardEvent} event
	 * @param {Draft.EditorState} editorState
	 * @return {Draft.EditorState}
	 */
	function handleReturn(e, editorState) {
	    var contentState = editorState.getCurrentContent();
	    var selection    = editorState.getSelection();

	    // Command+Return: As usual, split blocks
	    if (selection.isCollapsed() && Draft.KeyBindingUtil.hasCommandModifier(e)) {
	        var newContentState = Draft.Modifier.splitBlock(contentState, selection);
	        return Draft.EditorState.push(editorState, newContentState, 'split-block');
	    }


	    return insertNewLine(editorState);
	}

	module.exports = handleReturn;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var Draft = __webpack_require__(5);
	var getNewLine = __webpack_require__(7);
	var getLines = __webpack_require__(14);
	var getLineAnchorForOffset = __webpack_require__(16);
	var getIndentForLine = __webpack_require__(19);

	/**
	 *  Insert a new line with right inden
	 *
	 * @param {SyntheticKeyboardEvent} event
	 * @param {Draft.EditorState} editorState
	 * @return {Draft.EditorState}
	 */
	function insertNewLine(editorState) {
	    var contentState = editorState.getCurrentContent();
	    var selection    = editorState.getSelection();
	    var startKey     = selection.getStartKey();
	    var startOffset  = selection.getStartOffset();
	    var currentBlock = contentState.getBlockForKey(startKey);
	    var blockText    = currentBlock.getText();

	    var newContentState;

	    // Detect newline separation
	    var newLine = getNewLine(blockText);

	    // Add or replace
	    if (selection.isCollapsed()) {
	        // Create line to insert with right indentation
	        var lines            = getLines(blockText, newLine);
	        var currentLineIndex = getLineAnchorForOffset(blockText, startOffset, newLine).getLine();
	        var currentLine      = lines.get(currentLineIndex);
	        var lineToInsert     = newLine + getIndentForLine(currentLine);

	        newContentState = Draft.Modifier.insertText(
	            contentState,
	            selection,
	            lineToInsert
	        );
	    } else {
	        newContentState = Draft.Modifier.replaceText(
	            contentState,
	            selection,
	            newLine
	        );
	    }

	    var newEditorState = Draft.EditorState.push(editorState, newContentState, 'insert-characters');

	    return Draft.EditorState.forceSelection(
	      newEditorState,
	      newContentState.getSelectionAfter()
	    );
	}

	module.exports = insertNewLine;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var detectIndent = __webpack_require__(10);

	/**
	 * Return indentation of a line
	 * @param {String} line
	 * @return {String}
	 */
	function getIndentForLine(line) {
	    return detectIndent(line).indent || '';
	}

	module.exports = getIndentForLine;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var Draft = __webpack_require__(5);
	var getIndentation = __webpack_require__(9);

	// TODO: tab should complete indentation instead of just inserting one

	/**
	 * Handle pressing tab in the editor
	 *
	 * @param {SyntheticKeyboardEvent} event
	 * @param {Draft.EditorState} editorState
	 * @return {Draft.EditorState}
	 */
	function handleTab(e, editorState) {
	    e.preventDefault();

	    var contentState = editorState.getCurrentContent();
	    var selection    = editorState.getSelection();
	    var startKey     = selection.getStartKey();
	    var currentBlock = contentState.getBlockForKey(startKey);

	    var indentation = getIndentation(currentBlock.getText());
	    var newContentState;

	    if (selection.isCollapsed()) {
	        newContentState = Draft.Modifier.insertText(
	            contentState,
	            selection,
	            indentation
	        );
	    } else {
	        newContentState = Draft.Modifier.replaceText(
	            contentState,
	            selection,
	            indentation
	        );
	    }

	    return Draft.EditorState.push(editorState, newContentState, 'insert-characters');
	}

	module.exports = handleTab;


/***/ }
/******/ ]);