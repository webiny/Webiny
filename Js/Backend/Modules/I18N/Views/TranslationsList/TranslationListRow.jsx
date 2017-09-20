import React from 'react';
import Webiny from 'webiny';
import css from './TranslationListRow.scss';
import EditableTranslation from './TranslationListRow/EditableTranslation';

/**
 * @i18n.namespace  Webiny.Backend.I18N.TranslationListRow
 */
class TranslationListRow extends Webiny.Ui.Component {
}

TranslationListRow.defaultProps = {
    renderer() {
        const {Ui, data} = this.props;
        return (
            <div className={css.translationListRow}>
                <div onClick={this.toggle}>
                    <div>
                        <translation-key className="key">{data.key}</translation-key>
                        <translation-base className="base">{data.base}</translation-base>
                    </div>
                    <translations>
                        <ul>
                            <li>
                                <EditableTranslation locale="en_GB" data={data}/>
                            </li>
                            <li>
                                <EditableTranslation locale="en_UK" data={data}/>
                            </li>
                            <li>
                                <EditableTranslation locale="hr_HR" data={data}/>
                            </li>
                        </ul>
                    </translations>
                </div>
            </div>
        );
    }
};

export default Webiny.createComponent(TranslationListRow, {
    modulesProp: 'Ui',
    modules: [
        'Modal', 'Form', 'Grid', 'Input', 'Textarea', 'Button', 'Select', 'Section', 'Input'
    ]
});
