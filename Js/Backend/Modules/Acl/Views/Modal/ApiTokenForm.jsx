import Webiny from 'Webiny';

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
            <Webiny.Ui.LazyLoad modules={['Modal', 'Form', 'Grid', 'Input', 'Switch', 'Button']}>
                {(Ui) => (
                    <Ui.Modal.Dialog>
                        {dialog => (
                            <Ui.Form {...formProps}>
                                {(model, form) => (
                                    <modal>
                                        <Ui.Modal.Header title="API Token" onClose={dialog.hide}/>
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
                        )}
                    </Ui.Modal.Dialog>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
}

export default ApiTokenForm;