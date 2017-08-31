import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

class ImportPermissionModal extends Webiny.Ui.ModalComponent {

    submit(model, form) {
        const data = JSON.parse(model.permission);
        return form.onSubmit(data);
    }

    renderDialog() {
        const {Modal, Form, CodeEditor, Button} = this.props;

        const formProps = {
            api: '/entities/webiny/user-permissions',
            onSuccessMessage: model => <span>Permission <strong>{model.name}</strong> was imported!</span>,
            onSubmit: this.submit,
            onSubmitSuccess: () => this.hide().then(this.props.onImported)
        };
        
        return (
            <Modal.Dialog>
                <Form {...formProps}>
                    {(model, form) => (
                        <Modal.Content>
                            <Modal.Header title="Import Permission" onClose={this.hide}/>
                            <Modal.Body>
                                <Form.Error/>
                                <CodeEditor mode="text/javascript" name="permission" validate="required,json"/>
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

ImportPermissionModal.defaultProps = _.assign({}, Webiny.Ui.ModalComponent.defaultProps, {
    onImported: _.noop
});

export default Webiny.createComponent(ImportPermissionModal, {modules: ['Form', 'Modal', 'CodeEditor', 'Button']});