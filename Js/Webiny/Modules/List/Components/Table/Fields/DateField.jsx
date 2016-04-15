import Field from './../Field';

class DateField extends Field {

}

DateField.defaultProps = {
    format: 'YYYY-MM-DD',
    renderer: function renderer() {
        return (
            <td className={this.getTdClasses()}>{moment(_.get(this.props.data, this.props.name)).format(this.props.format)}</td>
        );
    }
};

export default DateField;