import React from 'react';
import Webiny from 'webiny';
import css from './EditableTranslation.scss';
import _ from 'lodash';

/**
 * @i18n.namespace  Webiny.Backend.I18N.EditableTranslation
 */
class EditableTranslation extends Webiny.Ui.Component {
    constructor(props) {
        super();
        this.ref = null;
        this.state = _.assign({}, props, {edit: false});
        this.bindMethods('showForm,hideForm');
    }

    showForm() {
        this.setState({edit: true});
        setTimeout(() => this.ref.querySelector('textarea').focus(), 100);
    }

    hideForm() {
        this.setState({edit: false});
    }
}

EditableTranslation.defaultProps = {
    locale: null,
    text: null,
    translation: null,
    renderer() {
        const Ui = this.props.Ui;
        const {text, locale, translation, edit} = this.state;

        return (
            <div ref={ref => this.ref = ref} className={css.editableTranslation} onClick={edit ? _.noop : this.showForm}>
                <label>{locale.label}</label>
                {this.state.edit ? (
                    <Ui.Form
                        defaultModel={{locale: locale.key, text: _.get(translation, 'text')}}
                        api="/entities/webiny/i18n-texts"
                        onSubmit={async (model, form) => {
                            const response = await form.api.patch(`/${text.id}/translations`, model);
                            if (response.isError()) {
                                return Webiny.Growl.danger(response.getMessage());
                            }

                            this.setState({translation: model}, () => {
                                this.hideForm();
                                Webiny.Growl.success(this.i18n('Translation successfully saved!'));
                            });
                        }}>
                        {() => (
                            <Ui.Textarea
                                placeholder={this.i18n('No translation available...')}
                                name="text"
                                onKeyUp={event => event.key === 'Escape' && this.hideForm()}/>
                        )}
                    </Ui.Form>
                ) : (
                    <div>{_.get(translation, 'text', this.i18n('N/A'))}</div>
                )}
            </div>
        );
    }
};

export default Webiny.createComponent(EditableTranslation, {
    modulesProp: 'Ui',
    modules: ['Form', 'Textarea', 'Form']
});
