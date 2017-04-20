import Field from './../Field';
import moment from 'moment';

class DateTimeField extends Field {

}

DateTimeField.defaultProps = _.merge({}, Field.defaultProps, {
    format: 'YYYY-MM-DD HH:mm',
    renderer() {
        const datetime = moment(_.get(this.props.data, this.props.name), moment.ISO_8601);

        return (
            <td className={this.getTdClasses()}>{datetime.isValid() ? datetime.format(this.props.format) : this.props.default}</td>
        );
    }
});

export default DateTimeField;