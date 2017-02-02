import Field from './../Field';
import moment from 'moment';

class TimeAgoField extends Field {

}

TimeAgoField.defaultProps = _.merge({}, Field.defaultProps, {
    renderer() {
        let value = this.props.data[this.props.name];
        if (value) {
            value = moment(value).fromNow();
        }
        return (
            <td className={this.getTdClasses()}>{value || '-'}</td>
        );
    }
});

export default TimeAgoField;