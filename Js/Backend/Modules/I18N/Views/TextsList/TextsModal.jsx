import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

/**
 * @i18n.namespace  Webiny.Backend.I18N.TranslationModal
 */
class TranslationModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Ui} = this.props;

        return (
            <Ui.Modal.Dialog>
                <Ui.Form
                    id={_.get(this.props.data, 'id')}
                    api="/entities/webiny/i18n-texts"
                    fields="*,translations"
                    onSuccessMessage={() => this.i18n('Text was successfully saved!')}
                    onSubmitSuccess={() => this.hide().then(this.props.onTextsSaved)}>
                    {(model, form) => (
                        <Ui.Modal.Content>
                            <Ui.Form.Loader/>
                            <Ui.Modal.Header title={this.i18n(`Text`)} onClose={this.hide}/>
                            <Ui.Modal.Body>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input label="Key" name="key" validate="required"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Textarea label="Base text" name="base" validate="required"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Select
                                            label={this.i18n('App')}
                                            name="app"
                                            api="/services/webiny/apps"
                                            validate="required"
                                            url="/installed"
                                            textAttr="name"
                                            valueAttr="name"
                                            placeholder="Select an app..."
                                            allowClear/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Select
                                            filterBy="app"
                                            disabled={!model.app}
                                            label={this.i18n('Text group')}
                                            api="/entities/webiny/i18n-text-groups"
                                            name="group"
                                            textAttr="name"
                                            valueAttr="id"
                                            placeholder={this.i18n('Optional')}
                                            allowClear/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>
                            </Ui.Modal.Body>
                            <Ui.Modal.Footer >
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

TranslationModal.defaultProps = _.merge({}, Webiny.Ui.ModalComponent.defaultProps, {
    data: null,
    onTextsSaved: _.noop
});

export default Webiny.createComponent(TranslationModal, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'Input', 'Textarea', 'Button', 'Select', 'Section'
    ]
});
