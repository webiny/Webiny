import Base from './Base';

class VerticalInput extends Base {

    render() {
        var {validationError, validationIcon, validationClass} = this.getValidationValues();

        var css = this.classSet('form-group', validationClass);
        var label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

        var textarea = <textarea onBlur={this.validate} disabled={this.props.disabled}
                                 className="form-control"
                                 valueLink={this.props.valueLink}
                                 placeholder={this.props.placeholder}
                                 style={this.props.style}
                                 ref="input"
            />;

        return (
            <div className={this.getComponentWrapperClass()}>
                <div className={css}>
                    {label}
                    {textarea}
                    {validationError}
                    {validationIcon}
                </div>
            </div>
        );
    }
}

export default VerticalInput;