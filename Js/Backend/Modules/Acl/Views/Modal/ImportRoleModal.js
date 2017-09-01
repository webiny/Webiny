import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

class ImportRoleModal extends Webiny.Ui.ModalComponent {

    submit(model, form) {
        const data = JSON.parse(model.role);
        return form.onSubmit(data);
    }

    renderDialog() {
        const {Modal, Form, CodeEditor, Button} = this.props;

        const formProps = {
            api: '/entities/webiny/user-roles',
            onSuccessMessage: model => <span>Permission <strong>{model.name}</strong> was imported!</span>,
            onSubmit: this.submit,
            onSubmitSuccess: () => this.hide().then(this.props.onImported)
        };

        return (
            <Modal.Dialog>
                <Form {...formProps}>
                    {(model, form) => (
                        <Modal.Content>
                            <Form.Loader/>
                            <Modal.Header title="Import Role" onClose={this.hide}/>
                            <Modal.Body>
                                <Form.Error/>
                                <CodeEditor mode="text/javascript" name="role" validate="required,json"/>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button label="Import" type="primary" onClick={form.submit}/>
                            </Modal.Footer>
                        </Modal.Content>
                    )}
                </Form>
            </Modal.Dialog>
        );
    }
}

ImportRoleModal.defaultProps = _.assign({}, Webiny.Ui.ModalComponent.defaultProps, {
    onImported: _.noop
});

export default Webiny.createComponent(ImportRoleModal, {modules: ['Form', 'Modal', 'CodeEditor', 'Button']});