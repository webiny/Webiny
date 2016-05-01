import BaseRadioGroup from './BaseRadioGroup';

class RadioGroup extends BaseRadioGroup {

}

RadioGroup.defaultProps = {
    disabledClass: 'disabled',
    renderer() {
        const items = this.getOptions();
        const classes = {'form-group': true};
        if (this.isDisabled()) {
            classes[this.props.disabledClass] = true;
        }

        let validationMessage = null;
        if (this.state.isValid === false) {
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
        }

        let label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

        return (
            <div className={this.classSet(classes)}>
                {label}
                <div className="clearfix"></div>
                {items}
                {validationMessage}
            </div>
        );
    }
};

export default RadioGroup;