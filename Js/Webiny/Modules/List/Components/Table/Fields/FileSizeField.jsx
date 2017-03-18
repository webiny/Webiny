import filesize from 'filesize';
import Field from './../Field';

class FileSizeField extends Field {

}

FileSizeField.defaultProps = _.merge({}, Field.defaultProps, {
    options: {},
    renderer() {
        return (
            <td className={this.getTdClasses()}>{filesize(_.get(this.props.data, this.props.name), this.props.options)}</td>
        );
    }
});

export default FileSizeField;