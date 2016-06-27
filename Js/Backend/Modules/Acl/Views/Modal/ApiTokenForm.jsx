import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ApiTokenForm extends Webiny.Ui.ModalComponent {

    render() {
        const formProps = {
            ui: 'tokenModalForm',
            api: '/entities/core/api-token',
            fields: '*',
            onSubmitSuccess: this.props.showView('tokensListView'),
            defaultModel: this.props.data
        };

        return (
            <Ui.Modal.Dialog ref="dialog">
                <Ui.Modal.Header title="API Token"/>
                <Ui.Modal.Body>
                    <Ui.Form.Container {...formProps}>
                        {model => (
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
                        )}
                    </Ui.Form.Container>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="secondary" label="Cancel" onClick={this.hide}/>
                    <Ui.Button type="primary" label="Save token" onClick={this.ui('tokenModalForm:submit')}/>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
}

export default ApiTokenForm;