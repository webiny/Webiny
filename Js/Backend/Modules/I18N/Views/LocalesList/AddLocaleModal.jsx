import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class AddLocaleModal extends Webiny.Ui.ModalComponent {
    constructor() {
        super();
        this.i18n.key = 'Webiny.Backend.I18N.TextsList';
    }

    renderDialog() {
        const {Button, Modal, Link, Grid, Form, Select} = this.props;

        return (
            <Modal.Dialog>
                <Form
                    fields="key,label"
                    api="/entities/webiny/i18n-locales"
                    onSuccessMessage={this.props.onSuccessMessage}
                    onSubmitSuccess={apiResponse => this.hide().then(() => this.props.onSubmitSuccess(apiResponse))}>
                    {(model, form) => (
                        <Modal.Content>
                            <Modal.Header title="Add locale"/>
                            <Modal.Body>
                                <Grid.Row>
                                    <Grid.Col all={12}>
                                        <Form.Error/>
                                        <Form.Loader/>
                                        <Select
                                            description={this.i18n(`Locales already added are not shown.`)}
                                            placeholder={this.i18n('Select locale to add...')}
                                            name="key"
                                            validate="required"
                                            api="/entities/webiny/i18n-locales"
                                            url="/available"/>
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

AddLocaleModal.defaultProps = _.assign({}, Webiny.Ui.ModalComponent.defaultProps, {
    onSubmitSuccess: _.noop,
    onSuccessMessage: _.noop
});

export default Webiny.createComponent(AddLocaleModal, {
    modules: ['Button', 'Modal', 'Link', 'Grid', 'Form', 'Select']
});