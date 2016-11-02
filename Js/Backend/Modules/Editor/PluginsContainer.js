import PluginBlock from './PluginBlock';

export default class PluginsContainer {
    constructor(plugins, editor) {
        this.editor = editor;
        this.blockRenderMap = {};
        this.blockRendererFn = [];
        this.blockStyleFn = [];
        this.customStyleMap = {};
        this.decorators = [];
        this.handleKeyCommand = [];
        this.keyBindingFn = [];
        this.handleReturn = [];
        this.handlePastedText = [];
        this.onTab = [];

        const props = [
            'blockRenderMap',
            'blockRendererFn',
            'blockStyleFn',
            'customStyleMap',
            'handleKeyCommand',
            'handlePastedText',
            'keyBindingFn',
            'handleReturn',
            'onTab'
        ];

        plugins.map(plugin => {
            if (!plugin) {
                return;
            }
            plugin.editor = this.editor;
            props.map(prop => {
                if (_.has(plugin, prop)) {
                    const value = plugin[prop];
                    if (_.isPlainObject(value)) {
                        _.assign(this[prop], value);
                    }
                    if (_.isFunction(value)) {
                        this[prop].push(value);
                    }
                }
            });

            const decorators = _.get(plugin, 'decorators');
            if (decorators) {
                decorators.map(d => {
                    this.decorators.push(this.createDecorator(d));
                });
            }
        });

        this.compositeDecorator = new Draft.CompositeDecorator(this.decorators);

        const blockRenderMap = Immutable.Map(this.blockRenderMap);
        this.extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);
    }

    createDecorator(decorator) {
        const draftDecorator = _.clone(decorator);
        if (_.isString(draftDecorator.strategy)) {
            draftDecorator.strategy = (contentBlock, callback) => {
                contentBlock.findEntityRanges(
                    (character) => {
                        const entityKey = character.getEntity();
                        return entityKey !== null && Draft.Entity.get(entityKey).getType().toUpperCase() === decorator.strategy.toUpperCase();
                    },
                    callback
                );
            }
        }
        return draftDecorator;
    }

    getHandleKeyCommandFn() {
        return (command) => {
            let result = false;
            _.each(this.handleKeyCommand, fn => {
                result = fn(command, this.editor);
                if (result === true) {
                    return false;
                }
            });

            if (!result) {
                const editorState = this.editor.getEditorState();
                const newState = Draft.RichUtils.handleKeyCommand(editorState, command);
                if (newState) {
                    this.editor.setEditorState(newState);
                    return true;
                }
            }
            return false;
        };
    }

    getHandleReturnFn() {
        return (e) => {
            let result = false;
            _.each(this.handleReturn, fn => {
                result = fn(e, this.editor);
                if (result === true) {
                    return false;
                }
            });

            if (result) {
                return true;
            }
        };
    }

    getHandlePastedTextFn() {
        return (text, html) => {
            let result = false;
            _.each(this.handlePastedText, fn => {
                result = fn(text, html, this.editor);
                if (result === true) {
                    return false;
                }
            });

            if (result) {
                return true;
            }
        };
    }

    getOnTabFn() {
        return (e) => {
            let result = false;
            _.each(this.onTab, fn => {
                result = fn(e, this.editor);
                if (result === true) {
                    return false;
                }
            });

            if (result) {
                e.stopPropagation();
                return;
            }

            e.stopPropagation();
            this.editor.setEditorState(Draft.RichUtils.onTab(e, this.editor.getEditorState(), 4));
        };
    }

    getDecorators() {
        return this.compositeDecorator;
    }

    getBlockRenderMap() {
        return this.extendedBlockRenderMap;
    }

    getBlockRendererFn() {
        return (contentBlock) => {
            let renderer = null;
            _.each(this.blockRendererFn, br => {
                const plugin = br(contentBlock, this.editor);
                if (plugin) {
                    renderer = {
                        component: PluginBlock,
                        editable: false,
                        props: {
                            plugin,
                            editor: this.editor,
                            plugins: this
                        }
                    };
                    return false;
                }
            });
            return renderer;
        };
    }

    getBlockStyleFn() {
        return (contentBlock) => {
            let renderer = null;
            _.each(this.blockStyleFn, bs => {
                renderer = bs(contentBlock, this.editor);
                if (renderer) {
                    return false;
                }
            });
            return renderer;
        };
    }

    getCustomStyleMap() {
        return this.customStyleMap;
    }

    getKeyBindingFn() {
        return (e) => {
            let command = null;
            _.each(this.keyBindingFn, kb => {
                command = kb(e, this.editor);
                if (_.isString(command)) {
                    return false;
                }
            });

            return command || Draft.getDefaultKeyBinding(e);
        };
    }
}