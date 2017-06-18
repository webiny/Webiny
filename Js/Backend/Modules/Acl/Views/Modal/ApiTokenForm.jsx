import Webiny from 'Webiny';

class ApiTokenForm extends Webiny.Ui.ModalComponent {

    renderDialog() {
        const {Modal, Form, Grid, Input, Switch, Button, UserRoles} = this.props;

        const formProps = {
            api: '/entities/webiny/api-token',
            fields: '*,roles',
            id: _.get(this.props.data, 'id'),
            onSubmitSuccess: () => {
                this.props.refreshTokens();
                this.hide();
            },
            defaultModel: this.props.data
        };

        return (
            <Modal.Dialog wide={true}>
                {dialog => (
                    <Form {...formProps}>
                        {(model, form) => (
                            <modal>
                                <Form.Loader/>
                                <Modal.Header title="API Token" onClose={dialog.hide}/>
                                <Modal.Body>
                                    <Grid.Row>
                                        <Grid.Col all={12}>
                                            <Form.Error/>
                                            <Input readOnly label="Token" name="token" renderIf={() => model.id}/>
                                            <Input label="Owner" name="owner" validate="required" placeholder="Eg: webiny.com"/>
                                            <Input
                                                label="Description"
                                                name="description"
                                                validate="required"
                                                placeholder="Short description of usage"/>
                                            <Switch label="Enabled" name="enabled"/>
                                            <UserRoles name="roles"/>
                                        </Grid.Col>
                                    </Grid.Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button label="Cancel" onClick={this.hide}/>
                                    <Button type="primary" label="Save token" onClick={form.submit}/>
                                </Modal.Footer>
                            </modal>
                        )}
                    </Form>
                )}
            </Modal.Dialog>
        );
    }
}

export default Webiny.createComponent(ApiTokenForm, {
    modules: ['Modal', 'Form', 'Grid', 'Input', 'Switch', 'Button', {UserRoles: 'Webiny/Backend/UserRoles'}]
});