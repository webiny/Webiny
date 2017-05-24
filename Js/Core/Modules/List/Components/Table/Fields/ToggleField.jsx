import Webiny from 'Webiny';
import Field from './../Field';

class ToggleField extends Field {

}

ToggleField.defaultProps = _.merge({}, Field.defaultProps, {
    message: null,
    onChange: null,
    disabled: false,
    renderer() {
        const props = {
            onChange: newValue => {
                if (_.isNull(this.props.onChange)) {
                    const attributes = {};
                    _.set(attributes, this.props.name, newValue);
                    this.props.actions.update(this.props.data.id, attributes);
                } else {
                    this.props.onChange(newValue);
                }
            },
            value: _.get(this.props.data, this.props.name),
            disabled: _.isFunction(this.props.disabled) ? this.props.disabled(this.props.data) : this.props.disabled
        };

        if (this.props.message) {
            return (
                <td className={this.getTdClasses()}>
                    <Webiny.Ui.Components.ChangeConfirm message={this.props.message}>
                        <Webiny.Ui.Components.SwitchButton {...props}/>
                    </Webiny.Ui.Components.ChangeConfirm>
                </td>
            );
        }

        return (
            <td className={this.getTdClasses()}>
                <Webiny.Ui.Components.SwitchButton {...props}/>
            </td>
        );
    }
});

export default ToggleField;