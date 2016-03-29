import Webiny from 'Webiny';
import Field from './../Field';

class TimeField extends Field {

}

TimeField.defaultProps = {
    format: 'HH:mm',
    renderer: function renderer() {
        return (
            <td className={this.getTdClasses()}>{moment(this.props.data[this.props.name]).format(this.props.format)}</td>
        );
    }
};

export default TimeField;