import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace Webiny.Ui.Filters.Time
 */
class Time extends Webiny.Ui.Component {
}

Time.defaultProps = {
    format: null,
    default: '-',
    value: null,
    renderer() {
        try {
            return <span>{Webiny.I18n.time(this.props.value, this.props.format)}</span>;
        } catch (e) {
            return this.props.default;
        }
    }
};


export default Webiny.createComponent(Time);