import React from 'react';
import Webiny from 'webiny';
import css from './EditableTranslation.scss';

/**
 * @i18n.namespace  Webiny.Backend.I18N.EditableTranslation
 */
class EditableTranslation extends Webiny.Ui.Component {
    constructor() {
        super();
        this.state = {open: false};
        this.bindMethods('toggle');
    }

    toggle() {
        this.setState({open: !this.state.open});
    }
}

EditableTranslation.defaultProps = {
    locale: null,
    renderer() {
        const {Ui, data} = this.props;
        return (
            <div className={css.editableTranslation}>
                <label>{this.props.locale}</label>
                Prijevod nije pronadjen.
            </div>
        );
    }
};

export default Webiny.createComponent(EditableTranslation, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'Input', 'Textarea', 'Button', 'Select', 'Section', 'Input', 'Icon'
    ]
});
