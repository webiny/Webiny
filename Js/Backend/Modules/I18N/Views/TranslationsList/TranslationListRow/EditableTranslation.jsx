import React from 'react';
import Webiny from 'webiny';
import css from './EditableTranslation.scss';

/**
 * @i18n.namespace  Webiny.Backend.I18N.EditableTranslation
 */
class EditableTranslation extends Webiny.Ui.Component {
    constructor() {
        super();
        this.state = {edit: false};
        this.bindMethods('showForm,hideForm');
    }

    showForm() {
        if (this.state.edit) {
            return;
        }
        this.setState({edit: true});
    }

    hideForm() {
        this.setState({edit: false});
    }
}

EditableTranslation.defaultProps = {
    locale: null,
    renderer() {
        const {Ui, data} = this.props;
        return (
            <div className={css.editableTranslation} onClick={this.showForm}>
                <label>Bosnian (Bosnia and Herzegovina)</label>
                {this.state.edit ? (
                    <Ui.Form
                        onSubmit={(model, form) => {

                        }}>
                        {() => <Ui.Textarea name="text"/>}
                    </Ui.Form>
                ) : (
                    <div>Prijevod nije pronadjen.</div>
                )}
            </div>
        );
    }
};

export default Webiny.createComponent(EditableTranslation, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'Input', 'Textarea', 'Button', 'Select', 'Section', 'Input', 'Icon', 'Form'
    ]
});
