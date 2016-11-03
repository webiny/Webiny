const {genKey, convertToRaw, ContentBlock, Modifier, BlockMapBuilder, convertFromRaw, getVisibleSelectionRect, EditorState, SelectionState, Entity} = Draft;
const {List, Map} = Immutable;

function filterKey(entityKey) {
    if (entityKey) {
        var entity = Entity.get(entityKey);
        return entity.getMutability() === 'MUTABLE' ? entityKey : null;
    }
    return null;
}

const utils = {
    insertDataBlock: (editorState, data) => {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();

        const afterRemoval = Modifier.removeRange(
            contentState,
            selectionState,
            "backward"
        );

        const targetSelection = afterRemoval.getSelectionAfter();
        const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
        const insertionTarget = afterSplit.getSelectionAfter();

        const asAtomicBlock = Modifier.setBlockType(
            afterSplit,
            insertionTarget,
            "atomic"
        );

        const block = new ContentBlock({
            key: genKey(),
            type: "atomic",
            text: "",
            characterList: List(),
            data: new Map(data)
        });


        const fragmentArray = [
            block,
            new ContentBlock({
                key: genKey(),
                type: "unstyled",
                text: "",
                characterList: List()
            })
        ];

        const fragment = BlockMapBuilder.createFromArray(fragmentArray);

        const withAtomicBlock = Modifier.replaceWithFragment(
            asAtomicBlock,
            insertionTarget,
            fragment
        );

        const newContent = withAtomicBlock.merge({
            selectionBefore: selectionState,
            selectionAfter: withAtomicBlock.getSelectionAfter().set("hasFocus", true)
        });

        return EditorState.push(editorState, newContent, "insert-fragment");
    },
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
        utils.getRangesForDraftEntity(block, entityKey).forEach((range) => {
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
    },
    toHtml: (editorState, plugins) => {
        const contentState = Draft.convertToRaw(editorState.getCurrentContent());
        const renderedBlocks = [];
        contentState.blocks.map(block => {
            const children = null;
            plugins.map(plugin => {
                if (_.isFunction(plugin.toHtml)) {
                    const element = plugin.toHtml(block, children);
                    if (element) {
                        renderedBlocks.push(_.isString(element) ? element : ReactDOMServer.renderToStaticMarkup(element));
                    }
                }
            })
        });

        return renderedBlocks.join('\n');

    },
    toHtmlOld: DraftJsConverters.toHtml,
    toMarkdownOld: DraftJsConverters.toMarkdown
};

export default utils;

