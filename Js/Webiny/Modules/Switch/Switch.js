import Webiny from 'Webiny';
import SwitchButton from './SwitchButton';
const Ui = Webiny.Ui.Components;

class Switch extends Webiny.Ui.FormComponent {

}

Switch.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    label: null,
    tooltip: null,
    renderer() {
        let label = null;
        if (this.props.label) {
            let tooltip = null;
            if (this.props.tooltip) {
                tooltip = <Ui.Tooltip target={<Ui.Icon icon="icon-info-circle"/>}>{this.props.tooltip}</Ui.Tooltip>;
            }
            label = <label key="label" className="control-label">{this.props.label} {tooltip}</label>;
        }

        const props = {
            value: this.props.value,
            onChange: this.props.onChange,
            disabled: this.isDisabled()
        };

        return (
            <div className="form-group">
                {label}
                <div className="clearfix"></div>
                <SwitchButton {...props}/>
            </div>
        );
    }
});

export default Switch;
