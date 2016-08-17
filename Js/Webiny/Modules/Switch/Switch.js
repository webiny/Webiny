import Webiny from 'Webiny';
import SwitchButton from './SwitchButton';
const Ui = Webiny.Ui.Components;

class Switch extends Webiny.Ui.FormComponent {

}

Switch.defaultProps = {
    renderer() {

        let label = null;
        if (this.props.label) {
            let tooltip = null;
            if(this.props.tooltop){
                tooltip = <Ui.Tooltip target={<Ui.Icon icon="icon-info-circle"/>}>{this.props.tooltop}</Ui.Tooltip>;
            }
            label = <label key="label" className="control-label">{this.props.label}{tooltip}</label>;
        }

        return (
            <div className="form-group">
                {label}

                <div className="clearfix"></div>
                <SwitchButton valueLink={this.props.valueLink} disabled={this.props.disabled}/>
            </div>
        );
    }
};

export default Switch;
