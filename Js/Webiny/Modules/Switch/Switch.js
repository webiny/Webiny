import Webiny from 'Webiny';
import SwitchButton from './SwitchButton';

class Switch extends Webiny.Ui.FormComponent {

}

Switch.defaultProps = {
    renderer() {
        return (
            <div className="form-group">
                <label className="control-label">{this.props.label}</label>

                <div className="clearfix"></div>
                <SwitchButton valueLink={this.props.valueLink} disabled={this.props.disabled}/>
            </div>
        );
    }
};

export default Switch;
