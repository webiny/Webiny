import React from 'react';
import Webiny from 'webiny';

/**
 * @i18n.namespace Webiny.Ui.Filters.DateTime
 */
class DateTime extends Webiny.Ui.Component {

}

DateTime.defaultProps = {
    format: 'YYYY-MM-DD HH:mm',
    renderer() {
        const {moment} = this.props;
        const datetime = moment(this.props.value, moment.ISO_8601);

        return (
            <span>{datetime.isValid() ? datetime.format(this.props.format) : this.i18n('invalid date format')}</span>
        );
    }
};


export default Webiny.createComponent(DateTime, {modules: [{moment: 'Webiny/Vendors/Moment'}]});
