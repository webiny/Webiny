import Webiny from 'Webiny';
import Field from './../Field';


class GravatarField extends Field {

}

GravatarField.defaultProps = _.merge({}, Field.defaultProps, {
    size: 48,
    renderer() {
        const {Gravatar} = this.props;
        return (
            <td className={this.getTdClasses()}>
                <Gravatar hash={_.get(this.props.data, this.props.name)} size={this.props.size}/>
            </td>
        );
    }
});

export default Webiny.createComponent(GravatarField, {modules: ['Gravatar']});