import React from 'react';
import Webiny from 'webiny';
import moment from 'moment';

class TimeAgo extends Webiny.Ui.Component {

}

TimeAgo.defaultProps = {
    value: null,
    invalidMessage: 'invalid date format',
    renderer() {
        const timeAgo = moment(this.props.value, moment.ISO_8601);

        return (
            <span>{timeAgo.isValid() ? timeAgo.fromNow() : this.props.invalidMessage}</span>
        );
    }
};


export default TimeAgo;
