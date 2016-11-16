import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import EntityPlugin from './../BasePlugins/EntityPlugin';

const style = {
    fontFamily: 'monospace',
    wordBreak: 'normal',
    backgroundColor: 'rgb(244, 244, 244)',
    padding: '1px 4px',
    borderRadius: '5px',
    margin: '0 2px',
    border: '1px solid rgb(204, 204, 204)'
};

class CodePlugin extends EntityPlugin {
    constructor(config) {
        super(config);
        this.name = 'code';
        this.entity = 'code';
    }

    createEntity() {
        const entityKey = Draft.Entity.create(this.entity, 'MUTABLE');
        this.insertEntity(entityKey);
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.Entity icon="fa-terminal" plugin={this} tooltip="Code quote"/>,
            decorators: [
                {
                    strategy: this.entity,
                    component: (props) => {
                        return (
                            <code style={style}>{props.children}</code>
                        );
                    }
                }
            ],
            handleKeyCommand: (command) => {
                if (command === 'toggle-code') {
                    if (this.isActive()) {
                        this.removeEntity();
                    } else {
                        this.setEntity();
                    }
                    return true;
                }
            },

            keyBindingFn: (e) => {
                if (this.editor.getEditorState().getSelection().isCollapsed()) {
                    return false;
                }

                if (Draft.KeyBindingUtil.hasCommandModifier(e) && e.shiftKey) {
                    switch (e.keyCode) {
                        // Cmd + Shift + C
                        case 67:
                            return 'toggle-code';
                        default:
                            return false;
                    }
                }
            }
        };
    }
}

export default CodePlugin;