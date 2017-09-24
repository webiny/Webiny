import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

/**
 * @i18n.namespace Webiny.Backend.I18N.TextsList
 */
class LocalesModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Button, Modal, Link, Grid, Form, Select, Switch} = this.props;

        return (
            <Modal.Dialog>
                <Form
                    defaultModel={this.props.data}
                    fields="key,label"
                    api="/entities/webiny/i18n-locales"
                    onSubmitSuccess={apiResponse => this.hide().then(() => this.props.onSubmitSuccess(apiResponse))}
                    onSuccessMessage={() => Webiny.Growl.success(this.i18n('Locale was saved successfully!'))}>
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
                                        <Switch label={this.i18n('Default')} name="default"/>
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

LocalesModal.defaultProps = _.assign({}, Webiny.Ui.ModalComponent.defaultProps, {
    onSubmitSuccess: _.noop,
});

export default Webiny.createComponent(LocalesModal, {
    modules: ['Button', 'Modal', 'Link', 'Grid', 'Form', 'Select', 'Switch']
});