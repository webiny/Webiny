/*
 * Copyright (c) 2016, Globo.com (https://github.com/globocom)
 * Copyright (c) 2016, Andrew Coelho <info@andrewcoelho.com>
 *
 * License: MIT
 */

const {convertToRaw, convertFromRaw, getVisibleSelectionRect, EditorState, SelectionState, Entity} = Draft;

function filterKey(entityKey) {
    if (entityKey) {
        var entity = Entity.get(entityKey);
        return entity.getMutability() === 'MUTABLE' ? entityKey : null;
    }
    return null;
}

export default {
    getRangesForDraftEntity: (block, key) => {
        var ranges = [];
        block.findEntityRanges(function (c) {
            return c.getEntity() === key;
        }, function (start, end) {
            ranges.push({start: start, end: end});
        });

        return ranges;
    },

    getEntityKeyForSelection: (contentState, targetSelection) => {
        var entityKey;

        if (targetSelection.isCollapsed()) {
            var key = targetSelection.getAnchorKey();
            var offset = targetSelection.getAnchorOffset();
            if (offset > 0) {
                entityKey = contentState.getBlockForKey(key).getEntityAt(offset - 1);
                return filterKey(entityKey);
            }
            return null;
        }

        var startKey = targetSelection.getStartKey();
        var startOffset = targetSelection.getStartOffset();
        var startBlock = contentState.getBlockForKey(startKey);

        entityKey = startOffset === startBlock.getLength() ? null : startBlock.getEntityAt(startOffset);

        return filterKey(entityKey);
    },

    getEntitySelectionState: (contentState, selectionState, entityKey) => {
        const selectionKey = selectionState.getAnchorKey();
        const selectionOffset = selectionState.getAnchorOffset();
        const block = contentState.getBlockForKey(selectionKey);
        const blockKey = block.getKey();

        let entitySelection;
        getRangesForDraftEntity(block, entityKey).forEach((range) => {
            if (range.start <= selectionOffset && selectionOffset <= range.end) {
                entitySelection = new SelectionState({
                    anchorOffset: range.start,
                    anchorKey: blockKey,
                    focusOffset: range.end,
                    focusKey: blockKey,
                    isBackward: false,
                    hasFocus: selectionState.getHasFocus()
                });
            }
        });
        return entitySelection;
    },

    editorStateToJSON: (editorState) => {
        if (editorState) {
            const content = editorState.getCurrentContent();
            return JSON.stringify(convertToRaw(content), null, 2);
        }
    },
    editorStateFromRaw: (rawContent) => {
        // TODO: add decorators from plugins here
        if (rawContent) {
            const content = convertFromRaw(rawContent);
            return EditorState.createWithContent(content, decorator);
        } else {
            return EditorState.createEmpty(decorator);
        }
    },

    getSelectionCoords: (editor, toolbar) => {
        const editorBounds = editor.getBoundingClientRect();
        const rangeBounds = getVisibleSelectionRect(window);

        if (!rangeBounds) {
            return null;
        }

        const rangeWidth = rangeBounds.right - rangeBounds.left;
        const toolbarHeight = toolbar.offsetHeight;
        // const rangeHeight = rangeBounds.bottom - rangeBounds.top;
        const offsetLeft = (rangeBounds.left - editorBounds.left) + (rangeWidth / 2);
        const offsetTop = rangeBounds.top - editorBounds.top - (toolbarHeight + 14);
        return {offsetLeft, offsetTop};
    }
}

