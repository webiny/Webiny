import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ApiTokenForm extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const formProps = {
            api: '/entities/core/api-token',
            fields: '*',
            onSubmitSuccess: () => {
                this.props.showView('tokensListView')().then(this.ui('apiTokenList:loadData'));
            },
            defaultModel: this.props.data
        };

        return (
            <Ui.Modal.Dialog>
                <Ui.Form {...formProps}>
                    {(model, form) => (
                        <modal>
                            <Ui.Modal.Header title="API Token"/>
                            <Ui.Modal.Body>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Form.Error/>
                                        <Ui.Input readOnly label="Token" name="token" renderIf={() => model.id}/>
                                        <Ui.Input label="Owner" name="owner" validate="required" placeholder="Eg: webiny.com"/>
                                        <Ui.Input
                                            label="Description"
                                            name="description"
                                            validate="required"
                                            placeholder="Short description of usage"/>
                                        <Ui.Switch label="Enabled" name="enabled"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer>
                                <Ui.Button label="Cancel" onClick={this.hide}/>
                                <Ui.Button type="primary" label="Save token" onClick={form.submit}/>
                            </Ui.Modal.Footer>
                        </modal>
                    )}
                </Ui.Form>
            </Ui.Modal.Dialog>
        );
    }
}

export default ApiTokenForm;