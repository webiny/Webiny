import BaseCheckboxGroup from './BaseCheckboxGroup';

class CheckboxGroup extends BaseCheckboxGroup {

    constructor(props) {
        super(props);
        this.bindMethods('renderLabel,renderValidationMessage');
    }

    renderLabel() {
        return this.props.renderLabel.call(this);
    }

    renderValidationMessage() {
        return this.props.renderValidationMessage.call(this);
    }
}

CheckboxGroup.defaultProps = _.merge({}, BaseCheckboxGroup.defaultProps, {
    disabledClass: 'disabled',
    renderLabel() {
        let label = null;
        if (this.props.label) {
            label = <label key="label" className="control-label">{this.props.label}</label>;
        }
        return label;
    },
    renderValidationMessage() {
        let validationMessage = null;
        if (this.state.isValid === false) {
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
        }
        return validationMessage;
    },
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        if (this.isDisabled()) {
            cssConfig[this.props.disabledClass] = true;
        }

        return (
            <div className={this.classSet(this.props.className)}>
                <div className={this.classSet(cssConfig)}>{this.renderLabel()}
                    <div className="clearfix"></div>
                    {this.getOptions()}
                </div>
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default CheckboxGroup;