import Webiny from 'Webiny';

class Switch extends Webiny.Ui.FormComponent {

}

Switch.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    label: null,
    tooltip: null,
    renderer() {
        const props = {
            value: this.props.value,
            onChange: this.props.onChange,
            disabled: this.isDisabled()
        };

        const {SwitchButton} = this.props;

        return (
            <div className="form-group">
                {this.renderLabel()}
                <div className="clearfix"/>
                <SwitchButton {...props}/>
                {this.renderDescription()}
            </div>
        );
    }
});

export default Webiny.createComponent(Switch, {modules: ['SwitchButton']});
