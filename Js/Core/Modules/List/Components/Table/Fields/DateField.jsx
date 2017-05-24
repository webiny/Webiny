import Field from './../Field';
import moment from 'moment';

class DateField extends Field {

}

DateField.defaultProps = _.merge({}, Field.defaultProps, {
    format: 'YYYY-MM-DD',
    renderer() {
        const date = moment(_.get(this.props.data, this.props.name));

        return (
            <td className={this.getTdClasses()}>{date.isValid() ? date.format(this.props.format) : this.props.default}</td>
        );
    }
});

export default DateField;