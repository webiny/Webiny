import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import EntityPlugin from './../BasePlugins/EntityPlugin';

class LinkPlugin extends EntityPlugin {
    constructor(config) {
        super(config);
        this.name = 'link';
        this.entity = 'LINK';
    }

    createEntity() {
        this.editor.setReadOnly(true);
        this.ui('insertLink').show();
    }

    submitModal(model) {
        const entityKey = Draft.Entity.create(this.entity, 'MUTABLE', model);
        this.ui('insertLink').hide().then(() => {
            this.insertEntity(entityKey);
        });
    }

    getEditConfig() {
        return _.merge(super.getEditConfig(), {
            toolbar: (
                <Ui.Draft.Toolbar.Entity icon="fa-link" plugin={this}>
                    <Ui.Modal.Dialog ui="insertLink">
                        <Ui.Form ui="linkModalForm" onSubmit={this.submitModal.bind(this)}>
                            {(model, form) => (
                                <wrapper>
                                    <Ui.Modal.Header title="Insert link"/>
                                    <Ui.Modal.Body>
                                        <Ui.Grid.Row>
                                            <Ui.Grid.Col all={12}>
                                                <Ui.Input name="url" placeholder="Enter a URL" validate="required,url"/>
                                                <Ui.Select name="target" placeholder="Select link target" validate="required">
                                                    <option value="_self">Same tab</option>
                                                    <option value="_blank">New tab</option>
                                                </Ui.Select>
                                            </Ui.Grid.Col>
                                        </Ui.Grid.Row>
                                    </Ui.Modal.Body>
                                    <Ui.Modal.Footer align="right">
                                        <Ui.Button type="default" key="cancel" label="Cancel" onClick={this.ui('linkModalForm:hide')}/>
                                        <Ui.Button type="primary" key="submit" label="Export" onClick={form.submit}/>
                                    </Ui.Modal.Footer>
                                </wrapper>
                            )}
                        </Ui.Form>
                    </Ui.Modal.Dialog>
                </Ui.Draft.Toolbar.Entity>
            ),
            handleKeyCommand: (command) => {
                if (command === this.entity && this.editor.getEditorState().getSelection().isCollapsed()) {
                    return true;
                }
            },
            decorators: [
                {
                    strategy: this.entity,
                    component: (props) => {
                        const data = Draft.Entity.get(props.entityKey).getData();
                        return (
                            <a href={data.url} target={data.target}>{props.children}</a>
                        );
                    }
                }
            ]
        });
    }
}

export default LinkPlugin;