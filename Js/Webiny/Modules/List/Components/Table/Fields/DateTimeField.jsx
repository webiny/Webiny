import Field from './../Field';

class DateTimeField extends Field {

}

DateTimeField.defaultProps = {
    format: 'YYYY-MM-DD HH:mm',
    renderer() {
        return (
            <td className={this.getTdClasses()}>{moment(_.get(this.props.data, this.props.name), moment.ISO_8601).format(this.props.format)}</td>
        );
    }
};

export default DateTimeField;