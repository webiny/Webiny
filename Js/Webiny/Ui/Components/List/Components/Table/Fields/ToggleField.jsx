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

        const {ChangeConfirm, Switch} = this.props;

        if (this.props.message) {
            return (
                <td className={this.getTdClasses()}>
                    <ChangeConfirm message={this.props.message}>
                        <Switch {...props}/>
                    </ChangeConfirm>
                </td>
            );
        }

        return (
            <td className={this.getTdClasses()}>
                <Switch {...props}/>
            </td>
        );
    }
});

export default Webiny.createComponent(ToggleField, {modules: ['ChangeConfirm', 'Switch']});