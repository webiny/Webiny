import BaseRadioGroup from './BaseRadioGroup';

class RadioGroup extends BaseRadioGroup {

    render() {
        const items = this.getOptions();
        const classes = this.classSet({'form-group': true, disabled: this.isDisabled()});

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
}

export default RadioGroup;