import Webiny from 'Webiny';

class AddEntityModal extends Webiny.Ui.ModalComponent {

    constructor() {
        super();
        this.api = new Webiny.Api.Endpoint('/services/webiny/entities');
    }

    renderDialog() {
        const {Modal, Form, Grid, Select, Button} = this.props;

        return (
            <Modal.Dialog>
                {dialog => (
                    <Form
                        onSubmit={async (model, form) => {
                            form.showLoading();
                            const query = {
                                withDetails: true,
                                crudMethods: true,
                                entity: model.class
                            };

                            const apiResponse = await this.api.setQuery(query).get();

                            form.hideLoading();
                            await dialog.hide();

                            this.props.onSubmit(apiResponse.getData());
                        }}>
                        {(model, form) => (
                            <Modal.Content>
                                <Modal.Header title="Add entity" onClose={dialog.hide}/>
                                <Modal.Body>
                                    <Grid.Row>
                                        <Grid.Col all={12}>
                                            <Form.Error/>
                                            <Select
                                                placeholder={this.i18n('Select entity...')}
                                                name="class"
                                                validate="required"
                                                api="/services/webiny/entities"
                                                valueAttr="class"
                                                textAttr="class"
                                                perPage={100}
                                                minimumResultsForSearch={10}/>
                                        </Grid.Col>
                                    </Grid.Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button label="Cancel" onClick={this.hide}/>
                                    <Button type="primary" label="Add" onClick={form.submit}/>
                                </Modal.Footer>
                            </Modal.Content>
                        )}
                    </Form>
                )}
            </Modal.Dialog>
        );
    }
}

AddEntityModal.defaultProps = _.assign({}, Webiny.Ui.ModalComponent.defaultProps, {
    onSubmit: _.noop
});

export default Webiny.createComponent(AddEntityModal, {
    modules: ['Modal', 'Form', 'Grid', 'Select', 'Button']
});