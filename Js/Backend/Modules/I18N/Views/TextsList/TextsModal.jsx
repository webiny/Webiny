import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class TranslationModal extends Webiny.Ui.ModalComponent {
    renderDialog() {
        const {Ui} = this.props;

        // TODO
        // defaultModel.placeholder = defaultModel.placeholder.replace(/\s+/g, " ");

        // We select first locale automatically - if we have one defined.
        const defaultModel = _.clone(this.props.data);
        const definedLocales = Object.keys(this.props.data.translations);

        if (_.first(definedLocales)) {
            defaultModel.locale = _.first(definedLocales);
        }

        return (
            <Ui.Modal.Dialog>
                <Ui.Form
                    defaultModel={defaultModel}
                    api="/entities/webiny/i18n-translations"
                    fields="*,translations"
                    onSuccessMessage={() => this.i18n('Your changes have been saved.')}
                    onSubmit={(model, container) => (
                        container.onSubmit(_.pick(model, ['id', 'translations'])).then(() => {
                            this.hide().then(this.props.onSubmit);
                        })
                    )}>
                    {(model, form) => (
                        <Ui.Modal.Content>
                            <Ui.Form.Loader/>
                            <Ui.Modal.Header title="Edit Translation" onClose={this.hide}/>
                            <Ui.Modal.Body>
                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input disabled label="App" name="app"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Input disabled label="Key" name="key"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Textarea disabled label="Placeholder" name="placeholder"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>

                                <Ui.Section title="Translations"/>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Select
                                            name="locale"
                                            label={this.i18n('Locale')}
                                            placeholder="Select a locale..."
                                            api="/entities/webiny/i18n-locales"
                                            query={{enabled: true}}
                                            fields="id,label,key"
                                            textAttr="label"
                                            valueAttr="key"/>
                                    </Ui.Grid.Col>
                                </Ui.Grid.Row>

                                <Ui.Grid.Row>
                                    <Ui.Grid.Col all={12}>
                                        <Ui.Textarea
                                            label="Text"
                                            name={`translations.${model.key}`}
                                            placeholder="Default placeholder text is used."/>
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
    onSubmit: _.noop
});

export default Webiny.createComponent(TranslationModal, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'Input', 'Textarea', 'Button', 'Select', 'Section'
    ]
});
