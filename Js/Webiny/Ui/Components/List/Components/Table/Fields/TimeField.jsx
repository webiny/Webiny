import Field from './../Field';
import moment from 'moment';

class TimeField extends Field {

}

TimeField.defaultProps = _.merge({}, Field.defaultProps, {
    format: 'HH:mm',
    renderer() {
        return (
            <td className={this.getTdClasses()}>{moment(_.get(this.props.data, this.props.name)).format(this.props.format)}</td>
        );
    }
});

export default TimeField;