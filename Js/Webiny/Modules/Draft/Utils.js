function filterKey(entityKey) {
    if (entityKey) {
        const entity = Draft.Entity.get(entityKey);
        return entity.getMutability() === 'MUTABLE' ? entityKey : null;
    }
    return null;
}

const utils = {
    // function borrowed from: https://github.com/draft-js-plugins/draft-js-plugins/blob/master/draft-js-dnd-plugin/src/modifiers/addBlock.js
    insertDataBlock: (editorState, insertData = null) => {
        let type = 'unstyled';
        const currentContentState = editorState.getCurrentContent();
        const currentSelectionState = editorState.getSelection();

        // in case text is selected it is removed and then the block is appended
        const afterRemovalContentState = Draft.Modifier.removeRange(currentContentState, currentSelectionState, 'backward');

        // deciding on the position to split the text
        const targetSelection = afterRemovalContentState.getSelectionAfter();
        const blockKeyForTarget = targetSelection.get('focusKey');
        const block = currentContentState.getBlockForKey(blockKeyForTarget);
        let insertionTargetSelection;
        let insertionTargetBlock;

        // In case there are no characters or entity or the selection is at the start it
        // is safe to insert the block in the current block.
        // Otherwise a new block is created (the block is always its own block)
        const isEmptyBlock = block.getLength() === 0 && block.getEntityAt(0) === null;
        const selectedFromStart = currentSelectionState.getStartOffset() === 0;
        if (isEmptyBlock || selectedFromStart) {
            insertionTargetSelection = targetSelection;
            insertionTargetBlock = afterRemovalContentState;
        } else {
            // the only way to insert a new seems to be by splitting an existing in to two
            insertionTargetBlock = Draft.Modifier.splitBlock(afterRemovalContentState, targetSelection);
            // the position to insert our blocks
            insertionTargetSelection = insertionTargetBlock.getSelectionAfter();
        }

        const fragmentArray = [];
        if (insertData) {
            // creating a new ContentBlock including the entity with data
            // Entity will be created with a specific type, if defined, else will fall back to the ContentBlock type
            const {text, data, entity} = insertData;
            type = insertData.type;
            const entityKey = Draft.Entity.create(entity.type || type, entity.mutability, entity.data);
            const charData = Draft.CharacterMetadata.create({entity: entityKey});

            fragmentArray.push(
                new Draft.ContentBlock({
                    key: Draft.genKey(),
                    type,
                    text,
                    data,
                    characterList: Immutable.List(Immutable.Repeat(charData, text.length || 1)) // eslint-disable-line new-cap
                })
            );
        }

        // new content block so we can continue writing right away after inserting the block
        fragmentArray.push(
            new Draft.ContentBlock({
                key: Draft.genKey(),
                type: 'unstyled',
                text: '',
                characterList: Immutable.List() // eslint-disable-line new-cap
            })
        );

        const newContentStateAfterSplit = Draft.Modifier.setBlockType(insertionTargetBlock, insertionTargetSelection, type);
        // create fragment containing the two content blocks
        const fragment = Draft.BlockMapBuilder.createFromArray(fragmentArray);
        // replace the content block we reserved for our insert
        const contentStateWithBlock = Draft.Modifier.replaceWithFragment(newContentStateAfterSplit, insertionTargetSelection, fragment);
        // update editor state with our new state including the block
        const newState = Draft.EditorState.push(editorState, contentStateWithBlock, `insert-fragment`);
        return Draft.EditorState.forceSelection(newState, contentStateWithBlock.getSelectionAfter());
    },

    getRangesForDraftEntity: (block, key) => {
        const ranges = [];
        block.findEntityRanges(c => {
            return c.getEntity() === key;
        }, (start, end) => {
            ranges.push({start, end});
        });

        return ranges;
    },

    getEntityKeyForSelection: (contentState, targetSelection) => {
        let entityKey;

        if (targetSelection.isCollapsed()) {
            const key = targetSelection.getAnchorKey();
            const offset = targetSelection.getAnchorOffset();
            if (offset > 0) {
                entityKey = contentState.getBlockForKey(key).getEntityAt(offset - 1);
                return filterKey(entityKey);
            }
            return null;
        }

        const startKey = targetSelection.getStartKey();
        const startOffset = targetSelection.getStartOffset();
        const startBlock = contentState.getBlockForKey(startKey);

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
                entitySelection = new Draft.SelectionState({
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
            return JSON.stringify(Draft.convertToRaw(content), null, 2);
        }
    },

    getSelectionCoords: (editor) => {
        const editorBounds = editor.getBoundingClientRect();
        const rangeBounds = Draft.getVisibleSelectionRect(window);

        if (!rangeBounds) {
            return null;
        }

        const rangeWidth = rangeBounds.right - rangeBounds.left;
        const left = (rangeBounds.left - editorBounds.left) + (rangeWidth / 2);
        const top = rangeBounds.top - editorBounds.top;
        return {left, top};
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
            });
        });

        return renderedBlocks.join('\n');
    }
};

export default utils;