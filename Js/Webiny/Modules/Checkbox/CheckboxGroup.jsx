import BaseCheckboxGroup from './BaseCheckboxGroup';

class CheckboxGroup extends BaseCheckboxGroup {
    constructor(props){
        super(props);
    }
}

CheckboxGroup.defaultProps = _.merge({}, BaseCheckboxGroup.defaultProps, {
    disabledClass: 'disabled',
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
                <div className={this.classSet(cssConfig)}>
                    {this.renderLabel()}
                    <div className="clearfix"></div>
                    {this.getOptions()}
                </div>
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default CheckboxGroup;