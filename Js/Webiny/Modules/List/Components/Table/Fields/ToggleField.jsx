import Webiny from 'Webiny';
import Field from './../Field';


class ToggleField extends Field {

}

ToggleField.defaultProps = {
    onChange: null,
    renderer: function renderer() {
        const props = {
            onChange: newValue => {
                if (_.isNull(this.props.onChange)) {
                    const attributes = {};
                    _.set(attributes, this.props.name, newValue);
                    this.props.actions.update(this.props.data.id, attributes)();
                } else {
                    this.props.onChange(newValue);
                }
            },
            value: _.get(this.props.data, this.props.name),
            disabled: this.props.disabled
        };

        return (
            <td className={this.getTdClasses()}>
                <Webiny.Ui.Components.SwitchButton {...props}/>
            </td>
        );
    }
};

export default ToggleField;