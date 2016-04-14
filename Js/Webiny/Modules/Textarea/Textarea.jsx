import Webiny from 'Webiny';

class Textarea extends Webiny.Ui.FormComponent {

    render() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            label = <label key="label" className="control-label">{this.props.label}</label>;
        }

        let validationMessage = null;

        if (this.state.isValid === false) {
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
        }

        const props = {
            onBlur: this.validate,
            disabled: this.props.disabled,
            className: 'form-control',
            value: this.props.valueLink.value || '',
            onChange: this.onChange,
            placeholder: this.props.placeholder,
            style: this.props.style
        };

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                <textarea {...props}/>
                {validationMessage}
            </div>
        );
    }
}

export default Textarea;