import Webiny from 'Webiny';
import Draft from 'draft-js';
const Utils = Webiny.Draft.Utils;

class LinkPlugin extends Webiny.Draft.EntityPlugin {
    constructor(config) {
        super(config);
        this.validate = _.get(config, 'validate', 'required,url');
        this.name = 'link';
        this.entity = 'LINK';
        this.id = _.uniqueId('insertLink-');
        this.formId = this.id + '-form';
        this.newLink = true;

        this.showDropdown = this.showDropdown.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.removeEntity = this.removeEntity.bind(this);
    }

    removeEntity() {
        super.removeEntity();
        this.ui(this.id).close();
    }

    showDropdown() {
        const editorState = this.editor.getEditorState();
        if (editorState) {
            const contentState = editorState.getCurrentContent();
            const selection = editorState.getSelection();
            const entityKey = Utils.getEntityKeyForSelection(contentState, selection);
            if (entityKey) {
                this.newLink = false;
                const data = contentState.getEntity(entityKey).get('data');
                this.ui(this.formId).setModel(data);
            } else {
                this.newLink = true;
                this.ui(this.formId).resetForm();
            }
        }
        this.editor.setReadOnly(true);
    }

    submitForm(model) {
        const editorState = this.editor.getEditorState();
        if (this.newLink) {
            const newContentState = editorState.getCurrentContent().createEntity(this.entity, 'MUTABLE', model);
            this.insertEntity(newContentState, newContentState.getLastCreatedEntityKey());
        } else {
            const contentState = editorState.getCurrentContent();
            const entityKey = Utils.getEntityKeyForSelection(contentState, editorState.getSelection());
            const newContentState = contentState.replaceEntityData(entityKey, model);
            this.editor.setEditorState(Draft.EditorState.push(editorState, newContentState, 'apply-entity'));
        }

        this.ui(this.formId).resetForm();
        this.ui(this.id).close();
    }

    getEditConfig() {
        return {
            toolbar: () => {
                const disabled = this.editor.getReadOnly() || (!this.isActive() && this.editor.getEditorState().getSelection().isCollapsed());

                return (
                    <Webiny.Ui.LazyLoad modules={['Form', 'Dropdown', 'Grid', 'Checkbox', 'Input', 'Logic', 'Button', 'Icon']}>
                        {(Ui) => {
                            const props = {
                                disabled,
                                ui: this.id,
                                title: <Ui.Icon icon="fa-link"/>,
                                closeOnClick: false,
                                onShow: this.showDropdown
                            };

                            return (
                                <Ui.Dropdown {...props}>
                                    {() => (
                                        <Ui.Form ui={this.formId} onSubmit={this.submitForm}>
                                            {(model, form) => {
                                                return (
                                                    <div style={{width: 400}}>
                                                        <Ui.Grid.Row>
                                                            <Ui.Grid.Col xs={12}>
                                                                <Ui.Input
                                                                    name="url"
                                                                    placeholder="Enter a URL"
                                                                    validate={this.validate}
                                                                    showValidationIcon={false}/>
                                                            </Ui.Grid.Col>
                                                            <Ui.Grid.Col xs={6}>
                                                                <Ui.Checkbox name="newTab" label="Open in new tab" grid={null}/>
                                                            </Ui.Grid.Col>
                                                            <Ui.Grid.Col xs={3} className="no-padding">
                                                                <Ui.Logic.Hide if={() => this.newLink}>
                                                                    <Ui.Button
                                                                        type="secondary"
                                                                        align="right"
                                                                        label="Remove link"
                                                                        onClick={this.removeEntity}/>
                                                                </Ui.Logic.Hide>
                                                            </Ui.Grid.Col>
                                                            <Ui.Grid.Col xs={3} className="pull-right">
                                                                <Ui.Button
                                                                    type="primary"
                                                                    label={this.newLink ? 'Insert link' : 'Update link'}
                                                                    onClick={form.submit}/>
                                                            </Ui.Grid.Col>
                                                        </Ui.Grid.Row>
                                                    </div>
                                                );
                                            }}
                                        </Ui.Form>
                                    )}
                                </Ui.Dropdown>
                            );
                        }}
                    </Webiny.Ui.LazyLoad>
                );
            },
            handleKeyCommand: (command) => {
                if (command === this.entity && this.editor.getEditorState().getSelection().isCollapsed()) {
                    return true;
                }
            },
            decorators: [
                {
                    strategy: this.entity,
                    component: (props) => {
                        const editorState = this.editor.getEditorState();
                        const data = editorState.getCurrentContent().getEntity(props.entityKey).getData();
                        // To avoid opening the link in same tab while editing we always set _blank here
                        return (
                            <a href={data.url} target="_blank">{props.children}</a>
                        );
                    }
                }
            ]
        };
    }

    getPreviewConfig() {
        return {
            decorators: [
                {
                    strategy: this.entity,
                    component: (props) => {
                        const editorState = this.editor.getEditorState();
                        const data = editorState.getCurrentContent().getEntity(props.entityKey).getData();
                        return (
                            <a href={data.url} target={_.get(data, 'newTab') ? '_blank' : '_self'}>{props.children}</a>
                        );
                    }
                }
            ]
        };
    }
}

export default LinkPlugin;