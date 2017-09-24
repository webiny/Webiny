import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import format from 'date-fns/format';

/**
 * @i18n.namespace Webiny.Backend.I18N.TextsList
 */
class LocalesModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Button, Modal, Link, Grid, Form, Select, Switch, Section, Input} = this.props;

        return (
            <Modal.Dialog>
                <Form
                    defaultModel={_.assign({formats: {}}, this.props.data)}
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
                                <Section title="Dates"/>
                                <Grid.Row>
                                    <Grid.Col all={7}>
                                        <Input label="Date" name="formats.date" placeholder={this.i18n('eg. DD/MM/YYYY')}/>
                                    </Grid.Col>
                                    <Grid.Col all={5}>
                                        <Input
                                            readyOnly
                                            label={this.i18n('Preview')}
                                            value={format(new Date(), model.formats.date)}
                                            placeholder={this.i18n('Type format to see example.')}/>
                                    </Grid.Col>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Col all={7}>
                                        <Input label="Time" name="formats.time" placeholder={this.i18n('eg. HH:mm:ss')}/>
                                    </Grid.Col>
                                    <Grid.Col all={5}>
                                        <Input
                                            readyOnly
                                            label={this.i18n('Preview')}
                                            value={format(new Date(), model.formats.time)}
                                            placeholder={this.i18n('Type format to see example.')}/>
                                    </Grid.Col>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Col all={7}>
                                        <Input label="Date/Time" name="formats.datetime"
                                               placeholder={this.i18n('eg. DD/MM/YYYY HH:mm:ss')}/>
                                    </Grid.Col>
                                    <Grid.Col all={5}>
                                        <Input
                                            readyOnly
                                            label={this.i18n('Preview')}
                                            value={format(new Date(), model.formats.datetime)}
                                            placeholder={this.i18n('Type format to see example.')}/>
                                    </Grid.Col>
                                </Grid.Row>
                                <Section title="Numbers"/>
                                <Grid.Row>
                                    <Grid.Col all={6}>
                                        <Input label="Price" name="formats.price" placeholder={this.i18n('eg. DD/MM/YYYY')}/>
                                    </Grid.Col>
                                    <Grid.Col all={6}>
                                        <Input label="Number" name="formats.number" placeholder={this.i18n('eg. HH:mm:ss')}/>
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
    modules: ['Button', 'Modal', 'Link', 'Grid', 'Form', 'Select', 'Switch', 'Section', 'Input']
});