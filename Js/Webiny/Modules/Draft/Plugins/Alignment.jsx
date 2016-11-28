import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import EntityPlugin from './../BasePlugins/EntityPlugin';
import Utils from './../Utils';

class Alignment extends EntityPlugin {
    constructor(config) {
        super(config);
        this.name = 'alignment';
        this.entity = 'alignment';
    }

    createEntity(align) {
        const entityKey = Draft.Entity.create(this.entity, 'MUTABLE', {align});
        this.insertEntity(entityKey);
    }

    isActive(align) {
        if (this.editor.getReadOnly()) {
            return false;
        }

        const editorState = this.editor.getEditorState();
        const entityKey = Utils.getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection());
        if (!entityKey) {
            return false;
        }

        const entity = Draft.Entity.get(entityKey);
        const entityData = entity.get('data');
        return entityKey && entity.getType().toUpperCase() === this.entity.toUpperCase() && entityData.align === align;
    }

    getEditConfig() {
        return {
            toolbar: () => {
                const buttons = [
                    {
                        align: 'left',
                        tooltip: 'Align block to the left'
                    },
                    {
                        align: 'center',
                        tooltip: 'Align block to the center'
                    },
                    {
                        align: 'right',
                        tooltip: 'Align block to the right'
                    }
                ];

                return (
                    <actions>
                        {buttons.map(b => {
                            const props = {
                                icon: 'fa-align-' + b.align,
                                tooltip: b.tooltip,
                                disabled: this.isDisabled(),
                                onClick: this.isActive(b.align) ? this.removeEntity.bind(this) : () => this.createEntity(b.align),
                                type: this.isActive(b.align) ? 'primary' : 'default',
                                key: b.align,
                                plugin: this
                            };
                            return <Ui.Button {...props}/>
                        })}
                    </actions>
                );
            },
            decorators: [
                {
                    strategy: (contentBlock, callback) => {
                        contentBlock.findEntityRanges(
                            (character) => {
                                const entityKey = character.getEntity();
                                if (entityKey) {

                                    const entity = Draft.Entity.get(entityKey);
                                    return entity && entity.getType() === this.entity;
                                }
                                return false;
                            },
                            callback
                        );
                    },
                    component: (props) => {
                        const data = Draft.Entity.get(props.entityKey).getData();
                        return <div style={{textAlign: data.align}}>{props.children}</div>;
                    }
                }
            ]
        };
    }
}

export default Alignment;