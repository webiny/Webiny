import Field from './../Field';

class DateTimeField extends Field {

}

DateTimeField.defaultProps = {
    format: 'YYYY-MM-DD HH:mm',
    renderer: function renderer() {
        return (
            <td className={this.getTdClasses()}>{moment(_.get(this.props.data, this.props.name)).format(this.props.format)}</td>
        );
    }
};

export default DateTimeField;