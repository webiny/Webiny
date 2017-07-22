import React from 'react';
import Webiny from 'Webiny';
import moment from 'moment';

class DateTime extends Webiny.Ui.Component {

}

DateTime.defaultProps = {
    format: 'YYYY-MM-DD HH:mm',
    renderer() {
        const datetime = moment(this.props.value, moment.ISO_8601);

        return (
            <span>{datetime.isValid() ? datetime.format(this.props.format) : 'invalid date format'}</span>
        );
    }
};


export default DateTime;
