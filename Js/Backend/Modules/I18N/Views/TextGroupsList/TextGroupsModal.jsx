import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

/**
 * @i18n.namespace  Webiny.Backend.I18N.TextGroupModal
 */
class TextGroupModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Ui} = this.props;

        return (
            <Ui.Modal.Dialog>
                <Ui.Form
                    id={_.get(this.props, 'data.id')}
                    api="/entities/webiny/i18n-text-groups"
                    fields="name"
                    onSubmitSuccess={() => this.hide().then(this.props.onSubmitSuccess)}>
                    {(model, form) => (
                        <Ui.Modal.Content>
                            <Ui.Form.Loader/>
                            <Ui.Modal.Header title={this.i18n('Text Group')} onClose={this.hide}/>
                            <Ui.Modal.Body>
                                <Ui.Form.Error/>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Name" placeholder={this.i18n('Name of text group')} name="name"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer>
                                <Ui.Button label="Cancel" onClick={this.hide}/>
                                <Ui.Button type="primary" label="Save" onClick={form.submit}/>
                            </Ui.Modal.Footer>
                        </Ui.Modal.Content>
                    )}
                </Ui.Form>
            </Ui.Modal.Dialog>
        );
    }
}

TextGroupModal.defaultProps = _.merge({}, Webiny.Ui.ModalComponent.defaultProps, {
    onSubmitSuccess: _.noop
});

export default Webiny.createComponent(TextGroupModal, {
    modulesProp: 'Ui',
    modules: ['Modal', 'Form', 'Grid', 'Input', 'Button']
});
