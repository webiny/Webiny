import React from 'react';
import Webiny from 'webiny';
import css from './TranslatedTextPercentages.scss';

/**
 * @i18n.namespace  Webiny.Backend.I18N.TranslatedTextPercentages
 */
class TranslatedTextPercentages extends Webiny.Ui.Component {
}

TranslatedTextPercentages.defaultProps = {
    renderer() {
        const {Ui} = this.props;
        return (
            <div className={css.translatedTextPercentages}>
                <Ui.Section title="Translations"/>
                <Ui.Data api="/entities/webiny/i18n-texts/stats/translated">
                    {data => (
                        <Ui.Grid.Row>
                            {data.translations.map(item => {
                                const percentage = (item.count / data.texts.total * 100).toFixed(0);
                                return (
                                    <Ui.Grid.Col
                                        key={item.locale.key}
                                        className={css.translatedTextPercentagesLocaleStats}
                                        xs="12"
                                        sm="6"
                                        md="4"
                                        lg="3">
                                        <strong>{item.locale.label}</strong>
                                        <progress-bar>
                                            <bar style={{width: percentage + '%'}}/>
                                            <label>{item.count} / {data.texts.total} ({percentage}%)</label>
                                        </progress-bar>
                                    </Ui.Grid.Col>
                                );
                            })}
                        </Ui.Grid.Row>
                    )}
                </Ui.Data>
            </div>

        );
    }
};

export default Webiny.createComponent(TranslatedTextPercentages, {
    modulesProp: 'Ui',
    modules: ['Data', 'Grid', 'Section']
});
