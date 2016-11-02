export default configurePlugin = (config = {}) => {
    return {
        // Plugin name
        name: '',

        // Toolbar component (if needed)
        toolbar: null,

        // https://facebook.github.io/draft-js/docs/advanced-topics-custom-block-render-map.html#configuring-block-render-map
        blockRenderMap: {},

        // https://facebook.github.io/draft-js/docs/advanced-topics-block-components.html#custom-block-components
        blockRendererFn: (contentBlock, editor) => {
        },

        // https://facebook.github.io/draft-js/docs/advanced-topics-block-styling.html#blockstylefn
        blockStyleFn: (contentBlock, editor) => {},

        // https://facebook.github.io/draft-js/docs/advanced-topics-inline-styles.html#mapping-a-style-string-to-css
        customStyleMap: {},

        // https://facebook.github.io/draft-js/docs/advanced-topics-decorators.html#compositedecorator
        decorators: [],

        // https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html#example
        handleKeyCommand: (command, editor) => {},

        // https://facebook.github.io/draft-js/docs/advanced-topics-key-bindings.html#example
        keyBindingFn: (e, editor) => {}
    };
}

/*
`editor` is an object containing the following methods:
- getEditorState
- setEditorState
- setReadOnly
- getReadOnly
 */