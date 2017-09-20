import React from 'react';
import Webiny from 'webiny';
import css from './TextRow.scss';
import EditableTranslation from './TranslationListRow/EditableTranslation';
import _ from 'lodash';

/**
 * @i18n.namespace  Webiny.Backend.I18N.TranslationListRow
 */
class TextRow extends Webiny.Ui.Component {
}

TextRow.defaultProps = {
    text: null,
    locales: [],
    renderer() {
        const {Ui, text} = this.props;
        return (
            <div className={css.translationListRow}>
                <div onClick={this.toggle}>
                    <div>
                        <translation-key className="key">{text.key}</translation-key>
                        <translation-base className="base">{text.base}</translation-base>
                    </div>
                    <translations>
                        <ul>
                            {this.props.locales.map(locale => (
                                <li key={locale.key}>
                                    <EditableTranslation
                                        locale={locale}
                                        text={text}
                                        translation={_.find(text.translations, {locale: locale.key})}/>
                                </li>
                            ))}
                        </ul>
                    </translations>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(TextRow, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'Input', 'Textarea', 'Button', 'Select', 'Section', 'Input'
    ]
});
