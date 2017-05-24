import Webiny from 'Webiny';
import Field from './../Field';


class GravatarField extends Field {

}

GravatarField.defaultProps = _.merge({}, Field.defaultProps, {
    size: 48,
    renderer() {
        return (
            <td className={this.getTdClasses()}>
                <Webiny.Ui.Components.Gravatar hash={_.get(this.props.data, this.props.name)} size={this.props.size}/>
            </td>
        );
    }
});

export default GravatarField;