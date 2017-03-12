import Webiny from 'Webiny';
import moment from 'moment';

class TimeAgo extends Webiny.Ui.Component {

}

TimeAgo.defaultProps = {
    renderer() {
        const timeAgo = moment(this.props.value, moment.ISO_8601);

        return (
            <span>{timeAgo.isValid() ? timeAgo.fromNow() : 'invalid date format'}</span>
        );
    }
};


export default TimeAgo;
